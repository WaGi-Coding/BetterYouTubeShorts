// function findValues(obj, key) {
//     return findValuesHelper(obj, key, []);
// }

// function findValuesHelper(obj, key, list) {
//     if (!obj) return list;
//     if (obj instanceof Array) {
//         for (var i in obj) {
//             list = list.concat(findValuesHelper(obj[i], key, []));
//         }
//         return list;
//     }
//     if (obj[key]) list.push(obj[key]);

//     if ((typeof obj == "object") && (obj !== null)) {
//         var children = Object.keys(obj);
//         if (children.length > 0) {
//             for (i = 0; i < children.length; i++) {
//                 list = list.concat(findValuesHelper(obj[children[i]], key, []));
//             }
//         }
//     }
//     return list;
// }

// var vid = null;
// var reel = null;
// var udTimer = null;

// var checkExist = setInterval(() => {
//     // wait until any video elements rendered
//     if ($('ytd-shorts').length && $('.html5-video-player').length) {
//         clearInterval(checkExist);

//         udTimer = setInterval(AddUploadDateIfNeeded, 50);
//     }
// }, 100);

// async function AddUploadDateIfNeeded() {
//     vid = $('.html5-video-player').first().find('video').first();

//     if ($(vid).length === 0) {
//         return;
//     }

//     reel = $(vid).closest('ytd-reel-video-renderer');
//     if ($(vid).length === 0) {
//         return;
//     }

    

//     if ($(reel).find('#channel-name').find('#byts-uploaddate').length === 0) {
//         clearInterval(udTimer);

//         try {
//             let html = '';
//             await $.get(window.location.href, function (data) {
//                 html = data;
//             });
    
//             //console.log(html.match('(?<=var ytInitialData = ).*(?=;</script>)'));
//             // let jsonString = betweenMarkers(html, 'var ytInitialData = ', ';</script>');
//             let jsonString = html.match('(?<=var ytInitialData = ).*(?=;</script>)');
    
//             //console.log(html);
//             let jObj = JSON.parse(jsonString);
            
//             let ulDate = findValues(jObj, 'publishTimeText')[0]['runs'][1]['text'];

//             if (typeof ulDate != 'undefined') {
//                 reel.find('#channel-name').find('#text').append('<span id="byts-uploaddate"><br>' + ulDate + '</span>');
//             }
//             udTimer = setInterval(AddUploadDateIfNeeded, 50);
//         } catch (error) {
//             udTimer = setInterval(AddUploadDateIfNeeded, 50);
//             return;
//         }

        
//     }
// }