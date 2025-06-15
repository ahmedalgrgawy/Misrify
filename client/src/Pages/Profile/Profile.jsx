import { IoCameraOutline } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import pic from "../../assets/profile tests/user.png";
import rock1 from "../../assets/profile tests/rock1.png";
import rock2 from "../../assets/profile tests/rock2.png";
import rock3 from "../../assets/profile tests/rock3.png";
import style from "./Profile.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, editProfile } from "../../features/profileSlice";
import Cropper from "react-easy-crop";
import Resizer from "react-image-file-resizer";
import { TailSpin } from "react-loader-spinner";
import { Flip, toast, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, Loading } = useSelector((state) => state.Profile);
  const [isDisabled, setIsDisabled] = useState({
    name: true,
    email: true,
    phone: true,
    address: true,
    CPassword: true,
    NPassword: true,
  });

  // Crop state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "the name is too short")
      .max(20, "the name is too long")
      .required("the name is required"),

    email: Yup.string().email("Invalid email").required("email is required"),

    phoneNumber: Yup.string()
      .matches(/^01[0125][0-9]{8}$/g, "Invalid phone number")
      .required("phone is required"),

    address: Yup.string().required("the address is required"),

    currentPassword: Yup.string().when("newPassword", {
      is: (val) => !!val && val.length > 0,
      then: (schema) =>
        schema
          .required("Current password is required")
          .min(8, "Password must be at least 8 characters"),
      otherwise: (schema) => schema.notRequired(),
    }),

    newPassword: Yup.string().min(8, "Password must be at least 8 characters"),
    gender: Yup.string().required("gender is required"),
  });

  function postNewData(data) {
    const handleDispatch = (payload) => {
      dispatch(editProfile(payload))
        .then(() => {
          setTimeout(() => {
            showToast("the profile has been updated 👍", "success");
          }, 0);
          dispatch(getProfile());
        })
        .catch((err) => {
          setTimeout(() => {
            showToast("there is something wrong 👎", "error");
          }, 0);

          console.error("Error editing profile:", err);
        });
    };

    if (data.currentPassword === "" && data.newPassword === "") {
      if (data.imgUrl === "") {
        const { currentPassword, imgUrl, newPassword, ...updatedData } = data;
        console.log(updatedData);

        handleDispatch(updatedData);
      } else {
        const { currentPassword, newPassword, ...updatedData } = data;
        handleDispatch(updatedData);
      }
    } else {
      if (data.imgUrl === "") {
        const { imgUrl, ...updatedData } = data;
        handleDispatch(updatedData);
      } else {
        handleDispatch(data);
      }
    }
    setIsDisabled({
      name: true,
      email: true,
      phone: true,
      address: true,
      CPassword: true,
      NPassword: true,
    });
  }

  const updateData = useFormik({
    initialValues: {
      name: profile?.name || "",
      email: profile?.email || "",
      phoneNumber: profile?.phoneNumber || "",
      address: profile?.address || "",
      currentPassword: "",
      newPassword: "",
      gender: profile?.gender || "",
      imgUrl: profile?.imgUrl || "",
    },
    validationSchema,
    onSubmit: postNewData,
    enableReinitialize: true,
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.9
        );
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setShowCropModal(true);
    }
  };

  const handleCropComplete = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Resize the image before uploading
      Resizer.imageFileResizer(
        croppedImage,
        300, // maxWidth
        300, // maxHeight
        "JPEG", // compressFormat
        80, // quality
        0, // rotation
        (uri) => {
          updateData.setFieldValue("imgUrl", uri);
          setShowCropModal(false);
        },
        "base64" // outputType
      );
    } catch (err) {
      console.error("Error cropping image: ", err);
    }
  };

  if (Loading) {
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
    <>
      <div
        className={`${style.backG} relative mt-2 overflow-hidden flex justify-center items-center`}
      >
        <div className="relative flex flex-col justify-center items-center px-12 py-6 my-3 z-10">
          <div
            className={` relative w-36 h-36 mb-4 rounded-full bg-cover bg-center`}
            style={{
              backgroundImage: `url(${updateData.values.imgUrl || pic})`,
            }}
          >
            <div
              data-tooltip-place="right"
              data-tooltip-id="Upload"
              data-tooltip-content="Upload"
              data-tooltip-offset="5"
              className="absolute bottom-0 right-0 w-11 h-11"
            >
              <label htmlFor="upload-input">
                <IoCameraOutline
                  style={{ backgroundClip: "" }}
                  className="absolute top-1/2 -translate-y-1/2 p-2 w-full h-full rounded-full text-white bg-[#15253FF5] cursor-pointer"
                />
              </label>
              <input
                id="upload-input"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
            </div>
          </div>

          <h2 className="font-inter mb-2 text-bg-second font-semibold text-2xl">
            {profile?.name}
          </h2>
          <p className="font-inter text-[#A2A2A2]">{profile?.email}</p>
        </div>

        <img
          className={`absolute  md:top-0 bottom-0 -left-32 md:-left-28 lg:left-0 xl:left-64 select-none`}
          src={rock1}
          alt="backgrounds shapes"
        />

        <img
          className={`absolute top-0 md:-top-4 lg:-top-3 xl:top-0 -right-52 md:-right-48 lg:-right-10 xl:right-40 select-none`}
          src={rock2}
          alt="backgrounds shapes"
        />

        <img
          className={`absolute bottom-0 -right-24 md:-right-20 lg:right-10 xl:right-24 select-none`}
          src={rock3}
          alt="backgrounds shapes"
        />
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Crop your profile picture
            </h2>
            <div className="relative w-full h-64 md:h-80 bg-gray-100">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            </div>
            <div className="mt-4">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setImageSrc(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                className="px-4 py-2 bg-title-blue text-white rounded hover:bg-main-blue"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of your existing code */}
      <div className="bg-bg-second overflow-hidden">
        <div className="font-inter my-6 mx-auto w-4/5 rounded-lg shadow-xl bg-white">
          <div className="border-b-2 border-[#D3D3D3] py-8 px-12">
            <h2 className="py-8 px-0 font-bold text-xl text-bg-footer inline border-b-4 border-title-blue">
              Edit profile
            </h2>
          </div>

          <form
            onSubmit={updateData.handleSubmit}
            className="pt-6 px-12 pb-3"
            action=""
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label
                  className="font-roboto text-sm text-[#21272A] mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <br />
                <div className="relative">
                  <input
                    className={`${isDisabled.name
                      ? "bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed pointer-events-none"
                      : null
                      } relative shadow-inner w-full bg-[#F2F4F8] py-3 px-4 placeholder:text-gray-400 text-black rounded-sm focus:outline-none`}
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Melissa Peters"
                    disabled={isDisabled.name}
                    value={updateData.values.name}
                    onChange={updateData.handleChange}
                    onBlur={updateData.handleBlur}
                  />
                  <button
                    className="absolute right-4 top-4"
                    type="button"
                    data-tooltip-id="Edit"
                    data-tooltip-content="Edit"
                    data-tooltip-place="bottom"
                    onClick={() => {
                      setIsDisabled({ ...isDisabled, name: false });
                    }}
                  >
                    <FaPencil />
                  </button>
                </div>
                {updateData.errors.name && updateData.touched.name ? (
                  <p className="text-red-600 ps-5 mt-1">
                    {updateData.errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  className="font-roboto text-sm text-[#21272A] mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <br />
                <div className="relative">
                  <input
                    className={`${isDisabled.email
                      ? "bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed pointer-events-none"
                      : null
                      } select-text relative shadow-inner w-full bg-[#F2F4F8] py-3 px-4 placeholder:text-gray-400 text-black rounded-sm focus:outline-none`}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="melpeters@gmail.com"
                    disabled={isDisabled.email}
                    value={updateData.values.email}
                    onChange={updateData.handleChange}
                    onBlur={updateData.handleBlur}
                  />
                  <button
                    className="absolute right-4 top-4"
                    type="button"
                    data-tooltip-id="Edit"
                    data-tooltip-content="Edit"
                    data-tooltip-place="bottom"
                    onClick={() => {
                      setIsDisabled({ ...isDisabled, email: false });
                    }}
                  >
                    <FaPencil />
                  </button>
                </div>
                {updateData.errors.email && updateData.touched.email ? (
                  <p className="text-red-600 ps-5 mt-1">
                    {updateData.errors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  className="font-roboto text-sm text-[#21272A] mb-2"
                  htmlFor="phoneNumber"
                >
                  Phone Number
                </label>
                <br />
                <div className="relative">
                  <input
                    className={`${isDisabled.phone
                      ? "bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed pointer-events-none"
                      : null
                      } select-text relative shadow-inner w-full bg-[#F2F4F8] py-3 px-4 placeholder:text-gray-400 text-black rounded-sm focus:outline-none`}
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="+1 (567) 345-1234"
                    disabled={isDisabled.phone}
                    value={updateData.values.phoneNumber}
                    onChange={updateData.handleChange}
                    onBlur={updateData.handleBlur}
                  />
                  <button
                    className="absolute right-4 top-4"
                    type="button"
                    data-tooltip-id="Edit"
                    data-tooltip-content="Edit"
                    data-tooltip-place="bottom"
                    onClick={() => {
                      setIsDisabled({ ...isDisabled, phone: false });
                    }}
                  >
                    <FaPencil />
                  </button>
                </div>
                {updateData.errors.phoneNumber &&
                  updateData.touched.phoneNumber ? (
                  <p className="text-red-600 ps-5 mt-1">
                    {updateData.errors.phoneNumber}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  className="font-roboto text-sm text-[#21272A] mb-2"
                  htmlFor="address"
                >
                  Address
                </label>
                <br />
                <div className="relative">
                  <input
                    className={`${isDisabled.address
                      ? "bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed pointer-events-none"
                      : null
                      } select-text relative shadow-inner w-full bg-[#F2F4F8] py-3 px-4 placeholder:text-gray-400 text-black rounded-sm focus:outline-none`}
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Egypt"
                    disabled={isDisabled.address}
                    value={updateData.values.address}
                    onChange={updateData.handleChange}
                    onBlur={updateData.handleBlur}
                  />
                  <button
                    className="absolute right-4 top-4"
                    type="button"
                    data-tooltip-id="Edit"
                    data-tooltip-content="Edit"
                    data-tooltip-place="bottom"
                    onClick={() => {
                      setIsDisabled({ ...isDisabled, address: false });
                    }}
                  >
                    <FaPencil />
                  </button>
                </div>
                {updateData.errors.address && updateData.touched.address ? (
                  <p className="text-red-600 ps-5 mt-1">
                    {updateData.errors.address}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  className="font-roboto text-sm text-[#21272A] mb-2"
                  htmlFor="currentPassword"
                >
                  Current Password
                </label>
                <br />
                <div className="relative">
                  <input
                    className={`${isDisabled.CPassword
                      ? "bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed pointer-events-none"
                      : null
                      } select-text relative shadow-inner w-full bg-[#F2F4F8] py-3 px-4 placeholder:text-gray-400 text-black rounded-sm focus:outline-none`}
                    type="Password"
                    name="currentPassword"
                    id="currentPassword"
                    placeholder="************"
                    disabled={isDisabled.CPassword}
                    value={updateData.values.currentPassword}
                    onChange={updateData.handleChange}
                    onBlur={updateData.handleBlur}
                  />
                  <button
                    className="absolute right-4 top-4"
                    type="button"
                    data-tooltip-id="Edit"
                    data-tooltip-content="Edit"
                    data-tooltip-place="bottom"
                    onClick={() => {
                      setIsDisabled({ ...isDisabled, CPassword: false });
                    }}
                  >
                    <FaPencil />
                  </button>
                </div>
                {updateData.errors.currentPassword &&
                  updateData.touched.currentPassword ? (
                  <p className="text-red-600 ps-5 mt-1">
                    {updateData.errors.currentPassword}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  className="font-roboto text-sm text-[#21272A] mb-2"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <br />
                <div className="relative">
                  <input
                    className={`${isDisabled.NPassword
                      ? "bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed pointer-events-none"
                      : null
                      } select-text relative shadow-inner w-full bg-[#F2F4F8] py-3 px-4 placeholder:text-gray-400 text-black rounded-sm focus:outline-none`}
                    type="Password"
                    name="newPassword"
                    id="newPassword"
                    placeholder="************"
                    disabled={isDisabled.NPassword}
                    value={updateData.values.newPassword}
                    onChange={updateData.handleChange}
                    onBlur={updateData.handleBlur}
                  />
                  <button
                    className="absolute right-4 top-4"
                    type="button"
                    data-tooltip-id="Edit"
                    data-tooltip-content="Edit"
                    data-tooltip-place="bottom"
                    onClick={() => {
                      setIsDisabled({ ...isDisabled, NPassword: false });
                    }}
                  >
                    <FaPencil />
                  </button>
                </div>
                {updateData.errors.newPassword &&
                  updateData.touched.newPassword ? (
                  <p className="text-red-600 ps-5 mt-1">
                    {updateData.errors.newPassword}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="text-title-blue font-small block mb-2">
                  Gender
                </label>

                <div className="flex bg-bg-main rounded-full p-1 w-40">
                  <button
                    type="button"
                    onClick={() => updateData.setFieldValue("gender", "male")}
                    className={`flex-1 text-center py-1 rounded-full ${updateData.values.gender === "male"
                      ? "bg-title-blue text-white"
                      : "text-dark-grey"
                      }`}
                  >
                    Male
                  </button>

                  <button
                    type="button"
                    onClick={() => updateData.setFieldValue("gender", "female")}
                    className={`flex-1 text-center py-1 rounded-full ${updateData.values.gender === "female"
                      ? "bg-title-blue text-white"
                      : "text-dark-grey"
                      }`}
                  >
                    Female
                  </button>
                </div>

                {updateData.errors.gender && updateData.touched.gender ? (
                  <p className="text-red-600 ps-5 mt-1">
                    {updateData.errors.gender}
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              className="btn col-span-2 inline-block mt-6 bg-title-blue hover:bg-main-blue text-[#FFFFFF] "
            >
              Update
            </button>
          </form>
        </div>
      </div>
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
      <Tooltip
        id="Edit"
        className="!z-50 !py-1 !px-2 !bg-title-blue !rounded-md"
      />
      <Tooltip
        id="Upload"
        className="!z-50 !py-1 !px-2 !bg-dark-grey !rounded-md"
      />
    </>
  );
};

export default Profile;
