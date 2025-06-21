import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategory,
  getAllCategories,
  createCategory,
  editCategory,
} from "../../features/categorySlice";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  editBrand,
} from "../../features/brandSlice";
import { TailSpin } from "react-loader-spinner";
import {
  FaEdit,
  FaTrashAlt,
  FaClipboardList,
  FaPlus,
  FaRegCheckCircle,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { GiShop } from "react-icons/gi";
import { BsEnvelope } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getAllMerchants } from "../../features/userSlice";
import "react-toastify/dist/ReactToastify.css";
import { Flip, ToastContainer, toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Resizer from "react-image-file-resizer";
import brandImg from "../../assets/brands.jpeg";
import categoryImg from "../../assets/categories.jpeg";

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, categoryLoading } = useSelector((state) => state.Categories);
  const { brands, brandLoading } = useSelector((state) => state.Brands);
  const { merchants } = useSelector((state) => state.user);

  const arrCategories = Array.isArray(categories) ? categories : [];
  const arrBrands = Array.isArray(brands) ? brands : [];

  const categoriesNames = useMemo(
    () => arrCategories.map((category) => category.name),
    [arrCategories]
  );

  const brandsNames = useMemo(
    () => arrBrands.map((brand) => brand.name),
    [arrBrands]
  );


  // Create State
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "", imgUrl: "" });
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "", description: "", imgUrl: "", ownerId: "" });

  // Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);

  // Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemType, setItemType] = useState("");
  const [editData, setEditData] = useState({ name: "", description: "", imgUrl: "" });

  const handleEditItem = (itemId, type) => {
    const item = type === "category"
      ? arrCategories.find((cat) => cat._id === itemId)
      : arrBrands.find((brand) => brand._id === itemId);

    if (item) {
      setEditData({
        name: item.name,
        description: item.description || "",
        imgUrl: item.imgUrl || "",
      });
      setItemToEdit(itemId);
      setItemType(type);
      setShowEditModal(true);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setItemToEdit(null);
    setItemType("");
    setEditData({ name: "", description: "", imgUrl: "" });
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        80,
        0,
        (uri) => {
          setEditData((prev) => ({ ...prev, imgUrl: uri }));
        },
        "base64"
      );
    }
  };

  const handleConfirmEdit = () => {
    const updatedData = {
      name: editData.name,
      description: editData.description,
      imgUrl: editData.imgUrl,
    };

    if (itemType === "category") {
      if (!updatedData.name.trim()) {
        showToast("The category name is required ❗", "error");
        return;
      } else if (categoriesNames.includes(updatedData.name) && updatedData.name !== arrCategories.find(cat => cat._id === itemToEdit).name) {
        showToast("This name is already used ❗ Try another one", "error");
        return;
      }

      dispatch(editCategory({ categoryId: itemToEdit, updatedData }))
        .unwrap()
        .then(() => {
          dispatch(getAllCategories());
          setShowEditModal(false);
          setItemToEdit(null);
          setItemType("");
          setEditData({ name: "", description: "", imgUrl: "" });
          showToast("The category has been updated 👍", "success");
        })
        .catch((err) => {
          showToast("There is something wrong 👎", "error");
          console.error("Error editing category:", err);
        });
    } else if (itemType === "brand") {
      if (!updatedData.name.trim()) {
        showToast("The Brand name is required ❗", "error");
        return;
      } else if (brandsNames.includes(updatedData.name) && updatedData.name !== arrBrands.find(brand => brand._id === itemToEdit).name) {
        showToast("This name is already used ❗ Try another one", "error");
        return;
      }

      console.log(updatedData);

      dispatch(editBrand({ brandId: itemToEdit, updatedData }))
        .unwrap()
        .then(() => {
          dispatch(getAllBrands());
          setShowEditModal(false);
          setItemToEdit(null);
          setItemType("");
          setEditData({ name: "", description: "", imgUrl: "" });
          showToast("The brand has been updated 👍", "success");
        })
        .catch((err) => {
          showToast("There is something wrong 👎", "error");
          console.error("Error editing brand:", err);
        });
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
        .unwrap()
        .then(() => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
          showToast("The category has been deleted 🗑", "success");
        })
        .catch((err) => {
          showToast("There is something wrong 👎", "error");
          console.error("Error deleting category:", err);
        });
    } else if (brandToDelete) {
      dispatch(deleteBrand(brandToDelete))
        .unwrap()
        .then(() => {
          setShowDeleteModal(false);
          setBrandToDelete(null);
          showToast("The brand has been deleted 🗑", "success");
        })
        .catch((err) => {
          showToast("There is something wrong 👎", "error");
          console.error("Error deleting brand:", err);
        });
    }
  };

  const handleCategoryImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        80,
        0,
        (uri) => {
          setNewCategory((prev) => ({ ...prev, imgUrl: uri }));
        },
        "base64"
      );
    }
  };

  const handleBrandImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        80,
        0,
        (uri) => {
          setNewBrand((prev) => ({ ...prev, imgUrl: uri }));
        },
        "base64"
      );
    }
  };

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllBrands());
    dispatch(getAllMerchants());
  }, [dispatch]);

  if (categoryLoading || brandLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <TailSpin color="#2B3D5B" height={100} width={100} />
      </div>
    );
  }

  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "dark",
      transition: Flip,
    });
  };

  return (
    <div className="p-6 bg-bg-second font-montserrat">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h3 className="text-3xl font-bold text-title-blue">Categories</h3>
        <div>
          <Link
            to="/analytics"
            className="text-lg font-semibold text-dark-grey"
          >
            Analytics
          </Link>
          <span className="mx-2 text-dark-grey">/</span>
          <span className="text-lg font-semibold text-title-blue">
            Categories
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <SummaryCard
          icon={<FaClipboardList />}
          label="Total Categories"
          value={arrCategories.length}
          color="blue"
        />
        <SummaryCard
          icon={<GiShop />}
          label="Total Merchants"
          value={merchants.length || 0}
          color="green"
        />
        <SummaryCard
          icon={<BsEnvelope />}
          label="Total Brands"
          value={arrBrands.length}
          color="purple"
        />
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
        onEdit={(itemId) => handleEditItem(itemId, "category")}
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
        onEdit={(itemId) => handleEditItem(itemId, "brand")}
        onDelete={handleDeleteBrand}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-12 rounded-lg shadow-xl w-2xl">
            <h3 className="text-lg font-semibold text-main-blue mb-10">
              Are you sure you want to delete this{" "}
              {categoryToDelete ? "category" : "brand"}?
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
            <h2 className="text-2xl font-semibold text-main-blue mb-6">
              Edit {itemType === "category" ? "Category" : "Brand"}
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder={`${itemType === "category" ? "Category" : "Brand"} Name`}
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
              />
              <input
                type="text"
                placeholder="Description"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
              />
              <div className="flex flex-col gap-2">
                <label className="text-dark-grey font-semibold">Change Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={handleCancelEdit}
                  className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEdit}
                  className="bg-main-blue text-white py-2 px-4 rounded-lg hover:bg-title-blue transition duration-500 shadow-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-2xl font-semibold text-main-blue mb-6">
              Add New Category
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
              />
              <input
                type="text"
                placeholder="Description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
              />
              <div className="flex flex-col gap-2">
                <label className="text-dark-grey font-semibold">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCategoryImageUpload}
                  className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    setNewCategory({ name: "", description: "", imgUrl: "" });
                  }}
                  className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newCategory.name.trim()) {
                      showToast("The Category name is required ❗", "error");
                      return;
                    } else if (categoriesNames.includes(newCategory.name)) {
                      showToast("This name is already used ❗ Try another one", "error");
                      return;
                    } else if (!newCategory.description.trim()) {
                      showToast("Category description is required ❗", "error");
                      return;
                    }

                    console.log(newCategory);

                    dispatch(createCategory(newCategory))
                      .unwrap()
                      .then(() => {
                        dispatch(getAllCategories());
                        setShowAddCategoryModal(false);
                        setNewCategory({ name: "", description: "", imgUrl: "" });
                        setTimeout(() => {
                          showToast("The category has been created 👍", "success");
                        }, 0);
                      })
                      .catch((err) => {
                        setTimeout(() => {
                          showToast("There is something wrong 👎", "error");
                        }, 0);
                        console.error("Error creating category:", err);
                      });
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
            <h2 className="text-2xl font-semibold text-main-blue mb-6">
              Add New Brand
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Brand Name"
                value={newBrand.name}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, name: e.target.value })
                }
                className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
              />
              <input
                type="text"
                placeholder="Description"
                value={newBrand.description}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, description: e.target.value })
                }
                className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
              />
              <select
                value={newBrand.ownerId}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, ownerId: e.target.value })
                }
                className="border border-light-grey rounded-md text-dark-grey py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
              >
                <option value="" className="bg-bg-main">
                  Select Merchant
                </option>
                {merchants.map((merchant) => (
                  <option
                    key={merchant._id}
                    value={merchant._id}
                    className="bg-white text-dark-grey"
                  >
                    {merchant.name}
                  </option>
                ))}
              </select>
              <div className="flex flex-col gap-2">
                <label className="text-dark-grey font-semibold">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBrandImageUpload}
                  className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => {
                    setShowAddBrandModal(false);
                    setNewBrand({ name: "", description: "", ownerId: "", imgUrl: "" });
                  }}
                  className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newBrand.name.trim()) {
                      showToast("Brand name is required ❗", "error");
                      return;
                    } else if (brandsNames.includes(newBrand.name)) {
                      showToast("This name is already used ❗ Try another one", "error");
                      return;
                    } else if (!newBrand.description.trim()) {
                      showToast("Brand description is required ❗", "error");
                      return;
                    } else if (!newBrand.ownerId) {
                      showToast("Please select a merchant ❗", "error");
                      return;
                    }

                    console.log(newBrand);

                    dispatch(createBrand(newBrand))
                      .unwrap()
                      .then(() => {
                        dispatch(getAllBrands());
                        setShowAddBrandModal(false);
                        setNewBrand({ name: "", description: "", ownerId: "", imgUrl: "" });
                        setTimeout(() => {
                          showToast("The brand has been created 👍", "success");
                        }, 0);
                      })
                      .catch((err) => {
                        showToast(err.message || "Error creating brand", "error");
                      });
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
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="dark"
        transition={Flip}
        style={{ zIndex: 9999 }}
      />
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
  const navNext = `.swiper-button-${title.toLowerCase()}-next`;
  const navPrev = `.swiper-button-${title.toLowerCase()}-prev`;

  return (
    <div className="mb-10">
      <Swiper
        modules={[Navigation, Pagination]}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 25 },
          1280: { slidesPerView: 3, spaceBetween: 30 },
        }}
        navigation={{ nextEl: navNext, prevEl: navPrev }}
        pagination={{ clickable: true }}
        className="relative pb-10"
      >
        {data.length > 0 ? (
          data.map((item) => (
            <SwiperSlide
              key={item._id}
              className="w-80 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.imgUrl || (type === "category" ? categoryImg : brandImg)}
                alt={item.name}
                className="h-56 w-full object-cover bg-gray-200"
              />
              <div className="p-4">
                <h6 className="font-bold text-main-blue text-xl mb-3">
                  {item.name}
                </h6>
                <p className="mb-2 text-sm font-normal text-dark-grey">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="badge bg-green-100 text-green-600 text-sm px-4 py-3 rounded flex items-center gap-1">
                    <FaRegCheckCircle /> Available
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(item._id)}
                      className="text-blue-900 hover:text-main-blue transition duration-300 transform hover:scale-110"
                      data-tooltip-id="Edit"
                      data-tooltip-content="Edit"
                      data-tooltip-place="bottom"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="text-red-500 hover:text-red-600 transition duration-300 transform hover:scale-110"
                      data-tooltip-id="Delete"
                      data-tooltip-content="Delete"
                      data-tooltip-place="bottom"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div className="text-center font-bold text-title-blue text-xl p-10">
            No {title}
          </div>
        )}
      </Swiper>
      <div className="flex justify-between">
        <button
          className={`swiper-button-${title.toLowerCase()}-prev text-2xl text-main-blue hover:bg-gray-200 rounded-full p-2 transition duration-300 transform hover:scale-110`}
        >
          <FaArrowLeft />
        </button>
        <button
          className={`swiper-button-${title.toLowerCase()}-next text-2xl text-main-blue hover:bg-gray-200 rounded-full p-2 transition duration-300 transform hover:scale-110`}
        >
          <FaArrowRight />
        </button>
      </div>
      <Tooltip
        id="Edit"
        className="!z-[1000] !py-1 !px-2 !bg-title-blue rounded-md text-white"
      />
      <Tooltip
        id="Delete"
        className="!z-[1000] !py-1 !px-2 !bg-red-600 rounded-md text-white"
      />
    </div>
  );
};

export default Categories;