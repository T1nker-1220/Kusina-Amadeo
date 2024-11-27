"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import ProductForm from "@/components/admin/ProductForm";
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  isAvailable: boolean;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  isAvailable: boolean;
  [key: string]: string | boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FormData | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    const formData: FormData = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      isAvailable: product.isAvailable
    };
    setEditingProduct(formData);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      const response = await fetch(
        editingProduct ? `/api/admin/products/${editingProduct._id}` : "/api/admin/products",
        {
          method: editingProduct ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        await fetchProducts();
        setShowForm(false);
        setEditingProduct(undefined);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-900 dark:to-brand-900/50">
        <div className="pt-24 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <div className="inline-block w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-brand-600 dark:text-brand-400 animate-pulse">Loading products...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-900 dark:to-brand-900/50">
      <div className="pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-display font-bold text-brand-700 dark:text-brand-300 mb-4"
            >
              Product Management
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-center max-w-4xl mx-auto mb-6"
            >
              <div className="relative flex-1 max-w-xl">
                <input
                  type="text"
                  placeholder="Search products..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:text-brand-100"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-400 dark:text-brand-500" />
              </div>
              
              <button
                onClick={() => {
                  setEditingProduct(undefined);
                  setShowForm(true);
                }}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors duration-200"
              >
                <FiPlus className="mr-2 -ml-1 h-4 w-4" />
                Add Product
              </button>
            </motion.div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="bg-white dark:bg-brand-800 shadow-xl rounded-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-200 dark:divide-brand-700">
                <thead className="bg-brand-50 dark:bg-brand-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 dark:text-brand-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 dark:text-brand-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 dark:text-brand-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 dark:text-brand-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 dark:text-brand-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-brand-800 divide-y divide-brand-200 dark:divide-brand-700">
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.tr
                        key={product._id}
                        variants={item}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={product.image || "/placeholder.png"}
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-brand-900 dark:text-brand-100">
                                {product.name}
                              </div>
                              <div className="text-sm text-brand-500 dark:text-brand-400">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-brand-500 dark:text-brand-400">
                            {product.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-brand-500 dark:text-brand-400">
                            ₱{product.price}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.isAvailable
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}>
                            {product.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-200 mr-3"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white dark:bg-brand-800"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-brand-900 dark:text-brand-100">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(undefined);
                }}
                className="text-brand-500 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-200"
              >
                ×
              </button>
            </div>
            <ProductForm
              onSubmit={handleFormSubmit}
              initialData={editingProduct}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(undefined);
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
