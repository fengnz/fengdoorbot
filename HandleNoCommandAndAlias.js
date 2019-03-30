function debugNoCommandAndAlias() {
  debug();
}
function handleNoCommandAndAlias(body, origMessageText) {
  //Handle Alias
  origMessageText = origMessageText.replace(/^\/allowme( |$)/i, "/notrobot allowme");
  origMessageText = origMessageText.replace(/^\/帮助( |$)/i, "/help ");
  return origMessageText;
}