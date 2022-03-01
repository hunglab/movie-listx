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
  Center,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  RiAlertLine,
  RiFileList3Line,
  RiFireFill,
  RiHeartFill,
  RiHeartLine,
  RiInboxLine,
  RiSearchLine,
} from "react-icons/ri";

import axios from "axios";
import { useCookies } from "react-cookie";

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

const Movie = ({
  sendData,
  isWishList,
}: {
  sendData: any;
  isWishList: any;
}) => {
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const [liked, setLiked] = useState(Array());
  const [cookies, setCookie] = useCookies(["wishlist"]);

  return (
    <div>
      {sendData.results &&
        Object.values(sendData.results).map((item: any, index: number) =>
          isWishList == true ? (
            cookies.wishlist?.includes(item.id) ? (
              <Flex
                w="full"
                px="24px"
                py="16px"
                mb="5px"
                bgColor="white"
                borderRadius="md"
                justify="space-between"
                align="center"
                key={index}
                boxShadow="sm">
                <Box isTruncated>
                  <Text fontWeight="semibold" isTruncated>
                    {item.original_title}
                  </Text>
                  <Text color="gray.400" fontSize="xs" isTruncated>
                    {item.release_date?.slice(
                      0,
                      item.release_date.indexOf("-")
                    )}
                  </Text>
                </Box>
                <IconButton
                  variant="ghost"
                  colorScheme="pink"
                  icon={
                    cookies.wishlist?.includes(item.id) ? (
                      <RiHeartFill />
                    ) : (
                      <RiHeartLine />
                    )
                  }
                  aria-label="edit"
                  _focus={{ outline: "none" }}
                  isRound
                  onClick={() => {
                    if (
                      cookies.wishlist &&
                      cookies.wishlist.includes(item.id)
                    ) {
                      let unlike = cookies.wishlist.filter(
                        (elem: any) => elem !== item.id
                      );
                      setLiked(unlike);
                      setCookie("wishlist", unlike, { path: "/" });
                    } else {
                      setLiked([...liked, item.id]);
                      setCookie("wishlist", [...cookies.wishlist, item.id], {
                        path: "/",
                      });
                    }
                  }}
                />
              </Flex>
            ) : (
              ""
            )
          ) : (
            <Flex
              w="full"
              px="24px"
              py="16px"
              mb="5px"
              bgColor="white"
              borderRadius="md"
              justify="space-between"
              align="center"
              key={index}
              boxShadow="sm">
              <Box isTruncated>
                <Text fontWeight="semibold" isTruncated>
                  {item.original_title}
                </Text>
                <Text color="gray.400" fontSize="xs" isTruncated>
                  {item.release_date?.slice(0, item.release_date.indexOf("-"))}
                </Text>
              </Box>
              <IconButton
                variant="ghost"
                colorScheme="pink"
                icon={
                  cookies.wishlist?.includes(item.id) ? (
                    <RiHeartFill />
                  ) : (
                    <RiHeartLine />
                  )
                }
                aria-label="edit"
                _focus={{ outline: "none" }}
                isRound
                onClick={() => {
                  console.log(liked);
                  if (cookies.wishlist && cookies.wishlist.includes(item.id)) {
                    let unlike = cookies.wishlist.filter(
                      (elem: any) => elem !== item.id
                    );
                    setLiked(unlike);
                    setCookie("wishlist", unlike, { path: "/" });
                  } else {
                    setLiked([...liked, item.id]);
                    setCookie("wishlist", [...cookies.wishlist, item.id], {
                      path: "/",
                    });
                  }
                }}
              />
            </Flex>
          )
        )}
    </div>
  );
};

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [cookies, setCookie] = useCookies(["wishlist"]);

  let inputHandler = (e: any) => {
    var lowerCase = e.target.value.toLowerCase();
    if (lowerCase.length <= 0) {
      setIsSearch(false);
    } else {
      setIsSearch(true);
    }
    setInputText(lowerCase);

    // Search API
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "https://api.themoviedb.org/3/search/movie?api_key=ba9e9eb1cba46fa2c366ab90f70a5dbe&language=en-US&query=" +
            lowerCase +
            "&page=1&include_adult=false"
        );
        if (Object.keys(response).length === 0) {
          setEmpty(true);
        } else {
          setData(response);
        }
        // console.log(JSON.stringify(response));
      } catch (error) {
        console.error(error);
        setError(true);
      }
      setLoading(false);
      console.log("fetchdata");
    };

    if (lowerCase.length > 0 || lowerCase !== "") {
      fetchData();
    }
  };

  // Popular Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "https://api.themoviedb.org/3/movie/popular?api_key=ba9e9eb1cba46fa2c366ab90f70a5dbe&language=en-US&page=1"
        );
        if (Object.keys(response).length === 0) {
          setEmpty(true);
        } else {
          setData(response);
        }
      } catch (error) {
        console.error(error);
        setError(true);
      }
      setLoading(false);
    };

    fetchData();
  }, [isSearch]);

  // Search Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "https://api.themoviedb.org/3/movie/popular?api_key=ba9e9eb1cba46fa2c366ab90f70a5dbe&language=en-US&page=1"
        );
        if (Object.keys(response).length === 0) {
          setEmpty(true);
        } else {
          setSearchData(response);
        }
      } catch (error) {
        console.error(error);
        setError(true);
      }
      setLoading(false);
    };

    fetchData();
  }, [isSearch]);

  const sendData = (data: any) => {
    console.log(JSON.stringify(data, null, "  "));
    setData(data);
  };

  return (
    <Box bgColor="#f3f3f3" h="100vh">
      <Flex w="full" h="full" px="32px" pt="64px" direction="column">
        <Flex w="full" mb="32px" justify="space-between" align="center">
          <Heading fontSize="24px">Movies</Heading>
          <Button
            size="md"
            colorScheme="pink"
            leftIcon={<RiHeartLine />}
            onClick={onOpen}>
            Wishlist
          </Button>
        </Flex>
        <InputGroup mb="16px">
          <InputLeftElement
            pointerEvents="none"
            color="gray.500"
            children={<RiSearchLine />}
          />
          <Input
            type="tel"
            placeholder="Search Movies"
            bg="white"
            onChange={inputHandler}
          />
        </InputGroup>

        {/* ----- Loading UI ----- */}
        <Box py="32px" display={loading ? "flex" : "none"}>
          <Spinner color="pink.600" />
        </Box>

        {/* ----- Error UI ----- */}
        <Center
          py="32px"
          color="pink.600"
          flexDirection="column"
          display={error ? "flex" : "none"}>
          <Box fontSize="x-large" mb="8px">
            <RiAlertLine />
          </Box>
          <Box>Something went wrong.</Box>
          <Box>Please try again.</Box>
        </Center>

        {/* ----- Empty  UI ----- */}
        <Center
          py="32px"
          color="pink.600"
          flexDirection="column"
          display={empty ? "flex" : "none"}>
          <Box fontSize="x-large" mb="8px">
            <RiInboxLine />
          </Box>
          No data.
        </Center>

        {/* ----- Movie List (Popular movies) ------ */}
        <Flex
          fontWeight="600"
          color="pink.600"
          mb="8px"
          align="center"
          gap="4px"
          display={
            error ? "none" : empty ? "none" : isSearch ? "none" : "flex"
          }>
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
          display={
            error ? "none" : empty ? "none" : isSearch ? "none" : "flex"
          }>
          <Movie sendData={data} isWishList="false" />
        </Stack>

        {/* ----- Search Result UI ------ */}
        <Flex
          fontWeight="600"
          color="pink.600"
          mb="8px"
          align="center"
          gap="4px"
          display={
            error ? "none" : empty ? "none" : isSearch ? "flex" : "none"
          }>
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
          display={
            error ? "none" : empty ? "none" : isSearch ? "flex" : "none"
          }>
          <Movie sendData={data} isWishList="false" />
        </Stack>

        {/* ----- Empty Result UI ----- */}
        <Center
          py="32px"
          color="pink.600"
          flexDirection="column"
          display={empty ? "flex" : "none"}>
          <Box fontSize="x-large" mb="8px">
            <RiInboxLine />
          </Box>
          No matched result.
        </Center>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="#f3f3f3">
          <ModalHeader>Wishlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody p="32px">
            {/* ----- Empty UI ----- */}
            <Center
              py="32px"
              color="pink.600"
              flexDirection="column"
              display={cookies.wishlist ? "none" : "flex"}>
              <Box fontSize="x-large" mb="8px">
                <RiInboxLine />
              </Box>
              Find your favorite movies!
              <Button
                mt="16px"
                size="md"
                variant="outline"
                colorScheme="blackAlpha"
                onClick={onClose}>
                Close
              </Button>
            </Center>

            {/* ----- Movie List ------ */}
            <Stack display={cookies.wishlist ? "flex" : "none"}>
              <Movie sendData={searchData} isWishList={true} />
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default App;
