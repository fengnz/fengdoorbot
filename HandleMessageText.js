function debugMessageText(){
  debug();
}


function handleMessageText(body) {

  var payload = {
    "method": "sendMessage",
    "chat_id": body.message.chat.id,
    "text": "",
    "parse_mode": "markdown",
    "disable_web_page_preview": true,	
  };


  var regex = new RegExp("(^/[^ ]+)@" + Const.myName + "", "i");
  var origMessageText = body.message.text.replace(regex, '$1');

    // Covert a not command to command
    origMessageText = handleNoCommandAndAlias(body, origMessageText);

    if (origMessageText.indexOf("/") !== 0) {
      //Check context and convert it to a command
      if (isPrivate(body)) {
        if (body.message && body.message.from) {
          var context = getContext(body.message.from.id);
          if (context && context.command) {
            var command = context.command;
            origMessageText = '/' + command.split(':').join(' ') + ' ' + origMessageText;
          } else {
            return null;
          }
        } else {
          return null;
        }

      } else {
        // Not a command 
        return null;
      }
    }

    body.message.text = origMessageText;
    var messageText = origMessageText.toLowerCase();

    var commands = [
      "/draw",
      "/admin",
      "/allowme",
      "/help",
      "/start",
      "/initdb",
      "/delmsg",
    ];

    var paras = messageText.trim().split(" ");
    // remove empty strings
    paras = paras.filter(function(para){
      if (para){
        return true;
      }
    });

    var command = paras[0];
    if (!command) {
      return;
    }

    // remove ! from command, a commamnd start with /! is from feng
    command = command.replace("!", "");
    if (!commands.includes(command)) {
      // not a command 
      return null;
    }

    mongo.insert(Const.fromTelegram, body);

    
    var origParas = origMessageText.trim().split(" ");
    // remove empty strings
    origParas = origParas.filter(function(para){
      if (para){
        return true;
      }
    });

      if (!allowed(body, paras, origParas)) {
        payload.text = "对不起，您无权执行此操作,";
        payload.text += "喜欢";
        payload.text += "[本bot](https://telegram.me/" + Const.myName + ")";
        payload.text += "的话";
        payload.text += "[加我到您群中](https://telegram.me/" + Const.myName + "?startgroup=true)!";
        addDeleteMeButton(payload);
        return payload;
      }

    
    if (command.indexOf("/jump") == 0) {
      var foundMessageId = paras[1];
      if (isNaN(foundMessageId)) {
        payload.text = "消息ID必需是数";
        return payload;
      }

      payload.reply_to_message_id = foundMessageId;
      payload.text = "点击以上引用可跳转到原消";

      return payload;
    }

    if (command.indexOf("/admin") == 0) {
      return handleAdminCommand(body, paras, origParas);
    }

    if (command.indexOf("/initdb") == 0) {
      return handleInitDBCommand(body, paras, origParas);
    }



    if (command.indexOf("/notrobot") == 0) {
      return handleNotRobotCommand(body, paras, origParas);
    }

    if (command.indexOf("/ban") == 0) {
      return handleBanCommand(body, paras, origParas);
    }

    if (command.indexOf("/pinmessage") == 0) {
      return handlePinMessageCommand(body, paras, origParas);
    }

    if (command.indexOf("/gpset") == 0) {

      if (body.message.from.id !== 539065210) {
        payload += "此命令极其危险，暂时只有峰哥可以使用";
        return payload;
      }

      if (paras[2]) {
        var field = origParas[1];
        var value = origParas.splice(2).join(" ");
        
        if (gpSetFieldValue(body.message.chat, field, value)) {
          payload.text = "设置成功";
        } else {
          payload.text = "设置失败";
        }
        return payload;
      }

      return null;
      
    }
    if (command.indexOf("/delmsg") == 0) {

     return handleDelMsgCommand(body, paras, origParas);
      
    }
    if (command.indexOf("/help") == 0) {
      return handleHelpCommand(body, paras, origParas);
    }
    if (command.indexOf("/start") == 0) {
      return handleStartCommand(body, paras, origParas);
    }

    return null;
}
