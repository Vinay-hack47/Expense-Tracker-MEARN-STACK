// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import AddMemberForm from "./AddMemberForm";

// const GroupDetails = () => {
//   const { groupId } = useParams();
//   const [group, setGroup] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const userId = localStorage.getItem("userId"); // Or get from Redux/auth context

//   const fetchGroup = async () => {
//     try {
//       const res = await axios.get(`/api/groups/${groupId}`);
//       setGroup(res.data.group);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchGroup();
//   }, [groupId]);

//   const isAdmin = group?.members.find(
//     (m) => m.userId._id === userId && m.role === "admin"
//   );

//   const handleRemove = async (memberId) => {
//     try {
//       await axios.delete(`/api/groups/${groupId}/remove/${memberId}`);
//       fetchGroup();
//     } catch (err) {
//       alert("Error removing member");
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Group: {group.name}</h1>

//       <ul className="mb-4">
//         {group.members.map((m) => (
//           <li key={m.userId._id} className="flex items-center gap-4">
//             <span>{m.userId.name} ({m.role})</span>
//             {isAdmin && m.userId._id !== userId && (
//               <button
//                 onClick={() => handleRemove(m.userId._id)}
//                 className="text-red-600 hover:underline"
//               >
//                 Remove
//               </button>
//             )}
//           </li>
//         ))}
//       </ul>

//       {isAdmin && <AddMemberForm groupId={groupId} onSuccess={fetchGroup} />}

//       <button
//         className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
//         onClick={() => navigate(`/expenses/group/${groupId}`)}
//       >
//         View Group Expenses
//       </button>
//     </div>
//   );
// };

// export default GroupDetails;




import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AddMemberForm from "./AddMemberForm";
import { Loader2, Crown, User, UserMinus, Receipt, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { setMySingleGroup } from "@/redux/groupSlice";
import { toast } from "sonner";
import { useEffect } from "react";
import CreateGroupDialog from "./CreateGroupExpense";
import CreateGroupExpense from "./CreateGroupExpense";
import useGetAllGroupExpenses from "@/hooks/useGetAllGroupExpenses";
import { setGroupExpenses } from "@/redux/groupExpenseSlice";
import useGetAllMyGroups from "@/hooks/useGetAllMyGroups";

const GroupDetails = () => {
  const { groupId } = useParams();
  // useGetAllGroupExpenses(groupId);
  const fetchExpenses = useGetAllGroupExpenses(groupId);

  // const [group, setGroup] = useState(null);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { mySingleGroup } = useSelector((state) => state.group);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  const isAdmin = mySingleGroup?.members.find(
    (m) => m.userId._id === user?._id && m.role === "admin"
  );

  const fetchGroup = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/group/${groupId}`, {
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setMySingleGroup(res.data.group));
      }
    } catch (error) {
      console.error(error);
    }
  }


  const handleRemove = async (memberId) => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/group/${groupId}/remove/${memberId}`, {
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.msg);
        dispatch(setMySingleGroup(res.data.updatedGroup));
        // fetchAllMyGroups();
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error removing member");
    }
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-white p-6 flex items-center justify-center">
  //       <div className="flex flex-col items-center space-y-4">
  //         <Loader2 className="h-12 w-12 text-black animate-spin" />
  //         <p className="text-gray-600 font-medium">Loading group details...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 mb-4 hover:bg-gray-100"
            onClick={() => {
              navigate('/groups'),
              dispatch(setGroupExpenses([]))
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Groups</span>
          </Button>
        </div>

        {/* Group Info Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          <div className="p-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{mySingleGroup?.name}</h1>
              <div className="flex items-center gap-2 text-gray-500">
                <User className="h-4 w-4" />
                <span>{mySingleGroup?.members?.length} {mySingleGroup?.members?.length === 1 ? 'member' : 'members'}</span>
              </div>
            </div>

            {/* <Button
              className="bg-black text-white hover:bg-gray-800 shadow-md flex items-center gap-2 px-6 py-2 font-medium cursor-pointer"
              onClick={() => navigate(`/create-expense/${groupId}`)}
            >
              <Plus className="h-5 w-5" />
              <span>Create Group Expense</span>
            </Button> */}
            <CreateGroupExpense onCreate={fetchExpenses} groupId={groupId}></CreateGroupExpense>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Members</h2>

            {mySingleGroup?.members?.length === 0 ? (
              <p className="text-gray-500">No members in this group yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {mySingleGroup.members.map((member) => (
                  <li
                    key={member?.userId?._id}
                    className="py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 rounded-full p-2 w-10 h-10 flex items-center justify-center">
                        {member.role === "admin" ? (
                          <Crown className="h-5 w-5 text-black" />
                        ) : (
                          <User className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member?.userId?.fullname}</span>
                          {member?.role === "admin" && (
                            <Badge className="bg-black text-white">Admin</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{member?.userId?.email}</p>
                      </div>
                    </div>

                    {isAdmin && member?.userId?._id !== user?._id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(member?.userId?._id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                      >
                        <UserMinus className="h-4 w-4 " />
                        <span>Remove</span>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add Member Form */}
          {isAdmin && (
            <div className="border-t border-gray-200 p-6">
              <h3 className="text-lg font-medium mb-4">Add New Member</h3>
              <AddMemberForm groupId={groupId} onSuccess={fetchGroup} />
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button
            className="bg-black text-white hover:bg-gray-800 shadow-md flex items-center gap-2"
            onClick={() => navigate(`/expenses/group/${groupId}`)}
          >
            <Receipt className="h-5 w-5" />
            <span>View Group Expenses</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;



