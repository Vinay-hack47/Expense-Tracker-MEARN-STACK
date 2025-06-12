import axios from 'axios'
import React, { useState } from 'react'
import { toast } from "sonner"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import { setExpenses } from '@/redux/expenseSlice'
import Logo from "./shared/Logo"

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    email: "",
    password: ""
  });

  const changeHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`, userData, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      console.log(res.data);
      if (res.data.msg) {
        dispatch(setAuthUser(res.data.user))
        toast.success(res.data.msg);

        navigate("/");

        // Fetch expenses after login
        const expensesRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/getAll`, {
          withCredentials: true
        });

        if (expensesRes.data.success) {
          dispatch(setExpenses(expensesRes.data.expense));
        }
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center w-screen mt-30 gap-2'>
      <form onSubmit={submitHandler} className='flex flex-col p-4 bg-white w-[20%]'>
        <div className='w-full flex justify-center'>
          <Logo></Logo>
        </div>
          <h1 className='font-bold uppercase my-2 text-2xl flex justify-center'>Login</h1>
        <input onChange={changeHandler} type="text" placeholder='Email' name='email' value={userData.email} className='my-2 border border:gray-400 rounded-md px-2 py-1' />
        <input onChange={changeHandler} type="text" placeholder='Password' name='password' value={userData.password} className='my-2 border border:gray-400 rounded-md px-2 py-1' />
        <button type='sumbit' className='bg-gray-800  px-2 py-1 my-2 text-white cursor-pointer'>Login</button>
      </form>
      <p>Don't have an  Account ?  <Link to={"/register"} className='text-blue-600 font-medium'>Register</Link></p>
    </div>
  )
}

export default Login
