// src/redux/groupExpenseSlice.js
import { createSlice } from "@reduxjs/toolkit";

const groupExpenseSlice = createSlice({
  name: "groupExpense",
  initialState: {
    groupExpenses: [],
    groupInfo: null,      // { name, members: [{ _id, name, email }], ... }
  },
  reducers: {
    setGroupExpenses(state, action) {
      state.groupExpenses = action.payload;
    },
    setGroupInfo(state, action) {
      state.groupInfo = action.payload;
    },
  },
});

export const { setGroupExpenses, setGroupInfo } = groupExpenseSlice.actions;
export default groupExpenseSlice.reducer;
