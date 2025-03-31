import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log("Auth Token:", token);

    if (!token) {
      return res.status(400).json({ msg: "User not authenticated" });
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log("Decoded Token:", decode);

    if (!decode) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};
