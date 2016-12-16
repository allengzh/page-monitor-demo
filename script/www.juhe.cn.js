var Monitor = require('page-monitor');

var url = 'http://www.juhe.cn';
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
    }
});
monitor.capture(function(code) {
    console.log(monitor.log); // from phantom
    console.log('done, exit [' + code + ']');
});

// monitor.diff(1481010864247, 1481012028272, function(code){
//     console.log(monitor.log.info); // diff result
//     console.log('[DONE] exit [' + code + ']');
// });
