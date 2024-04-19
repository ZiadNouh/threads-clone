import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const Post = ({ post, postedBy }) => {
  // State variables and hooks
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch user data
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy, {
          credentials: "include", // Include cookies
        });
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error"); // Display error message if request fails
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error"); // Display error message if request fails
        setUser(null);
      }
    };

    getUser();
  }, [postedBy, showToast]); // Dependency array with postedBy and showToast

  // Function to handle post deletion
  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
        credentials: "include", // Include cookies
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error"); // Display error message if request fails
        return;
      }
      showToast("Success", "Post deleted", "success"); // Display success message after deletion
      setPosts(posts.filter((p) => p._id !== post._id)); // Update posts state after deletion
    } catch (error) {
      showToast("Error", error.message, "error"); // Display error message if request fails
    }
  };

  // Return null if user data is not available yet
  if (!user) return null;

  // JSX code to render post details
  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        {/* Avatar and user details */}
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={user.name}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
          {/* Displaying avatars of users who replied */}
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right="-5px"
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left="4px"
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        {/* Post content */}
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            {/* User's username */}
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.username}
              </Text>
              {/* Verified badge */}
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            {/* Timestamp and delete button */}
            <Flex gap={4} alignItems={"center"}>
              {/* Time since post creation */}
              <Text
                fontSize={"xs"}
                width={36}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {/* Delete icon for current user's posts */}
              {currentUser?._id === user._id && (
                <DeleteIcon size={20} onClick={handleDeletePost} />
              )}
            </Flex>
          </Flex>

          {/* Post text */}
          <Text fontSize={"sm"}>{post.text}</Text>
          {/* Post image */}
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}

          {/* Post actions */}
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
