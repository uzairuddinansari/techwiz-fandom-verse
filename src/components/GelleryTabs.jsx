import { useDispatch, useSelector } from "react-redux";
import { setActivetab } from "../Redux/feature/SearchSlide";
import "../styles/GelleryTabs.css";

const tabs = ["photos", "videos"];

const GelleryTabs = () => {
  const dispatch = useDispatch();
  const active = useSelector((state) => state.search.activetab);

  return (
    <div id="tab" role="tablist" aria-label="Media type">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          className={`tab_button ${active === tab ? "active" : ""}`}
          onClick={() => dispatch(setActivetab(tab))}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default GelleryTabs;
