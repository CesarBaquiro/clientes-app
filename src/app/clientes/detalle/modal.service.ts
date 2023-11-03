import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modal: boolean = false;
  //El guion bajo  _  se usa en typescript para diferenciar el atributo del metodo getter
  private _notificarUpload = new EventEmitter<any>();

  constructor() {}

  get notificarUpload(): EventEmitter<any> {
    return this._notificarUpload;
  }

  abrirModal() {
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }
}
