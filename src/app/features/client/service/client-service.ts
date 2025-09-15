import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Client } from '../model/Client';
import { Observable } from 'rxjs';
import { CreateClientRequestDTO } from '../model/CreateClientRequestDTO';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private clientPath = environment.apiUrl + '/v1/clients';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los clientes
   * @returns lista de clientes
   */
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.clientPath}`);
  }

  /**
   * obtiene un cliente por id interno
   *
   * @param id identificador interno del cliente
   * @return observable con el cliente encontrado
   */
  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.clientPath}/by-id/${id}`);
  }

  /**
   * obtiene un cliente por su numero de identificacion nacional
   *
   * @param nationalId identificacion nacional del cliente
   * @return observable con el cliente encontrado
   */
  getClientByNationalId(nationalId: string): Observable<Client> {
    return this.http.get<Client>(
      `${this.clientPath}/national-id/${nationalId}`
    );
  }

  /**
   * crea un nuevo cliente en el sistema
   *
   * @param body datos del cliente a crear
   * @return observable con el cliente creado
   */
  createClient(body: CreateClientRequestDTO): Observable<Client> {
    return this.http.post<Client>(`${this.clientPath}/create`, body);
  }
}
