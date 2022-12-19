import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { IFetchVideos, fetchMovies } from "../api";

const Wrapper = styled.div`
  position: relative;
  height: 300px;
`;
const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 20px 10px;
  color: ${(props) => props.theme.white.darker};
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const ArrowBtn = styled(motion.div)`
  position: absolute;
  background-color: #00000070;
  height: 200px;
  width: 50px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 1000;
  cursor: pointer;
  svg {
    width: 24px;
    fill: #ffffff99;
  }
  &:hover {
    background-color: #00000099;
    svg {
      fill: #ffffff;
    }
  }
`;

const Info = styled(motion.div)`
  padding: 13px;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 1));
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 16px;
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
  top: -100vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  z-index: 2;
  box-shadow: 0 0 10px 3px #00000030;
  background: linear-gradient(45deg, #141414, #191919);
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px 30px 20px 30px;
  font-size: 46px;
  position: relative;
  top: -80px;
  font-weight: 800;
`;

const BigOverview = styled.p`
  padding: 30px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 18px;
  line-height: 1.8;
  font-style: italic;
`

const rowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth + 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

interface ISliderProps {
  media: string;
  type: string;
  title: string;
}

function Slider({media, type, title}:ISliderProps) {
  const { data } = useQuery<IFetchVideos>(
    [media, type],
    () => fetchMovies(type)
  );
  const history = useHistory();
  const { scrollY } = useScroll();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const bigMatch = useRouteMatch<{ movieId: string }>(`/${media}/${type}/:movieId`);
  const clickedMovie =
    bigMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMatch.params.movieId);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onOverlayClick = () => history.push(`/${media}`);
  const onBoxClicked = (movieId: number) => {
    history.push(`/${media}/${type}/${movieId}`);
  };

  return (
    <>
      <Wrapper style={{top: -200}}>
        <Title>{title}</Title>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie: any) => (
                <Box
                  layoutId={title + "_" + movie.id + "_" + type}
                  key={movie.id + "_" + type}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  onClick={() => onBoxClicked(movie.id)}
                  transition={{ type: "tween" }}
                  bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))
            }
          </Row>
          <ArrowBtn onClick={incraseIndex}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 384 512"
            >
              <path 
                d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
              />
            </svg>
          </ArrowBtn>
        </AnimatePresence>
      </Wrapper>
      <AnimatePresence>
        {clickedMovie && (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            {clickedMovie && (
            <BigMovie
              style={{ top: scrollY.get() + 100 }}
              layoutId={title + "_" + bigMatch.params.movieId + "_" + type}
            >
              <BigCover
                style={{
                  backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                    clickedMovie.backdrop_path,
                    "w780"
                  )})`,
                }}
              />
              <BigTitle>{clickedMovie.title}</BigTitle>
              <BigOverview>{
                !clickedMovie.overview 
                ? "API에서 데이터를 찾을 수 없습니다." 
                : clickedMovie.overview}
              </BigOverview>
            </BigMovie>
          )}
        </>
      )}
      </AnimatePresence>
    </>
  )
}

export default Slider;