/**
 * dto que representa errores de api rest
 */
export class RestApiErrorDTO {
  readonly messages: string[];

  constructor(messages: string[]) {
    this.messages = messages;
  }
}
