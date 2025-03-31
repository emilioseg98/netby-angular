import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Importa CommonModule

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, CommonModule],
    templateUrl: './sideBar.component.html'
})
export class SideBarComponent{
    @Input() navegacion: { id: number; titulo: string; navegacion: string, icono: string }[] = [];
}