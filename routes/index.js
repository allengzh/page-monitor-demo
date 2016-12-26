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
    time: Number,
    state: Number,
    mail: String
}, { collection: 'pm' });

mongoose.model('pm', PmSchma);

var Pm = mongoose.model('pm');

/* GET home page. */
router.get('/', function(req, res, next) {

    var data = {};

    Pm.find({ state: { $lt: 3 } }, function(err, results) {
        if (err) {
            console.log('error message', err);
            return;
        }
        res.render('index', { datas: results });
    });
});

/* Post pm add submit. */
router.post('/pm/add', function(req, res, next) {

    Pm.findOne({ name: req.body.name }, function(err, data) {
        if (err) {
            console.log('error message', err);
            return;
        }

        if (data) {
            if (data.state === 3) {
                Pm.update({ name: req.body.name }, { $set: { state: 0 } }, function(err) {
                    if (err) {
                        res.json({ code: 3, info: '状态入库更新失败' });
                    } else {
                        res.json({ code: 0, info: '任务脚本执行成功' });
                    }
                });
            } else {
                console.log('相同任务名已经存在');
                res.json({ code: 1, info: '相同任务名已经存在' });
            }
        } else {
            var mails = req.body.mail.replace(/;/g, '\n');
            var insertData = { name: req.body.name, url: req.body.url, params: req.body.params, time: req.body.time, state: 0, mail: mails };

            Pm.create(insertData, function(err) {
                if (err) {
                    res.json({ code: 2, info: '入库失败' });
                } else {
                    res.json({ code: 0, info: '新增任务成功', data: insertData })
                }
            });
        }
    });
});

/* Post pm add start. */
router.post('/pm/start', function(req, res, next) {

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
            res.json({ code: 1, info: '新建任务脚本失败' })
        } else {
            console.log("params saved to " + file);
            var cmdStr = 'pm2 start ' + file + ' --name ' + req.body.name;

            exec(cmdStr, function(err, stdout, stderr) {
                if (err) {
                    console.log('start script error:' + stderr);
                    res.json({ code: 2, info: '任务脚本执行失败' });
                } else {
                    Pm.update({ name: req.body.name }, { $set: { state: 1 } }, function(err) {
                        if (err) {
                            res.json({ code: 3, info: '状态入库更新失败' });
                        } else {
                            res.json({ code: 0, info: '任务脚本执行成功' });
                        }
                    });
                }
            });
        }
    });
});

/* Post pm add stop. */
router.post('/pm/stop', function(req, res, next) {

    var cmdStr = 'pm2 stop ' + req.body.name;

    exec(cmdStr, function(err, stdout, stderr) {
        if (err) {
            console.log('start script error:' + stderr);
            res.json({ code: 1, info: '任务脚本执行失败' });
        } else {
            Pm.update({ name: req.body.name }, { $set: { state: 2 } }, function(err) {
                if (err) {
                    res.json({ code: 2, info: '状态入库更新失败' });
                } else {
                    res.json({ code: 0, info: '暂停任务脚本成功' });
                }
            });
        }
    });
});

/* Post pm add restart. */
router.post('/pm/restart', function(req, res, next) {

    var cmdStr = 'pm2 restart ' + req.body.name;

    exec(cmdStr, function(err, stdout, stderr) {
        if (err) {
            console.log('start script error:' + stderr);
            res.json({ code: 1, info: '任务脚本执行失败' });
        } else {
            Pm.update({ name: req.body.name }, { $set: { state: 1 } }, function(err) {
                if (err) {
                    res.json({ code: 2, info: '状态入库更新失败' });
                } else {
                    res.json({ code: 0, info: '重新开始任务脚本成功' });
                }
            });
        }
    });
});

/* Post pm add delete. */
router.post('/pm/delete', function(req, res, next) {

    var cmdStr = 'pm2 delete ' + req.body.name;

    exec(cmdStr, function(err, stdout, stderr) {
        if (err) {
            console.log('start script error:' + stderr);
            res.json({ code: 1, info: '任务脚本执行失败' });
        } else {
            Pm.update({ name: req.body.name }, { $set: { state: 3 } }, function(err) {
                if (err) {
                    res.json({ code: 2, info: '状态入库更新失败' });
                } else {
                    res.json({ code: 0, info: '删除任务脚本成功' });
                }
            });
        }
    });
});

module.exports = router;
