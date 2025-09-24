import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IssueService } from '../../services/issue.service';
import { Issue, IssueRequest } from '../../models/issue.model';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-issue-form',
  imports: [CommonModule, FormsModule , ReactiveFormsModule],
  templateUrl: './issue-form.component.html',
  styleUrl: './issue-form.component.css'
})

export class IssueFormComponent implements OnInit {
  @Input() issue?: Issue |  null;
  @Output() close = new EventEmitter();

  form: FormGroup;
  loading = false;
  isEditing = false;

  statusOptions = ['open', 'in-progress', 'resolved', 'closed'];
  priorityOptions = ['low', 'medium', 'high', 'critical'];

  constructor(
    private fb: FormBuilder,
    private issueService: IssueService
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {
    this.isEditing = !!this.issue;
    if (this.issue) {
      this.populateForm();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      status: ['open'],
      priority: ['medium'],
      assignee: ['', Validators.maxLength(100)],
      reporter: ['', [Validators.required, Validators.maxLength(100)]],
      tags: ['']
    });
  }

  populateForm() {
    if (!this.issue) return;

    this.form.patchValue({
      title: this.issue.title,
      description: this.issue.description,
      status: this.issue.status,
      priority: this.issue.priority,
      assignee: this.issue.assignee || '',
      reporter: this.issue.reporter,
      tags: this.issue.tags.join(', ')
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formValue = this.form.value;

    const issueData: IssueRequest = {
      ...formValue,
      tags: formValue.tags 
        ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
        : []
    };

    const operation = this.isEditing
      ? this.issueService.updateIssue(this.issue!._id, issueData)
      : this.issueService.createIssue(issueData);

    operation.subscribe({
      next: () => {
        this.loading = false;
        this.onClose();
      },
      error: (error) => {
        console.error('Error saving issue:', error);
        this.loading = false;
        // You can add error handling here (show toast, alert, etc.)
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  private markFormGroupTouched() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field.errors['maxlength']) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} cannot exceed ${maxLength} characters`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      title: 'Title',
      description: 'Description',
      assignee: 'Assignee',
      reporter: 'Reporter'
    };
    return labels[fieldName] || fieldName;
  }
}
