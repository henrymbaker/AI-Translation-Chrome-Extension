var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
const STORAGE_STRING_KEY_NAME = "mystringKey";
var SELECTED_STRING = "";
var PREV_ELEMENT = null;
var mouseDown = false;
var windowActive = false;
// The HTML content you want to inject

const container = document.createElement('div');


function createNuanceWindow() {
    if (windowActive) {
        updateTextBox();
        return;
    }
    fetch(chrome.runtime.getURL('index.html'))
  .then(response => response.text())
  .then(htmlContent => {
    container.id = 'my-extension-container';
    // Set the fetched HTML content to the container
    container.innerHTML = htmlContent;

    // Append the container to the body
    document.body.appendChild(container);

    // Add styles to position the container in the upper right corner
    
    container.style.backgroundColor = 'white';
    container.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.width = '300px';
    container.style.height = 'auto';
    container.style.overflow = 'auto';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.right = '0';
    container.style.zIndex = '1000';
    // Add any other styles as needed
    // Dynamically create a script element
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('popup.js'); // Get the correct URL for the extension file
    script.onload = function () {
        this.remove(); // Optional: Removes the script element once loaded
    };

    // Append the script to the body of the container or any specific part you want
    container.appendChild(script);
    // Create a close button
    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.cursor = 'pointer';

    // Append the close button to your container
    container.appendChild(closeButton);

    // Event listener for the close button
    closeButton.addEventListener('click', closeNuanceWindow);
  })
  .then(() => {
    updateTextBox();
  })
  .catch(error => {
    console.error('Error fetching index.html:', error);
  });
    
    windowActive = true;
}

function closeNuanceWindow() {
    if (windowActive) {
        container.remove(); // This will remove the container from the page
        windowActive = false;
    }
}

function updateTextBox() {
    var inputTextHolder = document.getElementById('input-textholder');
    if (inputTextHolder != null) {
        inputTextHolder.value = SELECTED_STRING;
    }
}



createNuanceWindow();
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



// Unique ID for the className.

function clearClass() {
    // Select all elements with MOUSE_VISITED_CLASSNAME
    var elementsToRemove = document.querySelectorAll('.' + MOUSE_VISITED_CLASSNAME);

    // Loop through the NodeList and remove the class from each element
    elementsToRemove.forEach(function (removedElement) {
        removedElement.classList.remove(MOUSE_VISITED_CLASSNAME);
    });
}

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
    SELECTED_STRING = concatenatedText.trim();
    createNuanceWindow();
    updateTextBox();
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