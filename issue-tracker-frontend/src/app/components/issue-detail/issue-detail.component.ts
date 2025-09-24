import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { Issue } from '../../models/issue.model';import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { IssueFormComponent } from '../issue-form/issue-form.component';

@Component({
  selector: 'app-issue-detail',
  imports: [ FormsModule,CommonModule ,IssueFormComponent],
  templateUrl: './issue-detail.component.html',
  styleUrl: './issue-detail.component.css'
})

export class IssueDetailComponent implements OnInit {
  issue: Issue | null = null;
  loading = false;
  error: string | null = null;
  showEditForm = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIssue(id);
    } else {
      this.router.navigate(['/issues']);
    }
  }

  loadIssue(id: string) {
    this.loading = true;
    this.error = null;

    this.issueService.getIssue(id).subscribe({
      next: (issue) => {
        this.issue = issue;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading issue:', error);
        this.error = 'Failed to load issue. Please try again.';
        this.loading = false;
      }
    });
  }

  onEdit() {
    this.showEditForm = true;
  }

  onEditClose() {
    this.showEditForm = false;
    if (this.issue) {
      this.loadIssue(this.issue._id);
    }
  }

  onBack() {
    this.router.navigate(['/issues']);
  }

  getPriorityBadgeClass(priority: string): string {
    const classes = {
      'low': 'badge bg-success',
      'medium': 'badge bg-warning',
      'high': 'badge bg-danger',
      'critical': 'badge bg-dark'
    };
    return classes[priority as keyof typeof classes] || 'badge bg-secondary';
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'open': 'badge bg-primary',
      'in-progress': 'badge bg-warning',
      'resolved': 'badge bg-success',
      'closed': 'badge bg-secondary'
    };
    return classes[status as keyof typeof classes] || 'badge bg-secondary';
  }
}
