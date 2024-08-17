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


	@SubscribeMessage('connect')
	async handleConnection(client: Socket, room: string) {
		console.log(room);
		client.join(room);
		client.rooms.add(room);
		console.log(`Client connected: ${client.id} ${room}`);
		// this.connectedClients.set(client.id, client);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		this.connectedClients.delete(client.id);
	}

	@SubscribeMessage('sendWords')
	handleReceivedWords(client: Socket, wordsString: string, room: string) {
		console.log(wordsString);
		this.server.to(room).emit('wordsReceived', wordsString);
		console.log(`Emitted wordsReceived with data: ${wordsString}`);

		fs.appendFile('words.txt', wordsString, function (err) {
			if (err) throw err;
		});
	}

	@SubscribeMessage('wordsReceived')
	handleWordsReceived(client: Socket, wordsString: string, room: string) {
		this.server.to(room).emit('wordsReceived', room, room);
	}

	@SubscribeMessage('checkRoom')
	handleCheckRoom(client: Socket, room: string) {
		const isClientInRoom = this.server.sockets.adapter.rooms.get(room)?.has(client.id);
		client.emit('checkRoomResponse', isClientInRoom);
	}

	@SubscribeMessage('joinRoom')
	handleJoinRoom(client: Socket, room: string) {
		client.join(room);
		console.log(`Client joined room: ${room}`);
		console.log(`Client connected: ${client.id} ${[...client.rooms]}`);
	}

	async createRoom(room: string, client: Socket) {
		client.join(room);
		this.server.to(room).emit('roomCreated', room);
		console.log(`Client joined room: ${room}`);
	}
}
