import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    Navbar
  ],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.scss',
})
export class UserLayout {

  currentMode: 'live' | 'test' = 'live';

  onModeChange(
    mode: 'live' | 'test'
  ): void {

    this.currentMode = mode;

    console.log(
      'Current Mode:',
      this.currentMode
    );

  }

}