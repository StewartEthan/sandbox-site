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

function searchForItem(query, maxEntries) {
  // Make sure maxEntries has a number
  maxEntries = maxEntries || 20;
  const url = `
    https://stewartethan-portfolio.herokuapp.com/ebay?query=${query}&limitResults&maxEntries=${maxEntries}`;
  
  // Uses my convenience function to make the call and handle the result
  xhr('GET', url, null, null, res => {
    // If we got anything besides a successful response, log the error and return an empty array
    if (res.status !== 200) {
      console.error('Server returned error:', res.status, res.error);
      return [];
    }

    // Try to parse the response as JSON
    let response;
    try {
      response = JSON.parse(res.response);
    } catch (err) { // If response couldn't be parsed, log the error and return an empty array
      console.error('Could not parse response as JSON:', err);
      return [];
    }

    // If the response returned an error, log the error message and return an empty array
    if (response.error) {
      console.error('Server returned error:', response.msg);
      return [];
    }

    // ebayResults will hold the results
    const ebayResults = [];

    // Parse each individual result to produce the most useful info
    response.Product.forEach(product => {
      const result = {};

      result.title = product.Title;
      result.upc = null;
      for (let i = 0; i < product.ProductID.length; ++i) {
        let id = product.ProductID[i];
        if (id.Type.toLowerCase() === 'reference' && !result.upc) {
          result.reference = id.Value;
        }
        if (id.Type.toLowerCase() === 'upc') {
          result.upc = id.Value;
          if (result.reference) delete result.reference;
          break;
        }
      }
      result.details = {};
      if (product.ItemSpecifics && product.ItemSpecifics.NameValueList) {
        for (let i = 0; i < product.ItemSpecifics.NameValueList; ++i) {
          let detail = product.ItemSpecifics.NameValueList[i];
          result.details[detail.Name] = detail.Value;
        }
      }

      ebayResults.push(result);
    });

    // Fire event to indicate the results are fully loaded
    const event = new CustomEvent('ebayloaded', {detail: ebayResults});
    window.dispatchEvent(event);
  });
}

function getItemDetails(id) {
  const url = `
    https://stewartethan-portfolio.herokuapp.com/ebay/details?id=${id}`;
  
  xhr('GET', url, null, null, res => {
    // If we got anything besides a successful response, log the error and return an empty array
    if (res.status !== 200) {
      console.error('Server returned error:', res.status, res.error);
      return [];
    }

    // Try to parse the response as JSON
    let response;
    try {
      response = JSON.parse(res.response);
    } catch (err) { // If response couldn't be parsed, log the error and return an empty array
      console.error('Could not parse response as JSON:', err);
      return [];
    }

    // If the response returned an error, log the error message and return an empty array
    if (response.error) {
      console.error('Server returned error:', response.msg);
      return [];
    }

    const prices = [];
    response.searchResult[0].item.forEach(item => {
      let price = original = item.sellingStatus[0].currentPrice[0].__value__;
      price = parseFloat(price);
      if (!isNaN(price)) {
        price = price.toFixed(2);
      } else {
        price = original;
      }
      prices.push(price);
    });

    const event = new CustomEvent('pricesloaded', {detail: prices});
    window.dispatchEvent(event);
  });
}