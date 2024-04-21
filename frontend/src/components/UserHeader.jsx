import {
  VStack,
  Box,
  Flex,
  Avatar,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  Link,
  Portal,
  Text,
  useToast,
  Button,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

export const UserHeader = ({ user }) => {
  const toast = useToast(); // Toast hook for showing notifications
  const currentUser = useRecoilValue(userAtom); // Current logged-in user
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  // Function to copy current URL to clipboard
  const copyURL = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Copied.",
        status: "success",
        description: "Profile link copied to Cliboard.",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      {/* User information */}
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}> {user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {/* User avatar */}
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>

      {/* User bio */}
      <Text> {user.bio}</Text>

      {/* Update profile button for current user */}
      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}

      {/* Follow/Unfollow button for other users */}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      {/* Followers count and social media link */}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} Followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          {/* Instagram icon */}
          <Box className="icon-container" mr={2}>
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          {/* More options menu */}
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  {/* Copy profile link */}
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      {/* Threads and Replies tabs */}
      <Flex w={"full"}>
        {/* Threads tab */}
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Threads</Text>
        </Flex>
        {/* Replies tab */}
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};
