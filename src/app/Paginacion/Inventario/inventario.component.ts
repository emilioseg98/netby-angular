import { Component, ViewChild, ElementRef, OnInit, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { ListarTransaccion } from '../../Models/listarTransaccion.model';
import { TransaccionService } from '../../Services/transaccion.service';
import { GenerarTransaccion } from '../../Models/generarTransaccion';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, 
    ReactiveFormsModule, MatAutocompleteModule, MatSelectModule, MatDatepickerModule],
  styleUrls: ['./inventario.componente.scss']
})
export class InventarioComponent implements OnInit {
  private esCrearInventario: boolean;
  title = 'Aqui va el Inventario';
  //private esGenerarTransaccion: boolean;
  mensajeProductos: string="";
  errors: any={};
  transacciones: ListarTransaccion[]=[];
  transaccionObj: ListarTransaccion = {
    id: 0,
    producto: {
      id: '',
      nombre: ''
    },
    fecha_Compra: '',
    tipo_Transaccion: '',
    cantidad: 0,
    precio_Unitario: 0,
    precio_Total: 0,
    detalle: ''
  }
  productos: Array<{ id: string; nombre: string, precio: number, stock: number }> = [];

  tipo_transaccion: Array<string> = ['COMPRA', 'VENTA']

  isModalOpen = false;
  isModalConfirmationGlobalOpen = false;
  isModalConfirmationOpen = false;
  isAviso = false;

  mensajeEnvio: string="";

  modalConfirmationSubMessage: string=""

  constructor(private _service:TransaccionService) { this.esCrearInventario = true; }

