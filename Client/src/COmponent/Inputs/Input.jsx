import React from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa'
import { useState } from 'react'

function Input({value,onChange,label,type ,placeholder}) {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = ()=>{
        setShowPassword(!showPassword) 
    }
  return (
    <div>
        <label className='text-[13px] text-slate-800'>{label}</label>
        <div className='input-box'>
            <input 
                type={
                    type == 'password' ? (showPassword ? "text" : "password") : type
                }
                placeholder={placeholder}
                className='w-full py-3 bg-transparent outline-none placeholder:text-slate-500 '
                value={value}
                onChange = {(e) => onChange(e)}
            />
             {type === "password" && (
                <>
                  {
                    showPassword ? (
                        <FaRegEye
                          size={22}
                          className='text-purple-700 cursor-pointer '
                          onClick={() => toggleShowPassword()}
                        />  
                    ) :(
                        <FaRegEyeSlash
                          size={22}
                          className='text-slate-400 cursor-pointer'
                          onClick={() => toggleShowPassword()}
                        />
                    )
                  }
                </>
             )}
        </div>
    </div>
  )
}

export default Input