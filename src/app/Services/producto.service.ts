import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment";
import axios from 'axios';
import { Producto } from "../Models/productos.model";
import { EliminarProductoResponse } from "../Models/eliminarProducto.model";

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    private http = inject(HttpClient)

    constructor() {}

    getAll(filtros: any){
        const request = filtros.searchText ? '/productos/obtenerProductos/'+filtros.searchText : '/productos/obtenerProductos';
        return this.http.get<Producto[]>(
            environment.api+request
        );
    }

    getCategoriasTA(){
        const request = '/productos/obtenerCategoriasTA';
        return this.http.get<Array<{ Id: string; Nombre: string, Supercategoria: string }>>(
            environment.api+request
        );
    }

    obtenerProducto(id: number){
        const request = '/productos/obtenerProducto/'+id;
        return this.http.get<Producto>(
            environment.api+request
        );
    }

    agregarProductos(p: Producto){
        const request = '/productos/insertarProducto';
        return this.http.post(environment.api+request, p)
    }

    actualizarProducto(id: number, p: Producto){
        const request = '/productos/actualizarProducto/'+id
        return this.http.put(environment.api+request, p)
    }

    eliminarProducto(id: number) {
        const request = '/productos/eliminarProducto/'+id;
        return this.http.delete<EliminarProductoResponse>(environment.api+request)
    }

    /* async getAll(): Promise<any> {
        const request = '/productos/obtenerProductos';
        const url = environment.api + request;
        await axios.get(url, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        }).then(res => {}).catch(error => {
            console.error(error);
        });
    } */
}