# 方法依据与边界

## 定位

本 Skill 是面向软件工程文档的写作方法，不是国家标准，也不是 ASD-STE100 的中文译本或官方中文版本。

它从以下来源提取可迁移原则，再针对 API、架构、操作步骤和 Agent 指令增加软件工程检查项。

## 主要依据

### ASD-STE100 Simplified Technical English

ASD-STE100 使用写作规则和受控词典减少技术文档中的歧义。其官方 FAQ 说明：批准词通常限制为一个含义和一种词性；存在同义词时选择其中一个。

- 官方 FAQ：https://www.asd-ste100.org/STE_faq.html
- Issue 9：https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf

本 Skill 借鉴“受控术语、明确动作、减少歧义”的原则，但不把英语语法规则机械移植到中文。

### 中文标准化与术语工作

- GB/T 1.1-2020《标准化工作导则 第1部分：标准化文件的结构和起草规则》规定标准化文件的结构和起草规则。全国标准信息公共服务平台显示，该版本现行。
- GB/T 20001.1-2024《标准起草规则 第1部分：术语》适用于术语标准的起草。它已替代 GB/T 20001.1-2001。
- ISO 704:2022《Terminology work — Principles and methods》规定术语工作的基本原则和方法，包括对象、概念、定义和名称之间的关系。

这些标准支持术语定义与一致性工作，但不能直接证明某条软件文档写作规则是国家标准要求。

官方信息：

- GB/T 1.1-2020：https://std.samr.gov.cn/gb/search/gbDetailed?id=A24AF19F41445C2EE05397BE0A0A5E0D
- GB/T 20001.1-2024：https://std.samr.gov.cn/gb/search/gbDetailed?id=14156507D1FC0337E06397BE0A0AE656
- ISO 704:2022：https://www.iso.org/standard/79077.html

### 软件技术写作风格

Google Developer Documentation Style Guide 建议优先使用主动语态、清晰一致的术语和无歧义表达，同时明确允许在有助于读者时偏离一般规则。Microsoft Writing Style Guide 也强调清晰、直接和主动语态。

- Google active voice：https://developers.google.com/style/voice
- Google global audience：https://developers.google.com/style/translation
- Microsoft grammar checklist：https://learn.microsoft.com/en-us/style-guide/checklists/grammar-and-parts-of-speech-checklist

## 不采用的机械规则

- 不规定所有中文句子必须少于固定字数。
- 不禁止所有被动表达。
- 不把所有模糊词列为无条件禁词。
- 不要求把必要的专业术语替换成日常词汇。

这些绝对规则可能破坏原始语义。判断标准应是：表述是否准确、唯一、可执行和可验证。

