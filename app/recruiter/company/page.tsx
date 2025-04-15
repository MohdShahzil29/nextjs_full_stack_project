"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Company = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    website: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/company/mycompany", {
          headers: { userId: user?._id },
        });
        setCompanies(response.data.companies);
      } catch (error: any) {
        setError("Failed to fetch companies");
        toast.error("Error fetching companies");
      }
    };

    if (user?._id) fetchCompanies();
  }, [user?._id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let logoBase64 = "";
      if (logoFile) {
        // Convert the file to a base64-encoded string
        logoBase64 = await fileToBase64(logoFile);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        website: formData.website,
        logo: logoBase64, // JSON includes the base64 string directly
      };

      await axios.post("/api/company/create", payload, {
        headers: {
          userId: user?._id,
          "Content-Type": "application/json",
        },
      });

      toast.success("Company created successfully");

      setFormData({
        title: "",
        description: "",
        location: "",
        website: "",
      });
      setLogoFile(null);

      const res = await axios.get("/api/company/mycompany", {
        headers: { userId: user?._id },
      });
      setCompanies(res.data.companies);
    } catch (error: any) {
      toast.error("Error creating company");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (companyId: string) => {
    const companyToEdit = companies.find((c: any) => c.id === companyId);
    if (companyToEdit) {
      setFormData({
        title: companyToEdit.title,
        description: companyToEdit.description,
        location: companyToEdit.location,
        website: companyToEdit.website || "",
      });
      setEditingCompanyId(companyId);
      setIsDialogOpen(true);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      let logoBase64 = "";
      if (logoFile) {
        logoBase64 = await fileToBase64(logoFile);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        website: formData.website,
        logo: logoBase64,
      };

      await axios.put(`/api/company/update/${editingCompanyId}`, payload, {
        headers: {
          userId: user?._id,
          "Content-Type": "application/json",
        },
      });

      toast.success("Company updated successfully");

      const res = await axios.get("/api/company/mycompany", {
        headers: { userId: user?._id },
      });
      setCompanies(res.data.companies);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Error updating company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Create Company</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Company Title"
          required
        />
        <Input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <Input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <Input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="Website"
        />
        <Input type="file" accept="image/*" onChange={handleLogoChange} />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Company"}
        </Button>
      </form>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Your Created Companies
      </h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.length > 0 ? (
            companies.map((company) => (
              <tr key={company.id}>
                <td className="border px-4 py-2">{company.title}</td>
                <td className="border px-4 py-2">{company.location}</td>
                <td className="border px-4 py-2">
                  <Button
                    onClick={() => handleEdit(company.id)}
                    variant="outline"
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border px-4 py-2 text-center">
                No companies created yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Company Title"
            />
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            />
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
            />
            <Input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Website"
              type="url"
            />
            <Input type="file" accept="image/*" onChange={handleLogoChange} />
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Company;
