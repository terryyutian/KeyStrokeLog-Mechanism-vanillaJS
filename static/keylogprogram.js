// Define the id of the text area where you want the keystroke data to be collected
const text_area_id = "text123";
// Define the id of the submit button
const submit_button_id = "send123";

let taskonset = 0;
let submit = 1; // to detect if the participant has submitted or not.

window.addEventListener("DOMContentLoaded", () => {
  // record task onset time
  const d_onset = new Date();
  taskonset = d_onset.getTime();
});

// Find the text area where keystroke data will be collected.
let myElement = document.getElementById(text_area_id);

// Find the "Send" button to post keystroke data to the server end
let button = document.getElementById(submit_button_id);

// Get User, Session, Input information to link keystroke data to a specific user and his/her responses
let userId = "userId"; // obtain this information and change the value accoridngly when using this keystroke logging program
let sessionId = "sessionId"; // obtain this information and change the value accoridngly when using this keystroke logging program
let inputId = "inputId"; // obtain this information and change the value accoridngly when using this keystroke logging program

//keystroke logging: set up keylog object
let startSelect = [];
let endSelect = [];
let textNow = "";
let EventID = 0;
let ActivityCancel = [];
let TextChangeCancel = [];

var keylog = {
  //Proprieties
  TaskOnSet: [], ///
  TaskEnd: [],
  PartitionKey: [],
  RowKey: [],
  EventID: [], ////
  EventTime: [], ////
  Output: [], ////
  CursorPosition: [], ////
  TextContent: [], ////
  TextChange: [], ////
  Activity: [], /////
  FinalProduct: [], /////
  //INITIATION init() will run on page load. All it does is store keypresses in cache
  init: function () {
    // listen to all keypresses and store them to an array

    myElement.addEventListener("keydown", function (evt) {
      let d_press = new Date();
      keylog.EventTime.push(d_press.getTime() - taskonset); // start time

      EventID = EventID + 1;
      keylog.EventID.push(EventID);

      // Add a unique RowKey
      keylog.RowKey.push(sessionId + "-" + inputId + "-" + String(EventID));

      /// when logging space, it is better to use the letter space for the output column
      if (evt.key === " ") {
        keylog.Output.push("Space");
      } else if (evt.key === "Unidentified") {
        keylog.Output.push("KeyboardTouch");
      } else {
        keylog.Output.push(evt.key);
      }

      // Record the current text content
      keylog.TextContent.push(myElement.value);

      // get cursor information
      let startPosition = myElement.selectionStart;
      let endPosition = myElement.selectionEnd;

      if (startPosition == endPosition) {
        keylog.CursorPosition.push(endPosition); // cursorposition
        startSelect.push(startPosition); // faciliate the calculation below
        endSelect.push(endPosition);
      } else {
        keylog.CursorPosition.push(endPosition);
        startSelect.push(startPosition); // faciliate the calculation below
        endSelect.push(endPosition);
      }

      /////// use a customized function to detect and record different activities and the according text changes these activities bring about
      ActivityDetector(keylog);
      //  console.log('Output: ' + String(keylog.Output.slice(-1)))
      //  console.log('Position: ' + String(keylog.CursorPosition.slice(-1)))
      //  console.log(String(keylog.TextChange.slice(-1) + ' ' + String(keylog.Activity.slice(-1)))
    });

    myElement.addEventListener("mousedown", function (ek) {
      let mouseDown_m = new Date();
      let MouseDownTime = mouseDown_m.getTime() - taskonset;

      EventID = EventID + 1;
      keylog.EventID.push(EventID);

      // Add a unique RowKey
      keylog.RowKey.push(sessionId + "-" + inputId + "-" + String(EventID));

      //////Start logging for this current click down event
      keylog.EventTime.push(MouseDownTime); // starttime

      if (ek.which === 1) {
        keylog.Output.push("Leftclick");
      } else if (ek.which === 2) {
        keylog.Output.push("Middleclick");
      } else if (ek.which === 3) {
        keylog.Output.push("Rightclick");
      } else {
        keylog.Output.push("Unknownclick");
      }

      //textcontent
      keylog.TextContent.push(myElement.value);

      let startPosition = myElement.selectionStart;
      let endPosition = myElement.selectionEnd;
      if (startPosition == endPosition) {
        keylog.CursorPosition.push(startPosition);
        startSelect.push(startPosition); // faciliate the calculation below
        endSelect.push(endPosition);
      } else {
        keylog.CursorPosition.push(endPosition);
        startSelect.push(startPosition); // faciliate the calculation below
        endSelect.push(endPosition);
      }

      /////// use a customized function to detect and record different activities and the according text changes these activities bring about
      ActivityDetector(keylog);
    });

    //// add touch event for this program to function on phones
    myElement.addEventListener("touchstart", function (evt) {
      let d_press = new Date();
      keylog.EventTime.push(d_press.getTime() - taskonset); // start time

      EventID = EventID + 1;
      keylog.EventID.push(EventID);

      // Add a unique RowKey
      keylog.RowKey.push(sessionId + "-" + inputId + "-" + String(EventID));

      keylog.Output.push("Touch");

      // text content
      keylog.TextContent.push(myElement.value);

      // get cursor information

      let startPosition = myElement.selectionStart;
      let endPosition = myElement.selectionEnd;

      if (startPosition == endPosition) {
        keylog.CursorPosition.push(endPosition); // cursorposition
        startSelect.push(startPosition); // faciliate the calculation below
        endSelect.push(endPosition);
      } else {
        keylog.CursorPosition.push(endPosition);
        startSelect.push(startPosition); // faciliate the calculation below
        endSelect.push(endPosition);
      }

      /////// use a customized function to detect and record different activities and the according text changes these activities bring about
      ActivityDetector(keylog);
      //  console.log('Output: ' + String(keylog.Output.slice(-1)))
      //  console.log('Position: ' + String(keylog.CursorPosition.slice(-1)))
      //  console.log(String(keylog.TextChange.slice(-1) + ' ' + String(keylog.Activity.slice(-1))))
    });
  },
};

