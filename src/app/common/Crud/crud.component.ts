import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-crud',
    templateUrl: './crud.component.html'
})

export class CrudComponent implements OnInit {
    data$ = this.store.select();

    constructor(private store: Store) {}
    ngOnInit() {}
}