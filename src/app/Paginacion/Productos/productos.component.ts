import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { agregarProducto, selectProductos } from '../../Reducer/actions/productos.actions';
import { Producto } from '../../Reducer/states/productos.states';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  productos$!: Observable<Producto[]>;

  constructor(private store: Store) {}
  
  ngOnInit(): void {
    this.productos$ = this.store.select(selectProductos);
  }

  agregar() {
    const nuevoProducto: Producto = {
        id: 2,
        nombre: 'Mouse Gamer',
        precio: 50,
        stock: 20,
        descripcion: 'asdasd',
        categoria: 'sadasd',
        imagen: 'asdasd'
    };
    //this.store.dispatch(agregarProducto({ producto: nuevoProducto }));
  }
  
  title = 'Aqui van los productos';
}
