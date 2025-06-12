import { useState } from "react";
import style from "./Home.module.css";
import HeroPic from "../../assets/home imgs/HeroPic.png";
import Versace from "../../assets/home imgs/versace.png";
import CalvinKlien from "../../assets/home imgs/CalvinKlien.png";
import Gucci from "../../assets/home imgs/Gucci.png";
import Prada from "../../assets/home imgs/Prada.png";
import Zara from "../../assets/home imgs/Zara.png";
import Shoes from "../../assets/home imgs/Shoes.png";
import Clothes from "../../assets/home imgs/Clothes.png";
import Makeup from "../../assets/home imgs/Makeup.png";
import Bags from "../../assets/home imgs/Bags.png";
import AppStore from "../../assets/home imgs/AppStore.png";
import GooglePlay from "../../assets/home imgs/GooglePlay.png";
import AppPic from "../../assets/home imgs/AppPic.png";
import star1 from "../../assets/home imgs/Bstar.png";
import star2 from "../../assets/home imgs/Sstar.png";
import { PiDownloadSimpleBold } from "react-icons/pi";
import { BiSolidLike } from "react-icons/bi";
import { TiStarFullOutline } from "react-icons/ti";
import CalScheduler from "../../Components/Cal/CalScheduler";

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <>
      <div className="px-10 md:px-24 pt-16">
        <div className="flex items-center md:justify-between flex-col xl:flex-row">
          <div className="w-full xl:w-3/5 2xl:w-1/2 text-center md:text-start">
            <h2 className={`${style.heroTitle} mb-4`}>
              Egyptian <br /> E-commerce
            </h2>
            <p className={`${style.heroDescription} mb-6`}>
              Egypt&apos;s e-commerce sector has witnessed significant growth in
              recent years, fueled by increasing internet penetration, a large
              youthful population, and rising consumer demand for convenience
              and a wide range of products.
            </p>
            <button
              className={`${style.btnMeeting} mb-16 py-3 px-8 rounded-3xl hover:bg-main-blue transition-all text-white bg-title-blue`}
              onClick={openPopup}
            >
              Meeting now
            </button>

            <div className="flex flex-col md:flex-row md:justify-between w-full">
              <div
                className={`${style.info} text-center mb-5 md:mb-0 md:w-1/3`}
              >
                <h5>200+</h5>
                <p>Local Brands</p>
              </div>

              <div
                className={`${style.info} text-center mb-5 md:mb-0 md:w-1/3 box-content md:border-x-2 md:px-10`}
              >
                <h5>2,000+</h5>
                <p>High-Quality Products</p>
              </div>

              <div
                className={`${style.info} text-center mb-5 md:mb-0 md:w-1/3`}
              >
                <h5>30,000+</h5>
                <p>Happy Customers</p>
              </div>
            </div>
          </div>

          <div className="relative mt-10 xl:mt-0 xl:w-2/5 self-center xl:self-end flex justify-end 2xl:w-fit">
            <img className="" src={HeroPic} alt="couple Picture" />
            <img
              className="absolute md:top-0 -top-8 md:right-0 -right-7"
              src={star1}
              alt="star picture"
            />
            <img
              className="absolute top-20 md:top-44 lg:top-48 -left-9 md:-left-16 lg:-left-20 xl:-left-0 2xl:-left-20"
              src={star2}
              alt="star picture"
            />
          </div>
        </div>
      </div>

      <div className="pb-20 px-20 md:px-24 bg-dark-blue">
        <div className="flex flex-wrap justify-center gap-10 xl:justify-between p-8 border-b-2">
          <img src={Versace} alt="Versace Logo" />
          <img src={Zara} alt="Zara Logo" />
          <img src={Gucci} alt="Gucci Logo" />
          <img src={Prada} alt="Prada Logo" />
          <img src={CalvinKlien} alt="Calvin Klien Logo" />
        </div>

        <div>
          <h2 className={`${style.categoriesTitle} my-24`}>
            Find Your Categories
          </h2>
          <div className="grid grid-cols-12 gap-5 grid-rows-3 xl:grid-rows-2">
            <div className="flex flex-col justify-around md:justify-start col-span-12 xl:col-span-4 2xl:col-span-4 bg-white rounded-3xl p-8">
              <p
                className={`${style.categoryTitles} mb-5 order-2 md:order-1 text-center md:text-start`}
              >
                Shoes
              </p>
              <img
                className="md:self-end order-1 md:order-2"
                src={Shoes}
                alt="Shoes"
              />
            </div>

            <div className="col-span-12 xl:col-span-8 2xl:col-span-8 flex flex-col md:flex-row justify-between bg-white rounded-3xl overflow-hidden">
              <p
                className={`${style.categoryTitles} p-8 order-2 md:order-1 text-center md:text-start`}
              >
                Clothes
              </p>
              <img
                className="h-fit 2xl:h-full md:me-5 xl:me-16 order-1 md:order-2"
                src={Clothes}
                alt="Clothes"
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between col-span-12 xl:col-span-7 2xl:col-span-8 bg-white rounded-3xl">
              <p
                className={`${style.categoryTitles} p-8 order-2 md:order-1 text-center md:text-start`}
              >
                Bags
              </p>
              <img
                className="xl:me-10 md:self-end order-1 md:order-2"
                src={Bags}
                alt="Bags"
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between col-span-12 xl:col-span-5 2xl:col-span-4 bg-white rounded-3xl">
              <p
                className={`${style.categoryTitles} ps-8 pt-8 pb-8 md:pb-0 order-2 md:order-1 text-center md:text-start`}
              >
                Makeup
              </p>
              <img
                className="md:mt-8 md:me-16 xl:me-0 order-1 md:order-2"
                src={Makeup}
                alt="Makeup"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`pb-20 px-10 lg:px-20 xl:px-24 flex flex-col justify-center lg:flex-row lg:items-center lg:justify-around`}
      >
        <div
          className={`${style.download} text-center md:text-start w-full xl:w-1/2 mt-10 xl:mt-0`}
        >
          <h2 className="text-dark-blue mb-2">Download App Now</h2>
          <p className={`${style.heroDescription} mb-11 `}>
            Discover and support Egypt’s best local brands all in one app! From
            fashion and accessories to handmade crafts and home essentials, shop
            original Egyptian products and enjoy exclusive offers, fast
            delivery, and secure payments.
          </p>
          <div className="flex justify-around lg:justify-start flex-wrap mb-16">
            <img className="md:me-7" src={GooglePlay} alt="GooglePlay Logo" />
            <img src={AppStore} alt="AppStore Logo" />
          </div>
          <div className="flex justify-around xl:justify-between md:flex-row flex-col">
            <div
              className={`flex flex-col bg-dark-blue text-white md:mb-0 mb-5 md:w-28 md:px-3 xl:w-44 ${style.ratings} rounded-xl py-5 2xl:px-1 box-content text-center items-center justify-between`}
            >
              <PiDownloadSimpleBold className="text-4xl" />
              <p>59865</p>
              <p>Download</p>
            </div>
            <div
              className={`flex flex-col bg-dark-blue text-white md:mb-0 mb-5 md:w-28 md:px-3 xl:w-44 ${style.ratings} rounded-xl py-5 2xl:px-1 box-content text-center items-center justify-between`}
            >
              <BiSolidLike className="text-4xl" />
              <p>29852</p>
              <p>LIke</p>
            </div>
            <div
              className={`flex flex-col bg-dark-blue text-white md:mb-0 mb-5 md:w-28 md:px-3 xl:w-44 ${style.ratings} rounded-xl py-5 2xl:px-1 box-content text-center items-center justify-between`}
            >
              <TiStarFullOutline className="text-4xl" />
              <p>1500</p>
              <p>5 star rating</p>
            </div>
          </div>
        </div>
        <div className="w-full xl:w-1/2 mt-10 xl:mt-0 flex justify-center xl:justify-end">
          <img className="" src={AppPic} alt="Appliction's picture" />
        </div>
      </div>

      <CalScheduler isOpen={isPopupOpen} onClose={closePopup} />
    </>
  );
};

export default Home;