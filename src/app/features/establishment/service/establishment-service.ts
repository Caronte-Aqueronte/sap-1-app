import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Establishment } from '../model/Establishment';

@Injectable({
  providedIn: 'root',
})
export class EstablishmentService {
  private path = environment.apiUrl + '/v1/establishments';
  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los establecimientos.
   * @returns lista de establecimientos
   */
  public getAll(): Observable<Establishment[]> {
    return this.http.get<Establishment[]>(this.path);
  }

  /**
   * Obtiene un establecimiento por id.
   * @param id identificador del establecimiento
   * @returns establecimiento encontrado
   */
  public getById(id: string): Observable<Establishment> {
    return this.http.get<Establishment>(`${this.path}/${id}`);
  }
}
