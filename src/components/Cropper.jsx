import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './cropper.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropzone from 'react-dropzone'

// function generateDownload(canvas, crop) {
//     if (!crop || !canvas) {
//         return;
//     }

//     canvas.toBlob(
//         (blob) => {
//         const previewUrl = window.URL.createObjectURL(blob);

//         const anchor = document.createElement('a');
//         anchor.download = 'cropPreview.png';
//         anchor.href = URL.createObjectURL(blob);
//         anchor.click();

//         window.URL.revokeObjectURL(previewUrl);
//         },
//         'image/*',
//         1
//     );
// }


export default function Cropper() {
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: '%'});
    const [completedCrop, setCompletedCrop] = useState(null);

    const [dimension, setDimension] = useState({});

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', () => setUpImg(reader.result));
        reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onLoad = useCallback((img) => {
        imgRef.current = img;
        setDimension({
            height: img.height,
            width: img.width
        })
    }, []);

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
        return;
    }


    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    }, [completedCrop]);

    let display;
    if(crop.width >= 400 && crop.height >= 400){
        display = <p className="correct text">{crop.width} x {crop.height}</p>
    }   else {
        display = <p className="inCorrect">{crop.width} x {crop.height}</p>
    }


    return (
        <div className="container">
            <div className="input-container">
                <div className="col input">
                    <Dropzone onChange={onSelectFile}>
                        {({getRootProps, getInputProps}) => (
                            <section>
                            <div {...getRootProps()} >
                                <input {...getInputProps()}  id="input-button" 
                                name="upload" 
                                type="file" 
                                accept="image/*"
                                onChange={onSelectFile} />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            </div>
                            </section>
                        )}
                    </Dropzone>
                </div>
                <div className="col display">
                    <p>Selection Res: </p>{display} <p>px</p> 
                    <p>Resolution: {dimension.width} x {dimension.height}</p>
                </div>
            </div>
            <div className="content">
            <ReactCrop className="wrap"
                src={upImg}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
            />
            </div>
        </div>
    );
}