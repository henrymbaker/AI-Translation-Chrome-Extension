
// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

// Previous dom, that we want to track, so we can remove the previous styling.
var mouseDown = false;

document.addEventListener('mousedown', () => {
  mouseDown = true;
  console.log("mousedown is now true")
});

document.addEventListener('mouseup', () => {
// Get the selected text range or create a range manually
var selection = window.getSelection();
var range = selection.getRangeAt(0);

// Create a TreeWalker to traverse only <span> elements within the range
var treeWalker = document.createTreeWalker(
  range.commonAncestorContainer,
  NodeFilter.SHOW_ELEMENT, // Show only elements
  function(node) {
    return node.tagName.toLowerCase() === 'span' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  },
  false
);

// Iterate through the <span> elements within the range and print their content
while (treeWalker.nextNode()) {
  var span = treeWalker.currentNode;
  if (range.intersectsNode(span)) {
    console.log(span.textContent);
  }
}
});

document.addEventListener('click', () => {
  mouseDown = false;
  console.log("mousedown is now false")
});

// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function (e) {
  if (mouseDown) {
    return;
  }
  var srcElement = e.target;
  srcElement.onmouseover = e => {
    if (e.target.nodeName == 'P') {
      e.target.innerHTML = e.target.innerText.replace(/([\w]+)/g, '<span>$1</span>');
    }
  };    
  //console.log('Text content:', childNodes[i].textContent.trim());
  
  // Lets check if our underlying element is a DIV.
  if (srcElement.nodeName == 'SPAN' && !mouseDown) {
    srcElement.classList.add(MOUSE_VISITED_CLASSNAME);
  } else {
    var elementsToRemove = document.querySelectorAll(MOUSE_VISITED_CLASSNAME);
   // Iterate through the selected elements and remove them
    elementsToRemove.forEach(function(element) {
      element.parentNode.removeChild(element);
    });
  }
}, false);