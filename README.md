# Google Meet Now — Chrome Extension

- By clicking on the extension icon script started to run.
- It opens https://meet.google.com/landing in new tab
- Waiting until span with text "New meeting" will be visible
- If during 10 seconds span is not visible, script will be stopped and js alert `"New meeting" button is not found"`
- If span is visible, script will click on it
- Waiting until span with text "Start an instant meeting" will be visible
- If during 2 seconds span is not visible, script will be stopped and js alert `"Start an instant meeting" button is not found"`
- If span is visible, script will click on it
- Waiting until <i> with text "content_copy" will be visible
- If during 10 seconds <i> is not visible, script will be stopped and js alert `Copy link button is not found`
- Copy link to clipboard from address bar
- Script fiished
