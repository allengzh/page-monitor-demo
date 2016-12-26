function isJsonFormat(str) {
    try {
        eval('('+str+')');
    } catch (e) {
        return false;
    }
    return true;
}

$('#pm').on('click', '.am-text-primary', function() {
    var parentNode = $(this).closest('tr');
    var url = parentNode.find('.table-url').text();
    var params = parentNode.find('.table-params').text();
    var time = parentNode.find('.table-time').text();

    $.ajax({
        type: 'POST',
        url: '/pm/start',
        data: { phone: mobilephone, password: userPass },
        dataType: 'json',
        success: function(data) {
            var code = parseInt(data.code);
            var info = data.info;
            if (code === 1) {
                $ele.html('登录').removeAttr('disabled');
                window.location.href = '/index';
            } else {
                $ele.html('登录').removeAttr('disabled');
                showError(info);
            }
        }
    });
});

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
        data: { name: name,desc: desc, url: url, params: params, time: time, mail: mail },
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
