let deletebutton = document.getElementById("tweetDelete");
let deleteStopbutton = document.getElementById("deleteStop")

deleteStopbutton.addEventListener("click", async()=>{
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, "ping");
});

deletebutton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["deleteTweets.js"],
  });
});

