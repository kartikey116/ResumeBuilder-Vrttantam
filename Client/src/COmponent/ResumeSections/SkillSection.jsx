import React from 'react'
import Progress from '../Progress.jsx';

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
    <div className=''>
      {skills?.map((skill,index)=>(
        <Skillinfo
            key={`skill_${index}`}
            skill={skill.skill}
            progress={skill.progress}
            accentColor={accentColor}
            bgColor={bgColor}
        />
      ))}
    </div>
  )
}

export default SkillSection
