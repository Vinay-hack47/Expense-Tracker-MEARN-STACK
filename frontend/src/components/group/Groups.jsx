// pages/groups/Groups.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import CreateGroupDialog from "./CreateGroupDialog";
import GroupListCard from "./GroupListCard";
import Navbar from "../Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setAllMyGroups } from "@/redux/groupSlice";
import store from "@/redux/store";
import useGetAllMyGroups from "@/hooks/useGetAllMyGroups";

const Groups = () => {
   const fetchAllMyGroups = useGetAllMyGroups(); // now a callable function
  const dispatch = useDispatch();
  const {allMyGroups} = useSelector((store) => store.group)
  
  const [groups, setGroups] = useState([]);
  
  const [loading, setLoading] = useState(false);


  return (
    <div>
      <Navbar></Navbar>
      <div className="p-6 space-y-6 mt-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Groups</h1>
          <CreateGroupDialog  onCreated={fetchAllMyGroups} />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : allMyGroups?.length == 0 ? (
          <p>No groups found. Create one!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allMyGroups?.map((group) => (
              <GroupListCard key={group._id} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
