import { useState, useRef, useEffect } from 'react';
import {
  MessageCircleQuestion,
  Mic,
  Send,
  Volume2,
  VolumeX,
  Heart,
  Clock,
  TrendingUp,
  ListOrdered,
  Clock as ClockIcon,
  FileText,
  HelpCircle,
  Coins,
} from 'lucide-react';
import { useQaStore } from '@/store/qaStore';
import { hotQuestions, qaCategories } from '@/data/qaData';
import { speakText, stopSpeaking } from '@/utils/speech';

export default function QaCenter() {
  const { chatHistory, addMessage, isSpeaking, setSpeaking, toggleFavorite, favorites } =
    useQaStore();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content: inputText,
      timestamp: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    addMessage(userMsg);
    setInputText('');

    setTimeout(() => {
      const answer = generateAnswer(inputText);
      const assistantMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant' as const,
        content: answer,
        timestamp: new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      addMessage(assistantMsg);
    }, 1000);
  };

  const generateAnswer = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes('流程') || q.includes('顺序') || q.includes('步骤')) {
      return hotQuestions[0].answer;
    } else if (q.includes('时间') || q.includes('多久') || q.includes('时限')) {
      return hotQuestions[1].answer;
    } else if (q.includes('材料') || q.includes('需要什么') || q.includes('准备')) {
      return hotQuestions[3].answer;
    } else if (q.includes('费用') || q.includes('钱') || q.includes('收费')) {
      return hotQuestions[4].answer;
    } else if (q.includes('专项') || q.includes('哪些')) {
      return hotQuestions[2].answer;
    }

    return `感谢您的提问！关于"${question}"这个问题：

根据我目前了解的信息，建议您：

1. 可以先查阅相关政策文件，了解具体要求
2. 如有疑问，可拨打咨询电话进行确认
3. 也可以直接前往政务服务中心现场咨询

如果您有更具体的问题，欢迎继续提问，我会尽力为您解答。

💡 小贴士：您可以尝试问我以下问题：
• 联合验收的流程是什么？
• 需要准备哪些材料？
• 办理需要多长时间？`;
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputText('联合验收的流程顺序是什么？');
      }, 2000);
    }
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speakText(text)
        .then(() => setSpeaking(false))
        .catch(() => setSpeaking(false));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'list-ordered':
        return ListOrdered;
      case 'clock':
        return ClockIcon;
      case 'file-text':
        return FileText;
      case 'coins':
        return Coins;
      default:
        return HelpCircle;
    }
  };

  const filteredQuestions =
    activeCategory === 'all'
      ? hotQuestions
      : hotQuestions.filter((q) => q.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">智能问答中心</h1>
          <p className="text-slate-500 mt-1">
            有问题？随时问我，我是您的智能申报顾问
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200 flex flex-col h-[650px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <MessageCircleQuestion className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">小验助手</h3>
                <p className="text-xs text-emerald-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  在线服务中
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-4">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-md ${
                    msg.role === 'user' ? 'order-2' : 'order-1'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400">小验助手</span>
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-500 transition-colors"
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-700 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <p
                    className={`text-xs text-slate-400 mt-1 ${
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-slate-400">快捷问题：</span>
              <button
                onClick={() => handleQuickQuestion('联合验收的流程顺序是什么？')}
                className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                验收流程
              </button>
              <button
                onClick={() => handleQuickQuestion('办理时限是多久？')}
                className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                办理时限
              </button>
              <button
                onClick={() => handleQuickQuestion('需要准备哪些材料？')}
                className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                申报材料
              </button>
              <button
                onClick={() => handleQuickQuestion('需要交费吗？')}
                className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                费用问题
              </button>
            </div>

            <div className="flex items-end gap-3">
              <button
                onClick={handleVoiceInput}
                className={`p-3 rounded-xl transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="输入您的问题..."
                  rows={1}
                  className="w-full px-4 py-3 pr-12 bg-slate-100 border-0 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="font-bold text-slate-800 mb-3">问题分类</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  activeCategory === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm font-medium">全部问题</span>
              </button>
              {qaCategories.map((cat) => {
                const IconComponent = getCategoryIcon(cat.icon);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      activeCategory === cat.id
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              热门问题
            </h3>
            <div className="space-y-2">
              {filteredQuestions.slice(0, 5).map((q, index) => (
                <div
                  key={q.id}
                  onClick={() => handleQuickQuestion(q.question)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      index < 3
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-600 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {q.question}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              我的收藏
              <span className="text-xs font-normal text-slate-400">
                ({favorites.length})
              </span>
            </h3>
            {favorites.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">
                暂无收藏的问题
              </p>
            ) : (
              <div className="space-y-2">
                {favorites.slice(0, 3).map((q) => (
                  <div
                    key={q.id}
                    className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <p className="text-sm text-slate-600 line-clamp-1">
                      {q.question}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
