import React, { useState } from 'react'
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
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setExpenses } from '@/redux/expenseSlice';
import { useNavigate } from 'react-router-dom';


const CreateExpense = () => {
  // const [open , setOpen] = useState(false);
  // console.log(open);


  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: "",
    category: "",
  });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const {expenses} = useSelector(store => store.expense)


  const changeHandler = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value })
  }

  const categoryHandler = (value) => {
    setExpenseData({ ...expenseData, category: value })
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post(`${import.meta.env.BACKEND_URL}/api/v1/expense/create`, expenseData, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(setExpenses([...expenses, res.data.expense]))
        toast.success(res.data.msg)
        setIsOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
      navigate("/login")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)} className="cursor-pointer" variant="outline">Add New Expense</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white text-black shadow-lg backdrop:bg-black/30 z-[50]">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Create Expense to here. Click add when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Description
                </Label>
                <Input onChange={changeHandler} name="description" value={expenseData.description} id="description" placeholder="description" className="col-span-3 " />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Amount
                </Label>
                <Input onChange={changeHandler} name="amount" value={expenseData.amount} id="amount" placeholder="xxx in ₹" className="col-span-3" />
              </div>
              <div>
                <Select onValueChange={categoryHandler}>
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
                    <Button className="cursor-pointer" type="submit">Add</Button>
                  )
              }
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateExpense
