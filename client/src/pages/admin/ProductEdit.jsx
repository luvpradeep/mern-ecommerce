import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminProductCreate.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `http://localhost:5000/api/admin/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setName(data.product.name);
      setPrice(data.product.price);
      setImage(data.product.image);
      setCategory(data.product.category);
      setDescription(data.product.description);
      setStock(data.product.stock);
    } catch (error) {
      toast.error("Failed to load product");
    }
  };

  const uploadHandler = async (e) => {
    const formData = new FormData();

    formData.append("image", e.target.files[0]);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setImage(data.imageUrl);

      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/products/${id}`,
        {
          name,
          price,
          image,
          category,
          description,
          stock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Product updated");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="create-product">
      <h1>Edit Product</h1>

      <form onSubmit={updateHandler} className="product-form">
        <div className="image-section">
          <div className="image-preview">
            {image ? (
              <img src={image} alt="preview" className="product-preview" />
            ) : (
              <span>No Image Selected</span>
            )}
          </div>

          <input type="file" onChange={uploadHandler} />
        </div>

        <div className="details-section">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <button type="submit">Update Product</button>
        </div>
      </form>
    </div>
  );
}

export default ProductEdit;
