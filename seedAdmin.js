import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin@arsurafactory.it";
  const password = "ArsBe/ViSac.?Q";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin già esistente");
    process.exit();
  }

  await User.create({
    email,
    password,
    role: "admin",
  });

  console.log("Admin creato con successo");
  process.exit();
}

createAdmin();
