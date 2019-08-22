// prepare DOM Element References
const listsActive = document.getElementById('lists-active');
const listsNonActive = document.getElementById('lists-nonactive');
const formAddItem = document.getElementById('form-add-item');
const inputItemName = document.getElementById('input-item-name');

// prepare dummy data
let listItems = [{
    text: 'Item 1',
    checked: false,
    id: 1111111,
  },
  {
    text: 'Item 2',
    checked: false,
    id: 1112222,
  },
  {
    text: 'Item 3',
    checked: true,
    id: 1112223,
  },
  {
    text: 'Item 4',
    checked: true,
    id: 1112244,
  }
];

// function
// push new item to list item array and render list item
const addItem = function (text) {
  const item = {
    text,
    checked: false,
    id: Date.now(),
  };

  listItems.push(item);
  listsActive.innerHTML = renderLists(listItems);
}

// return dom string of new item
const listItem = function (item) {
  let html = `<li class="list-item" data-key="${item.id}">`;
  html += `<div class="checklist">`;
  html += `<input type="checkbox" ${item.checked ? 'checked' : null}>`;
  html += '<span class="checkmark"></span>';
  html += `<label>${item.text}</label>`;
  html += '</div>';
  html += '<span class="symbol-right hover-danger">&#10006</span>';
  html += '</li>';

  return html;
}

// set item checked property when checklist clicked
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

// function / delete list item
const deleteItem = function (key) {
  // find index
  const index = listItems.findIndex(item => item.id === Number(key));

  // remove array item by their index
  if (index > -1) {
    listItems.splice(index, 1);
  }

}

// make action when checklist clicked
const clickCheck = function (event) {
  if (event.target.parentElement.classList.contains('checklist')) {
    let itemKey = event.target.parentElement.parentElement.dataset.key;
    // console.log(itemKey);
    toggleDone(itemKey).then(result => {
      // console.log(result);

      listsActive.innerHTML = renderLists(result);
      listsNonActive.innerHTML = renderLists(result, true);
    });
  }
}

// make action when cross symbol clicked
const clickCross = function (event) {
  if (event.target.classList.contains('hover-danger')) {
    if (confirm('Are you sure ?')) {
      let itemKey = event.target.parentElement.dataset.key;

      // delete item from lists
      deleteItem(itemKey);

      // re-render list items
      listsActive.innerHTML = renderLists(listItems);
      listsNonActive.innerHTML = renderLists(listItems, true);
    }
  }
}

// listen to event

// check if component reference exist
checkReference(listsNonActive, () => {
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
});

// check if component reference exist
checkReference(listsNonActive, () => {
  // -- click: Active list item
  listsActive.addEventListener('click', (event) => {
    // call function when checklist clicked
    clickCheck(event);
    clickCross(event);
  });
});

// check if component reference exist
checkReference(listsNonActive, () => {
  // -- click: non Active list item
  listsNonActive.addEventListener('click', (event) => {
    // call function when checklist clicked
    clickCheck(event);
    clickCross(event);
  });
});

// return all items in list array as dom string
function renderLists(lists, checked = false) {
  let html = '';
  lists.forEach(item => {
    if (item.checked === checked) html += listItem(item);
  });

  return html;
}

// function / check if component reference exist
function checkReference(dom, callback) {
  if (dom !== null) {
    callback()
  }
}

// run after loading dom
(function () {
  // check if component reference exist
  checkReference(listsNonActive, () => {
    listsActive.innerHTML = renderLists(listItems);
  });

  // check if component reference exist
  checkReference(listsNonActive, () => {
    listsNonActive.innerHTML = renderLists(listItems, true);
  });

})();