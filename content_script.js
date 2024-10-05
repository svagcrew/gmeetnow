// Global flag to prevent duplicate execution
let scriptStarted = false;

(function () {
  // Check if the script has already started
  if (scriptStarted) return;
  scriptStarted = true;

  function justWait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Function to wait for an element
  function waitForElement(
    selector,
    textContent,
    timeout,
    errorMessage,
    additionalWait = 0
  ) {
    return new Promise(function (resolve, reject) {
      let elapsedTime = 0;
      const interval = 100;

      const checkExist = setInterval(function () {
        const elements = document.querySelectorAll(selector);
        for (let element of elements) {
          if (element.textContent.trim() === textContent) {
            clearInterval(checkExist);
            setTimeout(() => resolve(element), additionalWait);
            return;
          }
        }
        elapsedTime += interval;
        if (elapsedTime >= timeout) {
          clearInterval(checkExist);
          reject(errorMessage);
        }
      }, interval);
    });
  }

  // Determine the current page and act accordingly
  if (window.location.pathname === "/landing") {
    // We're on the landing page
    console.log("On landing page");
    chrome.runtime.onMessage.addListener(function (message) {
      if (message.action === "startScript") {
        console.log("Starting automation from landing page...");
        startAutomationFromLandingPage();
      }
    });
  } else {
    // We're on the meeting page
    console.log("On meeting page");
    startAutomationOnMeetingPage();
  }

  function startAutomationFromLandingPage() {
    // Step 1: Click "New meeting"
    waitForElement(
      "span",
      "New meeting",
      10000,
      '"New meeting" button is not found'
    )
      .then(function (newMeetingButton) {
        newMeetingButton.click();
        // Step 2: Click "Start an instant meeting"
        return waitForElement(
          "span",
          "Start an instant meeting",
          2000,
          '"Start an instant meeting" button is not found'
        );
      })
      .then(function (instantMeetingButton) {
        instantMeetingButton.click();
        // The page will now navigate to the meeting page
      })
      .catch(function (errorMessage) {
        alert(errorMessage);
      });
  }

  function startAutomationOnMeetingPage() {
    // Step 3: Click the "content_copy" icon to copy the link (does not work, becouse of the security reasons)
    // waitForElement(
    //   "i",
    //   "content_copy",
    //   10000,
    //   "Copy link button is not found",
    //   1000
    // )
    //   .then(function (copyLinkButton) {
    //     copyLinkButton.click();
    //     console.log("Meeting link copied to clipboard.");
    //   })
    //   .catch(function (errorMessage) {
    //     alert(errorMessage);
    //   });

    // Will just copy the url from the address bar to clipboard
    navigator.clipboard.writeText(window.location.href.split("?")[0]).then(
      function () {
        console.log("Meeting link copied to clipboard.");
      },
      function () {
        alert("Failed to copy meeting link to clipboard.");
      }
    );
  }
})();
