import {
  Box,
  Flex,
  Heading,
  Stack,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  Spinner,
  Center
} from "@chakra-ui/react";
import { useState } from "react";
import {
  RiAlertLine,
  RiFileList3Line,
  RiFireFill,
  RiHeartFill,
  RiHeartLine,
  RiInboxLine,
  RiSearchLine
} from "react-icons/ri";

/*
Requirements:
  - Movie List
    - Render movie data
      - Data source: https://developers.themoviedb.org
      - API key：`ba9e9eb1cba46fa2c366ab90f70a5dbe` 
    - Show popular movies as default (without search keywords)
      - API document：https://developers.themoviedb.org/3/movies/get-popular-movies
    - Show loading UI before retrieving data from API
    - Show error UI if failed to retrieve data
    - Show empty UI if there isn't any data in the list
  - Complete the "Movie" component
    - Show "Title", "Production Year" and "Add to Wishlist" button (a heart icon button)
    - When user clicked on the heart icon button, the movie will be added to user's wishlist and the heart icon will become solid
    - If user clicked on a solid heart icon button, the movie will be removed from the wishlist
    - The movies in the wishlist will remain after user refreshed the page
  - Search movie
    - API document：https://developers.themoviedb.org/3/search/search-movies
    - User can search movies by entering keywords in the input field, the result will replace the original data in the movie list
    - Show empty result UI if there is no mated result
  - Wishlist
    - Clicking the “Wishlist” button on the top-right will open the wishlist modal
    - The list will display all movies that was added to the wishlist by the user
    - Clicking on the solid heart icon button on the movie will remove the corresponding movie from the wishlist
*/

const Movie = () => {
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);

  return (
    <Flex
      w="full"
      px="24px"
      py="16px"
      bgColor="white"
      borderRadius="md"
      justify="space-between"
      align="center"
      boxShadow="sm"
    >
      <Box>
        <Text fontWeight="semibold" isTruncated>
          Movie Title
        </Text>
        <Text color="gray.400" fontSize="xs" isTruncated>
          2022
        </Text>
      </Box>
      <IconButton
        variant="ghost"
        colorScheme="pink"
        icon={isAddedToWishlist ? <RiHeartFill /> : <RiHeartLine />}
        aria-label="edit"
        _focus={{ outline: "none" }}
        isRound
        onClick={() => setIsAddedToWishlist(!isAddedToWishlist)}
      />
    </Flex>
  );
};

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bgColor="#f3f3f3" h="100vh">
      <Flex w="full" h="full" px="32px" pt="64px" direction="column">
        <Flex w="full" mb="32px" justify="space-between" align="center">
          <Heading fontSize="24px">Movies</Heading>
          <Button
            size="md"
            colorScheme="pink"
            leftIcon={<RiHeartLine />}
            onClick={onOpen}
          >
            Wishlist
          </Button>
        </Flex>
        <InputGroup mb="16px">
          <InputLeftElement
            pointerEvents="none"
            color="gray.500"
            children={<RiSearchLine />}
          />
          <Input type="tel" placeholder="Search Movies" bg="white" />
        </InputGroup>

        {/* ----- Loading UI ----- */}
        {/* <Box py="32px">
          <Spinner color="pink.600" />
        </Box> */}

        {/* ----- Error UI ----- */}
        {/* <Center py="32px" color="pink.600" flexDirection="column">
          <Box fontSize="x-large" mb="8px">
            <RiAlertLine />
          </Box>
          <Box>Something went wrong.</Box>
          <Box>Please try again.</Box>
        </Center> */}

        {/* ----- Empty  UI ----- */}
        {/* <Center py="32px" color="pink.600" flexDirection="column">
          <Box fontSize="x-large" mb="8px">
            <RiInboxLine />
          </Box>
          No data.
        </Center> */}

        {/* ----- Movie List (Popular movies) ------ */}
        <Flex
          fontWeight="600"
          color="pink.600"
          mb="8px"
          align="center"
          gap="4px"
        >
          <RiFireFill />
          Popular movies
        </Flex>
        <Stack
          w="full"
          minH="0"
          pb="32px"
          flex={1}
          overflowY="auto"
          spacing="8px"
        >
          <Movie />
        </Stack>

        {/* ----- Search Result UI ------ */}
        {/* <Flex
          fontWeight="600"
          color="pink.600"
          mb="8px"
          align="center"
          gap="4px"
        >
          <RiFileList3Line />
          Search result
        </Flex>
        <Stack
          w="full"
          minH="0"
          pb="32px"
          flex={1}
          overflowY="auto"
          spacing="8px"
        >
          <Movie />
        </Stack> */}

        {/* ----- Empty Result UI ----- */}
        {/* <Center py="32px" color="pink.600" flexDirection="column">
          <Box fontSize="x-large" mb="8px">
            <RiInboxLine />
          </Box>
          No matched result.
        </Center> */}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="#f3f3f3">
          <ModalHeader>Wishlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody p="32px">
            {/* ----- Empty UI ----- */}
            {/* <Center py="32px" color="pink.600" flexDirection="column">
              <Box fontSize="x-large" mb="8px">
                <RiInboxLine />
              </Box>
              Find your favorite movies!
              <Button
                mt="16px"
                size="md"
                variant="outline"
                colorScheme="blackAlpha"
                onClick={onClose}
              >
                Close
              </Button>
            </Center> */}

            {/* ----- Movie List ------ */}
            <Stack>
              <Movie />
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default App;
