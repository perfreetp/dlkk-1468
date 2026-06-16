export interface ProjectType {
  id: string;
  name: string;
  icon: string;
  description: string;
  categories: string[];
}

export interface ProjectInfo {
  id: string;
  name: string;
  type: string;
  category: string;
  address: string;
  area: number;
  floors: number;
  builder: string;
  startDate: string;
  plannedEndDate: string;
}

export interface DeclarationStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  timeLimit: string;
  status: 'pending' | 'current' | 'completed';
  materialCount: number;
  completedCount: number;
}

export interface ErrorProneField {
  id: string;
  fieldName: string;
  errorTip: string;
  correctExample: string;
  errorRate: number;
}

export interface TemplateItem {
  id: string;
  name: string;
  format: string;
  size: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  category: string;
  required: boolean;
  description: string;
  plainExplanation: string;
  example: string;
  errorProneFields: ErrorProneField[];
  templates: TemplateItem[];
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface QaItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  viewCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface PolicyUpdate {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  level: 'normal' | 'important' | 'urgent';
  isRead: boolean;
}

export interface AttachmentItem {
  id: string;
  originalName: string;
  formattedName: string;
  category: string;
  size: string;
  uploadDate: string;
  status: 'uploading' | 'success' | 'error';
  formatValid: boolean;
}

export interface PrerequisiteItem {
  id: string;
  name: string;
  description: string;
  status: 'met' | 'missing' | 'pending';
  suggestion: string;
}

export interface CorrectionIssue {
  id: string;
  category: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  selected: boolean;
}
