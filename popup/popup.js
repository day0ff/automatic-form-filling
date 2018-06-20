document.getElementById("setLocalStorage").addEventListener("click", function(e) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      request: "setLocalStorage"
    }, function(response) {
      console.log(response.reply);
      document.getElementById("setLocalStorage").innerHTML = "" + response.reply;
      setTimeout(() =>  { document.getElementById("setLocalStorage").innerHTML = "Save inputs value!"; }, 2000);
    });
  });
});
document.getElementById("setInputs").addEventListener("click", function(e) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      request: "setInputs"
    }, function(response) {
      document.getElementById("setInputs").innerHTML = "" + response.reply;
      setTimeout(() =>  { document.getElementById("setInputs").innerHTML = "Save inputs value!"; }, 2000);
    });
  });
});
