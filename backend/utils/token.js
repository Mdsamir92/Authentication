import jwt from "jsonwebtoken";

const genToken = (userId) => {

  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    return token;
  } catch (error) {
    console.error("JWT generation error:", error);
    return null; // return null if token generation fails
  }
};

export default genToken;


