import { NextRequest, NextResponse } from "next/server";
import jobModel from "@/model/job";
import applicationModels from "@/model/application";
import { connect } from "@/db/db";
import "@/model/application";

export async function GET(request: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { message: "jobId is required", success: false },
        { status: 400 }
      );
    }

    const job = await jobModel.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return NextResponse.json(
        { message: "Job not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ job, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error fetching job applicants:", error);
    return NextResponse.json(
      { message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
