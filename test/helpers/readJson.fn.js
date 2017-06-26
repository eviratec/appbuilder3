function readJSON (url, callback) {

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      callback(undefined, xhr.response);
    }
  }

  xhr.onerror = function () {
    callback(xhr.response);
  };

  xhr.open('GET', url, true);
  xhr.send('');

}
