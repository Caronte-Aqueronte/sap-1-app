import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Client } from '../model/Client';
import { Observable } from 'rxjs';
import { CreateClientRequestDTO } from '../model/CreateClientRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
    private clientPath = environment.apiUrl + '/v1/clients';

  constructor(private http: HttpClient) {}

  getClientByNationalId(nationalId: string): Observable<Client> {
    return this.http.get<Client>(`${this.clientPath}/national-id/${nationalId}`);
  }

  createClient(body: CreateClientRequestDTO): Observable<Client> {
    return this.http.post<Client>(`${this.clientPath}/create`, body);
  }
}
