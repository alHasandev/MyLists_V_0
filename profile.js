// prepare variables
let db;
let dbVersion = 1;
let dbReady = false;
let imageName = getLocal('imageName', 'user-grey.png');
let fullName = getLocal('fullName', 'Your Name');
let userName = getLocal('userName', '@your_name');

//  wait until dom loaded 
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');

  // load User data
  loadUserImage(imageName);
  loadUserData('#fullname', fullName);
  loadUserData('#username', '@' + userName);

  // prepare Html Dom References
  const addImage = document.getElementById('add-image');
  const previewImage = document.getElementById('preview-image');

  // listen to event
  // -- change: upload image button
  checkReference(addImage, () => {
    addImage.addEventListener('change', (e) => {
      uploadImage(e, doImageTest);
    });
  });

  // -- click: user image
  checkReference(previewImage, () => {
    previewImage.addEventListener('click', doImageTest);
  });

  initDB();

  // listen to event
  // event: submit / form profile
  listenEvent('submit', '#form-profile', (event) => {
    // redirect to page: edit profile
    window.location.href = 'register.html';
  });

  // event: click / choose avatar image
  listenEvent('click', '.avatar', (event) => {
    // console.log(event.target);
    // get image name
    let imageName = getFileName(event.target.src);
    loadUserImage(imageName);
    closeModal('avatar-list');
  });

  listenEvent('submit', '#form-register', (event) => {
    // get form data and image name
    let fullName = document.getElementById('fullname').value;
    let userName = document.getElementById('username').value;
    let imageName = getFileName(document.getElementById('avatar').src);

    // store data to local storage
    storeLocal({
      fullName: fullName,
      userName: userName,
      imageName: imageName
    });

    // redirect to page profile
    window.location.href = 'profile.html';
  });
});

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
    console.log('db opened');
  }

  // send request
  request.onupgradeneeded = function (e) {
    let db = e.target.result;
    // create object store
    db.createObjectStore('myImages', {
      keyPath: 'id',
      autoIncrement: true
    });

    // set db to ready
    dbReady = true;
  }
}

// function / upload image
function uploadImage(e, callback) {
  console.log('change event fired for input field');
  // store uploaded file
  let file = e.target.files[0];
  console.log(file);


  let reader = new FileReader();
  reader.readAsBinaryString(file);

  // process upload to db
  reader.onload = function (e) {
    // store file as bits
    let bits = e.target.result;

    // store bits to new object
    let ob = {
      created: new Date(),
      data: bits
    };

    // store db transaction and add request
    let trans = db.transaction(['myImages'], 'readwrite');
    let addReq = trans.objectStore('myImages').add(ob);

    // add response to error or success
    addReq.onerror = function (e) {
      console.log('error storing data');
      console.error(e);
    }

    trans.oncomplete = function (e) {
      console.log('data stored');
      callback();
    }

  }
}

// function / test displaying images
function doImageTest() {
  console.log('Do image test');
  const image = document.getElementById('image-test');

  // open db transaction
  let trans = db.transaction(['myImages'], 'readonly');

  // request file
  let req = trans.objectStore('myImages').get(1);

  // handle success request
  req.onsuccess = function (e) {
    let record = e.target.result;

    console.log('get Files success', record);
    image.src = 'data:image/jpeg;base64,' + btoa(record.data);

  }
}

// function / get just name file from absolute path file
function getFileName(path) {
  let fileName = path.split('/');
  return fileName[fileName.length - 1];
}

// function / get Image Name from Local Storage
function getLocal(item, defaultName) {
  return (localStorage.getItem(item) !== null) ? localStorage.getItem(item) : defaultName;
}

// function / load User Image
function loadUserImage(imageName) {
  const path = './assets/images/User_Avatars/';
  document.getElementById('avatar').src = path + imageName;
  console.log('user image changed');
}

// function / load user Data
function loadUserData(selector, value) {
  document.querySelector(selector).innerHTML = value;
}

// function / save profile to local storage
function storeLocal(obj) {

  Object.keys(obj).forEach((key) => {
    console.log(`Set ${key} = ${obj[key]}`);
    localStorage.setItem(key, obj[key]);
  });
  // localStorage.setItem('fullname', fullName);
  // localStorage.setItem('username', userName);
  // localStorage.setItem('image', imageName);
  console.log('Data stored');
}

// function / show modal
function showModal(modalId, display = 'block') {
  document.getElementById(modalId).style.display = display;
}

// function / close modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// function / listen to event click
function listenEvent(event, selector, callback) {
  document.addEventListener(event, (ev) => {
    // only listen to event triggered by selector
    if (ev.target.matches(selector)) {
      // prevent default behaviour
      ev.preventDefault();

      // call back function
      callback(ev);
    }
  })
}