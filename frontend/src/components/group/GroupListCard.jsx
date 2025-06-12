// components/group/GroupListCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMySingleGroup } from "@/redux/groupSlice";

const GroupListCard = ({ group }) => {
  const memberCount = group.members?.length || 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleViewGroup = () => {
    dispatch(setMySingleGroup(group));
    navigate(`/groups/${group?._id}`)
  }

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition duration-300">
      <CardContent className="p-4 flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{group.name}</h2>
        <p className="text-sm text-muted-foreground">{memberCount} members</p>
        <Button variant="outline" className="mt-2 w-full" onClick={handleViewGroup}>
          View Group
        </Button>
      </CardContent>
    </Card>
  );
};

export default GroupListCard;
