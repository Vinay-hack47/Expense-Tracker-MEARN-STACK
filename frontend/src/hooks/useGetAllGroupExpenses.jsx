import { setGroupExpenses } from "@/redux/groupExpenseSlice";
import axios from "axios";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux"

const useGetAllGroupExpenses = (groupId) => {
  const dispatch = useDispatch();
  const { groupExpenses } = useSelector((store) => store.groupExpense)
  // const {category, markAsDone} = useSelector(store => store.expense);
  // console.log(category);



  const fetchExpenses = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/group/expense/group/get/${groupId}`)

      if (res.data.success) {
        dispatch(setGroupExpenses(res.data.expenses));
        console.log(res.data.expenses);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [dispatch, groupId, groupExpenses]);

  return fetchExpenses; // <-- This is the change
};

export default useGetAllGroupExpenses