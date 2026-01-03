// content.js

// Click the 'Watchlists' button, then the 'Create new list' menu item
async function automateWatchlistCreation() {

  // Step 1: Click 'Create new list' menu item
  await clickWatchlistsButton();
  await wait();
  await clickMenuItem('Create new list');
  await wait(1000);

  // Step 2: Fill in the date and save
  await fillAndSaveWatchlistName();
  await wait();

  //Step 3: Add sections and rename
  const numberOfSections = 6;
  const sectionNames = [
    "🇮🇳 NIFTY 100EMA",
    "🇮🇳 NIFTY 50EMA",
    "🇮🇳 NIFTY 20EMA",
    "🇦🇺 ASX 100EMA",
    "🇦🇺 ASX 50EMA",
    "🇦🇺 ASX 20EMA"
  ];
  for (let i = 0; i < numberOfSections; i++) {
    await clickWatchlistsButton();
    await wait();
    await clickMenuItem('Add section');
    // await wait();
  }

  for (let i = 0; i < numberOfSections; i++) {
    await renameSection(sectionNames[i],"SECTION " + (i + 1));
    await wait();
  }
  
  console.log('Completed!');
}

// Helper for 1s wait
const wait = (ms = 500) => new Promise(res => setTimeout(res, ms));

// Helper for right click
function rightClick(el) {
  el.dispatchEvent(new MouseEvent('contextmenu', {
    button: 2
  }));
}


// Fills the watchlist name input with the formatted date and clicks Save
async function fillAndSaveWatchlistName() {
  const nameInput = document.querySelector('input[data-qa-id="ui-lib-Input-input"]');
  if (!nameInput) {
    console.error('Could not find the name input with data-qa-id="ui-lib-Input-input".');
    return;
  }
  nameInput.focus();
  const now = new Date();
  let useDate = new Date(now);
  const hour = now.getHours();
  if (hour >= 0 && hour < 11) {
    useDate.setDate(useDate.getDate() - 1);
  }
  const year = useDate.getFullYear();
  const mm = String(useDate.getMonth() + 1).padStart(2, '0');
  const DD = String(useDate.getDate()).padStart(2, '0');
  const dateText = `${year}-${mm}-${DD}`;
  nameInput.value = `🗓️ ${dateText}`;
  nameInput.dispatchEvent(new Event('input', { bubbles: true }));
  console.log('Typed date:', dateText);

  const saveBtn = document.querySelector('button[name="save"]');
  if (!saveBtn) {
    console.error("Could not find 'Save' button after typing the date.");
    return;
  }
  saveBtn.click();
}


// Click watchlists button
async function clickWatchlistsButton() {
  const watchlistsBtn = document.querySelector('button[data-name="watchlists-button"]');
  if (!watchlistsBtn) {
    console.error("Could not find 'Watchlists' button.");
    return;
  }
  watchlistsBtn.click();
}

// Generic utility function to click a menu item by label
async function clickMenuItem(label) {
  const menuItems = document.querySelectorAll('div[data-role="menuitem"] span');
  let found = false;
  for (const item of menuItems) {
    if (item.textContent.trim().startsWith(label)) {
      item.closest('div[data-role="menuitem"]').click();
      found = true;
      console.log('Clicked menu item: ' + item.textContent);
      break;
    }
  }
  if (!found) {
    console.error(`Could not find menu item: ${label}`);
    throw new Error(`Menu item not found: ${label}`);
  }
}


// Utility function to find the innermost text element for a given section name
function findSectionTextElement(sectionName = "SECTION") {
  const symbolListWrap = document.querySelector('[data-name="symbol-list-wrap"]');
  if (!symbolListWrap) {
    console.error('Could not find symbol list wrap');
    return null;
  }
  const sectionSpan = Array.from(symbolListWrap.querySelectorAll('span'))
    .find(span => span.className.startsWith('label-') && span.textContent.trim().startsWith(sectionName));
  if (!sectionSpan) {
    console.error(`Could not find section span for '${sectionName}'`);
    return null;
  }
  let textElement = sectionSpan;
  for (const child of sectionSpan.childNodes) {
    if (
      child.nodeType === Node.ELEMENT_NODE &&
      child.textContent.trim().startsWith(sectionName)
    ) {
      textElement = child;
      break;
    }
  }
  return textElement;
}

