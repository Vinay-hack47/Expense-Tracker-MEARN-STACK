import { query } from "express";
import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";
import { convertCurrency } from "../api/convertCurrency.api.js";

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
    });

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
