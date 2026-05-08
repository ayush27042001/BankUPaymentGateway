import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatSupportComponent } from './pages/chat-support/chat-support';
import { ToastComponent } from './components/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ChatSupportComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  isChatOpen = false;

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    console.log('Chat toggled:', this.isChatOpen);
  }

  closeChat(): void {
    this.isChatOpen = false;
  }
}