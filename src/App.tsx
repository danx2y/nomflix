import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Movie from "./routes/Movie";
import Search from "./routes/Search";
import Program from "./routes/Program";

function App() {
  return (
    <Router basename="nomflix">
      <Header />
      <Switch>
        <Route path="/tv">
          <Program />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path={["/movie", "/movie/:movieId"]}>
          <Movie />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;