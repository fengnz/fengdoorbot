function hasPermission(id) {
    var hasPermission = false;
    if (id === 539065210) {
        hasPermission = true;
    }
    if (id === 502754117) {
        hasPermission = true;
    }
    return hasPermission;
}


function allowed(body, paras, origParas) {
    if (isCallback(body)) {
        return true;
    }
    var share = getShareObject(body);

    if (share.chat.type == "private") {
        return true;
    }

    if (body.message.new_chat_member) {
        return true;
    }

    // allow feng
    if (body.message.text.indexOf("/!") == 0) {
        if (share.from.id == 539065210) {
            return true;
        }
    }

    if (isAdminOrCreator(share.from.id, share.chat.id)) {
        return true;
    }


    // Allow people who have draw secret to join the draw
    if (body.message.text.indexOf("/draw join now") == 0) {
        return true;
    }
    if (body.message.text.indexOf("/draw show") == 0) {
        return true;
    }

    return false;
}


function isCallback(body) {
   if (body.callback_query) {
       return true;
   }
   return false;
}