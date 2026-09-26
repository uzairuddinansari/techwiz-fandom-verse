import GelleryTabs from "../components/GelleryTabs"
import ResultGrid from "../components/ResultGrid"
import SearchBar from "../components/SearchBar"
import Breadcrumbs from "../components/fandom/Breadcrumbs"
import "../styles/Fandom.css"

const Gellery = () => {
  return (
    <main className="fv-page gallery-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: "Media search" }]} />
        <header className="fv-page-hero">
          <span className="fv-eyebrow">Media search</span>
          <h1>Every photo and video, one search.</h1>
          <p>Browse gallery images and trailers from all seven fandom hubs.</p>
        </header>
      </div>
      <SearchBar/>
      <GelleryTabs/>
      <ResultGrid/>
    </main>
  )
}

export default Gellery
