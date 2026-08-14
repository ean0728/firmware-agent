# 企业 RAG 平台用户与访问治理系统设计文档

*Identity · Organization · Project · Fine-Grained Authorization · Approval Governance*


| **文档版本**     | v1.0                                                       |
|------------------|------------------------------------------------------------|
| **状态**         | 设计基线 / 可进入原型与开发拆解                            |
| **日期**         | 2026-08-10                                                 |
| **适用范围**     | 企业 RAG / 知识库平台的用户、组织、项目、授权、审批与审计  |
| **核心技术边界** | Go 用户与业务服务 + OpenFGA 授权引擎 + PostgreSQL 业务数据 |

> **本版已确认的关键决策**
>
> 用户可同时加入任意多个部门；项目允许跨组织成员加入；知识库最终所有权统一归 Organization；知识库可授权给 Organization / Department / Project / User；审批策略后台可配置并提供默认策略；Document 默认继承 KnowledgeBase 权限，但允许文档级单独授权、覆盖与屏蔽。

## 目录

| 1\. 文档目的与设计边界               | 11\. 审批治理模型                   |
|--------------------------------------|-------------------------------------|
| 2\. 设计原则与核心决策               | 12\. Admin 后台功能设计             |
| 3\. 领域模型总览                     | 13\. 审计与生命周期治理             |
| 4\. 身份与用户账户                   | 14\. Gateway + OpenFGA 请求链路     |
| 5\. Organization 与 Department       | 15\. PostgreSQL 与 OpenFGA 数据职责 |
| 6\. Project 协作模型                 | 16\. 核心数据模型建议               |
| 7\. KnowledgeBase 与 Document 所有权 | 17\. 关键状态机与业务规则           |
| 8\. 细粒度授权模型                   | 18\. RAG 检索权限联动               |
| 9\. 跨组织共享与授权撤销             | 19\. 非功能要求与安全边界           |
| 10\. Document 权限继承与覆盖         | 20\. 分阶段实施建议                 |

# 1. 文档目的与设计边界

本文定义企业 RAG 平台的用户与访问治理体系。该体系不是单纯的“用户 + 角色 + RBAC”，而是面向企业知识协作场景，统一处理人员身份、组织结构、部门归属、项目协作、知识资产所有权、跨组织共享、细粒度授权、审批与审计。

系统的最终目标，是让任何一次页面访问、API 操作或 RAG 检索都能回答同一个问题：某个用户在当前组织上下文中，是否有权对某个具体资源执行某个动作。

## 1.1 本系统负责

- 用户账户、登录态与用户生命周期。

- 多 Organization、多 Department、多 Project 的成员关系。

- KnowledgeBase / Document 的所有权、共享、继承、覆盖与撤销。

- 跨组织、跨部门、跨项目及用户直授权。

- 可配置审批流程、默认审批策略与负责人机制。

- OpenFGA 细粒度权限决策。

- 权限变更与关键操作的审计追踪。

- 为前端菜单/页面/按钮与 RAG 检索提供统一授权结果。

## 1.2 本系统暂不负责

- 完整 HR/OA：职位职级、薪酬、考勤、直属上下级等与知识访问无直接关系的人员管理。

- Team：当前业务中 Department 与 Project 已覆盖正式组织关系和横向协作关系，暂不引入 Team。

- 通用 BPMN 工作流引擎：第一阶段仅实现与授权/共享直接相关的审批能力。

- 任意动态权限 DSL：权限模型由系统定义，管理员动态配置组织、成员、授权关系和审批策略。

# 2. 设计原则与核心决策

