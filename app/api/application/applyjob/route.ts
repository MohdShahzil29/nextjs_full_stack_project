import { NextRequest, NextResponse } from "next/server";
import jobModel from "@/model/job";
import { connect } from "@/db/db";
import applicationModels from "@/model/application";
import userModel from "@/model/user";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const { jobId, applicantId } = await request.json();

    if (!jobId || !applicantId) {
      return NextResponse.json(
        { message: "Job ID and Applicant ID are required" },
        { status: 400 }
      );
    }

    const job = await jobModel.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    const applicant = await userModel.findById(applicantId);
    if (!applicant) {
      return NextResponse.json(
        { message: "Applicant not found" },
        { status: 404 }
      );
    }

    const existingApplication = await applicationModels.findOne({
      job: jobId,
      applicant: applicantId,
    });
    if (existingApplication) {
      return NextResponse.json(
        { message: "You have already applied for this job" },
        { status: 409 }
      );
    }

    const newApplication = new applicationModels({
      job: jobId,
      applicant: applicantId,
      status: "pending",
    });

    job.applications.push(newApplication._id);
    await newApplication.save();
    await job.save();

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application: newApplication,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error, please try again later" },
      { status: 500 }
    );
  }
}
