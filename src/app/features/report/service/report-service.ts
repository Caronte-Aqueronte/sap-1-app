import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmployeeReport } from '../model/EmployeeReport';
import { IncomeReport } from '../model/IncomeReport';
import { StayDiningReport } from '../model/StayDiningReport';
import { MostPopularRoomReport } from '../model/MostPopularRoomReport';

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

  /**
   * Reporte combinado de estancias y consumos por cliente
   *
   * @param params.clientId id del cliente
   * @param params.startDate fecha inicio
   * @param params.endDate fecha fin
   * @returns Observable con StayDiningReport
   */
  getStayDiningReport(params: {
    clientId: string;
    startDate: string;
    endDate: string;
    establishmentId: string | null;
  }): Observable<StayDiningReport> {
    let httpParams = new HttpParams()
      .set('clientId', params.clientId)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);

    if (params.establishmentId) {
      httpParams = httpParams.set('establishmentId', params.establishmentId);
    }
    return this.http.get<StayDiningReport>(
      `${this.path}/stay-dining/by-client`,
      { params: httpParams }
    );
  }

  /**
   * Exporta a PDF el combinado de estancias y consumos por cliente
   *
   * @param params.clientId id del cliente
   * @param params.startDate fecha inicio
   * @param params.endDate fecha fin
   * @returns Observable con StayDiningReport
   */
  exportStayDiningReport(params: {
    clientId: string;
    startDate: string;
    endDate: string;
    establishmentId: string | null;
  }): Observable<HttpResponse<Blob>> {
    let httpParams = new HttpParams()
      .set('clientId', params.clientId)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);

    if (params.establishmentId) {
      httpParams = httpParams.set('establishmentId', params.establishmentId);
    }
    return this.http.get(`${this.path}/stay-dining/by-client/export`, {
      params: httpParams,
      observe: 'response',
      responseType: 'blob',
    });
  }

  /**
   * Obtiene el reporte de empleados
   */
  getEmployeeReport(params: {
    establishmentId: string | null;
  }): Observable<EmployeeReport> {
    let httpParams = new HttpParams();

    if (params.establishmentId) {
      httpParams = httpParams.set('establishmentId', params.establishmentId);
    }
    return this.http.get<EmployeeReport>(
      `${this.path}/employees/by-establishment`,
      { params: httpParams }
    );
  }

  /**
   * Exporta a PDF del reporte de empleados
   */
  exportEmployeeReport(params: {
    establishmentId: string | null;
  }): Observable<HttpResponse<Blob>> {
    let httpParams = new HttpParams();

    if (params.establishmentId) {
      httpParams = httpParams.set('establishmentId', params.establishmentId);
    }
    return this.http.get(`${this.path}/employees/by-establishment/export`, {
      params: httpParams,
      observe: 'response',
      responseType: 'blob',
    });
  }

  /**
   * Obtiene el reporte de popularidad de una room
   */
  getMostPopularRoomReport(params: {
    establishmentId: string | null;
  }): Observable<MostPopularRoomReport> {
    let httpParams = new HttpParams();

    if (params.establishmentId) {
      httpParams = httpParams.set('establishmentId', params.establishmentId);
    }

    return this.http.get<MostPopularRoomReport>(`${this.path}/most-popular-room`, {
      params: httpParams,
    });
  }

  /**
   * Exporta a PDF  el reporte de popularidad de una room
   */
  exportMostPopularRoomReport(params: {
    establishmentId: string | null;
  }): Observable<HttpResponse<Blob>> {
    let httpParams = new HttpParams();

    if (params.establishmentId) {
      httpParams = httpParams.set('establishmentId', params.establishmentId);
    }
    return this.http.get(`${this.path}/most-popular-room/export`, {
      params: httpParams,
      observe: 'response',
      responseType: 'blob',
    });
  }
}
