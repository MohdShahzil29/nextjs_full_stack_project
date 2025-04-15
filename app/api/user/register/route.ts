import { connect } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import userModel from "@/model/user";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest, response: NextResponse) {
  await connect();
  try {
    const body = await request.json();
    const { name, email, password, role, phoneNumber } = body;

    // Validate required fields
    if (!name || !email || !password || !role || !phoneNumber) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        { status: 400 }
      );
    }

    // Initialize profilePhotoUrl.
    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 401 }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashPassword,
      role,
      phoneNumber,
      profile: {
        bio: "",
        skills: [],
        study: "",
        experience: [],
        location: "",
      },
    });

    await newUser.save();

    return NextResponse.json({ newUser }, { status: 200 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
