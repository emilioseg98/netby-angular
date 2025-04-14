export interface Producto {
    id: number,
    nombre: string,
    categoriasProd: {id: string, nombre: string, supercategoria: string},
    descripcion: string,
    imagen: string,
    precio: number,
    stock: number,
    fecha_Creacion: string;
}