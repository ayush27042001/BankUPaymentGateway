import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-link',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './payment-link.html',
  styleUrl: './payment-link.scss'
})
export class PaymentLinkComponent {

}
