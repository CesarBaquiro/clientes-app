import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginador: any;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      //Tomamos la paginacion de los parametros
      let page: number = +params.get('page');
      // Si la pagina no viene por parametro sera igual a 0, que es el valor de la primera pagina
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).subscribe((clientes) => {
        this.clientes = clientes.content;
        this.paginador = clientes;
      });
    });
  }

  public delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Estas seguro?',
        text: `Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clienteService.delete(cliente.id).subscribe((response) => {
            this.clientes = this.clientes.filter((cli) => cli !== cliente);

            swalWithBootstrapButtons.fire(
              'Cliente eliminado!',
              'Cliente eliminado con exito',
              'success'
            );
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Eliminacion cancelada',
            'error'
          );
        }
      });
  }
}
