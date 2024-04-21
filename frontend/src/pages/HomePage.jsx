import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  // State variables and hooks
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    // Function to fetch feed posts
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]); // Clearing posts before fetching new ones
      try {
        const res = await fetch("/api/posts/feed", {
          credentials: "include", // Include cookies
        });
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error"); // Display error message if request fails
          return;
        }
        console.log(data);
        setPosts(data); // Setting fetched posts to state
      } catch (error) {
        showToast("Error", error.message, "error"); // Display error message if request fails
      } finally {
        setLoading(false); // Setting loading state to false after fetching posts
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]); // Dependency array with showToast and setPosts

  return (
    // Flex layout with gap and alignItems properties
    <Flex gap="10" alignItems={"flex-start"}>
      <Box flex={70}>
        {/* Message to display when posts are empty */}
        {!loading && posts.length === 0 && (
          <h1>Follow some users to see the feed</h1>
        )}

        {/* Spinner component while loading */}
        {loading && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}

        {/* Mapping over posts array and rendering Post component */}
        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>
      {/* Box component for suggested users section */}
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      >
        {/* SuggestedUsers component */}
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
