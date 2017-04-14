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
    desc: String,
    url: String,
    params: String,
    time: Number,
    state: Number,
    mail: String,
    timestamp: { type: Date, default: Date.now }
}, { collection: 'pm' });

mongoose.model('pm', PmSchma);

var Pm = mongoose.model('pm');

/* GET home page. */
router.get('/', function(req, res, next) {

    var data = {};

    Pm.find({ state: { $lt: 3 } }).sort('-timestamp')
        .exec(function(err, results) {
            if (err) {
                console.log('error message', err);
                return;
            }
            res.render('index', { datas: results });
        });
});

/* Post pm add submit. */
router.post('/pm/add', function(req, res, next) {
    if (!/^[A-Za-z]+$/.test(req.body.name)) {
        res.json({ code: 4, info: '请输入任务名称，必须由字母组成' });
    }
    if (!/^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?$/.test(req.body.url)) {
        res.json({ code: 5, info: '请输入正确格式的网页链接' });
    }
    try {
        eval('(' + req.body.params + ')');
    } catch (e) {
        res.json({ code: 6, info: '请输入正确格式的参数' });
    }
    if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(req.body.time)) {
        res.json({ code: 7, info: '请输入正确格式的数字' });
    }

    Pm.findOne({ name: req.body.name }, function(err, data) {
        if (err) {
            console.log('error message', err);
            return;
        }

        var mails = req.body.mail.replace(/;/g, '\n');

        if (data) {
            if (data.state === 3) {
                updateData = { name: req.body.name, url: req.body.url, desc: req.body.desc, params: req.body.params, time: req.body.time, state: 0, mail: mails, timestamp: Date.now() };
                Pm.update({ name: req.body.name }, { $set: updateData }, function(err) {
                    if (err) {
                        res.json({ code: 3, info: '状态入库更新失败' });
                    } else {
                        res.json({ code: 0, info: '新增任务成功', data: updateData });
                    }
                });
            } else {
                console.log('相同任务名已经存在');
                res.json({ code: 1, info: '相同任务名已经存在' });
            }
        } else {
            var insertData = { name: req.body.name, desc: req.body.desc, url: req.body.url, params: req.body.params, time: req.body.time, state: 0, mail: mails };

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

/* Post pm edit submit. */
router.post('/pm/update', function(req, res, next) {

    if (!/^[A-Za-z]+$/.test(req.body.name)) {
        res.json({ code: 4, info: '请输入任务名称，必须由字母组成' });
    }
    if (!/^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?$/.test(req.body.url)) {
        res.json({ code: 5, info: '请输入正确格式的网页链接' });
    }
    try {
        eval('(' + req.body.params + ')');
    } catch (e) {
        res.json({ code: 6, info: '请输入正确格式的参数' });
    }
    if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(req.body.time)) {
        res.json({ code: 7, info: '请输入正确格式的数字' });
    }

    Pm.findOne({ name: req.body.name }, function(err, data) {
        if (err) {
            console.log('error message', err);
            return;
        }

        var mails = req.body.mail.replace(/;/g, '\n');

        if (data) {
            if (data.state !== 1) {
                updateData = { name: req.body.name, url: req.body.url, desc: req.body.desc, params: req.body.params, time: req.body.time, mail: mails, state: data.state, timestamp: Date.now() };
                Pm.update({ name: req.body.name }, { $set: updateData }, function(err) {
                    if (err) {
                        res.json({ code: 1, info: '状态入库更新失败' });
                    } else {
                        res.json({ code: 0, info: '任务更新成功', data: updateData });
                    }
                });
            } else {
                console.log('任务正在进行中，不能更新，请先停止任务！');
                res.json({ code: 2, info: '任务正在进行中，不能更新，请先停止任务！' });
            }
        } else {
            res.json({ code: 3, info: '未找到需要更新的任务' });
        }
    });
});

/* Post pm add start. */
router.post('/pm/start', function(req, res, next) {

    Pm.findOne({ name: req.body.name }, function(err, data) {
        if (err) {
            console.log('error message', err);
            return;
        }

        if (data) {
            var datas = [
                'var Monitor = require(\'page-monitor\');',
                'var num = 0;\nvar flag = 0;',
                'function a() {',
                'if (flag) {return;}',
                'flag = 1;',
                'var monitor = new Monitor(\'' + data.url + '\', ' + data.params + ');',
                'monitor.capture(function(code) {',
                'console.log(\'case \' + num + \' done, success!\\n\');',
                'flag = 0;\nnum++;',
                '});',
                '}',
                'setInterval(a, ' + data.time + ');'
            ];

            var text = datas.join('\n');
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
                            console.log('start db');
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
        } else {
            res.json({ code: 4, info: '未找到需要启动的任务' });
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

    Pm.findOne({ name: req.body.name, state: 1 }, function(err, data) {
        if (err) {
            console.log('error message', err);
            return;
        }

        if (data) {
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
