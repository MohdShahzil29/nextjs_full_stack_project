import { connect } from "@/db/db";
import { NextResponse, NextRequest } from "next/server";
import userModel from "@/model/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest, response: NextResponse) {
  await connect();
  const { email, password, role } = await request.json();

  if (!email || !password || !role) {
    return NextResponse.json(
      { message: "Email, password, and role are required" },
      { status: 400 }
    );
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatchPassword = await bcrypt.hash(password, user.password);
    if (!isMatchPassword) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    if (user.role !== role) {
      return NextResponse.json({ message: "Role mismatch" }, { status: 403 });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      { message: "Login successful", token, user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
