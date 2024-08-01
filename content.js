console.log('Content script loaded');

let commandMode = false;
let commandInput = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  if (request.action === "activateCommandMode") {
    activateCommandMode();
  }
});

function activateCommandMode() {
  console.log('Activating command mode');
  if (commandMode) return;
  
  commandMode = true;
  
  commandInput = document.createElement('input');
  commandInput.type = 'text';
  commandInput.style.position = 'fixed';
  commandInput.style.top = '10px';
  commandInput.style.left = '10px';
  commandInput.style.zIndex = '9999';
  commandInput.style.width = '300px';
  commandInput.style.padding = '5px';
  commandInput.placeholder = 'Enter command...';
  
  document.body.appendChild(commandInput);
  commandInput.focus();

  commandInput.addEventListener('keydown', handleCommandInput);
}

function handleCommandInput(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const command = commandInput.value.trim();
    if (command) {
      console.log('Sending command:', command);
      chrome.runtime.sendMessage({command: command});
    }
    deactivateCommandMode();
  } else if (e.key === 'Escape') {
    deactivateCommandMode();
  }
}

function deactivateCommandMode() {
  console.log('Deactivating command mode');
  if (!commandMode) return;
  
  commandMode = false;
  if (commandInput && commandInput.parentNode) {
    commandInput.parentNode.removeChild(commandInput);
  }
  commandInput = null;
}