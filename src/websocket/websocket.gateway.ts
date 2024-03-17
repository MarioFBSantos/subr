import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import fs from 'fs';
@WebSocketGateway({
	cors: {
		origin: '*',
		allowedHeaders: ['Content-Type'],
	},
})
@Injectable()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private connectedClients: Map<string, Socket> = new Map();
	private receivedWords: string[] = [];

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
		// this.connectedClients.set(client.id, client);
		client.join('room1');
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		this.connectedClients.delete(client.id);
	}

	@SubscribeMessage('sendWords')
	handleReceivedWords(client: Socket, wordsString: string) {
		console.log(wordsString);
		this.server.to('room1').emit('wordsReceived', wordsString);
		console.log(`Emitted wordsReceived with data: ${wordsString}`);

		fs.appendFile('words.txt', wordsString, function (err) {
			if (err) throw err;
		});
	}

	@SubscribeMessage('wordsReceived')
	handleWordsReceived(client: Socket, wordsString: string) {
		this.server.to('room1').emit('wordsReceived', wordsString);
	}

	@SubscribeMessage('checkRoom')
	handleCheckRoom(client: Socket, room: string) {
		const isClientInRoom = this.server.sockets.adapter.rooms.get(room)?.has(client.id);
		client.emit('checkRoomResponse', isClientInRoom);
	}

	@SubscribeMessage('joinRoom')
	handleJoinRoom(client: Socket, room: string) {
		// verify if room exists and verify if the client is already in the room
		const doesRoomExist = this.server.sockets.adapter.rooms.has(room);
		const isClientInRoom = doesRoomExist ? this.server.sockets.adapter.rooms.get(room).has(client.id) : false;
		client.emit('roomVerificationResponse', { room: room, exists: doesRoomExist, isClientInRoom: isClientInRoom });
		console.log('Joining room O QUE RECEBI: ' + room);
		if (doesRoomExist && !isClientInRoom) {
			client.join(room);
			console.log(`Client ${client.id} joined room ${room}`);
		}
		else {
			console.log('Room does not exist or client is already in room', doesRoomExist, isClientInRoom);
		}
	}
}
