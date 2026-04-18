import React from 'react';
const fonts = [
    { name: 'Arial', family: 'Arial, sans-serif' },
    { name: 'Calibri', family: 'Calibri, sans-serif' },
    { name: 'Cambria', family: 'Cambria, serif' },
    { name: 'Garamond', family: 'Garamond, serif' },
    { name: 'Georgia', family: 'Georgia, serif' },
    { name: 'Helvetica', family: 'Helvetica, sans-serif' },
    { name: 'Lato', family: 'Lato, sans-serif' },
    { name: 'Merriweather', family: 'Merriweather, serif' },
    { name: 'Montserrat', family: 'Montserrat, sans-serif' },
    { name: 'Open Sans', family: '"Open Sans", sans-serif' },
    { name: 'Roboto', family: 'Roboto, sans-serif' },
    { name: 'Times New Roman', family: '"Times New Roman", Times, serif' },
    { name: 'Verdana', family: 'Verdana, sans-serif' },
    { name: 'Source Sans Pro', family: '"Source Sans Pro", sans-serif' },
    { name: 'Poppins', family: 'Poppins, sans-serif' },
    { name: 'Noto Sans', family: '"Noto Sans", sans-serif' }
];

const FontSelector = ({ selectedFont, onSelectFont }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {fonts.map((font) => (
                <div
                    key={font.name}
                    onClick={() => onSelectFont(font.family)}
                    style={{ fontFamily: font.family }}
                    className={`cursor-pointer p-4 border-2 text-center rounded-lg transition-all duration-200 hover:bg-purple-50 ${selectedFont === font.family ? 'border-purple-500 bg-purple-100' : 'border-gray-200'}`}
                >
                    {font.name}
                </div>
            ))}
        </div>
    );
};

export default FontSelector;
