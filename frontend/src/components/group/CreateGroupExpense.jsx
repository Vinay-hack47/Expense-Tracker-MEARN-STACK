import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setGroupExpenses } from '@/redux/groupExpenseSlice';
import useGetAllGroupExpenses from '@/hooks/useGetAllGroupExpenses';

const CreateGroupExpense = ({ groupId, onCreate }) => {
  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: "",
    category: "",
    originalCurrency: "",
    paidBy: "",
  });
  

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { mySingleGroup } = useSelector((store) => store.group);


  const changeHandler = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  const categoryHandler = (value) => {
    setExpenseData({ ...expenseData, category: value });
  };

  const currencyHandler = (value) => {
    setExpenseData({ ...expenseData, originalCurrency: value });
  };

  const paidByHandler = (value) => {
    setExpenseData({ ...expenseData, paidBy: value });
  };

  const resetForm = () => {
    setExpenseData({
      description: "",
      amount: "",
      category: "",
      originalCurrency: "",
      paidBy: "",
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/group/expense/group/create/${groupId}`, expenseData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setGroupExpenses(res.data.expense))
        onCreate();
        resetForm();
        setIsOpen(false);
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-green-600 text-white shadow-md flex items-center gap-2 px-6 py-2 font-medium cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="h-5 w-5" />
          <span>Create Group Expense</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white text-black shadow-lg">
        <DialogHeader>
          <DialogTitle>Create Group Expense</DialogTitle>
          <DialogDescription>
            Add a new expense for this group. Click create when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              name="description"
              value={expenseData.description}
              onChange={changeHandler}
              placeholder="Enter description"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={expenseData.amount}
              onChange={changeHandler}
              placeholder="Enter amount"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Paid By
            </Label>
            <div className="col-span-3">
              <Select onValueChange={paidByHandler} value={expenseData.paidBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black shadow-lg">
                  <SelectGroup>
                    {mySingleGroup?.members?.map((member) => (
                      <SelectItem key={member?.userId?._id} value={member?.userId?._id}>
                        {member?.userId?.fullname}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Select onValueChange={categoryHandler} value={expenseData.category}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-lg">
                <SelectGroup>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select onValueChange={currencyHandler} value={expenseData.originalCurrency}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-lg">
                <SelectGroup>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          {isLoading ? (
            <Button className="w-full" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </Button>
          ) : (
            <Button
              className="cursor-pointer bg-black text-white hover:bg-gray-800"
              onClick={submitHandler}
            >
              Create Expense
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupExpense;