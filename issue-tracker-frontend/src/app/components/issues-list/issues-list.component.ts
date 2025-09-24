import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IssueFormComponent } from '../issue-form/issue-form.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { Issue, IssueListResponse } from '../../models/issue.model';


@Component({
  selector: 'app-issues-list',
  imports: [FormsModule, IssueFormComponent, CommonModule, CommonModule],
  templateUrl: './issues-list.component.html',
  styleUrl: './issues-list.component.css',
})

export class IssuesListComponent implements OnInit {
  issues: Issue[] = [];
  loading = false;
  
  // Filters
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';
  assigneeFilter = '';
  
  // Pagination
  Math = Math; // To use Math functions in template
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  
  // Sorting
  sortBy = 'updatedAt';
  sortOrder = 'desc';
  
  // Options
  statusOptions = ['', 'open', 'in-progress', 'resolved', 'closed'];
  priorityOptions = ['', 'low', 'medium', 'high', 'critical'];
  pageSizeOptions = [5, 10, 25, 50];
  
  // UI State
  showCreateForm = false;
  editingIssue?: Issue | null;

  constructor(
    private issueService: IssueService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadIssues();
  }

  loadIssues() {
    this.loading = true;
    
    const filters = {
      search: this.searchTerm,
      status: this.statusFilter,
      priority: this.priorityFilter,
      assignee: this.assigneeFilter,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.issueService.getIssues(filters).subscribe({
      next: (response: IssueListResponse) => {
        this.issues = response.issues;
        this.totalItems = response.pagination.totalItems;
        this.totalPages = response.pagination.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading issues:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadIssues();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadIssues();
  }

  onSort(column: string) {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.loadIssues();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadIssues();
  }

  onRowClick(issue: Issue) {
    this.router.navigate(['/issues', issue._id]);
  }

  onCreateIssue() {
    this.showCreateForm = true;
    this.editingIssue = null;
  }

  onEditIssue(event: Event, issue: Issue) {
    event.stopPropagation();
    this.editingIssue = issue;
    this.showCreateForm = true;
  }

  onFormClose() {
    this.showCreateForm = false;
    this.editingIssue = null;
    this.loadIssues();
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

  getSortIcon(column: string): string {
    if (this.sortBy !== column) return 'bi-arrow-down-up';
    return this.sortOrder === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }
}