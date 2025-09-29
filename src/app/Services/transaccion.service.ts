import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment";
import { ListarTransaccion } from "../Models/listarTransaccion.model";
import { GenerarTransaccion } from "../Models/generarTransaccion";
import { EliminarProductoResponse } from "../Models/eliminarProducto.model";

@Injectable({
    providedIn: 'root'
})
export class TransaccionService {
    private http = inject(HttpClient)
    
    constructor() {}

    getAllTransacciones() {
        const request = '/transacciones/obtenerTransacciones';
        return this.http.get<ListarTransaccion[]>(
            environment.api+request
        );
    }
    
    getProductosTA(){
        const request = '/transacciones/obtenerProductosTA';
        return this.http.get<Array<{Id: string; Nombre: string, Precio: number, Stock: number}>>(
            environment.api+request
        )
    }

    obtenerTransaccion(id: number){
        const request = '/transacciones/obtenerTransaccion/'+id;
        return this.http.get<ListarTransaccion>(environment.api+request)
    }

    agregarTransaccion(t: GenerarTransaccion) {
        const request = '/transacciones/insertarTransaccion';
        return this.http.post(environment.api+request, t)
    }

    actualizarTransaccion(id: number, t: GenerarTransaccion) {
        const request = '/transacciones/actualizarTransaccion/'+id
        return this.http.put(environment.api+request, t);
    }

    actualizarFondos(id: number, f: any) {
        const request = '/transacciones/actualizarFondos/'+id
        return this.http.put(environment.api+request, f)
    }

    eliminarTransaccion(id: number) {
        const request = '/transacciones/eliminarTransaccion/'+id
        return this.http.delete<EliminarProductoResponse>(environment.api+request)
    }
}