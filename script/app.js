var app = require('pmui');

app.set('port', process.env.PORT || 8894);

// app.set('page monitor root', process.cwd());   // path to save captures
// app.set('page monitor ext', 'jpg');            // screenshot format
// app.set('page monitor title', 'Page Monitor'); // page title

var cluster = require('cluster'),
    os = require('os'),
    cpuCount = os.cpus().length,
    logger = app.get('logger') || console;

if (cluster.isMaster) {
    for (var i = 0; i < cpuCount; i++) cluster.fork();
    cluster.on('exit', function (worker) {
        logger.error('Worker ' + worker.id + 'died :(');
        cluster.fork();
    });
} else {
    app.listen(app.get('port'), function () {
        logger.log('[%s] Express server listening on port %d',
            app.get('env').toUpperCase(), app.get('port'));
    });
}