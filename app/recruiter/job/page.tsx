"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";

const CreateJob = () => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    experienceLevel: "",
    location: "",
    jobType: "",
    position: "",
    company: "",
    created_by: "",
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const [recruiterJob, setRecruiterJob] = useState(null);

  const getRecruiterJobList = async () => {
    try {
      const res = await axios.get(`/api/job/recruiter/${user?._id}`);
      setRecruiterJob(res.data.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/company/mycompany", {
          headers: {
            userId: user?._id,
          },
        });
        setCompanies(response.data.companies || []);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
    getRecruiterJobList();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      title,
      description,
      requirements,
      salary,
      experienceLevel,
      location,
      jobType,
      position,
      company,
    } = formData;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !experienceLevel ||
      !location ||
      !jobType ||
      !position ||
      !company
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        ...formData,
        created_by: user?._id,
        requirements: requirements.split(",").map((item) => item.trim()),
        salary: Number(salary),
        experienceLevel: Number(experienceLevel),
        position: Number(position),
      };

      const response = await axios.post("/api/job/create", payload);
      toast.success("Job created successfully!");

      setFormData({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        experienceLevel: "",
        location: "",
        jobType: "",
        position: "",
        company: "",
        created_by: "",
      });
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Job</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: "Title", name: "title", type: "text" },
          {
            label: "Requirements (comma separated)",
            name: "requirements",
            type: "text",
          },
          { label: "Salary", name: "salary", type: "number" },
          {
            label: "Experience Level (years)",
            name: "experienceLevel",
            type: "number",
          },
          { label: "Location", name: "location", type: "text" },
          { label: "Job Type", name: "jobType", type: "text" },
          { label: "Position (Level)", name: "position", type: "number" },
        ].map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field.label}
            </label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company
          </label>
          <select
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          >
            <option value="">Select a company</option>
            {companies.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.title}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Create Job
          </button>
        </div>
      </form>
      <div></div>
      <div>
        {recruiterJob && recruiterJob.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Created Jobs
            </h2>
            <ul className="space-y-4">
              {recruiterJob.map((job) => (
                <li
                  key={job._id}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50"
                >
                  <p>
                    <span className="font-semibold">Title:</span> {job.title}
                  </p>
                  <p>
                    <span className="font-semibold">Company:</span>{" "}
                    {job.company?.title}
                  </p>
                  <p>
                    <span className="font-semibold">Position:</span>{" "}
                    {job.position}
                  </p>
                  <p>
                    <span className="font-semibold">Job Type:</span>{" "}
                    {job.jobType}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateJob;
