chrome.commands.onCommand.addListener((command) => {
    console.log('Command received:', command);
    if (command === "activate-command-mode") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          console.log('Sending activate message to tab:', tabs[0].id);
          chrome.tabs.sendMessage(tabs[0].id, {action: "activateCommandMode"});
        }
      });
    }
  });
  
  chrome.omnibox.onInputEntered.addListener((text) => {
    console.log('Omnibox command received:', text);
    handleCommand(text);
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    if (request.command) {
      handleCommand(request.command);
    }
  });
  
  function handleCommand(input) {
    console.log('Handling command:', input);
    const [command, ...args] = input.split(' ');
    const query = args.join(' ');
  
    switch (command) {
      case 'history':
        chrome.tabs.create({ url: 'chrome://history' });
        break;
      case 'settings':
        chrome.tabs.create({ url: 'chrome://settings' });
        break;
      case 'clchistory':
        chrome.browsingData.removeHistory({}, () => {
          chrome.tabs.create({ url: 'chrome://newtab' });
        });
        break;
      case 'yt':
        const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        chrome.tabs.create({ url: ytUrl });
        break;
      case 'inst':
        const instUrl = `https://www.instagram.com/explore/tags/${encodeURIComponent(query)}`;
        chrome.tabs.create({ url: instUrl });
        break;
      default:
        chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(input)}` });
    }
  }
  
  chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    let suggestions = [
      { content: 'history', description: 'Open browser history' },
      { content: 'settings', description: 'Open browser settings' },
      { content: 'clchistory', description: 'Clear browsing history' },
      { content: 'yt ', description: 'Search YouTube' },
      { content: 'inst ', description: 'Search Instagram' }
    ];
    suggest(suggestions.filter(s => s.content.startsWith(text)));
  });