import jobModel from "@/model/job";
import { connect } from "@/db/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await connect();
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("searchTerm");

    if (!searchTerm) {
      return NextResponse.json(
        { message: "Missing search term" },
        { status: 400 }
      );
    }

    const jobs = await jobModel.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
    });

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
