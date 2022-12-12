let database;
let dbNamespace;

function initalizeDB(name) {
  return new Promise(function(resolve, reject) {
    if (name != dbNamespace) {
      database = null;
    }
    dbNamespace = name;
    if (database) {
      resolve();
      return;
    }
    let dbName = name == '' ? 'myDatabase' : 'myDatabase_' + name;
    let DBrequest = indexedDB.open(dbName, 2);
    DBrequest.onupgradeneeded = function(event) {
      database = event.target.result;

      if (!database.objectStoreNames.contains('data')) {
        data = database.createObjectStore('data', {autoIncrement: true});
      } else {
        data = DBrequest.transaction.objectStore('data');
      }
    }
    DBrequest.onerror = function(event) {
      reject(`had error starting database ${event.target.errorCode}`);
    }
    DBrequest.onsuccess = function(event) {
      database = event.target.result;
      resolve();
    }

    
  });
}

function add(type) {
  return new Promise((resolve, reject) => {
    let transx = database.transaction(['data'], 'readwrite');
    let store = transx.objectStore('data');

    let item = {count: 1, timestamp: Date.now()};
    store.add(item, type);

    transx.oncomplete = resolve;
    transx.onerror = function(event) {
      reject(`error ${event.target.errorCode}`);
    }
  });
}

function get(type) {
  return new Promise((resolve, reject) => {
    let transx = database.transaction(['data'], 'readwrite');
    let store = transx.objectStore('data');

    let item = store.get(type);

    item.onsuccess = e => resolve(item.result);
    item.onerror = transx.onerror = function(event) {
      reject(`error ${event.target.errorCode}`);
    }
  });
}


function put(type, count) {
  return new Promise((resolve, reject) => {
    let transx = database.transaction(['data'], 'readwrite');
    let store = transx.objectStore('data');

    let item = {count, timestamp: Date.now()};
    store.put(item, type);

    transx.oncomplete = resolve;
    transx.onerror = function(event) {
      reject(`error ${event.target.errorCode}`);
    }
  });
}



const increaseVisit = t => get(t).then(e => put(t, (e?.count ?? 0) + 1))
