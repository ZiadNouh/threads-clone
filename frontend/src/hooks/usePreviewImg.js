import { useState } from "react";
import useShowToast from "./useShowToast";

// Custom hook for previewing image before uploading
const usePreviewImg = () => {
  // State to store the URL of the previewed image
  const [imgUrl, setImgUrl] = useState(null);
  // Accessing showToast function from useShowToast custom hook
  const showToast = useShowToast();

  // Function to handle image change event
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // Checking if the selected file is an image
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      // Reading the selected image file and setting the preview URL
      reader.onloadend = () => {
        setImgUrl(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      // Displaying an error toast if the selected file is not an image
      showToast("Invalid file type", " Please select an image file", "error");
      setImgUrl(null);
    }
  };

  // Returning handleImageChange function, imgUrl state, and setImgUrl function
  return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;
