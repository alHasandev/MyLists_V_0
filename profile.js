// prepare DOM Element References
// const localName = document.getElementById('fullname');
const localUser = document.getElementById('localuser');
const registerLink = document.getElementById('register-link');

// prepare variables
let imageName = getLocal('imageName', 'user-grey.png');
let fullName = getLocal('fullName', 'Your Name');
let userName = getLocal('userName', 'your_name');

//  wait until dom loaded 
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');

  // load User data
  loadUserData('#localname', fullName);
  loadUserData('#localuser', '@' + userName);

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

  // initDB();

  // listen to event
  // event: submit / form profile
  listenEvent('submit', '#form-profile', (event) => {
    // redirect to page: edit profile
    window.location.href = 'profile-edit.html';
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

  checkReference(registerLink, () => {
    // check if user is registered
    if (localStorage.userName === undefined) {
      localUser.classList.add('d-none');
      document.querySelector('.img-thumb').classList.add('d-none');
      registerLink.classList.remove('d-none');
    } else {
      localUser.classList.remove('d-none');
      loadUserImage(imageName);
      registerLink.classList.add('d-none');
    }
  });

});

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
  const avatar = document.getElementById('avatar');
  checkReference(avatar, () => {
    const path = './assets/images/User_Avatars/';
    avatar.src = path + imageName;
    console.log('user image changed');
  });
}

// function / load user Data
function loadUserData(selector, value) {
  const domUser = document.querySelector(selector);
  checkReference(domUser, () => {
    domUser.innerHTML = value;
    console.log('user data : ' + selector + ' changed');
  });
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