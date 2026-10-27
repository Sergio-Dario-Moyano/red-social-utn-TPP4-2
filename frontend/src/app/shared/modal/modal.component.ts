import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  modalService = inject(ModalService);

  get isOpen() { return this.modalService.isOpen(); }
  get config() { return this.modalService.config(); }

  cerrar(confirmado: boolean = false) {
    this.modalService.cerrar(confirmado);
  }
}
