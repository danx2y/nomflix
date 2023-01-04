import styled from "styled-components";
import { useQuery } from "react-query";
import { makeImagePath } from "../utils";
import { IFetchVideos, fetchMovies } from "../api";
import Slider from "../components/Slider";
import { Helmet } from "react-helmet";

const Wrapper = styled.div`
  background: #070707;
  overflow-y: hidden;
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
  background-image: linear-gradient(rgba(7, 7, 7, 0.3), rgba(7, 7, 7, 1)),
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
  font-style: italic;
  text-indent: 20px;
  text-align: justify;
  text-shadow: 0 0 3px #00000050;
`;

function Movie() {
  const { data, isLoading } = useQuery<IFetchVideos>(
    ["movies", "nowPlaying"], 
    () => fetchMovies("now_playing")
  );
  return (
    <>
      <Helmet>
        <title>놈플릭스 - 영화</title>
        <link rel="icon" type="image/png" href="favicon.ico" sizes="16x16" />
      </Helmet>
      <Wrapper>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Banner 
              bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
            >
              <Title>{data?.results[0].title}</Title>
              <Overview>{data?.results[0].overview}</Overview>
            </Banner>
            <Slider media={"movie"} type={"now_playing"} title={"최신 영화"} />
            <Slider media={"movie"} type={"popular"} title={"인기 영화"} />
            <Slider media={"movie"} type={"top_rated"} title={"최고평점 영화"} />
            <Slider media={"movie"} type={"upcoming"} title={"개봉예정 영화"} />
          </>
        )}
      </Wrapper>
    </>
  );
}
export default Movie;