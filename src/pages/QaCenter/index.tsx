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
  Trash2,
  X,
  AlertCircle,
} from 'lucide-react';
import { useQaStore } from '@/store/qaStore';
import { qaCategories } from '@/data/qaData';
import { QaItem, ChatMessage } from '@/types';
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speakText,
  stopSpeaking,
  createSpeechRecognition,
  getSpeechRecognitionErrorMessage,
} from '@/utils/speech';

export default function QaCenter() {
  const {
    hotQuestions,
    favorites,
    chatHistory,
    isRecording,
    isSpeaking,
    addMessage,
    toggleFavorite,
    setRecording,
    setSpeaking,
    clearChat,
    restoreDefaultChat,
  } = useQaStore();

  const [input, setInput] = useState('');
  const [interimText, setInterimText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

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
    selectedCategory === 'all'
      ? hotQuestions
      : hotQuestions.filter((q) => q.category === selectedCategory);

  const generateAnswer = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes('验收顺序') || q.includes('顺序') || q.includes('流程') || q.includes('步骤')) {
      return `联合验收的办理顺序一般为：

1. **前期准备**（第1-5个工作日）
   - 完成规划、消防、人防等各专项的自验
   - 整理全部验收资料，按目录装订
   - 确认各专项验收条件满足

2. **申报提交**（第6-10个工作日）
   - 在政务服务网提交联合验收申请
   - 同步提交各专项验收材料
   - 等待各部门初审

3. **专项审查**（第11-20个工作日）
   - 各部门分别审查资料（5-8个工作日）
   - 需要补正的，会一次性告知补正内容
   - 补正通过后进入下一环节

4. **现场踏勘**（第21-28个工作日）
   - 预约联合现场踏勘时间
   - 各部门联合到场检查
   - 现场出具检查意见

5. **验收结论**（第29-32个工作日）
   - 各部门出具专项验收意见
   - 全部通过后出具《联合验收意见书》
   - 如有不通过，整改后可复验

6. **竣工备案**（第33-40个工作日）
   - 凭《联合验收意见书》办理竣工备案
   - 完成档案移交

*不同项目类型顺序会有差异，大型公建、市政工程会增加更多专项环节。*`;
    }

    if (q.includes('时限') || q.includes('多久') || q.includes('时间') || q.includes('天') || q.includes('工作日')) {
      return `各类验收事项的办理时限参考：

**一般房屋建筑项目**
- 规划核实：8个工作日
- 消防验收：10个工作日（抽查项目15个）
- 人防验收：7个工作日
- 环保验收：7个工作日
- 档案预验收：5个工作日
- 质监验收：7个工作日
- **联合验收总时限**：约25-30个工作日

**市政工程项目**
- 增加：道路验收、管网验收、照明验收、绿化验收
- **总时限**：约32-40个工作日

**装饰装修项目**
- 消防验收：10个工作日
- 室内环境检测：3个工作日
- **总时限**：约12-18个工作日

**特别提醒**：
- 补正时间不计入办理时限
- 节假日顺延
- 大型项目（5万㎡以上）可能增加5-10个工作日`;
    }

    if (q.includes('材料') || q.includes('资料') || q.includes('要什么')) {
      return `联合验收需要准备的材料清单：

**必备材料（缺一不可）**
1. 建设工程规划许可证及附件
2. 施工许可证
3. 施工图设计文件审查合格书
4. 各专业竣工图纸（含CAD电子文件）
5. 工程质量保修书
6. 单位工程竣工验收记录
7. 各专项验收申请表

**规划核实材料**
- 建设工程竣工规划核实申请表
- 竣工实测成果报告书（含坐标图）
- 建设工程放线验线记录

**消防验收材料**
- 消防验收申报表
- 消防产品质量合格证明文件
- 消防设施检测合格报告
- 施工、工程监理、检测单位资质证明

**其他专项材料**
- 人防：人防专项验收记录表、人防设备检测报告
- 环保：环保验收监测报告、排污口规范化照片
- 档案：档案预验收申请表、档案移交清单

*具体材料以当地住建部门要求为准，建议使用"材料清单"模块逐项核对。*`;
    }

    if (q.includes('费') || q.includes('钱') || q.includes('价格')) {
      return `关于联合验收的费用问题：

**免费项目** ✅
- 规划核实费：已取消（原收费）
- 消防验收费：已取消（原收费）
- 环保验收费：已取消（原收费）
- 人防验收：行政验收不收费
- 联合验收行政费用：全部取消

**可能产生的费用（第三方机构）** ⚠️
- 消防设施检测费：约0.5-1.5元/㎡
- 室内环境检测费：约150-300元/点
- 竣工测绘费：约0.3-0.8元/㎡
- 档案数字化费：约1-3元/页（A4）
- 防雷检测费：约0.2-0.5元/㎡

**小贴士**：
- 第三方费用可自行询价
- 部分地区政府购买了检测服务，可咨询当地住建部门
- 警惕"加急费""关系费"等违规收费`;
    }

    if (q.includes('卡住') || q.includes('常见问题') || q.includes('问题') || q.includes('办不下来')) {
      return `联合验收最容易卡住的几个环节：

**🔥 Top 1 - 规划核实不通过**
- 原因：实际建筑与规划图纸不符（面积超、位置偏、层数变）
- 解决：提前委托竣工测绘，发现问题及时整改
- 整改周期：一般15-30天

**🔥 Top 2 - 消防验收不通过**
- 原因：消防通道被占用、喷淋系统不达标、疏散指示不规范
- 解决：委托第三方检测机构预检，整改后再申报
- 整改周期：一般7-20天

**🔥 Top 3 - 档案预验收不通过**
- 原因：资料缺签字、盖章不齐全、隐蔽工程记录缺失
- 解决：从施工初期同步收集资料，档案人员提前介入
- 整改周期：一般3-10天

**🔥 Top 4 - 环保验收不通过**
- 原因：排污口不规范、噪音超标、环保设施未同步
- 解决：提前委托监测，确保环保设施正常运行
- 整改周期：一般10-20天

**通用建议**：
1. 申报前做一次自查预检
2. 提前与各主管部门沟通
3. 留足整改时间（建议预留1个月）`;
    }

    return `您的问题是："${question}"

根据您的问题，建议您：

1. **查看申报路径**：在"申报路径"模块选择您的项目类型，系统会自动生成专属办理流程
2. **核对材料清单**：使用"材料清单"模块逐项准备，有大白话解释和易错提示
3. **检查前置条件**：在"工程概况"模块检查是否满足全部前置条件
4. **查看常见问题**：以下热门问题可能对您有帮助：
   - 联合验收的办理顺序是怎样的？
   - 各项验收需要多长时间？
   - 联合验收需要准备哪些材料？
   - 验收过程中最容易卡在哪些环节？

如需更详细的解答，您可以：
- 在左侧分类中选择相关主题
- 或直接咨询当地政务服务热线 12345`;
  };

  const handleSend = () => {
    const finalText = input.trim() || interimText.trim();
    if (!finalText) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: finalText,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setInput('');
    setInterimText('');
    setVoiceError(null);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: generateAnswer(finalText),
        timestamp: new Date().toISOString(),
      };
      addMessage(aiMsg);
    }, 800);
  };

  const handleQuickQuestion = (q: QaItem) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: q.question,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: q.answer,
        timestamp: new Date().toISOString(),
      };
      addMessage(aiMsg);
    }, 500);
  };

  const handleSpeak = (text: string, id: string) => {
    if (!isSpeechSynthesisSupported()) {
      alert('当前浏览器不支持语音播报功能');
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    speakText(text)
      .catch(() => {})
      .finally(() => setSpeaking(false));
  };

  const handleVoiceInput = () => {
    const supportErr = getSpeechRecognitionErrorMessage();
    if (supportErr) {
      setVoiceError(supportErr);
      return;
    }

    setVoiceError(null);

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setRecording(false);
      return;
    }

    const recognition = createSpeechRecognition(
      (result) => {
        if (result.isFinal) {
          setInput((prev) => (prev ? prev + ' ' + result.text : result.text));
          setInterimText('');
        } else {
          setInterimText(result.text);
        }
      },
      (errMsg) => {
        setRecording(false);
        setVoiceError(errMsg);
      },
      () => {
        setRecording(false);
      }
    );

    if (!recognition) {
      setVoiceError('语音识别初始化失败，请刷新页面重试');
      return;
    }

    try {
      recognitionRef.current = recognition;
      recognition.start();
      setRecording(true);
    } catch (e: any) {
      setVoiceError(`启动失败：${e?.message || '未知错误'}`);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">智能问答中心</h1>
          <p className="text-slate-500 mt-1">
            关于验收顺序、办理时限、材料要求的问题都可以问我
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (confirm('确定要清空当前聊天记录吗？')) clearChat();
            }}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            清空对话
          </button>
          <button
            onClick={restoreDefaultChat}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm"
          >
            恢复默认
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 h-full">
        <div className="col-span-1 space-y-5 overflow-y-auto pr-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-blue-500" />
              问题分类
            </h3>
            <div className="space-y-1">
              {[
                { id: 'all', name: '全部问题', icon: 'question' },
                ...qaCategories,
              ].map((cat) => {
                const Icon = cat.icon
                  ? getCategoryIcon(cat.icon)
                  : HelpCircle;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              热门问题
            </h3>
            <div className="space-y-2">
              {filteredQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                  onClick={() => handleQuickQuestion(q)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-slate-700 line-clamp-2 flex-1">
                      {q.question}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(q.id);
                      }}
                      className={`flex-shrink-0 ${
                        q.isFavorite
                          ? 'text-red-500'
                          : 'text-slate-300 hover:text-red-400'
                      }`}
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={q.isFavorite ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {favorites.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
                我的收藏
              </h3>
              <div className="space-y-2">
                {favorites.map((q) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl bg-red-50/50 hover:bg-red-50 cursor-pointer transition-colors"
                    onClick={() => handleQuickQuestion(q)}
                  >
                    <p className="text-sm text-slate-700 line-clamp-2">
                      {q.question}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-3 flex flex-col">
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <MessageCircleQuestion className="w-5 h-5 text-blue-500" />
                智能对话
              </h3>
              {voiceError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{voiceError}</span>
                  <button
                    onClick={() => setVoiceError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <MessageCircleQuestion className="w-10 h-10 text-blue-500" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-700 mb-2">
                    你好！我是联合验收小助手
                  </h4>
                  <p className="text-slate-500 mb-6 max-w-sm">
                    您可以问我关于验收顺序、办理时限、材料要求的问题，
                    也可以用语音提问哦～
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    {hotQuestions.slice(0, 3).map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handleQuickQuestion(q)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-700 transition-colors"
                      >
                        {q.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center justify-end mb-2 gap-1">
                        <button
                          onClick={() => handleSpeak(msg.content, msg.id)}
                          className={`p-1.5 rounded-lg ${
                            isSpeaking
                              ? 'bg-blue-100 text-blue-600'
                              : 'hover:bg-slate-200 text-slate-500'
                          }`}
                          title={isSpeaking ? '停止播放' : '语音播报'}
                        >
                          {isSpeaking ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        msg.role === 'user'
                          ? 'text-blue-100'
                          : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200">
              {(interimText || input) && (
                <div className="mb-3 px-3 pt-3 pb-2">
                  {interimText && !input && (
                    <div className="text-sm text-blue-600 italic bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-2">
                      🎤 正在识别：{interimText}...
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleVoiceInput}
                  className={`p-3 rounded-xl transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                      : voiceError
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                  title={
                    isRecording
                      ? '点击停止录音'
                      : isSpeechRecognitionSupported()
                      ? '点击开始语音输入'
                      : getSpeechRecognitionErrorMessage()
                  }
                >
                  <Mic className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (interimText) setInterimText('');
                    }}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && !e.shiftKey && handleSend()
                    }
                    placeholder={
                      isRecording
                        ? '正在聆听您的问题...'
                        : '输入您的问题，按回车发送'
                    }
                    className="w-full px-5 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    ⏎ 发送
                  </div>
                </div>

                <button
                  onClick={handleSend}
                  disabled={!input.trim() && !interimText.trim()}
                  className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  平均响应时间：2-5秒
                </span>
                {!voiceError && (
                  <span>
                    {isSpeechRecognitionSupported()
                      ? '💡 支持语音输入，点击麦克风按钮开始提问'
                      : '⚠️ 当前环境不支持语音识别，建议使用 Chrome/Edge + HTTPS'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
