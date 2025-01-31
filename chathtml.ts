// <!DOCTYPE html >
//     <html lang="en" >
//         <head>
//         <meta charset="UTF-8" />
//             <meta name="viewport" content = "width=device-width, initial-scale=1.0" />
//                 <title>Real - Time Chat and Call </title>
//                     < script src = "https://cdn.socket.io/4.8.1/socket.io.min.js" > </script>
//                         </head>
//                         < body >
//                         <h1>Real - Time Chat and Call </h1>

//                             < div >
//                             <h2>Chat </h2>
//                             < div id = "messages" style = "border: 1px solid #ccc; height: 300px; overflow-y: auto;" > </div>
//                                 < input type = "text" id = "messageInput" placeholder = "Type your message..." />
//                                     <button id="sendMessage" > Send </button>
//                                         </div>

//                                         < div >
//                                         <h2>Call </h2>
//                                         < button id = "startAudioCall" > Start Audio Call </button>
//                                             < button id = "startVideoCall" > Start Video Call </button>
//                                                 < button id = "endCall" > End Call </button>

//                                                     < div >
//                                                     <video id="localVideo" autoplay muted style = "width: 300px;" > </video>
//                                                         < video id = "remoteVideo" autoplay style = "width: 300px;" > </video>
//                                                             </div>
//                                                             </div>

//                                                             < div id = "incomingCall" style = "display:none;" >
//                                                                 <p>Incoming call...</p>
//                                                                     < button id = "acceptCall" > Accept </button>
//                                                                         < button id = "rejectCall" > Reject </button>
//                                                                             </div>

//                                                                             <script>
// const socket = io("http://localhost:4000");

// const messagesDiv = document.getElementById("messages");
// const messageInput = document.getElementById("messageInput");
// const sendMessageBtn = document.getElementById("sendMessage");

// const roomId = "test here"; // Replace with your dynamic roomId
// const senderId = "67932e748a982e1b3daf153a";
// const receiverId = "67907cc5ed2e37884b865c7f";

// // Call-related variables
// const startAudioCallBtn = document.getElementById('startAudioCall');
// const startVideoCallBtn = document.getElementById('startVideoCall');
// const endCallBtn = document.getElementById('endCall');
// const localVideo = document.getElementById('localVideo');
// const remoteVideo = document.getElementById('remoteVideo');
// const incomingCallDiv = document.getElementById('incomingCall');
// const acceptCallBtn = document.getElementById('acceptCall');
// const rejectCallBtn = document.getElementById('rejectCall');

// let localStream;
// let peerConnection;
// let callType;

// const config = {
//     iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//     ],
// };

// socket.on("connect", () => {
//     console.log("Connected to server:", socket.id);
//     socket.emit("joinRoom", { roomId });
// });

// // Chat Message
// sendMessageBtn.addEventListener("click", () => {
//     const message = messageInput.value;
//     if (message.trim()) {
//         socket.emit("sendMessage", { roomId, senderId, receiverId, message });
//         messageInput.value = "";
//         messagesDiv.innerHTML += `<p><b>You:</b> ${message}</p>`;
//     }
// });

// socket.on("newMessage", (data) => {
//     messagesDiv.innerHTML += `<p><b>${data.senderId}:</b> ${data.message}</p>`;
// });

// // Call Buttons Logic
// async function startCall(type) {
//     callType = type;
//     localStream = await navigator.mediaDevices.getUserMedia(
//         type === 'audio' ? { audio: true } : { video: true, audio: true }
//     );
//     localVideo.srcObject = localStream;

//     peerConnection = new RTCPeerConnection(config);
//     localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

//     peerConnection.ontrack = (event) => {
//         remoteVideo.srcObject = event.streams[0];
//     };

//     peerConnection.onicecandidate = (event) => {
//         if (event.candidate) {
//             socket.emit('webrtc_ice_candidate', {
//                 roomId,
//                 candidate: event.candidate,
//             });
//         }
//     };

//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);

//     socket.emit(type === 'audio' ? 'audiocall' : 'videocall', {
//         roomId,
//         senderId,
//         receiverId,
//     });

//     socket.emit('webrtc_offer', { roomId, sdp: offer });
// }

// startAudioCallBtn.addEventListener('click', () => startCall('audio'));
// startVideoCallBtn.addEventListener('click', () => startCall('video'));

// // Incoming Call Logic
// socket.on('videocall', () => {
//     incomingCallDiv.style.display = 'block';
// });

// socket.on('audiocall', () => {
//     incomingCallDiv.style.display = 'block';
// });

// acceptCallBtn.addEventListener('click', async () => {
//     incomingCallDiv.style.display = 'none';
//     socket.emit('videocallanswer', { roomId, answer: true });

//     // Answer the call by creating an answer
//     peerConnection = new RTCPeerConnection(config);
//     peerConnection.ontrack = (event) => {
//         remoteVideo.srcObject = event.streams[0];
//     };

//     peerConnection.onicecandidate = (event) => {
//         if (event.candidate) {
//             socket.emit('webrtc_ice_candidate', {
//                 roomId,
//                 candidate: event.candidate,
//             });
//         }
//     };

//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);

//     socket.emit('webrtc_answer', { roomId, sdp: answer });
// });

// rejectCallBtn.addEventListener('click', () => {
//     incomingCallDiv.style.display = 'none';
//     socket.emit('videocallanswer', { roomId, answer: false });
// });

// // Handle WebRTC Signals
// socket.on('webrtc_offer', async (event) => {
//     peerConnection = new RTCPeerConnection(config);
//     peerConnection.ontrack = (event) => remoteVideo.srcObject = event.streams[0];
//     peerConnection.onicecandidate = (event) => {
//         if (event.candidate) {
//             socket.emit('webrtc_ice_candidate', { roomId, candidate: event.candidate });
//         }
//     };

//     const desc = new RTCSessionDescription(event.sdp);
//     await peerConnection.setRemoteDescription(desc);

//     localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     localVideo.srcObject = localStream;

//     localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);

//     socket.emit('webrtc_answer', { roomId, sdp: answer });
// });

// socket.on('webrtc_answer', async (event) => {
//     const desc = new RTCSessionDescription(event.sdp);
//     await peerConnection.setRemoteDescription(desc);
// });

// socket.on('webrtc_ice_candidate', (event) => {
//     const candidate = new RTCIceCandidate(event.candidate);
//     peerConnection.addIceCandidate(candidate);
// });

// endCallBtn.addEventListener('click', () => {
//     socket.emit('end_call', roomId);
//     if (peerConnection) {
//         peerConnection.close();
//         peerConnection = null;
//     }
//     if (localStream) {
//         localStream.getTracks().forEach((track) => track.stop());
//     }
//     localVideo.srcObject = null;
//     remoteVideo.srcObject = null;
// });

// socket.on('end_call', () => {
//     if (peerConnection) {
//         peerConnection.close();
//         peerConnection = null;
//     }
//     if (localStream) {
//         localStream.getTracks().forEach((track) => track.stop());
//     }
//     localVideo.srcObject = null;
//     remoteVideo.srcObject = null;
// });
// </script>
//     </body>
//     </html>
