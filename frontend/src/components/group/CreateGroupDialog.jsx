import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UsersRound, Loader2, PlusCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";


const CreateGroupDialog = ({ onCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/api/v1/group/create", { name: groupName }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res?.data?.success) {
        // onCreated(); // Refresh group list
        toast.success(res.data.msg);
        setGroupName("");
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.msg || "Failed to create group. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          <span>Create New Group</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="bg-green-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <UsersRound className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl font-bold">Create New Group</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Enter a memorable name for your group"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={loading || !groupName.trim()}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;