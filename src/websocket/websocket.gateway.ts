import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SpeechClient } from '@google-cloud/speech';

@WebSocketGateway({
	cors: {
		origin: '*',
		allowedHeaders: ['Content-Type'],
	},
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private audioStreamClients: Map<string, Socket> = new Map();

	private speechClient: SpeechClient;

	constructor() {
		this.speechClient = new SpeechClient();
	}

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
		// Adicione o cliente à lista de clientes de streaming
		this.audioStreamClients.set(client.id, client);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		// Remova o cliente da lista de clientes de streaming
		this.audioStreamClients.delete(client.id);
	}

	@SubscribeMessage('audioStream')
	async handleAudioStream(client: Socket, audioData: Buffer) { // Usar Buffer em vez de Blob
		// Enviar o áudio para outros clientes de streaming (se necessário)
		for (const [, targetClient] of this.audioStreamClients) {
			if (targetClient.id !== client.id) {
				targetClient.emit('audioStream', audioData); // Usar audioData em vez de audioBlob
			}
		}

		// Transcrição do áudio
		try {
			const [response] = await this.speechClient.recognize({
				audio: {
					content: audioData, // Usar audioData diretamente
				},
				config: {
					encoding: 'LINEAR16',
					sampleRateHertz: 16000,
					languageCode: 'en-US',
				},
			});

			const transcription = response.results
				.map((result) => result.alternatives[0].transcript)
				.join('\n');

			// Envie a transcrição para o cliente que enviou o áudio
			client.emit('transcription', transcription);
		} catch (error) {
			// Trate o erro do WebSocket aqui
			console.error('WebSocket error:', error);

			// Se desejar, você pode emitir um evento de erro para o cliente
			// client.emit('websocketError', 'Ocorreu um erro na conexão WebSocket');
		}
	}
}
