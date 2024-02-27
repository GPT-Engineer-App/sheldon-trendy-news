import React, { useState, useEffect } from "react";
import { Box, Text, Input, Grid, VStack, HStack, IconButton, useColorMode, useColorModeValue, Container, Flex, Spacer, Button, Icon, Image, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { FaSun, FaMoon, FaRedo, FaHeart, FaStar } from "react-icons/fa";

const fetchHackerNews = async () => {
  const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const storyIds = await response.json();
  const stories = await Promise.all(
    storyIds.slice(0, 10).map(async (id) => {
      const storyResp = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return storyResp.json();
    }),
  );
  return stories;
};

const Index = () => {
  const [posts, setPosts] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const headerBgColor = useColorModeValue("gray.800", "gray.900");
  const textColor = useColorModeValue("black", "white");
  const borderColor = "linear(to-r, #ff0080, #7928ca, #ff0080, #ffeb3b, #0f0, #0ff)";

  useEffect(() => {
    const getPosts = async () => {
      const newPosts = await fetchHackerNews();
      setPosts(newPosts);
    };
    getPosts();
  }, []);

  const refreshPosts = async () => {
    const newPosts = await fetchHackerNews();
    setPosts(newPosts);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      {/* Header */}
      <VStack spacing={0} backgroundColor={headerBgColor}>
        <Flex width="full" px={6} py={4} align="center">
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            SheldonNews
          </Text>
          <Spacer />
          <IconButton icon={colorMode === "light" ? <FaMoon /> : <FaSun />} onClick={toggleColorMode} variant="ghost" color={textColor} aria-label="Toggle dark mode" />
          <IconButton icon={<FaRedo />} onClick={refreshPosts} variant="ghost" color={textColor} aria-label="Refresh posts" ml={2} />
        </Flex>
        <Box width="full" height="2px" bgGradient={borderColor} />
        <Flex width="full" px={6} py={2} align="center" backgroundColor={headerBgColor}>
          <Text fontSize="md" color={textColor}>
            Discover the future of technology today and be part of the conversation that shapes our tomorrow.
          </Text>
        </Flex>
      </VStack>

      {/* Teaser */}
      <Container maxW="940px" centerContent py={10}>
        <Text fontSize="xl" fontWeight="bold" textAlign="center" color={textColor}>
          Stay ahead of the curve with the latest tech buzz!⚡
        </Text>
      </Container>

      {/* Search Field */}
      <Container maxW="940px" centerContent py={5}>
        <Input placeholder="Search for posts..." maxW="60%" bg={bgColor} />
      </Container>

      {/* Post List */}
      <Container maxW="940px" centerContent py={5}>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </Grid>
      </Container>

      {/* Email Optin */}
      <Container maxW="940px" centerContent py={5} backgroundColor="#005ce6">
        <VStack spacing={4} width="full" p={6}>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            Join our newsletter!✨
          </Text>
          <Text fontSize="md" color="white">
            Get the latest updates in tech delivered to your inbox.
          </Text>
          <HStack spacing={2} width="full">
            <Input placeholder="Your email..." />
            <Button colorScheme="blue" bgColor="white" color="blue.800">
              Sign Up
            </Button>
          </HStack>
        </VStack>
      </Container>

      {/* Footer */}
      <VStack spacing={0} backgroundColor={headerBgColor} color={textColor} py={4}>
        <Text fontSize="md">Created by 🤖 and proud of it!</Text>
        <Text fontSize="md">© {new Date().getFullYear()} Spectactulr News. All rights reserved.</Text>
      </VStack>

      {/* Cookie Consent */}
      <CookieConsent onAccept={onClose} isOpen={isOpen} />

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cookie Consent</ModalHeader>
          <ModalCloseButton />
          <ModalBody>We use cookies to improve your experience on our website. By browsing this website, you agree to our use of cookies.</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Accept
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const PostItem = ({ post }) => {
  const [likes, setLikes] = useState(post.score);

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + 1);
  };

  return (
    <VStack spacing={4} bg={useColorModeValue("white", "gray.700")} p={4} borderRadius="md" boxShadow="md">
      <Image src="https://images.unsplash.com/photo-1671726203449-34e89df45211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDcxMzJ8MXwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5fGVufDB8fHx8MTcwOTA2MjMwMnww&ixlib=rb-4.0.3&q=80&w=1080" alt="Post Image" borderRadius="md" />
      <Text fontSize="lg" fontWeight="bold">
        {post.title}
      </Text>
      <Text fontSize="sm">{new Date(post.time * 1000).toLocaleDateString()}</Text>
      <HStack>
        <IconButton icon={<FaHeart />} variant="ghost" onClick={handleLike} aria-label="Like post" />
        <Text>{likes}</Text>
      </HStack>
    </VStack>
  );
};

const CookieConsent = ({ onAccept, isOpen }) => {
  if (!isOpen) return null;

  return (
    <Flex position="fixed" bottom="0" left="0" right="0" p={4} justifyContent="center" bgColor="#005ce6">
      <Text fontSize="sm" color="white" mr={4}>
        We use cookies to ensure you get the best experience on our website.
      </Text>
      <Button colorScheme="blue" bgColor="white" color="blue.800" onClick={onAccept}>
        Accept
      </Button>
    </Flex>
  );
};

export default Index;