////////////////////////////////////////////////////@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

function ActivityDetector(keylog) {
  if (keylog.TextContent.length >= 1) {
    // textchange     //activity

    let change =
      String(keylog.TextContent.slice(-1)).length -
      String(keylog.TextContent.slice(-2, -1)).length;

    if (change == 0) {
      let start = parseInt(startSelect.slice(-2, -1));
      let end = parseInt(endSelect.slice(-2, -1));

      let start1 = parseInt(startSelect.slice(-2, -1));
      let end1 = parseInt(endSelect.slice(-2, -1));
      let start2 = parseInt(startSelect.slice(-1));
      let end2 = parseInt(endSelect.slice(-1));
      let Text1 = String(keylog.TextContent.slice(-2, -1)).slice(start1, end1);
      let Text2 = String(keylog.TextContent.slice(-1)).slice(start2, end2);

      if (start1 < end1 && start2 < end2 && Text1 == Text2) {
        // when move is detected

        if (start2 > start1 && end2 > end1) {
          //front move
          movedText = String(keylog.TextContent.slice(-1)).slice(start2, end2);
          keylog.TextChange.push(movedText);
          TextChangeCancel.push(movedText);
          keylog.Activity.push(
            `Move From [${start1}, ${end1}] To [${start2}, ${end2}]`
          );
          ActivityCancel.push(
            `Move From [${start1}, ${end1}] To [${start2}, ${end2}]`
          );
          textNow =
            textNow.slice(0, start1) +
            textNow.slice(end1, end2) +
            movedText +
            textNow.slice(end2, textNow.length);
        } else if (start2 < start1 && end2 < end1) {
          //back move

          movedText = String(keylog.TextContent.slice(-1)).slice(start2, end2);
          keylog.TextChange.push(movedText);
          TextChangeCancel.push(movedText);
          keylog.Activity.push(
            `Move From [${start1}, ${end1}] To [${start2}, ${end2}]`
          );
          ActivityCancel.push(
            `Move From [${start1}, ${end1}] To [${start2}, ${end2}]`
          );
          textNow =
            textNow.slice(0, start2) +
            movedText +
            textNow.slice(start2, start1) +
            textNow.slice(end1, textNow.length);
        } else if (start2 == start1 && end2 == end1) {
          // no move in the end
          textNow = textNow;
          keylog.TextChange.push("NoChange");
          TextChangeCancel.push("NoChange");
          keylog.Activity.push("Nonproduction");
          ActivityCancel.push("Nonproduction");
        } else if (start2 < start1 && end2 > end1) {
          // mistakenly select all the text

          textNow = textNow;
          keylog.TextChange.push("NoChange");
          TextChangeCancel.push("NoChange");
          keylog.Activity.push("Nonproduction");
          ActivityCancel.push("Nonproduction");
        }
      } else if (
        start1 == end1 &&
        start2 < end2 &&
        String(textNow) != String(keylog.TextContent.slice(-1))
      ) {
        // cancel this move
        changeN = parseInt(ActivityCancel.length);

        for (let i = 0; i <= changeN - 1; i++) {
          num = changeN - 1 - i;
          let activity = String(ActivityCancel[num]);
          if (activity.startsWith("Move")) {
            keylog.TextChange.push(String(TextChangeCancel[num]));
            TextChangeCancel.splice(num, 1);
            let index1 = activity.indexOf("[");
            let index2 = activity.indexOf("]");
            let index3 = activity.lastIndexOf("[");
            let secondmove = activity.slice(index1, index2 + 1);
            let firstmove = activity.slice(index3);
            keylog.Activity.push(`Move From ${firstmove} To ${secondmove}`);
            ActivityCancel.splice(num, 1);
            textNow = String(keylog.TextContent.slice(-1));
            i = changeN - 1;
          }

          if (activity.startsWith("Replace")) {
            let middleindex = String(TextChangeCancel[num]).lastIndexOf(" => ");
            let substitute = String(TextChangeCancel[num]).slice(
              5,
              middleindex
            );
            let replace = String(TextChangeCancel[num]).slice(middleindex + 4);
            keylog.TextChange.push(`${replace} => ${substitute}`);
            keylog.Activity.push("Replace");
            TextChangeCancel.splice(num, 1);
            ActivityCancel.splice(num, 1);
            textNow = String(keylog.TextContent.slice(-1));
            i = changeN - 1;
          }
        }
      } else {
        textNow = textNow;
        if (textNow == keylog.TextContent.slice(-1)) {
          keylog.TextChange.push("NoChange");
          keylog.Activity.push("Nonproduction");
        } else {
          // start the else condition
          if (start < end) {
            // replace activity: replace n chracters with n new characters
            textNow =
              String(keylog.TextContent.slice(-2, -1)).slice(0, start) +
              String(keylog.TextContent.slice(-1)).substr(
                start,
                end + change - start
              ) +
              String(keylog.TextContent.slice(-2, -1)).slice(
                end,
                String(keylog.TextContent.slice(-2, -1)).length
              );

            replaced = String(keylog.TextContent.slice(-2, -1)).substr(
              start,
              end - start
            );
            substitute = String(keylog.TextContent.slice(-1)).substr(
              start,
              end + change - start
            );
            if (textNow == keylog.TextContent.slice(-1)) {
              if (replaced != substitute) {
                keylog.TextChange.push(`${replaced} => ${substitute}`);
                TextChangeCancel.push(`${replaced} => ${substitute}`);
                keylog.Activity.push("Replace");
                ActivityCancel.push("Replace");
              } else {
                keylog.TextChange.push("NoChange");
                keylog.Activity.push("Nonproduction");
              }
            } else {
              AutoCorrectionDector(keylog);
            }
          }
          if (start == end) {
            // irregular replacement
            AutoCorrectionDector(keylog);
          }
        }
      }
    }

    if (change == 1) {
      let start = parseInt(startSelect.slice(-2, -1));
      let end = parseInt(endSelect.slice(-2, -1));

      let index = parseInt(endSelect.slice(-1));
      textNow =
        textNow.slice(0, index - 1) +
        String(keylog.TextContent.slice(-1))[index - 1] +
        textNow.slice(index - 1);

      if (textNow == keylog.TextContent.slice(-1)) {
        // just a common input

        keylog.TextChange.push(String(keylog.TextContent.slice(-1))[index - 1]);
        keylog.Activity.push("Input");
      } else {
        /// replace n characters with n+1 new characters

        if (start < end) {
          /// regular paste activity
          textNow =
            String(keylog.TextContent.slice(-2, -1)).slice(0, start) +
            String(keylog.TextContent.slice(-1)).substr(
              start,
              end + change - start
            ) +
            String(keylog.TextContent.slice(-2, -1)).slice(
              end,
              String(keylog.TextContent.slice(-2, -1)).length
            );

          replaced = String(keylog.TextContent.slice(-2, -1)).substr(
            start,
            end - start
          );
          substitute = String(keylog.TextContent.slice(-1)).substr(
            start,
            end + change - start
          );

          if (textNow == keylog.TextContent.slice(-1)) {
            ReplaceDetector(replaced, substitute, keylog);
          } else {
            //irregular paste activity.
            AutoCorrectionDector(keylog);
          }
        }

        if (start == end) {
          AutoCorrectionDector(keylog);
        }
      }
    }

    if (change > 1) {
      let start = parseInt(startSelect.slice(-2, -1));
      let end = parseInt(endSelect.slice(-2, -1));

      let rangeStart = keylog.CursorPosition.slice(-2, -1); // the time beyond the last time where the cursor is.
      let rangeEnd = keylog.CursorPosition.slice(-1); // the last time where the cursor is.
      let newlyAdded = String(keylog.TextContent.slice(-1)).slice(
        rangeStart,
        rangeEnd
      );

      textNow =
        textNow.slice(0, rangeStart) +
        String(keylog.TextContent.slice(-1)).slice(rangeStart, rangeEnd) +
        textNow.slice(rangeStart);

      if (textNow == keylog.TextContent.slice(-1)) {
        // Paste more than 1 character
        keylog.TextChange.push(newlyAdded);
        keylog.Activity.push("Paste");
      } else {
        // replace activity
        if (start < end) {
          // regular replace activity: replace n characters with n+m characters
          textNow =
            String(keylog.TextContent.slice(-2, -1)).slice(0, start) +
            String(keylog.TextContent.slice(-1)).substr(
              start,
              end + change - start
            ) +
            String(keylog.TextContent.slice(-2, -1)).slice(
              end,
              String(keylog.TextContent.slice(-2, -1)).length
            );

          replaced = String(keylog.TextContent.slice(-2, -1)).substr(
            start,
            end - start
          );
          substitute = String(keylog.TextContent.slice(-1)).substr(
            start,
            end + change - start
          );

          if (textNow == keylog.TextContent.slice(-1)) {
            ReplaceDetector(replaced, substitute, keylog);
          } else {
            //irregular paste activity.
            AutoCorrectionDector(keylog);
          }
        }

        if (start == end) {
          // irregular replace activity
          AutoCorrectionDector(keylog);
        }
      }
    }

    if (change == -1) {
      let start = parseInt(startSelect.slice(-2, -1));
      let end = parseInt(endSelect.slice(-2, -1));

      let index = parseInt(keylog.CursorPosition.slice(-2, -1));
      let textinfo = String(keylog.TextContent.slice(-2, -1));

      if (String(keylog.Output.slice(-2, -1)) == "Delete" && start == end) {
        deleted = textinfo[index];
        textNow = textNow.slice(0, index) + textNow.slice(index + 1);
      } else {
        deleted = textinfo[index - 1]; // curosor position and character position are different
        textNow = textNow.slice(0, index - 1) + textNow.slice(index);
      }

      if (textNow == keylog.TextContent.slice(-1)) {
        // backspace or delete to remove just one character
        keylog.TextChange.push(deleted);
        keylog.Activity.push("Remove/Cut");
      } else {
        if (start < end) {
          // regular replace activity: replace n characters with n-1 new characters
          textNow =
            String(keylog.TextContent.slice(-2, -1)).slice(0, start) +
            String(keylog.TextContent.slice(-1)).substr(
              start,
              end + change - start
            ) +
            String(keylog.TextContent.slice(-2, -1)).slice(
              end,
              String(keylog.TextContent.slice(-2, -1)).length
            );

          replaced = String(keylog.TextContent.slice(-2, -1)).substr(
            start,
            end - start
          );
          substitute = String(keylog.TextContent.slice(-1)).substr(
            start,
            end + change - start
          );

          if (textNow == keylog.TextContent.slice(-1)) {
            ReplaceDetector(replaced, substitute, keylog);
          } else {
            //irregular paste activity.
            AutoCorrectionDector(keylog);
          }
        }

        if (start == end) {
          AutoCorrectionDector(keylog);
        }
      }
    }

    if (change < -1) {
      let start = parseInt(startSelect.slice(-2, -1));
      let end = parseInt(endSelect.slice(-2, -1));

      let rangeStart = parseInt(startSelect.slice(-2, -1));
      let rangeEnd = parseInt(endSelect.slice(-2, -1));

      let textinfo = String(keylog.TextContent.slice(-2, -1));
      deleted = textinfo.slice(rangeStart, rangeEnd);

      textNow = textNow.slice(0, rangeStart) + textNow.slice(rangeEnd);

      if (textNow == keylog.TextContent.slice(-1)) {
        // delete more than 1 characters
        keylog.TextChange.push(deleted);
        keylog.Activity.push("Remove/Cut");
      } else {
        if (start < end) {
          // regular replace activity: replace n characters with n-m (m<n) new characters
          textNow =
            String(keylog.TextContent.slice(-2, -1)).slice(0, start) +
            String(keylog.TextContent.slice(-1)).substr(
              start,
              end + change - start
            ) +
            String(keylog.TextContent.slice(-2, -1)).slice(
              end,
              String(keylog.TextContent.slice(-2, -1)).length
            );

          replaced = String(keylog.TextContent.slice(-2, -1)).substr(
            start,
            end - start
          );
          substitute = String(keylog.TextContent.slice(-1)).substr(
            start,
            end + change - start
          );

          if (textNow == keylog.TextContent.slice(-1)) {
            ReplaceDetector(replaced, substitute, keylog);
          } else {
            //irregular paste activity.
            AutoCorrectionDector(keylog);
          }
        }

        if (start == end) {
          AutoCorrectionDector(keylog);
        }
      }
    }
  } else {
    keylog.TextChange.push("NoChange");
    keylog.Activity.push("Nonproduction");
  }
}

