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
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, 
    ReactiveFormsModule, MatAutocompleteModule, MatSelectModule, MatDatepickerModule],
  styleUrls: ['./productos.componente.scss']
})
export class ProductosComponent implements OnInit {
  private esCrearProducto: boolean;
  myControl = new FormControl('1');
  productos: Producto[]=[];
  mensajeProductos: string="";
  errors: any={};
  productoObj: Producto = {
    id: 0,
    nombre: "",
    categoriasProd: {
      id: '',
      nombre: '',
      supercategoria: ''
    },
    descripcion: '',
    imagen: '',
    precio: 0,
    stock: 0,
    fecha_Creacion: ''
  }
  categorias: Array<{ Id: string; Nombre: string, Supercategoria: string }> = [];
  constructor(private _service:ProductoService) { this.esCrearProducto = true; }

  public get getEsCrearProducto(): boolean {
    return this.esCrearProducto;
  }

  public set setEsCrearProducto(val: boolean) {
    this.esCrearProducto = val;
  }

  ngOnInit(): void {
      this._service.getAll().subscribe({
        next: (data) => {
          console.log('Datos recibidos:', data);
          if (data) this.productos = data
          else this.mensajeProductos = "No existen datos";
        },
        error: (err) => {
          if (err.status === 0) {
            console.error('Error de conexión: El servidor no responde o hay problemas de CORS');
          } else {
            console.error('Error:', err);
          }
          this.mensajeProductos = "Hubo un error con el sistema, por favor contactarse con el administrador!!!"
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
  isModalConfirmationOpen = false;

  openModal() {
    this.isModalOpen = true;
    /* document.body.style.overflow = 'hidden'; */
  }
  
  closeModal() {
    this.isModalOpen = false;
    this.esCrearProducto = true;
    /* document.body.style.overflow = ''; */
  }

  openModalConfirmation() {
    this.isModalConfirmationOpen = true;
  }

  closeModalConfirmation(aceptar: boolean) {
    this.isModalConfirmationOpen = false;
    console.log(aceptar)

    if(aceptar){
      console.log("ENTRAAAA!!!!")
      if(this.getEsCrearProducto) this.crearProducto()
      else this.actualizarProducto(this.productoObj.id)
      this.closeModal();
    }else{
      console.log("no entra")
    }
  }

  obtenerProductoFunc(data: any) {
    this.openModal()
    this.setEsCrearProducto = false;
    this._service.obtenerProducto(data.id).subscribe({
      next: (data) => {
        console.log("PRODUCTO: ", data)
        this.productoObj = data
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

  getTitle = (catId: string) => {
    return this.categorias.find(c => c.Id === catId)?.Nombre ?? '';
  }

  log(data: any){
    console.log("CATEGORIAS asdasda: ", data)
  }

  validarErrores () {
    const newErrors: any={};

    if(!this.productoObj.nombre){
      newErrors.nombre = "Campo Requerido!"
    }

    if(!this.productoObj.categoriasProd.Nombre){
      newErrors.categoria = "Campo Requerido!"
    }

    if(!this.productoObj.precio){
      newErrors.precio = "Campo Requerido!"
    }

    if(!this.productoObj.stock){
      newErrors.stock = "Campo Requerido!"
    }

    if(!this.productoObj.descripcion){
      newErrors.descripcion = "Campo Requerido!"
    }

    if(!this.productoObj.fecha_Creacion){
      newErrors.fecha = "Campo Requerido!"
    }

    this.errors = newErrors;

    if (Object.keys(newErrors).length === 0) {
      /* if(this.getEsCrearProducto) this.crearProducto()
      else this.actualizarProducto(this.productoObj.id) */
      this.openModalConfirmation()
      console.log("asdasdads")
    } 
  }

  crearProducto () {
    console.log("asdasd", this.productoObj);
    var prod = {
      ...this.productoObj,
      categoriaId: (this.productoObj.categoriasProd as any)["Id"]
    }
    this._service.agregarProductos(prod).subscribe({
      next: (data) => {
        this.closeModal()
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

  actualizarProducto (id: number) {
    var prod = {
      ...this.productoObj,
      categoriaId: (this.productoObj.categoriasProd as any)["Id"]
    }
    this._service.actualizarProducto(id, prod).subscribe({
      next: (data) => {
        this.closeModal()
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
  
  title = 'Aqui van los productos';
}
