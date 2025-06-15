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
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { unwrapResult } from "@reduxjs/toolkit";
import productImg from "../../assets/product.png";
import Resizer from "react-image-file-resizer";

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
    colors: "",
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
  }, [dispatch, userRole]);

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
    setError(null);
    setSuccess(null);
  };

  const handleConfirmDelete = async () => {
    try {
      if (userRole === "merchant") {
        dispatch(deleteMerchantProduct(productToDelete));
      } else {
        dispatch(deleteProduct(productToDelete));
      }
      setSuccess("Product deleted successfully");
      if (userRole === "merchant") {
        dispatch(getMerchantProducts());
      } else {
        dispatch(getAllProducts());
      }
    } catch (err) {
      setError("Failed to delete product. Please try again.");
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
      colors: product?.colors?.join(", ") || "",
      sizes: product?.sizes?.join(", ") || "",
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
      //Test here >>>>>>>>>>>>>>
      // brandId: userRole === "merchant" && user?.brand?._id ? user.brand._id : "",
      brandId: userRole === "merchant" && user?.brand?._id ? user.brand._id : "",
      description: "",
      quantityInStock: 0,
      price: 0,
      colors: "",
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
      [name]: type === 'checkbox' ? checked : value,
    }));
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

  const handleFormSubmit = async (e, actionType) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const dataToSend = {
        name: formData.name,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        description: formData.description,
        quantityInStock: Number(formData.quantityInStock),
        price: Number(formData.price),
        colors: formData.colors.split(",").map(c => c.trim()),
        sizes: formData.sizes.split(",").map(s => s.trim()),
        isDiscounted: formData.isDiscounted,
        discountAmount: Number(formData.discountAmount),
        imgUrl: formData.imgUrl,
      };

      console.log(dataToSend);


      if (actionType === "edit") {
        const action = userRole === "merchant" ? editMerchantProduct : editProduct;
        const resultAction = dispatch(action({
          productId: selectedProduct._id,
          updatedData: dataToSend
        }));
        // unwrap() will throw an error if the thunk was rejected
        unwrapResult(resultAction);

        setSuccess("Product updated successfully");
        setShowEditModal(false);

        if (userRole === "merchant") {
          dispatch(getMerchantProducts());
        } else {
          dispatch(getAllProducts());
        }

      } else {
        const action = userRole === "merchant" ? createMerchantProduct : createProduct;
        console.log("data" + dataToSend);

        const resultAction = dispatch(action(dataToSend));
        console.log(resultAction);

        unwrapResult(resultAction);
        setSuccess("Product created successfully");
        setShowCreateModal(false);
        if (userRole === "merchant") {
          dispatch(getMerchantProducts());
        } else {
          dispatch(getAllProducts());
        }
      }
    } catch (err) {
      console.error("Failed to submit form:", err);
      setError(err.message || "Operation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Test Here >>>>>>>>>>>>
  const getBrandNameById = (id) => {
    if (brandsLoading) return "Loading brand...";
    const brand = brands.find((b) => b._id === id);
    return brand ? brand.name : "Brand not found";
  };

  let displayBrandName = userRole === "merchant" ? getBrandNameById(formData.brandId) : "";

  const arrProducts = Array.isArray(products) ? products : [];
  const renderProductModal = (actionType) => {
    const isEdit = actionType === "edit";
    const title = isEdit ? "Edit Product" : "Create New Product";
    const submitText = isEdit ? "Update" : "Create";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
          <h2 className="text-xl font-bold text-title-blue mb-6">{title}</h2>
          <form onSubmit={(e) => handleFormSubmit(e, actionType)} className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                name="name"
                value={formData.name}
                placeholder="Product Name"
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={handleFormChange}
                required
              />
            </div>

            {userRole === "admin" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  name="brandId"
                  // Test here >>>>>>>>
                  // value={displayBrandName}
                  value={getBrandNameById(formData.brandId)}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                name="description"
                value={formData.description}
                placeholder="Description"
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={handleFormChange}
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  placeholder="Price"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantityInStock"
                  value={formData.quantityInStock}
                  placeholder="Stock Quantity"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={handleFormChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Colors (comma separated)</label>
                <input
                  name="colors"
                  value={formData.colors}
                  placeholder="red, blue, green"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Sizes (comma separated)</label>
                <input
                  name="sizes"
                  value={formData.sizes}
                  placeholder="S, M, L, XL"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={handleFormChange}
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
                  className="mr-2"
                />
                <label>Is Discounted?</label>
              </div>
              {formData.isDiscounted && (
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Discount Amount</label>
                  <input
                    type="number"
                    name="discountAmount"
                    value={formData.discountAmount}
                    placeholder="Discount Amount"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    onChange={handleFormChange}
                    min="0"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() =>
                  isEdit ? setShowEditModal(false) : setShowCreateModal(false)}
                className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-main-blue text-white py-2 px-4 rounded-lg hover:bg-title-blue transition duration-500 shadow-lg disabled:opacity-50"
                disabled={isSubmitting}
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
        <h3 className="text-3xl font-bold text-title-blue">Products</h3>
        <button
          onClick={handleCreateClick}
          className="btn text-lg hover:bg-main-blue bg-title-blue text-white p-3 rounded-3xl flex items-center gap-2"
        >
          <FaPlus /> Add Product
        </button>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
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
                <th className="py-4 px-6 text-center">Brand</th>
                <th className="py-4 px-6 text-center">Price</th>
                <th className="py-4 px-6 text-center">Quantity</th>
                <th className="py-4 px-6 text-center">Available Color</th>
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
                    <td className="py-4 px-6 w-16 h-16 box-content flex justify-center">
                      <img
                        // src={product.image || productImg}
                        src={product?.imgUrl || productImg}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl"
                      />
                    </td>
                    <td className="py-4 px-6 text-main-blue text-center">
                      {product.name}
                    </td>
                    <td className="py-4 px-6 text-main-blue text-center">
                      {product.category?.name || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-main-blue text-center">
                      {product.brand?.name || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-main-blue text-center">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-main-blue text-center">
                      {product.quantityInStock}
                    </td>
                    <td>
                      <div className="py-4 px-6 flex justify-evenly items-center">
                        {product.colors && product.colors.length > 0 ? (
                          product.colors.map((color, i) => (
                            <span
                              key={i}
                              className={`w-5 h-5 rounded-full ${{
                                red: "bg-red-500",
                                green: "bg-green-500",
                                blue: "bg-blue-500",
                                Navy: "bg-indigo-900",
                                Teal: "bg-teal-500",
                                Orange: "bg-orange-500",
                              }[color] || "bg-gray-500"
                                } transition duration-300 transform hover:scale-125`}
                            ></span>
                          ))
                        ) : (
                          <span className="text-main-blue text-center">
                            No colors provided
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="py-4 px-6 text-center space-x-4 flex justify-center items-center">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-blue-900 hover:text-main-blue transition duration-300 transform hover:scale-110"
                          data-tooltip-id="Edit"
                          data-tooltip-content="Edit"
                          data-tooltip-place="bottom"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product._id)}
                          className="text-red-500 hover:text-red-600 transition duration-300 transform hover:scale-110"
                          data-tooltip-place="bottom"
                          data-tooltip-id="Delete"
                          data-tooltip-content="Delete"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-title-blue py-4">
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
                    className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-500 shadow-lg"
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