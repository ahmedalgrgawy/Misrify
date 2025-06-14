import team from "../../assets/About imgs/Misrify team.png";
import Zeyad from "../../assets/About imgs/Zeyad.png";
import Sandy from "../../assets/About imgs/Sandy.png";
import Greg from "../../assets/About imgs/Greg.png";
import Reem from "../../assets/About imgs/Reem.png";
import Sara from "../../assets/About imgs/Sara.png";
import Negm from "../../assets/About imgs/Negm.png";
import Ali from "../../assets/About imgs/Ali.png";
import Siam from "../../assets/About imgs/Siam.png";
import style from "./AboutUs.module.css";
import { RiLinkedinLine } from "react-icons/ri";
import { IoLogoGithub } from "react-icons/io";
import { CiFacebook } from "react-icons/ci";

const AboutUs = () => {
  return (
    <div className="bg-[#EFF2F6]">
      <div className="flex flex-col lg:flex-row items-center justify-between p-6 md:p-12 lg:p-20 gap-8">
        <div className="w-full lg:w-3/6 order-2 lg:order-1">
          <h2 className={`${style.title} mb-5`}>What We Do ?</h2>
          <p className={`${style.description}`}>
            We are building a digital marketplace tailored for Egyptian brands
            and local stores. Our platform provides small and medium businesses
            with the tools they need to grow online, connect with more
            customers, and stand out in a competitive market. Whether it’s
            fashion, crafts, or local goods — we make them accessible to
            everyone, everywhere.
          </p>
        </div>
        <div className="w-full lg:w-3/6 order-1 lg:order-2">
          <img
            className="w-full rounded-lg shadow-2xl"
            src={team}
            alt="team work"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between p-6 md:p-12 lg:p-20 gap-8">
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
            We are a passionate team of developers, designers, and testers
            committed to empowering local Egyptian businesses through
            technology. United by a shared vision, we aim to create innovative
            digital solutions that support local commerce and celebrate Egypt’s
            unique products and talents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 md:p-10 lg:p-16">
        <div className="card w-3/4 mx-auto md:w-full hover:shadow-2xl duration-300 rounded-xl border-2 border-transparent hover:border-gray-400">
          <img
            className={`w-full bg-[#F5F5F5] rounded-lg box-content ${style.cardFrim}`}
            src={Greg}
            alt="Ahmed Algrgawy"
          />
          <div className="p-5">
            <h4 className={`${style.cardMember} mt-3 mb-2`}>Ahmed Algrgawy</h4>
            <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
              Backend Developer
            </p>
            <div className="flex justify-start gap-2 text-4xl md:text-3xl">
              <a
                href="https://www.facebook.com/ahmedalgrgawy10"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CiFacebook className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://github.com/ahmedalgrgawy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoGithub className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://www.linkedin.com/in/ahmed-algrgawy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
            </div>
          </div>
        </div>

        <div className="card w-3/4 mx-auto md:w-full hover:shadow-2xl duration-300 rounded-xl border-2 border-transparent hover:border-gray-400">
          <img
            className={`w-full bg-[#F5F5F5] rounded-lg box-content ${style.cardFrim}`}
            src={Siam}
            alt="Mohamed Hisham"
          />
          <div className=" p-5">
            <h4 className={`${style.cardMember} mt-3 mb-2`}>Mohamed Hisham</h4>
            <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
              UI & UX Designer
            </p>
            <div className="flex justify-start gap-2 text-4xl md:text-3xl">
              <a
                href="https://www.facebook.com/mohamed.hisham.659961"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CiFacebook className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://github.com/MHS7777"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoGithub className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://www.linkedin.com/in/mohamed-hisham-a13b14337/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
            </div>
          </div>
        </div>

        <div className="card w-3/4 mx-auto md:w-full hover:shadow-2xl duration-300 rounded-xl border-2 border-transparent hover:border-gray-400">
          <img
            className={`w-full bg-[#F5F5F5] rounded-lg box-content ${style.cardFrim}`}
            src={Negm}
            alt="Mostafa Negm"
          />
          <div className=" p-5">
            <h4 className={`${style.cardMember} mt-3 mb-2`}>Mostafa Negm</h4>
            <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
              Mobile Developer
            </p>
            <div className="flex justify-start gap-2 text-4xl md:text-3xl">
              <a
                href="https://www.facebook.com/mostafanegmal132"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CiFacebook className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://github.com/MostafaNegm12/mostafanegm12"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoGithub className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://www.linkedin.com/in/mostafa-negm-b73631223/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
            </div>
          </div>
        </div>

        <div className="card w-3/4 mx-auto md:w-full hover:shadow-2xl duration-300 rounded-xl border-2 border-transparent hover:border-gray-400">
          <img
            className={`w-full bg-[#F5F5F5] rounded-lg box-content ${style.cardFrim}`}
            src={Zeyad}
            alt="Zeyad Elkhamary"
          />
          <div className=" p-5">
            <h4 className={`${style.cardMember} mt-3 mb-2`}>Zeyad Elkhamary</h4>
            <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
              Frontend Developer
            </p>
            <div className="flex justify-start gap-2 text-4xl md:text-3xl">
              <a
                href="https://www.facebook.com/zeyad.elkhamary/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CiFacebook className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://github.com/Zeyad-Elkhamary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoGithub className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="www.linkedin.com/in/zeyad-elkhamary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
            </div>
          </div>
        </div>

        <div className="card w-3/4 mx-auto md:w-full hover:shadow-2xl duration-300 rounded-xl border-2 border-transparent hover:border-gray-400">
          <img
            className={`w-full bg-[#F5F5F5] rounded-lg box-content ${style.cardFrim}`}
            src={Ali}
            alt="Ali El-Beltagy"
          />
          <div className=" p-5">
            <h4 className={`${style.cardMember} mt-3 mb-2`}>Ali El-Beltagy</h4>
            <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
              Cyber Security
            </p>
            <div className="flex justify-start gap-2 text-4xl md:text-3xl">
              <a
                href="https://www.facebook.com/share/1MpqJox6ap/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CiFacebook className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://github.com/aliayman010"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoGithub className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://www.linkedin.com/in/ali-el-beltagy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
            </div>
          </div>
        </div>

        <div className="card w-3/4 mx-auto md:w-full hover:shadow-2xl duration-300 rounded-xl border-2 border-transparent hover:border-gray-400">
          <img
            className={`w-full bg-[#F5F5F5] rounded-lg box-content ${style.cardFrim}`}
            src={Sandy}
            alt="Sandreen Kotb"
          />
          <div className=" p-5">
            <h4 className={`${style.cardMember} mt-3 mb-2`}>Sandreen Kotb</h4>
            <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
              Frontend Developer
            </p>
            <div className="flex justify-start gap-2 text-4xl md:text-3xl">
              <a
                href="https://www.facebook.com/sandy.kotb.3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CiFacebook className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://github.com/Sandreen-Kotb"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoGithub className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://www.linkedin.com/in/sandreen-kotb/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
            </div>
          </div>
        </div>

        <div className="card w-3/4 mx-auto md:w-full hover:shadow-2xl duration-300 rounded-xl border-2 border-transparent hover:border-gray-400">
          <img
            className={`w-full bg-[#F5F5F5] rounded-lg box-content ${style.cardFrim}`}
            src={Sara}
            alt="Sara Elkholy"
          />
          <div className=" p-5">
            <h4 className={`${style.cardMember} mt-3 mb-2`}>Sara Elkholy</h4>
            <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
              Mobile Developer
            </p>
            <div className="flex justify-start gap-2 text-4xl md:text-3xl">
              <a
                href="https://www.facebook.com/share/1Fs9N73L5Y/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CiFacebook className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://github.com/Sarahelkholy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoGithub className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://www.linkedin.com/in/sara-elkholy-06189126b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
            </div>
          </div>
        </div>

        <div className="card w-3/4 mx-auto md:w-full hover:shadow-2xl duration-300 rounded-xl border-2 border-transparent hover:border-gray-400">
          <img
            className={`w-full bg-[#F5F5F5] rounded-lg box-content ${style.cardFrim}`}
            src={Reem}
            alt="Reem Ghareeb"
          />
          <div className=" p-5">
            <h4 className={`${style.cardMember} mt-3 mb-2`}>Reem Ghareeb</h4>
            <p className={`${style.cardDescription} mb-2.5 text-lg md:text-sm`}>
              Backend Developer
            </p>
            <div className="flex justify-start gap-2 text-4xl md:text-3xl">
              <a
                href="https://www.facebook.com/reemghareeb25"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CiFacebook className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://github.com/reemghareeb25"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoGithub className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
              <a
                href="https://www.linkedin.com/in/reem-elsayed25/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiLinkedinLine className="font-bold hover:bg-gray-300 p-1 rounded-full transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
