chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Protected Paste",
    contexts: ["editable"],
    id: "protected-paste",
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId == "protected-paste") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, {
        action: "protected-paste",
      });
    });
  }
});
