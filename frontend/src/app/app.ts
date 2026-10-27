import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ModalComponent } from './shared/modal/modal.component';
import { LoadingComponent } from './shared/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ModalComponent, LoadingComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet />
    </main>
    <app-modal></app-modal>
    <app-loading></app-loading>
  `
})
export class App {}

