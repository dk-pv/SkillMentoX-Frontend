// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Search } from "lucide-react";

// // ====== Types ======
// interface Student {
//   _id: string;
//   student: { _id: string; name: string; email: string };
//   category: string;
//   stack: string;
//   assignedMentor: { _id: string; fullName: string; expertise?: string } | null;
//   updatedAt: string;
// }

// // ====== Course Categories ======
// const courseCategories: Record<string, { Stacks: string[] }> = {
//   "Full Stack Web Development": {
//     Stacks: [
//       "MERN Stack (MongoDB, Express, React, Node.js)",
//       "MEAN Stack (MongoDB, Express, Angular, Node.js)",
//       "Python Full Stack (Django + React / Angular)",
//       "Spring Boot + React / Angular",
//       "LAMP Stack (Linux, Apache, MySQL, PHP)",
//       "Next.js + NestJS + PostgreSQL",
//       "Ruby on Rails + React",
//       "T3 Stack (Next.js + Prisma + tRPC + Tailwind)",
//     ],
//   },
// };

// const StudentsPage = () => {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState<any>(null);
//   const [page, setPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [category, setCategory] = useState("");
//   const [courseName, setCourseName] = useState("");

//   const router = useRouter();

//   // ====== Fetch Students ======
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const fetchStudents = async () => {
//       setLoading(true);
//       try {
//         const params = new URLSearchParams();
//         params.append("page", page.toString());
//         params.append("limit", "6");
//         if (category) params.append("category", category);
//         if (courseName) params.append("courseName", courseName);

//         const { data } = await axios.get(
//           `http://localhost:9999/api/admin/students/valid?${params.toString()}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setStudents(data.students || []);
//         setPagination(data.pagination || null);
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, [page, category, courseName]);

//   // 🔹 Local search filter
//   const filteredStudents = students.filter(
//     (s) =>
//       s.student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       s.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       s.assignedMentor?.fullName
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase())
//   );

