"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios";
import { Task, TaskFormProps } from "@/types";



const TaskForm: React.FC<TaskFormProps> = ({ taskId, task: initialTask }) => {
  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    completed: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  // Fetch task details if taskId is provided, otherwise use initialTask
  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    } else if (taskId) {
      const fetchTask = async () => {
        try {
          const response = await apiClient.get<Task>(`/api/tasks/${taskId}/`);
          setTask(response.data);
        } catch (error) {
          setError("Error fetching task data");
        }
      };
      fetchTask();
    }
  }, [taskId, initialTask]);

  // Handle form field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Handle form submission for creating or updating a task
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = taskId ? `/api/tasks/${taskId}/` : "/api/tasks/";
      const method = taskId ? apiClient.put : apiClient.post;

      await method(url, task);

      router.push("/tasks"); // Redirect to task list page
    } catch (error) {
      setError("Error saving task data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-indigo-600 text-white p-4">
        <h2 className="text-2xl font-bold">
          {taskId ? "Edit Task" : "Create Task"}
        </h2>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded relative"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
          />
        </div>

        <div className="flex items-center">
          <input
            id="completed"
            type="checkbox"
            name="completed"
            checked={task.completed}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
          />
          <label htmlFor="completed" className="text-sm text-gray-900">
            Completed
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            {loading ? "Saving..." : taskId ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
