"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import noImage from "@/assets/NoImage.png";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const Category = () => {
  const [company, setCompany] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get("/api/company/getallcompany");
        setCompany(res.data.getCompany);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompany();
  }, []);

  if (!company) {
    return (
      <div className="flex justify-center items-center mt-11">
        <Loader2 />
      </div>
    );
  }
  return (
    <div className="px-6 py-10 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Browse By Campany
      </h2>
      <div className="flex space-x-4 flex-wrap justify-center gap-[10px]">
        {company?.map((cat, idx) => (
          <Card
            key={idx}
            className="w-[150px] flex flex-col items-center justify-center p-6 rounded-xl bg-gray-100 hover:shadow-md transition-shadow"
          >
            <CardContent className="flex flex-col items-center space-y-3 p-0">
              <Image
                src={cat.logo || noImage.src}
                alt={cat.title}
                width={40}
                height={40}
              />
              <span
                className="text-sm font-medium text-center cursor-pointer"
                onClick={() => router.push(`/company/${cat._id}`)}
              >
                {cat.title}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Category;
