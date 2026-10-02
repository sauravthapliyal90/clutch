import React from "react";

function UsersList({ user, onApprove, isApproving }) {
    return (
        <div className="flex gap-2 border-[0.2px] p-4 border-white/20 items-center justify-between">

            {/* User information */}
            <div className="flex flex-col gap-1">
                <h1 className="text-md font-bold uppercase">
                    {user.name || "No name"}
                </h1>

                <p className="text-xs font-light">
                    {user.email || "No email"}
                </p>

                <p className="text-xs font-light">
                    {user.phone || "No phone"}
                </p>
            </div>

            {/* Role */}


            {/* Actions */}
            <div className="flex gap-2 items-center">
                <button
                    onClick={onApprove}
                    disabled={isApproving}
                    className={`border-[0.2px] ${user.role=="HOST"? "bg-red-500" : null} py-1 px-2 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                >
                    {isApproving ? "APPROVING..." : "HOST"}
                </button>

                <button
                    className="border-[0.2px] py-1 px-2 border-white/20 cursor-pointer"
                >
                    USER
                </button>

            </div>

        </div>
    );
}

export default UsersList;