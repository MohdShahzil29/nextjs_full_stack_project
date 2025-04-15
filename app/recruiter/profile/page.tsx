"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Loader from "@/page/Loader";

const RecruiterProfile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; 

  if (!user) {
    return <div className="p-4 text-center items-center">
      <Loader />
    </div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-14 mb-16">
      <h1 className="text-2xl font-bold text-center mb-4">Recruiter Profile</h1>
      <Card>
        <CardContent className="space-y-4 pt-6 text-sm">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <Separator />
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <Separator />
          <p className="flex items-center gap-2">
            <strong>Role:</strong>{" "}
            <Badge variant="secondary">{user.role}</Badge>
          </p>
          <Separator />
          <p>
            <strong>Phone Number:</strong> {user.phoneNumber}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterProfile;
