import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
// import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

// Maximum characters allowed in a post
const MAX_CHAR = 500;

// Component definition for creating a new post
const CreatePost = () => {
  // State and hooks initialization
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook to handle modal state
  const [postText, setPostText] = useState(""); // State for post text content
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg(); // Custom hook for handling image preview
  const imageRef = useRef(null); // Ref for file input element
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR); // State for remaining characters count
  const user = useRecoilValue(userAtom); // Recoil hook for getting user data
  const showToast = useShowToast(); // Custom hook for showing toast notifications
  const [loading, setLoading] = useState(false); // State for loading status
  // const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams(); // Hook for getting URL parameters

  // Function to handle text input change
  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  // Function to handle post creation
  const handleCreatePost = async () => {
    setLoading(true);
    try {
      // Sending post data to the server
      const res = await fetch("/api/posts/create", {
        method: "POST",
        credentials: "include", // Include cookies in the request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
        }),
      });

      // Handling response from the server
      const data = await res.json();
      if (data.error) {
        // Show error toast if there's an error in response
        showToast("Error", data.error, "error");
        return;
      }
      // Show success toast if post creation is successful
      showToast("Success", "Post created successfully", "success");
      // Update local posts state if the current user's page is being viewed
      if (username === user.username) {
        // setPosts([data, ...posts]);
      }
      // Reset post text and image URL, and close the modal
      onClose();
      setPostText("");
      setImgUrl("");
    } catch (error) {
      // Show error toast if there's an error during post creation process
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };

  // Rendering JSX
  return (
    <>
      {/* Button to open the modal for creating a post */}
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      >
        <AddIcon />
      </Button>

      {/* Modal for creating a post */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* Form control for post text */}
            <FormControl>
              <Textarea
                placeholder="Post content goes here.."
                onChange={handleTextChange}
                value={postText}
              />
              {/* Display remaining characters count */}
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              {/* Input for uploading image */}
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              {/* Button for selecting image */}
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {/* Display selected image */}
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          {/* Modal footer with post button */}
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
