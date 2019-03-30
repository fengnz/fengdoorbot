function debugTelegram(){
  debug();
}
function postTelegram(payload) {

  if (payload.text && payload.text.length > "4096") {
    payload.text = payload.text.substr(0, 4096);
  }

  var data = {
    'contentType': 'application/json',
    "method": "post",
    "payload": JSON.stringify(payload)
  };

  mongo.insert(Const.toTelegram, payload);
  var response;
  var res;
  try {
    response = UrlFetchApp.fetch("https://api.telegram.org/bot" + Const.botToken + "/", data);
    res = JSON.parse(response);
    mongo.insert("telegram-response", res);
    return res;
  } catch (e) {
    var errorLog = {
      error: e,
      payload: payload,
    };
    mongo.insert(Const.logColl, errorLog);
    return {error: errorLog};
  }
}


function TestAPI(){

  var payload;
  var chatId = '539065210';
  payload = {
    "method": "sendMediaGroup",
    "chat_id": chatId,
    "media": [{
        "type": "photo",
        "media": "AgADBQADU6gxG4Hq0VSMR2yZkv7v5WQp1TIABIOh1Tq7OoMwlaYDAAEC"    
        },{
        "type": "photo",
        "media": "AgADBQADU6gxG4Hq0VSMR2yZkv7v5WQp1TIABFJCWxiLlftVlqYDAAEC"    
        }
      ]
  };
  
  
  
  
  postTelegram(payload);
}