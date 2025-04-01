import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Producto } from '../../Models/productos.model';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../Services/producto.service';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatAutocompleteModule],
  styleUrls: ['./productos.componente.scss']
})
export class ProductosComponent implements OnInit {
  myControl = new FormControl('1');
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
  categorias: Array<{ Id: string; Nombre: string }> = [];
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

      this.obtenerCategoriasFunc()
  }

  obtenerCategoriasFunc(){
    this._service.getCategoriasTA().subscribe({
      next: (data) => {
        console.log('Datos recibidos CAT:', data);
        this.categorias = data
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

  getTitle = (catId: string) => {
    return this.categorias.find(c => c.Id === catId)?.Nombre ?? '';
  }
  
  title = 'Aqui van los productos';
}
