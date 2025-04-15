"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Loader from "@/page/Loader";
const FeaturedJobs = () => {
  const [categoryJob, setCategoryJob] = useState<any>(null);
  const { id } = useParams();
  console.log("Id", id);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/company/getcompanyjob/${id}`);
        setCategoryJob(res.data);
        console.log("Res", res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  if (!categoryJob)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <section className="py-16 bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Jobs at {categoryJob.company.title}:
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryJob.jobs.map((job: any) => (
            <Card
              key={job._id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <img
                    src={categoryJob.company.logo}
                    alt={categoryJob.company.title}
                    className="w-12 h-12 rounded-md mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-gray-600">{categoryJob.company.title}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-500">
                    <i className="fa-solid fa-location-dot w-5 text-center mr-2"></i>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <i className="fa-solid fa-money-bill-wave w-5 text-center mr-2"></i>
                    <span>${job.salary}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <i className="fa-solid fa-briefcase w-5 text-center mr-2"></i>
                    <span>{job.jobType}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    New
                  </Badge>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white !rounded-button whitespace-nowrap cursor-pointer"
                    onClick={() => router.push(`/details/${job._id}`)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
