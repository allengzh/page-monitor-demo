var addModal = $('#add-modal');
var loadModal = $('#loading-modal');
var errorModal = $('#error-modal');

function isJsonFormat(str) {
    try {
        eval('(' + str + ')');
    } catch (e) {
        return false;
    }
    return true;
}

function showError(text){
    errorModal.find('.am-modal-bd').text(text);
    errorModal.modal();
}


$('#pm').on('click', '.add', function() {
    addModal.modal({
        width: 640,
        onCancel: function() {
          $(['#add-modal input', '#add-modal textarea']).val('');
        }
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
        return false;
    } else {
        $('#add-params')[0].setCustomValidity('');
    }

    addModal.modal('close');

    $.ajax({
        type: 'POST',
        url: '/pm/add',
        data: { name: name, desc: desc, url: url, params: params, time: time, mail: mail },
        dataType: 'json',
        success: function(data) {
            var code = parseInt(data.code);
            var info = data.info;

            loadModal.modal('close');
            if (code === 0) {

            } else {
                showError(info);
            }
        }
    });

    return false;
})

$('#pm').on('click', '.start', function() {

    var $tr = $(this).closest('tr');
    var name = $.trim($tr.find('.table-name').text());
    var url = $.trim($tr.find('.table-url').text());
    var params = $.trim($tr.find('.table-params').text());
    var time = $.trim($tr.find('.table-time').text());
    var mail = $.trim($tr.find('.table-mail').text().replace(/\\n/g,';'));

    $.ajax({
        type: 'POST',
        url: '/pm/start',
        data: { name: name, url: url, params: params, time: time, mail: mail },
        dataType: 'json',
        success: function(data) {
            var code = parseInt(data.code);
            var info = data.info;

            loadModal.modal('close');
            if (code === 0) {

            } else {
                showError(info);
            }
        }
    });
});

$('#pm').on('click', '.stop', function() {

    var $tr = $(this).closest('tr');
    var name = $.trim($tr.find('.table-name').text());

    $.ajax({
        type: 'POST',
        url: '/pm/stop',
        data: { name: name},
        dataType: 'json',
        success: function(data) {
            var code = parseInt(data.code);
            var info = data.info;

            loadModal.modal('close');
            if (code === 0) {

            } else {
                showError(info);
            }
        }
    });
});

$('#pm').on('click', '.restart', function() {

    var $tr = $(this).closest('tr');
    var name = $.trim($tr.find('.table-name').text());

    $.ajax({
        type: 'POST',
        url: '/pm/restart',
        data: { name: name},
        dataType: 'json',
        success: function(data) {
            var code = parseInt(data.code);
            var info = data.info;

            loadModal.modal('close');
            if (code === 0) {

            } else {
                showError(info);
            }
        }
    });
});

$('#pm').on('click', '.delete', function() {

    var $tr = $(this).closest('tr');
    var name = $.trim($tr.find('.table-name').text());

    $.ajax({
        type: 'POST',
        url: '/pm/delete',
        data: { name: name},
        dataType: 'json',
        success: function(data) {
            var code = parseInt(data.code);
            var info = data.info;

            loadModal.modal('close');
            if (code === 0) {

            } else {
                showError(info);
            }
        }
    });
});