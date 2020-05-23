function debugMessage(){
  debug();
}

function handleMessage(body){
  var payload;
  var chatId = body.message.chat.id;
  payload = {
    "method": "sendMessage",
    "chat_id": chatId,
    "text": "",
    "disable_web_page_preview": true,
  };

  if (body.message.new_chat_member) {
    // mongo.insert(Const.fromTelegram, body);
    payload = handleNewMember(body);
    return payload;
  }

  if (body.message.text) {
    var isMyMessage = checkIsMyMessage(body);
    if (!isMyMessage) {
      return null;
    }
    return handleMessageText(body);
  }

  return payload
}