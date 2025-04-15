import { NextRequest, NextResponse } from "next/server";
import applicationModels from "@/model/application";
import { connect } from "@/db/db";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { applicationId, newStatus } = await request.json();

    if (!applicationId || !newStatus) {
      return NextResponse.json(
        { message: "applicationId and newStatus are required", success: false },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { message: "Invalid status", success: false },
        { status: 400 }
      );
    }

    // Update the application
    const updatedApplication = await applicationModels
      .findByIdAndUpdate(applicationId, { status: newStatus }, { new: true })
      .populate("applicant", "name email");

    if (!updatedApplication) {
      return NextResponse.json(
        { message: "Application not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Application status updated successfully",
        application: updatedApplication,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { message: "Server error", success: false },
      { status: 500 }
    );
  }
}
