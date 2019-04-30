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

  var targetUser;

  var theUser;

  if (origParas.length > 1) {
    targetUser = origParas[1];
  } else {
    if (body.message && body.message.reply_to_message) {
      targetUser = body.message.reply_to_message.from.id;
      theUser = body.message.reply_to_message.from;
    }
  }

  if (targetUser) {
    var isAdmin = isAdminOrCreator(share.from.id, share.chat.id);
    if (isAdmin) {
      var payload4 = {
        "method": "kickChatMember",
        "chat_id": share.chat.id,
        "user_id": targetUser,
      };
      payloads.push(payload4);

      if (theUser) {
        payload.text += getMentionName(share.from);
        payload.text += "踢了";
        payload.text += getMentionName(theUser);
        payloads.push(payload);
      }
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

  return payloads;
}