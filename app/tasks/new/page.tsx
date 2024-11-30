"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";  // Import useRouter for redirection
import TaskForm from "../../../components/TaskForm";

const TaskCreate: React.FC = () => {
  const router = useRouter(); // Initialize the router for redirection

  useEffect(() => {
    // Check if the token is available in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login page if no token is found
      router.push("/auth/login");
    }
  }, [router]); // Run this effect when the component is mounted

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          {/* You can add any additional UI or text here */}
        </div>
        <TaskForm />
      </div>
    </div>
  );
};

export default TaskCreate;
