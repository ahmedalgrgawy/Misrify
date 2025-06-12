import QR from "../../assets/Qrcode.png";
import googlePlay from "../../assets/GooglePlay.png";
import appStore from "../../assets/AppStore.png";
import style from "./footer.module.css";
import { RiFacebookLine } from "react-icons/ri";
import { CiTwitter } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className={`${style.secondText} bg-bg-footer text-white`}>
        <div
          className={` flex flex-wrap lg:flex-nowrap justify-between px-16 py-10 border-b-2`}
        >
          <div className=" w-full mb-8 lg:mb-0 lg:w-2/6">
            <h2 className={[style.logoText]}>MISRIFY</h2>
            <p>
              Welcome to MISRIFY , your Favourate Website to get Egyption local
              Brands ! you can start as merchant to sell your local products
              here , Also we provide these products to all the egyptians then to
              all over the world .
            </p>
          </div>

          <div className="w-full md:w-2/6 mb-8 lg:mb-0 lg:w-1/6">
            <h6 className="font-bold">Pages</h6>
            <ul>
              <li className="my-3 ">
                <Link className="hover:text-dark-grey duration-300" to={"/"}>
                  Home
                </Link>
              </li>
              <li className="my-3">
                <Link
                  className="hover:text-dark-grey duration-300"
                  to={"/aboutus"}
                >
                  About Us
                </Link>
              </li>
              <li className="mb-3 ">
                <Link
                  className="hover:text-dark-grey duration-300"
                  to={"/contact"}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-2/6 mb-8 md:mb-0 lg:w-1/6">
            <h6 className="font-bold">Account</h6>
            <ul>
              <li className="my-3">
                <Link
                  className=" hover:text-dark-grey duration-300"
                  to={"/profile"}
                >
                  My Account
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  className=" hover:text-dark-grey duration-300"
                  to={"/signup"}
                >
                  signup
                </Link>
                <span> / </span>
                <Link
                  className=" hover:text-dark-grey duration-300"
                  to={"/login"}
                >
                  Login
                </Link>
              </li>
              <li className="my-3">
                <Link
                  className=" hover:text-dark-grey duration-300"
                  to={"/notifications"}
                >
                  Notifications
                </Link>
              </li>
            </ul>
          </div>

          <div className=" w-full md:w-2/6 lg:w-1/6">
            <h6 className="font-bold">Download App</h6>
            <div>
              <p className="my-1.5">Save $3 with App New User Only</p>
              <div className="flex">
                <Link to={""}>
                  <img src={QR} alt="QR code" />
                </Link>
                <div className="ms-2 flex flex-col justify-between">
                  <Link to={""}>
                    <img src={googlePlay} alt="google play logo" />
                  </Link>
                  <Link to={""}>
                    <img src={appStore} alt="app store logo" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex justify-between w-2/5 md:w-3/5 my-5">
              <Link to={""}>
                <RiFacebookLine className="text-3xl font-bold hover:bg-white duration-500 hover:text-bg-footer p-1 rounded-full box-content" />
              </Link>
              <Link to={""}>
                <CiTwitter className="text-3xl font-bold hover:bg-white duration-500 hover:text-bg-footer p-1 rounded-full box-content" />
              </Link>
              <Link to={""}>
                <FaInstagram className="text-3xl font-bold hover:bg-white duration-500 hover:text-bg-footer p-1 rounded-full box-content" />
              </Link>
            </div>
          </div>
        </div>

        <p className="px-16 py-4">
          © 2025 the creation.design | All rights raserved by Misrify
        </p>
      </footer>
    </>
  );
};

export default Footer;
