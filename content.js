document.body.style.border = "5px solid yellow";
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var data = new Object();
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    console.log(getUrl());
    if (request.request == "setLocalStorage") {
      let inputs = Array.from(document.getElementsByTagName('input')).filter(inputsFilter);
      console.log("inputs length = " + inputs.length);
      inputs.forEach((element, index) => {
        /*
        let attributes = new Array(element.attributes.length);
        Array.from(element.attributes).forEach((attribute, index) => {
          console.log(index + " " + attribute.name + " " + attribute.value);
        });
        */
        let input = {
          value: element.value,
          type: element.type
        }
        if (element.type == "radio" || element.type == "checkbox") {
          input.value = element.checked;
        }
        inputs[index] = input;
        console.log(index + " " + inputs[index].value + " / " + inputs[index].type);
      });
      data.inputs = inputs;
      let textareas = Array.from(document.getElementsByTagName('textarea'));
      textareas.forEach((element, index) => {
        let textarea = {
          value: element.value
        }
        textareas[index] = textarea;
        console.log(index + " " + textareas[index].value + " / textarea");
      });
      data.textareas = textareas;
      /**
       *
       */
      let selects = Array.from(document.getElementsByTagName('select'));
      selects.forEach((element, index) => {
        selects[index] = Array.from(element.options)
          .filter(option => option.selected)
          .map(option => option.index);
        console.log(index + " " + selects[index].toString());
      });
      data.selects = selects;
      localStorage.setItem(getUrl(), JSON.stringify(data));
      sendResponse({
        reply: "complite"
      });
    }
    if (request.request == "getLocalStorage") {
      let url = JSON.parse(localStorage.getItem(getUrl()));
      let inputs = Array.from(document.getElementsByTagName('input')).filter(inputsFilter);
      console.log("inputs length = " + inputs.length);
      inputs.forEach((element, index) => {
        let input = url.inputs[index];
        if (element.type == "radio" || element.type == "checkbox") {
          element.checked = input.value;
        } else {
          element.value = input.value;
        }
        console.log("set " + index + " " + input.value + " " + input.type + " / input");
      });
      let textareas = Array.from(document.getElementsByTagName('textarea'));
      textareas.forEach((element, index) => {
        element.value = url.textareas[index].value;
        console.log("set " + index + " " + element.value + " / textarea");
      });
      let selects = Array.from(document.getElementsByTagName('select'));
      selects.forEach((element, index) => {
        Array.from(element.options)
          .filter(option => url.selects[index].includes(option.index))
          .forEach(option => {
            option.selected = true;
            console.log("set " + index + " " + option.index + " " + option.text + " / option");
          });
      });
      sendResponse({
        reply: "complite"
      });
    }
  });

function getUrl() {
  return window.location.href;
}

function inputsFilter(element) {
  if (element.type != "submit" && element.type != "reset" && element.type != "file") return true;
  return false;
}
