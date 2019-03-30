function debugInlineKeyboard(){
  debug();
}

function generateInlineKeyboardMarkup(buttons, numberOfButtonsPerRow) {
  var inlineKeyboardMarkup = {};
  inlineKeyboardMarkup.inline_keyboard = [];
  var count = 0;
  for (var i = 0; i < buttons.length / numberOfButtonsPerRow; i++) {
    var keyboardRow = [];
    for (var j = 0; j < numberOfButtonsPerRow; j++) {
      var button = buttons[i * numberOfButtonsPerRow + j];
      var keyboardButton = button;
      count++;
      keyboardRow.push(keyboardButton);
      if (count >= buttons.length) {
        break;
      }
    }
    inlineKeyboardMarkup.inline_keyboard.push(keyboardRow);
  }
  return inlineKeyboardMarkup;
}