import { useState } from 'react';
import {
  Heart,
  FileText,
  Bell,
  Trash2,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Settings,
} from 'lucide-react';
import { useQaStore } from '@/store/qaStore';
import { policyUpdates } from '@/data/policies';

export default function Favorites() {
  const { favorites, toggleFavorite } = useQaStore();
  const [activeTab, setActiveTab] = useState<'qa' | 'policy'>('qa');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState({
    policy: true,
    regulation: true,
    notice: false,
    training: false,
  });

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'urgent':
        return 'bg-red-100 text-red-700';
      case 'important':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-slate-100 text-slate-600';
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

  const toggleSubscription = (key: keyof typeof subscriptions) => {
    setSubscriptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">我的收藏</h1>
          <p className="text-slate-500 mt-1">
            收藏的问答和订阅的政策更新
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 inline-flex">
        <button
          onClick={() => setActiveTab('qa')}
          className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'qa'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            问答收藏
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === 'qa' ? 'bg-white/20' : 'bg-slate-100'
              }`}
            >
              {favorites.length}
            </span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab('policy')}
          className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'policy'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            政策订阅
          </span>
        </button>
      </div>

      {activeTab === 'qa' ? (
        <div className="space-y-3">
          {favorites.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Bookmark className="w-16 h-16 mx-auto text-slate-200 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                暂无收藏的问答
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                在问答中心看到有用的内容，可以点击收藏
              </p>
              <button className="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                去问答中心看看
              </button>
            </div>
          ) : (
            favorites.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div
                  className="p-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-slate-400">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-300">·</span>
                        <span className="text-xs text-slate-400">
                          {item.viewCount} 次浏览
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-800">
                        {item.question}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {expandedId === item.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedId === item.id && (
                  <div className="px-5 pb-5 border-t border-slate-100">
                    <div className="pt-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                        回答：
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-3">
            <h3 className="font-bold text-slate-800 mb-2">政策更新动态</h3>
            {policyUpdates.map((policy) => (
              <div
                key={policy.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${getLevelStyle(
                        policy.level
                      )}`}
                    >
                      {getLevelLabel(policy.level)}
                    </span>
                    {!policy.isRead && (
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    {policy.publishDate}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  {policy.title}
                </h4>
                <p className="text-sm text-slate-500 line-clamp-3">
                  {policy.content}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                订阅设置
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'policy', label: '政策法规更新', desc: '最新政策法规变更通知' },
                  { key: 'regulation', label: '办事指南调整', desc: '申报流程和材料要求变化' },
                  { key: 'notice', label: '重要通知公告', desc: '系统维护、节假日安排等' },
                  { key: 'training', label: '培训活动通知', desc: '线上线下培训与宣讲活动' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        checked={
                          subscriptions[item.key as keyof typeof subscriptions]
                        }
                        onChange={() =>
                          toggleSubscription(
                            item.key as keyof typeof subscriptions
                          )
                        }
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-5 text-white">
              <h3 className="font-bold mb-2">💡 小贴士</h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                建议开启政策法规和办事指南的订阅，及时获取最新动态，避免因为政策变化而影响您的申报进度。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
