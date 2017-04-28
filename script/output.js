var nodemailer = require('nodemailer');
var fs = require('fs');

var transporter = nodemailer.createTransport({
    //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    service: 'qq',
    auth: {
        user: '827030543@qq.com',
        //这里密码不是qq密码，是你设置的smtp密码
        pass: 'wmdvxximiubkbajc'
    }
});

var output = function(log, mails) {
    var info = log.info[0];
    if (info) {
        console.log(info);
        info = JSON.parse(info);
        var jpg = info.diff.screenshot;
        var outputFilename = jpg.replace('jpg', 'json');
        var jpgSrc = 'http://lazyfe.com:3000' + jpg.replace('/gzh/page-monitor-demo/output', '');
        var detail = JSON.stringify(info, null, 4);
        detail = detail.replace(/\/gzh\/page-monitor-demo\/output/g, '');
        var htmlStr = '<table width="800" border="0" align="center" cellpadding="0" cellspacing="0" style="border: 1.0px solid rgb(237,236,236);background: rgb(248,248,248);padding: 0 20.0px;font-size: 14.0px;color: rgb(51,51,51);"><tbody><tr><td width="760" height="56" align="left" colspan="2" style="font-size: 16.0px;vertical-align: bottom;font-family: &quot;Microsoft YaHei&quot;;">你所监控的页面发生了更改</td></tr><tr><td width="760" height="30" align="left" colspan="2">&nbsp;</td></tr><tr><td width="100" height="32" align="left" valign="middle" style="width: 100px;text-align: left;vertical-align: middle;line-height: 32px;float: left;">报警详情：</td><td width="660" height="32" align="left" valign="middle" style="width: 660.0px;text-align: left;vertical-align: middle;line-height: 32.0px;font-family: &quot;Microsoft YaHei&quot;"><pre>' + detail + '</pre></td></tr><tr><td width="100" height="32" align="left" valign="middle" style="width: 100px;text-align: left;vertical-align: middle;line-height: 32px;float: left;">报警图片：</td><td width="660" height="32" align="left" valign="middle" style="width: 660.0px;text-align: left;vertical-align: middle;line-height: 32.0px;font-family: &quot;Microsoft YaHei&quot;;"><img width="600" height="auto" border="0" src="' + jpgSrc + '"></td></tr><tr><td width="760" height="32" colspan="2" style="padding-left: 40.0px;">&nbsp;</td></tr><tr><td width="760" height="32" colspan="2" style="padding-left: 40.0px;">&nbsp;</td></tr><tr><td width="760" height="32" colspan="2" style="padding-left: 40.0px;">&nbsp;</td></tr><tr><td width="760" height="14" colspan="2" style="padding: 8.0px 0 28.0px;color: rgb(153,153,153);font-size: 12.0px;font-family: &quot;Microsoft YaHei&quot;">此为系统邮件请勿回复</td></tr></tbody></table>';

        var mailOptions = {
            from: '827030543@qq.com', // 发件地址
            to: mails, // 收件列表
            subject: '观察的页面发生更改', // 标题
            html: htmlStr // html 内容
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });

        fs.writeFile(outputFilename, JSON.stringify(info, null, 4), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("JSON saved to " + outputFilename);
            }
        });
    }
};

module.exports = output;
