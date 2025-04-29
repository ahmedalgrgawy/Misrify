import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getAllCategories } from "../../features/categorySlice";
import { deleteBrand, getAllBrands } from "../../features/brandSlice";
import { TailSpin } from "react-loader-spinner";
import {
  FaEdit,
  FaTrashAlt,
  FaClipboardList,
  FaPlus,
  FaRegCheckCircle,
  FaArrowCircleRight,
  FaArrowCircleLeft,
} from "react-icons/fa";
import { GiShop } from "react-icons/gi";
import { BsEnvelope } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, categoryLoading } = useSelector((state) => state.Categories);
  const { brands, brandLoading } = useSelector((state) => state.Brands);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);

  const handleDeleteCategory = (categoryId) => {
    setCategoryToDelete(categoryId);
    setShowDeleteModal("category");
  };
  const handleDeleteBrand = (brandId) => {
    setBrandToDelete(brandId);
    setShowDeleteModal("brand");
  };
  // Handle the cancellation of the delete action
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
    setBrandToDelete(null);
  };
  // Handle the confirmation of the delete action
  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete))
        .then(() => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
        })
        .catch((error) => {
          console.error("Error deleting category :", error);
        });
    }else if (brandToDelete) {
            dispatch(deleteBrand(brandToDelete))
              .then(() => {
                setShowDeleteModal(false);
                setBrandToDelete(null);
              })
              .catch((error) => {
                console.error("Error deleting brand :", error);
              });
    }
  };

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllBrands());
  }, [dispatch]);

  if (categoryLoading && brandLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <TailSpin color="#2B3D5B" height={100} width={100} />
      </div>
    );
  }

  const arrCategories = Array.isArray(categories) ? categories : [];
  const arrBrands = Array.isArray(brands) ? brands : [];

  return (
    <div className="p-6 bg-bg-second">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4 font-inter">
        <h3 className="text-3xl font-bold text-title-blue">Categories</h3>
        <div>
          <Link
            to="/dashboard"
            className="text-lg font-semibold text-dark-grey"
          >
            Dashboard
          </Link>
          <span className="mx-2 font-semi text-dark-grey">/</span>
          <Link
            to="/categories"
            className="text-lg font-semibold text-title-blue"
          >
            Categories
          </Link>
        </div>
      </div>

      <div className="w-11/12">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 bg-transparent font-montserrat font-medium">
          <div className="bg-white rounded-xl p-4 flex">
            <div className="p-3 me-4 text-blue-500  bg-blue-200 rounded-full box-content">
              <FaClipboardList className="text-2xl" />
            </div>
            <div className="flex flex-col">
              <p>Total Categories</p>
              <p>{arrCategories.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 flex">
            <div className="p-3 me-4 text-green-500  bg-green-200 rounded-full box-content">
              <GiShop className="text-2xl" />
            </div>
            <div className="flex flex-col ">
              <p>Total Merchants</p>
              <p>50</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 flex">
            <div className="p-3 me-4 text-purple-500  bg-purple-200 rounded-full box-content">
              <BsEnvelope className="text-2xl" />
            </div>
            <div className="flex flex-col ">
              <p>Total Brands</p>
              <p>{arrBrands.length}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center my-8 font-montserrat">
          <h4 className="text-xl text-bg-footer font-semibold">
            All Categories
          </h4>

          <button
            onClick={() => {}}
            className="btn text-lg font-medium hover:bg-main-blue bg-title-blue text-white p-3 rounded-3xl"
          >
            <FaPlus /> Add Category
          </button>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 70,
              },
              960: {
                slidesPerView: 2,
                spaceBetween: 65,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 70,
              },
              1440: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
            }}
            navigation={{
              nextEl: ".swiper1-next",
              prevEl: ".swiper1-prev",
            }}
            pagination={{
              clickable: true,
            }}
            className="py-10 px-16 xl:px-10 border-4 rounded-2xl"
          >
            {arrCategories > 0 ? (
              arrCategories.map((category) => {
                <SwiperSlide className="card overflow-hidden bg-white shadow-2xl">
                  <img className="h-36 bg-gray-500" src="" alt="" />
                  <div className="p-4 font-montserrat">
                    <p className="text-sm font-semibold mb-2">
                      {category.name}
                    </p>
                    <p className="text-xs font-medium mb-3 text-[#595959]">
                      64 items
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="badge text-green-800 font-semibold text-xs p-3 rounded-lg bg-green-300 border-0 ">
                        <FaRegCheckCircle className="me-1" /> Available
                      </p>

                      <div className="flex">
                        <Link
                          to={`/admin/edit-category/${category._id}`}
                          className=" text-xl transition duration-300 transform hover:scale-110"
                        >
                          <FaEdit />
                        </Link>

                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="ms-4 text-xl text-red-500 hover:text-red-600 transition duration-300 transform hover:scale-110"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>;
              })
            ) : (
              <div className="text-2xl font-bold text-center font-montserrat">
                there are no Categories
              </div>
            )}
          </Swiper>

          <div className="custom1-pagination flex justify-center mt-4"></div>

          <div className="swiper1-prev absolute z-30 -left-10 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-600 transition text-white p-2 rounded-full cursor-pointer">
            <FaArrowCircleLeft />
          </div>

          <div className="swiper1-next absolute z-30 -right-10 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-600 transition text-white p-2 rounded-full cursor-pointer">
            <FaArrowCircleRight />
          </div>
        </div>

        <div className="flex justify-between items-center my-8 font-montserrat">
          <h4 className="text-xl text-bg-footer font-semibold">All Brands</h4>

          <button className="btn text-lg font-medium hover:bg-main-blue bg-title-blue text-white p-3 rounded-3xl">
            <FaPlus /> Add Brand
          </button>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 70,
              },
              960: {
                slidesPerView: 2,
                spaceBetween: 65,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 70,
              },
              1440: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
            }}
            navigation={{
              nextEl: ".swiper2-next",
              prevEl: ".swiper2-prev",
            }}
            pagination={{
              clickable: true,
            }}
            className="py-10 px-16 xl:px-10 border-4 rounded-2xl"
          >
            {arrBrands.length > 0 ? (
              arrBrands.map((brand) => {
                <SwiperSlide className="card overflow-hidden bg-white shadow-2xl">
                  <img className="h-36 bg-gray-500" src="" alt="" />
                  <div className="p-4 font-montserrat">
                    <p className="text-sm font-semibold mb-2">{brand.name}</p>
                    <p className="text-xs font-medium mb-3 text-[#595959]">
                      55 merchant
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="badge text-green-800 font-semibold text-xs p-3 rounded-lg bg-green-300 border-0">
                        <FaRegCheckCircle className="me-1" /> Available
                      </p>

                      <div className="flex">
                        <Link
                          to={`/admin/edit-brand/${brand._id}`}
                          className=" text-xl transition duration-300 transform hover:scale-110"
                        >
                          <FaEdit />
                        </Link>

                        <button
                          onClick={() => handleDeleteBrand(brand._id)}
                          className="ms-4 text-xl text-red-500 hover:text-red-600 transition duration-300 transform hover:scale-110"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>;
              })
            ) : (
              <div className="text-2xl font-bold text-center font-montserrat">
                there are no Brands
              </div>
            )}
          </Swiper>

          <div className="custom-pagination flex justify-center mt-4"></div>

          <div className="swiper2-prev absolute z-30 -left-10 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-600 transition text-white p-2 rounded-full cursor-pointer">
            <FaArrowCircleLeft />
          </div>

          <div className="swiper2-next absolute z-30 -right-10 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-600 transition text-white p-2 rounded-full cursor-pointer">
            <FaArrowCircleRight />
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-12 rounded-lg shadow-xl w-2xl">
            <h3 className="text-lg font-semibold text-main-blue mb-10">
              Are you sure you want to delete this {showDeleteModal}?
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
    </div>
  );
};

export default Categories;
