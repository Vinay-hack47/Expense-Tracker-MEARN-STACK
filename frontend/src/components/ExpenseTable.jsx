import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDispatch, useSelector } from "react-redux"
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Edit2, Trash } from "lucide-react";
import UpdateExpense from "./UpdateExpense";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { setExpenses } from "@/redux/expenseSlice";


const ExpenseTable = () => {
  const { expenses } = useSelector(store => store.expense);
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  // const [localExpense, setLocalExpense] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  const totalAmount = expenses.reduce((acc, expense) => {
    if (!checkedItems[expense._id]) {
      return acc + expense.amount;
    }
    return acc;
  }, 0);

  const deleteHandler = async (expenseId) => {
    console.log(expenseId);
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/remove/${expenseId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      })
      if (res.data.success) {
        toast.success(res.data.msg)
        //update the local state
        const updatedExpenses = expenses.filter((v) => v._id !== expenseId)
        dispatch(setExpenses(updatedExpenses));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg)
    }
  }


  const handleCheckboxChange = async (expenseId) => {
    const newStatus = !checkedItems[expenseId];
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/${expenseId}/done`, { done: newStatus }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.msg)
        setCheckedItems((prevData) => ({
          ...prevData,
          [expenseId]: newStatus
        }));
        //optionally update the local state for expense id the entire object needs update

        const vinay = (expenses.map(exp => exp._id === expenseId ? {...exp, done:newStatus}:exp));
        dispatch(setExpenses(vinay));
      };
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg)
    }
  }

  return (
    <Table>
      <TableCaption>A list of your recent expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Mark As Done</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.length === 0  && !user ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              Add Your First Expense
            </TableCell>
          </TableRow>
        ) :
          expenses?.map((expense) => (
            <TableRow key={expense._id}>
              <TableCell className="font-medium">
                <Checkbox
                className="cursor-pointer"
                  checked={checkedItems[expense._id] ?? expense.done}
                  onCheckedChange={() => handleCheckboxChange(expense._id)} />
                
              </TableCell>
              <TableCell className={`${expense.done ? "line-through" : ""}`}>{expense.description}</TableCell>
              <TableCell  className={`${expense.done ? "line-through" : ""}`}>{expense.amount}</TableCell>
              <TableCell  className={`${expense.done ? "line-through" : ""}`}>{expense.category}</TableCell>
              <TableCell  className={`${expense.done ? "line-through" : ""}`}>{expense.createdAt?.split("T")[0]}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button onClick={() => deleteHandler(expense._id)} size="icon" className="cursor-pointer rounded-full border text-red-600 border-red-600 hover:border-transparent" variant="outline"><Trash></Trash></Button>
                  <UpdateExpense expenseId={expense._id}></UpdateExpense>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5} className="font-bold text-xl">Total</TableCell>
          <TableCell className="text-right font-bold text-xl">{totalAmount} ₹</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default ExpenseTable

