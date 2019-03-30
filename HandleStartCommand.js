function debugStart() {
  debug();
}
function handleStartCommand(body, paras, origParas) {
  var payload = {
    "method": "sendMessage",
    "chat_id": body.message.chat.id,
    "text": "",
    "parse_mode": "markdown",
    "disable_web_page_preview": true,
  };

  if (isPrivate(body)) {
    if (paras[1]) {
      return handleStartToken(body, paras, origParas);
    }

    payload.text += "本机器人要加入群中才能工作";
    payload.text += "\n";
    var buttons = [];
    var button1 = {
      text: "添加本机器人到群中",
      url: "https://telegram.me/" + Const.myName + "?startgroup=true"
    };

    buttons.push(button1);

    var inlineKeyboardMarkup = generateInlineKeyboardMarkup(buttons, 3);

    payload.reply_markup = inlineKeyboardMarkup;

    return payload;
  } else {
    paras[0] = "/help";
    return handleHelpCommand(body, paras, origParas);

  }
}


function handleStartToken(body, paras, origParas) {
  var share =  getShareObject(body);
  var payload = share.payload;
  var chat = share.chat;

  var token=paras[1];



  origParas = token.split('_-_');
  paras = token.toLowerCase().split('_-_');



  payload.text += token;
  return payload;
}