var mongoose = require('mongoose');

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

mongoose.connect(uri)
mongoose.model('pm', PmSchma);

module.exports = mongoose.model('pm');