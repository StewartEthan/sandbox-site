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

function scrollToTop() {
  if (window.scrollTo) {
    window.scrollTo(0,0);
  } else {
    while (document.body.scrollTop != 0 && document.documentElement.scrollTop != 0) {
      scrollBy(0,-50);
    }
  }
}
