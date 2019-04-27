function debugNoCommandAndAlias() {
  debug();
}
function handleNoCommandAndAlias(body, origMessageText) {
  //Handle Alias
  if (body.message.reply_to_message) {
    if (body.message.reply_to_message.from.id == Const.myId) {
      // This message is replied to me, but it's not a command
      if (origMessageText.indexOf('/') != 0) {
        var reply_to_message_text = body.message.reply_to_message.text;
        if (reply_to_message_text.indexOf('明白，要设置自定义欢迎词') == '0') {
          origMessageText = '/admin welcome customtext ' + origMessageText;
        }
      }
    }
  }
  origMessageText = origMessageText.replace(/^\/allowme( |$)/i, "/notrobot allowme");
  origMessageText = origMessageText.replace(/^\/帮助( |$)/i, "/help ");
  return origMessageText;
}