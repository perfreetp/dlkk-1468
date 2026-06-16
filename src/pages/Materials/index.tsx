import { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
  Lightbulb,
  AlertCircle,
  Copy,
  Sparkles,
} from 'lucide-react';
import { useMaterialStore } from '@/store/materialStore';
import { materialCategories } from '@/data/materials';

export default function Materials() {
  const { materials, selectedCategory, setSelectedCategory, toggleMaterialStatus } =
    useMaterialStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showTips, setShowTips] = useState<Record<string, boolean>>({});

  const filteredMaterials =
    selectedCategory === 'all'
      ? materials
      : materials.filter((m) => m.category === selectedCategory);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'in-progress':
        return '进行中';
      default:
        return '未开始';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleTip = (fieldId: string) => {
    setShowTips((prev) => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  const completedCount = materials.filter((m) => m.status === 'completed').length;
  const inProgressCount = materials.filter((m) => m.status === 'in-progress').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">材料清单</h1>
          <p className="text-slate-500 mt-1">
            共 {materials.length} 项材料，已完成 {completedCount} 项，进行中{' '}
            {inProgressCount} 项
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            全部
          </button>
          {materialCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredMaterials.map((material) => (
          <div
            key={material.id}
            className={`bg-white rounded-2xl border transition-all ${
              expandedId === material.id
                ? 'border-blue-300 shadow-lg'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className="p-5 cursor-pointer"
              onClick={() => toggleExpand(material.id)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    material.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-600'
                      : material.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <FileText className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">
                          {material.name}
                        </h3>
                        {material.required && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                            必选
                          </span>
                        )}
                        {material.errorProneFields.length > 0 && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded">
                            <AlertTriangle className="w-3 h-3" />
                            易错
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                        {material.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyle(
                          material.status
                        )}`}
                      >
                        {getStatusLabel(material.status)}
                      </span>
                      {expandedId === material.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                      {material.category}
                    </span>
                    {material.templates.length > 0 && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {material.templates.length} 个模板
                      </span>
                    )}
                    {material.errorProneFields.length > 0 && (
                      <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        {material.errorProneFields.length} 个易错字段
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {expandedId === material.id && (
              <div className="px-5 pb-5 border-t border-slate-100">
                <div className="pt-4 space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      大白话解释
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {material.plainExplanation}
                    </p>
                  </div>

                  {material.example && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-blue-700 mb-2">
                        📋 示例
                      </h4>
                      <p className="text-sm text-blue-600 font-mono">
                        {material.example}
                      </p>
                    </div>
                  )}

                  {material.errorProneFields.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        易错字段提醒
                        <span className="text-xs font-normal text-orange-500">
                          （点击查看详情）
                        </span>
                      </h4>
                      <div className="space-y-2">
                        {material.errorProneFields.map((field) => (
                          <div
                            key={field.id}
                            onClick={() => toggleTip(field.id)}
                            className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all ${
                              showTips[field.id]
                                ? 'border-orange-400 bg-orange-50/80 shadow-md'
                                : 'border-orange-200 bg-orange-50/30 hover:bg-orange-50/60'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                <span className="text-sm font-medium text-slate-700">
                                  {field.fieldName}
                                </span>
                              </div>
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                                错误率 {field.errorRate}%
                              </span>
                            </div>

                            {showTips[field.id] && (
                              <div className="mt-3 pt-3 border-t border-orange-200 space-y-2">
                                <div>
                                  <span className="text-xs font-medium text-orange-700">
                                    ⚠️ 常见错误
                                  </span>
                                  <p className="text-sm text-slate-600 mt-1">
                                    {field.errorTip}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-emerald-700">
                                    ✅ 正确示例
                                  </span>
                                  <p className="text-sm text-slate-600 mt-1 font-mono bg-white/60 p-2 rounded">
                                    {field.correctExample}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {material.templates.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        推荐模板
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {material.templates.map((tpl) => (
                          <div
                            key={tpl.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  {tpl.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {tpl.format.toUpperCase()} · {tpl.size}
                                </p>
                              </div>
                            </div>
                            <button className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors opacity-0 group-hover:opacity-100">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMaterialStatus(material.id);
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        material.status === 'completed'
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/30'
                      }`}
                    >
                      {material.status === 'completed'
                        ? '标记为未完成'
                        : '标记为已完成'}
                    </button>
                    <button className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      复制要求
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
