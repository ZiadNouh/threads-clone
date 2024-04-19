import { useToast } from "@chakra-ui/toast";
import { useCallback } from "react";

// Custom hook for showing toast notifications
const useShowToast = () => {
  const toast = useToast();

  // Function to display toast notification
  const showToast = useCallback(
    (title, description, status) => {
      toast({
        title,
        description,
        status,
        duration: 3000, // Toast duration in milliseconds
        isClosable: true, // Enable close button on toast
      });
    },
    [toast] // Dependency array to ensure useCallback memoization
  );

  return showToast;
};

export default useShowToast;
