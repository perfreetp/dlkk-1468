import { Bell, Search, Settings } from 'lucide-react';
import { policyUpdates } from '@/data/policies';

export default function TopBar() {
  const unreadCount = policyUpdates.filter((p) => !p.isRead).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索材料、政策、常见问题..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </button>
        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Settings className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
}
