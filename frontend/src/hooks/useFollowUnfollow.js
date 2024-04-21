import { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

const useFollowUnfollow = (user) => {
  const currentUser = useRecoilValue(userAtom); // Getting current user from Recoil state
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id) // Checking if the current user follows the provided user
  );
  const [updating, setUpdating] = useState(false); // State for tracking whether follow/unfollow operation is in progress
  const showToast = useShowToast(); // Custom hook for displaying toasts

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error"); // Displaying an error toast if user is not logged in
      return;
    }
    if (updating) return; // Preventing multiple follow/unfollow operations simultaneously

    setUpdating(true); // Setting updating state to true to indicate operation in progress
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        // Sending follow/unfollow request to the server
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json(); // Parsing response data from the server
      if (data.error) {
        showToast("Error", data.error, "error"); // Displaying an error toast if there is an error in the response
        return;
      }

      // Simulating updating followers locally based on follow/unfollow action
      if (following) {
        showToast("Success", `Unfollowed ${user.name}`, "success"); // Displaying a success toast for unfollow action
        user.followers.pop(); // Simulating removing from followers list
      } else {
        showToast("Success", `Followed ${user.name}`, "success"); // Displaying a success toast for follow action
        user.followers.push(currentUser?._id); // Simulating adding to followers list
      }
      setFollowing(!following); // Updating local state to reflect follow/unfollow action

      console.log(data); // Logging response data from the server
    } catch (error) {
      showToast("Error", error, "error"); // Displaying an error toast if there is an error in the try block
    } finally {
      setUpdating(false); // Resetting updating state to false after operation completes
    }
  };

  return { handleFollowUnfollow, updating, following }; // Returning necessary variables and functions for component usage
};

export default useFollowUnfollow; // Exporting the custom hook for use in other components
