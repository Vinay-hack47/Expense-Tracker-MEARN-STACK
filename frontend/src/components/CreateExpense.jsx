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
import { Loader2, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setExpenses } from '@/redux/expenseSlice';
import { useNavigate } from 'react-router-dom';


const CreateExpense = ({ groupId = null }) => {
  // const [open , setOpen] = useState(false);
  // console.log(open);



  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: "",
    category: "",
    originalCurrency: "",
    groupId: groupId || "",
  });

  useEffect(() => {
    if (groupId) {
      setExpenseData((prev) => ({ ...prev, groupId: groupId }))
    }
  }, [groupId])

  const navigate = useNavigate();

  const [groups, setGroups] = useState([]); // State to store the list of groups

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const { expenses } = useSelector(store => store.expense);
  const {allMyGroups} = useSelector(store => store.group);



  // Fetch groups for the logged-in user
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/group/getGroups`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setGroups(res.data.groups); // Set the fetched groups
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch groups");
      }
    };

    fetchGroups();
  }, []);  



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
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/create`, expenseData, {
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
      setExpenseData("");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg || error.response.data.message);
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)} className="cursor-pointer bg-green-600 text-white" ><Plus className="h-5 w-5" />Add New Expense</Button>
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
              <div className='flex items-center justify-between'>
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

                <Select onValueChange={(value) => setExpenseData({ ...expenseData, originalCurrency: value })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white  text-black shadow-lg backdrop:bg-black/50">
                    <SelectGroup className="cursor-pointer">
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {!groupId && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="groupId" className="text-right">Group</Label>
                  <Select
                    onValueChange={(value) =>
                      setExpenseData({ ...expenseData, groupId: value === "personal" ? "" : value })
                    }
                    value={expenseData.groupId || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Group (Optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black shadow-lg backdrop:bg-black/50">
                      <SelectGroup>
                        <SelectItem value="personal">Personal</SelectItem>
                        {allMyGroups.map((group) => (
                          <SelectItem key={group?._id} value={group?._id}>
                            {group?.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}



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
  );
}

export default CreateExpense
