function debugCommons(){
  var date = getChineseDateString(new Date());
  console.log(date);

}


// Use this method to sort a array randomly
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function checkIsMyMessage(body){
  var text = body.message.text;
  if (text) {
    var paras = text.split(" ");
    if (paras[0] && paras[0].indexOf("@") >= 0){
      if  (paras[0].toLowerCase().indexOf(Const.myName) >= 0){
        return true;
      }
      return false;
    }
  }
  return true;
}

function isAdminOrCreator(userId, chatId) {
  payload = {
    "method": "getChatMember",
    "chat_id": chatId,
    "user_id": userId
  };

  // allow feng
  if (userId == 539065210) {
    return true;
  }

  var chatMember = postTelegram(payload);

  if (chatMember && chatMember.ok === true) {
    if (chatMember.result.status == "creator") {
      return true;
    }

    if (chatMember.result.status == "administrator") {
      return true;
    }
  }
  return false;
}

function isValidChannelId(id){
  return /^[\dA-z_-]{24}$/.test(id);
}
function isValidTelegramChatId(id){
  var isValidId = false;
  if (isNaN(id)) {
    if (id.indexOf("@") != 0) {
    } else {
      isValidId = true;
    }
  } else {
    // Number is valid Id
    if (/[\d-]{8,}/.test(id + "")) {
      isValidId = true;
    } else {
    }
  }
  return isValidId;
}

function getShareObject(body) {
  var payload;
  var from;
  var chat;
  var messageId;
  var callback_query_id;
  var origText;
 var share = {};
  // use editMessage method instead if it's a callback 
  if (body.callback_query) {
    chat = body.callback_query.message.chat;
    chat.id = chat.id + "";
    messageId = body.callback_query.message.message_id;
    from = body.callback_query.from;
    callback_query_id = body.callback_query.id;
    origText = body.callback_query.message.text;
    payload = {
      "method": "editMessageText",
      "chat_id": chat.id,
      "message_id": messageId,
      "text": "",
      "parse_mode": "markdown",
      "disable_web_page_preview": true,
    };
  } else {
    from = body.message.from;
    chat = body.message.chat;
    chat.id = chat.id + "";
    messageId = body.message.message_id;
    origText = body.message.text;
    payload = {
      "method": "sendMessage",
      "chat_id": chat.id,
      "text": "",
      "parse_mode": "markdown",
      "disable_web_page_preview": true,
    };
    
      if (body.message.new_chat_member) {
    share.new_chat_member = body.message.new_chat_member;
  }

  }


 
  share.payload = payload;
  share.from = from;
  share.chat = chat;
  share.messageId = messageId;
  share.callback_query_id = callback_query_id;
  share.origText = origText;

  return share;
}

function extractVideoIds(text) {
  var VideoIds = text.replace(/https:\/\/youtu.be\//gi, "");
  return VideoIds;
}
function escapeMarkDown(toEscapeMsg) {
  var escapedMsg = toEscapeMsg
  .replace(/_/g, "\\_")
  .replace(/\*/g, "\\*")
  .replace(/\[/g, "\\[")
  .replace(/\]/g, "\\]")
  .replace(/`/g, "\\`");
    return escapedMsg;

}

function addDeleteMeButton(payload) {
  var buttons = [];
  var button1 = {
    text: "点此删除本消息",
    callback_data: "delme" 
  };

  buttons.push(button1);

  var inlineKeyboardMarkup = generateInlineKeyboardMarkup(buttons, 3);

  payload.reply_markup = inlineKeyboardMarkup;
}

function extractChannelId(text) {
  var channelId = text.replace(/https:\/\/www.youtube.com\/channel\//i, "");
  return channelId;
}

function getGroupName(chat){
  if(chat.username) {
    return getMarkDownGroupUrl(chat.title, chat.username);
  }
  return escapeMarkDown(chat.title);
}
function getMentionName(user) {
  var mentionName = "";

  var name = getName(user);
  if (!name) {
    name = "神秘人";
  }
  mentionName = getMarkDownUserUrl(name, user.id);
  return mentionName;
}

function getMarkDownGroupUrl(title, chatUserName) {
  return getMarkDownUrl(title, "https://t.me/" + chatUserName);
}
function getMarkDownUserUrl(userName, userId) {
  return getMarkDownUrl(userName, "tg://user?id=" + userId);
}

function getMarkDownUrl(text, url) {
  return "[" + escapeMarkDown(text) + "](" + url + ")";
}

function getChannelUrlById(id) {
  return "https://www.youtube.com/channel/" + id;
}

function getChineseDateString(nzTime){

  var utcTime = new Date(nzTime.getTime() + nzTime.getTimezoneOffset() * 60000);
  var chinaTime = new Date(utcTime.getTime() + 8 * 60 * 60 * 1000);

  var year = chinaTime.getFullYear()+'年';
  var month = chinaTime.getMonth()+1+'月';
  var date = chinaTime.getDate()+'日';
  var hours = chinaTime.getHours() + '时';
  var minutes = chinaTime.getMinutes() + '分';
  return [year,month,date, hours,minutes].join('');
}

function getName(user) {
  var name = user.first_name;
  if (user.last_name) {
    name += " " + user.last_name;
  }

  return name;
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}



function pad(pad, str, padLeft) {
  if (typeof str === 'undefined') 
    return pad;
  if (padLeft) {
    return (pad + str).slice(-pad.length);
  } else {
    return (str + pad).substring(0, pad.length);
  }
}



function isPrivate(body) {
  var share =  getShareObject(body);
  var chat = share.chat;
  if (chat.type === "private") {
    return true;
  }
  return false;
}