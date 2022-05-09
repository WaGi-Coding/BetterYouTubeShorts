function injectScript(file_path, tag) {
    if(document.getElementById(file_path) != null){
        document.getElementById(file_path).remove();
    }
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.id = file_path;
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.runtime.getURL(file_path));
    node.appendChild(script);
}
injectScript('jquery.js', 'body');
injectScript('uploadDateReveal.js', 'body');