import { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  File,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useMaterialStore } from '@/store/materialStore';
import { materialCategories } from '@/data/materials';
import { generateAttachmentName } from '@/utils/format';

export default function Attachments() {
  const { attachments, removeAttachment, addAttachment } = useMaterialStore();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAttachments =
    selectedCategory === 'all'
      ? attachments
      : attachments.filter((a) => a.category === selectedCategory);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file, index) => {
      const newAttachment = {
        id: `att-new-${Date.now()}-${index}`,
        originalName: file.name,
        formattedName: generateAttachmentName(
          '滨江花园',
          '验收资料',
          file.name
        ),
        category: '验收资料',
        size: formatFileSize(file.size),
        uploadDate: new Date().toLocaleString('zh-CN'),
        status: 'uploading' as const,
        formatValid: true,
      };
      addAttachment(newAttachment);

      setTimeout(() => {
        // 模拟上传完成
        const store = useMaterialStore.getState();
        store.updateAttachment(newAttachment.id, { status: 'success' });
      }, 1500 + index * 500);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'uploading':
        return (
          <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
        );
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '上传成功';
      case 'uploading':
        return '上传中';
      case 'error':
        return '上传失败';
      default:
        return '等待中';
    }
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (['doc', 'docx'].includes(ext || '')) {
      return <FileText className="w-6 h-6 text-blue-500" />;
    } else if (['xls', 'xlsx'].includes(ext || '')) {
      return <FileText className="w-6 h-6 text-emerald-500" />;
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
      return <FileText className="w-6 h-6 text-purple-500" />;
    }
    return <File className="w-6 h-6 text-slate-400" />;
  };

  const totalSize = attachments.reduce((acc, a) => {
    const size = parseFloat(a.size);
    if (a.size.includes('MB')) return acc + size;
    if (a.size.includes('KB')) return acc + size / 1024;
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">附件管理</h1>
          <p className="text-slate-500 mt-1">
            共 {attachments.length} 个文件，总大小 {totalSize.toFixed(1)} MB
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            智能命名整理
          </button>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            批量下载
          </button>
        </div>
      </div>

      <div
        className={`relative bg-white rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-slate-300 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Upload className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          拖拽文件到此处上传
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          支持 PDF、Word、Excel、图片等格式，单文件不超过 50MB
        </p>
        <button className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
          选择文件
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              全部
            </button>
            {materialCategories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-sm text-slate-500">
            显示 {filteredAttachments.length} 个文件
          </div>
        </div>

        {filteredAttachments.length === 0 ? (
          <div className="p-12 text-center">
            <File className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">暂无附件</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAttachments.map((att) => (
              <div
                key={att.id}
                className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {getFileIcon(att.formattedName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800 truncate">
                      {att.formattedName}
                    </p>
                    <span className="text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded">
                      已规范命名
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                    <span>{att.originalName}</span>
                    <span>·</span>
                    <span>{att.size}</span>
                    <span>·</span>
                    <span>{att.uploadDate}</span>
                    <span>·</span>
                    <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {att.category}
                    </span>
                  </div>
                  {att.status === 'uploading' && (
                    <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden max-w-xs">
                      <div className="h-full bg-blue-500 rounded-full w-2/3 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-sm">
                    {getStatusIcon(att.status)}
                    <span
                      className={`${
                        att.status === 'success'
                          ? 'text-emerald-600'
                          : att.status === 'uploading'
                          ? 'text-blue-600'
                          : 'text-red-600'
                      }`}
                    >
                      {getStatusText(att.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeAttachment(att.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          命名规则说明
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-sm font-medium text-slate-700 mb-2">
              命名格式
            </p>
            <p className="text-sm text-slate-600 font-mono bg-white p-2 rounded border border-slate-200">
              [项目名]-[类别]-[材料名]-[版本号]
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-sm font-medium text-blue-700 mb-2">示例</p>
            <p className="text-sm text-blue-600">
              滨江花园-前期资料-建设工程规划许可证-V1.pdf
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-4">
          * 系统会自动按照规范对上传的附件进行重命名，确保材料命名统一规范，便于审查和归档。
        </p>
      </div>
    </div>
  );
}
