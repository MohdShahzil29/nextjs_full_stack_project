import jobModel from "@/model/job";
import { connect } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import "@/model/company";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Recruiter ID is required" },
        { status: 400 }
      );
    }

    const jobs = await jobModel.find({ created_by: id }).populate("company");

    if (jobs.length === 0) {
      return NextResponse.json(
        { message: "No jobs found for this Recruiter" },
        { status: 404 }
      );
    }
    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching jobs:", error); // Log any errors
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
