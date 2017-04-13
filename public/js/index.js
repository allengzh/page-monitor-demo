var addModal = $('#add-modal');
var editModal = $('#edit-modal');
var loadModal = $('#loading-modal');
var errorModal = $('#error-modal');
var confirmModal = $('#confirm-modal');

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

function trContent(data) {
    var html = '';
    html += '<tr><td class="table-check"><input type="checkbox"></td>';
    html += '<td class="table-name">' + data.name + '</td>';
    html += '<td class="table-desc">' + data.desc + '</td>';
    html += '<td class="table-url"><a href="' + data.url + '">' + data.url + '</a></td>';
    html += '<td class="table-params"><pre class="am-pre-scrollable">' + data.params + '</pre></td>';
    html += '<td class="table-time">' + data.time + '</td>';
    html += '<td class="table-mail">' + data.mail + '</td>';
    if (data.state) {
        html += '<td class="table-set">已结束</td>';
    } else {
        html += '<td class="table-set">未开始</td>';
    }

    html += '<td><div class="am-btn-toolbar"><div class="am-btn-group am-btn-group-xs">';
    html += '<button type="button" class="am-btn am-btn-default am-btn-xs am-text-primary start" data-am-modal="{target: \'#loading-modal\'}">';
    if (data.state) {
        html += '<span class="am-icon-play"></span>重新开始</button>';
    } else {
        html += '<span class="am-icon-play"></span>开始</button>';
    }

    html += '<button type="button" class="am-btn am-btn-default am-btn-xs am-text-secondary edit"><span class="am-icon-pencil-square-o"></span>编辑</button>';
    html += '<button type="button" class="am-btn am-btn-default am-btn-xs am-text-danger am-hide-sm-only delete"><span class="am-icon-trash-o"></span> 删除</button>';
    html += '<button type="button" class="am-btn am-btn-default am-btn-xs am-text-warning watch"><span class="am-icon-eye"></span> 查看报告</button>';
    html += '</div></div></td></tr>';

    return html;
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
    var desc = $ele.find('.table-desc').text();
    var url = $ele.find('.table-url').text();
    var params = $ele.find('.table-params pre').text();
    var time = $ele.find('.table-time').text();
    var mail = $ele.find('.table-mail').html().replace(/\n/g, ';')

    $('#edit-desc').val(desc);
    $('#edit-url').val(url);
    $('#edit-params').val(params);
    $('#edit-time').val(time);
    $('#edit-mail').val(mail);

    $('tr').removeClass('editing');

    $ele.addClass('editing');

    editModal.modal({
        width: 640
    });
});

function addSubmit() {
    var name = $.trim($('#add-name').val());
    var desc = $.trim($('#add-desc').val());
    var url = $.trim($('#add-url').val());
    var params = $.trim($('#add-params').val());
    var time = $.trim($('#add-time').val());
    var mail = $.trim($('#add-mail').val());

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
            var datas = data.data;

            loadModal.modal('close');
            if (code === 0) {
                $('.table-main tbody').prepend(trContent(datas));
            } else {
                showError(info);
            }
        }
    });

    return false;
};

$('#add-form').validator({
    validate: function(validity) {
        var $ele = $(validity.field);
        var params;

        if ($ele.attr('id') === 'add-params') {
            params = $.trim($ele.val());
            if (!isJsonFormat(params)) {
                validity.valid = false;
            } else {
                validity.valid = true;
            }
        }
    },
    onValid: function(validity) {
        $(validity.field).closest('.am-form-group').find('.am-alert').hide();
        addSubmit();
    },
    onInValid: function(validity) {
        var $field = $(validity.field);
        var $group = $field.closest('.am-form-group');
        var $alert = $group.find('.am-alert');
        // 使用自定义的提示信息 或 插件内置的提示信息
        var msg = $field.data('validationMessage') || this.getValidationMessage(validity);

        if (!$alert.length) {
            $alert = $('<div class="am-alert am-alert-danger"></div>').hide().
            appendTo($group);
        }

        $alert.html(msg).show();
    }
});

