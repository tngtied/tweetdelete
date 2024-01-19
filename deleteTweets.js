async function deleteTweets() {
  let reloadFlag = false;
  let breakFlag = false;
  function sleep(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.debug({ request, sender });
    if (request === "ping") {
      breakFlag = true;
    }
  });

  while (true) {
    let remainingTweets = document.querySelectorAll('[data-testid="tweet"]');
    console.log("Remaining: ", remainingTweets.length);
    if (remainingTweets.length === 0) {
      console.log("finished tweet delete");
      return;
    }

    for (const entry of remainingTweets.entries()) {
      if (breakFlag) {
        console.log("Stopped tweet delete");
        return;
      }
      tweet = entry[1];
      console.log(tweet);

      // if it is a retweet, undo it
      console.log(
        "unretweet: ",
        tweet.querySelectorAll('[data-testid="unretweet"]')
      );
      if (tweet.querySelectorAll('[data-testid="unretweet"]').length) {
        tweet.querySelectorAll('[data-testid="unretweet"]')[0].click();
        await sleep(1000);
        document
          .querySelectorAll('[data-testid="unretweetConfirm"]')[0]
          .click();
      }
      // is a tweet
      else {
        var authorId = tweet.querySelectorAll('[role="link"]')[0].getAttribute("href").substring(1)
        var hrefArray = location.href.split("/")
        console.log("authorId: ", authorId, "hrefArray: ", hrefArray)
        if (authorId != hrefArray[hrefArray.length - 1] && authorId != hrefArray[hrefArray.length - 2]){
            console.log("not the account owner's tweet...")
            //it's not the user's tweet
            continue;
        }else{
            console.log("deleting the right tweet")
        }
        tweet.querySelectorAll('[data-testid="caret"]')[0].click();
        console.log(
          "role menuitem: ",
          document.querySelectorAll('[role="menuitem"]')
        );
        if (document.querySelectorAll('[role="menuitem"]')[0] == undefined) {
            console.log("undefined...");
            reloadFlag = true;
            continue;          }
        else if (document.querySelectorAll('[role="menuitem"]')[0].querySelector('span').innerText != "Delete"){
          continue;
        // delete버튼이 맞는지 확인하는 부분
        }
        await sleep(500);

        document.querySelectorAll('[role="menuitem"]')[0].click();

        await sleep(500);
        console.log(
          "confirmationSheetConfirm",
          document.querySelectorAll('[data-testid="confirmationSheetConfirm"]')
        );
        if (
          document.querySelectorAll(
            '[data-testid="confirmationSheetConfirm"]'
          )[0] == undefined
        ) {
          console.log("undefined...");
          reloadFlag = true;
          continue;
        }
        document
          .querySelectorAll('[data-testid="confirmationSheetConfirm"]')[0]
          .click();
      }
    }

    window.scrollBy(0, 10000);
    await sleep(4000);
    //less than 4000 might be rate limited or account suspended. increase timeout if any suspend or rate limit happens
  }
}
deleteTweets();
