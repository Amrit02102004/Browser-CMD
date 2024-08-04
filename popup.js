document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('openFullHelp').addEventListener('click', function() {
        chrome.tabs.create({url: 'help.html'});
    });
});