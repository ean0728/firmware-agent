export interface Organization {
  id: string;
  name: string;
  code: string;
  memberCount: number;
  departmentCount: number;
  projectCount: number;
}

export interface OrgUnit {
  id: string;
  organizationId: string;
  parentId: string | null;
  name: string;
  memberCount: number;
  projectCount: number;
}
