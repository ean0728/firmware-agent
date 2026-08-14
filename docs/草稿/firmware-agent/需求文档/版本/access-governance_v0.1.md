---
document_version: v0.1
lifecycle: work
frozen_at: none
---

# 企业文档与知识库平台用户及访问权限需求文档

**用途**：定义开源首版的用户、组织关系、文档协作和知识库访问权限，作为产品讨论与 Figma 原型设计输入。

**当前范围**：面向固件、上位机、半导体和制造业知识协作场景，覆盖用户身份、Organization、Department、Project、文档管理平台、知识库管理平台及其跨平台权限关系。

**生命周期**：`work`。第一次正式评审意见及后续用户决策已写入当前工作稿，尚未进行修改后复审，也未封版。

---

## 1. 产品目标与首版边界

开源首版需要提供一套容易理解的用户和访问权限底座，使用户、部门和项目能够安全地共享文档、共同编辑部门文档，并把审核后的正式文档按需加入知识库。

本主题重点解决：

- 用户属于哪些 Organization、Department 和 Project；
- 用户能查看、编辑和管理哪些文档与知识库；
- 文档跨部门共享后如何独立修改、审核和形成版本；
- 正式文档如何加入或更新 KnowledgeBase；
- 用户退出组织关系后，相关权限如何失效；
- Admin、负责人和普通用户分别可以查询哪些授权结果。

开源首版弱化传统 ERP/IAM 能力：

- 不提供邀请、用户自助改密、忘记密码或自助重置；
- 不建设通用审批策略引擎、多级审批、审批转交或审批超时机制；
- 不建设复杂风险分类、通用审计中心或管理员自定义权限 DSL；
- 不在本需求中设计完整 HR/OA、文档在线编辑器实现、知识切片、索引、RAG 编排、Harness 或 Agent；
- 不确定数据库表、API、服务拆分、页面布局和视觉样式。

后续 RAG、Harness 或 Agent 可以消费本主题产生的最终知识访问范围，但其自身流程不属于当前 v0.1。

## 2. 核心术语与资源模型

| 术语                | 含义                                                        |
| ----------------- | --------------------------------------------------------- |
| User              | 平台级唯一用户身份                                                 |
| Organization      | 默认数据与访问隔离边界                                               |
| Department        | Organization 内支持多级层级的正式部门                                 |
| Project           | Organization 内的项目协作空间，可包含 external member                 |
| ManagedDocument   | 文档管理平台中的源文档或部门共享分支                                        |
| Document Branch   | 文档共享到接收部门后形成的独立部门文档分支                                     |
| KnowledgeBase     | Organization、Department、Project 或个人使用的知识库                 |
| KnowledgeDocument | ManagedDocument 加入 KnowledgeBase 后形成的独立知识库文档副本            |
| Grant             | 某个主体对资源获得 viewer 或 editor 权限的授权关系                         |
| 负责人               | 对指定 Organization、Department、Project、文档或知识库承担管理、审核和授权责任的用户 |

ManagedDocument 与 KnowledgeDocument 是不同对象：

- ManagedDocument 负责共享、多人编辑、审核发布和版本管理；
- KnowledgeDocument 是正式版本加入 KnowledgeBase 后产生的独立快照；
- ManagedDocument 后续修改或删除不会自动改变既有 KnowledgeDocument；
- KnowledgeBase 是否更新到新的正式版本，由相应负责人明确决定。

## 3. 用户、组织与当前上下文

### 3.1 全局用户身份

User 是平台级唯一身份，不因加入不同 Organization 而复制账户。用户可以加入多个 Organization，并在各 Organization 中具有不同的成员关系和职责。

涉及组织资源的页面、操作和权限查询必须具有明确的当前 Organization。切换 Organization 后，系统需要重新确定可见资源和可执行操作；用户已退出或当前 Organization 无效时，不得继续沿用原上下文。

### 3.2 开源版账户与密码

- 只有平台级 Admin 可以创建平台用户；
- 创建时由平台级 Admin 设置密码；
- 创建成功后账户立即进入 `active`，不需要邀请或再次启用；
- 平台级 Admin 可以为用户设置新密码；
- 普通用户不能修改本人密码；
- 登录页和个人设置不提供忘记密码、修改密码或自助重置入口；
- 用户忘记密码后线下联系平台级 Admin；
- 密码轮换、首次登录强制改密和唯一 Admin 的部署恢复不属于当前产品需求。

