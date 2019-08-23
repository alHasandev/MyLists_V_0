// prepare DOM Element References
const listsActive = document.getElementById('lists-active');
const listsNonActive = document.getElementById('lists-nonactive');
const formAddItem = document.getElementById('form-add-item');
const inputItemName = document.getElementById('input-item-name');

// function
// push new item to list item array and render list item
const addItem = function (text) {
  const item = {
    text,
    checked: false
  };

  // listItems.push(item);
  setObjectStore('myLists', item);
  loadObjectStore('myLists', () => {
    listsActive.innerHTML = renderLists(storedData);
  });
}

// return dom string of new item
const listItem = function (item) {
  let html = `<li class="list-item" data-key="${item.id}" data-text="${item.text}">`;
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
const toggleDone = function (key, text, callback) {

  key = Number(key);

  // get data based on id
  loadObjectStoreAt('myLists', key, function (result) {
    // check if item checked true / false
    if (result.checked === false) {
      // prepare data
      data = {
        text,
        checked: true,
        id: key
      }
    } else {
      // prepare data
      data = {
        text,
        checked: false,
        id: key
      }
    }
    // update data
    updateObjectStore('myLists', data);
    callback();
  });

}

// function / delete list item
const deleteItem = function (key) {
  // find index
  // const index = listItems.findIndex(item => item.id === Number(key));

  // remove array item by their index
  deleteObjectStore('myLists', key);

}

// make action when checklist clicked
const clickCheck = function (event) {
  if (event.target.parentElement.classList.contains('checklist')) {
    let itemKey = event.target.parentElement.parentElement.dataset.key;
    let itemText = event.target.parentElement.parentElement.dataset.text;
    // console.log(itemKey);
    toggleDone(itemKey, itemText, () => {
      loadObjectStore('myLists', (result) => {
        listsActive.innerHTML = renderLists(result);
        listsNonActive.innerHTML = renderLists(result, true);
      });
    });
    // console.log(itemKey);


  }
}

// make action when cross symbol clicked
const clickCross = function (event) {
  if (event.target.classList.contains('hover-danger')) {
    if (confirm('Are you sure ?')) {
      let itemKey = event.target.parentElement.dataset.key;

      // delete item from lists
      deleteItem(Number(itemKey));

      // re-render list items
      loadObjectStore('myLists', (result) => {
        listsActive.innerHTML = renderLists(result);
        listsNonActive.innerHTML = renderLists(result, true);
      });
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

// // run after loading dom
// (function () {
//   // check if component reference exist
//   checkReference(listsNonActive, () => {
//     listsActive.innerHTML = renderLists(listItems);
//   });

//   // check if component reference exist
//   checkReference(listsNonActive, () => {
//     listsNonActive.innerHTML = renderLists(listItems, true);
//   });

// })();

let promise = new Promise((resolve, reject) => {
  resolve('resolve');
  reject('reject');
});

let getPromise = function (e) {
  return new Promise((resolve, reject) => {
    if (e) {
      resolve('succeed');
    } else {
      reject('failed');
    }
  })
}

getPromise(true).then((e) => console.log(e));