import { useEffect, useState } from "react";
import api from "../../services/api";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "./UserList.css";

function UserList() {
  const [users, setUsers] = useState([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    customerUsers: 0,
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {

      const { data } = await api.get(
        "/admin/users");

      setUsers(data.users);
      setStats(data.stats);

    } catch {
      toast.error("Failed to load users");
    }
  };

  const makeAdminHandler = async (id) => {
    const result = await Swal.fire({
      title: "Make Admin?",
      text: "This user will receive admin access.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#2563eb",
    });

    if (!result.isConfirmed) return;

    try {

      const { data } = await api.put(
        `/admin/users/${id}/admin`,
        {},);

      toast.success(data.message);

      fetchUsers();

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed"
      );
    }
  };

  const deleteHandler = async (id) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {

      const { data } = await api.delete(
        `/admin/users/${id}`);

      toast.success(data.message);

      fetchUsers();

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Delete failed"
      );
    }
  };

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="admin-table-page">

      <div className="page-header">
        <h1>Manage Users</h1>
        <p>Manage customer and admin accounts.</p>
      </div>

      <div className="user-stats">

        <div className="user-stat-card total">
          <h3>Total Users</h3>
          <h2>{stats.totalUsers}</h2>
        </div>

        <div className="user-stat-card stock">
          <h3>Admins</h3>
          <h2>{stats.adminUsers}</h2>
        </div>

        <div className="user-stat-card low">
          <h3>Customers</h3>
          <h2>{stats.customerUsers}</h2>
        </div>

      </div>

      <input
        className="search-box"
        placeholder="🔍 Search by users Name or Email"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <h2>No Users Found</h2>
        </div>
      ) : (

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>Name</th>

              <th>Email</th>

              <th>Role</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.map((user) => (

              <tr key={user._id}>

                <td data-label="Name">
                  {user.name}
                </td>

                <td data-label="Email">
                  {user.email}
                </td>

                <td data-label="Role">

                  <span
                    className={
                      user.role === "admin"
                        ? "status delivered"
                        : "status processing"
                    }
                  >
                    {user.role}
                  </span>

                </td>

                <td data-label="Action">
                  <div className="action-buttons">

                  {user.role !== "admin" && (

                    <button
                      className="deliver-btn"
                      onClick={() =>
                        makeAdminHandler(user._id)
                      }
                    >
                      Make Admin
                    </button>

                  )}

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteHandler(user._id)
                    }
                  >
                    Delete
                  </button>
                </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      )}

    </div>
  );
}

export default UserList;