| **原则**               | **设计结论**                                                                                     |
|------------------------|--------------------------------------------------------------------------------------------------|
| 组织是资产边界         | KnowledgeBase 和 Project 均归属 Organization；KnowledgeBase 是组织知识资产，不因项目结束而消失。 |
| 部门是正式组织结构     | Department / OrgUnit 形成层级结构；用户可同时属于任意多个部门。                                  |
| 项目是协作边界         | Project 是一等业务实体，用户可直接加入项目；项目允许跨组织成员。                                 |
| 权限与人员身份解耦     | 是否为“领导”不自动获得知识权限；负责人主要用于治理与审批。                                       |
| 权限模型固定、关系动态 | viewer/editor/manager 等能力模型由系统维护；谁属于谁、谁被授权给谁由 Admin 动态配置。            |
| 集中决策               | OpenFGA 是统一授权决策引擎；业务数据仍以 PostgreSQL 为主。                                       |
| 资源默认继承           | Document 默认继承 KnowledgeBase；必要时允许文档级例外。                                          |
| 共享可撤销             | 任何共享/授权都必须可追溯、可撤销；撤销只移除对应授权路径。                                      |
| 审批可配置             | 系统提供默认审批策略，Admin 可按组织/资源/权限级别调整。                                         |
| AI 必须服从权限        | RAG 检索前必须先确定用户可访问的 KB/Document 范围，不能“先全库召回再过滤”。                      |

> **核心边界**
>
> RBAC 只是本系统的一部分。实际授权将同时使用组织/项目/资源关系（ReBAC）、角色与动作权限，以及必要的时间条件。OpenFGA 用于执行这些关系规则；业务领域模型由本平台自行定义。

# 3. 领域模型总览

Platform  
├─ User  
├─ Organization  
│ ├─ Department / OrgUnit  
│ │ └─ User Membership (many-to-many)  
│ ├─ Project  
│ │ └─ Project Member (internal / external)  
│ └─ KnowledgeBase  
│ └─ Document  
├─ Grant / Share  
├─ Approval Policy / Request  
├─ Invitation  
├─ Audit Log  
└─ OpenFGA Authorization

## 3.1 授权主体

| **主体**     | **说明**                                           | **可作为知识授权对象** |
|--------------|----------------------------------------------------|------------------------|
| User         | 平台全局用户身份，可同时属于多个组织、部门、项目。 | 是                     |
| Organization | 公司/租户，是资源最终所有权和数据隔离边界。        | 是                     |
| Department   | 正式组织单元，可多级嵌套；用户可多部门归属。       | 是                     |
| Project      | 业务协作空间，可跨部门、跨组织纳入成员。           | 是                     |

## 3.2 主要资源

| **资源**      | **最终所有者**            | **权限特点**                                |
|---------------|---------------------------|---------------------------------------------|
| KnowledgeBase | Organization              | 主要授权边界；支持组织/部门/项目/用户共享。 |
| Document      | 通过 KB 归属 Organization | 默认继承 KB，允许单独授权或屏蔽。           |
| Project       | Organization              | 拥有成员与负责人，可关联一个或多个 KB。     |

# 4. 身份与用户账户

User 是平台全局身份，不复制为“每个组织一份用户”。用户加入 Organization 后形成 Membership，由 Membership 描述用户与组织的关系。

## 4.1 User 基本状态

| **状态**  | **含义**                    | **行为**                           |
|-----------|-----------------------------|------------------------------------|
| pending   | 已创建/受邀但尚未完成加入。 | 不能正常访问业务资源。             |
| active    | 正常用户。                  | 按授权关系访问资源。               |
| suspended | 账号暂时停用。              | 所有业务访问拒绝，但历史关系保留。 |
| disabled  | 离职/长期停用。             | 不可登录；历史审计信息保留。       |

## 4.2 Organization Membership

用户可加入多个 Organization。同一用户在不同 Organization 中可拥有不同组织级角色。每次请求应携带 active_organization / organization context，以明确本次操作代表哪个组织。

| **组织级角色** | **建议能力**                                         |
|----------------|------------------------------------------------------|
| owner          | 组织最高治理者；组织配置、管理员管理、最终资源治理。 |
| admin          | 组织日常管理；成员、部门、项目、知识授权审批等。     |
| member         | 普通成员；按资源关系访问与协作。                     |
| guest          | 受限外部/临时成员；默认只访问明确授权资源。          |

> **注意**
>
> 组织级角色不等于某个 KnowledgeBase 的具体权限。一个 Organization admin 不应默认无条件读取组织内全部敏感知识，除非产品明确将此能力授予 admin。

# 5. Organization 与 Department

## 5.1 Organization

