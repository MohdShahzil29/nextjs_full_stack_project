import jobModel from "@/model/job";
import { connect } from "@/db/db";
import { NextResponse, NextRequest } from "next/server";
import "@/model/company";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const getJob = await jobModel.find({}).populate("company");

    if (getJob.length === 0) {
      return NextResponse.json({
        message: "No Job Found",
      });
    }

    return NextResponse.json({
      message: "Job found successfully",
      jobs: getJob,
    });
  } catch (error: any) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
