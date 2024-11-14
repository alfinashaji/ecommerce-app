"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import DashBoardProvider from "./DashBoardProvider";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

const SideMenu = ({children}) => {
  const {data, status} = useSession();

  console.log(data, status);
  const router = useRouter();
  useEffect(() => {
    (status === "unauthenticated" || data?.user?.role === "user") &&
      router.push("/admin/login");
  }, [status, data]);
  if (status === "loading") {
    return <>loading...</>;
  }
  return (
    <>
      {status === "authenticated" && data?.user?.role === "admin" && (
        <div className="flex h-screen bg-gray-100">
          <div className="flex flex-col h-full bg-gray-800 text-white w-1/5 shadow-lg ">
            <div className="fixed bg-gray-800 text-white w-1/5 h-full">
              <div className="text-2xl font-bold p-6 border-b border-gray-700">
                Glamoura
              </div>
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  <li className="hover:bg-gray-700 rounded p-2 transition duration-300 cursor-pointer">
                    <Link href="dashboard/pages">Products</Link>
                  </li>
                  <li className="hover:bg-gray-700 rounded p-2 transition duration-300 cursor-pointer">
                    <Link href="/dashboard/orders">Orders</Link>
                  </li>
                  <li className="hover:bg-gray-700 rounded p-2 transition duration-300 cursor-pointer">
                    <Link href="/dashboard/categories">Categories</Link>
                  </li>
                  {/* <li className="hover:bg-gray-700 rounded p-2 transition duration-300 cursor-pointer">
                  <Link href="dashboard/users">Users</Link>
                </li> */}
                  <li className="hover:bg-gray-700 rounded p-2 transition duration-300 cursor-pointer">
                    Analytics
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="flex-1 p-0 bg-gray-900">
            {<DashBoardProvider children={children} />}
          </div>
        </div>
      )}
    </>
  );
};

export default SideMenu;