创建用户和设置新密码必须显示成功或失败结果，不得记录或展示密码明文。

### 3.3 组织与资源职责

| 身份或职责 | 首版权限范围 | 内容与管理能力 |
| --- | --- | --- |
| 平台级 Admin | 全平台用户、Organization 及全部资源 | 可以查看和管理全平台全部资源，包括所有 Organization 下的部门、项目、个人文档和个人知识库内容 |
| Organization owner/admin | 当前 Organization 及其全部下级资源 | 可以查看和管理本 Organization 内全部资源，包括下级 Department、Project、个人文档、个人知识库及其文档 |
| Department 负责人 | 本部门成员、部门文档、部门知识库 | 对本部门草稿、正式文档和知识库具有查看、编辑、审核和管理能力 |
| Project owner/manager | 本项目成员、项目文档、项目知识库 | 对本项目草稿、正式文档和知识库具有查看、编辑、审核和管理能力 |
| 个人资源所有者 | 本人的个人文档和个人知识库 | 对本人资源具有查看、编辑和授权能力，仍受 Organization owner/admin 和平台级 Admin 管理 |
| 普通成员 | 根据成员关系和明确 Grant 使用资源 | 只获得有效授权提供的 viewer/editor 能力 |
| external member | 根据 Project 成员关系和项目授权使用资源 | 只获得项目范围内的有效 viewer/editor 能力 |

平台级 Admin 是全平台超级管理员。Organization owner/admin 是组织范围内的超级管理员，其管理和内容访问范围覆盖该 Organization 的全部下级 Department、Project、个人资源和知识库文档，但不能访问其他 Organization 的资源。个人知识库中的“个人”表示普通成员默认不可见，不表示对 Organization owner/admin 或平台级 Admin 隐藏。

### 3.4 Department 与 Project

Department 支持多级层级，用户可同时加入多个 Department，不强制主部门和兼职部门。Department 负责人负责本部门文档审核、知识库管理和跨部门共享。

Project 独立于 Department，归属于一个 Organization，至少包含 owner/manager、member、guest，并区分 internal member 和 external member。

其他 Organization 的平台用户可以直接成为 Project external member，不要求先成为目标 Organization guest。开源首版不支持跨 Organization 直接共享文档或知识库；外部用户只能通过 external Project member 关系获得该项目明确授权的资源权限。

加入 Project 不自动获得项目所属 Organization、Department 或其他 Project 的资源权限。

## 4. 影响访问的状态

首版只定义会改变登录、资源可见性或授权结果的状态，不扩展传统 ERP 生命周期。

### 4.1 主体状态

| 对象           | 状态        | 用户可见结果                  |
| ------------ | --------- | ----------------------- |
| User         | active    | 正常登录并按有效权限访问            |
| User         | suspended | 暂停登录和业务访问，成员及历史授权保留     |
| User         | disabled  | 不可登录，历史记录保留             |
| Organization | active    | 正常使用                    |
| Organization | suspended | 组织内业务访问暂停，关系和内容保留       |
| Organization | archived  | 不再新增成员和授权，业务访问关闭，历史保留   |
| Department   | active    | 成员关系和部门权限正常生效           |
| Department   | archived  | 不再新增成员或授权，部门来源权限失效，历史保留 |

Department 存在有效授权时不得直接归档。归档前必须展示受影响授权，并完成迁移、转换或撤销。

### 4.2 Project 状态

| 状态 | 成员与授权结果 |
| --- | --- |
| active | 项目正常运行，可管理成员、编辑项目文档、使用项目知识库并创建授权 |
| suspended | 项目暂时停用，成员与授权关系保留，但暂停项目资源访问和业务操作；恢复为 active 后继续生效 |
| archived | 项目已经完成并只读归档；既有成员可以查看历史文档和知识库，但不能编辑内容、新增成员或新增授权 |

Project 创建成功后直接进入 `active`。`active` 可以切换为 `suspended`，`suspended` 可以恢复为 `active`；`active` 或 `suspended` 可以归档为 `archived`。`archived` 是终态，不再恢复为 `active`，也不再单独设置 `completed` 状态。

### 4.3 资源状态

