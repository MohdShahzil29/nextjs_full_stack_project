import { connect } from "@/db/db";
import cloudinary from "@/lib/cloudinary";
import companyModel from "@/model/company";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connect();
  try {
    const { id: companyId } = await params;

    const body = await request.json();
    const { title, description, location, website, logo } = body;

    let updatedLogo = logo;

    // If logo is a base64 image, upload to Cloudinary
    if (logo?.startsWith("data:image/")) {
      const uploadRes = await cloudinary.uploader.upload(logo, {
        folder: "company-logos",
      });
      updatedLogo = uploadRes.secure_url;
    }

    // Update the company document
    const updatedCompany = await companyModel.findByIdAndUpdate(
      companyId,
      {
        title,
        description,
        location,
        website,
        logo: updatedLogo,
      },
      { new: true }
    );

    // If no company is found, return 404
    if (!updatedCompany) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Company updated successfully", company: updatedCompany },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT /api/company/update error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
