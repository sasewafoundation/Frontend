import React from 'react';

const LogoLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-7">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[7px] border-primary-100 border-t-primary-600 animate-spin" />
          <div className="w-36 h-36 rounded-full bg-white border border-neutral-200 shadow-md flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Sa-Sewa Foundation" className="w-24 h-24 object-contain" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-neutral-700">Sa-Sewa Foundation</p>
          <p className="text-sm font-semibold text-neutral-400 mt-2 uppercase tracking-[0.22em]">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LogoLoader;