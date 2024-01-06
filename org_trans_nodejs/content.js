var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
var PREV_ELEMENT = null;
var mouseDown = false;






// The HTML content you want to inject
const htmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Organic Translateeer</title>
  <link rel="stylesheet" href="./style.css">

</head>

<body>
  <div id="translator-container">
    <h2 id="title">Organic Translator</h2>
    <div id="input">
      <h1 id="label">Input - Detected Language</h1>
      <textarea class="text-box" id="input-textholder" placeholder="Enter text"></textarea>
    </div>
    <button id="translate-button">Translate</button>
    <div id="output">
      <h1 id="label">Output - English</h1>
      <p  class="text-box" id="output-textholder">Translation will appear here...</p>
      <div class="collapsible">
        <button class="collapsible-button">> grammar</button>
        <div class="collapsible-content">
          <p id="grammar-content">Grammar info will appear here...</p>
        </div>
      </div>
      <div class="collapsible">
        <button class="collapsible-button">> nuance</button>
        <div class="collapsible-content">
          <p id="nuance-content">Nuance info will appear here...</p>
        </div>
      </div>

    </div>
    <script src="popup.js"></script>
</body>

</html>`;

// Create a container div to hold your HTML
const container = document.createElement('div');
container.id = 'my-extension-container';
container.innerHTML = htmlContent;

// Append the container to the body
document.body.appendChild(container);

// Add styles to position the container in the upper right corner
container.style.backgroundColor = 'white'; // Change 'white' to your desired color
container.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)'; // Optional: Adds a shadow for better visibility
container.style.padding = '10px'; // Optional: Adds some space inside the container
container.style.borderRadius = '5px'; // Optional: Rounds the corners
container.style.width = '300px'; // Set a fixed width
container.style.height = 'auto'; // Adjust height automatically
container.style.overflow = 'auto'; // Add scroll if content overflows
container.style.position = 'fixed';
container.style.top = '0';
container.style.right = '0';
container.style.zIndex = '1000'; // Ensure it's on top of other elements
// Add any other styles as needed
// Dynamically create a script element
const script = document.createElement('script');
script.src = chrome.runtime.getURL('popup.js'); // Get the correct URL for the extension file
script.onload = function() {
    this.remove(); // Optional: Removes the script element once loaded
};

// Append the script to the body of the container or any specific part you want
container.appendChild(script);





window.onload = function () {
    // Select all <p> elements
    var pElements = document.getElementsByTagName('p');

    for (var i = 0; i < pElements.length; i++) {
        var pElement = pElements[i];
        var words = pElement.innerText.split(' ');
        var spanWrappedWords = words.map(word => '<span>' + word + '</span>');
        pElement.innerHTML = spanWrappedWords.join(' ');
    }
};

function classListToString() {
  // Select all <span> elements with a specific class
let spans = document.querySelectorAll('.' + MOUSE_VISITED_CLASSNAME);

// Initialize an empty string to hold the concatenated text
let concatenatedText = '';

// Iterate over each <span> element and concatenate their text content
spans.forEach(span => {
    concatenatedText += span.textContent + " "; // Add a space between each text
    console.log(span.textContent);
});

// 'concatenatedText' now contains the combined text of all <span> elements
console.log(concatenatedText.trim()); // trim() is used to remove the trailing space

}


// Unique ID for the className.

function clearClass() {
    // Select all elements with MOUSE_VISITED_CLASSNAME
    var elementsToRemove = document.querySelectorAll('.' + MOUSE_VISITED_CLASSNAME);

    // Loop through the NodeList and remove the class from each element
    elementsToRemove.forEach(function (removedElement) {
        removedElement.classList.remove(MOUSE_VISITED_CLASSNAME);
    });
}


chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let key in changes) {
        let storageChange = changes[key];

        // Check if the changed key is the one you're interested in
        if(key === "myStringKey") {
            console.log('Storage key "%s" in namespace "%s" changed.', key, namespace);
            console.log('Old value was "%s", new value is "%s".', storageChange.oldValue, storageChange.newValue);
            document.getElementById('input-textholder').value = storageChange.newValue;
            // Do something with storageChange.newValue
        }
    }
});
// Previous dom, that we want to track, so we can remove the previous styling.
//var mouseDown = false;


document.addEventListener('mouseup', function (e) {
    console.log("mouseup");
    mouseDown = false;
    clearClass();
    // Get the selected text range or create a range manually
    //if they click on something other than a word, just return after unselecting everything
    if (e.target.nodeName != 'SPAN') {
        return;
    }
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    range.setStartBefore(range.startContainer);
    range.setEndAfter(range.endContainer);
    // Create a DocumentFragment to hold the contents of the range
    var fragment = range.cloneContents();

    // Create a temporary div to append the fragment and traverse its contents
    var tempDiv = document.createElement("div");
    tempDiv.appendChild(fragment);

  // Find all the <span> elements within the temporary div
  var spanElements = tempDiv.querySelectorAll("span");
  let concatenatedText = '';
  //print elements if it is a <span> element and it is in the classList
  // Iterate through the <span> elements and print their content
    spanElements.forEach(function (span) {
      span.classList.add(MOUSE_VISITED_CLASSNAME);
      concatenatedText += span.textContent + " ";
    });
  console.log(concatenatedText.trim());
  chrome.storage.local.set({ "myStringKey": concatenatedText }, function() {
    console.log("String saved to Chrome storage.");
  });
  mouseDown = false;
});

document.addEventListener('mousedown', function (event) {
    console.log("mousedown");
    // Prevent the default behavior of the mousedown event
    event.stopImmediatePropagation();
    mouseDown = true;
});

// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function (e) {
    console.log("mousemove");
    if (mouseDown) {
        return;
    }
    var srcElement = e.target;

    // Lets check if our underlying element is a DIV.
    if (srcElement.nodeName == 'SPAN' /*&& !mouseDown*/) {
        if (PREV_ELEMENT != null) {
            clearClass();
        }
        srcElement.classList.add(MOUSE_VISITED_CLASSNAME);
        PREV_ELEMENT = srcElement;
    }
}, false);