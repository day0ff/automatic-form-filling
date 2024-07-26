document.getElementById("setLocalStorage").addEventListener("click", function(e) {
  mackeQuery(this, "setLocalStorage");
});

document.getElementById("getLocalStorage").addEventListener("click", function(e) {
  mackeQuery(this, "getLocalStorage");
});

function mackeQuery(element, message) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      request: message
    }, function(response) {
      let text = element.innerHTML;
      setTimeout(() => {
        element.innerHTML = text;
      }, 1500);
      element.innerHTML = "" + response.reply;
    });
  });
}

document.getElementById("menu").addEventListener("click", function(e) {
  let menuContainer = document.getElementById("menu-container");
  if (menuContainer.style.display === "none") {
    menuContainer.style.display = "block";
  } else {
    menuContainer.style.display = "none";
  }
});
document.getElementById("restoreLocalStorage").addEventListener("click", function(e) {
  mackeQuery(this, "restoreLocalStorage");
});
