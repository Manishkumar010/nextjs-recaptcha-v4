import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const UserSchema = new mongoose.Schema({
  name: String, email: String, password: String
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function connect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
}

export async function POST(req) {
  try {
    await connect();
    const { name, email, password, token } = await req.json();

    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`;
    const { data } = await axios.post(verifyURL);

    if (!data.success || (data.score !== undefined && data.score < 0.5)) {
      return new Response(JSON.stringify({ message: "Bot detected" }), { status: 400 });
    }


    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return new Response(JSON.stringify({ message: "User registered", token: jwtToken }), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
  }
}
