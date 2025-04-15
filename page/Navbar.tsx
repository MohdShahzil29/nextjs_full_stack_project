"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handelRedirect = () => {
    if (user?.role === "student") {
      window.location.href = "/student/profile";
    } else if (user?.role === "recruiter") {
      window.location.href = "/recruiter/profile";
    }
  };

  if (!isMounted) return null;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Menu */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link
              href={"/"}
              className="text-2xl font-bold text-blue-600 cursor-pointer"
            >
              JobPortal
            </Link>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-blue-600 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex ml-10 space-x-8">
            <div
              onClick={() => {
                user?.role === "recruiter"
                  ? router.push("/recruiter/job")
                  : router.push("/student/applyjob");
              }}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer"
            >
              Jobs
            </div>
            {user?.role === "recruiter" ? (
              <>
                <Link
                  href="/recruiter/company"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  Companies
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="#"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  About us
                </Link>
              </>
            )}

            {user?.role === "recruiter" ? (
              <Link
                href="/recruiter/applicants"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Applicant
              </Link>
            ) : (
              <>
                <Link
                  href="#"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  Career Resources
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Buttons */}
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="!rounded-button whitespace-nowrap cursor-pointer text-black"
                  onClick={handelRedirect}
                >
                  Profile
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white !rounded-button whitespace-nowrap cursor-pointer"
                  onClick={() => {
                    dispatch(logout());
                    window.location.href = "/sign-in";
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="!rounded-button whitespace-nowrap cursor-pointer"
                  onClick={() => (window.location.href = "/sign-in")}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white !rounded-button whitespace-nowrap cursor-pointer"
                  onClick={() => (window.location.href = "/sign-up")}
                >
                  Sign Up
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Nav Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-gray-700 hover:text-blue-600 text-sm">
                Jobs
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 text-sm">
                Companies
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 text-sm">
                Career Resources
              </a>
            </nav>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="outline" className="w-full !rounded-button">
                Sign In
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full !rounded-button">
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
