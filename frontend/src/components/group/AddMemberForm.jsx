// import { useState } from "react";
// import axios from "axios";

// const AddMemberForm = ({ groupId, onSuccess }) => {
//   const [email, setEmail] = useState("");

//   const handleAdd = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`/api/groups/${groupId}/add`, { email });
//       setEmail("");
//       onSuccess();
//     } catch (err) {
//       alert(err.response?.data?.msg || "Error adding member");
//     }
//   };

//   return (
//     <form onSubmit={handleAdd} className="mt-4 flex gap-2">
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="User email"
//         required
//         className="border p-2 rounded"
//       />
//       <button type="submit" className="bg-green-600 text-white px-4 rounded">
//         Add Member
//       </button>
//     </form>
//   );
// };

// export default AddMemberForm;




import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setMySingleGroup } from "@/redux/groupSlice";
import { toast } from "sonner";

const AddMemberForm = ({ groupId, onSuccess }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:8000/api/v1/group/${groupId}/add`,
        { email },
        { withCredentials: true }
      );
      if (res.data.success) {
        console.log(res.data);
        setEmail("");
        toast.success(res.data.msg);
        dispatch(setMySingleGroup(res.data.updatedGroup));
        onSuccess();
      }
    } catch (err) {
      toast.error(err?.response?.data?.msg );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-grow">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter member's email address"
          required
          className="w-full pr-4 focus:ring-black focus:border-black"
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        className="bg-black hover:bg-gray-800 text-white cursor-pointer"
        disabled={loading || !email.trim()}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Adding...</span>
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-5 w-5" />
            <span>Add Member</span>
          </>
        )}
      </Button>
    </form>
  );
};

export default AddMemberForm;