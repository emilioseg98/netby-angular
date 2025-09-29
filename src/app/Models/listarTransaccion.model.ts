export interface ListarTransaccion {
    id: number,
    producto: any,
    fecha_Compra: string,
    tipo_Transaccion: string,
    cantidad: number,
    precio_Unitario: number,
    precio_Total: number,
    detalle: string
}