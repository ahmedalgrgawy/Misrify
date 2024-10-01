import errorImg from "../../assets/illustration.svg"
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <>
            <section className="bg-white ">
                <div className="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12 text-red-600">
                    <div className="wf-ull lg:w-1/2">
                        <p className="text-sm font-medium text-main_color_darker ">404 Error</p>
                        <h1 className="mt-3 text-2xl font-semibold text-gray-800 ">Page not found</h1>
                        <p className="mt-4 text-gray-500 ">Sorry, the page you are looking for does not exist.Here are some helpful links:</p>

                        <div className="flex items-center mt-6 gap-x-3">
                            <Link to={'/'} className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-main_color rounded-lg shrink-0 sm:w-auto hover:bg-main_color_darker ">
                                Take me home
                            </Link>
                        </div>
                    </div>

                    <div className="relative w-full mt-12 lg:w-1/2 lg:mt-0">
                        <img className="w-full max-w-lg lg:mx-auto" src={errorImg} alt="" />
                    </div>
                </div>
            </section>
        </>
    )
}

export default NotFound


