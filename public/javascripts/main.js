// Main require.js Application File

require(
  // The paths map lets you redefine the path to a module.
  // In this case, we are simply giving the jquery/underscore 
  // modules names that are more sensible:
  { paths: { jquery: 'require_jquery',
             underscore: 'require_underscore',
             //backbone: 'backbone-min',
             socketIO: 'require_socketIO'
           },

    // The shim map allows you to load in an external library
    // that is not a require.js module and requires dependencies
    // on other libraries:
    /*
    shim: { 'backbone': {
              deps: ['underscore', 'jquery'],
              exports: 'Backbone' 
            }
          }
          */
    
  },
  
  // We then include the libraries we want to load for
  // our main application:
  ['jquery', 'underscore', 'chat', 'socketIO'], 
  
  // Now we have the main application entry point:
  function ($, _, chatApp, io) {
    console.log("hello from main function");

    // Using jQuery:
    console.log('Loaded jQuery     : ' + $('h1').text() + '!');
   
    // Using Underscore:
    console.log('Loaded underscore:');
    _.each([1, 2, 3], function (num) {
        console.log(num);
      });

    console.log('returned object from ChatApp ... ' + chatApp.test);
  }
);
