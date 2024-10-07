chrome.action.onClicked.addListener(function () {
  chrome.tabs.create(
    { url: "https://meet.google.com/landing" },
    function (newTab) {
      // Send the message when the tab finishes loading
      chrome.tabs.onUpdated.addListener(function listener(
        tabId,
        changeInfo,
        tab
      ) {
        if (tabId === newTab.id && changeInfo.status === "complete") {
          // Remove this listener as it's no longer needed
          chrome.tabs.onUpdated.removeListener(listener);
          // Send a message to the content script to start the automation
          chrome.tabs.sendMessage(newTab.id, { action: "startScript" });
        }
      });

      // Listen for navigation to the meeting page
      chrome.webNavigation?.onCompleted.addListener(
        function (details) {
          if (
            details.tabId === newTab.id &&
            details.url.includes("https://meet.google.com/")
          ) {
            // Inject the content script into the meeting page
            chrome.scripting.executeScript(
              {
                target: { tabId: newTab.id },
                files: ["content_script.js"],
              },
              function () {
                console.log("Content script injected into meeting page.");
              }
            );
          }
        },
        { url: [{ urlMatches: "https://meet.google.com/*" }] }
      );
    }
  );
});
