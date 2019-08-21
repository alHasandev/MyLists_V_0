// prepare DOM Element
const listsActive = document.getElementById('lists-active');
const formAddItem = document.getElementById('form-add-item');
const inputItemName = document.getElementById('input-item-name');
const addItem = function (text) {
  const item = {
    text,
    checked: false,
    id: Date.now(),
  };

  listItems.push(item);
  listsActive.innerHTML = renderLists(listItems);
}

function renderLists(lists, checked = false) {
  let html = '';
  lists.forEach(item => {
    if (item.checked === checked) html += listItem(item);
  });

  return html;

}

const listItem = function (item) {
  let html = `<li class="list-item ${item.checked ? 'checked' : null}" data-key="${item.id}">`;
  // html += `<label for="${item.id}" class="checklist circle">`;
  html += `<input type="checkbox" class="checklist circle" ${item.checked ? 'checked' : null}>`;
  // html += '</label>';
  html += `<span>${item.text}</span>`;
  html += '</li>';

  return html;
}

const toggleDone = function (key) {
  // find index
  const index = listItems.findIndex(item => item.id === Number(key));

  // set checked
  listItems[index].checked = !listItems[index].checked;

  // set class for checked item
  const item = document.querySelector(`[data-key='${key}']`);
  if (listItems[index].checked) {
    item.classList.add('checked');
  } else {
    item.classList.remove('checked');
  }

  // setTimeout(() => {
  return new Promise((resolve, reject) => {
    resolve(listItems);
  });
  // }, 1000);

}

let listItems = [];

// listen to event
// -- submit: form add item
formAddItem.addEventListener('submit', (event) => {
  // prevent default behaviour
  event.preventDefault();

  // get inputed text
  let text = inputItemName.value.trim();

  // check if text is empty
  if (text != '') {
    // add new item to active lists
    addItem(text);
  }

  // reset & set focus to input
  inputItemName.value = '';
  inputItemName.focus();
});

// -- click: list item
listsActive.addEventListener('click', (event) => {
  if (event.target.classList.contains('checklist')) {
    let itemKey = event.target.parentElement.dataset.key;

    toggleDone(itemKey).then(result => {
      console.log(result);

      listsActive.innerHTML = renderLists(result);
    });
  }
});

// make promise