import React from 'react'
import Input from '../../../Component/Inputs/Input.jsx';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

function ProjectsForm({ projects, updateArrayItem, addArrayItem, removeArrayItem }) {
    return (
        <div className='px-5 pt-5 bg-white rounded-lg shadow-md'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Projects</h2>

            <div className='space-y-6'>
                {projects.map((project, index) => (
                    <div key={index} className='border border-gray-200 rounded-md p-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3'>
                            <div className='space-y-4'>
                                <Input
                                    label="Project Title"
                                    placeholder="Portfolio Website"
                                    type="text"
                                    value={project.title || ""}
                                    onChange={(e) => updateArrayItem("projects", index, "title", e.target.value)}
                                    className='w-full'
                                />
                            </div>

                            <div className='space-y-4'>
                                <label className='block text-sm font-medium text-gray-700'>
                                    Description
                                </label>
                                <textarea
                                    placeholder='Short description of the project'
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 resize-y'
                                    rows={3}
                                    value={project.description || ""}
                                    onChange={({ target }) => updateArrayItem("projects", index, "description", target.value)}
                                />
                            </div>

                            <Input
                                label="Github Link"
                                placeholder="https://github.com/username/repo"
                                type="url"
                                value={project.github || ""}
                                onChange={({ target }) => updateArrayItem("projects", index, "github", target.value)}
                                className='w-full'
                            />
                            <Input
                                label="Live Demo Link"
                                placeholder="https://username.github.io/repo"
                                type="url"
                                value={project.liveDemo || ""}
                                onChange={({ target }) => updateArrayItem("projects", index, "liveDemo", target.value)}
                                className='w-full'
                            />
                        </div>

                        {projects.length > 1 && (
                            <button
                                type='button'
                                className='flex items-center text-red-600 hover:text-red-800 transition-colors duration-200'
                                onClick={() => removeArrayItem("projects", index)}
                            >
                                <LuTrash2 className='mr-1' /> Remove
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type='button'
                    className='flex items-center px-4 py-2 btn-small text-white rounded-md hover:bg-blue-700 transition-colors duration-200'
                    onClick={() => addArrayItem("projects", {
                        title: "",
                        description: "",
                        github: "",
                        liveDemo: "",
                    })}
                >
                    <LuPlus /> Add Project
                </button>
            </div>
        </div>
    )
}

export default ProjectsForm