async function requestMicrophone() {
  try {
    console.log(
      "Mic page: requesting microphone permission..."
    );

    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    console.log(
      "Mic page: microphone permission GRANTED."
    );

    document.getElementById(
      "status"
    ).textContent =
      "Microphone permission granted!";

    stream.getTracks().forEach(
      (track) => track.stop()
    );

    setTimeout(() => {
      window.close();
    }, 700);

  } catch (error) {
    console.error(
      "Mic permission error:",
      error
    );

    document.getElementById(
      "status"
    ).textContent =
      "Microphone permission was not granted.";
  }
}

requestMicrophone();