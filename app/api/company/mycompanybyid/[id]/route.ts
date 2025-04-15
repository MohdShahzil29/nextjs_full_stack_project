import { connect } from "@/db/db";
import companyModel from "@/model/company";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }>}
) {
  await connect();
  try {
    const {id: companyId} = await context.params;

    if (!companyId) {
      return NextResponse.json(
        { message: "Company ID is required" },
        { status: 400 }
      );
    }

    const company = (await companyModel.findById(companyId).lean()) as any;

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Company fetched successfully",
        company: {
          id: company._id,
          title: company.title,
          description: company.description,
          location: company.location,
          website: company.website,
          logo: company.logo,
          userId: company.userId,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
