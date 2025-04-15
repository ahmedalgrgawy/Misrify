import pic from "../../assets/About imgs/Pic.png";
import team from "../../assets/About imgs/Misrify team.png";
import Greg from "../../assets/About imgs/Greg.png";
import Negm from "../../assets/About imgs/Negm.png";
import Siam from "../../assets/About imgs/Siam.png";
import style from "./AboutUs.module.css";
import { RiLinkedinLine } from "react-icons/ri";
import { IoLogoInstagram } from "react-icons/io";
import { CiTwitter } from "react-icons/ci";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between p-6 md:p-12 lg:p-20 gap-8">
        <div className="w-full lg:w-3/6 order-2 lg:order-1">
          <h2 className={`${style.title} mb-5`}>What We Do ?</h2>
          <p className={`${style.description}`}>
            This project aims to establish a comprehensive online marketplace
            exclusively dedicated to Egyptian brands and stores.<br/> The platform
            will serve as a centralized hub for local businesses to showcase
            their products and reach a wider customer base, while also offering
            consumers a convenient and unique shopping experience.
          </p>
        </div>
        <div className="w-full lg:w-3/6 order-1 lg:order-2">
          <img
            className="w-full rounded-lg shadow-2xl"
            src={pic}
            alt="team work"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between p-6 md:p-12 lg:p-20 gap-8 bg-gray-50">
        <div className="w-full lg:w-3/6">
          <img
            className="w-full rounded-lg shadow-2xl"
            src={team}
            alt="team work"
          />
        </div>
        <div className="w-full lg:w-3/6">
          <h2 className={`${style.title} mb-5`}>Who We Are?</h2>
          <p className={`${style.description}`}>
            This project aims to establish a comprehensive online marketplace
            exclusively dedicated to Egyptian brands and stores. The platform
            will serve as a centralized hub for local businesses to showcase
            their products and reach a wider customer base, while also offering
            consumers a convenient and unique shopping experience.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 md:p-10 lg:p-16">
        <div className="card p-5 w-3/4 mx-auto md:w-full hover:shadow-2xl transition-all rounded-xl border border-gray-100">
          <img className="w-full rounded-lg" src={Greg} alt="Ahmed Algrgawy" />
          <h4 className={`${style.cardMember} mt-3 mb-2`}>Ahmed Algrgawy</h4>
          <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
            Backend Developer
          </p>
          <div className="flex justify-start gap-2 text-4xl md:text-3xl">
            <Link to={""}>
              <CiTwitter className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <IoLogoInstagram className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
          </div>
        </div>

        <div className="card p-5 w-3/4 mx-auto md:w-full hover:shadow-2xl transition-all rounded-xl border border-gray-100">
          <img className="w-full rounded-lg" src={Siam} alt="Mohamed Hisham" />
          <h4 className={`${style.cardMember} mt-3 mb-2`}>Mohamed Hisham</h4>
          <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
            UI & UX Designer
          </p>
          <div className="flex justify-start gap-2 text-4xl md:text-3xl">
            <Link to={""}>
              <CiTwitter className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <IoLogoInstagram className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
          </div>
        </div>

        <div className="card p-5 w-3/4 mx-auto md:w-full hover:shadow-2xl transition-all rounded-xl border border-gray-100">
          <img className="w-full rounded-lg" src={Negm} alt="Mostafa Negm" />
          <h4 className={`${style.cardMember} mt-3 mb-2`}>Mostafa Negm</h4>
          <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
            Mobile Developer
          </p>
          <div className="flex justify-start gap-2 text-4xl md:text-3xl">
            <Link to={""}>
              <CiTwitter className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <IoLogoInstagram className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
          </div>
        </div>

        <div className="card p-5 w-3/4 mx-auto md:w-full hover:shadow-2xl transition-all rounded-xl border border-gray-100">
          <img className="w-full rounded-lg" src={Greg} alt="Ahmed Algrgawy" />
          <h4 className={`${style.cardMember} mt-3 mb-2`}>Ahmed Algrgawy</h4>
          <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
            Backend Developer
          </p>
          <div className="flex justify-start gap-2 text-4xl md:text-3xl">
            <Link to={""}>
              <CiTwitter className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <IoLogoInstagram className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
          </div>
        </div>

        <div className="card p-5 w-3/4 mx-auto md:w-full hover:shadow-2xl transition-all rounded-xl border border-gray-100">
          <img className="w-full rounded-lg" src={Greg} alt="Ahmed Algrgawy" />
          <h4 className={`${style.cardMember} mt-3 mb-2`}>Ahmed Algrgawy</h4>
          <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
            Backend Developer
          </p>
          <div className="flex justify-start gap-2 text-4xl md:text-3xl">
            <Link to={""}>
              <CiTwitter className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <IoLogoInstagram className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
          </div>
        </div>

        <div className="card p-5 w-3/4 mx-auto md:w-full hover:shadow-2xl transition-all rounded-xl border border-gray-100">
          <img className="w-full rounded-lg" src={Siam} alt="Mohamed Hisham" />
          <h4 className={`${style.cardMember} mt-3 mb-2`}>Mohamed Hisham</h4>
          <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
            UI & UX Designer
          </p>
          <div className="flex justify-start gap-2 text-4xl md:text-3xl">
            <Link to={""}>
              <CiTwitter className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <IoLogoInstagram className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
          </div>
        </div>

        <div className="card p-5 w-3/4 mx-auto md:w-full hover:shadow-2xl transition-all rounded-xl border border-gray-100">
          <img className="w-full rounded-lg" src={Negm} alt="Mostafa Negm" />
          <h4 className={`${style.cardMember} mt-3 mb-2`}>Mostafa Negm</h4>
          <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
            Mobile Developer
          </p>
          <div className="flex justify-start gap-2 text-4xl md:text-3xl">
            <Link to={""}>
              <CiTwitter className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <IoLogoInstagram className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
          </div>
        </div>

        <div className="card p-5 w-3/4 mx-auto md:w-full hover:shadow-2xl transition-all rounded-xl border border-gray-100">
          <img className="w-full rounded-lg" src={Greg} alt="Ahmed Algrgawy" />
          <h4 className={`${style.cardMember} mt-3 mb-2`}>Ahmed Algrgawy</h4>
          <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
            Backend Developer
          </p>
          <div className="flex justify-start gap-2 text-4xl md:text-3xl">
            <Link to={""}>
              <CiTwitter className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <IoLogoInstagram className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
            <Link to={""}>
              <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
