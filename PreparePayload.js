function preparePayload(body) {
  if (body.message) {
    return handleMessage(body);
  } else if (body.callback_query) {
    // mongo.insert("from-telegram", body);
    return handleCallback(body);
  }
}