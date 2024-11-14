"use client";

import axios from "axios";
import React, {useEffect, useState} from "react";
import ReadMoreReact from "read-more-react";

const Page = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    productname: "",
    description: "",
    addprice: "",
    imageurl: "",
    category: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product");
        console.log(response.data.data);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const {name, value} = e.target;
    if (name === "imageurl") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct((prev) => ({...prev, imageurl: reader.result}));
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setNewProduct((prev) => ({...prev, [name]: value}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await axios.put("/api/product", {
          id: editProductId,
          ...newProduct,
        });
        setData((prev) =>
          prev.map((item) =>
            item._id === editProductId ? response.data.data : item
          )
        );
      } else {
        const response = await axios.post("/api/product", newProduct);
        setData((prev) => [...prev, response.data.data]);
      }

      // Reset form
      setNewProduct({
        productname: "",
        description: "",
        addprice: "",
        imageurl: "",
        category: "",
      });
      setIsEditing(false);
      setEditProductId(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const deleteProduct = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete("/api/product", {data: {id}});
        setData((prev) => prev.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (product) => {
    setNewProduct(product);
    setIsEditing(true);
    setEditProductId(product._id);
  };

  return (
    <>
      <h1 className="text-3xl font-semibold text-gray-800">
        Product Management
      </h1>
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="productname"
            value={newProduct.productname}
            onChange={handleChange}
            placeholder="Enter product name"
            className="border border-gray-300 rounded p-2 w-full mb-4"
          />
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleChange}
            placeholder="Add the description about product"
            className="border border-gray-300 rounded p-2 w-full mb-4"
            rows="4"
          />
          <input
            type="text"
            name="addprice"
            value={newProduct.addprice}
            onChange={handleChange}
            placeholder="Add price"
            className="border border-gray-300 rounded p-2 w-full mb-4"
          />
          <select
            name="category"
            value={newProduct.category}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full mb-4"
          >
            <option value="">Select a category</option>
            {categories &&
              categories.map((category) => (
                <option
                  key={category.categoriename}
                  value={category.categoriename}
                >
                  {category.categoriename}
                </option>
              ))}
          </select>
          <input
            type="file"
            name="imageurl"
            // accept="image/*"
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full mb-4"
          />
          <button className="w-full bg-blue-600 text-white font-semibold rounded p-2 hover:bg-blue-700 transition duration-300">
            {isEditing ? "Update Product" : "Save Product"}
          </button>
        </form>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Product List</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Product Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((product) => (
                  <tr key={product?._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {product?.productname || "No name available"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <ReadMoreReact
                        text={product?.description || "No description"}
                      />
                    </td>
                    <td className="py-2 px-4 border-b">
                      ₹{product?.addprice || "0"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {product?.category || "Uncategorized"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {product?.imageurl ? (
                        <img
                          src={product.imageurl}
                          alt={product?.productname}
                          className="w-20 h-20 object-cover"
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="bg-green-500 text-white font-semibold rounded p-2 mr-2 hover:bg-green-600 transition duration-300"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product?._id)}
                        className="bg-red-500 text-white font-semibold rounded p-2 hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Page;
