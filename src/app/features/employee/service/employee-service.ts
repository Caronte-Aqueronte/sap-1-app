import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Employee } from '../model/Employee';
import { SaveEmployeeRequestDTO } from '../model/SaveEmployeeRequestDTO';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private path = environment.apiUrl + '/v1/employees';

  constructor(private http: HttpClient) {}

  /**
   * Crea un nuevo empleado.
   *
   * @param body datos requeridos para crear el empleado
   * @returns observable vacío en caso de éxito
   */
  create(body: SaveEmployeeRequestDTO): Observable<void> {
    return this.http.post<void>(this.path, body);
  }

  /**
   * Crea un nuevo empleado.
   *
   * @param body datos requeridos para crear el empleado
   * @returns observable vacío en caso de éxito
   */
  update(body: SaveEmployeeRequestDTO, employeeId: String): Observable<void> {
    return this.http.patch<void>(`${this.path}/${employeeId}`, body);
  }

  /**
   * Lista empleados.
   *
   * @param establishmentId id de establecimiento opcional para filtrar
   * @returns lista de empleados
   */
  getAll(establishmentId?: string | null): Observable<Employee[]> {
    const params = establishmentId
      ? new HttpParams().set('establishmentId', establishmentId)
      : undefined;
    return this.http.get<Employee[]>(this.path, { params });
  }

  /**
   * Obtiene un empleado por su id.
   *
   * @param id identificador del empleado
   * @returns empleado encontrado
   */
  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.path}/${id}`);
  }
}
