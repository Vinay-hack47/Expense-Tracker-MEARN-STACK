
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";  // Ensure the path is correct
import { Button } from './ui/button';
import { Label } from "@/components/ui/label";
import { Input } from './ui/input';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from 'axios';
import { toast } from 'sonner';
import { Edit2, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setExpenses } from '@/redux/expenseSlice';


const UpdateExpense = ({ expenseId }) => {
  console.log(expenseId);

  const dispatch = useDispatch();
  const { expenses, singleExpense } = useSelector(store => store.expense)

  const [updatedData, setUpdatedData] = useState({
    description: "",
    amount: "",
    category: "",
  });
  console.log(updatedData);


  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && expenseId) {
      const expense = expenses.find((exp) => exp._id === expenseId);
      if (expense) {
        setUpdatedData({
          description: expense.description || "",
          amount: expense.amount || "",
          category: expense.category || "",
        });
      }
    }
  }, [isOpen, expenseId, expenses]);



  const changeHandler = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value })
  }

  const categoryHandler = (value) => {
    setUpdatedData({ ...updatedData, category: value })
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.put(`${import.meta.env.BACKEND_URL}/api/v1/expense/update/${expenseId}`, updatedData, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      console.log(res.data);


      if (res.data.success) {
        dispatch(setExpenses(expenses.map(exp => exp._id === expenseId ? res.data.expense : exp)))
        toast.success(res.data.msg)
        setIsOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)} className="cursor-pointer rounded-full border text-green-600 border-green-600 hover:border-transparent" variant="outline"><Edit2></Edit2></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white text-black shadow-lg backdrop:bg-black/30 z-[50]">
          <DialogHeader>
            <DialogTitle>Update Expense</DialogTitle>
            <DialogDescription>
              Update Expense to here. Click update when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Description
                </Label>
                <Input onChange={changeHandler} name="description" value={updatedData.description} id="description" placeholder="description" className="col-span-3 " />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Amount
                </Label>
                <Input onChange={changeHandler} name="amount" value={updatedData.amount} id="amount" placeholder="xxx in ₹" className="col-span-3" />
              </div>
              <div>
                <Select value={updatedData.category} onValueChange={categoryHandler}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue className="cursor-pointer" placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className=" bg-white text-black shadow-lg backdrop:bg-black/50">
                    <SelectGroup className="cursor-pointer">
                      <SelectItem className="cursor-pointer" value="rent">Rent</SelectItem>
                      <SelectItem className="cursor-pointer" value="food">Food</SelectItem>
                      <SelectItem className="cursor-pointer" value="salary">Salary</SelectItem>
                      <SelectItem className="cursor-pointer" value="shopping">Shopping</SelectItem>
                      <SelectItem className="cursor-pointer" value="others">Others</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              {
                isLoading ? (
                  <Button className="w-full my-4">
                    <Loader2 className='mr-2 h-4 animate-spin'>Please wait...</Loader2>
                  </Button>
                )
                  :
                  (
                    <Button className="cursor-pointer" type="submit">Update</Button>
                  )
              }
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpdateExpense
