export interface Producto {
    id: number,
    nombre: string,
    descripcion: string,
    categoria: string,
    imagen: string,
    precio: number,
    stock: number
}

export interface ProductoState {
    productos: Producto[],
    cargando: boolean,
    error: string | null
}