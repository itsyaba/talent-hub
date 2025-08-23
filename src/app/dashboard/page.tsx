"use client";

import { useSession } from "@/hooks/use-session";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = () => {
  const { data: session, isPending: loading } = useSession();
  if (loading) return <div>Loading...</div>;
  if (session?.user.role === "employer") {
    return redirect("/dashboard/employer");
  } else {
    return redirect("/dashboard/talent");
  }
};

export default DashboardPage;
