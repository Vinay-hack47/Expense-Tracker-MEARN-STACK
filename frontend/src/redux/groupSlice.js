import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
  name: "group",
  initialState: {
    allMyGroups: [],
    mySingleGroup: null
  },
  reducers:{
    //actions
    setAllMyGroups:(state, actions) => {
      state.allMyGroups = actions.payload;
    },
    setMySingleGroup:(state, actions) =>{
      state.mySingleGroup = actions.payload;
    },
  }
})

export const {setAllMyGroups} = groupSlice.actions;
export const {setMySingleGroup} = groupSlice.actions;
export default groupSlice.reducer;