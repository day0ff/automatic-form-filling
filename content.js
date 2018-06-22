document.body.style.border = "5px solid yellow";
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(getUrl());
    if (request.request == "setLocalStorage") {
      saveForms();
      sendResponse({
        reply: "Complite"
      });
    }
    if (request.request == "getLocalStorage") {
      console.log(fillForms());
      sendResponse({
        reply: "Complite"
      });
    }
    if (request.request == "restoreLocalStorage") {
      let data = sessionStorage.getItem(getUrl());
      if (data) {
        localStorage.setItem(getUrl(), data);
        console.log(fillForms());
        sendResponse({
          reply: "Complite"
        });
      } else {
        console.log("data not set.");
      }
    }
  });

function getUrl() {
  return window.location.href;
}

function inputsFilter(element) {
  if (element.type != "submit" && element.type != "reset" && element.type != "file") return true;
  return false;
}

function saveForms() {
  let data = new Object();
  let inputs = Array.from(document.getElementsByTagName('input')).filter(inputsFilter);
  console.log("inputs length = " + inputs.length);
  inputs.forEach((element, index) => {
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
  let selects = Array.from(document.getElementsByTagName('select'));
  selects.forEach((element, index) => {
    selects[index] = Array.from(element.options)
      .filter(option => option.selected)
      .map(option => option.index);
    console.log(index + " " + selects[index].toString());
  });
  data.selects = selects;
  sessionStorage.setItem(getUrl(), localStorage.getItem(getUrl()));
  localStorage.setItem(getUrl(), JSON.stringify(data));
}

function fillForms() {
  let data = new Object();
  let url = JSON.parse(localStorage.getItem(getUrl()));
  if (!url) {return "storage is empty";}
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
    return "complite";
}
