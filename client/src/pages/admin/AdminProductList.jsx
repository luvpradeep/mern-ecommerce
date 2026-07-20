import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminProductList.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const navigate = useNavigate();

  const deleteHandler = async (id) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone.",
      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",

      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",

      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product deleted successfully");

      fetchProducts();
    } catch (error) {
      console.log(error);

      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      "http://localhost:5000/api/admin/products",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setProducts(data.products);
    setStats(data.stats);
  };

  const filteredProducts = products.filter((product) => {
    const keyword = search.trim().toLowerCase();

    const matchSearch =
      keyword === "" || product.name.toLowerCase().includes(keyword);

    const matchCategory = category === "All" || product.category === category;

    let stockStatus = "In Stock";

    if (product.stock === 0) stockStatus = "Out of Stock";
    else if (product.stock < 5) stockStatus = "Low Stock";

    const matchStatus = status === "All" || status === stockStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="admin-table-page">
      <div className="page-header">
        <h1>Manage Products</h1>
        <p>Manage, Add, Edit and Delete Products</p>
      </div>

      <div className="product-stats">
        <div className="product-stat-card total">
          <h3>Total Products</h3>
          <h2>{stats.totalProducts}</h2>
        </div>

        <div className="product-stat-card stock">
          <h3>In Stock</h3>
          <h2>{stats.inStock}</h2>
        </div>

        <div className="product-stat-card low">
          <h3>Low Stock</h3>
          <h2>{stats.lowStock}</h2>
        </div>

        <div className="product-stat-card out">
          <h3>Out of Stock</h3>
          <h2>{stats.outOfStock}</h2>
        </div>
      </div>

        <div className="product-toolbar">
          <input
            className="search-bar"
            placeholder="🔍 Search Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>

            {[...new Set(products.map((p) => p.category))].map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>

            <option>In Stock</option>

            <option>Low Stock</option>

            <option>Out of Stock</option>
          </select>

          <button
            className="add-product-btn"
            onClick={() => navigate("/admin/product/create")}
          >
            + Add Product
          </button>
        </div>
      

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Reviews</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td data-label="Name">{product.name}</td>

              <td data-label="Price">₹{product.price}</td>

              <td data-label="Category">{product.category}</td>

              <td data-label="Stock">
                {product.stock === 0 ? (
                  <span className="stock-badge out">Out of Stock</span>
                ) : product.stock < 5 ? (
                  <span className="stock-badge low">Low ({product.stock})</span>
                ) : (
                  <span className="stock-badge good">
                    {product.stock} Available
                  </span>
                )}
              </td>

              <td data-label="Reviews">{product.numReviews}</td>

              <td data-label="Rating">{product.rating?.toFixed(1)}</td>

              <td data-label="Actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteHandler(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductList;
