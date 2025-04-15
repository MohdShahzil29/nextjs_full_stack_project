import userModel from "@/model/user";
import { connect } from "@/db/db";
import { NextResponse, NextRequest } from "next/server";
import companyModel from "@/model/company";

export async function GET(request: NextRequest, response: NextResponse) {
  await connect();
  try {
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

    // Assuming that companyModel has a userId field to associate companies with users
    const companies = await companyModel.find({ userId: userId });

    if (companies.length === 0) {
      return NextResponse.json(
        { message: "No companies found for this user" },
        { status: 404 }
      );
    }

    // Return the companies in the response
    return NextResponse.json({
      message: "Companies fetched successfully",
      companies: companies.map((company) => ({
        id: company._id,
        title: company.title,
        description: company.description,
        location: company.location,
        website: company.website,
        logo: company.logo,
        userId: company.userId,
      })),
      status: 200,
    });
  } catch (error: any) {
    console.error("Error details:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
