// popup.js
document.addEventListener('DOMContentLoaded', () => {
  // Helper to send message and handle missing content script
  function sendMessageToContent(tabId, message, onSuccess) {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        alert("Could not communicate with TradingView. Please make sure you're on a TradingView chart page and reload it before using the extension.");
        console.warn("Extension error:", chrome.runtime.lastError.message);
      } else if (onSuccess) {
        onSuccess(response);
      }
    });
  }

  // Create Watchlist button and close the popup.html once done
  const createBtn = document.getElementById('createWatchlistButton');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.url && activeTab.url.includes("in.tradingview.com/chart/")) {
          window.close();
          sendMessageToContent(activeTab.id, { action: 'createWatchlist' }, (res) => {
            if (res && res.success) {
              console.log("Watchlist creation triggered.");
            }
          });
        } else {
          alert("Please navigate to a TradingView chart page before using this extension.");
        }
      });
    });
  }

  // Add handler for Add Stocks button
  const addStocksBtnAU100 = document.getElementById('addStocksButtonAU100');
  const addStocksBtnAU50 = document.getElementById('addStocksButtonAU50');
  const addStocksBtnAU20 = document.getElementById('addStocksButtonAU20');
  const addStocksBtnIN100 = document.getElementById('addStocksButtonIN100');
  const addStocksBtnIN50 = document.getElementById('addStocksButtonIN50');
  const addStocksBtnIN20 = document.getElementById('addStocksButtonIN20');
  
  if (addStocksBtnAU100) {
    addStocksBtnAU100.addEventListener('click', () => {
      addStocksAction(addStocksBtnAU100);
    });
  }

  if (addStocksBtnAU50) {
    addStocksBtnAU50.addEventListener('click', () => {
      addStocksAction(addStocksBtnAU50);
    });
  }

  if (addStocksBtnAU20) {
    addStocksBtnAU20.addEventListener('click', () => {
      addStocksAction(addStocksBtnAU20);
    });
  }

  if (addStocksBtnIN100) {
    addStocksBtnIN100.addEventListener('click', () => {
      addStocksAction(addStocksBtnIN100);
    });
  }

  if (addStocksBtnIN50) {
    addStocksBtnIN50.addEventListener('click', () => {
      addStocksAction(addStocksBtnIN50);
    });
  }

  if (addStocksBtnIN20) {
    addStocksBtnIN20.addEventListener('click', () => {
      addStocksAction(addStocksBtnIN20);
    });
  }

  function addStocksAction(addStocksBtn) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url && activeTab.url.includes("in.tradingview.com/chart/")) {
        const screener = addStocksBtn.textContent.trim();
        window.close();
        sendMessageToContent(activeTab.id, { action: 'addStocks' , screener: screener}, (res) => {
          if (res && res.success) {
            console.log("Stocks added to watchlist.");
          }
        });
      } else {
        alert("Please navigate to a TradingView chart page before using this extension.");
      }
    });    
  }

});