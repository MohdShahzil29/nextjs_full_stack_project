import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/db";
import applicationModels from "@/model/application";

export async function POST(request: NextRequest, response: NextResponse) {
  await connect();

  const { jobId, applicantId } = await request.json();

  if (!jobId || !applicantId) {
    return NextResponse.json({
      message: "Missing jobId or applicantId",
    });
  }

  try {
    const existing = await applicationModels.findOne({ jobId, applicantId });
    if (existing) {
      return NextResponse.json({ applied: true });
    } else {
      return NextResponse.json({ applied: false });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Server error",
      error,
    });
  }
}
