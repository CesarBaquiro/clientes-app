import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  public titulo: string = 'Crear cliente';

  public errores: string[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.clienteService
          .getCliente(id)
          .subscribe((cliente) => (this.cliente = cliente));
      }
    });
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      (response) => {
        this.router.navigate(['/clientes']);
        swal.fire(
          'Nuevo cliente',
          `Cliente ${this.cliente.nombre} creado con exito!`,
          'success'
        );
      },
      (err) => {
        this.errores = err.error.errors as string[];
        console.error('Codigo error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  public update(): void {
    this.clienteService.update(this.cliente.id, this.cliente).subscribe(
      (cliente) => {
        this.router.navigate(['/clientes']);
        swal.fire(
          'Cliente Actualizado',
          `Cliente ${this.cliente.nombre} actualizado con exito!`,
          'success'
        );
      },
      (err) => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desdee el backend' + err.status);
        console.error(err.error.errors);
      }
    );
  }
}
