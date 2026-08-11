import type { MemberType } from './user';

export interface Project {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  organizationName: string;
  isCrossOrg: boolean;
  homeOrganizationName?: string;
  role: string;
  status: string;
  memberType: MemberType;
  expiresAt?: string;
}

export interface CollaborationNode {
  id: string;
  type: 'organization' | 'department' | 'project';
  name: string;
  summary: string;
  memberType?: MemberType;
  expanded?: boolean;
  children?: CollaborationNode[];
  detail?: RelationshipDetail;
}

export interface RelationshipDetail {
  nodeType: 'organization' | 'department' | 'project';
  code?: string;
  title: string;
  subtitle?: string;
  currentContext?: string;
  homeOrganization?: string;
  projectType?: string;
  role?: string;
  source?: string;
  collaboratingOrg?: string;
  validity?: string;
}

export interface UserDashboard {
  greeting: string;
  accountStatusLabel: string;
  identitySummary: {
    organizationCount: number;
    departmentCount: number;
    projectCount: number;
    externalCollabCount: number;
  };
  contextOptions: { id: string; label: string }[];
}

export interface UserOrgMembership {
  id: string;
  name: string;
  departments: string;
  memberType: MemberType;
  projectCount: number;
}

export interface CollaborationItem {
  id: string;
  code: string;
  name: string;
  organizationName: string;
  meta: string;
}

export interface MembershipSummary {
  organizations: number;
  departments: number;
  projects: number;
  external: number;
}
