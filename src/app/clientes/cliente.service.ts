import { Injectable } from '@angular/core';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }

  getClientes(page: number): Observable<any> {
    return this.http.get<any>(this.urlEndPoint + '/page/' + page);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post<Cliente>(this.urlEndPoint, cliente, { headers: this.httpHeaders })
      .pipe(
        catchError((e) => {
          if ((e.status = 400)) {
            return throwError(e);
          }

          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      // Manejo de error
      catchError((e) => {
        this.router.navigate(['clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(id: number, clienteData: Cliente): Observable<Cliente> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put<Cliente>(url, clienteData).pipe(
      catchError((e) => {
        if ((e.status = 400)) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http
      .delete<Cliente>(`${this.urlEndPoint}/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    const req = new HttpRequest(
      'POST',
      `${this.urlEndPoint}/upload`,
      formData,
      {
        reportProgress: true,
      }
    );

    return this.http.request(req);
  }
}
