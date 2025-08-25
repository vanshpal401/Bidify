import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteUser, fetchAllUserData } from "@/store/slices/superAdminSlice";
import Spinner from "@/custom-components/Spinner";

const Users = () => {
  const { allUsers, loading } = useSelector((state) => state.superAdmin);
  const [localUsers, setLocalUsers] = useState([]); // Local state for real-time updates
  const dispatch = useDispatch();

  // Fetch users and set local state
  useEffect(() => {
    dispatch(fetchAllUserData());
  }, [dispatch]);

  // Sync Redux state to local state when `allUsers` changes
  useEffect(() => {
    setLocalUsers(allUsers);
  }, [allUsers]);

  const handleUserDelete = (id) => {
    // Optimistically update the local state by filtering out the deleted user
    setLocalUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));

    // Dispatch Redux action to delete the user in the backend
    dispatch(deleteUser(id));
  };

  return (
    <div className="overflow-x-auto mb-10">
      {loading ? (
        <Spinner />
      ) : (
        <table className="min-w-full bg-white border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">User Name</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {localUsers.length > 0 ? (
              localUsers.map((user) => (
                <tr key={user._id}>
                  <td className="py-2 px-4">
                    <img
                      src={user.profileImage?.public_url || "/default-avatar.png"}
                      alt={user.userName}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4">{user.userName}</td>
                  <td className="py-2 px-4">{user.role}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <Link
                      to={`/user/details/${user._id}`}
                      className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-all duration-300"
                    >
                      View
                    </Link>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-all duration-300"
                      onClick={() => handleUserDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-left text-xl text-sky-600 py-3">
                <td colSpan={4} className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
