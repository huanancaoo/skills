# Skills

面向支持 `SKILL.md` 的 AI 编程 Agent 的实用 Skill 集合。

## 收录内容

### [中文技术写作](skills/chinese-technical-writing/SKILL.md)

用于起草、审查和重写中文软件技术文档。该 Skill 适用于 README、API 文档、架构文档、ADR、开发与运维步骤，以及工程知识库。

它要求文档保持事实、契约和规范性语气不变，并识别阻塞性歧义。它不会补全未确认的接口、职责、术语映射或性能指标。

### [前端交互决策](skills/frontend-interaction-decisions/SKILL.md)

用于根据业务任务和信息特征选择 Dialog、Sheet、独立页、字段控件、表单布局、Table 或 DataTable。该 Skill 跨框架和组件库，会核对数据规模、服务端查询能力与重排语义，并对未决产品问题给出推荐答案后请求确认。

### [vc-project](skills/vc-project/SKILL.md)

为 JS/TS 项目初始化 Codex 开发环境。支持 npm、pnpm、Yarn、Bun 和 monorepo，使用本地脚本比对依赖和配置。需要联网研究的候选默认留到主任务收尾，超过 5 项时通过 Codex Question List 选择处理时机。可选安装也通过 Question List 逐项确认。

## 适用环境

本仓库使用 `SKILL.md` 分发指令。`vc-project` 面向 Codex，其他 Skill 可用于能读取和加载 `SKILL.md` 的 Agent。

不同 Agent 的安装目录、发现机制和触发方式可能不同。请按对应工具的文档安装本仓库的 Skill。

## 安装

安装全部 Skill：

```bash
npx skills add huanancaoo/skills
```

只安装中文技术写作 Skill：

```bash
npx skills add huanancaoo/skills --skill chinese-technical-writing
```

只安装前端交互决策 Skill：

```bash
npx skills add huanancaoo/skills --skill frontend-interaction-decisions
```

在目标项目根目录为 Codex 安装 `vc-project`。

```bash
npx skills add huanancaoo/skills --agent codex --skill vc-project
```

使用本地开发版本时，将命令中的 `huanancaoo/skills` 换成本地 Skills 仓库的绝对路径。

安装到全局位置：

```bash
npx skills add huanancaoo/skills -g
```

## 目录结构

```text
.
├── README.md
└── skills/
    ├── chinese-technical-writing/
    │   ├── SKILL.md
    │   ├── evals/
    │   └── references/
    ├── frontend-interaction-decisions/
    │   ├── agents/
    │   ├── evals/
    │   ├── references/
    │   └── SKILL.md
    └── vc-project/
        ├── SKILL.md
        ├── assets/
        ├── references/
        └── scripts/
```

## 使用

在支持该 Skill 的 Agent 中，请求起草、审查或重写中文软件技术文档时，`chinese-technical-writing` 会按其适用范围生效。也可以在请求中明确指定该 Skill。

安装 `vc-project` 后，在目标项目的 Codex 会话中调用 `$vc-project` 完成首次检查。清单脚本需要 Node.js 22.17 或更高版本。初始化会在 `docs/agents/` 更新领域指南，并在根 `AGENTS.md` 登记本地快检和指南阅读条件。Codex 添加依赖后立即快检，普通终端新增的依赖在下一次会话补查。版本化快照保存在 `.agents/vc-project.json`，记录联网失败后会等到版本变化或显式刷新再尝试。

同一会话中显式刷新会重新核对本地配置。依赖版本和相关设置一致时会复用已核实的调研。只答复 Question List 中的部分选项时，剩余选项继续沿用原问题。

`docs/agents/code-standards.md` 记录各工作区实际使用的格式化和检查命令。缺少 ESLint 或 Prettier 时，Question List 提供采用 Biome（推荐）和补齐缺项两种方案，已有 Biome 能力会复用。两种方案都通过 ESLint 的类型感知规则 `@typescript-eslint/no-deprecated` 禁止新增已弃用 API。发现已有调用时，列出位置和替代方案，待用户确认后再迁移。

初始化或显式刷新时，`vc-project` 会将五项代码质量指标及评审方法写入这份指南。圈复杂度高时检查分支是否容易测试，函数或文件过长时检查职责划分。重复率按整个项目统计，核心模块的单元测试覆盖率注明按行还是按分支计算。技术债务率用于在同一项目、同一套分析规则下跟踪趋势。[查看推荐阈值与风险说明](skills/vc-project/assets/code-standards.md#code-quality-metrics)

项目有页面或 UI 组件时，`vc-project` 会把「页面组件信息克制与去重」并入已有的界面指南，或创建 `docs/agents/page-components.md`。根 `AGENTS.md` 在开发或评审页面组件时引导读取，覆盖同屏信息和主操作去重、页签与卡片、表单提示、危险操作及容器宽度。Table 和 DataTable 的每个数据单元格只展示本列字段，独立字段各占一列。已初始化的项目更新 Skill 后，显式刷新一次即可补上这条规范。

## 许可

本仓库暂未声明许可证。使用或分发前，请先确认仓库所有者的许可条件。
