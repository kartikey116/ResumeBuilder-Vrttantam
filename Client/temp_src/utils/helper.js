import moment from 'moment';
import html2canvas from 'html2canvas';

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const getLightColorFromImage = (imageUrl) =>{
    return new Promise((resolve, reject) =>{
        if(!imageUrl || typeof imageUrl !== 'string'){
            return reject(new Error("Invalid image url"));
        }
        const img = new Image();

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
            reject(new Error('Image could not be loaded or is blocked by CORS'));
        };
    });
};

export function formatYearMonth(yearMonth){
    return yearMonth ? moment(yearMonth,"YYYY-MM").format("YYYY - MMM") : "";
}

// Not needed anymore - kept for backwards compatibility
export function fixTailwindColors(element) {
  // This function is now handled directly in UploadResumeImages
  console.log('fixTailwindColors called - handled in upload function');
}

// Not needed anymore - captureElementAsImage is now handled directly in UploadResumeImages
export async function captureElementAsImage(element) {
  console.warn('captureElementAsImage called - this should be handled in UploadResumeImages');
  throw new Error('Please use the capture logic in UploadResumeImages directly');
}

export const dataURLtoFile = (dataUrl, fileName) =>{
 const arr = dataUrl.split(',');
 const mime = arr[0].match(/:(.*?);/)[1];
 const bstr = atob(arr[1]);
 let n = bstr.length;
 const u8arr = new Uint8Array(n);
 while(n--){
     u8arr[n] = bstr.charCodeAt(n);
 }
 return new File([u8arr], fileName, {type:mime});
};