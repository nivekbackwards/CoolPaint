// We can use require.js with existing JavaScript libraries
// that do not adhere to the AMD model (Asynchronous Module
// Definition) for JavaScript. To do this, we simply use
// `define` giving it the path to the JavaScript file to load:
define(['/javascripts/underscore-min.js'], function () {
  // We export jQuery by simply returning the jQuery object:
  return _;
});

