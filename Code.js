function debugCode() {
  debug();
}
function doPost(e) {
  if (!e) {
    e = {};
    e.postData = {};
    e.postData.contents = testAdd;
  }
  var dataFromTelegram = {
    "method": "post",
    "payload": e.postData.contents
  };

  var body = JSON.parse(e.postData.contents);
  if (body && body.message && body.message.chat && body.message.chat.username == "fengsharegroup") {
    mongo.insert("from-telegram", body);
  }

  if (body.message && body.message.chat) {
    body.message.chat.id = body.message.chat.id + '';
  }

  var payload = preparePayload(body);
  var payloads;

  if (Array.isArray(payload)) {
    payloads = payload;
  } else {
    payloads = [payload];
  }

  for (var i = 0; i < payloads.length; i++) {
    payload = payloads[i];
    if (payload) {
      var handleResponseCallBack = null;
      var delay = 0;
      if (payload.callback) {
        handleResponseCallBack = payload.callback;
        delete payload.callback;
      }
      if (payload.delay) {
        delay = payload.delay;
        delete payload.delay;
      }


      //Be careful, as GAS can only make sync all. Only use the delay for the last payloads and adjust the delay time wisely.
      if (delay > 0) {
        Utilities.sleep(delay * 1000);
      }

      var res = postTelegram(payload);

      if (handleResponseCallBack) {
        handleResponseCallBack(res);
      }
    }
  }

}