| 对象 | 状态 | 访问结果 |
| --- | --- | --- |
| ManagedDocument | active | 可按权限查看、编辑、共享和形成版本 |
| ManagedDocument | archived | 只读保留，不再创建新草稿或共享 |
| ManagedDocument | deleted | 源文档不可访问，已有部门分支和 KnowledgeDocument 不受影响 |
| KnowledgeBase | active | 可按权限查看、编辑和管理 |
| KnowledgeBase | suspended | 暂停内容访问和更新，授权关系保留 |
| KnowledgeBase | archived | 既有内容只读保留，不新增文档或授权 |
| Grant | active | 正常提供 viewer 或 editor 能力 |
| Grant | revoked | 不再提供权限，历史记录保留 |

## 5. 文档管理平台

### 5.1 文档归属与基础权限

ManagedDocument 必须属于当前 Organization，并归入以下一个管理范围：

- Organization；
- Department；
- Project；
- 个人。

文档内容权限为：

| 权限 | 能力 |
| --- | --- |
| viewer | 查看最新正式版本及允许访问的历史版本 |
| editor | 具有 viewer 能力，并可参与当前范围内的文档草稿编辑、提交审核 |

文档共享、审核、版本恢复和授权撤销由资源负责人执行，不把这些管理能力作为可任意转授的普通权限级别。

开源首版不提供 `blocked`。当需要禁止访问时，应撤销该用户、Department 或 Project 的有效授权路径；如果仍有其他路径提供权限，权限查询必须明确显示这些来源。

### 5.2 组织与部门可见范围

- Organization 级正式文档可由 Organization owner/admin 共享给全 Organization 或指定 Department、Project；
- Department 文档可以仅限本部门，也可以由 Department 负责人共享给指定下级或其他 Department；
- Project 文档默认仅对项目内具有权限的成员可见；
- 个人文档默认仅本人可见，所有者可在当前 Organization 内明确共享；
- 普通用户可以查看本人所属 Department、Project，以及其他主体明确共享给本人或其成员集合的正式文档；
- 同一文档通过多条允许路径可见时，任意一条有效路径即可提供相应能力。

### 5.3 跨部门共享形成独立分支

当 A Department 把一个正式文档同时共享给 B、C Department 时，系统分别创建 B、C 的独立 Document Branch：

```text
A Department 正式文档
├─ B Department 分支
└─ C Department 分支
```

每个分支必须保留源文档、源版本、共享发起人和共享时间等来源信息，但其内容和版本从创建后独立管理：

- B 的修改只发生在 B 分支，A、C 不能查看 B 的草稿和未再次共享的正式修改；
- C 的修改同理，不影响 A、B；
- B、C 分支不会因源文档后续更新而自动改变；
- A 发布新版本后，B、C 负责人可以选择将源文档新版本拉取为本部门的新草稿；
- 拉取不会直接覆盖本部门当前正式版本，必须经过本部门编辑和审核；
- A 删除源文档或撤销原共享后，B、C 已创建的分支继续保留，并标记源文档已删除或停止共享；
- B 负责人可以把 B 已审核的正式版本再次共享给其他 Department，再次共享会为接收方创建新的独立分支。

只能从正式版本创建接收部门分支，不能共享未审核草稿。

### 5.4 多人协作草稿

同一 Department 或 Project 中，具有 editor 权限的用户和资源负责人可以查看并共同编辑同一份草稿。仅有 viewer 权限的用户不能查看未审核草稿，在新版本发布前继续查看上一正式版本。

多人同时编辑时，产品必须满足以下用户结果：

- 参与者编辑的是同一份当前草稿，不为每个人生成互相覆盖的个人副本；
- 编辑者能够识别当前协作者和最新保存结果；
- 系统不得静默丢失或覆盖其他人的已保存修改；
- 具体采用实时协同、分段锁定或冲突处理机制，由后续技术设计确定。

任何参与当前草稿的 editor 都可以提交审核。提交后草稿进入 `pending_review` 并暂停编辑，避免审核期间内容继续变化。

### 5.5 简单审核与发布

Department 文档由 Department 负责人审核，Project 文档由 Project owner/manager 审核，Organization 文档由 Organization owner/admin 审核。个人文档由所有者直接发布，不需要审批。

```text
editing → pending_review → published
                       └→ rejected → editing
                       └→ withdrawn → editing
```

- 审核通过：生成新的正式版本；
- 审核不通过：填写退回原因，草稿重新开放编辑，不产生正式版本；
- 提交人在负责人处理前可以撤回，撤回后草稿重新开放编辑；
- 开源首版不提供多级审批、审批转交或系统自动过期。

### 5.6 文档版本管理

每次审核通过都创建不可直接改写的正式版本。版本记录至少包括：

