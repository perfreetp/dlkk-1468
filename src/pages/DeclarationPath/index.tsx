import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Factory,
  PaintBucket,
  Cog,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { projectTypes } from '@/data/projectTypes';
import { useProjectStore } from '@/store/projectStore';

const iconMap: Record<string, React.ElementType> = {
  'building-2': Building2,
  road: Factory,
  'paint-bucket': PaintBucket,
  cog: Cog,
};

export default function DeclarationPath() {
  const navigate = useNavigate();
  const { currentProject, declarationSteps, stepsConfig, projectTypes, applyProjectType, setCurrentProject } =
    useProjectStore();
  const [selectedType, setSelectedType] = useState<string | null>(
    currentProject?.type || null
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    currentProject?.category || null
  );
  const [showPath, setShowPath] = useState(!!currentProject);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleGeneratePath = () => {
    if (selectedType && selectedCategory) {
      applyProjectType(selectedType, selectedCategory);
      setShowPath(true);
    }
  };

  const selectedTypeData = projectTypes.find((t) => t.id === selectedType) ||
    projectTypes.find((t) => t.id === currentProject?.type);

  const getStepStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 text-white border-emerald-500';
      case 'current':
        return 'bg-blue-500 text-white border-blue-500 ring-4 ring-blue-100';
      default:
        return 'bg-white text-slate-400 border-slate-300';
    }
  };

  const getLineStyle = (status: string) => {
    return status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200';
  };

  const totalDays = stepsConfig?.totalDays || 42;
  const workDays = stepsConfig?.workDays || 25;
  const materialStats = stepsConfig?.materialStats || {
    completed: 8,
    inProgress: 3,
    notStarted: 7,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">智能申报路径</h1>
          <p className="text-slate-500 mt-1">
            根据项目类型，为您生成专属的申报路径
          </p>
        </div>
      </div>

      {!showPath ? (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">
                1
              </span>
              选择项目类型
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {projectTypes.map((type) => {
                const IconComponent = iconMap[type.icon] || Building2;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        selectedType === type.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      {type.name}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedType && selectedTypeData && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">
                  2
                </span>
                选择工程类别
              </h2>
              <div className="flex flex-wrap gap-3">
                {selectedTypeData.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedCategory && (
            <div className="flex justify-center">
              <button
                onClick={handleGeneratePath}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                生成申报路径
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">申报步骤</h2>
              <button
                onClick={() => setShowPath(false)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                重新选择项目
              </button>
            </div>

            <div className="relative">
              {declarationSteps.map((step, index) => (
                <div key={step.id} className="relative pb-8 last:pb-0">
                  {index < declarationSteps.length - 1 && (
                    <div
                      className={`absolute left-5 top-12 w-0.5 h-full ${getLineStyle(
                        step.status
                      )}`}
                    />
                  )}

                  <div className="flex gap-4">
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${getStepStatusStyle(
                        step.status
                      )} ${
                        step.status === 'current' ? 'animate-pulse' : ''
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{step.stepNumber}</span>
                      )}
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-semibold ${
                            step.status === 'completed'
                              ? 'text-slate-500'
                              : step.status === 'current'
                              ? 'text-blue-700'
                              : 'text-slate-700'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          {step.timeLimit}
                        </div>
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          step.status === 'completed'
                            ? 'text-slate-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {step.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <FileText className="w-3.5 h-3.5" />
                          共 {step.materialCount} 项材料
                        </div>
                        {step.status === 'current' && (
                          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                            已完成 {step.completedCount} 项
                          </div>
                        )}
                        {step.status === 'completed' && (
                          <div className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                            已完成
                          </div>
                        )}
                      </div>

                      {step.status === 'current' && (
                        <div className="mt-3">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                              style={{
                                width: `${(step.completedCount / step.materialCount) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {step.status === 'current' && (
                        <button
                          onClick={() => navigate('/materials')}
                          className="mt-4 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                        >
                          查看材料清单
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">当前项目</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-400">项目名称</span>
                  <p className="text-sm font-medium text-slate-700">
                    {currentProject?.name || '未命名项目'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">项目类型</span>
                  <p className="text-sm font-medium text-slate-700">
                    {selectedTypeData?.name || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">工程类别</span>
                  <p className="text-sm font-medium text-slate-700">
                    {currentProject?.category || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">建设单位</span>
                  <p className="text-sm font-medium text-slate-700">
                    {currentProject?.builder || '-'}
                  </p>
                </div>
                {currentProject?.address && (
                  <div>
                    <span className="text-xs text-slate-400">项目地址</span>
                    <p className="text-sm font-medium text-slate-700">
                      {currentProject.address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-2">预计总时长</h3>
              <p className="text-3xl font-bold mb-1">{totalDays}天</p>
              <p className="text-sm text-blue-100">约 {workDays} 个工作日</p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs text-blue-100">
                  * 不同项目类型办理周期不同，以上为参考
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">材料统计</h3>
              <div className="space-y-3">
                <div key="completed" className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">已完成</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {materialStats.completed} 项
                  </span>
                </div>
                <div key="progress" className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">进行中</span>
                  <span className="text-lg font-bold text-blue-600">
                    {materialStats.inProgress} 项
                  </span>
                </div>
                <div key="pending" className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">未开始</span>
                  <span className="text-lg font-bold text-slate-400">
                    {materialStats.notStarted} 项
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
