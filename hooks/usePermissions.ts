import { useState } from "react";

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

export const usePermissions = () => {
  const [cameraGranted, setCameraGranted] = useState(false);
  const [libraryGranted, setLibraryGranted] = useState(false);

  const requestPhotoPermissions = async () => {
    const camera = await ImagePicker.requestCameraPermissionsAsync();
    const library = await MediaLibrary.requestPermissionsAsync();

    setCameraGranted(camera.granted);
    setLibraryGranted(library.granted);

    return {
      camera: camera.granted,
      library: library.granted
    };
  };

  return {
    cameraGranted,
    libraryGranted,
    requestPhotoPermissions
  };
};
