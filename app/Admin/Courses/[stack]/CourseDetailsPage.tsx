"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface WeekPlan {
  _id?: string;
  week: number;
  title: string;
  topics: string[];
  task: string;
}

interface CoursePlan {
  _id?: string;
  name: string;
  description: string;
  weeks: WeekPlan[];
}

const CourseDetailsPage = () => {
  const params = useParams();
  const stackName = params?.stack as string;
  const [course, setCourse] = useState<CoursePlan | null>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    week: number;
    title: string;
    topics: string;
    task: string;
  }>({ week: 0, title: "", topics: "", task: "" });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  // ✅ Fetch course
  const fetchCourse = async () => {
    try {
      if (!token) {
        console.error("No token found");
        return;
      }
      const { data } = await axios.get(
        `http://localhost:9999/api/courses/${stackName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stackName) fetchCourse();
  }, [stackName]);

  // ✅ Modal Open Handlers
  const handleAddClick = () => {
    const nextWeek =
      course && course.weeks.length > 0
        ? Math.max(...course.weeks.map((w) => w.week)) + 1
        : 1;

    setIsEditing(false);
    setFormData({ week: nextWeek, title: "", topics: "", task: "" });
    setIsModalOpen(true);
  };

  const handleEditClick = (week: WeekPlan) => {
    setIsEditing(true);
    setFormData({
      week: week.week,
      title: week.title,
      topics: week.topics.join(", "),
      task: week.task,
    });
    setIsModalOpen(true);
  };

  // ✅ Save (Add / Update)
  const handleSave = async () => {
    try {
      const payload = {
        title: formData.title,
        topics: formData.topics.split(",").map((t) => t.trim()),
        task: formData.task,
      };

      if (isEditing) {
        // Update
        await axios.patch(
          `http://localhost:9999/api/courses/${stackName}/weeks/${formData.week}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Add
        await axios.post(
          `http://localhost:9999/api/courses/${stackName}/weeks`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setIsModalOpen(false);
      fetchCourse(); // refresh data
    } catch (error) {
      console.error("Error saving week:", error);
    }
  };

  // ✅ Delete
  const deleteWeek = async (weekNumber: number) => {
    try {
      await axios.delete(
        `http://localhost:9999/api/courses/${stackName}/weeks/${weekNumber}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCourse();
    } catch (error) {
      console.error("Error deleting week:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#1887A1]">
        Loading Course Details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-red-500">
        Course not found or syllabus not available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-[#0D4C5B] mb-4">{course.name}</h1>
      <p className="text-gray-700 mb-6">{course.description}</p>

      <div className="space-y-6">
        {course.weeks.map((week, idx) => (
          <div
            key={week._id || `${week.week}-${idx}`}
            className="bg-white p-5 rounded-2xl shadow-md border"
          >
            <h2 className="text-lg font-semibold text-[#1887A1]">
              Week {week.week}: {week.title}
            </h2>
            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
              {week.topics.map((topic, tIdx) => (
                <li key={tIdx}>{topic}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm font-medium text-[#0D4C5B]">
              📝 Task: {week.task}
            </p>

            {/* Admin Controls */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleEditClick(week)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg"
              >
                Update
              </button>
              <button
                onClick={() => deleteWeek(week.week)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Week Button */}
      <div className="mt-6">
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          + Add Week
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Update Week" : "Add New Week"}
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              placeholder="Topics (comma separated)"
              value={formData.topics}
              onChange={(e) =>
                setFormData({ ...formData, topics: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              placeholder="Task"
              value={formData.task}
              onChange={(e) =>
                setFormData({ ...formData, task: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded"
            />

            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
            >
              {isEditing ? "Update" : "Add"}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;