//////// this function is used to handle irregular replace activities -- or detect auto correction or completion activities
function AutoCorrectionDector(keylog) {
  oldText = String(keylog.TextContent.slice(-2, -1));
  newText = String(keylog.TextContent.slice(-1));

  if (oldText != newText) {
    oldTextLen = oldText.length;
    newTextLen = newText.length;

    // Find the index at which the change ended (relative to the end of the string)
    let e = 0; //use current cursor position
    while (
      e < oldTextLen &&
      e < newTextLen &&
      oldText[oldTextLen - 1 - e] == newText[newTextLen - 1 - e]
    ) {
      e++;
    }
    // the change end of old text and new text
    oldTextChangeEnd = oldTextLen - e;
    newTextChangeEnd = newTextLen - e;

    // find the index at which the change started -- to avoid processing too much information, limit the numer of changed characters to 100
    let s;
    if (oldTextLen - e <= 100 || newTextLen - e <= 100) {
      s = 0;
      while (s < oldTextLen && s < newTextLen && oldText[s] == newText[s]) {
        s++;
      }
    } else {
      s = Math.min(oldTextLen - e, newTextLen - e);
      while (s < oldTextLen && s < newTextLen && oldText[s] == newText[s]) {
        s++;
      }
    }

    replaced = oldText.slice(s, oldTextChangeEnd);
    substitute = newText.slice(s, newTextChangeEnd);
    if (replaced.length > 0 && substitute.length > 0) {
      if (replaced != substitute) {
        keylog.TextChange.push(`${replaced} => ${substitute}`);
        keylog.Activity.push("AutoCorrectionReplace");
      } else {
        keylog.TextChange.push("NoChange");
        keylog.Activity.push("Nonproduction");
      }
    } else if (replaced.length > 0 && substitute.length == 0) {
      keylog.TextChange.push(replaced);
      keylog.Activity.push("AutoCorrectionRemove/Cut");
    } else if (replaced.length == 0 && substitute.length > 0) {
      keylog.TextChange.push(substitute);
      keylog.Activity.push("AutocorrectionPaste");
    } else {
      keylog.TextChange.push("NoChange");
      keylog.Activity.push("Nonproduction");
    }

    // textNow adjustment
    textNow = keylog.TextContent.slice(-1);
    // cursorPosition adjustment
    thisPosition = newTextChangeEnd;
    keylog.CursorPosition.pop(); // remove the last value
    keylog.CursorPosition.push(thisPosition); // add the new position
  } else {
    textNow = keylog.TextContent.slice(-1);

    keylog.TextChange.push("NoChange");
    keylog.Activity.push("Nonproduction");
  }
}

