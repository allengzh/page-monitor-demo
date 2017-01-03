var addModal = $('#add-modal');
var editModal = $('#edit-modal');
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

function showError(text) {
    errorModal.find('.am-modal-bd').text(text);
    errorModal.modal();
}

addModal.on('closed.modal.amui', function() {
    $('#add-modal input, #add-modal textarea').val('');
});
addModal.on('opened.modal.amui', function() {
    $('#add-modal input, #add-modal textarea')[0].focus();
});

$('#pm').on('click', '.add', function() {
    addModal.modal({
        width: 640
    });
});

$('#pm').on('click', '.edit', function() {
    var $ele = $(this).closest('tr');
    var name = $ele.find('.table-name').text();
    var desc = $ele.find('.table-desc').text();
    var url = $ele.find('.table-url').text();
    var params = $ele.find('.table-params pre').text();
    var time = $ele.find('.table-time').text();
    var mail = $ele.find('.table-mail').text().replace(/\\n/g, ';');

    $('#edit-name').val(name);
    $('#edit-desc').val(desc);
    $('#edit-url').val(url);
    $('#edit-params').val(params);
    $('#edit-time').val(time);
    $('#edit-mail').val(mail);

    editModal.modal({
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
        return false;
    } else {
        $('#add-params')[0].setCustomValidity('');
    }

    loadModal.modal();
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
});

$('#edit-submit').on('click', function() {
    var name = $.trim($('#edit-name').val());
    var desc = $.trim($('#edit-desc').val());
    var url = $.trim($('#edit-url').val());
    var params = $.trim($('#edit-params').val());
    var time = $.trim($('#edit-time').val());
    var mail = $.trim($('#edit-mail').val());

    if (!isJsonFormat(params)) {
        $('#edit-params')[0].setCustomValidity('输入参数格式错误');
        return false;
    } else {
        $('#edit-params')[0].setCustomValidity('');
    }

    loadModal.modal();
    editModal.modal('close');

    $.ajax({
        type: 'POST',
        url: '/pm/edit',
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
});

$('#pm').on('click', '.start', function() {

    var $tr = $(this).closest('tr');
    var name = $.trim($tr.find('.table-name').text());
    var url = $.trim($tr.find('.table-url').text());
    var params = $.trim($tr.find('.table-params').text());
    var time = $.trim($tr.find('.table-time').text());
    var mail = $.trim($tr.find('.table-mail').text().replace(/\\n/g, ';'));

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
        data: { name: name },
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
        data: { name: name },
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
        data: { name: name },
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
