let deletebutton = document.getElementById("tweetDelete");
let deleteStopbutton = document.getElementById("deleteStop")
var runflag = false;



deleteStopbutton.addEventListener("click", async()=>{
  this.runflag = false;
})

deletebutton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  this.runflag = true;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: deleteTweets,
  });
});

async function deleteTweets() {
  let reloadFlag = false;
  function sleep(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }
  while (true) {
    let remainingTweets = document.querySelectorAll('[data-testid="tweet"]');
    console.log("Remaining: ", remainingTweets.length);
    if (remainingTweets.length === 0 || this.runflag == false){
      console.log("Stopped tweet delete")
      break;
    }

    for (const entry of remainingTweets.entries()){
      tweet = entry[1];
      console.log(tweet);

      // if it is a retweet, undo it
      console.log("unretweet: ", tweet.querySelectorAll('[data-testid="unretweet"]'));
      if (tweet.querySelectorAll('[data-testid="unretweet"]').length) {
        tweet.querySelectorAll('[data-testid="unretweet"]')[0].click();
        await sleep(1000);
        // tweet.querySelectorAll('span').find(el => el.textContent === '[data-testid="unretweet"]').click();
        document
          .querySelectorAll('[data-testid="unretweetConfirm"]')[0]
          .click();
      }
      // is a tweet
      else {
        tweet.querySelectorAll('[data-testid="caret"]')[0].click();
        console.log("role menuitem: ", document.querySelectorAll('[role="menuitem"]'))
        console.log("role menuitem[0]: ", document.querySelectorAll('[role="menuitem"]')[0])
        await sleep(1000);

        document.querySelectorAll('[role="menuitem"]')[0].click();
        await sleep(2000);
        console.log("confirmationSheetConfirm", document
        .querySelectorAll('[data-testid="confirmationSheetConfirm"]'));
        if (document.querySelectorAll('[data-testid="confirmationSheetConfirm"]')[0] == undefined){
            console.log("undefined...");
            reloadFlag = true;
            break;
            //this.runflag = false;
        }
        document
          .querySelectorAll('[data-testid="confirmationSheetConfirm"]')[0]
          .click();
      }
    }
    if (reloadFlag){
      window.location.reload();
      reloadFlag = false;
    }else{
      window.scrollBy(0, 10000);
    }
    // 
    
    await sleep(4000)
    //less than 4000 might be rate limited or account suspended. increase timeout if any suspend or rate limit happens
  }
}
