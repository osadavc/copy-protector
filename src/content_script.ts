import axios from "axios";
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

const protectedPaste = async () => {
  const clipboardText = getClipboard();

  await chrome.storage.sync.get(
    {
      apiKey: "default",
      pangeaDomain: "default",
    },
    async (items) => {
      if (items.apiKey == "default") {
        return chrome.runtime.openOptionsPage();
      }

      const { data } = await axios.post(
        `https://redact.${items.pangeaDomain}/v1/redact`,
        {
          text: clipboardText,
        },
        {
          headers: {
            Authorization: `Bearer ${items.apiKey}`,
          },
        }
      );

      (clickedElement as any).value = `${(clickedElement as any).value}${
        data.result.redacted_text
      }`;
    }
  );
};
