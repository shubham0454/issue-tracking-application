export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  reporter: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IssueRequest {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  assignee?: string;
  reporter: string;
  tags?: string[];
}

export interface IssueListResponse {
  issues: Issue[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}