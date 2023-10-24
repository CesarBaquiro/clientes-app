import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent implements OnInit {
  @Input() paginador: any;
  constructor() {}

  paginas: number[];

  ngOnInit() {
    this.paginas = new Array(this.paginador.totalPages)
      .fill(0)
      .map((_valor, indice) => indice + 1);
  }
}
