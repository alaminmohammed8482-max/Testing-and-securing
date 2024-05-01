"use client";

import { useEffect, useState } from "react";
import url from "../../../environment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/");
    }
  }, []); // This effect runs once on component mount

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(
        `${url.url}admin/adminLogin`,
        formData
      );
      // Assuming the API returns a success message or token upon successful login
      if (response.status === 200) {
        localStorage.setItem("isLoggedIn", "true");
        console.log(200);
        router.push("/"); // Redirect to the home page
        toast("Login Sucessfully!", {
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      // Handle login failure, display error message to the user
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Invalid username or password!", {
            position: "top-right",
          });
        } else if (error.response.status === 404) {
          toast.error("User not found!", {
            position: "top-right",
          });
        } else {
          toast.error("An error occurred. Please try again later.", {
            position: "top-right",
          });
        }
      }
    }
  };

  return (
    <div className="w-full h-[90vh] flex justify-center items-center">
      <Card className="w-[380px] p-2 pb-1 rounded-xl">
        <form onSubmit={handleFormSubmit}>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Enter credentials to unlock full admin capabilities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="rounded-xl">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
