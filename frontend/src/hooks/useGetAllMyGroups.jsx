import { setExpenses } from "@/redux/expenseSlice";
import { setAllMyGroups } from "@/redux/groupSlice";
import axios from "axios";
import { useEffect } from "react";

import  { useDispatch, useSelector } from "react-redux"

//todo Update your useGetAllMyGroups to return the fetch function so it can be called manually (e.g., after creating a group).

const useGetAllMyGroups = () => {
  const dispatch = useDispatch();

  const fetchAllMyGroups = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/group/my-groups`);
      if (res.data.success) {
        dispatch(setAllMyGroups(res.data.groups));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllMyGroups();
  }, [dispatch]);

  return fetchAllMyGroups; // <-- This is the change
};

export default useGetAllMyGroups;