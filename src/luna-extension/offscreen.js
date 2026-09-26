let recognition = null;

let shouldListen = false;

let starting = false;

// let microphonePermissionChecked = false;


// =========================================================
// SPEECH RECOGNITION
// =========================================================

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;


// =========================================================
// START LUNA LISTENING
// =========================================================

async function startLunaListening() {

  // -------------------------------------------------------
  // Already starting
  // -------------------------------------------------------

  if (starting) {

    console.log(
      "Luna is already starting."
    );

    return;
  }


  // -------------------------------------------------------
  // Already listening
  // -------------------------------------------------------

  if (
    recognition &&
    shouldListen
  ) {

    console.log(
      "Luna is already listening."
    );

    return;
  }


  // -------------------------------------------------------
  // Browser support
  // -------------------------------------------------------

  if (!SpeechRecognition) {

    console.error(
      "Speech Recognition is not supported."
    );

    return;
  }


  starting = true;


  // =======================================================
  // MICROPHONE PERMISSION
  // =======================================================

//   if (!microphonePermissionChecked) {

//     try {

//       console.log(
//         "Offscreen: requesting microphone permission..."
//       );


//       const stream =
//         await navigator.mediaDevices.getUserMedia({
//           audio: true
//         });


//       console.log(
//         "Offscreen: microphone permission GRANTED."
//       );


//       stream.getTracks().forEach(
//         (track) => {
//           track.stop();
//         }
//       );


//       microphonePermissionChecked = true;


//     } catch (error) {

//       console.error(
//         "Offscreen: microphone error"
//       );

//       console.error(
//         "Name:",
//         error.name
//       );

//       console.error(
//         "Message:",
//         error.message
//       );


//       starting = false;

//       return;
//     }
//   }


  // =======================================================
  // STOP OLD RECOGNITION
  // =======================================================

  if (recognition) {

    try {

      recognition.onend = null;

      recognition.onerror = null;

      recognition.onresult = null;

      recognition.onstart = null;

      recognition.stop();

    } catch (error) {

      console.log(
        "Old recognition stop error:",
        error
      );
    }


    recognition = null;
  }


  // =======================================================
  // CREATE RECOGNITION
  // =======================================================

  recognition =
    new SpeechRecognition();


  // =======================================================
  // SETTINGS
  // =======================================================

  recognition.continuous = true;

  recognition.interimResults = false;

  recognition.lang = "en-US";

  recognition.maxAlternatives = 1;


  // =======================================================
  // ON START
  // =======================================================

  recognition.onstart = () => {

    console.log(
      "Extension Luna is listening..."
    );


    starting = false;
  };


  // =======================================================
  // ON RESULT
  // =======================================================

  recognition.onresult = (event) => {

    const lastIndex =
      event.results.length - 1;


    const text =
      event.results[lastIndex][0]
        .transcript
        .toLowerCase()
        .trim();


    console.log(
      "Extension Luna heard:",
      text
    );


    chrome.runtime.sendMessage({

      type: "VOICE_COMMAND",

      command: text

    });
  };


  // =======================================================
  // ON ERROR
  // =======================================================

  recognition.onerror = (event) => {

    console.log(
      "Extension speech error:",
      event.error
    );


    starting = false;


    // -----------------------------------------------------
    // Permission denied
    // -----------------------------------------------------

    if (event.error === "not-allowed") {
  shouldListen = false;
  starting = false;

  console.error(
    "SpeechRecognition microphone permission denied."
  );

  console.error(
    "Please grant microphone permission to the Luna extension."
  );

  return;
}

    // -----------------------------------------------------
    // Aborted
    // -----------------------------------------------------

    if (
      event.error ===
      "aborted"
    ) {

      console.log(
        "Recognition was aborted."
      );


      return;
    }
  };


  // =======================================================
  // ON END
  // =======================================================

  recognition.onend = () => {

    console.log(
      "Extension recognition ended."
    );


    starting = false;


    if (!shouldListen) {

      console.log(
        "Luna listening is stopped."
      );

      return;
    }


    // -----------------------------------------------------
    // IMPORTANT:
    //
    // Automatically restart NAHI karna.
    // Sirf ONE recognition session chalega.
    // -----------------------------------------------------

    console.log(
      "Recognition ended. Waiting for next Luna cycle."
    );
  };


  // =======================================================
  // START
  // =======================================================

  shouldListen = true;


  try {

    console.log(
      "Starting SpeechRecognition..."
    );


    recognition.start();


  } catch (error) {

    console.error(
      "Recognition start error:",
      error
    );


    starting = false;
  }
}


// =========================================================
// STOP LUNA LISTENING
// =========================================================

function stopLunaListening() {

  shouldListen = false;

  starting = false;


  if (recognition) {

    try {

      recognition.onend = null;

      recognition.onerror = null;

      recognition.onresult = null;

      recognition.onstart = null;


      recognition.stop();

    } catch (error) {

      console.log(
        "Recognition stop error:",
        error
      );
    }


    recognition = null;
  }


  console.log(
    "Extension Luna stopped."
  );
}


// =========================================================
// EXTENSION MESSAGES
// =========================================================

chrome.runtime.onMessage.addListener(
  (message) => {

    // -----------------------------------------------------
    // Sirf offscreen messages
    // -----------------------------------------------------

    if (
      message.target !==
      "offscreen"
    ) {

      return;
    }


    // =====================================================
    // START
    // =====================================================

    if (
      message.type ===
      "START_LISTENING"
    ) {

      console.log(
        "Received START_LISTENING."
      );


      startLunaListening();
    }


    // =====================================================
    // STOP
    // =====================================================

    if (
      message.type ===
      "STOP_LISTENING"
    ) {

      console.log(
        "Received STOP_LISTENING."
      );


      stopLunaListening();
    }
  }
);