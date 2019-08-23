let db;
let dbVersion = 1;
let dbReady = false;

let storedData;

// prepare dummy data
let dummy = {
  text: 'Item 1',
  checked: false
};

// wait until dom ready
document.addEventListener('DOMContentLoaded', () => {

  // init indexedDB
  initDB();

  checkReference(listsActive, () => {
    // wait until indexed DB initiated
    setTimeout(() => {
      loadObjectStore('myLists', (result) => {
        // console.log(result);
        listsActive.innerHTML = renderLists(result);
        listsNonActive.innerHTML = renderLists(result, true);
      })

    }, 2000);
  });
});

// function / init indexedDB
function initDB() {
  // open connection to indexedDB Database and store to request
  let request = indexedDB.open('myFiles', dbVersion);

  // handle error request
  request.onerror = function (e) {
    console.error('Unable to open database.');
  }

  // handle success request
  request.onsuccess = function (e) {
    db = e.target.result;

    // check db version and create objectStore if needed
    console.log('db opened');
  }

  // send request
  request.onupgradeneeded = function (e) {
    let db = e.target.result

    // create object store
    createObjectStore(db);
    // console.log('onupgradeneeded invoked');
  }
}

function createObjectStore(db) {
  let objectStore = db.createObjectStore('myLists', {
    keyPath: 'id',
    autoIncrement: true
  });

  // Define what data items the objectStore will contain
  objectStore.createIndex('text', 'text', {
    unique: false
  });
  objectStore.createIndex('checked', 'checked', {
    unique: false
  });

  // set db to ready
  dbReady = true;

  console.log('Database setup complete');
}

// get data from object store
function loadObjectStore(storeName, callback) {
  // let result = [];
  // create  object transaction
  let trans = db.transaction([storeName], 'readonly');

  // request all data
  reqData = trans.objectStore(storeName).getAll();

  // handle on error
  reqData.onerror = function (e) {
    console.log('cannot get Data');
    console.error(e);
  }

  // handle on success 
  reqData.onsuccess = (e) => {
    console.log('succeed get all data');
    storedData = e.target.result;
    callback(e.target.result);
  }
}

// function / set data to object store
function setObjectStore(storeName, data) {
  // create object transaction
  let trans = db.transaction([storeName], 'readwrite');

  // add data to store
  let addData = trans.objectStore(storeName).add(data);

  // handle on error
  addData.onerror = function (e) {
    console.log('error storing data');
    console.log(e);
  }
  // handle on success
  addData.onsuccess = function (e) {
    console.log('succeed storing data');
    console.log('total saved : ' + e.target.result);
  }
}

// function / update data of object store
function updateObjectStore(storeName, data, key) {
  // create object transaction
  let trans = db.transaction([storeName], 'readwrite');

  // add data to store
  let updateData = trans.objectStore(storeName).put(data);

  // handle on error
  updateData.onerror = function (e) {
    console.log('error updating data');
    console.log(e);
  }
  // handle on success
  updateData.onsuccess = function (e) {
    console.log('succeed updating data');
    console.log('total saved : ' + e.target.result);
  }
}

// function / update data of object store
function deleteObjectStore(storeName, key) {
  // create object transaction
  let trans = db.transaction([storeName], 'readwrite');

  // add data to store
  let objectStore = trans.objectStore(storeName);

  // find index
  let deleteData = objectStore.delete(key);

  // handle on error
  deleteData.onerror = function (e) {
    console.log('error deleting data');
    console.error(e);
  }
  // handle on success
  deleteData.onsuccess = function (e) {
    console.log('succeed deleting data');
    console.log('total saved : ' + e.target.result);
  }
}