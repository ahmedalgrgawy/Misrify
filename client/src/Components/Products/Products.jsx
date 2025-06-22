import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  getAllProducts,
  createProduct,
  editProduct,
} from "../../features/adminProductsSlice";
import {
  getMerchantProducts,
  deleteMerchantProduct,
  createMerchantProduct,
  editMerchantProduct,
} from "../../features/merchantProductSlice";
import { getAllBrands } from "../../features/brandSlice";
import { getAllCategories } from "../../features/categorySlice";
import { TailSpin } from "react-loader-spinner";
import { FaEdit, FaTrashAlt, FaPlus, FaTimes } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { unwrapResult } from "@reduxjs/toolkit";
import productImg from "../../assets/product.png";
import Resizer from "react-image-file-resizer";

const colorPalette = [
  { name: "red", hex: "#EF4444" },
  { name: "green", hex: "#22C55E" },
  { name: "blue", hex: "#3B82F6" },
  { name: "navy", hex: "#1E3A8A" },
  { name: "teal", hex: "#14B8A6" },
  { name: "orange", hex: "#F97316" },
  { name: "yellow", hex: "#EAB308" },
  { name: "purple", hex: "#A855F7" },
  { name: "pink", hex: "#EC4899" },
  { name: "black", hex: "#111827" },
  { name: "white", hex: "#FFFFFF" },
  { name: "gray", hex: "#6B7280" },
];

const colorClassMap = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  navy: "bg-indigo-900",
  teal: "bg-teal-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  black: "bg-gray-900",
  white: "bg-white border border-gray-300",
  gray: "bg-gray-500",
};

