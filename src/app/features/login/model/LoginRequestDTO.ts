/**
 * DTO utilizado en la capa web (REST) para la solicitud de inicio de sesión.
 * 
 * @author Luis Monterroso
 * @version 1.0
 * @since 2025-08-19
 */
export class LoginRequestDTO {

  private email: string;
  private password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

 
}
