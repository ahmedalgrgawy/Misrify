import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";

// eslint-disable-next-line react/prop-types
const CalScheduler = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for Cal.com iframe
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // Adjust as needed

        return () => clearTimeout(timer);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {isLoading ? (
                <div
                    className="max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-5xl h-[450px] md:h-[550px] lg:h-[650px] 
                    border-0 shadow-2xl flex flex-col p-6 bg-gradient-to-br from-[#081120] via-[#15253F] to-[#081120]
                    rounded-3xl"
                >
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 text-[#2B3D5B] animate-spin" />
                    </div>
                </div>
            ) : (
                <div
                    className="w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl h-[450px] md:h-[550px] lg:h-[700px] 
                    border-0 shadow-2xl flex flex-col p-6 bg-gradient-to-br from-[#081120] via-[#15253F] to-[#081120]
                    rounded-3xl transform transition-all duration-300 ease-in-out
                    hover:shadow-[0_0_50px_rgba(110,119,134,0.3)]"
                >
                    <div className="w-full">
                        <div className="text-xl font-bold flex items-center justify-between w-full relative">
                            <button
                                onClick={onClose}
                                className="absolute -left-4 -top-4 p-3 rounded-full bg-white/10 backdrop-blur-sm
                        hover:bg-white/20 transition-all duration-300 ease-in-out
                        hover:scale-110 hover:rotate-90 transform"
                            >
                                <X className="h-6 w-6 text-[#FFFFFF]" />
                            </button>

                            <div className="w-full flex items-center justify-center gap-4 py-4">
                                {/* <Calendar className="h-6 w-6 text-[#2B3D5B]" /> */}
                                <div className="space-x-2 flex gap-2 items-center">
                                    <span className="bg-gradient-to-r from-[#2B3D5B] to-[#6E7786] text-transparent bg-clip-text font-bold text-3xl">
                                        Misrify Store
                                    </span>
                                </div>
                                {/* <Calendar className="h-6 w-6 text-[#2B3D5B]" /> */}
                            </div>
                        </div>
                    </div>

                    <div
                        className="flex-1 overflow-hidden rounded-2xl border border-[#DDDEE5]/10
                       scrollbar-thin scrollbar-thumb-[#2B3D5B] scrollbar-track-[#DDDEE5]
                       transition-transform duration-300 ease-in-out
                       hover:scale-[1.01] transform
                       shadow-[0_0_30px_rgba(110,119,134,0.1)]"
                    >
                        <iframe
                            src="https://cal.com/misrify-store-wb748j/30min"
                            className="w-full h-full aspect-video rounded-2xl overflow-auto 
                       scrollbar-thin scrollbar-thumb-[#2B3D5B] scrollbar-track-[#DDDEE5]"
                            frameBorder="0"
                            style={{
                                scrollbarWidth: "thin",
                                scrollbarColor: "#2B3D5B #DDDEE5",
                            }}
                            title="Cal.com Booking"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalScheduler;