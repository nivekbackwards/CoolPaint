// Main require.js Application File

require(
  // The paths map lets you redefine the path to a module.
  // In this case, we are simply giving the jquery/underscore 
  // modules names that are more sensible:
  { paths: { jquery:        'require_jquery',
             socketIO:      'require_socketIO',
             fabric:        'require_fabric',
             diff_match_patch: 'require_diffMatchPatch'
           },
  },
  
  // We then include the libraries we want to load for
  // our main application:
  ['jquery', 'socketIO', 'coolpaint', 'fabric', 'diff_match_patch'], 
  
  // Now we have the main application entry point:
  function ($, chatApp, io, coolPaintApp, fabric, diff_match_patch) {
    console.log("hello from main function");
  }
  
);
