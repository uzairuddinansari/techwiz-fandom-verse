import { useState ,useEffect} from "react";
const ShowPopup = () => {
      const [showPopup, setShowPopup] = useState(false);

useEffect(() => {
  console.log("HOME USEEFFECT RUNNING");

  const permission = localStorage.getItem("lunaMicrophonePermission");

  console.log("Permission:", permission);

  if (!permission) {
    setShowPopup(true);
  }
}, []);

const EXTENSION_ID = "bbkbbmibijbnlmdpeeanfkhfjjegahje";

const requestMicrophonePermission = () => {
  if (
    typeof chrome === "undefined" ||
    !chrome.runtime ||
    typeof chrome.runtime.sendMessage !== "function"
  ) {
    console.log("Luna extension is not available.");
    return;
  }

  chrome.runtime.sendMessage(
    EXTENSION_ID,
    { type: "OPEN_MIC_PERMISSION" },
    (response) => {
      if (chrome.runtime.lastError) {
        console.log("Extension:", chrome.runtime.lastError.message);
        return;
      }

      console.log("Microphone permission response:", response);
    }
  );
};
  return (
    <> 
         {showPopup && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 999999,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <div
      style={{
        background: "white",
        padding: "40px",
        borderRadius: "20px",
        color: "black"
      }}
    >
      <h2>MICROPHONE POPUP TEST</h2>

      <button
        onClick={() => {
          localStorage.setItem("lunaMicrophonePermission", "allowed");
          requestMicrophonePermission();
          setShowPopup(false);
        }}
      >
        Allow
      </button>

      <button onClick={() => setShowPopup(false)}>
        Cancel
      </button>
    </div>
  </div>
     )}
</>
  )
}

export default ShowPopup