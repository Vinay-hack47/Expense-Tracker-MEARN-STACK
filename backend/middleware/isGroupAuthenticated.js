import { JsonWebTokenError } from "jsonwebtoken";

export const isAuthenticated = async(req,res,next) =>{
  try {
    const groupToken = req.cookies.groupToken
    if(!groupToken) return res.status(401).json({msg:"Unauthorized Group"});
    console.log(groupToken);

    const decodedGroupToken = await JsonWebTokenError.verify(groupToken , process.env.SECRET_KEY);
    if(!decodedGroupToken) return res.status(401).json({msg:"Invalid groupToken"});
    console.log(decodedGroupToken);


    req.id = decode.groupId;
    next();

  } catch (error) {
    res.status(401).json({ message: "You are not Group Member" });
  }
}