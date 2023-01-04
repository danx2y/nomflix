import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useWindowDimensions, { makeImagePath } from "../utils";
import noImage from "../images/no-image.svg";

const Wrapper = styled.div`
  position: relative;
  height: 300px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0.5vw 20px 0.5vw;
  color: ${(props) => props.theme.white.darker};
  span {
    margin-left: 10px;
    font-size: 20px;
    ${(props) => props.theme.white.lighter};
    font-weight: 800;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100vw;
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
  height: 50px;
  width: 50px;
  border-radius: 25px;
  border: solid 1px #ffffff50;
  padding: 15px;
  top: 120px;
  right: 1vw;
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
  background: linear-gradient(rgba(7, 7, 7, 0.3), rgba(7, 7, 7, 1));
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 16px;
    line-height: 1.6;
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
  background: linear-gradient(45deg, #070707, #141414);
`;

const BigCover = styled.div<{ bgphoto: string }>`
  width: 100%;
  background-image: linear-gradient(to bottom, #00000010, #141414), url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigCategory = styled.div`
  position: absolute;
  margin: 20px 30px;
  display: flex;
  gap: 10px;
  p {
    padding: 5px 10px;
    border-radius: 5px;
    background-color: #880000;
    border: solid 1px #ffffff99;
    font-size: 14px;
    font-weight: 800;
  }
  p:last-child {
    background-color: #ff7b00;
  }
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px 30px 20px 30px;
  font-size: 42px;
  position: relative;
  top: -80px;
  font-weight: 800;
  p {
    position: absolute;
    left: 30px;
    top: -40px;
    opacity: 0.3;
    font-style: italic;
    font-size: 36px;
    padding-right: 30px;
  }
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

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    y: -20,
    transition: {
      delay: 0.3,
      duration: 0.5,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.6,
      duration: 0.2,
      type: "tween",
    },
  },
};

const offset = 6;

interface ISliderProps {
  data: any;
  media: string;
  title: string;
  keyword: string;
}

function ResultsSlider({data, media, title, keyword}:ISliderProps) {
  const history = useHistory();
  const { scrollY } = useScroll();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const resetLeaving = () => setLeaving(false);
  const activateLeaving = () => setLeaving(true);
  const totalMovies = data?.results.length as number;
  const maxIndex = (Math.ceil(totalMovies / offset) - 1) as number;
  const incraseIndex = () => {
    activateLeaving();
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    setTimeout(resetLeaving, 1000);
  };
  const bigMatch = useRouteMatch<{ movieId: string }>(`/search/:movieId`);
  const clickedMovie =
    bigMatch?.params.movieId &&
    data?.results.find((movie: any) => movie.id === +bigMatch.params.movieId);
  const onOverlayClick = () => history.push(`/search?keyword=${keyword}`);
  const onBoxClicked = (movieId: number) => {
    history.push(`/search/${movieId}?keyword=${keyword}`);
  };
  const width = useWindowDimensions();
  useEffect(() => {
    setIndex(0);
  }, [keyword]);
  return (
    <>
      <Wrapper style={{top: 20}}>
        <Title>
          {title}
          <span>{data?.results.length}건</span>
        </Title>
        <AnimatePresence initial={false}>
          <Row
            initial={{ x: width + 10 }}
            animate={{ x: 0 }}
            exit={{ x: -width - 10 }}
            transition={{ type: "tween", duration: 1 }}
            key={index}
          > 
            {data?.results
              .slice(offset * index, offset * index + offset)
              .map((movie: any) => (
                <Box
                  layoutId={title + "_" + movie.id}
                  key={movie.id}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  onClick={() => onBoxClicked(movie.id)}
                  transition={{ type: "tween" }}
                  bgphoto={!movie.backdrop_path ? noImage : makeImagePath(movie.backdrop_path, "w500")}
                >
                  <Info variants={infoVariants}>
                    <h4>
                      {
                        media === "movie" 
                        ? movie.title 
                        : media === "program"
                        ? movie.name 
                        : "API에서 데이터를 찾을 수 없습니다."
                      }
                    </h4>
                  </Info>
                </Box>
              ))
            }
          </Row>
          {maxIndex > 0 && ( 
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
          )}
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
              layoutId={title + "_" + bigMatch.params.movieId}
            >
              <BigCategory>
                {!clickedMovie.release_date ? "" : <p>최초공개 {clickedMovie.release_date}</p>}
                {!clickedMovie.vote_average ? "" : <p>평점 {clickedMovie.vote_average}</p>}
              </BigCategory>
              <BigCover
                bgphoto={!clickedMovie.backdrop_path ? noImage : makeImagePath(clickedMovie.backdrop_path, "w780")}
              />
              <BigTitle>
                {
                  media === "movie" 
                  ? clickedMovie.title 
                  : media === "program"
                  ? clickedMovie.name 
                  : "API에서 데이터를 찾을 수 없습니다."
                }
                <p>
                  {
                    media === "movie" 
                    ? clickedMovie.original_title 
                    : media === "program"
                    ? clickedMovie.original_name 
                    : "API에서 데이터를 찾을 수 없습니다."
                  }
                </p>
              </BigTitle>
              <BigOverview>
                {
                  !clickedMovie.overview 
                  ? "API에서 데이터를 찾을 수 없습니다." 
                  : clickedMovie.overview.length > 450
                  ? clickedMovie.overview.slice(0, 450) + "..."
                  : clickedMovie.overview
                }
              </BigOverview>
            </BigMovie>
          )}
        </>
      )}
      </AnimatePresence>
    </>
  )
}

export default ResultsSlider;