var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
var PREV_ELEMENT = null;
var mouseDown = false;

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
    //print elements if it is a <span> element and it is in the classList
    // Iterate through the <span> elements and print their content
    spanElements.forEach(function (span) {
        console.log(span.textContent);
        span.classList.add(MOUSE_VISITED_CLASSNAME);
    });
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