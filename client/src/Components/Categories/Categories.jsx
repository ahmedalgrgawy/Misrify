import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getAllCategories, createCategory, editCategory } from "../../features/categorySlice";
import { createBrand, deleteBrand, getAllBrands, editBrand } from "../../features/brandSlice";
import { TailSpin } from "react-loader-spinner";
import { FaEdit, FaTrashAlt, FaClipboardList, FaPlus, FaRegCheckCircle, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { GiShop } from "react-icons/gi";
import { BsEnvelope } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getAllMerchants } from "../../features/userSlice";

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, categoryLoading } = useSelector((state) => state.Categories);
  const { brands, brandLoading } = useSelector((state) => state.Brands);
  const { merchants } = useSelector((state) => state.user);

  // Create State
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "", description: "" });

  // Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);

  // Edit State 
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemType, setItemType] = useState('');

  const handleEditItem = (itemId, type) => {
    setItemToEdit(itemId);
    setItemType(type);
    setShowEditModal(true);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setItemToEdit(null);
    setItemType('');
  };

  const handleConfirmEdit = () => {
    const updatedData = itemType === 'category'
      ? { name: newCategory.name }
      : { name: newBrand.name };

    if (itemType === 'category') {
      dispatch(editCategory({ categoryId: itemToEdit, updatedData }))
        .then(() => {
          setShowEditModal(false);
          setItemToEdit(null);
          setItemType('');
        })
        .catch(err => console.error("Error editing category:", err));
    } else if (itemType === 'brand') {
      dispatch(editBrand({ brandId: itemToEdit, updatedData }))
        .then(() => {
          setShowEditModal(false);
          setItemToEdit(null);
          setItemType('');
        })
        .catch(err => console.error("Error editing brand:", err));
    }
  };

  // Delete Func
  const handleDeleteCategory = (categoryId) => {
    setCategoryToDelete(categoryId);
    setShowDeleteModal(true);
  };

  const handleDeleteBrand = (brandId) => {
    setBrandToDelete(brandId);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
    setBrandToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete))
        .then(() => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
        })
        .catch((err) => console.error("Error deleting category:", err));
    } else if (brandToDelete) {
      dispatch(deleteBrand(brandToDelete))
        .then(() => {
          setShowDeleteModal(false);
          setBrandToDelete(null);
        })
        .catch((err) => console.error("Error deleting brand:", err));
    }
  };

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllBrands());
    dispatch(getAllMerchants())
  }, [dispatch]);

  if (categoryLoading || brandLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <TailSpin color="#2B3D5B" height={100} width={100} />
      </div>
    );
  }

  const arrCategories = Array.isArray(categories) ? categories : [];
  const arrBrands = Array.isArray(brands) ? brands : [];


  return (
    <div className="p-6 bg-bg-second font-montserrat">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h3 className="text-3xl font-bold text-title-blue">Categories</h3>
        <div>
          <Link to="/dashboard" className="text-lg font-semibold text-dark-grey">Dashboard</Link>
          <span className="mx-2 text-dark-grey">/</span>
          <span className="text-lg font-semibold text-title-blue">Categories</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <SummaryCard icon={<FaClipboardList />} label="Total Categories" value={arrCategories.length} color="blue" />
        <SummaryCard icon={<GiShop />} label="Total Merchants" value={merchants.length || 0} color="green" />
        <SummaryCard icon={<BsEnvelope />} label="Total Brands" value={arrBrands.length} color="purple" />
      </div>

      {/* Categories Section */}
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-xl font-semibold text-bg-footer">All Categories</h4>
        <button
          onClick={() => setShowAddCategoryModal(true)}
          className="btn text-lg hover:bg-main-blue bg-title-blue text-white p-3 rounded-3xl flex items-center gap-2"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      <SwiperSection
        title="Categories"
        data={arrCategories}
        type="category"
        onEdit={(itemId) => handleEditItem(itemId, 'category')}
        onDelete={handleDeleteCategory}
      />

      {/* Brands Section */}
      <div className="flex justify-between items-center mb-8 mt-12">
        <h4 className="text-xl font-semibold text-bg-footer">All Brands</h4>
        <button
          onClick={() => setShowAddBrandModal(true)}
          className="btn text-lg hover:bg-main-blue bg-title-blue text-white p-3 rounded-3xl flex items-center gap-2"
        >
          <FaPlus /> Add Brand
        </button>
      </div>

      <SwiperSection
        title="Brands"
        data={arrBrands}
        type="brand"
        onEdit={(itemId) => handleEditItem(itemId, 'brand')}
        onDelete={handleDeleteBrand}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-12 rounded-lg shadow-xl w-2xl">
            <h3 className="text-lg font-semibold text-main-blue mb-10">
              Are you sure you want to delete this {categoryToDelete ? "category" : "brand"}?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-2xl font-semibold text-main-blue mb-6">Edit {itemType === 'category' ? 'Category' : 'Brand'}</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder={`${itemType === 'category' ? 'Category' : 'Brand'} Name`}
                value={itemType === 'category' ? newCategory.name : newBrand.name}
                onChange={(e) => itemType === 'category' ? setNewCategory({ ...newCategory, name: e.target.value }) : setNewBrand({ ...newBrand, name: e.target.value })}
                className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button onClick={handleCancelEdit} className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md">Cancel</button>
                <button onClick={handleConfirmEdit} className="bg-main-blue text-white py-2 px-4 rounded-lg hover:bg-title-blue transition duration-500 shadow-lg">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-2xl font-semibold text-main-blue mb-6">Add New Category</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
              />
              <input
                type="text"
                placeholder="Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newCategory.name.trim()) {
                      alert("Category name is required.");
                      return;
                    }

                    dispatch(createCategory(newCategory))
                      .unwrap()
                      .then(() => {
                        dispatch(getAllCategories());
                        setShowAddCategoryModal(false);
                        setNewCategory({ name: "", description: "" });
                      })
                  }}
                  className="bg-main-blue text-white py-2 px-4 rounded-lg hover:bg-title-blue transition duration-500 shadow-lg"
                >
                  Add
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Brand Modal */}
      {showAddBrandModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-2xl font-semibold text-main-blue mb-6">Add New Brand</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Brand Name"
                value={newBrand.name}
                onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
              />
              <input
                type="text"
                placeholder="Description"
                value={newBrand.description}
                onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
              />
              <select
                value={newBrand.ownerId}
                onChange={(e) => setNewBrand({ ...newBrand, ownerId: e.target.value })}
                className="border border-light-grey rounded-md text-dark-grey py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
              >
                <option value="" className="bg-bg-main">Select Merchant</option>
                {merchants.map((merchant) => (
                  <option key={merchant._id} value={merchant._id} className="bg-second text-dark-grey">
                    {merchant.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowAddBrandModal(false)}
                  className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newBrand.name.trim()) {
                      alert("Brand name is required.");
                      return;
                    }

                    dispatch(createBrand(newBrand))
                      .unwrap()
                      .then(() => {
                        dispatch(getAllBrands());
                        setShowAddBrandModal(false);
                        setNewBrand({ name: "", description: "" });
                      })
                  }}
                  className="bg-main-blue text-white py-2 px-4 rounded-lg hover:bg-title-blue transition duration-500 shadow-lg"
                >
                  Add
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ icon, label, value, color }) => {
  const bgColor = {
    blue: "bg-blue-200 text-blue-500",
    green: "bg-green-200 text-green-500",
    purple: "bg-purple-200 text-purple-500",
  }[color];

  return (
    <div className="bg-white rounded-xl p-4 flex items-center shadow-md">
      <div className={`p-3 me-4 rounded-full ${bgColor}`}>
        <div className="text-2xl">{icon}</div>
      </div>
      <div>
        <p className="text-gray-600">{label}</p>
        <p className="font-bold text-lg">{value}</p>
      </div>
    </div>
  );
};

