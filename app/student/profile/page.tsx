"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { setUser } from "@/store/authSlice";

const Profile = () => {
  const [mounted, setMounted] = useState(false); // hydration-safe render
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    bio: "",
    study: "",
    location: "",
    experience: "",
    skills: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        bio: user?.profile?.bio || "",
        study: user?.profile?.study || "",
        location: user?.profile?.location || "",
        experience: user?.profile?.experience?.join("\n") || "",
        skills: user?.profile?.skills?.join(", ") || "",
      });
    }
  }, [user]);

  if (!mounted) return null; // prevent mismatch between SSR/CSR

  if (!user) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        bio: form.bio,
        study: form.study,
        location: form.location,
        experience: form.experience.split("\n"),
        skills: form.skills.split(",").map((s) => s.trim()),
      };

      await axios.post("/api/user/profile", updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setUser({ ...user, profile: updatedData }));
      toast.success("Profile updated successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Pencil className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                name="bio"
                placeholder="Your bio"
                value={form.bio}
                onChange={handleChange}
              />
              <Input
                name="study"
                placeholder="Education"
                value={form.study}
                onChange={handleChange}
              />
              <Input
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
              />
              <Textarea
                name="experience"
                placeholder="Experience (one per line)"
                value={form.experience}
                onChange={handleChange}
              />
              <Input
                name="skills"
                placeholder="Skills (comma separated)"
                value={form.skills}
                onChange={handleChange}
              />
              <Button className="w-full" onClick={handleUpdate}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md">
        <CardContent className="space-y-4 pt-6">
          <div>
            <h2 className="text-xl font-semibold">Name: {user.name}</h2>
            <p className="text-sm text-gray-600">Email: {user.email}</p>
            <p className="text-sm text-gray-600">
              Phone Number: {user.phoneNumber}
            </p>
            <Badge className="mt-2" variant="secondary">
              Role: {user.role}
            </Badge>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium text-lg">Bio</h3>
            <p className="text-sm text-muted-foreground">{user.profile?.bio}</p>
          </div>

          <div>
            <h3 className="font-medium text-lg">Education</h3>
            <p className="text-sm text-muted-foreground">
              {user.profile?.study}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">Location</h3>
            <p className="text-sm text-muted-foreground">
              {user.profile?.location}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">Experience</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {user.profile?.experience?.map((exp: string, i: number) => (
                <li key={i}>{exp}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.profile?.skills?.map((skill: string, i: number) => (
                <Badge key={i} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
