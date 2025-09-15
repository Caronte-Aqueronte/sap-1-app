import { Injectable } from '@angular/core';
import { RestApiErrorDTO } from '../model/error/RestApiErrorDTO';

@Injectable({
  providedIn: 'root',
})
export class ErrorRenderService {
  /**
   * genera un mensaje unico a partir de una lista de errores
   *
   * @param error dto de errores de api
   * @returns string con los errores concatenados por salto de linea
   */
  render(error: RestApiErrorDTO): string {
    if (!error || !error.messages || error.messages.length === 0) {
      return 'ocurrio un error inesperado';
    }
    return error.messages.join('\n');
  }
}