- 版本号；
- 变更说明；
- 参与编辑者；
- 提交人；
- 审核人及审核结果；
- 提交、审核和发布时间；
- 来源文档及来源版本。

具有文档访问权限的用户可查看和下载其权限范围内的历史正式版本。负责人可以选择一个历史版本恢复为新草稿；恢复操作不会删除后续版本，仍需重新审核后才能成为最新正式版本。

## 6. 知识库管理平台

### 6.1 KnowledgeBase 类型与负责人

| 类型 | 所有权 | 日常负责人 | 上级管理者 |
| --- | --- | --- | --- |
| Organization KnowledgeBase | Organization | Organization owner/admin | 平台级 Admin |
| Department KnowledgeBase | Organization，业务范围为 Department | Department 负责人 | Organization owner/admin、平台级 Admin |
| Project KnowledgeBase | Organization，业务范围为 Project | Project owner/manager | Organization owner/admin、平台级 Admin |
| Personal KnowledgeBase | Organization，使用范围为个人 | 个人用户 | Organization owner/admin、平台级 Admin |

个人知识库不脱离 Organization 独立存在。用户退出 Organization 后，失去该 Organization 内个人知识库及其中内容的访问和管理能力。

Project 与 KnowledgeBase 之间只保留明确授权，不再使用含义不明的“关联知识库”。Project 不是知识资产最终所有者。

日常负责人处理对应知识库的内容和成员事务；Organization owner/admin 对本 Organization 内所有 KnowledgeBase 保留完整的查看与管理权限，可以进入、查看、授权、撤销、更新、归档或处理下级负责人无法完成的任务。平台级 Admin 对全平台所有 KnowledgeBase 具有相同的上级管理权限。

### 6.2 知识库权限与授权

| 权限 | 能力 |
| --- | --- |
| viewer | 查看 KnowledgeBase 及其中当前可用的 KnowledgeDocument |
| editor | 具有 viewer 能力，并可提交新增、更新或移除 KnowledgeDocument；不能直接修改已生效正文、管理授权或执行审批 |

KnowledgeBase editor 是内容变更提交者，不是知识库管理员。editor 可以：

- 上传本地文件，提交新增 KnowledgeDocument；
- 选择本人有权查看的正式 ManagedDocument，提交加入 KnowledgeBase；
- 在源文档产生新正式版本后，提交更新既有 KnowledgeDocument；
- 为直接上传的 KnowledgeDocument 提交新的文件版本；
- 提交从 KnowledgeBase 移除 KnowledgeDocument；
- 查看本人提交的内容变更状态，并在负责人处理前撤回。

editor 不可以：

- 直接修改已经生效的 KnowledgeDocument 正文；
- 直接让新增、更新或移除生效；
- 批准或拒绝内容变更请求；
- 授予、修改或撤销 viewer/editor；
- 修改负责人、归档 KnowledgeBase 或执行其他管理操作。

KnowledgeBase 日常负责人负责：

- 向当前 Organization 内的 User、Department 或 Project 授予 viewer/editor；
- 查看哪些主体正在使用知识库以及每个主体的权限；
- 撤销授权；
- 处理 editor 提交的文档新增、更新和移除请求；
- 决定是否把知识库中的旧文档版本更新为新的正式版本。

日常负责人本人执行新增、更新、移除、授权或撤销时直接生效，不需要自己审批自己。Organization owner/admin 可以管理本 Organization 内全部知识库及其内容和授权，包括 Organization、Department、Project 和个人知识库，不受下级知识库日常负责人范围限制。平台级 Admin 可以管理全平台全部知识库。

开源首版不支持把 KnowledgeBase 直接授权给其他 Organization 或外部 User。external member 只能通过其所在 Project 获得项目明确授权的知识库权限。

### 6.3 KnowledgeBase 内容变更流程

editor 可以提交三类内容变更：

- **新增**：上传本地文件，或者选择有权查看的正式 ManagedDocument 加入 KnowledgeBase；
- **更新**：为既有 KnowledgeDocument 提交新的正式源文档版本或新的上传文件版本；
- **移除**：申请把 KnowledgeDocument 从当前 KnowledgeBase 中移除，不删除源文档，也不影响其他 KnowledgeBase 中的副本。

基于 ManagedDocument 发起新增或更新时必须同时满足：

