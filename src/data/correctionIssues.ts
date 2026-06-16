import { CorrectionIssue } from '@/types';

export const correctionIssues: CorrectionIssue[] = [
  {
    id: 'issue-001',
    category: '规划核实',
    description: '计容建筑面积超出审批面积2.3%，超出误差允许范围',
    severity: 'high',
    selected: true,
  },
  {
    id: 'issue-002',
    category: '规划核实',
    description: '建筑高度超过审批高度0.8米',
    severity: 'high',
    selected: false,
  },
  {
    id: 'issue-003',
    category: '消防验收',
    description: '消防通道宽度不足，部分区域被占用',
    severity: 'high',
    selected: true,
  },
  {
    id: 'issue-004',
    category: '消防验收',
    description: '部分消防栓水压不足',
    severity: 'medium',
    selected: false,
  },
  {
    id: 'issue-005',
    category: '消防验收',
    description: '疏散指示标志安装位置不符合规范',
    severity: 'medium',
    selected: false,
  },
  {
    id: 'issue-006',
    category: '质量监督',
    description: '部分墙面存在裂缝，需进行处理',
    severity: 'medium',
    selected: true,
  },
  {
    id: 'issue-007',
    category: '质量监督',
    description: '屋面防水存在局部渗漏现象',
    severity: 'high',
    selected: false,
  },
  {
    id: 'issue-008',
    category: '环保验收',
    description: '污水处理设施运行记录不完整',
    severity: 'low',
    selected: false,
  },
  {
    id: 'issue-009',
    category: '档案资料',
    description: '部分隐蔽工程验收记录签字不齐全',
    severity: 'low',
    selected: true,
  },
  {
    id: 'issue-010',
    category: '档案资料',
    description: '竣工图与实际存在偏差，需重新绘制',
    severity: 'medium',
    selected: false,
  },
  {
    id: 'issue-011',
    category: '人防验收',
    description: '人防门密闭性检测报告缺失',
    severity: 'high',
    selected: false,
  },
  {
    id: 'issue-012',
    category: '人防验收',
    description: '人防通风设备调试记录不完整',
    severity: 'low',
    selected: false,
  },
];

export const generateCorrectionText = (
  projectName: string,
  selectedIssues: CorrectionIssue[]
): string => {
  const grouped = selectedIssues.reduce((acc, issue) => {
    if (!acc[issue.category]) {
      acc[issue.category] = [];
    }
    acc[issue.category].push(issue);
    return acc;
  }, {} as Record<string, CorrectionIssue[]>);

  let text = `关于${projectName}联合验收补正情况的说明\n\n`;
  text += `市住房和城乡建设局：\n\n`;
  text += `我单位建设的${projectName}项目，于近日收到贵局联合验收整改意见。`;
  text += `我单位高度重视，立即组织相关单位进行整改，现将有关情况说明如下：\n\n`;

  let index = 1;
  Object.entries(grouped).forEach(([category, issues]) => {
    text += `一、${category}方面\n\n`;
    issues.forEach((issue) => {
      const severityText =
        issue.severity === 'high'
          ? '严重问题'
          : issue.severity === 'medium'
          ? '一般问题'
          : '轻微问题';
      text += `${index}. ${issue.description}（${severityText}）\n\n`;
      text += `   整改措施：我单位已组织施工单位、监理单位对该问题进行了认真研究，`;
      text += `制定了专项整改方案，明确了整改责任人、整改措施和整改时限。\n`;
      text += `   整改情况：已按照相关规范要求完成整改，经监理单位验收合格。\n\n`;
      index++;
    });
  });

  text += `二、下一步工作计划\n\n`;
  text += `1. 我单位将以此次整改为契机，全面排查项目存在的问题，杜绝类似问题再次发生。\n`;
  text += `2. 加强工程质量管理，严格按照规范和设计要求施工。\n`;
  text += `3. 完善资料管理，确保工程档案真实、完整、规范。\n\n`;

  text += `综上所述，我单位已按照整改意见要求完成了全部整改工作，特申请复查。\n\n`;
  text += `特此说明。\n\n\n`;
  text += `建设单位（盖章）：\n\n`;
  text += `日期：    年   月   日\n`;

  return text;
};
