/**
 * DTO utilizado en la capa web (REST) para la respuesta de inicio de sesión.
 * 
 * @author Luis Monterroso
 * @version 1.0
 * @since 2025-08-19
 */
export class LoginResponseDTO {
  private _userId: string;
  private _role: string;
  private _firstName: string;
  private _jwt: string;

  constructor(userId: string, role: string, firstName: string, jwt: string) {
    this._userId = userId;
    this._role = role;
    this._firstName = firstName;
    this._jwt = jwt;
  }

  public get userId(): string {
    return this._userId;
  }
  public set userId(value: string) {
    this._userId = value;
  }

  public get role(): string {
    return this._role;
  }
  public set role(value: string) {
    this._role = value;
  }

  public get firstName(): string {
    return this._firstName;
  }
  public set firstName(value: string) {
    this._firstName = value;
  }

  public get jwt(): string {
    return this._jwt;
  }
  public set jwt(value: string) {
    this._jwt = value;
  }
}
