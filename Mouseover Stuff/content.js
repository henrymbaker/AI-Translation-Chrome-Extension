function wrapTextWithSpan(element) {
  if (element.classList.contains('translate-processed')) {
      return; // Skip already processed elements
  }

  Array.from(element.childNodes).forEach(child => {
      if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
          const words = child.textContent.trim().split(/\s+/);
          words.forEach(word => {
              const span = document.createElement('span');
              span.textContent = word;
              span.className = 'translate-span'; // Add class name here
              element.insertBefore(span, child);
              element.insertBefore(document.createTextNode(' '), span.nextSibling);
          });
          element.removeChild(child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
          // Replace the element with its text content
          const text = document.createTextNode(child.textContent);
          element.replaceChild(text, child);
          wrapTextWithSpan(element); // Re-run the function to handle the new text node
      }
  });

  element.classList.add('translate-processed');
}


// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;

// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function (e) {
  var srcElement = e.target;
  srcElement.onmouseover = e => {
    if (e.target.nodeName == 'P') {
      e.target.innerHTML = e.target.innerText.replace(/([\w]+)/g, '<span>$1</span>');
    }
  };    
  //console.log('Text content:', childNodes[i].textContent.trim());
  
  // Lets check if our underlying element is a DIV.
  if (srcElement.nodeName == 'P') {
    //srcElement.innerHTML = srcElement.innerText.trim().split(/\s+/).map(word => `<span>${word}</span>`).join(' ');
    //srcElement.innerHTML = srcElement.textContent.replace(/([\w]+)/g, '<span class="wordwrap">$1</span>');
  }
  if (srcElement.nodeName == 'SPAN') {
    if (prevDOM != null) {
      prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
    }
    srcElement.classList.add(MOUSE_VISITED_CLASSNAME);
    prevDOM = srcElement;
  }
}, false);