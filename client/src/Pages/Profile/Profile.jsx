import { IoCameraOutline } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import pic from "../../assets/profile tests/test.jpg";
import rock1 from "../../assets/profile tests/rock1.png";
import rock2 from "../../assets/profile tests/rock2.png";
import rock3 from "../../assets/profile tests/rock3.png";
import style from "./Profile.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, editProfile } from "../../features/profileSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.Profile);
  const [isDisabled, setIsDisabled] = useState({
    name: true,
    email: true,
    phone: true,
    address: true,
    CPassword: true,
    NPassword: true,
  });
  const [picLink, setPicLink] = useState(true);

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

if(data.currentPassword == "" && data.newPassword == ""){
  if (data.imgUrl == "") {
    const {currentPassword , imgUrl ,newPassword , ...updatedData} = data;
    dispatch(editProfile(updatedData));
  }else{
    const { currentPassword, newPassword, ...updatedData } = data;
    dispatch(editProfile(updatedData));
  }
}else{
  if (data.imgUrl == "") {
    const { imgUrl, ...updatedData } = data;
    dispatch(editProfile(updatedData));
  } else {
    dispatch(editProfile(data));
  }
}
  }

  const updateData = useFormik({
    initialValues: {
      name: profile.name || "",
      email: profile.email || "",
      phoneNumber: profile.phoneNumber || "",
      address: profile.address || "",
      currentPassword: "",
      newPassword: "",
      gender: profile.gender || "",
      imgUrl: "",
    },
    validationSchema,
    onSubmit: postNewData,
    enableReinitialize: true,
  });

  return (
    <>
      <div
        className={`${style.backG} relative mt-2 overflow-hidden flex justify-center items-center`}
      >
        <div className="relative flex flex-col justify-center items-center px-12 py-6 my-3 z-10">
          <div
            className={` relative w-36 h-36 mb-4 rounded-full bg-cover bg-center`}
            style={{ backgroundImage: `url(${pic})` }}
          >
            <div className="absolute bottom-0 right-0 w-11 h-11">
              <button
                type="button"
                onClick={() => {
                  picLink ? setPicLink(false) : setPicLink(true);
                }}
              >
                <IoCameraOutline
                  style={{ backgroundClip: "" }}
                  className="absolute top-1/2 -translate-y-1/2 p-2 w-full h-full rounded-full text-white bg-[#15253FF5] "
                />
              </button>

              <input
                className={`${
                  picLink ? "hidden" : ""
                }  absolute w-32 -bottom-11 -right-24 md:bottom-auto md:-right-60 md:top-1/2 md:-translate-y-1/2 md:w-56 shadow-inner bg-[#F2F4F8] py-2 px-3 placeholder:text-gray-400 text-black rounded-sm focus:outline-none`}
                type="text"
                name="imgUrl"
                id="imgUrl"
                placeholder="Picture Link"
                value={updateData.values.imgUrl}
                onChange={updateData.handleChange}
                onBlur={updateData.handleBlur}
              />
            </div>
          </div>

          <h2 className="font-inter mb-2 text-bg-second font-semibold text-2xl">
            {profile.name}
          </h2>
          <p className="font-inter text-[#A2A2A2]">{profile.email}</p>
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
                    className={`${
                      isDisabled.name
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
                    className={`${
                      isDisabled.email
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
                    className={`${
                      isDisabled.phone
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
                    className={`${
                      isDisabled.address
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
                    className={`${
                      isDisabled.CPassword
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
                    className={`${
                      isDisabled.NPassword
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
                    className={`flex-1 text-center py-1 rounded-full ${
                      updateData.values.gender === "male"
                        ? "bg-title-blue text-white"
                        : "text-dark-grey"
                    }`}
                  >
                    Male
                  </button>

                  <button
                    type="button"
                    onClick={() => updateData.setFieldValue("gender", "female")}
                    className={`flex-1 text-center py-1 rounded-full ${
                      updateData.values.gender === "female"
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
    </>
  );
};

export default Profile;
