import express from "express"
import { createExpense, getAllExpense, markAsDoneOrUndone, removeExpense, updateExpense, getGroupExpenses, settleExpense } from "../controllers/expense.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();


router.route("/create").post(isAuthenticated, createExpense);
router.route("/getAll").get(isAuthenticated,getAllExpense);
router.route("/remove/:id").delete(isAuthenticated,removeExpense);
router.route("/update/:id").put(isAuthenticated,updateExpense);
router.route("/:id/done").put(isAuthenticated,markAsDoneOrUndone);
router.get("/expense/group/:groupId", getGroupExpenses);
router.put("/expense/:id/settle", settleExpense);

export default router