import React, { useState } from "react";
import Analytics from "../components/Analytics";
import { useDashboardStats, useUsersList, useApproveHost } from "../hooks/useAdmin";
import UsersList from "../components/dashboard/UsersList";

const STAT_ITEMS = [
  { key: "totalUsers", label: "Total users" },
  { key: "totalHost", label: "Total hosts" },
  { key: "totalMeets", label: "Total meets" },
  { key: "upcomingMeets", label: "Upcoming meets" },
  { key: "totalRegistrations", label: "Registrations" },
  { key: "activeSubscriptions", label: "Active subscriptions" },
];

const limit = 10;

function AdminDashboard() {
  const [page, setPage] = useState(1);
  const [approvingUserId, setApprovingUserId] = useState(null);

  // Users list
  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useUsersList({
    page,
    limit,
  });

  // Dashboard stats
  const {
    data,
    isLoading,
    isError,
  } = useDashboardStats();

  // Approve host mutation
  const { mutate: approveHost } = useApproveHost();

  const handleApprove = (userId) => {
    setApprovingUserId(userId);

    approveHost(
      { userId },
      {
        onSuccess: () => {
          console.log("Host approved successfully");
        },

        onError: (error) => {
          console.error("Failed to approve host:", error);
        },

        onSettled: () => {
          setApprovingUserId(null);
        },
      }
    );
  };

  console.log("USER DATA --->", userData);
  console.log("USER LOADING --->", userIsLoading);
  console.log("DASHBOARD DATA --->", data);

  return (
    <div className="mx-5 flex flex-col gap-6 my-10">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-[#e21d48] tracking-[0.35em] uppercase">
          Control Room
        </p>

        <h1 className="text-3xl lg:text-5xl uppercase font-extrabold">
          Admin
        </h1>
      </div>

      {/* Dashboard statistics */}
      <Analytics
        data={data}
        isLoading={isLoading}
        StatItem={STAT_ITEMS}
        className="lg:grid-cols-3"
      />

      {/* Users */}
      <div className="mt-8">
        <h1 className="uppercase text-2xl font-bold mb-6">
          Manage Users
        </h1>

        {userIsLoading ? (
          <div>Loading users...</div>
        ) : userIsError ? (
          <div>Failed to load users.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {userData?.data?.map((user) => (
              <UsersList
                key={user.id}
                user={user}
                onApprove={() => handleApprove(user.id)}
                isApproving={approvingUserId === user.id}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminDashboard;