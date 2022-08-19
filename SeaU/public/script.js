const socket= io('/');
const form = document.getElementById('message_send_box');
var messageInput = document.getElementById('input_message');
const messageContainer = document.querySelector(".message_box");
const append=(message,position)=>{
    const messageElement= document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You:\n\t ${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';
})
const naam = prompt("Your name :- ");
socket.emit('new-user-joined', naam);
socket.on('user-joined',naam =>{
    append(`${naam} joined the chat`,'left')
})
socket.on('receive',data =>{
    append(`${data.naam}:\n\t${data.message}`,'left')
})
socket.on('leave',naam =>{
    append(`${naam} left the chat`,'left')
})
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
const myPeer = new Peer();
  myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
  })
  let myVideoStream;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream=stream;
  addVideoStream(myVideo, stream)


  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    console.log("User Connected " + userId)
    connectToNewUser(userId, stream)
  })

  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })

})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })

    peers[userId] = call
  
  }


function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  
  videoGrid.append(video)
}


const videobutton = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo();
    } else {
      setStopVideo();
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  
  const audiobutton = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  
  const setPlayVideo = () => {
    const html = `<i class="unmute fa fa-pause-circle"></i>
    <span class="unmute">Video On</span>`;
    document.getElementById("video_button").innerHTML = html;
  }
  
  const setStopVideo = () => {
    const html = `<i class=" fa fa-video-camera"></i>
    <span class="">Video Off</span>`;
    document.getElementById("video_button").innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `<i class="unmute fa fa-microphone-slash"></i>
  <span class="Unmute">Unmute</span>`;
    document.getElementById("audio_button").innerHTML = html;
  }
  const setMuteButton = () => {
    const html = `<i class="fa fa-microphone"></i>
    <span>Mute</span>`;
    document.getElementById("audio_button").innerHTML = html;
  }