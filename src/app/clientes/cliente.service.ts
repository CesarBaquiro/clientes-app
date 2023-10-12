import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.urlEndPoint);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post<Cliente>(this.urlEndPoint, cliente, { headers: this.httpHeaders })
      .pipe(
        catchError((e) => {
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

  // deleteCliente(id: number, clienteData: Cliente): Observable<Cliente> {
  //   const url = `${this.urlEndPoint}/${id}`;
  //   return this.http.put<Cliente>(url, clienteData);
  // }
}
