var express = require('express');
var router = express.Router();
var fs = require('fs');
var exec = require('child_process').exec;
var mongoose = require('mongoose');

var uri = 'mongodb://localhost/pm';

mongoose.connect(uri);

//在Schma里定义数据类型
var PmSchma = new mongoose.Schema({ //定义一个Schema
    name: String,
    url: String,
    params: String,
    time: Integer,
    state: Integer,
    mail: String
});

mongoose.model('Pm',PmSchma);

var Pm = mongoose.model('Pm');

/* GET home page. */
router.get('/', function(req, res, next) {

	var data ={};

	Pm.find({}, function (err,results) {
        if(err){
            console.log('error message',err);
            return;
        }
        data = results;
    });
    res.render('index', { data: data });
});

/* Post pm add submit. */
router.post('/pm/add', function(req, res, next) {

    var data = [
        'var Monitor = require(\'page-monitor\');',
        'var num = 0;\nvar flag = 0;',
        'function a() {',
        'if (flag) {return;}',
        'flag = 1;',
        'var monitor = new Monitor(\'' + req.body.url + '\', ' + req.body.params + ');',
        'monitor.capture(function(code) {',
        'console.log(\'case \' + num + \' done, success!\\n\');',
        'flag = 0;\nnum++;',
        '});',
        '}',
        'setInterval(a, ' + req.body.time + ');'
    ];

    var text = data.join('\n');
    var file = __dirname + '/../script/' + req.body.name + '.js';

    fs.writeFile(file, text, function(err) {
        if (err) {
            console.log(err);
            res.json({ code: '1', info: '新建任务脚本失败' })
        } else {

            console.log("params saved to " + file);

            // var cmdStr = 'pm2 start ' + file + ' --name ' + req.body.name;

            // exec(cmdStr, function(err, stdout, stderr) {
            //     if (err) {
            //         console.log('start script error:' + stderr);
            //         res.json({ code: '2', info: '任务脚本执行失败' })
            //     } else {
            //         res.json({ code: '0', info: '新增任务成功' })
            //     }
            // });
        }
    });
    // res.render('index', { title: 'Express' });
});

module.exports = router;
