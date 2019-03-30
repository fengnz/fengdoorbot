function debugPinMessageCommand() {
  debug()
}

function handlePinMessageCommand(body, paras, origParas) {

  var share =  getShareObject(body);
  var payload = share.payload;
  var chat = share.chat;
  var callback_query_id = share.callback_query_id;

  var payloads = [];

  if (chat.type.indexOf("group") < 0) {
    payload.text += "请将本机器人加入您的群中再使用此命令";
    return payload; 
  }

  var targetMessage = origParas[1];

  var isAdmin = isAdminOrCreator(share.from.id, share.chat.id);

  if (isAdmin) {
    var payload2 = {
      "method": "pinChatMessage",
      "chat_id": share.chat.id,
      "message_id": parseInt(targetMessage)
    };

    return payload2;

  } else {
    if (body.callback_query) {
      var answerCallBackQueryPayload = {
        "method": "answerCallbackQuery",
        "callback_query_id": callback_query_id,
        "text": "只有本群管理才可以使用此命令",
      };
      return answerCallBackQueryPayload;
    } else {
      payload.text += "只有本群管理才可以使用此命令";
      return payload;
    }
  }

}