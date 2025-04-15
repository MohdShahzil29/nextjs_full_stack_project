"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import heroBanner from "@/assets/Hero2.jpg";
import axios from "axios";

const HeroSection = () => {
  const [jobSearch, setJobSearch] = useState("");
  const [result, setResult] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (jobSearch.trim()) {
        fetchSuggestions();
      } else {
        setResult([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [jobSearch]);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(`/api/job/search?searchTerm=${jobSearch}`);
      setResult(res.data.jobs);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Suggestion fetch failed:", error);
    }
  };

  const handleSuggestionClick = (job: any) => {
    setJobSearch(job.title);
    setShowSuggestions(false);
    router.push(`/details/${job._id}`);
  };

  return (
    <section className="relative">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroBanner.src}
          alt="Hero Background"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/70"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-4">
            Find Your Dream Job Today
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Connect with over 20,000+ employers and discover opportunities that
            match your skills and aspirations.
          </p>

          {/* Stylish Search Box - No Button */}
          <div className="relative w-full max-w-2xl bg-white/80 backdrop-blur-lg border border-gray-200 p-4 rounded-xl shadow-lg">
            <div className="relative">
              <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                id="job-search"
                type="text"
                placeholder="Search for jobs like React Developer, UI Designer..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="pl-10 py-3 text-lg rounded-xl border-gray-300 w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {showSuggestions && result.length > 0 && (
              <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                {result.map((job: any, index: number) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-blue-100 hover:text-blue-900 cursor-pointer transition-all duration-150"
                    onClick={() => handleSuggestionClick(job)}
                  >
                    {job.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
