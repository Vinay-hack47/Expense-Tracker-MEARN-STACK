import React from 'react'
import Logo from './shared/Logo'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';


const Navbar = () => {

  // const user = true;
  const {user} = useSelector(store => store.auth);
  const dispatch = useDispatch();

  // const navigate = useNavigate();

  const logoutHandler = async() =>{
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`);

      if(res.data.success){
        toast.success(res.data.msg)
        // navigate("/login");
        dispatch(setAuthUser(null));
      }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
      }
  }

  const profilePhoto = "https://avatar.iran.liara.run/public/boy"
  return (
    <div className='boarder-b border-gray-300'>
      <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
        <Logo></Logo>
        {
          user ? (
            <Popover>
              <PopoverTrigger>
                <Avatar className="cursor-pointer">
                  {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                  <AvatarImage src={profilePhoto} />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="bg-white">
                  <Button className="cursor-pointer"  variant="link" onClick={logoutHandler}>Logout</Button>
              </PopoverContent>
            </Popover>
          ) : (
            <div className='flex items-center gap-2'>
              <Link to="/login"><Button variant="outline" className=" hover:bg-green-500  cursor-pointer">Login</Button></Link>
              <Link to="/login"><Button variant="outline"  className=" hover:bg-green-500  cursor-pointer">Register</Button></Link>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Navbar