function editSubmit() {
    var desc = $.trim($('#edit-desc').val());
    var url = $.trim($('#edit-url').val());
    var params = $.trim($('#edit-params').val());
    var time = $.trim($('#edit-time').val());
    var mail = $.trim($('#edit-mail').val());
    var name = $('tr.editing').find('.table-name').text();

    loadModal.modal();
    editModal.modal('close');

    $.ajax({
        type: 'POST',
        url: '/pm/update',
        data: { name: name, desc: desc, url: url, params: params, time: time, mail: mail },
        dataType: 'json',
        success: function(data) {
            var code = parseInt(data.code);
            var info = data.info;
            var datas = data.data;

            loadModal.modal('close');
            if (code === 0) {
                $('tr.editing').replaceWith(trContent(datas));
            } else {
                showError(info);
            }
        }
    });

    return false;
};

$('#edit-form').validator({
    validate: function(validity) {
        var $ele = $(validity.field);
        var params;

        if ($ele.attr('id') === 'edit-params') {
            params = $.trim($ele.val());
            if (!isJsonFormat(params)) {
                validity.valid = false;
            } else {
                validity.valid = true;
            }
        }
    },
    onValid: function(validity) {
        $(validity.field).closest('.am-form-group').find('.am-alert').hide();
        editSubmit();
    },
    onInValid: function(validity) {
        var $field = $(validity.field);
        var $group = $field.closest('.am-form-group');
        var $alert = $group.find('.am-alert');
        // 使用自定义的提示信息 或 插件内置的提示信息
        var msg = $field.data('validationMessage') || this.getValidationMessage(validity);

        if (!$alert.length) {
            $alert = $('<div class="am-alert am-alert-danger"></div>').hide().
            appendTo($group);
        }

        $alert.html(msg).show();
    }
});

$('#pm').on('click', '.start', function() {

    var $btn = $(this);
    var $tr = $btn.closest('tr');
    var name = $.trim($tr.find('.table-name').text());

    $.ajax({
        type: 'POST',
        url: '/pm/start',
        data: { name: name },
        dataType: 'json',
        success: function(data) {
            var code = parseInt(data.code);
            var info = data.info;

            loadModal.modal('close');
            if (code === 0) {
                var html = '<button type="button" class="am-btn am-btn-default am-btn-xs am-text-primary stop" data-am-modal="{target: \'#loading-modal\'}">';
                html += '<span class="am-icon-stop"></span>暂停</button>'
                $btn.replaceWith(html);
                $tr.find('.table-set').text('进行中');
            } else {
                showError(info);
            }
        }
    });

    return false;
});

$('#pm').on('click', '.stop', function() {

    var $btn = $(this);
    var $tr = $btn.closest('tr');
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
                var html = '<button type="button" class="am-btn am-btn-default am-btn-xs am-text-primary restart" data-am-modal="{target: \'#loading-modal\'}">';
                html += '<span class="am-icon-stop"></span>重新开始</button>'
                $btn.replaceWith(html);
                $tr.find('.table-set').text('已结束');
            } else {
                showError(info);
            }
        }
    });
});

$('#pm').on('click', '.restart', function() {

    var $btn = $(this);
    var $tr = $btn.closest('tr');
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
                var html = '<button type="button" class="am-btn am-btn-default am-btn-xs am-text-primary stop" data-am-modal="{target: \'#loading-modal\'}">';
                html += '<span class="am-icon-stop"></span>暂停</button>'
                $btn.replaceWith(html);
                $tr.find('.table-set').text('进行中');
            } else {
                showError(info);
            }
        }
    });
});

$('#pm').on('click', '.delete', function() {

    var $tr = $(this).closest('tr');
    var name = $.trim($tr.find('.table-name').text());

    confirmModal.modal({
        relatedTarget: this,
        onConfirm: function(options) {
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
                        $tr.remove();
                    } else {
                        showError(info);
                    }
                }
            });
        }
    });




});
