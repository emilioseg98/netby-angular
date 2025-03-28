import { StoreModule } from '@ngrx/store';
import { reducers } from './Reducer/Reducers';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers)
  ]
})
export class MyFeatureModule {}