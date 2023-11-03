import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
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
  clienteSeleccionado: Cliente;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
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

    this.modalService.notificarUpload.subscribe((cliente) => {
      this.clientes = this.clientes.map((clienteOriginal) => {
        if (cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
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

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
