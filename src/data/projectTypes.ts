import { ProjectType } from '@/types';

export const projectTypes: ProjectType[] = [
  {
    id: 'building',
    name: '房屋建筑工程',
    icon: 'building-2',
    description: '住宅、商业、办公等房屋建筑项目',
    categories: ['住宅工程', '公共建筑', '商业建筑', '工业厂房'],
  },
  {
    id: 'municipal',
    name: '市政基础设施工程',
    icon: 'road',
    description: '道路、桥梁、给排水等市政项目',
    categories: ['道路工程', '桥梁工程', '给排水工程', '照明工程'],
  },
  {
    id: 'decoration',
    name: '装饰装修工程',
    icon: 'paint-bucket',
    description: '室内外装饰装修项目',
    categories: ['室内装修', '外墙装饰', '幕墙工程'],
  },
  {
    id: 'mechanical',
    name: '机电安装工程',
    icon: 'cog',
    description: '机电设备安装工程项目',
    categories: ['电气安装', '水暖安装', '消防工程', '通风空调'],
  },
];

export const mockCurrentProject = {
  id: 'proj-001',
  name: '滨江花园住宅小区项目',
  type: 'building',
  category: '住宅工程',
  address: '滨江新区江南大道88号',
  area: 85600,
  floors: 28,
  builder: '城市建设发展有限公司',
  startDate: '2024-03-15',
  plannedEndDate: '2025-12-30',
};
