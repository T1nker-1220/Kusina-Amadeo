"use client";

import { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  isAvailable: boolean;
  [key: string]: string | boolean;
}

interface ProductFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  initialData?: FormData;
}

const categories = [
  { value: "Budget Meals", label: "Budget Meals" },
  { value: "Silog Meals", label: "Silog Meals" },
  { value: "Ala Carte", label: "Ala Carte" },
  { value: "Beverages", label: "Beverages" }
];

const initialFormData: FormData = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  isAvailable: true,
};

const formFields = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export default function ProductForm({ onSubmit, onCancel, initialData }: ProductFormProps) {
  const [formData, setFormData] = useState<FormData>({ ...initialFormData, ...initialData });
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev: FormData) => ({ ...prev, image: data.url }));
        setImagePreview(data.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <motion.div variants={formFields} custom={0}>
        <label className="block text-sm font-medium text-brand-700 dark:text-brand-300">Product Image</label>
        <div className="mt-1 flex items-center space-x-4">
          <div className="h-32 w-32 relative rounded-lg border border-brand-200 dark:border-brand-700 overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Product preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-brand-50 dark:bg-brand-800 flex items-center justify-center">
                <FiUpload className="h-6 w-6 text-brand-400 dark:text-brand-500" />
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-brand-900 bg-opacity-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer py-2 px-3 border border-brand-200 dark:border-brand-700 rounded-lg text-sm font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors duration-200"
          >
            Change Image
          </label>
        </div>
      </motion.div>

      <motion.div variants={formFields} custom={1}>
        <label htmlFor="name" className="block text-sm font-medium text-brand-700 dark:text-brand-300">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:focus:border-brand-400 dark:focus:ring-brand-400"
        />
      </motion.div>

      <motion.div variants={formFields} custom={2}>
        <label htmlFor="description" className="block text-sm font-medium text-brand-700 dark:text-brand-300">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:focus:border-brand-400 dark:focus:ring-brand-400"
        />
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div variants={formFields} custom={3}>
          <label htmlFor="price" className="block text-sm font-medium text-brand-700 dark:text-brand-300">
            Price
          </label>
          <div className="mt-1 relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-brand-500 dark:text-brand-400 sm:text-sm">₱</span>
            </div>
            <input
              type="number"
              name="price"
              id="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="block w-full pl-7 rounded-lg border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:focus:border-brand-400 dark:focus:ring-brand-400"
            />
          </div>
        </motion.div>

        <motion.div variants={formFields} custom={4}>
          <label htmlFor="category" className="block text-sm font-medium text-brand-700 dark:text-brand-300">
            Category
          </label>
          <select
            name="category"
            id="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:focus:border-brand-400 dark:focus:ring-brand-400"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      <motion.div variants={formFields} custom={5} className="flex items-center">
        <input
          type="checkbox"
          name="isAvailable"
          id="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
          className="h-4 w-4 rounded border-brand-300 dark:border-brand-600 text-brand-600 dark:text-brand-500 focus:ring-brand-500 dark:focus:ring-brand-400"
        />
        <label htmlFor="isAvailable" className="ml-2 block text-sm text-brand-700 dark:text-brand-300">
          Available for ordering
        </label>
      </motion.div>

      <motion.div variants={formFields} custom={6} className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-brand-200 dark:border-brand-700 rounded-lg text-sm font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors duration-200"
        >
          {initialData ? "Update Product" : "Create Product"}
        </button>
      </motion.div>
    </motion.form>
  );
}
