import { connect } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import userModel from "@/model/user";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const body = await request.json();
    const { bio, skills, study, experience, location } = body;
    console.log("Request body:", body);

    // Validate required fields
    if (!bio || !skills || !study || !experience || !location) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    console.log("Auth header", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let decoded: any;
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not set in environment");
      }
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (err: any) {
      console.error("JWT verification failed", err);
      return NextResponse.json(
        { message: "Invalid token", error: err.message },
        { status: 401 }
      );
    }

    const userId = decoded.id || decoded._id;
    const updatedUser = await userModel.findById(userId);
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    updatedUser.profile.bio = bio;
    updatedUser.profile.skills = skills;
    updatedUser.profile.study = study;
    updatedUser.profile.experience = experience;
    updatedUser.profile.location = location;

    
    await updatedUser.save();
    console.log("User saved!");

    return NextResponse.json(
      { message: "Profile updated successfully", updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
