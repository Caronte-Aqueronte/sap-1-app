import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequestDTO } from '../model/login/LoginRequestDTO';
import { LoginResponseDTO } from '../model/login/LoginResponseDTO';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private path = environment.apiUrl + '/v1/auth';
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Realiza la petición de inicio de sesión contra el backend.
   *
   * @param body DTO con email y password
   * @returns Observable<LoginResponseDTO> con los datos del usuario autenticado
   */
  public login(body: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.path}/login`, body).pipe(
      tap((resp: LoginResponseDTO) => {
        this.saveSession(resp); //guarda en el localstorage la sesion
      })
    );
  }

  public getUserFirstName(): String {
    return localStorage.getItem(environment.firstClaimName)!;
  }

  /**
   * Elimina los datos de sesión del almacenamiento local y redirige al login.
   */
  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  /**
   * Persiste los datos de sesión (token, rol, userId) en el almacenamiento local.
   *
   * @param resp objeto con la respuesta del backend al iniciar sesión
   */
  private saveSession(resp: LoginResponseDTO) {
    localStorage.setItem(environment.jwtClaimName, resp.jwt);
    localStorage.setItem(environment.roleClaimName, resp.role);
    localStorage.setItem(environment.userClaimId, resp.userId);
    localStorage.setItem(environment.firstClaimName, resp.firstName);
  }
}
