export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};


//get light color from image
export const getLightColorFromImage = (imageUrl) =>{
    return new Promise((resolve, reject) =>{
        if(!imageUrl || typeof imageUrl !== 'string'){
            return reject(new Error("Invalid image url"));
        }
        const img = new Image();

        //If not a base64 string, set crossOrigin (important for CORS)

        if(!imageUrl.startsWith('data:')){
            img.crossOrigin = 'anonymous';
        }
        img.src = imageUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let r = 0;
            let g = 0;
            let b = 0;
            let count = 0;

            for(let i=0; i<data.length; i+=4){
                const red = data[i];
                const green = data[i+1];
                const blue = data[i+2];
                const brightness = (red +green +blue)/3;

                // only count light pixels
                if(brightness > 180){
                    r += red;
                    g += green;
                    b += blue;
                    count++;
                }
            }
            
            if(count === 0){
                resolve("#ffffff");
            } else {
                r = Math.round(r/count);
                g = Math.round(g/count);
                b = Math.round(b/count);
                resolve(`rgb(${r},${g},${b})`);
            }
        }; 

        img.onerror = (error) => {
            console.log('Failed to load image:', error);
            reject(new Error('Image could not be loaded or is vlocked by CORS'));
        };
    });
};