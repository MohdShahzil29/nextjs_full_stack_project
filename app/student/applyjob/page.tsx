"use client";

import { RootState } from "@/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Briefcase, MapPin, Building2, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loader from "@/page/Loader";

interface Job {
  _id: string;
  title: string;
  jobType: string;
  location: string;
  company: string;
  status?: string; // assuming status is from application object
}

const ApplyJob = () => {
  const [applyJob, setApplyJob] = useState<Job[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  const getApplyJob = async () => {
    try {
      const res = await axios.get(
        `/api/application/getapplyjob?userId=${user._id}`
      );
      // Assuming the data shape is like: { appliedJobs: [{ job: {}, status: 'Pending' }] }
      const jobs = res.data.appliedJobs.map((application: any) => ({
        ...application.job,
        status: application.status,
      }));
      setApplyJob(jobs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getApplyJob();
  }, []);

  if (applyJob.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 mt-10 mb-16">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-center mt-5 mb-7">
          Your Applied Job List
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {applyJob.map((job) => (
          <Card
            key={job._id}
            className="shadow-md hover:shadow-lg transition-all bg-white rounded-lg"
          >
            <CardContent className="p-4 space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase size={20} className="text-primary" /> {job?.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BadgeCheck size={16} /> Status:{" "}
                <Badge variant="outline" className="capitalize">
                  {job.status || "Pending"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} /> Location: {job.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BadgeCheck size={16} /> Job Type: {job.jobType}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApplyJob;
