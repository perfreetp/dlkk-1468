import { PrerequisiteItem } from '@/types';

export const prerequisites: PrerequisiteItem[] = [
  {
    id: 'pre-001',
    name: '完成工程设计和合同约定的各项内容',
    description: '工程已按设计图纸和施工合同约定全部完成',
    status: 'met',
    suggestion: '',
  },
  {
    id: 'pre-002',
    name: '施工单位已签署工程质量保修书',
    description: '施工单位出具的工程质量保修书，明确保修范围和期限',
    status: 'met',
    suggestion: '',
  },
  {
    id: 'pre-003',
    name: '有完整的技术档案和施工管理资料',
    description: '包含开工报告、技术交底、隐蔽验收、试验报告等全套资料',
    status: 'pending',
    suggestion: '请检查以下资料是否齐全：\n1. 地基基础、主体结构等分部工程验收记录\n2. 原材料、构配件的进场检验报告\n3. 隐蔽工程验收记录\n4. 沉降观测记录',
  },
  {
    id: 'pre-004',
    name: '有工程使用的主要建筑材料、建筑构配件和设备的进场试验报告',
    description: '钢筋、水泥、防水材料等主要材料的进场检验和试验报告',
    status: 'met',
    suggestion: '',
  },
  {
    id: 'pre-005',
    name: '建设单位已按合同约定支付工程款',
    description: '无拖欠工程款情况，并提供付款证明',
    status: 'met',
    suggestion: '',
  },
  {
    id: 'pre-006',
    name: '有公安消防部门出具的认可文件或准许使用文件',
    description: '消防验收合格或消防备案凭证',
    status: 'met',
    suggestion: '',
  },
  {
    id: 'pre-007',
    name: '有人防主管部门出具的认可文件或准许使用文件',
    description: '人防工程验收合格文件（适用于有人防工程的项目）',
    status: 'missing',
    suggestion:
      '您的项目包含人防工程，需要先完成人防验收。\n建议：\n1. 准备好人防工程竣工图纸\n2. 联系当地人防办提交验收申请\n3. 通常需要15-20个工作日',
  },
  {
    id: 'pre-008',
    name: '有环保部门出具的认可文件或准许使用文件',
    description: '环保验收或备案文件',
    status: 'missing',
    suggestion:
      '需要补充环保验收文件。\n建议：\n1. 委托有资质的监测单位进行验收监测\n2. 编制环保验收调查报告\n3. 在环保部门网站进行备案\n4. 预计需要10-15个工作日',
  },
  {
    id: 'pre-009',
    name: '有规划行政主管部门出具的规划验收核实文件',
    description: '规划条件核实合格证明',
    status: 'pending',
    suggestion: '请确保规划验收申请已提交，并等待核实结果。',
  },
  {
    id: 'pre-010',
    name: '有城建档案管理部门出具的档案预验收意见',
    description: '工程档案经城建档案馆预验收通过',
    status: 'missing',
    suggestion:
      '需要先办理档案预验收。\n建议：\n1. 按照城建档案目录整理工程资料\n2. 进行档案数字化扫描\n3. 向城建档案馆提交预验收申请\n4. 预计需要7-10个工作日',
  },
];
