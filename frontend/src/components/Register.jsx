import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner"
import Logo from './shared/Logo';

const Register = () => {

  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    password: '',
  })
  


  const changeHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }


  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`, userData,{
        headers: {
          'Content-Type': 'application/json',
          },
          withCredentials:true
      });

      if(res.data.success){
        toast.success(res.data.msg);
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg)
    }
  }


  return <>
    <div className='flex flex-col items-center justify-center w-screen mt-30 gap-2'>
      <form onSubmit={submitHandler} className='flex flex-col p-4 shadow-lg w-[20%]'>
    <div className='w-full flex justify-center '>
      <Logo></Logo>
    </div>
        <h1 className='font-bold uppercase my-2 text-2xl text-center'>Signup</h1>
        <input onChange={changeHandler} type="text" placeholder='Name' name='fullname' value={userData.name} className='my-2 border border:gray-400 rounded-md px-2 py-1' />
        <input onChange={changeHandler} type="text" placeholder='Email' name='email' value={userData.email} className='my-2 border border:gray-400 rounded-md px-2 py-1' />
        <input onChange={changeHandler} type="text" placeholder='Password' name='password' value={userData.password} className='my-2 border border:gray-400 rounded-md px-2 py-1' />
        <button type='submit' className='bg-gray-800  px-2 py-1 my-2 text-white cursor-pointer'>SignUp</button>
      </form>
      <p>Already have an Account ?  <Link to={"/login"} className='text-blue-600 font-medium'>Login</Link></p>
    </div>
  </>
}

export default Register
