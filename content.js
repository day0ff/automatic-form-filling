document.body.style.border = "5px solid yellow";
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.request == "setLocalStorage") {
      let inputs = Array.from(document.getElementsByTagName('input'));
      console.log("inputs length = " + inputs.length);
      inputs.forEach((element, index) => {
        let input = {
          value: element.value,
          type: element.type
        }
        console.log(index + " " + element.value + " " + element.type);
        localStorage.setItem(index, JSON.stringify(input));
      });
      sendResponse({
        reply: "complite"
      });
    }
    if (request.request == "setInputs") {
      let inputs = Array.from(document.getElementsByTagName('input'));
      console.log("inputs length = " + inputs.length);
      inputs.forEach((element, index) => {
        let input = JSON.parse(localStorage.getItem(index));
        element.value = input.value;
        console.log("set " + index + " " + input.value + " " + input.type);
      });
    }
    sendResponse({
      reply: "complite"
    });
  });
