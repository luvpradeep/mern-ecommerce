import { useState } from "react";
import api from "../../services/api";
import "./AdminProductCreate.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminProductCreate() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");

  const uploadHandler = async (e) => {
    const formData = new FormData();

    formData.append("image", e.target.files[0]);

    try {
      const { data } = await api.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setImage(data.imageUrl);

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.log(error);
      toast.error("Image upload failed");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {

      await api.post(
        "/admin/products",
        {
          name,
          price,
          image,
          category,
          description,
          stock,
        },);

      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="create-product">
      <h1>Add Product</h1>

      <form onSubmit={submitHandler} className="product-form">
        <div className="image-section">
          <div className="image-preview">
            {image ? (
              <img src={image} alt="Preview" className="product-preview" />
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

          <button type="submit">Add Product</button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductCreate;
