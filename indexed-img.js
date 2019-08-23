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