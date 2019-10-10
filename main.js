 const socket = io('http://localhost:3000')

 function openStream() {
     const config = { audio: false, video: true };
     return navigator.mediaDevices.getUserMedia(config);
 }

 function playStream(idVideoTag, stream) {
     const video = document.getElementById(idVideoTag)
     console.log(video)
     video.srcObject = stream;
     video.play();
 }

 const peer = new Peer({ key: 'peerjs', host: "call11.herokuapp.com", secure: true, port: 443 });
 peer.on('open', function(id) {
     $("#yourId").append(id);
     $("#btnRegis").click(function() {
         const username = $("#username").val();
         socket.emit("registerUser", { username: username, peerId: id });
     })

 });

 $("#userList").on('click', 'li', function() {
     const id = $(this).attr('id');
     console.log("Calling " + id)
     openStream().then(stream => {
         playStream('localVideo', stream);
         const call = peer.call(id, stream);
         call.on('stream', remoteStream => playStream('remoteStream', remoteStream));

     })
 })

 peer.on('call', call => openStream().then(
     stream => {
         playStream('localVideo', stream);
         call.answer(stream)
         call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
     }
 ));
 socket.on('onlineList', arrUserInfor => {
     var li = "";
     arrUserInfor.forEach(user => {
         const { username, peerId } = user;
         li = li + (`<li id="${peerId}">${username}</li>`);
     })

     $("#userList").html(li);
 })

 socket.on('newUser', user => {
     $("#userList").append(`<li id="${user.peerId}">${user.username}</li>`);
 })
 socket.on('registerFail', () => {
     alert("User is existed");
 })

 socket.on('disconnect', peerId => {
     $(`#${peerId}`).remove();
 })