Organization 是租户、资产和主要数据隔离边界。Project、KnowledgeBase 必须有 organization_id。跨 Organization 访问必须通过显式共享/授权产生。

## 5.2 Department / OrgUnit

Department 用于表示企业正式组织结构。底层建议统一抽象为 OrgUnit，通过 parent_id 构建任意层级，而 UI 可展示为“部门/事业部/小组”等。

Organization A  
├─ 研发中心  
│ ├─ 固件部  
│ └─ 测试部  
├─ 制造中心  
└─ 质量部

已确认：同一用户可同时属于任意多个 Department。系统不强制“主部门 + 兼职部门”模型；如后续业务需要，可新增 primary 标记而不改变授权基础模型。

## 5.3 Department 负责人

Department 支持 head / responsible_user，用于审批、治理和后台展示。负责人身份本身不自动等价于读取全部部门知识；是否产生某项权限由授权模型或审批策略明确决定。

# 6. Project 协作模型

Project 是一等业务实体，不等同于 Department。Department 表示人员长期组织归属，Project 表示为某项业务临时或长期形成的横向协作关系。

| **字段/关系**   | **设计**                                                         |
|-----------------|------------------------------------------------------------------|
| organization_id | 项目归属的 Organization。                                        |
| owner / manager | 项目负责人，可多人或单人，负责成员和项目治理。                   |
| member          | 项目普通成员。                                                   |
| guest           | 受限项目成员，通常用于外部协作。                                 |
| member_type     | internal / external，用于标识成员是否来自项目所属 Organization。 |
| status          | draft / active / suspended / completed / archived。              |

已确认：Project 允许跨组织人员直接加入。例如 Org A 创建 P100，Org B 的用户可作为 external member 加入。加入项目本身只建立项目成员关系，是否获得知识访问由 Project → KnowledgeBase 授权关系决定。

## 6.1 Project 与 KnowledgeBase

KnowledgeBase 最终仍归 Organization 所有；Project 只与 KB 建立关联或被授权关系。项目完成/归档后，组织知识资产继续保留。

Organization A  
├─ Project P100 (completed)  
└─ KnowledgeBase KB-P100 ← 仍归 Organization A 所有

# 7. KnowledgeBase 与 Document 所有权

## 7.1 KnowledgeBase

KnowledgeBase 是主要知识授权边界，必须归属于一个 Organization。可关联 Project，但 Project 不是最终所有者。

## 7.2 KnowledgeBase 负责人

每个 KB 建议配置 responsible_user / steward，用于知识治理、共享审批、维护责任和权限异常处理。负责人不是资产所有者；资产所有者仍是 Organization。

## 7.3 Document

Document 必须属于某个 KnowledgeBase。文档权限采用“默认继承 KB + 文档级例外”的设计。该策略既保持大多数场景管理简单，也允许对敏感文档进行精细化控制。

# 8. 细粒度授权模型

## 8.1 知识库资源角色

| **资源角色** | **核心能力**                                         | **说明**                                     |
|--------------|------------------------------------------------------|----------------------------------------------|
| viewer       | can_view                                             | 查看知识库及默认继承文档。                   |
| editor       | can_view, can_edit, can_upload                       | 编辑内容、上传文档，但不能管理授权。         |
| manager      | viewer + editor + can_share + can_manage_permissions | 管理共享、成员授权和知识库治理。             |
| blocked      | 显式拒绝访问                                         | 用于覆盖通过组织/部门/项目等路径获得的访问。 |

Organization 对 KB 保留最终所有权。系统可将组织 owner/admin 的“删除 KB / 转移负责人”等治理动作单独建模，不强制通过 manager 角色表达。

## 8.2 授权来源

| **授权来源** | **例子**                                                 |
|--------------|----------------------------------------------------------|
| Organization | organization:B#member → viewer → knowledge_base:KB1      |
| Department   | department:firmware#member → editor → knowledge_base:KB1 |
| Project      | project:P100#member → viewer → knowledge_base:KB1        |
| User         | user:alice → manager → knowledge_base:KB1                |

## 8.3 多路径权限

同一用户可能从多个路径获得权限。例如用户既属于获 viewer 的 Organization，又属于获 editor 的 Project。系统按 OpenFGA 模型推导最终能力，而不是在业务代码中手工计算“最高角色”。显式 blocked 用于在需要时排除特定用户。

