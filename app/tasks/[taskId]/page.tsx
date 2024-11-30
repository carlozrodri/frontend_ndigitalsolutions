"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "../../../components/TaskForm";
import apiClient from "@/lib/axios"; // Import the custom axios instance
import { Task } from "@/types"; 


const TaskPage: React.FC<{ params: { taskId: string } }> = ({ params }) => {
  const [isMounted, setIsMounted] = useState(false); // Track if the component has mounted
  const [taskId, setTaskId] = useState<string | null>(null); // State to store taskId
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Set isMounted to true after the first render
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params; // Unwrap the params Promise
      setTaskId(resolvedParams.taskId); // Set taskId state after unwrapping
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const response = await apiClient.get(`/api/tasks/${taskId}/`);

          if (response.status === 200) {
            setTask(response.data); // Set the task data to pass to TaskForm
          } else {
            router.push("/tasks"); // Redirect to tasks page if task not found
          }
        } catch (error) {
          console.error("Error fetching task:", error);
          router.push("/tasks"); // Redirect on error
        } finally {
          setLoading(false);
        }
      };

      fetchTask();
    }
  }, [taskId, router]);

  if (!isMounted) {
    return null; // Render nothing until mounted to avoid the error
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="task-page">
      {task ? (
        <TaskForm task={task} taskId={parseInt(taskId!)} />
      ) : (
        <p>Task not found</p>
      )}
    </div>
  );
};

export default TaskPage;
