// Main require.js Application File

require(
  // The paths map lets you redefine the path to a module.
  // In this case, we are simply giving the jquery/underscore 
  // modules names that are more sensible:
  { paths: { jquery: 'require_jquery',
             underscore: 'require_underscore',
             socketIO: 'require_socketIO',
             fabric: 'require_fabric'
           },
  },
  
  // We then include the libraries we want to load for
  // our main application:
  ['jquery', 'underscore', 'chat', 'socketIO', 'coolpaint', 'fabric'], 
  
  // Now we have the main application entry point:
  function ($, _, chatApp, io, coolPaintApp, fabric) {
    console.log("hello from main function");

    // Using jQuery:
    console.log('Loaded jQuery     : ' + $('h1').text() + '!');

    console.log('Loaded fabric ?');//    : ' + JSON.stringify(fabric));
   
    // Using Underscore:
    console.log('Loaded underscore:');
    _.each([1, 2, 3], function (num) {
        console.log(num);
      });

    //console.log('returned object from ChatApp ... ' + chatApp.test);

    //console.log('returned object from CoolPaintApp ...' + coolPaintApp.test);
  }
);
