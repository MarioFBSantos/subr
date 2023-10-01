// room.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  private rooms: Map<string, string> = new Map();

  setOwner(clientId: string, roomId: string) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, clientId);
    }
  }

  isOwner(clientId: string, roomId: string): boolean {
    const ownerClientId = this.rooms.get(roomId);
    return ownerClientId === clientId;
  }

  clearOwner(roomId: string) {
    this.rooms.delete(roomId);
  }
}
