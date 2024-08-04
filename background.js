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
      case 'cookies':
        chrome.tabs.create({ url: 'chrome://settings/cookies' });
        break;
      case 'clccookies':
        chrome.browsingData.removeCookies({}, () => {
          chrome.tabs.create({ url: 'chrome://newtab' });
        });
        break;
      case 'git':
        const gitUrl = `https://github.com/search?q=${encodeURIComponent(query)}`;
        chrome.tabs.create({ url: gitUrl });
        break;
      case 'downloads':
        chrome.tabs.create({ url: 'chrome://downloads' });
        break;
      case 'extensions':
        chrome.tabs.create({ url: 'chrome://extensions' });
        break;
      case 'bookmarks':
        chrome.tabs.create({ url: 'chrome://bookmarks' });
        break;
      case 'yt':
        const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        chrome.tabs.create({ url: ytUrl });
        break;
      case 'inst':
        const instUrl = `https://www.instagram.com/explore/tags/${encodeURIComponent(query)}`;
        chrome.tabs.create({ url: instUrl });
        break;
      case 'help':
        chrome.tabs.create({ url: chrome.runtime.getURL('help.html') });
        break;
      default:
        chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(input)}` });
    }
  }
  
  
  chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    let suggestions = [
      { content: 'git ', description: 'Search GitHub' },
      { content: 'history', description: 'Open browser history' },
      { content: 'settings', description: 'Open browser settings' },
      { content: 'clchistory', description: 'Clear browsing history' },
      { content: 'cookies', description: 'Open cookie settings' },
      { content: 'clccookies', description: 'Clear all cookies' },
      { content: 'downloads', description: 'Open downloads page' },
      
      { content: 'extensions', description: 'Open extensions page' },
      { content: 'bookmarks', description: 'Open bookmarks page' },
      { content: 'yt ', description: 'Search YouTube' },
      { content: 'inst ', description: 'Search Instagram' },
      { content: 'help', description: 'Open help page' }
    ];
    suggest(suggestions.filter(s => s.content.startsWith(text)));
  });