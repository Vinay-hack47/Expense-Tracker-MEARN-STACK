// src/pages/GroupExpensePage.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setGroupExpenses, setGroupInfo } from "@/redux/groupExpenseSlice";
import Navbar from "@/components/Navbar";
import CreateExpense from "@/components/CreateExpense";
// import GroupSummary from "@/components/GroupSummary";
import GroupExpenseTable from "../group/GroupExpenseTable";

const GroupExpensePage = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  // const { groupInfo, expenses } = useSelector(state => state.groupExpense);

  useEffect(() => {
    // 1. Fetch group details
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/group/${groupId}`, {
        withCredentials: true,
      })
      .then(res => {
        if (res.data.success) {
          dispatch(setGroupInfo(res.data.group));
        }
      })
      .catch(console.error);

    // 2. Fetch group expenses
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/group/${groupId}`, {
        withCredentials: true,
      })
      .then(res => {
        if (res.data.success) {
          dispatch(setGroupExpenses(res.data.expenses));
        }
      })
      .catch(console.error);
  }, [groupId, dispatch]);

  // if (!groupInfo) return null; // or a spinner

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-6">
        <h1 className="font-bold text-xl mb-4">Group: <p>Vinay</p></h1>
        <CreateExpense groupId={groupId} />
        {/* <GroupSummary /> */}
        <GroupExpenseTable />
      </div>
    </>
  );
};

export default GroupExpensePage;
