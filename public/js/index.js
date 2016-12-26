function isJsonFormat(str) {
    try {
        eval('(' + str + ')');
    } catch (e) {
        return false;
    }
    return true;
}

$('#pm').on('click', '.add', function() {
    $('#add-modal').modal({
        width: 640
    });
});

$('#add-submit').on('click', function() {
    var name = $.trim($('#add-name').val());
    var desc = $.trim($('#add-desc').val());
    var url = $.trim($('#add-url').val());
    var params = $.trim($('#add-params').val());
    var time = $.trim($('#add-time').val());
    var mail = $.trim($('#add-mail').val());

    if (!isJsonFormat(params)) {
        $('#add-params')[0].setCustomValidity('输入参数格式错误');
    } else {
        $('#add-params')[0].setCustomValidity('');
    }

    $.ajax({
        type: 'POST',
        url: '/pm/add',
        data: { name: name, desc: desc, url: url, params: params, time: time, mail: mail },
        dataType: 'json',
        success: function(data) {
            var code = parseInt(data.code);
            var info = data.info;
            if (code === 1) {

            } else {
                showError(info);
            }
        }
    });
})

$('#pm').on('click', '.start', function() {

    var $tr = $(this).closest('tr');
    var name = $.trim($tr.find('.table-name').val());
    var url = $.trim($tr.find('.table-url').val());
    var params = $.trim($tr.find('.table-params').val());
    var time = $.trim($tr.find('.table-time').val());
    var mail = $.trim($tr.find('.table-mail').val());

    $.ajax({
        type: 'POST',
        url: '/pm/start',
        data: { name: name, url: url, params: params, time: time, mail: mail },
        dataType: 'json',
        success: function(data) {
            var code = parseInt(data.code);
            var info = data.info;
            if (code === 1) {

            } else {
                showError(info);
            }
        }
    });
});
