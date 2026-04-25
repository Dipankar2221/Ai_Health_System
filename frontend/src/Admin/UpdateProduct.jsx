import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import {
  updateProduct,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";
import { getProductDetails } from "../features/products/productSlice";

import { toast } from "react-toastify";

const UpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product } = useSelector((state) => state.product);
  const { loading, error, success } = useSelector((state) => state.admin);

  const [name, setName] = useState("");
  const [price, setprice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [oldImage, setOldImage] = useState([]);
  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Load product
  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);

  // Pre-fill form
  useEffect(() => {
    if (product) {
      setName(product.name);
      setprice(product.price);
      setDescription(product.description);
      setCategory(product.category);
      setStock(product.stock);
      setOldImage(product.image || []);
    }
  }, [product]);

  // NEW images handling
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImage([]);
    setImagePreview([]);

    files.forEach((file) => {
      setImage((prev) => [...prev, file]);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Submit
const handleSubmit = (e) => {
  e.preventDefault();

 const formData = new FormData();
formData.append("name", name);
formData.append("description", description);
formData.append("price", price);
formData.append("category", category);
formData.append("stock", stock);

image.forEach((img) => {
  formData.append("images", img);
});

dispatch(updateProduct({ id, formData }));
};


  // Toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("Product updated successfully");
      dispatch(removeSuccess());
      navigate("/admin/products");
    }
  }, [error, success, dispatch, navigate]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Update Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="text"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
        />

        <input
          type="number"
          className="border p-2 rounded"
          value={price}
          onChange={(e) => setprice(e.target.value)}
          placeholder="Product Price"
        />

        <input
          type="number"
          className="border p-2 rounded"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Product Stock"
        />

        <input
          type="text"
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Product Category"
        />

        <textarea
          className="border p-2 rounded"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product Description"
        ></textarea>

        {/* OLD IMAGES */}
        <div>
          <h3 className="font-semibold mb-2">Existing Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {oldImage.map((img, i) => (
              <img
                key={i}
                src={img.url}
                className="w-full h-32 object-cover border rounded"
                alt="Old"
              />
            ))}
          </div>
        </div>

        {/* NEW IMAGE UPLOAD */}
        <div>
          <h3 className="font-semibold mb-2">Upload New Images</h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 rounded w-full"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            {imagePreview.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-full h-32 object-cover rounded border"
                alt="Preview"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
