import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ApiService } from '../../services/api.service';

interface Email {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  read: boolean;
  created_at:dateFns
}

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzListModule,
    NzIconModule,
    NzButtonModule
  ],
  templateUrl: "inbox.component.html",
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  emails: Email[] = [];
  selectedEmail: Email | null = null;

  constructor(private api:ApiService) { }


  loadEmails(): void {
    this.api.getReports().subscribe((emails: Email[]) => {
      this.emails = emails;
      console.log(this.emails)
    });

  }

  ngOnInit(): void {
    this.loadEmails();
  }

  handleRemoveReport(id: string) {
    this.api.deleteReport(+id);
    this.loadEmails();
  }

  selectEmail(email: Email): void {
    this.selectedEmail = email;
    email.read = true;
  }

  refreshEmails():void{
    this.loadEmails();
    this.selectedEmail = null;
  }
}