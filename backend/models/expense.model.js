import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    originalCurrency: {
      type: String,
      required: true,
    },
    convertedAmount: {
      type: Number,
    },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // Null for personal expenses
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    settled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);
