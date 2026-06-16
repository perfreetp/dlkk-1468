import { MaterialItem } from '@/types';

export const materials: MaterialItem[] = [
  {
    id: 'mat-001',
    name: '建设工程规划许可证',
    category: '前期资料',
    required: true,
    description: '由规划部门核发的建设工程规划许可证明文件',
    plainExplanation:
      '简单来说，这是政府规划部门给你的"建房许可证"，证明你的项目符合城市规划要求。没有这个证，项目就是违法建设。',
    example: '证件编号：建字第330100202400015号',
    errorProneFields: [
      {
        id: 'ep-001',
        fieldName: '证件编号',
        errorTip: '编号格式容易写错，注意是"建字第"开头，不要写成"建设第"或漏写"第"字',
        correctExample: '建字第330100202400015号',
        errorRate: 38,
      },
      {
        id: 'ep-002',
        fieldName: '发证日期',
        errorTip: '容易与开工日期混淆，发证日期是规划局批准的日期，不是你开始建设的日期',
        correctExample: '发证日期：2024年2月20日',
        errorRate: 25,
      },
    ],
    templates: [],
    status: 'completed',
  },
  {
    id: 'mat-002',
    name: '施工图设计文件审查合格书',
    category: '前期资料',
    required: true,
    description: '施工图经有资质的审查机构审查合格的证明文件',
    plainExplanation:
      '你的施工图纸需要专业机构审核，确认设计符合规范要求。这张合格书就是审核通过的证明，相当于图纸的"合格证"。',
    example: '审查编号：2024-03-015，审查机构：XX施工图审查中心',
    errorProneFields: [
      {
        id: 'ep-003',
        fieldName: '审查机构名称',
        errorTip: '必须填写审查机构的完整全称，不能简写。很多人会漏写"有限责任公司"等后缀',
        correctExample: 'XX市建筑工程施工图审查中心有限公司',
        errorRate: 42,
      },
    ],
    templates: [
      {
        id: 'tpl-001',
        name: '施工图审查合格书模板',
        format: 'docx',
        size: '256KB',
      },
    ],
    status: 'completed',
  },
  {
    id: 'mat-003',
    name: '工程质量监督报告',
    category: '验收资料',
    required: true,
    description: '质量监督机构出具的工程质量监督报告',
    plainExplanation:
      '质量监督站全程监督你的工程质量，最后会出具一份报告，说明工程质量是否合格。这是验收的必备材料。',
    example: '报告编号：质监字〔2025〕第028号',
    errorProneFields: [
      {
        id: 'ep-004',
        fieldName: '监督注册编号',
        errorTip: '很多人会把监督编号和施工许可证编号搞混，注意监督编号是质监站给的，格式通常是"质监字"开头',
        correctExample: '质监字〔2025〕第028号',
        errorRate: 35,
      },
    ],
    templates: [],
    status: 'in-progress',
  },
  {
    id: 'mat-004',
    name: '建筑工程施工许可证',
    category: '前期资料',
    required: true,
    description: '建设行政主管部门核发的施工许可证明',
    plainExplanation:
      '这是你可以正式开工的"通行证"。没有施工许可证就开工是违法的，会被罚款。注意和规划许可证区分开，规划是"同意你建"，施工许可是"同意你开工建"。',
    example: '施工许可证号：330100202403150101',
    errorProneFields: [
      {
        id: 'ep-005',
        fieldName: '施工许可证编号',
        errorTip: '编号是18位数字，不能缺漏。很多人会抄错中间的日期部分数字',
        correctExample: '330100202403150101',
        errorRate: 45,
      },
      {
        id: 'ep-006',
        fieldName: '合同工期',
        errorTip: '必须与施工合同上的工期完全一致，不能随意估算。注意是"日历天"还是"工作日"',
        correctExample: '合同工期：680日历天',
        errorRate: 30,
      },
    ],
    templates: [],
    status: 'completed',
  },
  {
    id: 'mat-005',
    name: '消防验收意见书',
    category: '专项验收',
    required: true,
    description: '消防部门出具的消防验收合格意见',
    plainExplanation:
      '消防部门会检查你的消防设施是否达标，比如消火栓、喷淋、烟感、疏散通道等。这是一个很容易卡住的环节，一定要提前准备好。',
    example: '消验字〔2025〕第056号',
    errorProneFields: [
      {
        id: 'ep-007',
        fieldName: '验收范围',
        errorTip: '验收范围必须和规划许可证一致，不能多也不能少。如果只验收了一部分，要写清楚具体范围',
        correctExample: '验收范围：1#、2#住宅楼及地下车库',
        errorRate: 52,
      },
    ],
    templates: [
      {
        id: 'tpl-002',
        name: '消防验收申请表',
        format: 'docx',
        size: '128KB',
      },
    ],
    status: 'completed',
  },
  {
    id: 'mat-006',
    name: '规划验收核实确认书',
    category: '专项验收',
    required: true,
    description: '规划部门对建设工程进行规划核实的确认文件',
    plainExplanation:
      '就是规划部门来检查你建的房子和当初批准的设计图是不是一样的。比如面积有没有超、高度有没有超、位置有没有偏移等。',
    example: '规核字第330100202500032号',
    errorProneFields: [
      {
        id: 'ep-008',
        fieldName: '计容建筑面积',
        errorTip: '这是最容易出问题的指标！实测面积和审批面积的误差不能超过规定值，超出了要整改或处罚',
        correctExample: '计容建筑面积：85600平方米（误差0.3%）',
        errorRate: 60,
      },
    ],
    templates: [],
    status: 'in-progress',
  },
  {
    id: 'mat-007',
    name: '环境保护验收意见',
    category: '专项验收',
    required: true,
    description: '生态环境部门出具的环保验收意见',
    plainExplanation:
      '检查你项目的环保设施是否同时建成投用，比如污水处理、废气处理、噪音防护等。环保不达标，验收肯定过不了。',
    example: '环验〔2025〕023号',
    errorProneFields: [],
    templates: [],
    status: 'not-started',
  },
  {
    id: 'mat-008',
    name: '人防工程验收备案表',
    category: '专项验收',
    required: true,
    description: '人民防空主管部门出具的人防工程验收备案材料',
    plainExplanation:
      '如果你小区有人防地下室，就需要人防部门验收。人防工程有特殊的质量要求，不能随便改设计。',
    example: '人防验字〔2025〕第012号',
    errorProneFields: [],
    templates: [],
    status: 'not-started',
  },
  {
    id: 'mat-009',
    name: '竣工验收报告',
    category: '验收资料',
    required: true,
    description: '建设单位组织编制的竣工验收报告',
    plainExplanation:
      '这是你自己组织参建各方（建设、设计、施工、监理）一起验收后写的总结报告，是申报联合验收的核心材料。',
    example: '包含工程概况、验收情况、质量评定等内容',
    errorProneFields: [
      {
        id: 'ep-009',
        fieldName: '验收组组成人员',
        errorTip: '验收组必须包含建设、设计、施工、监理四方人员，而且要有相应的职称。很多人会漏掉设计单位代表',
        correctExample: '验收组组长：张三（建设单位项目负责人），成员：李四（设计）、王五（施工）、赵六（监理）',
        errorRate: 40,
      },
    ],
    templates: [
      {
        id: 'tpl-003',
        name: '竣工验收报告模板',
        format: 'docx',
        size: '89KB',
      },
      {
        id: 'tpl-004',
        name: '竣工验收方案模板',
        format: 'docx',
        size: '76KB',
      },
    ],
    status: 'in-progress',
  },
  {
    id: 'mat-010',
    name: '单位工程质量竣工验收记录',
    category: '验收资料',
    required: true,
    description: '各单位工程质量验收记录汇总表',
    plainExplanation:
      '每一栋楼都是一个单位工程，要分别做质量验收记录。这张表是各方签字确认工程质量合格的凭证。',
    example: '包含分部工程、质量控制资料、观感质量等验收记录',
    errorProneFields: [],
    templates: [
      {
        id: 'tpl-005',
        name: '单位工程竣工验收记录',
        format: 'xlsx',
        size: '45KB',
      },
    ],
    status: 'not-started',
  },
];

export const materialCategories = [
  '前期资料',
  '专项验收',
  '验收资料',
  '施工资料',
  '其他',
];
