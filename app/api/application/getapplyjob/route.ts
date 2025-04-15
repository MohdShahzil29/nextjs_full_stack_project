import { NextRequest, NextResponse } from "next/server";
import jobModel from "@/model/job";
import { connect } from "@/db/db";
import applicationModels from "@/model/application";
import userModel from "@/model/user";

export async function GET(request: NextRequest) {
  try {
    // Connect to DB
    await connect();

    // Get user ID from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find applications by this user and populate the job details
    const applications = await applicationModels
      .find({ applicant: userId })
      .populate({
        path: "job",
        model: jobModel,
        populate: { path: "created_by", model: userModel, }, 
      });

    const appliedJobs = applications.map((app) => ({
      applicationId: app._id,
      status: app.status,
      job: app.job,
    }));

    return NextResponse.json({ success: true, appliedJobs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
