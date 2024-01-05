chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    document.getElementById('wordDetail').innerText = message.word;
  });
  