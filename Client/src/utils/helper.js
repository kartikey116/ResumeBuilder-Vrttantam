import moment from 'moment';
import html2canvas from 'html2canvas';

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

//
export function formatYearMonth(yearMonth){
    return yearMonth ? moment(yearMonth,"YYYY-MM").format("YYYY - MMM") : "";
}

export function fixTailwindColors(element) {
  if (!element) return;

  const traverse = (el) => {
    if (el.style) {
      // Check background-color and color
      ["backgroundColor", "color", "borderColor"].forEach((prop) => {
        if (el.style[prop] && el.style[prop].includes("oklch")) {
          // Convert to a safe fallback color
          el.style[prop] = "transparent"; // fallback, or choose closest hex
        }
      });
    }
    // Traverse child nodes
    el.childNodes.forEach(traverse);
  };

  traverse(element);
}

//convert component to image 
// export async function captureElementAsImage(element){
//     if(!element) throw new Error("No element provided");
//     const canvas = await html2canvas(element);
//     return canvas.toDataURL("image/png");
//}

export async function captureElementAsImage(element) {
  if (!element) throw new Error("No element provided");
  
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: true,
      scale: 1,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.offsetWidth,
      windowHeight: element.offsetHeight,
      onclone: (clonedDoc) => {
        // Fix any issues in the cloned document
        fixTailwindColors(clonedDoc.body);
      }
    });
    
    return canvas.toDataURL("image/png", 0.95);
  } catch (error) {
    console.error('html2canvas error:', error);
    throw new Error(`Failed to capture element as image: ${error.message}`);
  }
}

//Utility to convert base64 data url to a file object
export const dataURLtoFile = (dataUrl ,fileName) =>{
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


