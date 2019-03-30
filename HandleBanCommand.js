function debugBanCommand() {
  debug()
}

function handleBanCommand(body, paras, origParas) {

  var share =  getShareObject(body);
  var payload = share.payload;
  var chat = share.chat;
  var callback_query_id = share.callback_query_id;

  var payloads = [];

  if (chat.type.indexOf("group") < 0) {
    payload.text += "请将本机器人加入您的群中再使用此命令";
    return payload; 
  }

  var targetUser = origParas[1];

  var isAdmin = isAdminOrCreator(share.from.id, share.chat.id);

  if (isAdmin) {
    var payload2 = {
      "method": "restrictChatMember",
      "chat_id": share.chat.id,
      "user_id": targetUser,
      "can_send_messages": false,
      "can_send_media_messages": false,
      "can_send_other_messages": false,
      "can_add_web_page_previews": false,
    };
    var payload4 = {
      "method": "kickChatMember",
      "chat_id": share.chat.id,
      "user_id": targetUser,
    };
    payloads.push(payload4);

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
  return payloads;
}