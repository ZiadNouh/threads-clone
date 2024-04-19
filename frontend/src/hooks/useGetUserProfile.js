import { useEffect, useState } from "react"; // State management hooks
import { useParams } from "react-router-dom"; // Hook for accessing route parameters
import useShowToast from "./useShowToast"; // Custom hook for showing toasts

// Custom hook for fetching user profile data
const useGetUserProfile = () => {
  // State for storing user data
  const [user, setUser] = useState(null);
  // State for tracking loading state
  const [loading, setLoading] = useState(true);
  // Retrieve username from route parameters
  const { username } = useParams();
  // Custom hook for showing toast messages
  const showToast = useShowToast();

  // Effect hook to fetch user profile data
  useEffect(() => {
    const getUser = async () => {
      try {
        // Fetch user profile data
        const res = await fetch(`/api/users/profile/${username}`, {
          credentials: "include",
        });
        // Parse response data
        const data = await res.json();
        // Handle error response
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        // Check if user is frozen
        if (data.isFrozen) {
          setUser(null);
          return;
        }
        // Set user data
        setUser(data);
      } catch (error) {
        // Handle network error
        showToast("Error", error.message, "error");
      } finally {
        // Set loading state to false
        setLoading(false);
      }
    };
    // Call getUser function
    getUser();
  }, [username, showToast]); // Dependency array

  // Return loading state and user data
  return { loading, user };
};

export default useGetUserProfile;
