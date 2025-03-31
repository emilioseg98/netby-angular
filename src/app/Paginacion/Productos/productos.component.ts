import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Producto } from '../../Models/productos.model';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../Services/producto.service';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./productos.componente.scss']
})
export class ProductosComponent implements OnInit {
  productos: Producto[]=[];
  productoObj: Producto = {
    id: 0,
    nombre: "",
    categoria: '',
    superCategoria: '',
    descripcion: '',
    imagen: '',
    precio: 0,
    stock: 0,
    fecha_Creacion: ''
  }
  constructor(private _service:ProductoService) { }

  ngOnInit(): void {
      this._service.getAll().subscribe({
        next: (data) => {
          console.log('Datos recibidos:', data);
          this.productos = data
        },
        error: (err) => {
          if (err.status === 0) {
            console.error('Error de conexión: El servidor no responde o hay problemas de CORS');
          } else {
            console.error('Error:', err);
          }
        }
      })
  }

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = '';
  }
  
  
  title = 'Aqui van los productos';
}
