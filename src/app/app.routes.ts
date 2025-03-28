import { Routes } from '@angular/router';
import { HomeComponent } from './Paginacion/Home/home.component';
import { ProductosComponent } from './Paginacion/Productos/productos.component';
import { InventarioComponent } from './Paginacion/Inventario/inventario.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'productos', component: ProductosComponent },
    { path: 'inventario', component: InventarioComponent },
];
