import { useState, useMemo } from 'react';
import {
  FileWarning,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Download,
  Copy,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  correctionIssues,
  generateCorrectionText,
} from '@/data/correctionIssues';
import { useProjectStore } from '@/store/projectStore';

export default function Correction() {
  const { currentProject } = useProjectStore();
  const [issues, setIssues] = useState(correctionIssues);
  const [copied, setCopied] = useState(false);

  const selectedIssues = issues.filter((i) => i.selected);

  const toggleIssue = (id: string) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, selected: !issue.selected } : issue
      )
    );
  };

  const groupedIssues = useMemo(() => {
    const groups: Record<string, typeof issues> = {};
    issues.forEach((issue) => {
      if (!groups[issue.category]) {
        groups[issue.category] = [];
      }
      groups[issue.category].push(issue);
    });
    return groups;
  }, [issues]);

  const correctionText = useMemo(() => {
    return generateCorrectionText(
      currentProject?.name || '本项目',
      selectedIssues
    );
  }, [selectedIssues, currentProject]);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high':
        return '严重';
      case 'medium':
        return '一般';
      default:
        return '轻微';
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(correctionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([correctionText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject?.name || '项目'}-补正说明.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setIssues(issues.map((i) => ({ ...i, selected: false })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">补正说明生成</h1>
          <p className="text-slate-500 mt-1">
            勾选存在的问题，一键生成规范的补正说明
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          重置选择
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-orange-500" />
              选择存在的问题
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              已选择 {selectedIssues.length} 项问题
            </p>

            <div className="space-y-6">
              {Object.entries(groupedIssues).map(([category, categoryIssues]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {category}
                    <span className="text-xs font-normal text-slate-400">
                      ({categoryIssues.filter((i) => i.selected).length}/
                      {categoryIssues.length})
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {categoryIssues.map((issue) => (
                      <div
                        key={issue.id}
                        onClick={() => toggleIssue(issue.id)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          issue.selected
                            ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              issue.selected
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {issue.selected && (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700">
                              {issue.description}
                            </p>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded mt-2 inline-block border ${getSeverityStyle(
                                issue.severity
                              )}`}
                            >
                              {getSeverityLabel(issue.severity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              补正注意事项
            </h3>
            <ul className="space-y-2 text-sm text-orange-100">
              <li>• 补正材料需在规定时限内提交</li>
              <li>• 所有修改处需加盖公章确认</li>
              <li>• 建议先准备齐所有材料再提交</li>
              <li>• 如有疑问可咨询代办窗口</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                生成的补正说明
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? '已复制' : '复制'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  下载
                </button>
              </div>
            </div>

            <div className="p-6 h-[600px] overflow-auto bg-slate-50/50">
              {selectedIssues.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Info className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-slate-500 mb-2">请先选择存在的问题</p>
                  <p className="text-sm text-slate-400">
                    系统将根据选择的问题自动生成补正说明
                  </p>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">
                  {correctionText}
                </pre>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">
                {issues.filter((i) => i.severity === 'high').length}
              </p>
              <p className="text-xs text-slate-500">严重问题</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">
                {issues.filter((i) => i.severity === 'medium').length}
              </p>
              <p className="text-xs text-slate-500">一般问题</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <Info className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">
                {issues.filter((i) => i.severity === 'low').length}
              </p>
              <p className="text-xs text-slate-500">轻微问题</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
