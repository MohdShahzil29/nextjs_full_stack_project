import jobModel from "@/model/job";
import { connect } from "@/db/db";
import { NextResponse } from "next/server";
import "@/model/company";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connect();

  try {
    const { id: jobId } = await context.params;

    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 }
      );
    }

    const job = await jobModel.findById(jobId).populate("company");

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
