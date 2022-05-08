var btns = document.getElementsByClassName('kofibutton');

for(var i = 0; i < btns.length; i++) {
    var btn = btns[i];
    btn.onclick = function() {
        window.open('https://ko-fi.com/wagi_coding', '_blank');
    }
}