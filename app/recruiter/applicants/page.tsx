"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

const Applicants = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [recruiterJob, setRecruiterJob] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [status, setStatus] = useState<string>("");

  const getRecruiterJobList = async () => {
    try {
      const res = await axios.get(`/api/job/recruiter/${user?._id}`);
      setRecruiterJob(res.data.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllApplicants = async (jobs: any[]) => {
    try {
      const allApplicants = await Promise.all(
        jobs.map(async (job) => {
          const res = await axios.get(
            `/api/application/getapplicants?jobId=${job._id}`
          );
          return (
            res.data.job.applications.map((app: any) => ({
              ...app,
              jobTitle: job.title,
            })) || []
          );
        })
      );

      const mergedApplicants = allApplicants.flat();
      setApplicants(mergedApplicants);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async () => {
    try {
      await axios.post("/api/application/updatestatus", {
        applicationId: selectedApp._id,
        newStatus: status,
      });
      setApplicants((prev) =>
        prev.map((a) => (a._id === selectedApp._id ? { ...a, status } : a))
      );
      toast.success("Status updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    getRecruiterJobList();
  }, [user]);

  useEffect(() => {
    if (recruiterJob.length > 0) {
      getAllApplicants(recruiterJob);
    }
  }, [recruiterJob]);

  return (
    <div className="p-4 grid gap-4">
      <h2 className="text-2xl font-semibold">All Applicants</h2>
      {applicants.map((app) => (
        <Card key={app._id}>
          <CardHeader>
            <CardTitle>
              Name: {""} {app.applicant.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Email:</strong> {app.applicant.email}
            </p>
            <p>
              <strong>Job Title:</strong> {app.jobTitle}
            </p>
            <p>
              <strong>Status:</strong> {app.status}
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setSelectedApp(app);
                    setStatus(app.status);
                  }}
                >
                  Edit Status
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Status</DialogTitle>
                </DialogHeader>
                <Select value={status} onValueChange={(val) => setStatus(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={updateStatus} className="mt-4">
                  Update
                </Button>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Applicants;
