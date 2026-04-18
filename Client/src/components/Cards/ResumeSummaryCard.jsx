import React from 'react'
import { useState, useEffect } from 'react';
import { getLightColorFromImage } from '../../utils/helper.js';
import { FiCheckCircle, FiShare2 } from 'react-icons/fi';

function ResumeSummaryCard({
    imgUrl, title, lastUpdated, onSelect, atsScore, onAtsCheck, onPublish
}) {

    const [bgColor, setBgColor] = useState("#ffffff");

    useEffect(() => {
        if(imgUrl){
            getLightColorFromImage(imgUrl)
            .then((color) => {
                setBgColor(color);
            })
            .catch(() => {
                setBgColor("#ffffff");
            });
        }
    },[imgUrl]);
  return (
    <div className='h-[300px] flex flex-col items-center justify-between bg-white rounded-lg border border-gray-200 hover:border-purple-300 overflow-hidden cursor-pointer' 
    style={{backgroundColor:bgColor}} onClick={onSelect}>
        <div className='p-4 relative w-full'>
            {atsScore && <div className='absolute top-2 right-2 bg-[#1e2330] text-blue-400 font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg border border-slate-700 shadow flex items-center gap-1 text-[10px] uppercase tracking-wider'><FiCheckCircle /> {atsScore}% Match</div>}
            {imgUrl ?(
                <img src={imgUrl} alt=""  className='w-[100%] h-[200px] rounded'/>
            ) : (
                <div></div>
            )}
        </div>
        <div className='w-full bg-white px-4 py-3'>
            <h5 className='text-sm font-medium truncate overflow-hidden whitespace-nowrap'>{title}</h5>
            <div className="flex justify-between items-center mt-1 gap-1">
                <p className='text-xs font-medium text-gray-500 truncate'>Updated: {lastUpdated}</p>
                <div className="flex gap-1 shrink-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAtsCheck && onAtsCheck(); }} 
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded border border-blue-200 text-xs font-semibold z-10 transition-colors"
                  >
                    ATS
                  </button>
                  {onPublish && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onPublish(); }} 
                      className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-2 py-1 rounded border border-purple-200 text-xs font-semibold z-10 transition-colors flex items-center gap-1"
                    >
                      <FiShare2 size={10}/> Publish
                    </button>
                  )}
                </div>
            </div>
        </div>
    </div>
  )
}
export default ResumeSummaryCard