import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import "./Home.css";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";

const Home = () => {
  return (
    <div>
      <Header />
      <ExploreMenu />
      <FoodDisplay />
      <AppDownload />
    </div>
  );
};

export default Home;
