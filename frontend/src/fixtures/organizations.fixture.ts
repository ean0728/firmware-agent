import type { Organization, OrgUnit } from '../types/organization';

export const organizations: Organization[] = [
  {
    id: 'org-ch',
    name: '澄海工业智能研究院',
    code: 'ORG-CH-001',
    memberCount: 42,
    departmentCount: 5,
    projectCount: 8,
  },
  {
    id: 'org-group',
    name: '集团研究院',
    code: 'ORG-GRP-002',
    memberCount: 36,
    departmentCount: 4,
    projectCount: 6,
  },
  {
    id: 'org-bc',
    name: '北辰联合实验室',
    code: 'ORG-BC-003',
    memberCount: 18,
    departmentCount: 2,
    projectCount: 4,
  },
  {
    id: 'org-zn',
    name: '智造技术中心',
    code: 'ORG-ZN-004',
    memberCount: 32,
    departmentCount: 4,
    projectCount: 5,
  },
];

export const orgUnitsByOrg: Record<string, OrgUnit[]> = {
  'org-ch': [
    { id: 'dept-embed', organizationId: 'org-ch', parentId: null, name: '嵌入式系统部', memberCount: 12, projectCount: 3 },
    { id: 'dept-ai', organizationId: 'org-ch', parentId: null, name: '工业 AI 部', memberCount: 10, projectCount: 2 },
    { id: 'dept-sec', organizationId: 'org-ch', parentId: null, name: '安全工程部', memberCount: 8, projectCount: 2 },
    { id: 'dept-platform', organizationId: 'org-ch', parentId: null, name: '平台工程部', memberCount: 7, projectCount: 1 },
  ],
  'org-group': [
    { id: 'dept-group-platform', organizationId: 'org-group', parentId: null, name: '控制平台部', memberCount: 11, projectCount: 2 },
    { id: 'dept-group-security', organizationId: 'org-group', parentId: null, name: '系统安全部', memberCount: 9, projectCount: 2 },
    { id: 'dept-group-research', organizationId: 'org-group', parentId: null, name: '前沿研究部', memberCount: 8, projectCount: 1 },
    { id: 'dept-group-ops', organizationId: 'org-group', parentId: null, name: '工程运营部', memberCount: 8, projectCount: 1 },
  ],
  'org-bc': [
    { id: 'dept-bc-joint', organizationId: 'org-bc', parentId: null, name: '联合攻关部', memberCount: 10, projectCount: 2 },
    { id: 'dept-bc-validation', organizationId: 'org-bc', parentId: null, name: '验证评估部', memberCount: 8, projectCount: 2 },
  ],
  'org-zn': [
    { id: 'dept-zn-embed', organizationId: 'org-zn', parentId: null, name: '嵌入式开发部', memberCount: 9, projectCount: 2 },
    { id: 'dept-zn-automation', organizationId: 'org-zn', parentId: null, name: '自动化工程部', memberCount: 8, projectCount: 1 },
    { id: 'dept-zn-data', organizationId: 'org-zn', parentId: null, name: '工业数据部', memberCount: 7, projectCount: 1 },
    { id: 'dept-zn-quality', organizationId: 'org-zn', parentId: null, name: '质量保障部', memberCount: 8, projectCount: 1 },
  ],
};

export const defaultSelectedOrgId = 'org-ch';
