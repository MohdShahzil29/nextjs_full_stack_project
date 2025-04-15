import companyModel from "@/model/company";
import userModel from "@/model/user";
import { connect } from "@/db/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  await connect();
  try {
    const body = await request.json();
    const { title, description, location, website, logo } = body;
    if (!title || !description || !location) {
      return NextResponse.json(
        { message: "Title, description, and location are required" },
        { status: 400 }
      );
    }

    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const company = await companyModel.create({
      title,
      description,
      location,
      website,
      logo,
      userId: user._id,
    });
    return NextResponse.json(
      {
        message: "Company created successfully",
        company: {
          id: company._id,
          title: company.title,
          description: company.description,
          location: company.location,
          website: company.website,
          logo: company.logo,
          userId: company.userId,
        },
      },
      { status: 201 }
    );
  } catch (error:any) {
    console.error("Error details:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message }, // Include the error message
      { status: 500 }
    );
  }
}
