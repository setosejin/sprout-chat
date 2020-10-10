$(function () {
    var $loginForm = $('#loginForm');
    var $joinForm = $('#joinForm');

    $("#loginBtn").click(function (e) {
        e.preventDefault();
        $loginForm.show();
        $joinForm.hide();
    });

    $("#joinBtn").click(function (e) {
        e.preventDefault();
        $joinForm.show();
        $loginForm.hide();
    });


    var socket = io.connect();
    var roomId = 1;
    var socketId = "";
    var $userWrap = $('#userWrap');
    var $contentWrap = $('#contentWrap');

    $loginForm.submit(function (e) {
        e.preventDefault();
        let id = $("#loginId");
        let pw = $("#loginPw");
        if (id.val() === "" || pw.val() === "") {
            alert("check validation");
            return false;
        } else {
            socket.emit('login user', {id: id.val(), pw: pw.val()}, function (res) {
                if (res.result) {
                    alert(res.data);
                    socketId = socket.id;
                    roomId = 1;
                    id.val("");
                    pw.val("");
                    $userWrap.hide();
                    $contentWrap.show();
                } else {
                    alert(res.data);
                    id.val("");
                    pw.val("");
                    $("#joinBtn").click();
                }
            });
        }
    });

    $joinForm.submit(function (e) {
        e.preventDefault();
        let id = $("#joinId");
        let pw = $("#joinPw");
        if (id.val() === "" || pw.val() === "") {
            alert("check validation");
            return false;
        } else {
            socket.emit('join user', {id: id.val(), pw: pw.val()}, function (res) {
                if (res.result) {
                    alert(res.data);
                    id.val("");
                    pw.val("");
                    $("#loginBtn").click();
                } else {
                    alert(res.data);
                    return false;
                }
            });
        }
    });

});

$("#logoutBtn").click(function (e) {
	    e.preventDefault();
    socket.emit('logout');
    socketId = "";
    alert("로그아웃되었습니다.");
    $userWrap.show();
    $contentWrap.hide();
});