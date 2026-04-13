import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

interface ChatMessage {
  text: string;
  sender: 'user' | 'support';
  time: string;
}

interface FaqItem {
  id: number;
  label: string;
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
  @Output() closeChat = new EventEmitter<void>();

  supportPhone = '+91 98765 43210';
  supportPhoneRaw = '919876543210';
  whatsappNumber = '919876543210';

  isReplying = false;
  activeFaqId: number | null = null;
  showAllQuestions = false;

  faqList: FaqItem[] = [
    {
      id: 1,
      label: 'Payment Failed',
      question: 'Why is my payment failing?',
      answer:
        'Payment may fail due to insufficient balance, bank decline, wrong card or UPI details, network timeout, or a temporary gateway issue. Please recheck the details and try again.'
    },
    {
      id: 2,
      label: 'Money Deducted',
      question: 'Money deducted but payment is pending',
      answer:
        'If money is deducted and payment is still pending, please wait for bank confirmation. In many cases the status gets updated automatically. If the payment does not succeed, reversal is usually processed as per bank timeline.'
    },
    {
      id: 3,
      label: 'Refund Status',
      question: 'When will my refund be processed?',
      answer:
        'Refund timelines depend on the payment method and bank processing cycle. Once the refund is initiated, it may take a few working days to reflect in the customer account.'
    },
    {
      id: 4,
      label: 'Settlement Delay',
      question: 'Why is my settlement delayed?',
      answer:
        'Settlement may be delayed due to pending KYC, bank verification mismatch, a holiday cycle, or merchant account review. Please verify your KYC and bank details.'
    },
    {
      id: 5,
      label: 'UPI Issue',
      question: 'UPI payment is not completing',
      answer:
        'UPI payments may remain pending or fail due to bank downtime, app timeout, incorrect UPI PIN, or receiver bank delay. Please retry after some time.'
    },
    {
      id: 6,
      label: 'Card Declined',
      question: 'Card payment is getting declined',
      answer:
        'Card payments may be declined because of incorrect details, an expired card, OTP failure, bank restriction, or security checks. Please try again or use another payment method.'
    },
    {
      id: 7,
      label: 'API Issue',
      question: 'My API integration is not working',
      answer:
        'Please verify your API key, secret, request parameters, hash generation, callback URL, and environment configuration. Also make sure test and production credentials are not mixed.'
    },
    {
      id: 8,
      label: 'Webhook Issue',
      question: 'Webhook or callback is not coming',
      answer:
        'Please check whether your callback URL is public, active, and not blocked by firewall. Also verify the endpoint configuration and server response handling.'
    },
    {
      id: 9,
      label: 'Bank Verify Fail',
      question: 'Bank account verification failed',
      answer:
        'Bank verification can fail due to incorrect account number, IFSC mismatch, account holder name mismatch, or temporary bank validation issue. Please recheck the details carefully.'
    },
    {
      id: 10,
      label: 'Chargeback Help',
      question: 'How do I handle chargeback or dispute?',
      answer:
        'Please keep the transaction ID, order ID, invoice, proof of service or delivery, and customer communication ready. These details are generally needed for dispute handling.'
    }
  ];

  messages: ChatMessage[] = [
    {
      text: 'Hello! Welcome to BankU Support. Please select a quick issue below to get an instant answer.',
      sender: 'support',
      time: this.getCurrentTime()
    }
  ];

  get visibleFaqList(): FaqItem[] {
    return this.showAllQuestions ? this.faqList : this.faqList.slice(0, 4);
  }

  toggleQuestions(): void {
    this.showAllQuestions = !this.showAllQuestions;
    this.scrollToBottom();
  }

  selectFaq(item: FaqItem): void {
    if (this.isReplying) {
      return;
    }

    this.activeFaqId = item.id;

    this.messages = [
      ...this.messages,
      {
        text: item.question,
        sender: 'user',
        time: this.getCurrentTime()
      }
    ];

    this.isReplying = true;
    this.scrollToBottom();

    setTimeout(() => {
      this.messages = [
        ...this.messages,
        {
          text: item.answer,
          sender: 'support',
          time: this.getCurrentTime()
        }
      ];

      this.isReplying = false;
      this.scrollToBottom();
    }, 500);
  }

  resetChat(): void {
    this.activeFaqId = null;
    this.showAllQuestions = false;
    this.isReplying = false;

    this.messages = [
      {
        text: 'Hello! Welcome to BankU Support. Please select a quick issue below to get an instant answer.',
        sender: 'support',
        time: this.getCurrentTime()
      }
    ];
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

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatBody = document.querySelector('.chatbot-body');
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }, 50);
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}