// src/components/GroupExpenseTable.jsx
import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter
} from "@/components/ui/table";


import { Trash } from "lucide-react";
import UpdateExpense from "./UpdateExpense";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { setGroupExpenses } from "@/redux/groupExpenseSlice";

const GroupExpenseTable = () => {
  const dispatch = useDispatch();
  const { groupExpenses } = useSelector(s => s.groupExpense);
  const {mySingleGroup} = useSelector((store) => store.group);
  const { user } = useSelector(s => s.auth);
  const [settled, setSettled] = useState({});

  const memberCount = mySingleGroup.members.length;
  const total = groupExpenses.reduce((sum, e) => sum + e.amount, 0);
  console.log(total);
  

  const deleteHandler = async id => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setGroupExpenses(groupExpenses.filter(e => e._id !== id)));
        toast.success(res.data.msg);
      }
    } catch (e) {
      toast.error(e.response?.data?.msg || "Error deleting");
    }
  };

  const settleHandler = async expenseId => {
    // toggle settled state in backend
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/${expenseId}/settle`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setSettled(s => ({ ...s, [expenseId]: true }));
        toast.success("Expense settled");
      }
    } catch {
      toast.error("Could not settle");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Settle</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Per Person</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {groupExpenses.map(exp => {
          const isPayer = exp.paidBy === user._id;
          const share = (exp.amount / memberCount).toFixed(2);
          return (
            <TableRow key={exp._id}>
              <TableCell>
                <Checkbox
                  disabled={!isPayer || settled[exp._id]}
                  checked={!!settled[exp._id]}
                  onCheckedChange={() => settleHandler(exp._id)}
                />
              </TableCell>
              <TableCell>{exp.description}</TableCell>
              <TableCell>₹{exp.amount}</TableCell>
              <TableCell>₹{share}</TableCell>
              <TableCell>{exp.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right">
                {isPayer || user.role === "admin" ? (
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="icon"
                      onClick={() => deleteHandler(exp._id)}
                      variant="outline"
                    >
                      <Trash />
                    </Button>
                    <UpdateExpense expenseId={exp._id} />
                  </div>
                ) : null}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="font-bold text-lg">
            Total
          </TableCell>
          <TableCell className="font-bold text-lg">₹{total}</TableCell>
          <TableCell colSpan={2} />
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default GroupExpenseTable;
