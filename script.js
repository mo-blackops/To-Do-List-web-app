const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');

function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  //Validate input

  if (newItem === '') {
    alert('Please enter an item');
    return;
  }

  //Create new list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(newItem));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  itemList.appendChild(li);
  itemInput.value = '';
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

itemForm.addEventListener('submit', addItem);