1. 用户能够查看 ManagedDocument 的目标正式版本；
2. 用户对目标 KnowledgeBase 具有 editor 权限；
3. ManagedDocument 与 KnowledgeBase 属于同一 Organization；
4. 目标版本已经正式发布，不是草稿或待审核版本。

Organization、Department 或 Project KnowledgeBase 的 editor 内容变更使用最小审核流程：

```text
pending → approved → applied
        └→ rejected
        └→ withdrawn
```

- 目标 KnowledgeBase 日常负责人批准或拒绝新增、更新或移除；
- 发起人在负责人处理前可以撤回；
- `approved` 表示负责人同意，`applied` 表示新增、更新或移除已经成功生效；
- 实际生效失败时显示明确失败结果，日常负责人、Organization owner/admin 或平台级 Admin 可以在各自管理范围内重试；
- 不提供多级审批、转交或过期状态；
- 日常负责人、Organization owner/admin 或平台级 Admin 在各自管理范围内发起的内容变更直接生效；
- 个人知识库所有者的内容变更直接生效，不需要审批。

内容变更生效后：新增会生成 KnowledgeDocument；更新会创建新的 KnowledgeDocument 版本并保留旧版本；移除会停止该 KnowledgeDocument 在当前 KnowledgeBase 中的使用并保留历史记录。

### 6.4 KnowledgeDocument 独立快照

KnowledgeDocument 是加入时正式版本的独立快照：

- ManagedDocument 后续编辑、发布、归档或删除，不会自动改变或删除既有 KnowledgeDocument；
- KnowledgeDocument 保留来源文档、来源分支和来源版本；
- 负责人可以查看知识库当前使用的是哪个来源版本；
- KnowledgeBase 内不得因源文档失效而静默丢失已批准内容。

### 6.5 正式文档更新知识库

Department 分支发布新正式版本后，系统应列出本 Department 范围内包含该文档旧版本的 KnowledgeBase。Department 负责人可以选择更新其中一个、多个或全部知识库，也可以暂不更新。

更新规则：

- 不自动更新任何 KnowledgeBase；
- Department 负责人更新本部门 KnowledgeBase 时直接生效，不需要再次审批；
- Project 或 Organization KnowledgeBase 由其各自负责人决定是否更新；
- 个人知识库由个人用户自行决定；
- 普通 editor 选择新正式版本时只能提交更新请求，由对应日常负责人处理；
- 每次更新创建新的 KnowledgeDocument 版本，旧版本保留在知识库历史中；
- B Department 的更新只影响所选择的 B Department KnowledgeBase，不影响 A、C 或其他主体的知识库。

## 7. 最终权限与失效规则

### 7.1 权限计算

一个用户可以通过 User 直授权、Department、Project 或资源负责人身份获得权限。系统根据全部当前有效的允许路径计算最终能力：

1. User、Organization 或当前上下文无效时拒绝；
2. Department、Project 或资源处于不允许访问的状态时，对应路径不生效；
3. 任意有效 editor 路径提供编辑能力；
4. 没有 editor 但存在有效 viewer 路径时提供查看能力；
5. 没有有效允许路径时拒绝。

开源首版没有 `blocked/禁止访问` 优先规则。撤销一条 Grant 只移除该路径；如果用户仍通过其他路径拥有权限，系统必须明确显示剩余来源。

### 7.2 成员退出

- 用户退出 Department 后，立即失去通过该 Department 获得的文档和知识库权限；
- 用户退出 Project 后，立即失去通过该 Project 获得的权限；
- 用户退出 Organization 后，立即失去该 Organization 内的全部资源权限，包括 User 直授权、Department、Project 和个人知识库；
- Organization 外部用户退出 external Project 后，立即失去该项目提供的全部资源权限；
- 成员退出不删除历史编辑、审核、版本和操作记录。

权限或成员变化成功后，所有新页面请求、管理操作和下游知识访问请求必须立即使用新的权限结果，不继续使用旧的允许结果。

## 8. 权限查询与用户反馈

### 8.1 查询范围

| 查询者 | 可查询范围 |
| --- | --- |
| 普通用户 | 只查询本人对文档和知识库的最终权限及来源 |
| 平台级 Admin | 查询并管理全平台授权关系、主体状态和全部资源内容 |
| Organization owner/admin | 查询并管理本 Organization 全部授权关系和资源内容，包括下级 Department、Project 与个人资源 |
| Department 负责人 | 查询本部门文档、知识库的使用主体和每个主体权限 |
| Project owner/manager | 查询本项目文档、知识库的使用主体和每个主体权限 |
| 个人知识库所有者 | 查询本人知识库授权给了谁以及每个主体权限 |