> **权限来源解释**
>
> Admin 后台应能够展示“为什么该用户能访问”：直接授权、所属组织授权、所属部门授权、所属项目授权、文档继承等。该能力对排查越权和撤销授权非常重要。

# 9. 跨组织共享与授权撤销

KnowledgeBase 可授权给 Organization / Department / Project / User。跨组织共享不转移资产所有权，只创建一条或多条访问授权关系。

## 9.1 共享示例

Org A owns KB1  
  
Org A → share viewer → Org B#member  
Org A → share editor → Department B/Firmware#member  
Org A → share manager → user:alice

## 9.2 撤销规则

- 撤销某条 Grant 只移除该授权路径，不影响同一主体通过其他路径获得的权限。

- 撤销 Organization B 的共享后，B 中被单独 direct grant 的用户仍可继续访问。

- 退出 Department / Project 后，用户应立即失去通过该 Department / Project 获得的权限。

- Grant 可配置 expires_at；到期后授权失效，并在后台保留历史记录。

- 所有跨组织 Grant、撤销和到期应写入 Audit Log。

## 9.3 是否允许二次转授权

默认不允许 viewer/editor 将外部共享继续转授给第三方。只有拥有 can_share / can_manage_permissions 的主体才能发起新的授权，且仍受审批策略约束。若未来需要“代理授权”，应单独设计 delegated_share 能力。

# 10. Document 权限继承与覆盖

> **已确认策略 B**
>
> Document 默认继承 KnowledgeBase，但允许文档级单独授权、提高权限或显式屏蔽。

## 10.1 默认继承

user:alice → viewer → knowledge_base:KB1  
knowledge_base:KB1 → parent → document:D1  
  
=> alice can_view D1

## 10.2 文档级直接授权

某文档可以额外授权给 Organization / Department / Project / User。例如 KB 默认仅项目 A 可见，但 Document D7 可单独分享给 user:bob。

## 10.3 文档级屏蔽

对敏感文档允许设置 document-level blocked。即使用户通过 KB viewer/editor、Organization、Department 或 Project 获得访问，也可在该文档上显式拒绝。

## 10.4 设计建议：覆盖优先级

1.  账号/组织状态无效 → 直接拒绝。

2.  Document blocked → 拒绝该文档。

3.  Document direct grant / userset grant → 按文档关系授予能力。

4.  否则继承 KnowledgeBase 的对应能力。

5.  KnowledgeBase blocked → 对继承路径拒绝；文档是否允许“反向解除 KB blocked”默认不允许，避免权限语义过于复杂。

# 11. 审批治理模型

Authorization 回答“现在谁能做什么”；Approval Workflow 回答“谁有权批准产生这条授权”。二者必须分离：审批完成后，业务服务才向 OpenFGA 写入或删除 Relationship Tuple。

Share Request  
↓  
Approval Policy Match  
↓  
Approver(s)  
↓ approve  
Grant Record + OpenFGA Write  
↓  
Permission Effective

## 11.1 负责人体系

| **对象**      | **负责人**                 | **主要用途**                     |
|---------------|----------------------------|----------------------------------|
| Organization  | owner / admin              | 组织治理、跨组织授权审批。       |
| Department    | head                       | 部门相关授权申请或组织治理审批。 |
| Project       | owner / manager            | 项目成员和项目相关知识治理。     |
| KnowledgeBase | responsible_user / steward | KB 日常权限与共享审批。          |

## 11.2 默认审批策略（可由 Admin 修改）

| **场景**                                    | **默认策略**                                                            |
|---------------------------------------------|-------------------------------------------------------------------------|
| 同一组织内：manager 发起 viewer/editor 分享 | 默认直接生效。                                                          |
| 同一组织内：普通 editor/member 发起共享     | KB 负责人审批。                                                         |
| 跨部门共享                                  | KB 负责人审批；组织可配置追加部门负责人。                               |
| 跨组织 viewer                               | KB 负责人 → 源 Organization admin。                                     |
| 跨组织 editor/manager                       | KB 负责人 → 源 Organization admin；可配置目标 Organization admin 接受。 |
| Document 级敏感授权/解除 blocked            | KB 负责人审批；可配置追加组织管理员。                                   |

管理员可以按 Organization、资源类型、授权目标类型、目标权限级别定义 Approval Policy。系统必须始终存在一套 Default Policy，当没有更具体策略匹配时使用默认策略。

## 11.3 Approval Request 状态

draft → pending → approved → applied  
├→ rejected  
├→ cancelled  
└→ expired

approved 与 applied 分离：approved 表示审批通过；applied 表示 OpenFGA/Grant 写入成功。这样可处理审批通过但授权写入失败的可恢复场景。

# 12. Admin 后台功能设计

Admin 后台是组织结构、协作关系、授权和审批的主要配置入口。第一版建议包含以下模块：

| **模块**   | **核心能力**                                                                 |
|------------|------------------------------------------------------------------------------|
| 组织管理   | 组织信息、状态、owner/admin、默认审批策略。                                  |
| 部门管理   | 组织树、创建/移动/归档部门、负责人、成员。                                   |
| 用户管理   | 邀请、加入组织、加入多个部门、状态停用。                                     |
| 项目管理   | 创建项目、负责人、跨组织成员、成员状态、归档。                               |
| 知识库管理 | 负责人、关联项目、资源状态、共享入口。                                       |
| 共享与授权 | 按 Organization / Department / Project / User 创建 Grant，设置权限和有效期。 |
| 审批中心   | 待我审批、我的申请、审批历史、策略配置。                                     |
| 权限查询   | 查看用户/主体对资源的有效权限及权限来源。                                    |
| 审计日志   | 授权、撤销、成员、组织结构和关键资源操作历史。                               |

## 12.1 页面级权限

前端可根据后端返回的 capabilities 控制菜单、页面和按钮显示；但前端隐藏不是安全边界。Gateway/业务服务仍必须对每个受保护 API 做授权检查。

# 13. 审计与生命周期治理

## 13.1 Audit Log

以下操作至少应进入审计：登录安全事件、组织成员变化、部门成员变化、项目成员变化、KB/Document 共享、授权变更、审批、撤销、资源删除/归档、blocked 变更。

| **字段**                    | **说明**                                                    |
|-----------------------------|-------------------------------------------------------------|
| actor_user_id               | 谁执行。                                                    |
| organization_id             | 操作发生在哪个组织上下文。                                  |
| action                      | 动作，例如 grant.create / grant.revoke / approval.approve。 |
| resource_type / resource_id | 目标资源。                                                  |
| before / after              | 关键配置变化快照或差异。                                    |
| request_id                  | 与 Gateway / Trace 关联。                                   |
| created_at                  | 操作时间。                                                  |

## 13.2 生命周期原则

- 尽量使用 disabled / archived / completed 等状态，而不是直接物理删除关键人员、组织、项目与授权记录。

- 项目 completed/archived 后，项目关系可停止产生新增协作权限；是否立即撤销现有项目授权由策略配置。

- Department 被归档后不得继续新增成员或作为新的授权对象；已有授权可按管理员策略撤销或迁移。

- 用户离开 Organization 后，必须失去通过该 Organization、其 Department 和 Project 获得的访问路径。

# 14. Gateway + OpenFGA 请求链路

推荐将用户身份认证、外部授权决策和真实业务处理拆开。Gateway 是请求入口和策略执行点（PEP），OpenFGA 是权限决策引擎（PDP）。

Frontend  
↓ JWT  
Gateway / Envoy  
├─ verify identity  
└─ ext_authz  
↓  
Go AuthZ Adapter  
↓ maps request to  
user + relation + object  
↓  
OpenFGA  
/ \\  
allow deny  
↓ ↓  
Business 403  
Service

## 14.1 示例

DELETE /api/knowledge-bases/KB1  
JWT.sub = user:alice  
  
AuthZ Adapter maps to:  
user = user:alice  
relation = can_delete  
object = knowledge_base:KB1  
  
OpenFGA Check → allowed / denied

OpenFGA 不理解 HTTP 路由本身；AuthZ Adapter 负责将 Method + Route + Resource ID + User Context 转换成平台授权语义。

# 15. PostgreSQL 与 OpenFGA 数据职责

| **数据**             | **PostgreSQL**  | **OpenFGA**                    |
|----------------------|-----------------|--------------------------------|
| 用户基本信息         | 主数据          | 仅引用 user:id                 |
| 组织/部门/项目元数据 | 主数据          | 保存授权所需关系               |
| KB/Document 元数据   | 主数据          | 保存资源关系与权限 tuple       |
| 共享申请/审批记录    | 主数据          | 不负责审批流程                 |
| Grant 业务记录       | 主数据/审计来源 | 最终可执行关系                 |
| 权限决策             | 不直接承担      | Check / ListObjects 等         |
| 历史审计             | 主数据          | 可辅助但不作为业务审计唯一来源 |

> **Source of Truth 原则**
>
> OpenFGA 是授权关系与决策系统，不替代业务数据库。业务层必须保存可解释的 Grant / Approval / Audit 记录；OpenFGA 保存用于高效计算“谁能对什么做什么”的关系事实。

# 16. 核心数据模型建议

## 16.1 主要表

| **表**                   | **关键字段 / 作用**                                                      |
|--------------------------|--------------------------------------------------------------------------|
| users                    | id, status, profile...                                                   |
| organizations            | id, name, status...                                                      |
| organization_memberships | organization_id, user_id, role, status...                                |
| org_units                | id, organization_id, parent_id, name, type, status...                    |
| org_unit_memberships     | org_unit_id, user_id, status...                                          |
| org_unit_heads           | org_unit_id, user_id, effective_at...                                    |
| projects                 | id, organization_id, name, status, start_at, end_at...                   |
| project_members          | project_id, user_id, role, member_type, status...                        |
| knowledge_bases          | id, organization_id, responsible_user_id, status...                      |
| documents                | id, knowledge_base_id, status, sensitivity...                            |
| resource_grants          | resource_type/id, grantee_type/id, permission, expires_at, revoked_at... |
| approval_policies        | scope + match conditions + approval steps + priority...                  |
| approval_requests        | requester, resource, target, permission, status...                       |
| approval_steps           | request_id, step_no, approver_type/id, status...                         |
| invitations              | target_type/id, invitee, role, expires_at, status...                     |
| audit_logs               | actor, action, resource, before/after, request_id, created_at...         |

## 16.2 关系一致性

所有会改变 OpenFGA Tuple 的业务动作，应通过业务服务统一执行，并使用事务/Outbox/Event 机制保证 PostgreSQL Grant 记录与 OpenFGA 最终一致。第一版可先采用“数据库写入成功 → 同步写 OpenFGA → 失败记录 pending_sync 并重试”的简化策略。

# 17. 关键状态机与业务规则

## 17.1 Resource Grant

pending_approval → approved → active → revoked  
└→ expired  
└→ sync_failed → retry → active

## 17.2 Project

draft → active → suspended → active  
└→ completed → archived

## 17.3 规则清单

- 跨 Organization 访问必须来自显式授权、Project 成员关系 + Project 授权、或其他模型中明确允许的关系。

- 用户可同时属于多个 Department，部门授权为并集；blocked 可对特定资源形成显式排除。

- Project external member 不因为加入项目自动获得 Organization 其他资源权限。

- KB manager 能否直接共享由 Approval Policy 决定；默认同组织内可直接执行，跨组织仍走审批。

- Document 例外权限不得改变其最终 Organization 所有权。

- 撤销某个 Grant 后必须重新计算有效权限，不可简单认为用户已完全失权。

# 18. RAG 检索权限联动

本用户系统与普通后台最大的区别，是权限必须进入 RAG Retrieval Pipeline。权限控制不能只停留在页面和 API。

User Query  
↓  
Identity + active organization  
↓  
Authorization Scope  
(OpenFGA: accessible KB / Document)  
↓  
Retrieval Filter  
↓  
Milvus / Sparse Retrieval  
↓  
Reranker  
↓  
LLM

## 18.1 设计原则

- 优先在检索阶段限制可访问资源，不允许 LLM 接触无权限上下文。

- KB 级权限可映射为 collection/partition/metadata filter；Document 例外授权必须进一步作用到 document_id。

- 权限变更后，Retrieval 权限范围应尽快生效；缓存必须有明确失效机制。

- 对“列出我能访问的知识库/文档”可使用 OpenFGA ListObjects 类查询，并结合业务数据库返回资源详情。

- RAG 日志和 Evaluation 数据也必须遵守知识访问边界，避免通过可观测系统泄露敏感文本。

# 19. 非功能要求与安全边界

| **类别** | **要求**                                                                                     |
|----------|----------------------------------------------------------------------------------------------|
| 租户隔离 | Organization 是默认隔离边界；所有业务查询必须带 organization scope 或基于授权结果收敛。      |
| 最小权限 | 默认拒绝；未建立可证明授权路径时不得访问。                                                   |
| 一致性   | Grant/撤销/成员退出等高风险操作优先保证授权状态及时生效。                                    |
| 可解释性 | 管理员能查询有效权限及主要来源。                                                             |
| 可审计性 | 关键权限与组织变更必须可追溯。                                                               |
| 高可用   | OpenFGA 不可用时高风险操作默认 fail closed；只读场景是否降级由后续 SLA 决定。                |
| 缓存     | 可以缓存权限结果，但必须按 user/resource/relation/model/context 建键，并对撤销设置主动失效。 |
| 接口安全 | 用户身份由 JWT/OIDC 等机制传递；服务不得信任前端自行声明的 user_id 或 organization_id。      |

# 20. 分阶段实施建议

## Phase 1：领域与基础账户

- User / Organization / Department / Project / KB / Document 基础 CRUD。

- Membership、负责人、生命周期状态。

- Admin 后台基础页面与组织树。

## Phase 2：OpenFGA 授权

- 定义 Authorization Model。

- Organization / Department / Project / User → KB 授权。

- Document 继承、直授权与 blocked。

- Check / ListObjects 集成。

## Phase 3：共享与审批

- resource_grant、Approval Policy、Approval Request。

- 默认审批策略 + Admin 配置覆盖。

- 跨组织共享、有效期、撤销。

## Phase 4：Gateway 与前端能力

- Gateway / Envoy + AuthZ Adapter。

- 页面/按钮 capabilities。

- 权限来源解释和审计查询。

## Phase 5：RAG 权限联动

- Retrieval Scope。

- Milvus metadata filter / 文档例外过滤。

- Agent / Evaluation / 日志的权限传播。

# 附录 A：建议的 OpenFGA 概念映射（非最终 DSL）

type user  
type organization  
type department  
type project  
type knowledge_base  
type document  
  
organization:  
owner / admin / member / guest  
  
department:  
organization / member / head  
  
project:  
organization / owner / manager / member / guest  
  
knowledge_base:  
organization / responsible  
viewer / editor / manager / blocked  
can_view / can_edit / can_upload / can_share / can_manage_permissions  
  
document:  
parent -> knowledge_base  
viewer / editor / manager / blocked  
can_view / can_edit / can_manage  
+ inherit from parent

正式 OpenFGA DSL 应在进入 Phase 2 时单独编写、在 Playground 中建立测试用例，并用权限矩阵覆盖跨组织、跨部门、跨项目、多路径授权、blocked 与 Document 继承等场景。

# 附录 B：技术参考

- OpenFGA 官方文档：Concepts — Authorization Model、Relationship Tuple 与 Check。

- OpenFGA 官方文档：Parent-Child Objects — 父子资源的权限继承。

- OpenFGA 官方文档：Authorization Through Organization Context — 多组织上下文授权。

- OpenFGA 官方文档：Relationship Queries — Check / ListObjects 等授权查询。

- OpenFGA 官方文档：Conditions — 条件型授权与时间/属性约束。

- OpenFGA 官方文档：Roles and Permissions / Modeling Roles — 角色与权限建模。

> **文档定位**
>
> 本文件是“产品规则 + 领域/系统设计基线”，用于指导 Figma 原型、ER 图、OpenFGA Model、API Contract 和后续实现。它不是 UI 视觉稿，也不是最终数据库 DDL。
