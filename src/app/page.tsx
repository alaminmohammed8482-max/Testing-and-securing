"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import url from "../../environment";

import Navbar from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PiUsersLight } from "react-icons/pi";
import { TbCategory } from "react-icons/tb";
import { MdMiscellaneousServices } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";
import { BiSolidCreditCardAlt } from "react-icons/bi";
import { VscFeedback } from "react-icons/vsc";

import styles from "../app/styles/overview.module.scss";

function CatalogCard({ data, handleCardClick }: any) {
  return (
    <Card
      className={`${styles.card} w-[250px] h-[180px] rounded-3xl cursor-pointer flex flex-col justify-between`}
      onClick={() => {
        handleCardClick(data.url);
      }}
    >
      <CardHeader className="flex flex-row justify-between">
        <div className="space-y-1">
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>{data.des}</CardDescription>
        </div>
        <div className="">
          {data.name === "Users" ? (
            <PiUsersLight size={35} />
          ) : data.name === "Courses" ? (
            <TbCategory size={35} />
          ) : data.name === "Lectures" ? (
            <MdMiscellaneousServices size={35} />
          ) : data.name === "AssignLectures" ? (
            <BiSolidOffer size={35} />
          ) : data.name === "Bookings" ? (
            <BiSolidCreditCardAlt size={35} />
          ) : (
            <VscFeedback size={35} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-start">
          {/* <p className="text-2xl font-bold">{data.total}</p> */}
          <p className="text-sm text-gray-500">
            Total{" "}
            <span className="text-2xl text-slate-900 font-bold">
              {data.total}
            </span>{" "}
            {data.name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const [totals, setTotals] = useState({
    users: 0,
    courses: 0,
    lectures: 0,
    assignLectures: 0,
  });

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

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          usersResponse,
          coursesResponse,
          lecturesResponse,
          assignLecturesResponse,
        ] = await Promise.all([
          axios.get(`${url.url}admin/getAllUsers`),
          axios.get(`${url.url}admin/getAllCourses`),
          axios.get(`${url.url}admin/getAllLectures`),
          axios.get(`${url.url}admin/getAllAssignLectures`),
        ]);

        // Extract total from each response and update state
        setTotals({
          users: usersResponse.data.user.length,
          courses: coursesResponse.data.course.length,
          lectures: lecturesResponse.data.lecture.length,
          assignLectures: assignLecturesResponse.data.assignLecture.length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleCardClick = (url: any) => {
    router.push(`/${url}`);
  };

  return (
    <>
      {isLoggedIn && (
        <>
          <Navbar />
          <div
            className={`${styles.mainContainer} grid grid-cols-4 place-items-center w-[60%] gap-4 my-[60px] mx-auto`}
          >
            {[
              {
                name: "Users",
                des: "View all Users",
                total: totals.users,
                url: "users",
              },
              {
                name: "Courses",
                des: "View all courses.",
                total: totals.courses,
                url: "courses",
              },
              {
                name: "Lectures",
                des: "View all lectures",
                total: totals.lectures,
                url: "lectures",
              },
              {
                name: "AssignLec...",
                des: "View all Assign Lectures",
                total: totals.assignLectures,
                url: "assignLectures",
              },
            ].map((data, index) => (
              <CatalogCard
                key={index}
                data={data}
                total={data.total}
                handleCardClick={handleCardClick}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
