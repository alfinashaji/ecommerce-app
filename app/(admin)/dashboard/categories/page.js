"use client";

import axios from "axios";
import React, {useEffect, useState} from "react";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({
    categoriename: "",
    categoriedescription: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/categories");
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setNewCategory((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await axios.put("/api/categories", {
          id: editCategoryId,
          ...newCategory,
        });
        setData((prev) =>
          prev.map((item) =>
            item._id === editCategoryId ? response.data.data : item
          )
        );
      } else {
        const response = await axios.post("/api/categories", newCategory);
        setData((prev) => response.data.data);
      }

      setNewCategory({
        categoriename: "",
        categoriedescription: "",
      });
      setIsEditing(false);
      setEditCategoryId(null);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const deleteCategory = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete("/api/categories", {data: {id}});
        setData((prev) => prev.filter((category) => category._id !== id));
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleEdit = (category) => {
    setNewCategory(category);
    setIsEditing(true);
    setEditCategoryId(category._id);
  };

  return (
    <>
      <div className="mt-6 bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">
          {isEditing ? "Edit Category" : "Add New Category"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="categoriename"
            value={newCategory.categoriename}
            onChange={handleChange}
            placeholder="Enter category name"
            className="border border-gray-700 bg-gray-800 text-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <textarea
            name="categoriedescription"
            value={newCategory.categoriedescription}
            onChange={handleChange}
            placeholder="Add the description about category"
            className="border border-gray-700 bg-gray-800 text-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 mt-3"
            rows="4"
          />
          <button className="w-full bg-blue-600 text-white font-semibold rounded-md py-2 hover:bg-blue-700 transition duration-300 mt-3">
            {isEditing ? "Update Category" : "Save Category"}
          </button>
        </form>
      </div>

      <div className="mt-6 bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-200 mb-4">Category List</h2>
        {loading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : (
          <table className="min-w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-700 text-gray-300">
                <th className="py-2 px-4 border-b border-gray-600">
                  Category Name
                </th>
                <th className="py-2 px-4 border-b border-gray-600">
                  Description
                </th>
                <th className="py-2 px-4 border-b border-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((category) => (
                  <tr
                    key={category.categoriename}
                    className="hover:bg-gray-600 transition duration-200"
                  >
                    <td className="py-2 px-4 border-b border-gray-600">
                      {category.categoriename}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      {category.categoriedescription}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      <button
                        className="bg-green-600 text-white font-semibold rounded p-2 mr-2 hover:bg-green-700 transition duration-300"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category._id)}
                        className="bg-red-600 text-white font-semibold rounded p-2 hover:bg-red-700 transition duration-300"
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
