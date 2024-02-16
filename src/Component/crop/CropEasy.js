import React, { useState } from "react";
import Cropper from "react-easy-crop";

const CropEasy = ({ photoUrl }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  return (
    <>
      <Cropper image={photoUrl} crop={crop} zoom={zoom} rotation={rotation} aspect={1} onZoomChange={setZoom} onRotationChange={setRotation} onCropChange={setCrop} onCropComplete={cropComplete} />
    </>
  );
};

export default CropEasy;