权限查询至少需要回答：

- 当前主体对目标资源拥有 viewer 还是 editor；
- 权限来自直接授权、Department、Project 还是负责人身份；
- 当前状态或成员退出是否导致路径失效；
- 撤销某条路径后是否还有其他有效路径。

### 8.2 操作反馈

创建用户、设置密码、共享文档、提交审核、审核处理、发布版本、加入知识库、更新知识库、授权和撤销都必须显示成功或失败结果。无权限时应说明是没有授权、成员关系失效、资源状态限制还是服务暂时不可用。

具体采用隐藏入口、禁用操作或说明页，由 Figma 在不改变业务含义的前提下决定。

## 9. Admin 与负责人任务

| 任务域 | 首版必须支持的任务 |
| --- | --- |
| 用户管理 | 平台级 Admin 创建用户、设置密码、停用或恢复用户 |
| 组织成员 | 维护 Organization、Department、Project 成员和负责人 |
| 超级管理 | 平台级 Admin 查看和管理全平台资源；Organization owner/admin 查看和管理本 Organization 的全部下级及个人资源 |
| 文档管理 | 查看文档归属、共享分支、草稿状态、审核结果和版本历史 |
| 文档审核 | 负责人审核、退回以及查看待处理草稿 |
| 知识库管理 | 查看知识库类型、负责人、状态、授权主体和当前文档版本 |
| 知识库授权 | 负责人直接授予或撤销 viewer/editor |
| 文档入库 | 负责人处理加入请求，个人知识库所有者直接加入 |
| 知识库更新 | 正式文档发布后选择需要更新的知识库 |
| 权限查询 | 按管理范围查询有效能力、来源和失效原因 |

开源首版不建设通用审批中心、策略配置中心或复杂 ERP 工作台。待审核草稿和待处理入库请求可以作为负责人任务入口呈现，具体导航由 Figma 决定。

## 10. 最小操作记录与安全结果

首版保留解释权限变化所需的最小操作记录：

- 用户创建和状态变化；
- Organization、Department、Project 成员变化；
- 文档共享和分支创建；
- 草稿提交、撤回、审核、发布和版本恢复；
- 文档加入或更新 KnowledgeBase；
- Grant 创建和撤销；
- 资源归档或删除。

每条记录至少包含操作者、当前 Organization、动作、目标、结果和时间。不得记录密码明文。

安全结果必须满足：

- Organization 是默认隔离边界；
- 开源首版不允许跨 Organization 直接共享文档或知识库；
- 未授权用户不能查看文档内容、草稿、历史版本或 KnowledgeDocument；
- 草稿仅对具有 editor 权限的用户和负责人可见；
- 源文档、部门分支和 KnowledgeDocument 的权限分别判断；
- 服务无法确认权限时拒绝受保护访问，并向用户显示可理解的失败信息；
- 后续检索或其他消费者只能使用当前用户有权访问的 KnowledgeDocument，不能接触未授权内容。

## 11. 已确认决策与 Figma 自由范围

### 11.1 已确认决策摘要

- 开源版弱化审批、密码和传统 ERP/IAM 能力，重点设计文档与知识库权限；
- 跨部门共享为接收部门创建独立文档分支，各部门修改互不影响；
- 只有 editor 和负责人能够查看草稿，多人共同编辑同一草稿；
- 任意参与编辑者可提交审核，提交后暂停编辑；
- 审核通过形成正式版本，历史版本可查看、下载并恢复为新草稿；
- 源文档新版本不自动覆盖接收部门分支，由负责人选择拉取；
- 源文档删除或停止共享不删除已经创建的部门分支；
- 审核后的部门正式版本可由负责人再次共享；
- 知识库不自动更新，由负责人选择需要更新的目标；
- 开源版删除 blocked，只保留允许授权和撤销；
- 不支持跨 Organization 直接共享，外部用户通过 external Project member 获得项目权限。

### 11.2 Figma 自由范围

Figma 可以决定页面结构、导航、表格、树、卡片、弹窗、抽屉、版本时间线、协作状态表现、响应式方式和视觉语言。

Figma 不得改变以下产品规则：资源归属、部门分支隔离、草稿可见范围、负责人审核、版本形成条件、知识库更新选择、权限来源、成员退出结果和跨 Organization 边界。
