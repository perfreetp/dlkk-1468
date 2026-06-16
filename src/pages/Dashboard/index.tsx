import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Clock,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Bell,
  Flame,
  MessageCircleQuestion,
} from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { policyUpdates } from '@/data/policies';
import { hotQuestions } from '@/data/qaData';
import { formatDate } from '@/utils/format';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentProject, declarationSteps } = useProjectStore();

  const completedSteps = declarationSteps.filter(
    (s) => s.status === 'completed'
  ).length;
  const totalSteps = declarationSteps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  const urgentPolicies = policyUpdates.filter(
    (p) => p.level === 'urgent' || p.level === 'important'
  ).slice(0, 3);

  const topQuestions = hotQuestions.slice(0, 4);

  const quickActions = [
    {
      icon: Plus,
      title: '新建申报',
      desc: '开始一个新的验收项目',
      color: 'from-blue-500 to-blue-700',
      action: () => navigate('/declaration-path'),
    },
    {
      icon: FileCheck,
      title: '继续申报',
      desc: '继续当前项目申报',
      color: 'from-emerald-500 to-emerald-700',
      action: () => navigate('/materials'),
    },
    {
      icon: AlertTriangle,
      title: '补正说明',
      desc: '生成补正说明文档',
      color: 'from-orange-500 to-orange-700',
      action: () => navigate('/correction'),
    },
    {
      icon: MessageCircleQuestion,
      title: '智能咨询',
      desc: '有问题？问AI助手',
      color: 'from-purple-500 to-purple-700',
      action: () => navigate('/qa'),
    },
  ];

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'important':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'urgent':
        return '紧急';
      case 'important':
        return '重要';
      default:
        return '普通';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            您好，李工 👋
          </h1>
          <p className="text-slate-500 mt-1">
            今天是 {formatDate('2025-06-17')}，祝您申报顺利
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-300 text-left"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
            >
              <action.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">{action.title}</h3>
            <p className="text-sm text-slate-500">{action.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">申报进度</h2>
            <button
              onClick={() => navigate('/declaration-path')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              查看详情 <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {currentProject && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {currentProject.category}
                </span>
                <span className="text-sm text-slate-500">
                  {currentProject.address}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                {currentProject.name}
              </h3>
            </div>
          )}

          <div className="flex items-end gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#progressGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 3.52} 352`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">
                  {progress}%
                </span>
                <span className="text-xs text-slate-500">总体进度</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {declarationSteps.slice(0, 4).map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : step.status === 'current'
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step.status === 'completed' ? '✓' : step.stepNumber}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {step.title}
                      </span>
                      <span className="text-xs text-slate-400">
                        {step.timeLimit}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          step.status === 'completed'
                            ? 'w-full bg-emerald-500'
                            : step.status === 'current'
                            ? 'bg-blue-500'
                            : 'w-0'
                        }`}
                        style={{
                          width:
                            step.status === 'current'
                              ? `${(step.completedCount / step.materialCount) * 100}%`
                              : undefined,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              政策提醒
            </h2>
            <span className="text-xs text-slate-400">最新5条</span>
          </div>

          <div className="space-y-4">
            {urgentPolicies.map((policy) => (
              <div
                key={policy.id}
                className={`p-3 rounded-xl border ${getLevelStyle(
                  policy.level
                )} ${!policy.isRead ? 'ring-2 ring-orange-400/30' : ''}`}
              >
                <div className="flex items-start gap-2">
                  {!policy.isRead && (
                    <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded border ${getLevelStyle(
                          policy.level
                        )}`}
                      >
                        {getLevelLabel(policy.level)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {policy.publishDate}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-slate-800 line-clamp-2">
                      {policy.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            查看全部政策
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              常见问题
            </h2>
            <button
              onClick={() => navigate('/qa')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              更多问题 <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {topQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => navigate('/qa')}
                className="text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
              >
                <h4 className="text-sm font-medium text-slate-800 mb-2 group-hover:text-blue-700 line-clamp-2">
                  {q.question}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {q.viewCount}次浏览
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            今日待办
          </h2>

          <div className="space-y-3">
            {[
              { text: '提交消防验收材料', priority: 'high', done: false },
              { text: '检查规划核实申请进度', priority: 'medium', done: false },
              { text: '整理竣工档案资料', priority: 'low', done: true },
              { text: '联系质监站预约现场', priority: 'medium', done: false },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  item.done ? 'bg-slate-50' : 'bg-slate-50/50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    item.done
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : item.priority === 'high'
                      ? 'border-red-400'
                      : item.priority === 'medium'
                      ? 'border-orange-400'
                      : 'border-slate-300'
                  }`}
                >
                  {item.done && <span className="text-xs">✓</span>}
                </div>
                <span
                  className={`text-sm flex-1 ${
                    item.done
                      ? 'text-slate-400 line-through'
                      : 'text-slate-700'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
