import Image from "next/image"

const CustomLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <div className="flex justify-center relative rounded-full w-[90px] h-[90px] mx-auto">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-300 animate-pulsate"></div>
            <div className="z-10 relative flex items-center justify-center">
            <Image 
                className="h-20 w-20  rounded-full animate-pulsate-opacity animate-spin"
                src={'/logo3.png'}
                alt="Logo Spinner"
                width={90}
                height={90}
            />
            </div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-300 animate-pulsate-reverse"></div>
      </div>

      <div className="mt-6 text-gray-500 animate-pulsate-opacity"><span className="uppercase">KoalaBear AI</span> is thinking</div>
    </div>
  );
}



export default CustomLoader;
