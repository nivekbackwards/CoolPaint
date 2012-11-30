// Main require.js Application File

require(
  // The paths map lets you redefine the path to a module.
  // In this case, we are simply giving the jquery/underscore 
  // modules names that are more sensible:
  { paths: { jquery: 'require_jquery',
             underscore: 'require_underscore',
             backbone: 'backbone-min',
             socketIO: 'require_socketIO'
             // We can also define sub-directories to hold
             // javascript for particular libraries:
             //lib: '/javascripts/lib'
           },
    // The shim map allows you to load in an external library
    // that is not a require.js module and requires dependencies
    // on other libraries:
    shim: { 'backbone': {
              deps: ['underscore', 'jquery'],
              exports: 'Backbone' 
            }
          }
    
  },
  
  // We then include the libraries we want to load for
  // our main application:
  ['jquery', 'underscore', 'chat', 'socketIO'], 
  
  // Now we have the main application entry point:
  function ($, _, chatApp, io) {
    console.log('does this do anything...?');

    // Simple module:
    //console.log('Loaded module1    : ' + JSON.stringify(m1));  
   
    // Using jQuery:
    console.log('Loaded jQuery     : ' + $('h1').text() + '!');
   
    // Using Underscore:
    console.log('Loaded underscore:');
    _.each([1, 2, 3], function (num) {
        console.log(num);
      });

    console.log('returned object from ChatApp ... ' + chatApp.test);
    
    /*
    // Module with dependencies:
    console.log('Loaded module2    : ');
    var title = new m2.Title();
    console.log('Title: ' + title.el.text());

    // Module in subdirectory:
    var o = new libm.obj('h1');
    console.log('libm module: ' + o.display()); 
    */
  }
);
