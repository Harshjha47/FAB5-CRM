import React from "react";

export const InputUnit = ({type,name,placeholder,label,em,max,min,change,value,maxLength,prop})=> {
  return (
    <div className="flex flex-col ">
      <label htmlFor={name} className="pl-1 text-sm">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        min={min}
        maxLength={maxLength}
        disabled={prop}
        max={max}
        value={value}
        onChange={change}
        className="outline-none rounded-md border w-full px-2 py-1"
        required
      />
      <div className="leading-[1] text-xs pl-2 ">{em == "Required" ? "" : em}</div>
    </div>
  );
}

export const InputUnitFlow = ({type,name,placeholder,label,em,max,min,change,value,maxLength,prop})=> {
  return (
    <div className="flex flex-col gap-4">
      <label htmlFor={name} className=" text-sm ">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        min={min}
        maxLength={maxLength}
        disabled={prop}
        max={max}
        value={value}
        onChange={change}
        className="outline-none rounded-md  w-full py-2"
        required
      />
      <div className="leading-[1] text-xs pl-2 border-b">{em == "Required" ? "" : em}</div>
    </div>
  );
}
