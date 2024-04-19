import { useEffect, useState } from "react";
import { UserHeader } from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const { user, loading } = useGetUserProfile(); // Fetch user profile data
  const { username } = useParams(); // Get username from URL params
  const showToast = useShowToast(); // Custom hook for displaying toasts
  const [posts, setPosts] = useRecoilState(postsAtom); // State for user's posts
  const [fetchingPosts, setFetchingPosts] = useState(true); // State for fetching posts indicator

  useEffect(() => {
    // Effect for fetching user's posts
    const getPosts = async () => {
      if (!user) return; // Return if user data is not available yet
      setFetchingPosts(true); // Set fetching posts indicator to true
      try {
        const res = await fetch(`/api/posts/user/${username}`, {
          credentials: "include", // Include cookies for authentication
        });
        const data = await res.json(); // Parse response data
        setPosts(data); // Set fetched posts to state
      } catch (error) {
        showToast("Error", error.message, "error"); // Show toast if there's an error
        setPosts([]); // Set posts to empty array
      } finally {
        setFetchingPosts(false); // Set fetching posts indicator to false
      }
    };

    getPosts(); // Call the function to fetch posts
  }, [username, showToast, setPosts, user]); // Dependencies for useEffect

  // Render loading spinner if user profile is still loading
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  // Render "User not found" if user is not found
  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      {/* Render user header */}
      <UserHeader user={user} />

      {/* Render message if user has no posts */}
      {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
      {/* Render spinner while fetching posts */}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {/* Map through posts array and render Post components */}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default UserPage;
