const OFFSCREEN_URL = "offscreen.html";


// =========================================================
// CREATE OFFSCREEN
// =========================================================

async function createOffscreen() {

  const offscreenUrl =
    chrome.runtime.getURL(OFFSCREEN_URL);

  const contexts =
    await chrome.runtime.getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
      documentUrls: [offscreenUrl]
    });

  if (contexts.length > 0) {
    return;
  }

  await chrome.offscreen.createDocument({
    url: OFFSCREEN_URL,
    reasons: ["USER_MEDIA"],
    justification:
      "Listen for Luna voice commands when the Luna website is closed"
  });

  console.log(
    "Offscreen document created."
  );
}


// =========================================================
// SEND MESSAGE TO OFFSCREEN
// =========================================================

async function sendToOffscreen(message) {

  try {

    await createOffscreen();

    chrome.runtime.sendMessage({
      target: "offscreen",
      ...message
    });

  } catch (error) {

    console.error(
      "Could not send message to offscreen:",
      error
    );
  }
}


// =========================================================
// START EXTENSION LUNA
// =========================================================

async function startExtensionLuna() {

  try {

    const result =
      await chrome.storage.local.get([
        "lunaTabId"
      ]);


    // -----------------------------------------------------
    // Agar Luna website already open hai
    // to extension listening nahi karegi.
    // -----------------------------------------------------

    if (result.lunaTabId) {

      console.log(
        "Luna website is open. Extension remains stopped."
      );

      return;
    }


    await sendToOffscreen({
      type: "START_LISTENING"
    });


    console.log(
      "Extension Luna started."
    );

  } catch (error) {

    console.error(
      "Could not start Extension Luna:",
      error
    );
  }
}



async function stopExtensionLuna() {

  try {

    const contexts =
      await chrome.runtime.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"]
      });


    if (contexts.length === 0) {

      console.log(
        "No offscreen document to stop."
      );

      return;
    }


    chrome.runtime.sendMessage({
      target: "offscreen",
      type: "STOP_LISTENING"
    });


    console.log(
      "Extension Luna stopped."
    );

  } catch (error) {

    console.error(
      "Could not stop Extension Luna:",
      error
    );
  }
}




async function openWebsite() {

  const result =
    await chrome.storage.local.get([
      "websiteUrl"
    ]);


  if (!result.websiteUrl) {

    console.log(
      "No Luna website URL saved."
    );

    return;
  }


  console.log(
    "Opening Luna website:",
    result.websiteUrl
  );



  await stopExtensionLuna();


  

  const tab =
    await chrome.tabs.create({
      url: result.websiteUrl
    });



  await chrome.storage.local.set({
    lunaTabId: tab.id
  });


  console.log(
    "Luna website tab saved:",
    tab.id
  );
}


chrome.runtime.onInstalled.addListener(() => {

  console.log(
    "Luna Extension installed."
  );
});



chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {

    console.log(
      "Message from Luna website:",
      message
    );
   
    if (
  message.type ===
  "OPEN_MIC_PERMISSION"
) {
  chrome.tabs.create({
    url: chrome.runtime.getURL("mic.html")
  });

  sendResponse({
    success: true
  });

  return true;
}

    if (
      message.type ===
      "SAVE_WEBSITE_URL"
    ) {

      chrome.storage.local
        .set({
          websiteUrl: message.url,
          lunaTabId: sender.tab?.id
        })
        .then(async () => {

          console.log(
            "Website URL saved:",
            message.url
          );


          if (sender.tab?.id) {

            console.log(
              "Luna website tab saved:",
              sender.tab.id
            );
          }


          // Website open hai,
          // extension ko listening nahi karna.
          await stopExtensionLuna();

        });


      sendResponse({
        success: true
      });

      return true;
    }


    // =====================================================
    // OPEN WEBSITE
    // =====================================================

    if (
      message.type ===
      "OPEN_WEBSITE"
    ) {

      openWebsite();

      sendResponse({
        success: true
      });

      return true;
    }


    // =====================================================
    // START EXTENSION LUNA
    // =====================================================

    if (
      message.type ===
      "START_EXTENSION_LUNA"
    ) {

      startExtensionLuna()
        .then(() => {

          sendResponse({
            success: true
          });

        })
        .catch((error) => {

          console.error(error);

          sendResponse({
            success: false,
            error: error.message
          });

        });


      return true;
    }
  }
);


// =========================================================
// EXTENSION INTERNAL MESSAGES
// =========================================================

chrome.runtime.onMessage.addListener(
  (message) => {
     
    

    // =====================================================
    // VOICE COMMAND
    // =====================================================

    if (
      message.type ===
      "VOICE_COMMAND"
    ) {

      const command =
        String(
          message.command || ""
        )
          .toLowerCase()
          .trim();


      console.log(
        "Extension heard:",
        command
      );


      if (
        command ===
          "open my website" ||
        command ===
          "open your website"
      ) {

        openWebsite();
      }
    }
  }
);


// =========================================================
// LUNA WEBSITE TAB CLOSED
// =========================================================

chrome.tabs.onRemoved.addListener(
  async (tabId) => {

    console.log(
      "Tab closed:",
      tabId
    );


    const result =
      await chrome.storage.local.get([
        "lunaTabId"
      ]);


    // -----------------------------------------------------
    // Agar ye Luna website ka tab nahi tha
    // to kuch nahi karna.
    // -----------------------------------------------------

    if (
      !result.lunaTabId ||
      tabId !== result.lunaTabId
    ) {

      return;
    }


    console.log(
      "Luna website closed."
    );


    // Luna tab ID remove karo
    await chrome.storage.local.remove(
      "lunaTabId"
    );


    // -----------------------------------------------------
    // Ab extension ONE TIME start hogi
    // -----------------------------------------------------

    await startExtensionLuna();
  }
);


// =========================================================
// CHROME STARTUP
// =========================================================

chrome.runtime.onStartup.addListener(
  async () => {

    console.log(
      "Chrome started. Checking Luna..."
    );


    const result =
      await chrome.storage.local.get([
        "websiteUrl",
        "lunaTabId"
      ]);


    if (!result.websiteUrl) {

      console.log(
        "No saved Luna website URL."
      );

      return;
    }


    // -----------------------------------------------------
    // Agar Luna website tab already saved hai,
    // extension OFF rahegi.
    // -----------------------------------------------------

    if (result.lunaTabId) {

      console.log(
        "Luna website is already open."
      );

      return;
    }


    // -----------------------------------------------------
    // Website closed hai → extension ONE TIME start
    // -----------------------------------------------------

    console.log(
      "Luna website is closed. Starting extension..."
    );


    await startExtensionLuna();
  }
);