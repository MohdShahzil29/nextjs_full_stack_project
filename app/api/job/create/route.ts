import jobModel from "@/model/job";
import { connect } from "@/db/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connect();

    // Parse request body
    const body = await request.json();
    const {
      title,
      description,
      requirements,
      salary,
      experienceLevel,
      location,
      jobType,
      position,
      company,
      created_by,
    } = body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !experienceLevel ||
      !location ||
      !jobType ||
      !position ||
      !company
    ) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Create new job document
    const newJob = await jobModel.create({
      title,
      description,
      requirements,
      salary,
      experienceLevel,
      location,
      jobType,
      position,
      company,
      created_by,
    });

    // Return success response
    return NextResponse.json(
      {
        message: "Job created successfully!",
        job: newJob,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
