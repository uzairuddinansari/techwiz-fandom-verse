import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setQuery } from "../Redux/feature/SearchSlide"
import "../styles/GallerySearch.css"

const SearchBar = () => {
  const query = useSelector((state) => state.search.query)
  const [search, setsearch] = useState(query)
  const [lastQuery, setLastQuery] = useState(query)
  const dispatch = useDispatch()

  // Keep the box in step when the query changes elsewhere (e.g. "Clear search").
  if (query !== lastQuery) {
    setLastQuery(query)
    setsearch(query)
  }

  const formHandler = (e) => {
    e.preventDefault()
    dispatch(setQuery(search.trim()))
  }

  return (
    <div className="gallery-search">
      <form onSubmit={formHandler} className="gallery-search-form" role="search">
        <label htmlFor="gallery-search-input" className="sr-only">Search photos and videos</label>
        <input
          id="gallery-search-input"
          type="search"
          value={search}
          onChange={(e) => setsearch(e.target.value)}
          placeholder="Search photos and videos…"
          className="gallery-search-input"
          enterKeyHint="search"
        />

        <button type="submit" className="gallery-search-button">
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar
