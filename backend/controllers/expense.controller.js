import { query } from "express";
import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";
import { convertCurrency } from "../utils/convertCurrency.api.js";
import {sendEmailNotifications} from "../utils/sendEmail.js"
import { Group } from "../models/group.model.js";

export const createExpense = async (req, res) => {
  try {
    const { description, category, amount, originalCurrency } = req.body;
    // if (!description || !category || !amount || originalCurrency)
    //   return res
    //     .status(400)
    //     .json({ msg: "All fields are required", success: false });

    const userId = req.id;

    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ msg: "User not found", success: false });

    const convertedAmount = await convertCurrency(
      amount,
      originalCurrency,
      user.defaultCurrency
    );
    
    
    const expense = await Expense.create({
      description: description,
      category: category,
      amount: amount,
      userId: userId,
      originalCurrency: originalCurrency,
      convertedAmount: convertedAmount,
      // groupId: groupId || null,
    });


    // if (groupId) {
    //   const group = await Group.findById(groupId).populate("members.userId");
    //   const admin = group.members.find((member) => member.role === "admin");
    //   const memberEmails = group.members
    //     .filter((member) => member.userId.toString() !== admin.userId.toString())
    //     .map((member) => member.userId.email);

    //   sendEmailNotifications(admin.userId.email, memberEmails, `New expense added to group: ${group.name}`);
    // }

    return res
      .status(201)
      .json({ msg: "Expense Created Successfully", success: true, expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllExpense = async (req, res) => {
  try {
    const userId = req.id;
 
    
    let category = req.query.category || "";
    const done = req.query.done || "";

    const query = {
      userId, // filter by userId
    };
    if (category.toLowerCase() === "all") {
      //no need to filter by userId
    } else {
      query.category = { $regex: category, $options: "i" };
    }

    if (done.toLowerCase() === "done") {
      query.done = true;
    } else if (done.toLowerCase() === "undone") {
      query.done = false; // filter for expense mark as pending (false)
    }

    const user = await User.findById(userId);
    const expense = await Expense.find(query);

    if (!expense || expense.length === 0) {
      return res.status(404).json({ msg: "No Expense Found", success: false });
    }
    return res.status(200).json({
      msg: `All Expenses of ${user.fullname}`,
      success: true,
      expense,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getGroupExpenses = async(req,res) =>{
  try {
    const groupId = req.paramas.groupId;
    const userId = req.id;

    //check if user is in group
    const group = await Group.findById(groupId).populate("members.userId")
    if (!group || !group.members.some(member => member.userId.toString() === userId)){
      return res.status(404).json({msg: "Not Group Member", success:false});
    }

    const expenses = await Expense.find({groupId: groupId}).sort({createdAt: -1});

    return res.status(200).json({msg: "Group Expenses", success:true, expenses});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

export const settleExpense = async (req, res) => {
  const expenseId = req.params.id;
  const userId = req.id;

  const expense = await Expense.findById(expenseId);
  if (!expense) return res.status(404).json({ success: false, msg: "Not found" });
  if (expense.paidBy.toString() !== userId) {
    return res.status(403).json({ success: false, msg: "Only payer can settle" });
  }

  expense.settled = true;
  await expense.save();
  return res.status(200).json({ success: true, msg: "Expense settled" });
};


export const markAsDoneOrUndone = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const done = req.body;
    const expense = await Expense.findByIdAndUpdate(expenseId, done, {
      new: true,
    });

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found", success: false });
    }

    return res
      .status(200)
      .json({
        msg: `Expense mark as ${expense.done ? "done" : "undone"}`,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const removeExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    await Expense.findByIdAndDelete(expenseId);

    return res
      .status(200)
      .json({ msg: "Expense removed successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { description, amount, category, originalCurrency } = req.body;
    const expenseId = req.params.id;

    // ✅ Filter out undefined fields
    const updatedData = {};
    if (description !== undefined) updatedData.description = description;
    if (amount !== undefined) updatedData.amount = amount;
    if (category !== undefined) updatedData.category = category;
    if (originalCurrency !== undefined)
      updatedData.originalCurrency = originalCurrency;

    // ❌ If no valid fields are provided, return an error
    if (Object.keys(updatedData).length === 0) {
      return res
        .status(400)
        .json({ msg: "No valid fields to update", success: false });
    }

    // const expense = await Expense.findByIdAndUpdate(expenseId , updatedData, {new:true});

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ msg: "Expense not found", success: false });
    }

    const user = await User.findById(req.id);
    if (amount !== undefined || originalCurrency !== undefined) {
      updatedData.convertedAmount = await convertCurrency(
        updatedData.amount || expense.amount,
        updatedData.originalCurrency || expense.originalCurrency,
        user.defaultCurrency
      );
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      updatedData,
      { new: true }
    );

    return res
      .status(200)
      .json({
        msg: "Expense updated successfully",
        success: true,
        expense: updatedExpense,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
