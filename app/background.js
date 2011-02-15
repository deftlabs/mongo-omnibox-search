// == Helper Prototype Extensions ==
Storage.prototype.setObject = function(key, value) { this.setItem(key, JSON.stringify(value)); };

Storage.prototype.getObject = function(key) { return JSON.parse(this.getItem(key)); };

String.prototype.startsWith = function(str) {
    if (str.length > this.length) { return false; };
    return (String(this).substr(0, str.length) == str);
};

String.prototype.endsWith = function(str) {
    if (str.length > this.length) {
        return false;
    }
    return (String(this).substr(this.length - str.length, this.length) == str);
};

String.prototype.encode = function() { return encodeURIComponent(String(this)); };

String.prototype.strip = function() {
    var str = String(this);
    if (!str) { return ""; };
    var startidx=0;
    var lastidx=str.length-1;
    while ((startidx<str.length)&&(str.charAt(startidx)==' ')) { startidx++; };
    while ((lastidx>=startidx)&&(str.charAt(lastidx)==' ')) { lastidx--; };
    if (lastidx < startidx) { return ""; };
    return str.substring(startidx, lastidx+1);
};

// == Autocompletion Chrome Extension ==
(function(){
    // Issue a new GET request
    function xhr(url, ifexists, ifnotexists, retry_interval) {
        var retry_time = retry_interval || 5;
        var req = new XMLHttpRequest();
        console.log("Fetching: " + url);
        req.open("GET", url);
        req.onreadystatechange=function(){
            if (req.readyState == 4){
                var status=req.status;
                if ((status == 200) || (status == 301) || (status == 302)) {
                    ifexists(url, req);
                } else {
                    ifnotexists(url, req);
                    setTimeout(function() { xhr(url, ifexists, ifnotexists, retry_time + 5).send(null); }, retry_time);
                }
            }
        };
        return req;
    };
    
    // Navigates to the specified URL.
    function nav(url) {
        console.log("Navigating to: " + url);
        chrome.tabs.getSelected(null, function(tab) { chrome.tabs.update(tab.id, {url: url}); });
    };
    
    // Sets the the default styling for the first search item
    function setDefaultSuggestion(text) {
        /*
        if (text) {
            //chrome.omnibox.setDefaultSuggestion({"description": "<url><match>[Name]</match></url> " + text});
        } else {
            //chrome.omnibox.setDefaultSuggestion({"description": "<url><match>[Name]</match></url>"});
        }
        */
    };
    
    // Prefetch necessary data
    chrome.omnibox.onInputStarted.addListener(function(){
        console.log("Input started");
        setDefaultSuggestion('');
        
        // TODO: Prefetch data here
    });
    
    chrome.omnibox.onInputCancelled.addListener(function() {
        console.log("Input cancelled.");
        setDefaultSuggestion('');
    });
    
    setDefaultSuggestion('');
    
    chrome.omnibox.onInputChanged.addListener(function(text, suggest_callback) {
        setDefaultSuggestion(text);
        if (!text) { return; };
        
        var kMaxSuggestions = 10;
        var suggestions = [];
        var stripped_text = text.strip();
        if (!stripped_text) {
            return;
        }
        
        var qlower = stripped_text.toLowerCase();

        /*
        if (stripped_text.length >= 2) {
        
        }
        */

        suggest_callback(suggestions);
    });
    
    chrome.omnibox.onInputEntered.addListener(function(text) {
        console.log("Input entered: " + text);
        if (!text) {
            nav("http://www.mongodb.org/");
            return;
        }
        
        var stripped_text = text.strip();
        if (!stripped_text) {
            nav("http://www.mongodb.org/");
            return;
        }
        
        if (stripped_text.startsWith("http://") || stripped_text.startsWith("https://")) {
            nav(stripped_text);
            return;
        }
        
        if (stripped_text.startsWith("www.") || stripped_text.endsWith(".com") || stripped_text.endsWith(".net") || stripped_text.endsWith(".org") || stripped_text.endsWith(".edu")) {
            nav("http://" + stripped_text);
            return;
        }

        var searchUrl = "http://www.mongodb.org/json/contentnamesearch.action?query=" + encodeURIComponent(stripped_text);

        xhr(searchUrl,
            function(url, req) {
                console.log("Received: " + url);
                var result = JSON.parse(req.responseText);

                if (result.contentNameMatches && result.contentNameMatches[0]) {

                    for (var idx=0; idx < result.contentNameMatches[0].length; idx++) {
                        var match = result.contentNameMatches[0][idx];

                        if (match.spaceKey != 'DOCS') continue; 

                        nav("http://www.mongodb.org" + match.href);
                        return;
                    }
                }
            },
            function (url, req) {
                console.log("Failed to receive: " + url);
            }
        ).send(null);
       
        // No results found, going to site search.   
        nav("http://www.mongodb.org/dosearchsite.action?queryString=" + encodeURIComponent(stripped_text));
    });
})();
