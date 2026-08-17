# Skills

面向支持 `SKILL.md` 的 AI 编程 Agent 的实用 Skill 集合。

## 收录内容

### [中文技术写作](skills/chinese-technical-writing/SKILL.md)

用于起草、审查和重写中文软件技术文档。该 Skill 适用于 README、API 文档、架构文档、ADR、开发与运维步骤，以及工程知识库。

它要求文档保持事实、契约和规范性语气不变，并识别阻塞性歧义。它不会补全未确认的接口、职责、术语映射或性能指标。

## 适用环境

本仓库的 Skill 内容不依赖 Codex。只要 Agent 环境能够读取和加载 `SKILL.md`，就可以使用其指令。

不同 Agent 的安装目录、发现机制和触发方式可能不同。请按对应工具的文档安装本仓库的 Skill。

## 安装

安装全部 Skill：

```bash
npx skills add huanancaoo/skills
```

只安装中文技术写作 Skill：

```bash
npx skills add https://github.com/huanancaoo/skills/tree/main/skills/chinese-technical-writing
```

安装到全局位置：

```bash
npx skills add huanancaoo/skills -g
```

## 目录结构

```text
.
├── README.md
└── skills/
    └── chinese-technical-writing/
        ├── SKILL.md
        ├── evals/
        └── references/
```

## 使用

在支持该 Skill 的 Agent 中，请求起草、审查或重写中文软件技术文档时，`chinese-technical-writing` 会按其适用范围生效。也可以在请求中明确指定该 Skill。

## 许可

本仓库暂未声明许可证。使用或分发前，请先确认仓库所有者的许可条件。
