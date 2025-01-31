import { Server, Socket } from 'socket.io';
import Chat from '../models/chatModel';
import Message from '../models/messageModel';
import { updateCallStatus } from '../controllers/callController';
import { string } from 'joi';

export const setupSocket = (io: Server) => {
  console.log('socket start');

  // io.on('connection', (client: Socket) => {
  //   client.on('joinRoom', ({ roomId }) => {
  //     client.join(roomId);
  //     console.log(`Client ${client.id} joined room: ${roomId}`);
  //   });
  //   console.log(`Client connected: ${client.id}`);

  //   client.on('audiocall', async ({ roomId, senderId, receiverId }) => {
  //     console.log(`Audio call initiated in room: ${roomId}`);

  //     const newChat = new Chat({
  //       senderId,
  //       receiverId,
  //       roomId,
  //       callType: 'audio',
  //       callStatus: 'ongoing',
  //     });
  //     await newChat.save();

  //     client.broadcast.emit(`${roomId}_audiocall`, 'joincall');
  //   });

  //   client.on('audiocallanswer', async ({ roomId, answer }) => {
  //     console.log(`Audio call answer received for room: ${roomId}`);
  //     client.broadcast.emit(`${roomId}_audiocallanswer`, { answer });

  //     const chat = await Chat.findOne({ roomId });
  //     if (chat) {
  //       chat.callStatus = answer ? 'ongoing' : 'ended';
  //       await chat.save();
  //     }
  //   });

  //   client.on('sendMessage', async ({ roomId, senderId, receiverId, message }) => {
  //     console.log(`New message sent in room ${roomId}`);

  //     const dataChat = await Chat.find({
  //       $or: [
  //         { senderId: senderId, receiverId: receiverId },
  //         { senderId: receiverId, receiverId: senderId },
  //       ],
  //     });

  //     if (dataChat.length > 0) {
  //       let roomS = JSON.stringify(dataChat[0].senderId);
  //       let roomR = JSON.stringify(dataChat[0].senderId);
  //       let check = await Message.findOne(
  //         {
  //           $or: [
  //             { roomId: roomS + roomR },
  //             { roomId: roomR + roomS },
  //           ],
  //         },
  //       );

  //       await Message.updateOne(
  //         {
  //           $or: [
  //             { roomId: roomS + roomR },
  //             { roomId: roomR + roomS },
  //           ],
  //         },
  //         {
  //           $addToSet: {
  //             message: {
  //               message: message,
  //               senderId: senderId,
  //               reciverId: receiverId,
  //               type: 'text',
  //               view: '0',
  //             },
  //           },
  //         },
  //       );
  //     } else {
  //       const newchat = new Chat({ roomId, senderId, receiverId, callType: 'text' });
  //       await newchat.save();
  //       const newMessage = new Message({
  //         roomId: senderId + receiverId,
  //         message: [
  //           {
  //             senderId,
  //             receiverId,
  //             message,
  //             type: 'text',
  //             view: '0',
  //           },
  //         ],
  //       });
  //       await newMessage.save();
  //     }


let rooms:{[key: string]: any} = {}

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', ({ senderId, receiverId, roomId }) => {
        socket.join(roomId);
        rooms[roomId] = rooms[roomId] || {};
        rooms[roomId][socket.id] = { senderId, receiverId };
        console.log(`User ${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit('user-joined', { senderId });
    });

    socket.on('sendMessage', (message) => {
    const { senderId, receiverId, roomId } = message;
    socket.to(roomId).emit('newMessage', message);
    console.log('Message sent:', message);
  });

    // Handling video call
    socket.on('call-video', ({ senderId, receiverId, roomId }) => {
        socket.to(roomId).emit('incoming-video-call', { senderId });
    });

    socket.on('offer-video', ({ roomId, offer }) => {
        socket.to(roomId).emit('offer-video', offer);
    });

    socket.on('answer-video', ({ roomId, answer }) => {
        socket.to(roomId).emit('answer-video', answer);
    });

    socket.on('ice-candidate-video', ({ roomId, candidate }) => {
        socket.to(roomId).emit('ice-candidate-video', candidate);
    });

    // Handling audio call
    socket.on('call-audio', ({ senderId, receiverId, roomId }) => {
        socket.to(roomId).emit('incoming-audio-call', { senderId });
    });

    socket.on('offer-audio', ({ roomId, offer }) => {
        socket.to(roomId).emit('offer-audio', offer);
    });

    socket.on('answer-audio', ({ roomId, answer }) => {
        socket.to(roomId).emit('answer-audio', answer);
    });

    socket.on('end-call', ({ roomId }) => {
      socket.to(roomId).emit('call-ended');
  });

    socket.on('ice-candidate-audio', ({ roomId, candidate }) => {
        socket.to(roomId).emit('ice-candidate-audio', candidate);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        for (const room in rooms) {
            if (rooms[room][socket.id]) {
                delete rooms[room][socket.id];
                socket.to(room).emit('user-left', socket.id);
                break;
            }
        }
    });


});

};
