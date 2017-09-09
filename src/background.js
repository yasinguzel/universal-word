var toggle = false;

chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !toggle;
  if(toggle){
    chrome.browserAction.setIcon({path: { "19": "/icons/icon19.png",
    "38": "/icons/icon38.png" },
    tabId:tab.id});
  }
  else{
    chrome.browserAction.setIcon({path: "icons/icon38-disabled.png", 
    tabId:tab.id});
  }
});