  openModal() {
    if (this.esCrearInventario) {
      this.modalConfirmationSubMessage = "Seguro que desea agregar la transacción?"
      this.limpiarDatos();
    } else {
      this.modalConfirmationSubMessage = "Seguro que desea editar la transacción?"
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.esCrearInventario = true;
    this.isModalConfirmationOpen = false;
    this.isAviso = false;
    /* document.body.style.overflow = ''; */
  }

  openModalConfirmationGlobal() {
    this.isModalConfirmationGlobalOpen = true;
  }

  closeModalConfirmationGlobal(aceptar: boolean) {
    //this.isModalConfirmationGlobalOpen = false;
    if (aceptar) {
      this.isAviso = true;
      this._service.eliminarTransaccion(this.transaccionObj.id).subscribe({
        next: (data) => {
          console.log(data.message)
          this.mensajeEnvio = "Se eliminó con éxito el registro!!"
          this.obtenerTransaccionesFunc();
          this.obtenerProductosFunc();
        },
        error: (err) => {
          if (err.status === 0) {
            console.error('Error de conexión: El servidor no responde o hay problemas de CORS');
          } else {
            console.error('Error:', err);
          }
          this.mensajeEnvio = err.error.Message
        }
      })
    }
    else {
      this.isModalConfirmationGlobalOpen = false;
      this.isAviso = false;
    }
  }

  openModalConfirmation() {
    this.isModalConfirmationOpen = true;
  }

  closeModalConfirmation(aceptar: boolean) {

    if(aceptar){
      this.isAviso = true;
      console.log("ENTRAAAA!!!!")
      if(this.esCrearInventario) this.crearTransaccion()
      else this.actualizarTransaccion(this.transaccionObj.id)
    }else{
      console.log("no entra: ", this.transaccionObj)
      this.closeModal();
    }
  }

  obtenerTransaccionFunc(data: any) {
    this.esCrearInventario = false
    this.openModal();
    this._service.obtenerTransaccion(data.id).subscribe({
      next: (data) => {
        this.transaccionObj = data;
        this.transaccionObj.producto = (data as any)['productosTrans']
        console.log("asdas: ", data)
      },
      error: (err) => {
        if (err.status === 0) {
          console.error('Error de conexión: El servidor no responde o hay problemas de CORS');
        } else {
          console.error('Error:', err);
        }
        this.mensajeEnvio = err.error.Message
      }
    })
  }

  eliminarTransaccionFunc(data: any) {
    this.modalConfirmationSubMessage = "Seguro que desea eliminar este registro?"
    this.transaccionObj = data
    this.openModalConfirmationGlobal()
  }

  ngOnInit(): void {
    this.obtenerTransaccionesFunc();

    this.obtenerProductosFunc();
  }

  compareProducto(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  obtenerTransaccionesFunc(){
    this._service.getAllTransacciones().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        if (data) {
          this.transacciones = data.map(tr => ({
            ...tr,
            producto: (tr as any)["productosTrans"]
          }))
        }
        else this.mensajeProductos = "No existen Datos";
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
  }

  obtenerProductosFunc(){
    this._service.getProductosTA().subscribe({
      next: (data) => {
        console.log('Datos recibidos CAT:', data);
        this.productos = data.map(cat => ({
          id: cat.Id,
          nombre: cat.Nombre,
          precio: cat.Precio,
          stock: cat.Stock
        }))
        console.log("Transformar Datos: ", this.productos)
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

  validarErrores () {
    const newErrors: any={};

    if (!this.transaccionObj.producto.nombre) {
      newErrors.producto = "Campo Requerido!";
    }

    if (!this.transaccionObj.fecha_Compra) {
      newErrors.fecha_compra = "Campo Requerido!";
    }

    if (!this.transaccionObj.tipo_Transaccion) {
      newErrors.tipo_transaccion = "Campo Requerido!";
    }

    if (!this.transaccionObj.cantidad) {
      newErrors.cantidad = "Campo Requerido!";
    }

    if (!this.transaccionObj.precio_Unitario) {
      newErrors.precio_unitario = "Campo Requerido!";
    }

    if (!this.transaccionObj.detalle) {
      newErrors.detalle = "Campo Requerido!";
    }

    this.errors = newErrors;

    console.log(newErrors)

    if (Object.keys(newErrors).length === 0) {
      this.openModalConfirmation()
    }
  }

  crearTransaccion () {
    var trans = {
      producto: this.transaccionObj.producto,
      productoId: this.transaccionObj.producto.id,
      fecha_Compra: this.transaccionObj.fecha_Compra,
      tipo_Transaccion: this.transaccionObj.tipo_Transaccion,
      cantidad: this.transaccionObj.cantidad,
      precio_Unitario: this.transaccionObj.precio_Unitario,
      detalle: this.transaccionObj.detalle
    }
    const precioTotal = this.transaccionObj.precio_Unitario*this.transaccionObj.cantidad
    if (this.transaccionObj.tipo_Transaccion === "VENTA") {
      if (this.transaccionObj.producto.stock >= this.transaccionObj.cantidad) {
        this._service.agregarTransaccion(trans).subscribe({
          next: (data) => {
            const obj = {
              Precio: this.transaccionObj.producto.precio + precioTotal,
              Stock: this.transaccionObj.producto.stock - this.transaccionObj.cantidad
            }
            this._service.actualizarFondos(this.transaccionObj.producto.id, obj).subscribe({
              next: (dataFondos) => {
                this.mensajeEnvio = "La transacción se ha realizado con éxito!!!"
                this.obtenerTransaccionesFunc()
                this.obtenerProductosFunc();
              },
              error: (err) => {
                if (err.status === 0) {
                  console.error('Error de conexión: El servidor no responde o hay problemas de CORS');
                } else {
                  console.error('Error:', err);
                }
              }
            })
          },
          error: (err) => {
            if (err.status === 0) {
              console.error('Error de conexión: El servidor no responde o hay problemas de CORS');
            } else {
              console.error('Error:', err);
            }
            this.mensajeEnvio = err.error.Message
          }
        })
      } else {
        this.mensajeEnvio = "Insuficiente Stock"
      }
    } else{
      if (this.transaccionObj.producto.precio >= precioTotal) {
        this._service.agregarTransaccion(trans).subscribe({
          next: (data) => {

            const obj = {
              Precio: this.transaccionObj.producto.precio - precioTotal,
              Stock: this.transaccionObj.producto.stock + this.transaccionObj.cantidad
            }
            this._service.actualizarFondos(this.transaccionObj.producto.id, obj).subscribe({
              next: (dataFondos) => {
                this.mensajeEnvio = "La transacción se ha realizado con éxito!!!"
                this.obtenerTransaccionesFunc()
                this.obtenerProductosFunc();
              },
              error: (err) => {
                if (err.status === 0) {
                  console.error('Error de conexión: El servidor no responde o hay problemas de CORS');
                } else {
                  console.error('Error:', err);
                }
              }
            })

          },
          error: (err) => {
            if (err.status === 0) {
              console.error('Error de conexión: El servidor no responde o hay problemas de CORS');
            } else {
              console.error('Error:', err);
            }
            this.mensajeEnvio = err.error.Message
          }
        })
      } else {
        this.mensajeEnvio = "Insuficientes Fondos"
      }
    }
  }

  actualizarTransaccion (id: number) {
    var trans = {
      producto: this.transaccionObj.producto,
      productoId: this.transaccionObj.producto.id,
      fecha_Compra: this.transaccionObj.fecha_Compra,
      tipo_Transaccion: this.transaccionObj.tipo_Transaccion,
      cantidad: this.transaccionObj.cantidad,
      precio_Unitario: this.transaccionObj.precio_Unitario,
      detalle: this.transaccionObj.detalle
    }
    this._service.actualizarTransaccion(id, trans).subscribe({
      next: (data) => {
        this.mensajeEnvio = "La transacción se ha realizado con éxito!!!"
        this.obtenerTransaccionesFunc()
        this.obtenerProductosFunc();
      },
      error: (err) => {
        if (err.status === 0) {
          console.error('Error de conexión: El servidor no responde o hay problemas de CORS');
        } else {
          console.error('Error:', err);
        }
        this.mensajeEnvio = err.error.Message
      }
    })
  }

  limpiarDatos () {
    this.transaccionObj = {
      id: 0,
      producto: {
        id: '',
        nombre: ''
      },
      fecha_Compra: '',
      tipo_Transaccion: '',
      cantidad: 0,
      precio_Unitario: 0,
      precio_Total: 0,
      detalle: ''
    }
  }
}
