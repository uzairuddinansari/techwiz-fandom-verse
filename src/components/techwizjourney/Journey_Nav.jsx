import { Link } from "react-router-dom";

<div id="journey_parrent">
  <div className="journey_child">
    <div className="link">
      <Link to="/route-1">
        <button>Btn 1</button>
      </Link>
    </div>

    <div className="link">
      <Link to="/route-2">
        <button>Btn 2</button>
      </Link>
    </div>

    <div className="link">
      <Link to="/">
        <button>Btn 3</button>
      </Link>
    </div>

    <div className="link">
      <Link to="/route-4">
        <button>Btn 4</button>
      </Link>
    </div>
  </div>
</div>