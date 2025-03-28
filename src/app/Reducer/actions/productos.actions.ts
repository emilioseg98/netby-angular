import {
    createFeatureSelector,
    createSelector,
    createAction,
    createReducer,
    on,
    Action,
    props,
  } from '@ngrx/store';

import { Producto, ProductoState } from '../states/productos.states';

//Acciones

export const agregarProducto = createAction(
    '[Producto] Agregar Producto',
    props<{ producto: Producto }>() 
);
export const updateUser = createAction(
    '[Producto] Modificar Producto',
    props<{ producto: Producto }>()
);

export const selectProductoState = createFeatureSelector<ProductoState>('productos');

export const selectProductos = createSelector(
  selectProductoState,
  (state) => state.productos
);

//Reducer

export const estadoInicial: ProductoState = {
    productos: [],
    cargando: false,
    error: null
};

export const productoReducer = createReducer(
    estadoInicial,
    on(agregarProducto, (state, { producto }) => ({
      ...state,
      productos: [...state.productos, producto]  // Agrega el nuevo producto al estado
    }))
);
export const deleteUser = createAction('deleteUser', props<{ id: string }>());