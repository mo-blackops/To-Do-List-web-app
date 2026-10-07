const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
const audio = document.getElementById('myAudio');
const toggleBtn = document.getElementById('toggleBtn');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  });
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  //Validate input

  if (newItem === '') {
    alert('Please enter an item');
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);
  checkUI();
  itemInput.value = '';
}

function addItemToDOM(item) {
  // Create new list item
  const li = document.createElement('li');

  // Create span for text to control text wrapping
  const textSpan = document.createElement('span');
  textSpan.textContent = item;
  textSpan.style.wordBreak = 'break-all';
  textSpan.style.overflowWrap = 'break-word';
  textSpan.style.minWidth = '0';
  textSpan.style.flex = '1';

  li.appendChild(textSpan);

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Append li to list
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = creatIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function creatIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function onClickItem(e) {
  // 1. Check if the clicked element is either the delete icon or the remove button itself
  if (
    e.target.parentElement.classList.contains('remove-item') ||
    e.target.classList.contains('remove-item')
  ) {
    const li = e.target.closest('li');
    if (li) removeItem(li);
    return;
  }

  // 2. Find the closest <li> ancestor relative to the clicked target
  const li = e.target.closest('li');

  // If the click was not inside an <li> (e.g., clicked in the empty space inside the <ul>), exit early
  if (!li) return;

  // 3. Enable edit mode for the selected <li> item
  setItemToEdit(li);
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = 'rgba(95, 212, 246, 0.15)';

  const textSpan = item.querySelector('span');
  itemInput.value = textSpan
    ? textSpan.textContent.trim()
    : item.firstChild.textContent.trim();
}

function removeItem(item) {
  // Remove item from DOM
  item.remove();

  // Remove item from storage
  removeItemFromStorage(item.textContent);

  checkUI();
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localstorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // Clear from local storage
  localStorage.removeItem('items');

  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function checkUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '';

  isEditMode = false;
}

// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  // Attempt to start audio on page load
  // 1. Toggle play/pause audio on button click

  // audio.volume = 0.3;

  toggleBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          toggleBtn.textContent = '⏸ Pause Audio';
        })
        .catch((err) => console.log('Autoplay blocked:', err));
    } else {
      audio.pause();
      toggleBtn.textContent = '▶ Play Audio';
    }
  });

  // 2. Attempt to play audio on first user interaction anywhere on the page
  const startAudioOnFirstInteraction = () => {
    if (audio.paused) {
      audio.muted = false;
      audio
        .play()
        .then(() => {
          toggleBtn.textContent = '⏸ Pause Audio';
        })
        .catch((err) => console.log('Autoplay blocked:', err));
    }
    // Remove event listeners after the first interaction
    window.removeEventListener('click', startAudioOnFirstInteraction);
    window.removeEventListener('keydown', startAudioOnFirstInteraction);
  };

  window.addEventListener('click', startAudioOnFirstInteraction);
  window.addEventListener('keydown', startAudioOnFirstInteraction);

  checkUI();
}

init();
