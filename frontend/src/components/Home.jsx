import React from 'react'
import Navbar from './Navbar'
import CreateExpense from './CreateExpense'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDispatch } from 'react-redux'
import { setCategory, setMarkAsDone } from '@/redux/expenseSlice'
import ExpenseTable from './ExpenseTable'
import useGetExpenses from '@/hooks/useGetExpenses'
import GroupManagement from './GroupManagement'
import useGetAllMyGroups from '@/hooks/useGetAllMyGroups'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

const Home = () => {
  const fetchAllMyGroups = useGetAllMyGroups();
  useGetExpenses();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const changeCategoryHandler = (value) => {
    dispatch(setCategory(value));
  }
  const changeDoneHandler = (value) => {
    dispatch(setMarkAsDone(value));
  }

  return (
    <div>
      <Navbar></Navbar>
      <div className='max-w-6xl mx-auto mt-6'>
        <div className='flex items-center justify-between mb-5'>
          <h1 className='font-bold text-xl'>Expenses</h1>
          <div className="flex items-center gap-2">
            <CreateExpense />
            <Button
              onClick={() => navigate("/groups")}
              className="cursor-pointer bg-green-600 text-white"
            >
              <Plus className="h-5 w-5" /> Add New Group Expense
            </Button>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <h1 className='font-medium text-lg'>Filter By: </h1>
          <Select onValueChange={changeCategoryHandler}>
            <SelectTrigger className="w-[180px]">
              <SelectValue className="cursor-pointer" placeholder="Category" />
            </SelectTrigger>
            <SelectContent className=" bg-white text-black shadow-lg backdrop:bg-black/50">
              <SelectGroup className="cursor-pointer">
                <SelectItem className="cursor-pointer" value="rent">Rent</SelectItem>
                <SelectItem className="cursor-pointer" value="food">Food</SelectItem>
                <SelectItem className="cursor-pointer" value="salary">Salary</SelectItem>
                <SelectItem className="cursor-pointer" value="shopping">Shopping</SelectItem>
                <SelectItem className="cursor-pointer" value="all">All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={changeDoneHandler}>
            <SelectTrigger className="w-[180px]">
              <SelectValue className="cursor-pointer" placeholder="Mark As" />
            </SelectTrigger>
            <SelectContent className=" bg-white text-black shadow-lg backdrop:bg-black/50">
              <SelectGroup className="cursor-pointer">
                <SelectItem className="cursor-pointer" value="done">Done</SelectItem>
                <SelectItem className="cursor-pointer" value="undone">Undone</SelectItem>
                <SelectItem className="cursor-pointer" value="both">Both</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* <GroupManagement></GroupManagement> */}
        <ExpenseTable></ExpenseTable>
      </div>
    </div>
  )
}

export default Home
