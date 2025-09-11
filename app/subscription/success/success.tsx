"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id");

    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setStatus("failed");
                return;
            }
            
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscription/verify-session?session_id=${sessionId}`);
                const data = await res.json();

                if (data.success) {
                    setStatus("success");
                    setTimeout(() => router.push("/StudentHome"), 4000);
                } else {
                    setStatus("failed");
                }
            } catch (err) {
                console.error("Verification error:", err);
                setStatus("failed");
            }
        };

        verifyPayment();
    }, [sessionId, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-white p-4">
            {status === "loading" && (
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-6"></div>
                    <h2 className="text-xl font-semibold text-blue-700">Verifying your payment...</h2>
                    <p className="text-gray-600 mt-2">Please wait a moment</p>
                </div>
            )}

            {status === "success" && (
                <div className="text-center">
                    <div className="text-green-500 text-6xl mb-4">🎉</div>
                    <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                    <p className="text-gray-700 mb-4">You now have Premium access 🎯</p>
                    <p className="text-gray-500">Redirecting to your dashboard...</p>
                </div>
            )}

            {status === "failed" && (
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h1 className="text-3xl font-bold mb-2">Payment Verification Failed</h1>
                    <p className="text-gray-700 mb-4">Something went wrong with your payment.</p>
                    <button
                        onClick={() => router.push("/subscription")}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
