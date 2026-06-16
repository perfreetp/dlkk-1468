import { DeclarationStep } from '@/types';

export interface ProjectStepsConfig {
  totalDays: number;
  workDays: number;
  materialStats: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  steps: DeclarationStep[];
}

export const buildingSteps: ProjectStepsConfig = {
  totalDays: 42,
  workDays: 25,
  materialStats: {
    completed: 8,
    inProgress: 4,
    notStarted: 6,
  },
  steps: [
    {
      id: 'building-step-1',
      stepNumber: 1,
      title: '前期准备',
      description: '收集规划许可、施工许可、施工图审查等基础资料',
      timeLimit: '5个工作日',
      status: 'completed',
      materialCount: 8,
      completedCount: 8,
    },
    {
      id: 'building-step-2',
      stepNumber: 2,
      title: '专项验收申请',
      description: '规划核实、消防验收、人防验收、环保验收等专项申请',
      timeLimit: '12个工作日',
      status: 'current',
      materialCount: 14,
      completedCount: 8,
    },
    {
      id: 'building-step-3',
      stepNumber: 3,
      title: '现场踏勘',
      description: '规划、消防、人防、质监等部门联合现场检查',
      timeLimit: '7个工作日',
      status: 'pending',
      materialCount: 5,
      completedCount: 0,
    },
    {
      id: 'building-step-4',
      stepNumber: 4,
      title: '竣工备案',
      description: '提交竣工验收备案表及各专项验收文件',
      timeLimit: '5个工作日',
      status: 'pending',
      materialCount: 10,
      completedCount: 0,
    },
    {
      id: 'building-step-5',
      stepNumber: 5,
      title: '档案移交',
      description: '工程档案整理、数字化、移交城建档案馆',
      timeLimit: '13个工作日',
      status: 'pending',
      materialCount: 8,
      completedCount: 0,
    },
  ],
};

export const municipalSteps: ProjectStepsConfig = {
  totalDays: 56,
  workDays: 32,
  materialStats: {
    completed: 6,
    inProgress: 5,
    notStarted: 12,
  },
  steps: [
    {
      id: 'municipal-step-1',
      stepNumber: 1,
      title: '前期准备',
      description: '立项批复、用地许可、施工许可等市政项目基础资料',
      timeLimit: '7个工作日',
      status: 'completed',
      materialCount: 10,
      completedCount: 10,
    },
    {
      id: 'municipal-step-2',
      stepNumber: 2,
      title: '专项验收申请',
      description: '规划核实、消防、给排水、照明、燃气等专项验收',
      timeLimit: '15个工作日',
      status: 'current',
      materialCount: 18,
      completedCount: 6,
    },
    {
      id: 'municipal-step-3',
      stepNumber: 3,
      title: '功能检测',
      description: '道路承载力检测、管网闭水试验、照明亮度检测等',
      timeLimit: '10个工作日',
      status: 'pending',
      materialCount: 8,
      completedCount: 0,
    },
    {
      id: 'municipal-step-4',
      stepNumber: 4,
      title: '现场踏勘',
      description: '多部门联合现场核验工程实体质量',
      timeLimit: '8个工作日',
      status: 'pending',
      materialCount: 6,
      completedCount: 0,
    },
    {
      id: 'municipal-step-5',
      stepNumber: 5,
      title: '竣工备案与移交',
      description: '竣工验收备案及移交市政管养部门',
      timeLimit: '12个工作日',
      status: 'pending',
      materialCount: 12,
      completedCount: 0,
    },
  ],
};

export const decorationSteps: ProjectStepsConfig = {
  totalDays: 28,
  workDays: 18,
  materialStats: {
    completed: 5,
    inProgress: 3,
    notStarted: 4,
  },
  steps: [
    {
      id: 'decoration-step-1',
      stepNumber: 1,
      title: '前期准备',
      description: '装修方案审批、消防设计审查、施工许可',
      timeLimit: '4个工作日',
      status: 'completed',
      materialCount: 6,
      completedCount: 6,
    },
    {
      id: 'decoration-step-2',
      stepNumber: 2,
      title: '专项验收申请',
      description: '消防验收、室内环境检测、节能验收',
      timeLimit: '8个工作日',
      status: 'current',
      materialCount: 8,
      completedCount: 4,
    },
    {
      id: 'decoration-step-3',
      stepNumber: 3,
      title: '现场核验',
      description: '消防、质监、环保部门现场检查',
      timeLimit: '4个工作日',
      status: 'pending',
      materialCount: 3,
      completedCount: 0,
    },
    {
      id: 'decoration-step-4',
      stepNumber: 4,
      title: '竣工备案',
      description: '提交装修工程竣工验收备案',
      timeLimit: '3个工作日',
      status: 'pending',
      materialCount: 6,
      completedCount: 0,
    },
    {
      id: 'decoration-step-5',
      stepNumber: 5,
      title: '资料归档',
      description: '装修工程资料整理归档',
      timeLimit: '9个工作日',
      status: 'pending',
      materialCount: 4,
      completedCount: 0,
    },
  ],
};

export const mechanicalSteps: ProjectStepsConfig = {
  totalDays: 35,
  workDays: 22,
  materialStats: {
    completed: 4,
    inProgress: 4,
    notStarted: 8,
  },
  steps: [
    {
      id: 'mechanical-step-1',
      stepNumber: 1,
      title: '前期准备',
      description: '设备清单、安装方案、各专业图纸会审',
      timeLimit: '4个工作日',
      status: 'completed',
      materialCount: 5,
      completedCount: 5,
    },
    {
      id: 'mechanical-step-2',
      stepNumber: 2,
      title: '专项检测申请',
      description: '电气检测、消防检测、防雷检测、水压试验',
      timeLimit: '10个工作日',
      status: 'current',
      materialCount: 12,
      completedCount: 4,
    },
    {
      id: 'mechanical-step-3',
      stepNumber: 3,
      title: '单机与系统调试',
      description: '设备单机试运转、系统联动调试、性能测试',
      timeLimit: '8个工作日',
      status: 'pending',
      materialCount: 6,
      completedCount: 0,
    },
    {
      id: 'mechanical-step-4',
      stepNumber: 4,
      title: '现场验收',
      description: '各专业联合现场验收、功能核验',
      timeLimit: '5个工作日',
      status: 'pending',
      materialCount: 5,
      completedCount: 0,
    },
    {
      id: 'mechanical-step-5',
      stepNumber: 5,
      title: '竣工移交',
      description: '竣工备案、设备移交、培训与保修',
      timeLimit: '10个工作日',
      status: 'pending',
      materialCount: 7,
      completedCount: 0,
    },
  ],
};

export const stepsByProjectType: Record<string, ProjectStepsConfig> = {
  building: buildingSteps,
  municipal: municipalSteps,
  decoration: decorationSteps,
  mechanical: mechanicalSteps,
};

export const declarationSteps: DeclarationStep[] = buildingSteps.steps;
