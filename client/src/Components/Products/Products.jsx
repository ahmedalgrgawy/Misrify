import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getAllProducts } from "../../features/productsSlice";
import { TailSpin } from "react-loader-spinner";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteProduct(productToDelete))
      .then(() => {
        setShowDeleteModal(false);
        setProductToDelete(null);
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <TailSpin color="#2B3D5B" height={100} width={100} />
      </div>
    );
  }

  const arrProducts = Array.isArray(products) ? products : [];

  return (
    <div className="p-6 bg-bg-second">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h3 className="text-3xl font-bold text-title-blue">Products</h3>
        <div>
          <Link to="/dashboard" className="text-lg font-semibold text-dark-grey">
            Dashboard
          </Link>
          <span className="mx-2 font-semi text-dark-grey">/</span>
          <Link to="/dashboard/products" className="text-lg font-semibold text-title-blue">
            Products
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-light-grey">
        <table className="min-w-full text-left">
          <thead className="text-sm text-main-blue border-b-4">
            <tr className="bg-[#F7F8FA]">
              <th className="py-4 px-6 text-center">Image</th>
              <th className="py-4 px-6 text-center">Product Name</th>
              <th className="py-4 px-6 text-center">Category</th>
              <th className="py-4 px-6 text-center">Price</th>
              <th className="py-4 px-6 text-center">Piece</th>
              <th className="py-4 px-6 text-center">Available Color</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {arrProducts.length > 0 ? (
              arrProducts.map((product, index) => (
                <tr key={product.id || index} className={index % 2 !== 0 ? "bg-[#F9F9FF]" : ""}>
                  <td className="py-4 px-6 flex justify-center">
                    <img src={product.image || ""} alt={product.name} className="w-16 h-16 rounded-xl" />
                  </td>
                  <td className="py-4 px-6 text-main-blue text-center">
                    {product.name}
                  </td>
                  <td className="py-4 px-6 text-main-blue text-center">
                    {product.category ? product.category.name : "N/A"}
                  </td>
                  <td className="py-4 px-6 text-main-blue text-center">
                    {product.price}
                  </td>
                  <td className="py-4 px-6 text-main-blue text-center">
                    {product.quantityInStock}
                  </td>
                  <td>
                    <div className="py-4 px-6 flex justify-evenly items-center">
                      {product.colors && product.colors.length > 0 ? (
                        product.colors.map((color, index) => (
                          <span
                            key={index}
                            className={`w-5 h-5 rounded-full ${color === 'red' ? 'bg-red-500' :
                              color === 'green' ? 'bg-green-500' :
                                color === 'blue' ? 'bg-blue-500' :
                                  color === 'Navy' ? 'bg-indigo-900' :
                                    color === 'Teal' ? 'bg-teal-500' :
                                      color === 'Orange' ? 'bg-orange-500' :
                                        'bg-gray-500'} transition duration-300 transform hover:scale-125`}
                          ></span>
                        ))
                      ) : (
                        <span className="py-4 px-6 text-main-blue text-center">
                          No colors provided
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="py-4 px-6 text-center space-x-4 flex justify-center items-center">
                      <Link
                        to={`/admin/edit-product/${product._id}`}
                        className="text-blue-900 hover:text-main-blue transition duration-300 transform hover:scale-110"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product._id)}
                        className="text-red-500 hover:text-red-600 transition duration-300 transform hover:scale-110"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-title-blue py-4">
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
    </div>
  );
};

export default Products;