// Utility function to rename the first SECTION element found
async function renameSection(newName,sectionName = "SECTION") {
  const textElement = findSectionTextElement(sectionName);
  if (!textElement) {
    console.error(`Could not find section text element for '${sectionName}'`);
    return;
  }
  textElement.click();
  textElement.click();
  await wait();

  // find section name input with id ui-lib-Input-input and value sectionName
  const sectionNameInput = document.querySelector('input[data-qa-id="ui-lib-Input-input"][value="' + sectionName + '"]');
  if (!sectionNameInput) {
    console.error('Could not find the name input with data-qa-id="ui-lib-Input-input".');
    return;
  }
  sectionNameInput.focus();
  sectionNameInput.value = newName;
  // get cursor on the input field
  sectionNameInput.dispatchEvent(new Event('input', { bubbles: true }));

  // const updatedSectionNameInput = document.querySelector('input[data-qa-id="ui-lib-Input-input"][value="' + newName + '"]');
  // if (!updatedSectionNameInput) {
  //   console.error('Could not find the name input with data-qa-id="ui-lib-Input-input".');
  //   return;
  // }
  // updatedSectionNameInput.focus();
  // updatedSectionNameInput.click();
  // updatedSectionNameInput.click();

  // // sectionNameInput.dispatchEvent(new Event('input', { bubbles: true }));
  // // sectionNameInput.dispatchEvent(new Event('change', { bubbles: true }));
  // // sectionNameInput.dispatchEvent(new Event('onupdate', { bubbles: true }));
  console.log('Renamed section:', newName);
  // Press Enter to confirm
  // sectionNameInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
  // sectionNameInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true }));

}

async function openScreener() {
  const screenersBtn = document.querySelector('button[aria-label="Screeners"]');
  if (!screenersBtn) {
    console.error("Could not find 'Screeners' button.");
    return;
  }
  screenersBtn.click();
  await wait(2000);

  const splitViewBtn = document.querySelector('button[data-qa-id="split-view-button"]');
  if (!splitViewBtn) {
    console.error("Could not find 'Split View' button.");
    return;
  }
  splitViewBtn.click();
  await wait(2000);
}

async function addStocks(screener) {
  console.log('Selected screener:', screener);

  let screenerTitleBtn = document.querySelector('div[role="button"][data-name="screener-topbar-screen-title"]');
  if (!screenerTitleBtn) {
    // retry after opening screener
    await openScreener(); 
    await wait(1000);
    screenerTitleBtn = document.querySelector('div[role="button"][data-name="screener-topbar-screen-title"]');
    if (!screenerTitleBtn) {
      console.error("Could not find 'Screener Title' button.");
      return;
    }
  }
  screenerTitleBtn.click();
  await wait();

  const screenerScreenActionsLoadScreen = document.querySelector('div[data-qa-id="screener-screen-actions-load-screen"]');
  if (!screenerScreenActionsLoadScreen) {
    console.error("Could not find 'Screener Screen Actions Load Screen' button.");
    return;
  }
  screenerScreenActionsLoadScreen.click();
  await wait(1000);

  let dataTitle = screener;
  const screenerScreenActionsLoadScreenListItem = document.querySelector('div[data-role="list-item"][data-title="' + dataTitle + '"]');
  if (!screenerScreenActionsLoadScreenListItem) {
    console.error("Could not find 'Screener Screen Actions Load Screen List Item' button.");
    return;
  }
  screenerScreenActionsLoadScreenListItem.click();
  await wait(2000);

  // const tbody = document.querySelector('tbody[tabindex="100"]');
  // if (!tbody) {
  //   console.error("Could not find 'tbody' element.");
  //   return;
  // }
  // const tr = tbody.querySelector('tr');
  // if (!tr) {
  //   console.error("Could not find 'tr' element.");
  //   return;
  // }
  // tr.click();
  // await wait(2000);

  // with shift key press down and click on each of the tr element
  // const shiftKey = new KeyboardEvent('keydown', { key: 'Shift' });
  // document.dispatchEvent(shiftKey);
  
  // const trs = tbody.querySelectorAll('tr');
  // if (trs.length > 0) {
  //   const range = document.createRange();
  //   range.setStartBefore(trs[0]);
  //   range.setEndAfter(trs[trs.length - 1]);
  
  //   const selection = window.getSelection();
  //   selection.removeAllRanges();
  //   selection.addRange(range);
  // }
  
  // // dispatch keyboard input Ctrl+A
  // const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true });
  // dispatchEvent(event);
  console.log('Selected all stocks');

}


// Listen for a message from the popup (if you create one) or just run the automation directly
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createWatchlist") {
    automateWatchlistCreation();
    sendResponse({ success: true });
  } else if (request.action === "addStocks" && request.screener) {
    addStocks(request.screener);
    sendResponse({ success: true });
  }
});
