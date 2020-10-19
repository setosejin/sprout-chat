///////////////////////////////////////////


$(function () {
    $("#logoutBtn2").click(function (e) {
        e.preventDefault();
        socket.emit('logout');
        socketId = "";
        alert("로그아웃되었습니다.");
        $userWrap.show();
        $contentWrap.hide();
    });


    $roomSelect.on("click", "div", function () {
        if (roomId !== $(this).data('id')) {
            roomId = $(this).data('id');
        }
        $(this).parents().children().removeClass("active");
        $(this).addClass("active");
        $chatLog.html("");
        $('#chatHeader').html(`${$(this).html()}`);
        socket.emit('join room', {
            roomId
        });
    });

    socket.on('userlist', function (data) {
        let html = "";
        data.forEach((el) => {
            if (el.socketId === socketId) {
                html += `<div class="memberEl">${el.name} (me)</div>`
            } else {
                html += `<div class="memberEl">${el.name}</div>`
            }
        });
        $memberSelect.html(html);
    });

    socket.on('lefted room', function (data) {
        $chatLog.append(`<div class="notice"><strong>${data}</strong> lefted the room</div>`)
    });
    socket.on('joined room', function (data) {
        $chatLog.append(`<div class="notice"><strong>${data}</strong> joined the room</div>`)
    });

    $loginForm.submit(function (e) {
        e.preventDefault();
        let id = $("#loginId");
        let pw = $("#loginPw");
        if (id.val() === "" || pw.val() === "") {
            alert("check validation");
            return false;
        } else {
            socket.emit('login user', {
                id: id.val(),
                pw: pw.val()
            }, function (res) {
                if (res.result) {
                    alert(res.data);
                    socketId = socket.id;
                    roomId = 1;
                    id.val("");
                    pw.val("");
                    $userWrap.hide();
                    $contentWrap.show();
                    $('#chatHeader').html("Everyone");
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
            socket.emit('join user', {
                id: id.val(),
                pw: pw.val()
            }, function (res) {
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

    $chatForm.submit(function (e) {
        e.preventDefault();
        let msg = $("#message");
        if (msg.val() === "") {
            return false;
        } else {
            let data = {
                roomId: roomId,
                msg: msg.val()
            };
            socket.emit("send message", data);
            msg.val("");
            msg.focus();
        }
    });

    socket.on('new message', function (data) {
        if (data.socketId === socketId) {
            $chatLog.append(`<div class="myMsg msgEl"><span class="msg">${data.msg}</span></div>`)
        }else {
            $chatLog.append(`<div class="anotherMsg msgEl"><span class="anotherName">${data.name}</span><span class="msg">${data.msg}</span></div>`)
        }
        $chatLog.scrollTop($chatLog[0].scrollHeight - $chatLog[0].clientHeight);
    });


});