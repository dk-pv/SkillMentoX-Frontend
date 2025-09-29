"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface StudentDetail {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
    location?: string;
    phone?: string;
    avatar?: string;
    educationLevel?: string;
    selectedCategory?: string;
    selectedStack?: string;
    isSubscribed?: boolean;
    subscriptionType?: string;
    subscriptionStart?: string;
    subscriptionEnd?: string;
  };
  category: string;
  stack: string;
  assignedMentor?: { _id: string; fullName: string; expertise?: string };
  requestedAt: string;
  updatedAt: string;
}

const StudentDetailPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchStudent = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:9999/api/admin/students/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStudent(data.student);
      } catch (err) {
        console.error("Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) return <div className="p-6">Loading student...</div>;
  if (!student) return <div className="p-6">Student not found</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#0D4C5B] mb-4">
          {student.student.name}
        </h1>
        <p>
          <strong>Email:</strong> {student.student.email}
        </p>
        <p>
          <strong>Phone:</strong> {student.student.phone || "N/A"}
        </p>
        <p>
          <strong>Location:</strong> {student.student.location || "N/A"}
        </p>
        <p>
          <strong>Education:</strong> {student.student.educationLevel || "N/A"}
        </p>
        <p>
          <strong>Category:</strong> {student.category}
        </p>
        <p>
          <strong>Stack:</strong> {student.stack}
        </p>
        <p>
          <strong>Mentor:</strong>{" "}
          {student.assignedMentor?.fullName || "Not assigned"}
        </p>
        <p>
          <strong>Subscribed:</strong>{" "}
          {student.student.isSubscribed
            ? `${student.student.subscriptionType} (till ${new Date(
                student.student.subscriptionEnd || ""
              ).toLocaleDateString()})`
            : "No"}
        </p>
      </div>
    </div>
  );
};

export default StudentDetailPage;
