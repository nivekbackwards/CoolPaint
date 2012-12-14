require(

  { paths: { jquery:        'require_jquery',
             socketIO:      'require_socketIO',
             fabric:        'require_fabric',
             diff_match_patch: 'require_diffMatchPatch'
           },
  },
  
  ['jquery', 'socketIO', 'coolpaint', 'fabric', 'diff_match_patch'], 
  
  // entry point
  function ($, chatApp, io, coolPaintApp, fabric, diff_match_patch) {
    console.log("hello from main function");
  }
  
);
