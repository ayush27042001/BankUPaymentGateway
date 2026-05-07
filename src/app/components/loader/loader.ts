import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.html',
  styleUrls: ['./loader.scss'],
})
export class LoaderComponent {
  isVisible = input<boolean>(false);
}
