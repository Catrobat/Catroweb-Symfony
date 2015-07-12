$(document).ready(function () {
    $('#btn_oauth_username').attr('disabled','disabled');
    $('#dialog_oauth_username').on('input',function(e) {
        if($('#dialog_oauth_username').val() != '') {
            $('#btn_oauth_username').removeAttr('disabled');
        } else {
            $('#btn_oauth_username').attr('disabled','disabled');
        }
    });

    $('#btn_oauth_username').click(function() {
        if($("#fb_google").val() == 'fb') {
            sendTokenToServer($("#access_token_oauth").val(), $("#id_oauth").val(),
                $("#dialog_oauth_username").val(), $("#email_oauth").val(), $("#locale_oauth").val());
        } else if($("#fb_google").val() == 'g+'){
            sendCodeToServer($("#access_token_oauth").val(), $("#id_oauth").val(),
                $("#dialog_oauth_username").val(), $("#email_oauth").val(), $("#locale_oauth").val());
        }
    });
});

$(function() {
    $( "#dialog-oauth-username" ).dialog({
        autoOpen: false
    });
});

function openDialog() {
    $( "#dialog-oauth-username" ).dialog( "open" );
}

