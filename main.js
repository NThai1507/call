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

 const peer = new Peer({ key: 'lwjd5qra8257b9' });
 peer.on('open', function(id) {
     $("#yourId").append(id)
 });


 $("#btnCall").click(() => {
     const id = $("#remoteId").val();
     console.log(id);
     openStream().then(stream => {
         playStream('localVideo', stream);
         const call = peer.call(id, stream);
         call.on('stream', remoteStream => playStream('remoteStream'), remoteStream);
     })


 })


 peer.on('call', call => openStream().then(
     stream => {
         console.log("answered" + stream);
         playStream('localVideo', stream);
         call.on('stream', remoteStream => playStream('remoteStream'), remoteStream);
     }
 ));