import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Route,
  FileText,
  Building2,
  Paperclip,
  FileWarning,
  MessageCircleQuestion,
  Heart,
} from 'lucide-react';

const navItems = [
  {
    path: '/',
    label: '首页',
    icon: LayoutDashboard,
  },
  {
    path: '/declaration-path',
    label: '申报路径',
    icon: Route,
  },
  {
    path: '/materials',
    label: '材料清单',
    icon: FileText,
  },
  {
    path: '/project-overview',
    label: '工程概况',
    icon: Building2,
  },
  {
    path: '/attachments',
    label: '附件管理',
    icon: Paperclip,
  },
  {
    path: '/correction',
    label: '补正说明',
    icon: FileWarning,
  },
  {
    path: '/qa',
    label: '问答中心',
    icon: MessageCircleQuestion,
  },
  {
    path: '/favorites',
    label: '我的收藏',
    icon: Heart,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base">智能申报助手</h1>
            <p className="text-xs text-slate-400">联合验收向导</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold">
              李
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">李工</p>
              <p className="text-xs text-slate-400 truncate">建设单位经办人</p>
            </div>
          </div>
          <div className="text-xs text-slate-400 bg-slate-900/50 rounded-lg px-3 py-2">
            <span className="text-emerald-400">● </span>
            当前项目：滨江花园
          </div>
        </div>
      </div>
    </aside>
  );
}
