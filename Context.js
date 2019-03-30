function setContextCommand (userId, command) {
    var query = {userId: userId};
    mongo.set(Const.contextColl, "filter=" + JSON.stringify(query), {command: command});
}

function setContextDrawId (userId, drawId) {

}

function getContext(userId) {
    var query = {userId: userId};
    var result = mongo.get(Const.contextColl, "filter=" + JSON.stringify(query));
    if (result && result.length > 0){
        return result[0];
    }
    return null;
}

function setContext(context) {
    var query = {userId: context.userId};
    // Remove old context
    mongo.remove(Const.contextColl, "filter=" + JSON.stringify(query));
    // insert new contxt
    mongo.insert(Const.contextColl, context);
}