import { Link, useRouteMatch, useHistory } from "react-router-dom";
import styled from "styled-components";
import { motion, useAnimation, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  font-size: 16px;
  padding: 20px 60px;
  color: white;
  z-index: 3;
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  margin-right: 50px;
  width: 100px;
  height: 40px;
  fill: ${(props) => props.theme.red};
  cursor: pointer;
  path {
    stroke-width: 2px;
    stroke: #880000;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Search = styled(motion.form)`
  color: ${(props) => props.theme.white.lighter};
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  svg {
    fill: ${(props) => props.theme.white.lighter};
    height: 20px;
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  bottom: -10px;
  /* to the center */
  left: 0;
  right: 0;
  margin: 0 auto;
  /*  */
  background-color: ${(props) => props.theme.red};
`;

const Input = styled(motion.input)<{$checkScroll: boolean}>`
  min-width: 250px;
  transform-origin: right center;
  position: absolute;
  right: 0px;
  vertical-align: center;
  padding: 12px;
  padding-left: 40px;
  z-index: -1;
  color: ${(props) => props.theme.white.lighter};
  font-size: 16px;
  background-color: transparent;
  border: 1px solid;
  border-color: ${(props) => props.theme.white.lighter};
  border-radius: 5px;
  box-shadow: 0 0 5px 3px #00000010;
  outline: none;
  ::placeholder {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

const navVariants = {
  top: {
    backgroundColor: "rgba(20, 20, 20, 0)",
  },
  scroll: {
    backgroundColor: "rgba(20, 20, 20, 1)",
  },
};

export interface IForm {
  keyword: string;
}

function Header() {
  const [checkScroll, setCheckScroll] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const movieMatch = useRouteMatch("/movie");
  const programMatch = useRouteMatch("/program");
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const searchAnimation = useAnimation();
  const { scrollY } = useScroll();
  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({ scaleX: 1 });
    }
    setSearchOpen((prev) => !prev);
  };
  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 80) {
        setCheckScroll(true);
        navAnimation.start("scroll");
      } else {
        setCheckScroll(false);
        navAnimation.start("top");
      }
    });
  }, [scrollY, navAnimation, inputAnimation, searchAnimation]);
  const history = useHistory();
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = (data: IForm) => {
    history.push(`/search?keyword=${data.keyword}`);
    setValue("keyword", "");
  };
  return (
    <Nav variants={navVariants} animate={navAnimation} initial={"top"}>
      <Col>
        <Logo
          variants={logoVariants}
          whileHover="active"
          animate="normal"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1426.99 383.36"
          onClick={() => history.push(`/movie`)}
        >
          <motion.path d="M1102 347.85c20.03 1.54 40.03 3.18 60 4.96V0h-60v347.85ZM135 216.95 56.86 0H0v383.36c19.96-2.85 39.96-5.57 60-8.18v-208.1l69.4 199.36c21.83-2.53 43.69-4.93 65.6-7.18V0h-60v216.95ZM683 333l60-.01V196h81v-59h-81V60h108V0H683v333zM1426.99 0h-66l-43.51 100.85L1278.38 0h-65.01l69.86 180.21L1206.96 357c21.1 2.06 42.15 4.25 63.16 6.57l44.36-102.79 43.93 113.31c22.88 2.94 45.71 6.01 68.49 9.26l.09-.04-78.28-201.89L1426.99 0ZM949 0h-60v336.07c54.56 1.88 108.89 4.63 163 8.25v-59.21a5144.27 5144.27 0 0 0-103-5.83V0ZM253 353.52c22.57-1.87 117.77-9.68 167-12.53V0H253v353.52ZM314 61h46v225.3l-46 3.71V61ZM551.53 165.48 513.63 0H459v339.59c15.5-.65 34.55-1.42 55-2.21V170.04l19.47 86.64.16.32h35.98L590 167.91v167.6c20.18-.64 39.18-1.17 55-1.47V0h-55l-38.47 165.48Z" />
        </Logo>
        <Items>
          <Item>
            <Link to="/movie">
              영화 {movieMatch?.isExact && <Circle layoutId="circle" />}
            </Link>
          </Item>
          <Item>
          <Link to="/program">
              프로그램 {programMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search
          animate={searchAnimation} 
          onSubmit={handleSubmit(onValid)}
        >
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpen ? -230 : 0 }}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z"
            ></path>
          </motion.svg>
          <>
            <Input
              {...register("keyword", { required: true, minLength: 2 })}
              animate={inputAnimation}
              initial={{ scaleX: 0 }}
              placeholder="영화, 프로그램을 찾아보세요."
              $checkScroll={checkScroll}
            />
          </>
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;