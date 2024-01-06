let deletebutton = document.getElementById("tweetDelete");
let deleteStopbutton = document.getElementById("deleteStop")

deleteStopbutton.addEventListener("click", async()=>{
  runflag = false;
})

deletebutton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  runflag = true;
  while (true){
    let remainingTweetsLength = document.querySelectorAll('[data-testid="tweet"]').length;
    if (runflag == false || remainingTweetsLength == 0){
      console.log("breaking")
      break;
    }
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: deleteTweets,
    });
  }
});

async function deleteTweets() {
  function sleep(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  let remainingTweets = document.querySelectorAll('[data-testid="tweet"]');
  console.log("Remaining: ", remainingTweets.length);
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
      await sleep(1000);
      console.log("confirmationSheetConfirm", document
      .querySelectorAll('[data-testid="confirmationSheetConfirm"]'));
      if (document.querySelectorAll('[data-testid="confirmationSheetConfirm"]')[0] == undefined){
          console.log("undefined...");
          reloadFlag = true;
          break;
      }
      document
        .querySelectorAll('[data-testid="confirmationSheetConfirm"]')[0]
        .click();
        //여기문제

      // document.querySelectorAll('[aria-label="More"]').forEach(function (v, i, a) {
      //   if (v.getAttribute())
      //   v.click();
      //   document.querySelectorAll('span').forEach(function (v2, i2, a2) {
      //     if (v2.textContent === 'Delete') {
      //       console.log("v2: ", v2)
      //       print("")
      //       v2.click();
      //       document.querySelectorAll('[data-testid="confirmationSheetConfirm"]').forEach(function (v3, i3, a3) {
      //           v3.click();
      //           print("deleted")
      //       });
      //     }
      //     else {
      //       // console.log("passed")
      //       document.body.click();
      //     }
      //   });
      // });

    }
  }
  if (reloadFlag){
    window.location.reload();
    reloadFlag = false;
  }else{
    window.scrollBy(0, 10000);
  }
  await sleep(4000)
  // chrome.tabs.reload();
  
  //less than 4000 might be rate limited or account suspended. increase timeout if any suspend or rate limit happens

}
