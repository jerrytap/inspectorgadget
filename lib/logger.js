var util = require('util');
var stackTrace = require('stack-trace');

var Logger = {};

Logger.moreContext = 'more context';

logMessage = function logMessage(level, msg, extraContext, trace) {
  var stringifiedContext = extraContextToString(extraContext);
  if(stringifiedContext && trace) {
    return console.log(util.format('%s: %s, %s \n %s\n', level, msg, stringifiedContext, getAllContext(trace)));
  }
  if(stringifiedContext && !trace){
    return console.log(util.format('%s: %s, %s\n', level, msg, stringifiedContext));
  }
  if(!stringifiedContext && trace){
    return console.log(util.format('%s: %s \n %s\n', level, msg, getAllContext(trace)));
  }
  console.log(util.format('%s: %s\n', level, msg));
};

function extraContextToString(extraContext){
  if(extraContext === null || extraContext === undefined){
    return extraContext;
  }
  if(extraContext instanceof (String)){
    return extraContext;
  }
  if(extraContext instanceof (Error)){
    return util.format("\n %s", extraContext.stack);
  }
  return JSON.stringify(extraContext);
}


var getAllContext = function getAllContext(trace){
  var allContextCalls = '';
  if(trace){
    for(var i = 0; i < trace.length; i++){
      try {
        allContextCalls += getContextFromReceiver(trace[i].receiver);
      }catch(e){
        allContextCalls += "An error occured trying to get context " + e.message;
      }
    }
  }
  return allContextCalls;
};

function getContextFromReceiver(receiver){
  var allContextCalls = '';

  if(receiver && receiver['getContext']){
    allContextCalls += util.format("\n%s", getProperName(receiver));
    allContextCalls += util.format("\n%s", receiver.getContext());
  }
  /*else{
    for (var property in receiver) {
      if (receiver.hasOwnProperty(property)) {
        var objecttype = typeof(receiver[property]);
        if(objecttype !== 'object' && objecttype !== 'function'){
          allContextCalls += util.format("\n%s==%s", property, receiver[property])
        }
      }
    }
  }*/
  return allContextCalls;
}


function getProperName(receiver){
  var properName = receiver.toString();
  if(receiver.constructor && receiver.constructor.name){
    properName = receiver.constructor.name;
  }

  if(properName === 'Function'){
    if(receiver.name){
      properName = receiver.name;
    }else if(receiver.constructor){
      properName = receiver.constructor;
    }
  }
  if(properName === "Object" && receiver.constructor){
    properName = receiver.constructor;
  }
  return properName;
}

var debug = function debug (msg, extraContext) {
  logMessage("DEBUG", msg, extraContext);
};

var info = function info (msg, extraContext) {
  logMessage("INFO", msg, extraContext);
};

var warn = function warn (msg, extraContext) {
  var trace = stackTrace.get();
  logMessage("WARNING", msg, extraContext, trace);
};

var error = function error (msg, extraContext) {
  var trace = stackTrace.get();
  logMessage("ERROR", msg, extraContext, trace);
};

Logger.debug = debug;
Logger.info = info;
Logger.warn = warn;
Logger.error = error;
module.exports = Logger;