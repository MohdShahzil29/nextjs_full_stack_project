import { connect } from "@/db/db";
import companyModel from "@/model/company";
import jobModel from "@/model/job";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const company = await companyModel.findById(id);

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          message: "Company not found",
        },
        { status: 404 }
      );
    }

    const jobs = await jobModel.find({ company }).populate("company");

    return NextResponse.json(
      {
        success: true,
        message: "Jobs for selected company fetched successfully",
        company,
        jobs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in Selected Job API",
      },
      { status: 500 }
    );
  }
}
