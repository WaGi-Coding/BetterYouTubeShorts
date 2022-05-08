/*
0.1.2:
        -| Added current time and duration info

0.1.1:
        -| keep a low number of ytd-reel-video-renderer
           by always removing 9 when it became above 28 ones
           after youtube loaded more. This should prevent the lag
           from the simple script by holding the content amount it
           searches through low

0.1.0:
        -| init
*/

var $ = window.jQuery;
var vid = null;
var reel = null;

var progbar = null;

var seekMouseDown = false;

var bytsVol = null;

var bytsTimeInfo = null;

var autoScrollVal = true;

var lastCurSeconds = 0;


window.onload = function () {

    var checkExist = setInterval(() => {                                     // wait until any
        if ($('ytd-shorts').length && $('.html5-video-player').length) {    //  video elements rendered
            clearInterval(checkExist);

            setInterval(updateVidElem, 50);

            addEventListener("keydown", function (e) {
                switch (e.key.toUpperCase()) {

                    case "ARROWLEFT":
                        $(vid).prop('currentTime', $(vid).prop('currentTime') - 2)
                        break;
                    case "ARROWRIGHT":
                        $(vid).prop('currentTime', $(vid).prop('currentTime') + 2)
                        break;

                    default:
                        //console.log(e.key.toUpperCase());
                        break;
                }
            });
        }
    }, 100);
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function updateVidElem() {

    if ($('ytd-reel-video-renderer').length >= 28) {
        $('ytd-reel-video-renderer:lt(9)').remove();
    }

    vid = $('.html5-video-player').first().find('video').first();

    if ($(vid).length === 0) {
        return;
    }

    $(vid).prop('volume', $('#byts-vol').val());

    if (autoScrollVal == true) {
        $(vid).removeAttr('loop');
        $(vid).on('ended', function () {
            $('#navigation-button-down').find("button").first().click();
        });
    }
    else {
        $(vid).attr('loop', true);
        $(vid).unbind('ended');
    }


    reel = $(vid).closest('ytd-reel-video-renderer');
    if ($(vid).length === 0) {
        return;
    }
    if ($(reel).find('#byts-progbar').length === 0) {
        if ($('#byts-progbar').length === 0) {
            $(reel).append('<div id="byts-progbar" style="user-select: none; cursor: pointer; width: 100%; height: 14px; background-color: #343434; position: absolute; margin-top: -20px; border-radius: 10px;"></div>');

        } else {
            $(reel).append($('#byts-progbar'));
        }
        progbar = $('#byts-progbar').first();
        $(progbar).mousemove((e) => {
            if (seekMouseDown) {
                $(vid).prop('currentTime', (e.offsetX * 1 / $(reel).outerWidth()) * $(vid).prop('duration'));
            }
        });
        $(progbar).mousedown(() => {
            seekMouseDown = true;
        });
        $(progbar).mouseleave(() => {
            seekMouseDown = false;
        });
        $(progbar).mouseup((e) => {
            seekMouseDown = false;
            $(vid).prop('currentTime', (e.offsetX * 1 / $(reel).outerWidth()) * $(vid).prop('duration'));
        });
    }
    let time = ($(vid).prop('currentTime') / $(vid).prop('duration')) * 100;


    // $(progbar).click((e) => {
    //     $(vid).prop('currentTime', (e.offsetX * 1 / $(reel).outerWidth()) * $(vid).prop('duration'));
    // });



    var progress = document.getElementById('byts-progress');
    if (progress == null) {
        progress = document.createElement("div");
        progress.setAttribute("id", "byts-progress");

        progress.style.userSelect = "none";
        progress.style.backgroundColor = "#FF0000";
        progress.style.height = "100%";
        progress.style.borderRadius = "10px";
        progress.style.width = time + "%";


        progress.onmouseup = function (e) {
            var selected_val = e.offsetX * 1 / $(reel).outerWidth();
            $(vid).prop('currentTime', selected_val * $(vid).prop('duration'));
        }

        $(progbar).append(progress);

    }
    else {
        progress.style.width = time + "%";
    }


    // Time Info
    let durSecs = Math.floor($(vid).prop('duration'));
    let durMinutes = Math.floor(durSecs / 60);
    let durSeconds = durSecs % 60;

    let curSecs = Math.floor($(vid).prop('currentTime'));
    if (curSecs != lastCurSeconds || $(reel).find('#byts-timeinfo').length === 0) {
        lastCurSeconds = curSecs;

        let curMinutes = Math.floor(curSecs / 60);
        let curSeconds = curSecs % 60;

        // TimeInfo Element
        if ($(reel).find('#byts-timeinfo').length === 0) {
            if ($('#byts-timeinfo').length === 0) {
                $(reel).append('<div id="byts-timeinfo" style="user-select: none; display: flex; right: auto; left: auto; position: absolute; margin-top: ' + ($(reel).height() + 2) + 'px;"><div id="byts-timeinfo-textdiv" style="display: flex; margin-right: 5px; margin-top: 4px; color: white; font-size: 1.2rem;">' + `${curMinutes}:${padTo2Digits(curSeconds)} / ${durMinutes}:${padTo2Digits(durSeconds)}` + '</div></div>');
            } else {
                $(reel).append($('#byts-timeinfo'));
            }
            bytsTimeInfo = $('#byts-timeinfo');
        }

        $('#byts-timeinfo-textdiv').text(`${curMinutes}:${padTo2Digits(curSeconds)} / ${durMinutes}:${padTo2Digits(durSeconds)}`);
    }

    $('#byts-timeinfo').css('margin-top', $(reel).height() + 2);


    // Volume Slide
    if ($(reel).find('#byts-vol').length === 0) {
        if ($('#byts-vol').length === 0) {
            $(reel).append('<input style="user-select: none; width: 100px; left: 0px; background-color: transparent; position: absolute; margin-top: ' + ($(reel).height() + 5) + 'px;" type="range" id="byts-vol" class="volslider" name="vol" min="0.0" max="1.0" step="0.01" value="' + "1.0" + '"></input>');
        } else {
            $(reel).append($('#byts-vol'));
        }
        bytsVol = $('#byts-vol');

        $('#byts-vol').on('input change', function () {
            $(vid).prop('volume', $(this).val());
        });
    }

    $('#byts-vol').css('margin-top', $(reel).height() + 5);


    // AutoScroll
    if ($(reel).find('#byts-autoscroll-div').length === 0) {
        if ($('#byts-autoscroll-div').length === 0) {
            $(reel).append('<div id="byts-autoscroll-div" style="user-select: none; display: flex; right: 0px; position: absolute; margin-top: ' + ($(reel).height() + 2) + 'px;"><div style="display: flex; margin-right: 5px; margin-top: 4px; color: white; font-size: 1.2rem;">Auto-Scroll: </div><label class="switch"><input id="byts-autoscroll-input" type="checkbox" checked><span class="slider round"></span></label></div>');
        } else {
            $(reel).append($('#byts-autoscroll-div'));
        }
        bytsVol = $('#byts-autoscroll-div');

        $('#byts-autoscroll-input').on('input change', function () {
            // console.log($(this).is(':checked'));
            if ($(this).is(':checked')) {
                autoScrollVal = true;
            }
            else {
                autoScrollVal = false;
            }
            if (autoScrollVal == true) {
                $(vid).removeAttr('loop');
                $(vid).on('ended', function () {
                    $('#navigation-button-down').find("button").first().click();
                });
            }
            else {
                $(vid).attr('loop', true);
                $(vid).unbind('ended');
            }
            // $(vid).prop('volume', $(this).val());
        });
    }

    $('#byts-autoscroll-div').css('margin-top', $(reel).height() + 2);



    // $(reel).find('#byts-progbar').first().html('<div style="width:' + time + '%; height: 100%; background-color: #FF0000; border-radius: 10px;"></div>');


}