const SwiperSection = ({ title, data, type, onEdit, onDelete }) => {
  const navNext = `.swiper-${title}-next`;
  const navPrev = `.swiper-${title}-prev`;

  return (
    <div className="mb-16">
      <h5 className="text-lg font-semibold mb-4">{title}</h5>
      <Swiper
        modules={[Navigation, Pagination]}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 30 },
          1280: { slidesPerView: 3, spaceBetween: 30 },
        }}
        navigation={{ nextEl: navNext, prevEl: navPrev }}
        pagination={{ clickable: true, el: ".swiper-pagination" }}
        className="relative"
      >
        {data.length > 0 ? (
          data.map((item) => (
            <SwiperSlide key={item._id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-lg transition-all duration-300">
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="h-40 w-full object-cover bg-[#d9d9d9]"
              />
              <div className="p-4">
                <h6 className="font-bold text-main-blue text-base mb-1">{item.name}</h6>
                <p className="text-xs text-gray-600 mb-3">64 items</p>
                <div className="flex justify-between items-center">
                  <span className="badge bg-green-100 text-green-600 text-sm px-4 py-3 rounded flex items-center gap-1">
                    <FaRegCheckCircle /> Available
                  </span>
                  <div className="flex gap-3">
                    <button onClick={() => onEdit(item._id)} className="text-blue-900 hover:text-main-blue transition duration-300 transform hover:scale-110">
                      <FaEdit />
                    </button>
                    <button onClick={() => onDelete(item._id)} className="text-red-500 hover:text-red-600 transition duration-300 transform hover:scale-110">
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div className="text-center font-bold text-title-blue text-xl p-10">No {title}</div>
        )}
      </Swiper>
      <div className="flex justify-between mt-4">
        <button className={`swiper-${title}-prev text-2xl text-main-blue hover:text-title-blue transition duration-300 transform hover:scale-110`}>
          <FaArrowLeft />
        </button>
        <button className={`swiper-${title}-next text-2xl text-main-blue hover:text-title-blue transition duration-300 transform hover:scale-110`}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Categories;