const Products = () => {
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    brandId: "",
    description: "",
    quantityInStock: 0,
    price: 0,
    colors: [], // Array of color names (e.g., ["red", "blue"])
    sizes: "",
    isDiscounted: false,
    discountAmount: 0,
    imgUrl: "",
  });

  const brands = useSelector((state) => state.Brands?.brands ?? []);
  const categories = useSelector((state) => state.Categories?.categories ?? []);
  const brandsLoading = useSelector((state) => state.Brands?.loading ?? false);
  const categoriesLoading = useSelector((state) => state.Categories?.loading ?? false);
  const user = useSelector((state) => state.auth.user);
  const userRole = useSelector((state) => state.auth.user?.role);
  const products = useSelector((state) => {
    if (userRole === "merchant") {
      return state.merchantProducts?.products ?? [];
    }
    return state.products?.products ?? [];
  });
  const loading = useSelector((state) => {
    if (userRole === "merchant") {
      return state.merchantProducts?.loading ?? false;
    }
    return state.products?.loading ?? false;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userRole === "merchant") {
          await Promise.all([
            dispatch(getMerchantProducts()),
            dispatch(getAllBrands()),
            dispatch(getAllCategories()),
          ]);
        } else if (userRole === "admin") {
          await Promise.all([
            dispatch(getAllProducts()),
            dispatch(getAllBrands()),
            dispatch(getAllCategories()),
          ]);
        }
      } catch (err) {
        setError("Failed to load data. Please try again.");
      }
    };
    fetchData();
  }, [dispatch, userRole, isSubmitting, user]);

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
    setError(null);
    setSuccess(null);
  };

  const handleConfirmDelete = async () => {
    try {
      if (userRole === "merchant") {
        await unwrapResult(dispatch(deleteMerchantProduct(productToDelete)));
      } else {
        await unwrapResult(dispatch(deleteProduct(productToDelete)));
      }
      setSuccess("Product deleted successfully");
      if (userRole === "merchant") {
        dispatch(getMerchantProducts());
      } else {
        dispatch(getAllProducts());
      }
    } catch (err) {
      setError(err.message || "Failed to delete product. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product?.name || "",
      categoryId: product?.category?._id || "",
      brandId: product?.brand?._id || "",
      description: product?.description || "",
      quantityInStock: product?.quantityInStock || 0,
      price: product?.price || 0,
      colors: Array.isArray(product?.colors) ? product.colors : [],
      sizes: Array.isArray(product?.sizes) ? product.sizes.join(", ") : "",
      isDiscounted: product?.isDiscounted || false,
      discountAmount: product?.discountAmount || 0,
      imgUrl: product?.imgUrl || "",
    });
    setShowEditModal(true);
    setError(null);
    setSuccess(null);
  };

  const handleCreateClick = () => {
    setFormData({
      name: "",
      categoryId: "",
      brandId: userRole === "merchant" && user?.brand?._id ? user.brand._id : "",
      description: "",
      quantityInStock: 0,
      price: 0,
      colors: [],
      sizes: "",
      isDiscounted: false,
      discountAmount: 0,
      imgUrl: "",
    });
    setShowCreateModal(true);
    setError(null);
    setSuccess(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleColor = (colorName) => {
    setFormData((prev) => {
      const newColors = prev.colors.includes(colorName)
        ? prev.colors.filter((c) => c !== colorName)
        : [...prev.colors, colorName];
      return { ...prev, colors: newColors };
    });
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        Resizer.imageFileResizer(
          file,
          300,
          300,
          "JPEG",
          80,
          0,
          (uri) => {
            setFormData((prev) => ({ ...prev, imgUrl: uri }));
          },
          "base64"
        );
      } catch (err) {
        console.error("Error processing image:", err);
        setError("Failed to process image. Please try again.");
      }
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Product name is required.");
      return false;
    }
    if (!formData.categoryId) {
      setError("Category is required.");
      return false;
    }
    if (userRole === "admin") {
      if (!formData.brandId) {
        setError("Brand is required.");
        return false;
      }
    }
    if (!formData.description.trim()) {
      setError("Description is required.");
      return false;
    }
    if (formData.price <= 0) {
      setError("Price must be greater than 0.");
      return false;
    }
    if (formData.quantityInStock < 0) {
      setError("Quantity cannot be negative.");
      return false;
    }
    if (formData.isDiscounted && formData.discountAmount <= 0) {
      setError("Discount amount must be greater than 0 when discounted is checked.");
      return false;
    }
    // Validate colors
    if (formData.colors.length > 0) {
      const invalidColor = formData.colors.find(
        (c) => !colorPalette.some((p) => p.name === c)
      );
      if (invalidColor) {
        setError("Invalid color selected. Please choose from the palette.");
        return false;
      }
      const uniqueColors = new Set(formData.colors);
      if (uniqueColors.size !== formData.colors.length) {
        setError("Duplicate colors are not allowed.");
        return false;
      }
    }
    // Validate sizes
    if (formData.sizes) {
      const sizesArray = formData.sizes.split(",").map((s) => s.trim()).filter((s) => s);
      if (sizesArray.some((s) => !/^[a-zA-Z0-9\s]+$/.test(s))) {
        setError("Sizes must contain only letters, numbers, and spaces (e.g., S, M, L).");
        return false;
      }
    }
    return true;
  };

  const handleFormSubmit = async (e, actionType) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const sizesArray = formData.sizes
        ? formData.sizes.split(",").map((s) => s.trim()).filter((s) => s)
        : [];

      const dataToSend = {
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        brandId: userRole === "merchant" ? getBrandNameByOwnerId(user._id)._id : formData.brandId,
        description: formData.description.trim(),
        quantityInStock: Number(formData.quantityInStock),
        price: Number(formData.price),
        colors: formData.colors,
        sizes: sizesArray,
        isDiscounted: formData.isDiscounted,
        discountAmount: Number(formData.discountAmount),
        imgUrl: formData.imgUrl,
      };

      if (actionType === "edit") {
        const action = userRole === "merchant" ? editMerchantProduct : editProduct;
        await unwrapResult(
          dispatch(
            action({
              productId: selectedProduct._id,
              updatedData: dataToSend,
            })
          )
        );
        setSuccess("Product updated successfully");
        setShowEditModal(false);
      } else {
        const action = userRole === "merchant" ? createMerchantProduct : createProduct;
        await unwrapResult(dispatch(action(dataToSend)));
        if (userRole === "merchant") {
          setSuccess("Product Requested successfully");
        }
        setSuccess("Product created successfully");
        setShowCreateModal(false);
      }

      if (userRole === "merchant") {
        dispatch(getMerchantProducts());
      } else {
        dispatch(getAllProducts());
      }
    } catch (err) {
      setError(err.message || "Operation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBrandNameByOwnerId = (id) => {
    if (brandsLoading) return { name: "Loading brand...", _id: "" };
    const brand = brands.find((b) => b.owner?._id === id);
    return brand || { name: "Brand not found", _id: "" };
  };

  const arrProducts = Array.isArray(products) ? products : [];

  const renderProductModal = (actionType) => {
    const isEdit = actionType === "edit";
    const title = isEdit ? "Edit Product" : "Create New Product";
    const submitText = isEdit ? "Update" : "Create";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl relative">
          <button
            type="button"
            onClick={() => (isEdit ? setShowEditModal(false) : setShowCreateModal(false))}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <FaTimes size={20} />
          </button>
          <h2 className="text-2xl font-semibold text-title-blue mb-4">{title}</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}
          <form onSubmit={(e) => handleFormSubmit(e, actionType)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  aria-label="Upload product image"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  placeholder="Enter product name"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  onChange={handleFormChange}
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {userRole === "admin" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <select
                    name="brandId"
                    value={formData.brandId}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    required
                    aria-required="true"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {userRole === "merchant" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    name="brandId"
                    value={getBrandNameByOwnerId(user._id).name}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                    aria-readonly="true"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                  aria-required="true"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                placeholder="Enter product description"
                className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
                onChange={handleFormChange}
                required
                rows={3}
                aria-required="true"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  placeholder="Enter price"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantityInStock"
                  value={formData.quantityInStock}
                  placeholder="Enter stock quantity"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  onChange={handleFormChange}
                  min="0"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Colors
                </label>
                <div className="grid grid-cols-6 gap-2 mb-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => toggleColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 ${formData.colors.includes(color.name)
                        ? "border-main-blue ring-2 ring-main-blue"
                        : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-main-blue`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Select ${color.name}`}
                    ></button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((colorName, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full"
                    >
                      <span
                        className="w-3 h-3 rounded-full mr-1"
                        style={{
                          backgroundColor: colorPalette.find((c) => c.name === colorName)?.hex,
                        }}
                      ></span>
                      {colorName}
                      <button
                        type="button"
                        onClick={() => toggleColor(colorName)}
                        className="ml-1 text-gray-500 hover:text-red-600"
                        aria-label={`Remove ${colorName}`}
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sizes (comma separated)
                </label>
                <input
                  name="sizes"
                  value={formData.sizes}
                  placeholder="e.g., S, M, L, XL"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  onChange={handleFormChange}
                  aria-label="Enter sizes"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDiscounted"
                  checked={formData.isDiscounted}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-main-blue border-gray-300 rounded focus:ring-main-blue"
                  aria-label="Apply discount"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Apply Discount
                </label>
              </div>
              {formData.isDiscounted && (
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Amount ($)
                  </label>
                  <input
                    type="number"
                    name="discountAmount"
                    value={formData.discountAmount}
                    placeholder="Enter discount"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    onChange={handleFormChange}
                    min="0"
                    step="0.01"
                    aria-label="Discount amount"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => (isEdit ? setShowEditModal(false) : setShowCreateModal(false))}
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 shadow-sm disabled:opacity-50 text-sm font-medium"
                disabled={isSubmitting}
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-main-blue text-white py-2 px-4 rounded-lg hover:bg-title-blue transition duration-300 shadow-sm disabled:opacity-50 text-sm font-medium"
                disabled={isSubmitting}
                aria-label={submitText}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <TailSpin color="#FFFFFF" height={20} width={20} />
                    <span className="ml-2">Processing...</span>
                  </span>
                ) : (
                  submitText
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-bg-second">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h3 className="text-3xl font-bold text-title-blue">
          {userRole === "merchant" ? "Approved Products" : "Products"}
        </h3>
        <button
          onClick={handleCreateClick}
          className="btn text-lg hover:bg-main-blue bg-title-blue text-white p-3 rounded-3xl flex items-center gap-2"
        >
          <FaPlus /> Add Product
        </button>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg border border-green-200">
          {success}
        </div>
      )}
      {loading || brandsLoading || categoriesLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <TailSpin color="#2B3D5B" height={100} width={100} />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-light-grey">
          <table className="min-w-full text-left">
            <thead className="text-sm text-main-blue border-b-4">
              <tr className="bg-[#F7F8FA]">
                <th className="py-4 px-6 text-center">Image</th>
                <th className="py-4 px-6 text-center">Product Name</th>
                <th className="py-4 px-6 text-center">Category</th>
                <th className="py-4 px-6 text-center">
                  {userRole === "merchant" ? "Approved" : "Brand"}
                </th>
                <th className="py-4 px-6 text-center">Price</th>
                <th className="py-4 px-6 text-center">Quantity</th>
                <th className="py-4 px-6 text-center">Colors</th>
                <th className="py-4 px-6 text-center">Sizes</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {arrProducts.length > 0 ? (
                arrProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className={index % 2 !== 0 ? "bg-[#F9F9FF]" : ""}
                  >
                    <td className="py-4 px-6 w-16 h-16 mx-auto box-content flex justify-center">
                      <img
                        src={product?.imgUrl || productImg}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    </td>
                    <td className="py-4 px-6 text-main-blue text-center">
                      {product.name}
                    </td>
                    <td className="py-4 px-6 text-main-blue text-center">
                      {product.category?.name || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-main-blue text-center">
                      {userRole === "merchant" ? (product.isApproved ? "Yes" : "No") : product.brand?.name || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-main-blue text-center">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-main-blue text-center">
                      {product.quantityInStock}
                    </td>
                    <td>
                      <div className="py-4 px-6 flex justify-evenly items-center">
                        {Array.isArray(product.colors) && product.colors.length > 0 ? (
                          product.colors.map((color, i) => (
                            <span
                              key={i}
                              className={`w-5 h-5 rounded-full ${colorClassMap[color] || "bg-gray-500"} transition duration-300 transform hover:scale-125`}
                            ></span>
                          ))
                        ) : (
                          <span className="text-main-blue text-center">
                            No colors
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-main-blue text-center">
                      {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                        product.sizes.join(", ")
                      ) : (
                        "No sizes"
                      )}
                    </td>
                    <td>
                      <div className="py-4 px-6 text-center space-x-4 flex justify-center items-center">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-blue-900 hover:text-main-blue transition duration-300 transform hover:scale-110"
                          data-tooltip-id="Edit"
                          data-tooltip-content="Edit"
                          data-tooltip-place="bottom"
                          aria-label="Edit product"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product._id)}
                          className="text-red-500 hover:text-red-600 transition duration-300 transform hover:scale-110"
                          data-tooltip-place="bottom"
                          data-tooltip-id="Delete"
                          data-tooltip-content="Delete"
                          aria-label="Delete product"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-title-blue py-4">
                    No Products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
              <div className="bg-white p-12 rounded-lg shadow-xl w-2xl">
                <h3 className="text-lg font-semibold text-main-blue mb-10">
                  Are you sure you want to delete this product?
                </h3>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 shadow-sm text-sm font-medium"
                    aria-label="Cancel deletion"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 shadow-sm text-sm font-medium"
                    aria-label="Confirm deletion"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {showCreateModal && renderProductModal("create")}
      {showEditModal && renderProductModal("edit")}
      <Tooltip id="Edit" className="!py-1 !px-2 !bg-title-blue !rounded-md" />
      <Tooltip id="Delete" className="!py-1 !px-2 !bg-red-600 !rounded-md" />
    </div>
  );
};

export default Products;