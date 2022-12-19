import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { makeImagePath } from "../utils";
import { IFetchMovies, fetchMoviesNowPlaying } from "../api";
import Slider from "../components/Slider";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 100px;
  font-weight: 1000;
  margin-bottom: 20px;
  text-align: center;
  margin-bottom: 60px;
  text-shadow: 3px 3px 10px #00000050;
  color: ${(props) => props.theme.white.lighter};
`;

const Overview = styled.p`
  font-size: 20px;
  padding: 0 25%;
  line-height: 1.8;
  text-indent: 20px;
  text-align: justify;
  text-shadow: 0 0 3px #00000050;
`;

function Home() {
  const { data: moviesNowPlaying, isLoading: moviesNowPlayingIsLoading } = useQuery<IFetchMovies>(
    ["movies", "nowPlaying"], 
    fetchMoviesNowPlaying
  );
  /* const { data: moviesPopular, isLoading: moviesPopularIsLoading } = useQuery<IFetchMovies>(
    ["movies", "Popular"], 
    fetchMoviesPopular
  ); */

  return (
    <Wrapper>
      {moviesNowPlayingIsLoading /* && moviesPopularIsLoading */ ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner 
            bgphoto={makeImagePath(moviesNowPlaying?.results[0].backdrop_path || "")}
          >
            <Title>{moviesNowPlaying?.results[0].title}</Title>
            <Overview>{moviesNowPlaying?.results[0].overview}</Overview>
          </Banner>
          <h1 style={{color: "white"}}>최신 영화</h1>
          <AnimatePresence>
            <Slider data={moviesNowPlaying} isLoading={moviesNowPlayingIsLoading}></Slider>
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
  export default Home;