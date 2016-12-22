var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Post pm add submit. */
router.post('/pm/add', function(req, res, next) {

	var data = [
		'var Monitor = require(\'page-monitor\');',
		'var num = 0;\nvar flag = 0;',
		'function a() {',
		'if (flag) {return;}',
		'flag = 1;',
		'var monitor = new Monitor(\''+req.body.url+'\', '+req.body.params+');',
		'monitor.capture(function(code) {',
		'console.log(\'case \' + num + \' done, success!\\n\');',
		'flag = 0;\nnum++;',
		'});',
		'}',
		'setInterval(a, '+req.body.time+');'
	];

	var text = data.join('\n');
	var file = __dirname + '/../script/' + req.body.name + '.js';

	fs.writeFile(file, text, function(err) {
        if (err) {
            console.log(err);
			res.json({ code: '0', info: '新增任务失败' })
        } else {
            console.log("params saved to " + file);
            res.json({ code: '1', info: '新增任务成功' })
        }
    });
  // res.render('index', { title: 'Express' });
});

module.exports = router;
