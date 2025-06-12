import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/group/getGroups`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setGroups(res.data.groups);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch groups");
      }
    };

    fetchGroups();
  }, []);

  const createGroupHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/group/create`,
        { name: groupName, members },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.msg);
        setGroups([...groups, res.data.group]);
        setGroupName("");
        setMembers([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create group");
    }
  };

  const addMemberHandler = async (groupId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/group/addMember`,
        { groupId, memberId: newMember },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.msg);
        setGroups(
          groups.map((group) =>
            group._id === groupId ? { ...group, members: res.data.group.members } : group
          )
        );
        setNewMember("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add member");
    }
  };

  return (
    <div>
      <h1>Group Management</h1>
      <div>
        <h2>Create Group</h2>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button onClick={createGroupHandler}>Create Group</button>
      </div>

      <div>
        <h2>Your Groups</h2>
        {groups.map((group) => (
          <div key={group._id}>
            <h3>{group.name}</h3>
            <ul>
              {group.members.map((member) => (
                <li key={member.userId}>{member.userId}</li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Add Member (User ID)"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
            />
            <button onClick={() => addMemberHandler(group._id)}>Add Member</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupManagement;