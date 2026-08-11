import type {
  CollaborationItem,
  CollaborationNode,
  MembershipSummary,
  RelationshipDetail,
  UserDashboard,
  UserOrgMembership,
} from '../types/collaboration';

export const userDashboard: UserDashboard = {
  greeting: '早上好，林屿',
  accountStatusLabel: '账号正常',
  identitySummary: {
    organizationCount: 3,
    departmentCount: 5,
    projectCount: 7,
    externalCollabCount: 1,
  },
  contextOptions: [
    { id: 'all', label: '全部协作' },
    { id: 'org-ch', label: '澄海工业智能研究院' },
    { id: 'org-group', label: '集团研究院' },
    { id: 'org-bc', label: '北辰联合实验室' },
  ],
};

export const myOrganizations: UserOrgMembership[] = [
  {
    id: 'org-ch',
    name: '澄海工业智能研究院',
    departments: '部门 · 嵌入式系统部 · 工业 AI 部',
    memberType: 'internal',
    projectCount: 3,
  },
  {
    id: 'org-group',
    name: '集团研究院',
    departments: '部门 · 安全工程部',
    memberType: 'internal',
    projectCount: 2,
  },
  {
    id: 'org-bc',
    name: '北辰联合实验室',
    departments: '部门 · 联合验证组',
    memberType: 'external',
    projectCount: 2,
  },
];

export const recentCollaborations: CollaborationItem[] = [
  {
    id: 'p100',
    code: 'P100',
    name: '控制器安全升级',
    organizationName: '集团研究院',
    meta: '编辑成员 · 活跃',
  },
  {
    id: 'a017',
    code: 'A017',
    name: '工业文档解析评估',
    organizationName: '澄海工业智能研究院',
    meta: '查看成员 · 规划中',
  },
  {
    id: 'q204',
    code: 'Q204',
    name: '联合验证基线',
    organizationName: '北辰联合实验室',
    meta: '外部协作 · 7 天后到期',
  },
];

export const membershipSummary: MembershipSummary = {
  organizations: 3,
  departments: 5,
  projects: 7,
  external: 1,
};

export const p100Detail: RelationshipDetail = {
  nodeType: 'project',
  code: 'P100',
  title: '控制器安全升级',
  currentContext: '澄海工业智能研究院',
  homeOrganization: '集团研究院',
  projectType: '跨组织项目',
  role: '编辑成员',
  source: '直接加入项目',
  collaboratingOrg: '澄海工业智能研究院',
  validity: '长期有效',
};

export const collaborationTree: CollaborationNode[] = [
  {
    id: 'org-ch',
    type: 'organization',
    name: '澄海工业智能研究院',
    summary: '2 部门 · 3 项目 · 内部成员',
    expanded: true,
    detail: {
      nodeType: 'organization',
      code: 'ORG-CH-001',
      title: '澄海工业智能研究院',
      role: '内部成员',
      source: '组织直接成员',
      validity: '长期有效',
    },
    children: [
      {
        id: 'dept-ch',
        type: 'department',
        name: '部门 · 嵌入式系统部、工业 AI 部',
        summary: '2 个部门关系',
        detail: {
          nodeType: 'department',
          title: '嵌入式系统部、工业 AI 部',
          currentContext: '澄海工业智能研究院',
          role: '部门成员',
          source: '组织关系继承',
          validity: '长期有效',
        },
      },
      {
        id: 'p100',
        type: 'project',
        name: '项目 · P100 控制器安全升级',
        summary: '跨组织项目 · 归属集团研究院',
        detail: p100Detail,
      },
    ],
  },
  {
    id: 'org-group',
    type: 'organization',
    name: '集团研究院',
    summary: '2 部门 · 2 项目 · 内部成员',
    detail: {
      nodeType: 'organization',
      code: 'ORG-GRP-002',
      title: '集团研究院',
      role: '项目协作成员',
      source: '跨组织项目',
      validity: '长期有效',
    },
  },
  {
    id: 'org-bc',
    type: 'organization',
    name: '北辰联合实验室',
    summary: '1 部门 · 2 项目 · 外部协作',
    memberType: 'external',
    detail: {
      nodeType: 'organization',
      code: 'ORG-BC-003',
      title: '北辰联合实验室',
      role: '外部协作成员',
      source: '外部协作邀请',
      validity: '7 天后到期',
    },
  },
];

export const defaultSelectedDetail = p100Detail;
