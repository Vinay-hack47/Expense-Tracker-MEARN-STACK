import { Group } from "../models/group.model.js";
import { Expense } from "../models/expense.model.js";
import { convertCurrency } from "../utils/convertCurrency.api.js";
import { sendEmailNotifications } from "../utils/sendEmail.js";
import { User } from "../models/user.model.js";

export const createGroupExpense = async (req, res) => {
  try {
    const { description, category, amount, originalCurrency } = req.body;
    if (!description || !category || !amount || !originalCurrency)
      return res
        .status(400)
        .json({ msg: "All fields are required", success: false });

    const userId = req.id;
    console.log(userId);

    const groupId = req.params.groupId;

    // Find the group and validate the user is part of it
    const group = await Group.findById(groupId).populate("members.userId");
    if (!group)
      return res.status(404).json({ msg: "Group not found", success: false });

    const isMember = group.members.some(
      (member) => member.userId._id.toString() === userId
      // console.log(member.userId._id.toString()),
      // console.log(userId)
    );

    if (!isMember)
      return res
        .status(403)
        .json({ msg: "You are not a member of this group", success: false });

    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ msg: "User not found", success: false });

    const convertedAmount = await convertCurrency(
      amount,
      originalCurrency,
      group.defaultCurrency
    );

    const expense = await Expense.create({
      description: description,
      category: category,
      amount: amount,
      userId: userId,
      originalCurrency: originalCurrency,
      convertedAmount: convertedAmount,
      groupId: groupId,
    });

    // if (groupId) {
    //   const group = await Group.findById(groupId).populate("members.userId");
    //   const admin = group.members.find((member) => member.role === "admin");
    //   const memberEmails = group.members
    //     .filter(
    //       (member) => member.userId.toString() !== admin.userId.toString()
    //     )
    //     .map((member) => member.userId.email);

    //   sendEmailNotifications(
    //     admin.userId.email,
    //     memberEmails,
    //     `New expense added to group: ${group.name}`
    //   );
    // }

    // Notify group members via email (except creator)
    const creator = group.members.find(
      (m) => m.userId._id.toString() === userId
    );
    console.log("expense creator-> ", creator);

    const memberEmails = group.members
      .filter((m) => m.userId._id.toString() !== userId)
      .map((m) => m.userId.email);
    console.log("members emails->", memberEmails);

    await sendEmailNotifications(
      // creator.userId.email,
      memberEmails,
      `New expense "${description}" added to group "${group.name}".`
    );

    return res
      .status(201)
      .json({ msg: "Group expense created", success: true, expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    const expenses = await Expense.find({ groupId: groupId })
      .populate("paidBy", "fullname email") 
      .sort({ createdAt: -1 }); 

    return res
      .status(200)
      .json({
        message: `${group.name} group expenses`,
        success: true,
        expenses,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
