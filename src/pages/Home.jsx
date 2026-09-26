import Hero from "../components/Hero";
import {
  CategoryShowcase,
  FeaturedShowcase,
  HomeCTA,
  HomeEvents,
  HomeNews,
  HubStrip,
} from "../components/fandom/HomeSections";

const Home = () => {
  return (
    <>
      <Hero />
      <HubStrip />
      <CategoryShowcase />
      <FeaturedShowcase />
      <HomeEvents />
      <HomeNews />
      <HomeCTA />
    </>
  );
};

export default Home;
