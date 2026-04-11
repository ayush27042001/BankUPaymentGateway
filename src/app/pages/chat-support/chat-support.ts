import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface ChatMessage {
  text: string;
  sender: 'user' | 'support';
  time: string;
  type?: 'help' | 'contact';
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-chat-support',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-support.html',
  styleUrls: ['./chat-support.scss']
})
export class ChatSupportComponent {
  supportPhone = '+91 98765 43210';
  supportPhoneRaw = '919876543210';
  whatsappNumber = '919876543210';

  activeFaqId: number | null = null;

  faqList: FaqItem[] = [
    {
      id: 1,
      question: 'Why is my payment failing?',
      answer:
        'Payment can fail due to bank decline, wrong card or UPI details, network timeout, insufficient balance, or temporary gateway issue. Please retry after checking details.'
    },
    {
      id: 2,
      question: 'Money deducted but payment is pending',
      answer:
        'If money is deducted and payment is pending, please wait for bank confirmation. In many cases status gets updated automatically. If unsuccessful, reversal usually happens as per bank timeline.'
    },
    {
      id: 3,
      question: 'When will my refund be processed?',
      answer:
        'Refund timelines depend on the payment method and bank processing cycle. Once refund is initiated, it may take a few working days to reflect in the customer account.'
    },
    {
      id: 4,
      question: 'Why is my settlement delayed?',
      answer:
        'Settlement may be delayed because of pending KYC, bank verification mismatch, holiday cycle, or merchant account review. Please check your bank and KYC details.'
    },
    {
      id: 5,
      question: 'UPI payment is not completing',
      answer:
        'UPI payments may fail or stay pending due to bank downtime, app timeout, incorrect UPI PIN, or receiver bank delay. Please retry after some time.'
    },
    {
      id: 6,
      question: 'Card payment is getting declined',
      answer:
        'Card payment may be declined because of incorrect details, expired card, OTP failure, bank restrictions, or security checks. Ask the customer to retry or use another method.'
    },
    {
      id: 7,
      question: 'My API integration is not working',
      answer:
        'Please verify API key, secret, hash generation, request fields, callback URL, and environment configuration. Make sure test and production credentials are not mixed.'
    },
    {
      id: 8,
      question: 'Webhook or callback is not coming',
      answer:
        'Please verify your callback URL is public, active, and not blocked by firewall. Also check server response handling and endpoint configuration.'
    },
    {
      id: 9,
      question: 'Bank account verification failed',
      answer:
        'Bank verification can fail due to incorrect account number, IFSC mismatch, name mismatch, or temporary validation issue. Please recheck all details carefully.'
    },
    {
      id: 10,
      question: 'How do I handle chargeback or dispute?',
      answer:
        'Keep transaction ID, order ID, invoice, proof of service or delivery, and customer communication ready. These are usually needed for dispute handling.'
    }
  ];

  messages: ChatMessage[] = [
    {
      text: 'Hello! Welcome to BankU Payment Support. Please select a common question to get an instant answer.',
      sender: 'support',
      time: this.getCurrentTime()
    }
  ];

  selectFaq(item: FaqItem): void {
    this.activeFaqId = item.id;

    this.messages.push({
      text: item.question,
      sender: 'user',
      time: this.getCurrentTime()
    });

    this.messages.push({
      text: item.answer,
      sender: 'support',
      time: this.getCurrentTime(),
      type: 'help'
    });
  }

  helpfulResponse(): void {
    this.messages.push({
      text: 'Yes, this helped me.',
      sender: 'user',
      time: this.getCurrentTime()
    });

    this.messages.push({
      text: 'Glad to help. You can select another question if you need more assistance.',
      sender: 'support',
      time: this.getCurrentTime()
    });
  }

  notHelpfulResponse(): void {
    this.messages.push({
      text: 'No, I need more help.',
      sender: 'user',
      time: this.getCurrentTime()
    });

    this.messages.push({
      text: 'You can connect directly with our support team using Quick Call or WhatsApp Support.',
      sender: 'support',
      time: this.getCurrentTime(),
      type: 'contact'
    });
  }

  getWhatsappLink(): string {
    const message = encodeURIComponent(
      'Hello BankU Support, I need help with my payment gateway issue.'
    );
    return `https://wa.me/${this.whatsappNumber}?text=${message}`;
  }

  trackByFaqId(index: number, item: FaqItem): number {
    return item.id;
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}