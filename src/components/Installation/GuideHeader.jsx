import { ArrowLeft, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function GuideHeader({ navOpen, onToggleNav }) {
  const navigate = useNavigate();

  // Visitors who land here directly have no in-app history to go back to.
  const goBack = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate("/"));

  return (
    <header className="guide-header">
      <button type="button" className="guide-back-button" onClick={goBack}>
        <ArrowLeft size={17} />
        <span>Back</span>
      </button>

      <div className="guide-header-title">
        <span>DOCUMENTATION</span>
        <h1>Installation Guide</h1>
      </div>

      <button
        type="button"
        className="guide-menu-button"
        onClick={onToggleNav}
        aria-label={navOpen ? "Hide guide menu" : "Show guide menu"}
        aria-expanded={navOpen}
        aria-controls="guide-navigation"
      >
        {navOpen ? <X size={19} /> : <Menu size={19} />}
      </button>
    </header>
  );
}

export default GuideHeader;
