/**
 * A file containing small utility functions for use across the site
 */

/**
 * Adds a class to an element, if the class is not already present
 * @param {HTMLElement} elem     the element to add the class to
 * @param {String} classStr the class to add to the element
 */
function addClass(elem, classStr) {
  try {
    if (elem.className.indexOf(classStr) === -1) {
      if (elem.classList) {
        elem.classList.add(classStr);
      } else {
        elem.className += ' ' + classStr;
      }
    }
  } catch (err) {
    console.error("Could not add class to elem: ", elem, err);
  }
}

/**
 * Removes a class from an element
 * @param  {HTMLElement} elem     the element to remove the class from
 * @param  {String} classStr the class to remove from the element
 */
function removeClass(elem, classStr) {
  try {
    if (elem.classList) {
      elem.classList.remove(classStr);
    } else {
      elem.className = elem.className.replace(classStr, '');
    }
  } catch (err) {
    console.error("Could not remove class from elem: ", elem, err);
  }
}

/**
 * Toggles a class on an element
 * @param  {HTMLElement} elem     the element to toggle the class for
 * @param  {String} classStr the class to toggle
 */
function toggleClass(elem, classStr) {
  try {
    if (elem.classList) {
      elem.classList.toggle(classStr);
    } else {
      if (elem.className.contains(classStr)) {
        elem.className = elem.className.replace(classStr, '');
      } else {
        elem.className += ' ' + classStr;
      }
    }
  } catch (err) {
    console.error("Could not toggle class for elem: ", elem, err);
  }
}


function scrollToTop() {
  if (window.scrollTo) {
    window.scrollTo(0,0);
  } else {
    while (document.body.scrollTop != 0 && document.documentElement.scrollTop != 0) {
      scrollBy(0,-50);
    }
  }
}
