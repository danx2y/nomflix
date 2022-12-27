import { useHistory, useLocation } from "react-router";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { fetchResults, IFetchVideos } from "../api";
import { motion } from "framer-motion";
import { IForm } from "../components/Header";
import styled from "styled-components";
import { useEffect } from "react";
import ResultsSlider from "../components/ResultsSlider";
import { Helmet } from "react-helmet";

const Wrapper = styled.form`
  width: 100vw;
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const IconContainer = styled(motion.div)`
  background: ${(props) => props.theme.red};
  padding: 17px;
  border: solid 1px #ffffff;
  cursor: pointer;
  svg {
    fill : white;
    height: 30px;
  }
`;

const InputSearch = styled.input`
  font-size: 22px;
  padding: 22px;
  font-weight: 600;
  outline: none;
`;

const ResultSummary = styled.h1`
  position: absolute;
  bottom: 10px;
  padding: 10px;
  font-size: 20px;
  color: ${(props) => props.theme.white.darker};
  span {
    color: ${(props) => props.theme.white.lighter};
    font-weight: 800;
  }
`;

const iconContainerVariants = {
  normal : {
    background: "rgba(229,16,19,1)",
  },
  hover : {
    background: ["rgba(229,16,19,1)", "rgba(194,27,29,1)", "rgba(229,16,19,1)"],
    transition: {
      duration: 3,
      repeat: Infinity,
    }
  }
}

function Search() {
  const history = useHistory();
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = (data: IForm) => {
    history.push(`/search?keyword=${data.keyword}`);
    setValue("keyword", "");
  };
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const {data: movieResults, refetch:movieRefetch} = useQuery<IFetchVideos>(
    ["results", "movie"], 
    () => fetchResults("movie", keyword)
  );
  const {data: programResults, refetch:programRefetch} = useQuery<IFetchVideos>(
    ["results", "program"], 
    () => fetchResults("tv", keyword)
  );
  useEffect(() =>  {
    movieRefetch();
    programRefetch();
  }, [keyword, movieRefetch, programRefetch]);
  const movieResultsLength = movieResults?.results.length as number;
  const programResultsLength = programResults?.results.length as number;
  return (
    <>
      <Helmet>
        <title>놈플릭스 - 검색</title>
        <link rel="icon" type="image/png" href="favicon.ico" sizes="16x16" />
      </Helmet>
      <Wrapper onSubmit={handleSubmit(onValid)}>
        <InputSearch 
          {...register("keyword", { 
            required: true, 
            minLength: 2 
          })} 
          type="text" 
          placeholder="영화, 프로그램을 찾아보세요." 
        />
        <IconContainer
          variants={iconContainerVariants}
          initial="normal"
          whileHover="hover"
        >
          <motion.svg
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z"
              ></path>
            </motion.svg>
        </IconContainer>
        <ResultSummary>
        <span>{keyword} </span>
        검색 결과 총 
        <span> {(movieResultsLength + programResultsLength)}</span>
        건을 찾았습니다.
      </ResultSummary>
      </Wrapper>
      <hr />
      <ResultsSlider data={movieResults} media="movie" title="영화 검색결과" keyword={`${keyword}`} />
      <ResultsSlider data={programResults} media="program" title="프로그램 검색결과" keyword={`${keyword}`} />
    </>
  );
}
export default Search;