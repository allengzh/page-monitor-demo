var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('./util.js');

/* GET detail page. */
router.get('/', function(req, res, next) {
    res.render('detail',{url:req.query.name});
});
router.get('/info', function(req, res, next) {

	var root = __dirname + '/../output/';
    var ext = 'jpg';
    var param = urlparse(req.query.name);
    var path = String(param).replace(/(^|\/)\.\.(?=\/|$)/g, '');
    var full = root + '/' + path;
    var info = {
        status: 0
    };
    console.log(full);
    if(_.isDir(full)){
        if(_.isFile(full + '/latest.log')){
            var object = info.object = {};
            object.latest = String(fs.readFileSync(full + '/latest.log')).trim();
            object.ext = ext;
            object.list = [];
            _.find(full, function(dir){
                if(/^\d+$/.test(dir)){
                    object.list.push({
                        time: dir,
                        root: path,
                        path: path + '/' + dir,
                        screenshot: path + '/' + dir + '/screenshot.' + ext
                    });
                }
            });
            object.list.sort(function(a, b){
                return a.time - b.time;
            });
        }
    } else {
        info.status = 1;
        info.message = 'invalid path [' + path + ']';
    }
    res.json(info);
});

module.exports = router;