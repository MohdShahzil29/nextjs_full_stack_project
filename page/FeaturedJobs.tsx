"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import NoImage from "@/assets/NoImage.png";
import { useParams, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

const FeaturedJobs = () => {
  const [jobList, setJobList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const router = useRouter();
  const { id } = useParams();

  const handelRedirect = (id: any) => {
    router.push(`/details/${id}`);
  };

  useEffect(() => {
    const getJobList = async () => {
      try {
        const res = await axios.get("/api/job/joblist");
        setJobList(res.data.jobs);
      } catch (error) {
        console.error("Error fetching job list:", error);
      }
    };

    getJobList();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  const visibleJobs = jobList?.slice(0, visibleCount);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Job Listings
            </h2>
            <p className="text-gray-600">Browse all available opportunities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobList?.length > 0 ? (
            visibleJobs.map((job) => (
              <Card
                key={job._id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <img
                      src={job?.company?.logo || NoImage.src}
                      alt={
                        typeof job.company === "object"
                          ? job.company.name || job.company.title
                          : job.company
                      }
                      className="w-12 h-12 rounded-md mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-gray-600">
                        {typeof job.company === "object"
                          ? job.company.name || job.company.title
                          : job.company}
                      </p>
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
                      {job.experienceLevel > 2 ? "Senior" : "Junior"}
                    </Badge>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded whitespace-nowrap cursor-pointer"
                      onClick={() => handelRedirect(job._id)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <>
            <div>
              <LoaderCircle />
            </div>
            </>
          )}
        </div>

        {visibleCount < jobList?.length && (
          <div className="mt-12 text-center">
            <Button
              onClick={handleLoadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded whitespace-nowrap cursor-pointer"
            >
              Load More
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;
