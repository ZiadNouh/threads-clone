import React from "react";
import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";

// LogoutButton component for rendering the logout button
export const LogoutButton = () => {
  // State and function hooks for managing user state and displaying toast notifications
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      // Sending a POST request to the backend to logout the user
      const res = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json(); // Parsing response data
      if (data.error) {
        showToast("Error", data.error, "error"); // Displaying error message if logout fails
      }
      localStorage.removeItem("user-threads"); // Removing user data from local storage
      setUser(null); // Clearing user state
    } catch (error) {
      showToast("Error", error, "error"); // Displaying error message if request fails
    }
  };

  // JSX code to render the logout button
  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      onClick={handleLogout}
    >
      <FiLogOut size={20} />
    </Button>
  );
};
