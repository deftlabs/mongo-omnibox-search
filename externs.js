/* This file is used as input to the Closure compiler service to declare
 * functions that are used by the extensions but which are external to
 * the extension, so that those functions do not get elided or renamed. */
var chrome = {};
chrome.tabs = {};
chrome.tabs.getSelected = function(a, b){};
chrome.tabs.update = function(tabid, metadata){};
chrome.omnibox = {};
chrome.omnibox.setDefaultSuggestion = function(obj){};
chrome.omnibox.onInputStarted = {};
chrome.omnibox.onInputStarted.addListener = function(callback){};
chrome.omnibox.onInputCancelled = {};
chrome.omnibox.onInputCancelled.addListener = function(callback){};
chrome.omnibox.onInputEntered = {};
chrome.omnibox.onInputEntered.addListener = function(callback){};
chrome.omnibox.onInputChanged = {};
chrome.omnibox.onInputChanged.addListener = function(callback){};

var JSON = {};
JSON.stringify = function(obj){};
JSON.parse = function(str){};

