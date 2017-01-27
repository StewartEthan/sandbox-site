/**
 * A file containing small utility functions for use across the site
 */

/**
 * Returns a random number within a range
 * @param  {Number} min minimum random number to return
 * @param  {Number} max maximum number to return
 * @return {Number}     random number within the range provided
 */
function random(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

/**
 * Provides a smooth scroll to the top of the page
 */
function scrollToTop() {
  if (window.scrollTo) {
    window.scrollTo(0,0);
  } else {
    while (document.body.scrollTop != 0 && document.documentElement.scrollTop != 0) {
      scrollBy(0,-50);
    }
  }
}

const httpMethods = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'CONNECT',
  'OPTIONS'
]
function xhr(method, url, headers, data, cb) {
  // Handle potential errors with params
  if (httpMethods.indexOf(method) === -1) {
    throw new Error('You must use a valid HTTP method');
  }
  if (typeof url !== "string" || url === '') {
    throw new Error('url argument must not be empty');
  }
  if (headers === undefined) headers = null;
  if (data === undefined) data = null;

  const xhreq = new XMLHttpRequest();

  xhreq.open(method, url, true);

  xhreq.onreadystatechange = e => {
    if (xhreq.readyState === XMLHttpRequest.DONE) {
      // Only use cb if its a function, allowing for it to be optional
      if (typeof cb === 'function') {
        cb(xhreq);
      }
    }
  }

  // Set each header
  for (let key in headers) {
    xhreq.setRequestHeader(key, headers[key]);
  }

  xhreq.send(data);
}