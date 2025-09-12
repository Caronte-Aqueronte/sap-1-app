import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IncomeReport } from '../model/IncomeReport';

@Injectable({ providedIn: 'root' })
export class ReportService {

  private path = environment.apiUrl + '/v1/reports';
  constructor(private http: HttpClient) {}

  /**
   * Consulta reporte de ingresos por establecimiento
   *
   * @param params.establishmentId id del establecimiento
   * @param params.startDate fecha inicio en formato
   * @param params.endDate fecha fin en formato
   * @returns Observable con IncomeReport
   */
  getIncomeReport(params: {
    establishmentId: string;
    startDate: string;
    endDate: string;
  }): Observable<IncomeReport> {
    const httpParams = new HttpParams()
      .set('establishmentId', params.establishmentId)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);
    return this.http.get<IncomeReport>(`${this.path}/income/by-establishment`, {
      params: httpParams,
    });
  }

  /**
   * Exporta PDF del reporte de ingresos por establecimiento
   *
   * @param params.establishmentId id del establecimiento
   * @param params.startDate fecha inicio en formato
   * @param params.endDate fecha fin en formato
   * @returns Observable con HttpResponse<Blob> que contiene el PDF
   */
  exportIncomeReport(params: {
    establishmentId: string;
    startDate: string;
    endDate: string;
  }): Observable<HttpResponse<Blob>> {
    const httpParams = new HttpParams()
      .set('establishmentId', params.establishmentId)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);

    return this.http.get(`${this.path}/income/by-establishment/export`, {
      params: httpParams,
      observe: 'response',
      responseType: 'blob',
    });
  }
}
