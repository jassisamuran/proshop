import jwt from "jsonwebtoken";

const generateToken = (id) => {
  const token = "1234";
  return jwt.sign({ id }, token, { expiresIn: "30d" });
};
export default generateToken;
