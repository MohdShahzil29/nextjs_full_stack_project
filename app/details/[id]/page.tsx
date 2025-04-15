"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams } from "next/navigation";
import NoImage from "@/assets/NoImage.png";
import Loader from "@/page/Loader";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface JobDetailType {
  _id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  salary: number;
  experienceLevel?: string;
  requirements: string[];
  company: {
    title: string;
    logo?: string;
    description?: string;
  };
}

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [jobDetail, setJobDetail] = useState<JobDetailType | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const applyJob = async () => {
    if (!user || !user._id) {
      router.push("/sign-in");
      return;
    }
    try {
      await axios.post("/api/application/applyjob", {
        jobId: id,
        applicantId: user._id,
      });
      setHasApplied(true);
      toast.success("Job Applied Successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const checkIfApplied = async () => {
    if (!user || !user._id) return;
    try {
      const res = await axios.post("/api/application/check", {
        jobId: id,
        applicantId: user._id,
      });
      setHasApplied(res.data.applied);
    } catch (error) {
      console.error("Error checking application status:", error);
    } finally {
      setCheckingApplication(false);
    }
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axios.get(`/api/job/jobbyid/${id}`);
        setJobDetail(res.data.job);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    if (user && user._id) {
      checkIfApplied();
    }
  }, [user?._id]);

  if (!jobDetail) {
    return (
      <div className="flex justify-center mt-10">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mt-8 mb-8 bg-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Company + Title */}
        <div className="flex items-center space-x-4">
          <img
            src={jobDetail?.company?.logo || NoImage.src}
            alt={jobDetail.company?.title}
            className="w-20 h-20 rounded-md object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">{jobDetail.title}</h1>
            <p className="text-lg">{jobDetail.company?.title}</p>
          </div>
        </div>

        {/* Job Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <p>
            <span className="font-semibold">Location:</span>{" "}
            {jobDetail.location}
          </p>
          <p>
            <span className="font-semibold">Type:</span> {jobDetail.jobType}
          </p>
          <p>
            <span className="font-semibold">Salary:</span> $
            {jobDetail.salary.toLocaleString()}
          </p>
          {jobDetail.experienceLevel && (
            <p>
              <span className="font-semibold">Experience Level:</span>{" "}
              {jobDetail.experienceLevel}
            </p>
          )}
        </div>

        {/* Requirements */}
        {jobDetail.requirements?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Requirements</h2>
            <ul className="list-disc list-inside space-y-1">
              {jobDetail.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Description */}
        <div className="text-base leading-relaxed">
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          <p>{jobDetail.description}</p>
        </div>

        {/* Company Info */}
        {jobDetail.company?.description && (
          <div>
            <h2 className="text-xl font-semibold mb-2">About the Company</h2>
            <p>{jobDetail.company.description}</p>
          </div>
        )}

        {/* Apply Button */}
        <div>
          {checkingApplication ? (
            <Button
              disabled
              className="bg-gray-400 text-white text-sm px-6 py-2 rounded-xl"
            >
              Checking...
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (!user) {
                  router.push("/sign-in");
                } else if (!hasApplied) {
                  applyJob();
                }
              }}
              disabled={hasApplied}
              className={`${
                hasApplied
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white text-sm px-6 py-2 rounded-xl`}
            >
              {user ? (hasApplied ? "Job Applied" : "Apply Now") : "Sign In"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