// this function is used to detect replace events in different conditions
function ReplaceDetector(replaced, substitute, keylog) {
  if (replaced.length > 0 && substitute.length > 0) {
    if (replaced != substitute) {
      keylog.TextChange.push(`${replaced} => ${substitute}`);
      keylog.Activity.push("Replace");
    } else {
      keylog.TextChange.push("NoChange");
      keylog.Activity.push("Nonproduction");
    }
  } else if (replaced.length > 0 && substitute.length == 0) {
    keylog.TextChange.push(replaced);
    keylog.Activity.push("Remove/Cut");
  } else if (replaced.length == 0 && substitute.length > 0) {
    keylog.TextChange.push(substitute);
    keylog.Activity.push("Paste");
  } else {
    keylog.TextChange.push("NoChange");
    keylog.Activity.push("Nonproduction");
  }
}

window.addEventListener("DOMContentLoaded", keylog.init);

////////////////////////////////////////////////////////////////////////////////////////////////////////

//post data to the server when participant hits submit button

button.onclick = () => {
  submit = 0; // to denote that the submit button is clicked.

  if (EventID == 0) {
    keylog.FinalProduct.push(myElement.value); // record the final product

    keylog = {
      PartitionKey: [0],
      RowKey: [0],
      TaskOnSet: [0],
      TaskEnd: [0],
      EventID: [0],
      EventTime: [0],
      Output: ["NA"],
      CursorPosition: [0],
      TextContent: [0],
      TextChange: ["NoChange"],
      Activity: ["Nonproduction"],
      FinalProduct: ["The author wrote nothing."],
    };

    //post the data to the serve and lead to the next page????
  } else {
    keylog.TaskOnSet.push(taskonset); //record task onset time

    ///// adjust the keylog data
    //cursorposition adjustment
    keylog.TextContent.push(myElement.value);

    let startPosition = myElement.selectionStart;
    let endPosition = myElement.selectionEnd;
    if (startPosition == endPosition) {
      keylog.CursorPosition.push(startPosition);
      startSelect.push(startPosition); // faciliate the calculation below
      endSelect.push(endPosition);
    } else {
      keylog.CursorPosition.push(endPosition);
      startSelect.push(startPosition); // faciliate the calculation below
      endSelect.push(endPosition);
    }
    /////// use a customized function to detect and record different activities and the according text changes these activities bring about
    ActivityDetector(keylog);

    //Add PartitionKey
    keylog.PartitionKey.push(userId);

    //Textchange and Activity adjustment
    keylog.TextChange.shift();
    keylog.Activity.shift();

    // cursor information adjustment
    keylog.CursorPosition.shift();

    let d_end = new Date();
    taskend = d_end.getTime();
    keylog.TaskEnd.push(taskend); //record task end time

    keylog.FinalProduct.push(myElement.value); // record the final product

    //post the data to the serve and lead to the next page
    let keylog_eedi = {
      PartitionKey: keylog.PartitionKey.toString(),
      RowKey: keylog.RowKey.join(),
      EventID: keylog.EventID.join(),
      EventTime: keylog.EventTime.join(),
      Output: keylog.Output.join("<=@=>"),
      CursorPosition: keylog.CursorPosition.join(),
      TextChange: keylog.TextChange.join("<=@=>"),
      Activity: keylog.Activity.join("<=@=>"),
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keylog_eedi),
    };
    fetch("/", options)
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        console.log(data);
        console.log(keylog_eedi);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
      });

    //empty keylog
    keylog.PartitionKey = [];
    keylog.RowKey = [];
    keylog.EventID = [];
    keylog.EventTime = [];
    keylog.FinalProduct = [];
    keylog.CursorPosition = [];
    keylog.Output = [];
    keylog.TaskEnd = [];
    keylog.TaskOnSet = [];
    keylog.TextChange = [];
    keylog.Activity = [];
    keylog.TextContent = [];
    RowN += 100; // RowKey should be unique
    EventID = 0;
  }
};