//   // ====== UI ======
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-[#1887A1]">
//         Loading students...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <h1 className="text-2xl font-bold text-[#0D4C5B] mb-6">
//         Approved Students
//       </h1>

//       {/* Search */}
//       <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search by student name, email, or mentor..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg 
//                        focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
//           />
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex gap-4 mb-6">
//         <select
//           value={category}
//           onChange={(e) => {
//             setCategory(e.target.value);
//             setCourseName("");
//             setPage(1);
//           }}
//           className="px-3 py-2 border rounded"
//         >
//           <option value="">All Categories</option>
//           {Object.keys(courseCategories).map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>

//         <select
//           value={courseName}
//           onChange={(e) => {
//             setCourseName(e.target.value);
//             setPage(1);
//           }}
//           className="px-3 py-2 border rounded"
//           disabled={!category}
//         >
//           <option value="">All Courses</option>
//           {category &&
//             courseCategories[category].Stacks.map((course) => (
//               <option key={course} value={course}>
//                 {course}
//               </option>
//             ))}
//         </select>
//       </div>

//       {/* Student Cards */}
//       {filteredStudents.length === 0 ? (
//         <p className="text-gray-600">No students found.</p>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredStudents.map((s) => (
//               <div
//                 key={s._id}
//                onClick={() => router.push(`/Admin/students/${s.student._id}`)}
//                 className="bg-white p-5 rounded-2xl shadow-md border 
//                            hover:shadow-lg cursor-pointer transition"
//               >
//                 <h2 className="text-lg font-bold text-[#0D4C5B]">
//                   {s.student.name || s.student.email}
//                 </h2>
//                 <p className="text-sm text-gray-500">{s.category}</p>

//                 <div className="mt-3 text-sm text-gray-700 space-y-1">
//                   <p>
//                     <span className="font-semibold">Stack:</span> {s.stack}
//                   </p>
//                   <p>
//                     <span className="font-semibold">Mentor:</span>{" "}
//                     {s.assignedMentor?.fullName || "Not assigned"}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {pagination && (
//             <div className="flex justify-center items-center gap-4 mt-8">
//               <button
//                 disabled={page === 1}
//                 onClick={() => setPage((prev) => prev - 1)}
//                 className="px-4 py-2 bg-[#0D4C5B] text-white rounded disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <span className="text-gray-700">
//                 Page {pagination.page} of {pagination.totalPages}
//               </span>
//               <button
//                 disabled={page === pagination.totalPages}
//                 onClick={() => setPage((prev) => prev + 1)}
//                 className="px-4 py-2 bg-[#1887A1] text-white rounded disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default StudentsPage;



"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

// ====== Types ======
interface Student {
  _id: string;
  student: { _id: string; name: string; email: string };
  category: string;
  stack: string;
  assignedMentor: { _id: string; fullName: string; expertise?: string } | null;
  updatedAt: string;
}

// ====== Course Categories ======
const courseCategories: Record<string, { Stacks: string[] }> = {
  "Full Stack Web Development": {
    Stacks: [
      "MERN Stack (MongoDB, Express, React, Node.js)",
      "MEAN Stack (MongoDB, Express, Angular, Node.js)",
      "Python Full Stack (Django + React / Angular)",
      "Spring Boot + React / Angular",
      "LAMP Stack (Linux, Apache, MySQL, PHP)",
      "Next.js + NestJS + PostgreSQL",
      "Ruby on Rails + React",
      "T3 Stack (Next.js + Prisma + tRPC + Tailwind)",
    ],
  },
};

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [category, setCategory] = useState("");
  const [courseName, setCourseName] = useState("");

  const router = useRouter();

  // ====== Fetch Students ======
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", "6");
        if (category) params.append("category", category);
        if (courseName) params.append("courseName", courseName);

        const { data } = await axios.get(
          `http://localhost:9999/api/admin/students/valid?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStudents(data.students || []);
        setPagination(data.pagination || null);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page, category, courseName]);

  // 🔹 Local search filter
  const filteredStudents = students.filter(
    (s) =>
      s.student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.assignedMentor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ====== UI ======
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#1887A1]">
        Loading students...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-[#0D4C5B] mb-6">
        Approved Students
      </h1>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by student name, email, or mentor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCourseName("");
            setPage(1);
          }}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {Object.keys(courseCategories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={courseName}
          onChange={(e) => {
            setCourseName(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded"
          disabled={!category}
        >
          <option value="">All Courses</option>
          {category &&
            courseCategories[category].Stacks.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
        </select>
      </div>

      {/* Student Cards */}
      {filteredStudents.length === 0 ? (
        <p className="text-gray-600">No students found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((s) => (
            <div
              key={s._id}
              onClick={() => router.push(`/Admin/students/${s.student._id}`)}
              className="bg-white p-5 rounded-2xl shadow-md border 
                         hover:shadow-lg cursor-pointer transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#0D4C5B]">
                  {s.student.name || "Unnamed Student"}
                </h2>
                <span className="text-xs px-2 py-1 rounded bg-[#E0F7FA] text-[#0D4C5B]">
                  {s.category}
                </span>
              </div>

              {/* Email */}
              <p className="text-sm text-gray-500 mt-1">{s.student.email}</p>

              {/* Details */}
              <div className="mt-3 text-sm text-gray-700 space-y-2">
                <p>
                  <span className="font-semibold">Student ID:</span> {s.student._id}
                </p>
                <p>
                  <span className="font-semibold">Request ID:</span> {s._id}
                </p>
                <p>
                  <span className="font-semibold">Stack:</span> {s.stack}
                </p>
                <p>
                  <span className="font-semibold">Mentor:</span>{" "}
                  {s.assignedMentor?.fullName || "Not assigned"}
                </p>
                {s.assignedMentor?.expertise && (
                  <p>
                    <span className="font-semibold">Mentor Expertise:</span>{" "}
                    {s.assignedMentor.expertise}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Last Updated:</span>{" "}
                  {new Date(s.updatedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Action button */}
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-[#1887A1] text-white rounded-lg text-sm hover:bg-[#0D4C5B] transition"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    router.push(`/Admin/students/${s.student._id}`);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 bg-[#0D4C5B] text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-[#1887A1] text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
