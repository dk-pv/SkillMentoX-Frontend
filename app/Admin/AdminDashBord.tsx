"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface StudentRequest {
  _id: string;
  student: { _id: string; firstName: string; lastName: string; email: string };
  category: string;
  status: string;
  stack: string;
  assignedMentor?: {
    _id: string;
    userId: { firstName: string; lastName: string; email: string };
  } | null;
  requestedAt: string;
}

interface Mentor {
  _id: string;
  userId: { firstName: string; lastName: string; email: string };
  courses: { courseName: string }[];
}

const AdminDashboard: React.FC = () => {
  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // ✅ SSR-safe token fetch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      if (storedToken) {
        fetchStudentRequests(storedToken);
        fetchMentors(storedToken);
      }
    }
  }, []);

  // Fetch pending student requests
  const fetchStudentRequests = async (authToken: string) => {
    try {
      const res = await axios.get(
        "http://localhost:9999/api/admin/student-requests/pending",
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setStudentRequests(res.data.data);
    } catch (err) {
      console.error("Error fetching student requests:", err);
    }
  };

  // Fetch all approved mentors
  const fetchMentors = async (authToken: string) => {
    try {
      const res = await axios.get(
        "http://localhost:9999/api/admin/mentors/approved",
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setMentors(res.data.mentors);
    } catch (err) {
      console.error("Error fetching mentors:", err);
    }
  };

  // Update request (status or mentor)
  const updateRequest = async (
    requestId: string,
    payload: { status?: string; mentorId?: string }
  ) => {
    if (!token) return;
    try {
      const res = await axios.patch(
        `http://localhost:9999/api/admin/student-requests/${requestId}/update`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStudentRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, ...res.data.request } : req
        )
      );
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Pending Student Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentRequests.map((req) => (
          <div key={req._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-1">
              {req.student.firstName} {req.student.lastName} (
              {req.student.email})
            </h2>
            <p className="text-gray-600">Category: {req.category}</p>
            <p className="text-gray-600">Stack: {req.stack}</p>
            <p className="text-gray-600">
              Assigned Mentor:{" "}
              {req.assignedMentor
                ? `${req.assignedMentor.userId.firstName} ${req.assignedMentor.userId.lastName}`
                : "Not assigned"}
            </p>

            <div className="mt-4 space-y-2">
              {/* Status Dropdown */}
              <select
                value={req.status}
                onChange={(e) =>
                  updateRequest(req._id, { status: e.target.value })
                }
                className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Mentor Dropdown */}
              <select
                value={req.assignedMentor?._id || ""}
                onChange={(e) =>
                  updateRequest(req._id, { mentorId: e.target.value })
                }
                className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Assign Mentor</option>
                {mentors
                  .filter((m) =>
                    m.courses.some(
                      (c) => c.courseName.trim() === req.stack.trim()
                    )
                  )
                  .map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.userId.firstName} {m.userId.lastName} {/* ✅ Name */}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        ))}
        {studentRequests.length === 0 && (
          <p className="text-gray-500 col-span-full">
            No pending student requests.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
