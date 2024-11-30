"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "../../lib/axios";
import { useRouter } from "next/navigation";

interface Task {
  id: number;
  title: string;
  description: string; 
  is_completed: boolean;
}

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const router = useRouter(); // Initialize the router to handle redirection
  
    useEffect(() => {
      // Check if the token is available in localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        // Redirect to login page if no token is found
        router.push("/auth/login");
        return; // Stop the execution if no token
      }
  
      const fetchTasks = async () => {
        try {
          const response = await apiClient.get<Task[]>("/api/tasks/");
          setTasks(response.data);
        } catch (error) {
          console.error(error);  // Log the error to the console
          setError("Error fetching tasks");
        } finally {
          setLoading(false);
        }
      };
  
      fetchTasks();
    }, [router]);
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Tasks</h2>
            <Link
              href="/tasks/new"
              className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300 ease-in-out"
            >
              Create New Task
            </Link>
          </div>
  
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}
  
          {loading ? (
            <div className="flex justify-center items-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
              <p className="ml-3 text-gray-600">Loading...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center p-6 text-gray-500">
              No tasks found. Create a new task to get started!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="px-6 py-4 hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <Link
                    href={`/tasks/${task.id}`}
                    className="text-lg text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {task.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
  
          <div className="p-6"></div>
        </div>
      </div>
    );
  };
  
  export default TaskList;