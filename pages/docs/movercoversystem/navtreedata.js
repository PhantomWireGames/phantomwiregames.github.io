/*
 @licstart  The following is the entire license notice for the JavaScript code in this file.

 The MIT License (MIT)

 Copyright (C) 1997-2020 by Dimitri van Heesch

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 and associated documentation files (the "Software"), to deal in the Software without restriction,
 including without limitation the rights to use, copy, modify, merge, publish, distribute,
 sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or
 substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 @licend  The above is the entire license notice for the JavaScript code in this file
*/
var NAVTREE =
[
  [ "Mover Cover System", "index.html", [
    [ "Setup Guide", "d7/ddc/setup_page.html", [
      [ "Step 1 - Register the Movement Mode", "d7/ddc/setup_page.html#setup_step1", null ],
      [ "Step 1b - AnimBP Movement Mode interrupt (if using GASP / Motion Matching)", "d7/ddc/setup_page.html#setup_step1b", null ],
      [ "Step 2 - Add the Component", "d7/ddc/setup_page.html#setup_step2", null ],
      [ "Step 3 - Wire ProduceInput", "d7/ddc/setup_page.html#setup_step3", null ],
      [ "Step 4 - Create Input Actions", "d7/ddc/setup_page.html#setup_step4", null ],
      [ "Step 5 - Bind Input Actions in the Character", "d7/ddc/setup_page.html#setup_step5", null ],
      [ "Step 6 - Handle Crouch via OnCoverCrouchChanged", "d7/ddc/setup_page.html#setup_step6", null ]
    ] ],
    [ "Blueprint Reference", "dc/d89/blueprint_page.html", [
      [ "Callable Functions", "dc/d89/blueprint_page.html#bp_functions", [
        [ "TryEnterCover", "dc/d89/blueprint_page.html#bp_enter", null ],
        [ "ExitCover", "dc/d89/blueprint_page.html#bp_exit", null ],
        [ "UpdateCoverWall (float LateralInput)", "dc/d89/blueprint_page.html#bp_update", null ],
        [ "SetWantsToAim (bool bAiming)", "dc/d89/blueprint_page.html#bp_aim", null ],
        [ "RequestGoAroundCorner", "dc/d89/blueprint_page.html#bp_corner", null ],
        [ "RequestGapMovement", "dc/d89/blueprint_page.html#bp_gap", null ],
        [ "AddCoverInputsToCollection", "dc/d89/blueprint_page.html#bp_collection", null ]
      ] ],
      [ "Readable State", "dc/d89/blueprint_page.html#bp_state", null ],
      [ "Events", "dc/d89/blueprint_page.html#bp_events", null ],
      [ "Movement Mode Transitions", "dc/d89/blueprint_page.html#bp_transitions", null ]
    ] ],
    [ "Debug Tools", "d4/dcc/debug_page.html", [
      [ "Editor Visualization", "d4/dcc/debug_page.html#debug_editor", null ],
      [ "Runtime Debug", "d4/dcc/debug_page.html#debug_runtime", null ],
      [ "Trace Colour Key", "d4/dcc/debug_page.html#debug_trace", null ]
    ] ],
    [ "Classes", "annotated.html", [
      [ "Class List", "annotated.html", "annotated_dup" ],
      [ "Class Index", "classes.html", null ],
      [ "Class Hierarchy", "hierarchy.html", "hierarchy" ],
      [ "Class Members", "functions.html", [
        [ "All", "functions.html", null ],
        [ "Functions", "functions_func.html", null ],
        [ "Variables", "functions_vars.html", null ],
        [ "Enumerations", "functions_enum.html", null ],
        [ "Enumerator", "functions_eval.html", null ]
      ] ]
    ] ],
    [ "Files", "files.html", [
      [ "File List", "files.html", "files_dup" ],
      [ "File Members", "globals.html", [
        [ "All", "globals.html", null ],
        [ "Functions", "globals_func.html", null ],
        [ "Macros", "globals_defs.html", null ]
      ] ]
    ] ]
  ] ]
];

var NAVTREEINDEX =
[
"annotated.html"
];

const SYNCONMSG = 'click to disable panel synchronization';
const SYNCOFFMSG = 'click to enable panel synchronization';
const LISTOFALLMEMBERS = 'List of all members';