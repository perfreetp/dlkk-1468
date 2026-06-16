import { useState } from 'react';
import {
  Building2,
  Upload,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  FileText,
  MapPin,
  Ruler,
  Layers,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  HelpCircle,
} from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { prerequisites } from '@/data/prerequisites';
import { parseProjectText } from '@/utils/format';

type FieldStatus = 'parsed' | 'manual' | 'empty';

export default function ProjectOverview() {
  const { currentProject, setCurrentProject } = useProjectStore();
  const [inputText, setInputText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [showPrereqDetail, setShowPrereqDetail] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<Record<string, FieldStatus>>({});
  const [showParseHint, setShowParseHint] = useState(false);

  const sampleText = `阳光苑住宅小区项目
建设单位：安居房地产开发有限公司
项目地址：高新区科技大道168号
总建筑面积：62,500平方米
建筑层数：地上24层，地下1层
开工日期：2024年1月20日
计划竣工日期：2025年10月31日`;

  const handleSmartParse = () => {
    if (!inputText.trim()) return;

    setIsParsing(true);
    setShowParseHint(true);

    setTimeout(() => {
      const parsed = parseProjectText(inputText);
      const statusMap: Record<string, FieldStatus> = {};

      const newProject = {
        id: currentProject?.id || `proj-${Date.now()}`,
        name: '',
        type: currentProject?.type || 'building',
        category: currentProject?.category || '住宅工程',
        address: '',
        area: 0,
        floors: 0,
        builder: '',
        startDate: '',
        plannedEndDate: '',
      };

      if (parsed.name) {
        newProject.name = parsed.name;
        statusMap.name = 'parsed';
      } else {
        statusMap.name = currentProject?.name ? 'manual' : 'empty';
        newProject.name = currentProject?.name || '';
      }

      if (parsed.builder) {
        newProject.builder = parsed.builder;
        statusMap.builder = 'parsed';
      } else {
        statusMap.builder = currentProject?.builder ? 'manual' : 'empty';
        newProject.builder = currentProject?.builder || '';
      }

      if (parsed.address) {
        newProject.address = parsed.address;
        statusMap.address = 'parsed';
      } else {
        statusMap.address = currentProject?.address ? 'manual' : 'empty';
        newProject.address = currentProject?.address || '';
      }

      if (parsed.area !== undefined) {
        newProject.area = parsed.area;
        statusMap.area = 'parsed';
      } else {
        statusMap.area = currentProject?.area ? 'manual' : 'empty';
        newProject.area = currentProject?.area || 0;
      }

      if (parsed.floors !== undefined) {
        newProject.floors = parsed.floors;
        statusMap.floors = 'parsed';
      } else {
        statusMap.floors = currentProject?.floors ? 'manual' : 'empty';
        newProject.floors = currentProject?.floors || 0;
      }

      if (parsed.startDate) {
        newProject.startDate = parsed.startDate;
        statusMap.startDate = 'parsed';
      } else {
        statusMap.startDate = currentProject?.startDate ? 'manual' : 'empty';
        newProject.startDate = currentProject?.startDate || '';
      }

      if (parsed.plannedEndDate) {
        newProject.plannedEndDate = parsed.plannedEndDate;
        statusMap.plannedEndDate = 'parsed';
      } else {
        statusMap.plannedEndDate = currentProject?.plannedEndDate ? 'manual' : 'empty';
        newProject.plannedEndDate = currentProject?.plannedEndDate || '';
      }

      setCurrentProject(newProject);
      setParseResult(statusMap);
      setIsParsing(false);
    }, 1200);
  };

  const loadSample = () => {
    setInputText(sampleText);
  };

  const handleFieldChange = (field: keyof typeof currentProject, value: any) => {
    if (!currentProject) return;
    setCurrentProject({ ...currentProject, [field]: value });
    setParseResult((prev) => ({ ...prev, [field]: 'manual' }));
  };

  const getFieldBadge = (field: string) => {
    const status = parseResult[field];
    if (status === 'parsed') {
      return (
        <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded">
          <Check className="w-3 h-3" />
          智能识别
        </span>
      );
    }
    if (status === 'empty') {
      return (
        <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded">
          <HelpCircle className="w-3 h-3" />
          需补全
        </span>
      );
    }
    return null;
  };

  const getPrereqStatusStyle = (status: string) => {
    switch (status) {
      case 'met':
        return 'text-emerald-600 bg-emerald-50';
      case 'missing':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-orange-600 bg-orange-50';
    }
  };

  const getPrereqStatusLabel = (status: string) => {
    switch (status) {
      case 'met':
        return '已满足';
      case 'missing':
        return '未满足';
      default:
        return '待确认';
    }
  };

  const metCount = prerequisites.filter((p) => p.status === 'met').length;
  const missingCount = prerequisites.filter((p) => p.status === 'missing').length;
  const pendingCount = prerequisites.filter((p) => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">工程概况</h1>
          <p className="text-slate-500 mt-1">
            录入项目信息，智能识别并检查前置条件
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                智能识别
              </h2>
              {showParseHint && (
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Check className="w-3 h-3" /> 已识别
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Info className="w-3 h-3" /> 可手动修改
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <HelpCircle className="w-3 h-3" /> 需补全
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-500 mb-4">
              粘贴工程概况文字或上传文档，系统自动识别并填写项目信息
            </p>

            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`请粘贴或输入工程概况文字内容...\n\n例如：\n项目名称：阳光花园住宅小区\n建设单位：安居房地产开发有限公司\n项目地址：高新区科技大道168号\n建筑面积：62,500平方米\n建筑层数：地上24层，地下1层\n开工日期：2024年1月20日\n计划竣工日期：2025年10月31日`}
                className="w-full h-48 p-4 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
              {!inputText && (
                <button
                  onClick={loadSample}
                  className="absolute bottom-4 right-4 text-xs text-blue-600 hover:text-blue-700"
                >
                  加载示例文本
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleSmartParse}
                disabled={!inputText || isParsing}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isParsing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    正在智能识别中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    一键智能识别
                  </>
                )}
              </button>
              <button className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Upload className="w-5 h-5" />
                上传文档
              </button>
            </div>

            {showParseHint && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                <span className="font-medium">识别结果：</span>
                {Object.values(parseResult).filter((s) => s === 'parsed').length} 项
                字段已自动识别，
                {Object.values(parseResult).filter((s) => s === 'empty').length} 项
                需要手动补全，其他字段可根据需要修改
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              项目信息
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-slate-500 mb-2 block">
                  项目名称
                  <span className="text-red-500 ml-1">*</span>
                  {getFieldBadge('name')}
                </label>
                <input
                  type="text"
                  value={currentProject?.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-slate-500 mb-2 block">
                  建设单位
                  <span className="text-red-500 ml-1">*</span>
                  {getFieldBadge('builder')}
                </label>
                <input
                  type="text"
                  value={currentProject?.builder || ''}
                  onChange={(e) => handleFieldChange('builder', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>

              <div className="relative group col-span-2">
                <label className="text-sm text-slate-500 mb-2 block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  项目地址
                  <span className="text-red-500 ml-1">*</span>
                  {getFieldBadge('address')}
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-orange-100 text-orange-600 rounded font-medium">
                    易错
                  </span>
                </label>
                <input
                  type="text"
                  value={currentProject?.address || ''}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${
                    parseResult.address === 'parsed'
                      ? 'border-2 border-emerald-300 bg-emerald-50/30 focus:border-emerald-500'
                      : parseResult.address === 'empty'
                      ? 'border-2 border-red-300 bg-red-50/30 focus:border-red-500'
                      : 'border-2 border-orange-300 bg-orange-50/30 focus:border-orange-500'
                  }`}
                />
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="bg-orange-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    ⚠️ 注意地址要和规划许可证一致
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500 mb-2 block flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5" />
                  总建筑面积 (㎡)
                  <span className="text-red-500 ml-1">*</span>
                  {getFieldBadge('area')}
                </label>
                <input
                  type="number"
                  value={currentProject?.area || ''}
                  onChange={(e) =>
                    handleFieldChange('area', Number(e.target.value) || 0)
                  }
                  className={`w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    parseResult.area === 'parsed'
                      ? 'border-2 border-emerald-300 bg-emerald-50/30 focus:border-emerald-500'
                      : parseResult.area === 'empty'
                      ? 'border-2 border-red-300 bg-red-50/30 focus:border-red-500'
                      : 'border border-slate-200 focus:border-blue-400'
                  }`}
                />
              </div>

              <div>
                <label className="text-sm text-slate-500 mb-2 block flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  建筑层数
                  {getFieldBadge('floors')}
                </label>
                <input
                  type="number"
                  value={currentProject?.floors || ''}
                  onChange={(e) =>
                    handleFieldChange('floors', Number(e.target.value) || 0)
                  }
                  className={`w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    parseResult.floors === 'parsed'
                      ? 'border-2 border-emerald-300 bg-emerald-50/30 focus:border-emerald-500'
                      : 'border border-slate-200 focus:border-blue-400'
                  }`}
                />
              </div>

              <div>
                <label className="text-sm text-slate-500 mb-2 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  开工日期
                  {getFieldBadge('startDate')}
                </label>
                <input
                  type="date"
                  value={currentProject?.startDate || ''}
                  onChange={(e) => handleFieldChange('startDate', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    parseResult.startDate === 'parsed'
                      ? 'border-2 border-emerald-300 bg-emerald-50/30 focus:border-emerald-500'
                      : 'border border-slate-200 focus:border-blue-400'
                  }`}
                />
              </div>

              <div>
                <label className="text-sm text-slate-500 mb-2 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  计划竣工日期
                  {getFieldBadge('plannedEndDate')}
                </label>
                <input
                  type="date"
                  value={currentProject?.plannedEndDate || ''}
                  onChange={(e) =>
                    handleFieldChange('plannedEndDate', e.target.value)
                  }
                  className={`w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    parseResult.plannedEndDate === 'parsed'
                      ? 'border-2 border-emerald-300 bg-emerald-50/30 focus:border-emerald-500'
                      : 'border border-slate-200 focus:border-blue-400'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                前置条件检查
              </h2>
              <span className="text-xs text-slate-400">
                共 {prerequisites.length} 项
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4 p-3 bg-slate-50 rounded-xl">
              <div className="flex-1 text-center">
                <p className="text-xl font-bold text-emerald-600">{metCount}</p>
                <p className="text-xs text-slate-500">已满足</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex-1 text-center">
                <p className="text-xl font-bold text-orange-600">{pendingCount}</p>
                <p className="text-xs text-slate-500">待确认</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex-1 text-center">
                <p className="text-xl font-bold text-red-600">{missingCount}</p>
                <p className="text-xs text-slate-500">未满足</p>
              </div>
            </div>

            {missingCount > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">
                  ⚠️ 有 {missingCount} 项前置条件未满足，建议先完成后再申报
                </p>
              </div>
            )}

            <div className="space-y-2 max-h-96 overflow-auto">
              {prerequisites.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 rounded-xl overflow-hidden"
                >
                  <div
                    className="p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() =>
                      setShowPrereqDetail(
                        showPrereqDetail === item.id ? null : item.id
                      )
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          item.status === 'met'
                            ? 'bg-emerald-100 text-emerald-600'
                            : item.status === 'missing'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-orange-100 text-orange-600'
                        }`}
                      >
                        {item.status === 'met' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : item.status === 'missing' ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 line-clamp-2">
                          {item.name}
                        </p>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${getPrereqStatusStyle(
                            item.status
                          )}`}
                        >
                          {getPrereqStatusLabel(item.status)}
                        </span>
                      </div>
                      {showPrereqDetail === item.id ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>

                  {showPrereqDetail === item.id && item.suggestion && (
                    <div className="px-3 pb-3 border-t border-slate-100">
                      <div className="pt-3 pl-8">
                        <p className="text-xs text-slate-500 mb-2">建议：</p>
                        <p className="text-sm text-slate-600 whitespace-pre-line">
                          {item.suggestion}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Info className="w-5 h-5" />
              小贴士
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              建议在申报前仔细核对所有前置条件，尤其是规划核实、消防验收、档案预验收这三项，是最容易卡住的环节。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
