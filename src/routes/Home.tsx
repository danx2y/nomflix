import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../utils";
import { IFetchMovies, fetchMoviesNowPlaying } from "../api";

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
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
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

const Slider = styled.div`
  position: relative;
  top: -100px;
  &:nth-child(2) {
    top: -500px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useScroll();
  const { data: moviesNowPlaying, isLoading: moviesNowPlayingIsLoading } = useQuery<IFetchMovies>(
    ["movies", "nowPlaying"], 
    fetchMoviesNowPlaying
  );
  /* const { data: moviesPopular, isLoading: moviesPopularIsLoading } = useQuery<IFetchMovies>(
    ["movies", "Popular"], 
    fetchMoviesPopular
  ); */

  const onOverlayClick = () => history.push("/");
  const clickedMovie =
  bigMovieMatch?.params.movieId &&
  moviesNowPlaying?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
  return (
    <Wrapper>
      {moviesNowPlayingIsLoading && moviesPopularIsLoading ? (
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
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
  export default Home;