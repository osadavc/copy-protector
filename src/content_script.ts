import getClipboard from "./utils/getClipboard";

let clickedElement: EventTarget | null = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "protected-paste": {
      protectedPaste();
      break;
    }
    default: {
      break;
    }
  }
});

document.addEventListener(
  "contextmenu",
  (event) => {
    clickedElement = event.target;
  },
  true
);

const protectedPaste = () => {
  const clipboardText = getClipboard();
  (clickedElement as any).value = `${
    (clickedElement as any).value
  }${clipboardText}`;
};
