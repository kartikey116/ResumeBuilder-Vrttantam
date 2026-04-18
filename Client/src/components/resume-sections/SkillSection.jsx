import React from 'react'
import Progress from '../ui/Progress.jsx';

const Skillinfo =({skill,progress,accentColor,bgColor}) =>{
    return (
        <div className='flex items-center justify-between'>
            <p className={`text-[12px] font-semibold text-gray-900`}>{skill}</p>
            {progress > 0 && (
                <Progress
                    progress ={(progress/100)*5}
                    color={accentColor}
                    bgColor={bgColor}
                />
            )}
        </div>
    )
}

const SkillSection = ({skills,accentColor,bgColor}) => {
  return (
    <div className='print-safe-section'>
      {skills?.map((skill,index)=>(
        <div key={`skill_${index}`} className="mb-2">
          {skill.category && <h4 className="text-[13px] font-bold text-gray-800 mb-1">{skill.category}</h4>}
          <Skillinfo
              skill={skill.name}
              progress={skill.progress}
              accentColor={accentColor}
              bgColor={bgColor}
          />
        </div>
      ))}
    </div>
  )
}

export default SkillSection
