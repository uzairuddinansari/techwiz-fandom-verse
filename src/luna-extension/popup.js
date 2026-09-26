document
  .getElementById("startLuna")
  .addEventListener("click", () => {

    chrome.runtime.sendMessage(
      {
        type: "START_LUNA_FROM_POPUP"
      },
      response => {

        console.log(
          "Luna:",
          response
        );

      }
    );
  });

  console.log("Luna popup loaded.");