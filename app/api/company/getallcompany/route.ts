import { connect } from "@/db/db";
import { NextResponse, NextRequest } from "next/server";
import companyModel from "@/model/company";

export async function GET(request: NextRequest) {
  await connect();
  try {
    const getCompany = await companyModel.find({});
    if (!getCompany) {
      return NextResponse.json({
        success: false,
        message: "No Company Found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Fetched company list",
      getCompany,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Error fetching company",
    });
  }
}
