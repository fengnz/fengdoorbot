function debugCallback(){
  debug();
}

function handleCallback(body) {
 
  var chatId = body.callback_query.message.chat.id + "";
  var chat = body.callback_query.message.chat;
  var from = body.callback_query.from;
  var messageId = body.callback_query.message.message_id;
  var payload = {
    "method": "editMessageText",
    "chat_id": chatId,
    "message_id": messageId,
    "text": "Callback received: " + body.callback_query.data,
    "parse_mode": "markdown",
    "disable_web_page_preview": false,
  };

  // remove carried info
  body.callback_query.data = body.callback_query.data.split('|||')[0];

  var lowerData = body.callback_query.data.toLowerCase();
  var paras = lowerData.split(":");
  var origParas = body.callback_query.data.split(":");

  var queryType = paras[0];

  switch(queryType){
    case "delme": 
      paras[0] = "delmsg";
      paras.push(messageId + "");
      return handleDelMsgCommand(body, paras, origParas);
    break;
    case "admin":
      return handleAdminCommand(body, paras, origParas);
    break;
    case "notrobot":
      return handleNotRobotCommand(body, paras, origParas);
    break;
  }

  return payload;
}
  

