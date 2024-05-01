"use client";

import Navbar from "@/components/navbar";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import User from "@/components/user";
import Course from "@/components/course";
import Lecture from "@/components/lecture";
import AssignLecture from "@/components/assignLecture";

import router from "next/router";
import { useRouter } from "next/navigation";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check authentication status
    const isLoggedInValue = localStorage.getItem("isLoggedIn");
    if (!isLoggedInValue) {
      localStorage.setItem("isLoggedIn", "false");
      router.push("/login");
      return; // Stop execution here
    }
    if (isLoggedInValue === "true") {
      setIsLoggedIn(true);
      return; // Stop execution here
    }
    router.push("/login");
  }, []);

  return (
    <>
      {isLoggedIn && (
        <>
          <Navbar path={params.id} />
          {params.id === "users" && <User />}
          {params.id === "courses" && <Course />}
          {params.id === "lectures" && <Lecture />}
          {params.id === "assignLectures" && <AssignLecture />}
        </>
      )}
    </>
  );
}
