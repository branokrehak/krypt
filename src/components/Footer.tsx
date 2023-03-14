import logo from '/images/logo.png';

export function Footer() {
  return (
    <div className='w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer'>
      <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
        <div className="flex flex-[0.5] justify-center items-center">
          <img src={logo} alt="logo" className='w-32' />
        </div>
      </div>

      <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5"></div>

      <div className="text-white flex justify-center items-center flex-col mt-5 text-center">branislav.krehak@gmail.com</div>
    </div>
  );
} 