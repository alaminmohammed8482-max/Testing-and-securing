"use client";

import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react";
import styles from "../app/styles/navbar.module.scss";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function Navbar({ path }: any) {
  const router = useRouter();
  const params = useParams();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleSheetToggle = () => {
    setIsSheetOpen(!isSheetOpen);
  };

  const handleLogout = () => {
    // Implement logout logic here
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <div className={`${styles.navabrContainer} border-b-2`}>
      <div className={styles.navbarInnerContainer}>
        <div className="flex gap-10">
          <div className={`${styles.weblogo} flex items-center`}>
            <span className="text-xl font-bold">
              Criminal Investigation Tracker
            </span>
          </div>
          <div className={`${styles.navbarControllers} flex flex-wrap gap-1`}>
            <Link href="/">
              <span
                className={`font-normal text-sm p-2 px-3 rounded-xl ${
                  params.id === undefined ? "shadow-md" : " "
                }`}
              >
                Overview
              </span>
            </Link>
            <Link href="/users">
              <span
                className={`font-normal text-sm p-2 px-3 rounded-xl ${
                  params.id === "users" ? "shadow-md" : " "
                }`}
              >
                Polices
              </span>
            </Link>
            <Link href="/courses">
              <span
                className={`font-normal text-sm p-2 px-3 rounded-xl ${
                  params.id === "courses" ? "shadow-md" : " "
                }`}
              >
                Cases
              </span>
            </Link>
            <Link href="/lectures">
              <span
                className={`font-normal text-sm p-2 px-3 rounded-xl ${
                  params.id === "lectures" ? "shadow-md" : " "
                }`}
              >
                Sub Cases
              </span>
            </Link>
            <Link href="/assignLectures">
              <span
                className={`font-normal text-sm p-2 px-3 rounded-xl ${
                  params.id === "assignLectures" ? "shadow-md" : " "
                }`}
              >
                Assign Cases
              </span>
            </Link>
          </div>
        </div>
        <div className={styles.logoutButton} onClick={handleLogout}>
          <Button className="p-4 h-[35px] rounded-lg bg-slate-800">
            <LogOut size={20} />
          </Button>
        </div>
        <div className={styles.mobileMenu}>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${styles.mobileMenuIcon} cursor-pointer`}
                onClick={handleSheetToggle}
              >
                <path
                  d="M7.78571 8.75H15.4643C15.8716 8.75 16.2622 8.92384 16.5502 9.23327C16.8382 9.54271 17 9.96239 17 10.4C17 10.8376 16.8382 11.2573 16.5502 11.5667C16.2622 11.8762 15.8716 12.05 15.4643 12.05H7.78571C7.37842 12.05 6.9878 11.8762 6.6998 11.5667C6.4118 11.2573 6.25 10.8376 6.25 10.4C6.25 9.96239 6.4118 9.54271 6.6998 9.23327C6.9878 8.92384 7.37842 8.75 7.78571 8.75ZM18.5357 21.95H26.2143C26.6216 21.95 27.0122 22.1238 27.3002 22.4333C27.5882 22.7427 27.75 23.1624 27.75 23.6C27.75 24.0376 27.5882 24.4573 27.3002 24.7667C27.0122 25.0762 26.6216 25.25 26.2143 25.25H18.5357C18.1284 25.25 17.7378 25.0762 17.4498 24.7667C17.1618 24.4573 17 24.0376 17 23.6C17 23.1624 17.1618 22.7427 17.4498 22.4333C17.7378 22.1238 18.1284 21.95 18.5357 21.95ZM7.78571 15.35H26.2143C26.6216 15.35 27.0122 15.5238 27.3002 15.8333C27.5882 16.1427 27.75 16.5624 27.75 17C27.75 17.4376 27.5882 17.8573 27.3002 18.1667C27.0122 18.4762 26.6216 18.65 26.2143 18.65H7.78571C7.37842 18.65 6.9878 18.4762 6.6998 18.1667C6.4118 17.8573 6.25 17.4376 6.25 17C6.25 16.5624 6.4118 16.1427 6.6998 15.8333C6.9878 15.5238 7.37842 15.35 7.78571 15.35Z"
                  fill="black"
                />
              </svg>
            </SheetTrigger>
            <SheetContent>
              <div className="grid gap-4 py-4 h-full">
                <div className="flex justify-center items-center flex-col">
                  <div className="text-xl font-semibold">ADMIN</div>
                  <div className="flex gap-8 justify-center items-center flex-col h-full text-lg">
                    <Link href="/" className="flex gap-2 hover:underline">
                      <span>Overview</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="28"
                        viewBox="0 0 32 28"
                        id="right"
                        style={{ rotate: "-45deg" }}
                      >
                        <g fill="#1D1D1B">
                          <path d="M16.587 3.42 27.167 14l-10.58 10.58a2.003 2.003 0 0 0 2.833 2.833L31.414 15.42a2.013 2.013 0 0 0 0-2.84L19.42.587a2.003 2.003 0 1 0-2.833 2.833z"></path>
                          <path d="M28 16H2a2 2 0 1 1 0-4h26v4z"></path>
                        </g>
                      </svg>
                    </Link>
                    <Link href="/users" className="flex gap-2 hover:underline">
                      <span>Polices</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="28"
                        viewBox="0 0 32 28"
                        id="right"
                        style={{ rotate: "-45deg" }}
                      >
                        <g fill="#1D1D1B">
                          <path d="M16.587 3.42 27.167 14l-10.58 10.58a2.003 2.003 0 0 0 2.833 2.833L31.414 15.42a2.013 2.013 0 0 0 0-2.84L19.42.587a2.003 2.003 0 1 0-2.833 2.833z"></path>
                          <path d="M28 16H2a2 2 0 1 1 0-4h26v4z"></path>
                        </g>
                      </svg>
                    </Link>
                    <Link
                      href="/courses"
                      className="flex gap-2 hover:underline"
                    >
                      <span>Cases</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="28"
                        viewBox="0 0 32 28"
                        id="right"
                        style={{ rotate: "-45deg" }}
                      >
                        <g fill="#1D1D1B">
                          <path d="M16.587 3.42 27.167 14l-10.58 10.58a2.003 2.003 0 0 0 2.833 2.833L31.414 15.42a2.013 2.013 0 0 0 0-2.84L19.42.587a2.003 2.003 0 1 0-2.833 2.833z"></path>
                          <path d="M28 16H2a2 2 0 1 1 0-4h26v4z"></path>
                        </g>
                      </svg>
                    </Link>
                    <Link
                      href="/lectures"
                      className="flex gap-2 hover:underline"
                    >
                      <span>Sub Cases</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="28"
                        viewBox="0 0 32 28"
                        id="right"
                        style={{ rotate: "-45deg" }}
                      >
                        <g fill="#1D1D1B">
                          <path d="M16.587 3.42 27.167 14l-10.58 10.58a2.003 2.003 0 0 0 2.833 2.833L31.414 15.42a2.013 2.013 0 0 0 0-2.84L19.42.587a2.003 2.003 0 1 0-2.833 2.833z"></path>
                          <path d="M28 16H2a2 2 0 1 1 0-4h26v4z"></path>
                        </g>
                      </svg>
                    </Link>
                    <Link
                      href="/assignLectures"
                      className="flex gap-2 hover:underline"
                    >
                      <span>Assign Cases</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="28"
                        viewBox="0 0 32 28"
                        id="right"
                        style={{ rotate: "-45deg" }}
                      >
                        <g fill="#1D1D1B">
                          <path d="M16.587 3.42 27.167 14l-10.58 10.58a2.003 2.003 0 0 0 2.833 2.833L31.414 15.42a2.013 2.013 0 0 0 0-2.84L19.42.587a2.003 2.003 0 1 0-2.833 2.833z"></path>
                          <path d="M28 16H2a2 2 0 1 1 0-4h26v4z"></path>
                        </g>
                      </svg>
                    </Link>
                  </div>
                  <div className={styles.logoutButton} onClick={handleLogout}>
                    <Button className="p-4 h-[35px] rounded-lg bg-slate-800">
                      <LogOut size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
