function debugDelMsgCommand() {
  debug();
}

function handleDelMsgCommand(body, paras, origParas) {

  var share =  getShareObject(body);
  var payload = share.payload;
  var chat = share.chat;
  var callback_query_id = share.callback_query_id;

  var payloads = [];

  if (chat.type.indexOf("group") < 0 && chat.type.indexOf("channel") < 0) {
    payload.text += "请将本机器人加入您的群中再使用此命令";
    return payload; 
  }


  if (!allowed(body, paras, origParas)) {
    payload += "对不起，只有管理可以使用此命令！";
    addDeleteMeButton(payload);
    return payload;
  }

  if (paras[1]) {
    var messageId = paras[1];
    messageId = messageId.replace(/https:\/\/t.me\/[^/]*\//i, "");
    payload = {
      "method": "deleteMessage",
      "message_id": messageId,
      "chat_id": chat.id
    };

    return payload;
  }

  return null;


}