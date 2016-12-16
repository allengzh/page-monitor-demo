var Monitor = require('page-monitor');
var fs = require('fs');

var url = 'http://116.gzh.juhe.cn/';
var monitor = new Monitor(url, {
    page: {
        viewportSize: {
            width: 1920,
            height: 3000
        },
        settings: {
            resourceTimeout: 20000,
            userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.87 Safari/537.36'
        }
    },
    walk: {
        removeSelectors: ['.ban-ul li', '.hd li']
    },
    events: {
        beforeWalk: function(token) {

            
            var timestamp = new Date().getTime();
            // document.getElementsByClassName('hd')[0].firstChild && document.getElementsByClassName('hd')[0].firstChild.click();
            document.getElementsByTagName('button')[0].innerHTML = timestamp;
                
            return 8000;
        }
    },
    path: {
        format: function(url, opt) {
            return opt.hostname;
        }
    }
});

function outputJson(log) {
    var info = log.info[0];
    if (info) {
        info = JSON.parse(info);
        var jpg = info.diff.screenshot;
        var outputFilename = jpg.replace('jpg', 'json');

        fs.writeFile(outputFilename, JSON.stringify(info, null, 4), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("JSON saved to " + outputFilename);
            }
        });
    }

}
monitor.capture(function(code) {
    outputJson(monitor.log);
    console.log(monitor.log); // from phantom
    console.log('done, success!');
});

monitor.on('error', function(data) {
    console.log('[ERROR] ' + data);
});

monitor.on('warning', function(data) {
    console.log('[WARNING] ' + data);
});

// monitor.diff(1481010864247, 1481012028272, function(code){
//     console.log(monitor.log.info); // diff result
//     console.log('[DONE] exit [' + code + ']');
// });
