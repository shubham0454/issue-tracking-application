import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue, IssueRequest, IssueListResponse } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Get list of issues with optional filters
  getIssues(filters: any = {}): Observable<IssueListResponse> {
    let params = new HttpParams();
    
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<IssueListResponse>(`${this.apiUrl}/issues`, { params });
  }

  // Get a single issue by ID
  getIssue(id: string): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/issues/${id}`);
  }

  // Create a new issue
  createIssue(issue: IssueRequest): Observable<Issue> {
    return this.http.post<Issue>(`${this.apiUrl}/issues`, issue);
  }

  // Update an existing issue
  updateIssue(id: string, issue: Partial<IssueRequest>): Observable<Issue> {
    return this.http.put<Issue>(`${this.apiUrl}/issues/${id}`, issue);
  }
}
