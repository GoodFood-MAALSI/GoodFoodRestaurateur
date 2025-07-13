import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Client } from './interfaces/client.interface';

@Injectable()
export class InterserviceService {
  constructor(private readonly httpService: HttpService) {}

  private readonly clientServiceUrl = process.env.CLIENT_SERVICE_URL;
  private readonly clientJwtSecret = process.env.CLIENT_SECRET;
  private readonly jwtExpiresIn = '1h';

  private generateJwtTokenForClient(): string {
    return jwt.sign(
      { role: 'interservice', service: 'client' },
      this.clientJwtSecret,
      {
        expiresIn: this.jwtExpiresIn,
      },
    );
  }

  async fetchClient(clientId: number): Promise<Client | null> {
    try {
      const route = `users/interservice/${clientId}`;
      const token = this.generateJwtTokenForClient();
      console.log(`Fetching client ${clientId} with token: ${token}`);
      const response = await firstValueFrom(
        this.httpService.get(`${this.clientServiceUrl}/${route}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
      console.log(`Client ${clientId} fetched successfully:`, response.data);
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération du client ${clientId}:`,
        error.response?.status,
        error.response?.data,
        error.message,
      );
      return null;
    }
  }
}