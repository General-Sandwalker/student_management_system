import { Injectable } from '@angular/core';

interface Email {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  read: boolean;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class EmailsService {
  private emails: Email[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Meeting tomorrow',
      content: 'Hi there, just a reminder about our meeting tomorrow at 10 AM. Please bring your project updates.',
      read: false,
      date: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      name: 'Amazon',
      email: 'no-reply@amazon.com',
      subject: 'Your order has shipped',
      content: 'Your recent order #12345 has been shipped and will arrive in 2-3 business days.',
      read: true,
      date: new Date(Date.now() - 86400000)
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.org',
      subject: 'Project deadline extension',
      content: 'Good news! The client has agreed to extend the project deadline by one week.',
      read: false,
      date: new Date(Date.now() - 172800000)
    }
  ];

  constructor() {}

  getEmails(): Email[]  {
    return this.emails;
  }

  getEmailById(id: string): Email | undefined {
    return this.emails.find(email => email.id === id);
  }

  deleteEmail(id: string): void {
    this.emails = this.emails.filter(email => email.id !== id);
  }
}