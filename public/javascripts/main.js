// Main require.js Application File

require(
  // The paths map lets you redefine the path to a module.
  // In this case, we are simply giving the jquery/underscore 
  // modules names that are more sensible:
  { paths: { jquery:        'require_jquery',
             underscore:    'require_underscore',
             socketIO:      'require_socketIO',
             fabric:        'require_fabric',
             jscolor:       'require_jscolor',
             diff_match_patch: 'diff_match_patch_uncompressed'
           },
  },
  
  // We then include the libraries we want to load for
  // our main application:
  ['jquery', 'underscore', 'socketIO', 'coolpaint', 'fabric', 'jscolor', 'diff_match_patch'], 
  
  // Now we have the main application entry point:
  function ($, _, chatApp, io, coolPaintApp, fabric, jscolor, diff_match_patch) {
    console.log("hello from main function");
  }
  
);
