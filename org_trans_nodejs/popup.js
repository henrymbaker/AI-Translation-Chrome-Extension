document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('openTranslatorBtn').addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "openTranslator" }, function(response) {
            });
        });
        window.close();
    });
});

