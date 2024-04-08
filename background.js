chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.openPanel({
    url: 'index.html'
  });
});
