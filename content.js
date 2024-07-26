const BUCKET = 'bucket';

document.body.style.border = "5px solid yellow";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.request === "setLocalStorage") {
      saveForms();
      sendResponse({
        reply: "Complete"
      });
    }
    if (request.request === "getLocalStorage") {
      console.log(fillForms());
      sendResponse({
        reply: "Complete"
      });
    }
    if (request.request === "restoreLocalStorage") {
      let data = sessionStorage.getItem(BUCKET);
      if (data) {
        localStorage.setItem(BUCKET, data);
        console.log(fillForms());
        sendResponse({
          reply: "Complete"
        });
      } else {
        console.log("data not set.");
      }
    }
  });

function inputsFilter(element) {
  return element.type !== "submit" && element.type !== "reset" && element.type !== "file";
}

function saveForms() {
  let data = {};
  let inputs = Array.from(document.getElementsByTagName('input')).filter(inputsFilter);
  console.log("inputs length = " + inputs.length);
  inputs.forEach((element, index) => {
    let input = {
      value: element.value,
      type: element.type
    }
    if (element.type === "radio" || element.type === "checkbox") {
      input.value = element.checked;
    }
    inputs[index] = input;
    console.log(index + " " + inputs[index].value + " / " + inputs[index].type);
  });
  data.inputs = inputs;
  let textareas = Array.from(document.getElementsByTagName('textarea'));
  textareas.forEach((element, index) => {
    textareas[index] = {
      value: element.value
    };
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
  sessionStorage.setItem(BUCKET, localStorage.getItem(BUCKET));
  localStorage.setItem(BUCKET, JSON.stringify(data));
}

function fillForms() {
  let url = JSON.parse(localStorage.getItem(BUCKET));
  if (!url) {return "storage is empty";}
    let inputs = Array.from(document.getElementsByTagName('input')).filter(inputsFilter);
    console.log("inputs length = " + inputs.length);
    inputs.forEach((element, index) => {
      let input = url.inputs[index];
      if (element.type === "radio" || element.type === "checkbox") {
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
    return "Complete";
}
