export interface ParsedProjectInfo {
  name?: string;
  builder?: string;
  address?: string;
  area?: number;
  floors?: number;
  startDate?: string;
  plannedEndDate?: string;
}

export const parseProjectText = (text: string): ParsedProjectInfo => {
  const result: ParsedProjectInfo = {};
  const lines = text.split(/[\n\r]+/).map((l) => l.trim()).filter(Boolean);

  const matchPattern = (patterns: RegExp[]): string | null => {
    for (const line of lines) {
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          return match[1].trim().replace(/[，,。；;:：]$/, '');
        }
      }
    }
    return null;
  };

  const parseDate = (dateStr: string): string | undefined => {
    if (!dateStr) return undefined;
    
    let normalized = dateStr
      .replace(/年|月/g, '-')
      .replace(/日/g, '')
      .replace(/[.\s]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const parts = normalized.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      const year = y.length === 2 ? `20${y}` : y;
      const month = m.padStart(2, '0');
      const day = d.padStart(2, '0');
      if (/^\d{4}$/.test(year) && /^\d{2}$/.test(month) && /^\d{2}$/.test(day)) {
        return `${year}-${month}-${day}`;
      }
    }
    return undefined;
  };

  const parseNumber = (numStr: string): number | undefined => {
    if (!numStr) return undefined;
    const cleaned = numStr.replace(/[,，\s]/g, '').match(/[\d.]+/);
    if (cleaned) {
      const n = parseFloat(cleaned[0]);
      if (!isNaN(n)) return n;
    }
    return undefined;
  };

  // 项目名称 - 多种格式
  const nameMatch = matchPattern([
    /^(?:项目名称|项目名|工程名称|工程名)[:：]\s*(.+)$/,
    /^(?:项目|工程)[:：]\s*(.+)$/,
    /^(.+?(?:项目|工程))(?:[:：]|$)/,
  ]);
  if (nameMatch) result.name = nameMatch;

  // 建设单位
  const builderMatch = matchPattern([
    /^(?:建设单位|业主单位|甲方|建设方)[:：]\s*(.+)$/,
    /^(?:建设单位|业主单位|甲方|建设方)(?:名称)?[:：]?\s*(.+?(?:公司|局|院|所|中心|集团))/,
  ]);
  if (builderMatch) result.builder = builderMatch;

  // 项目地址
  const addressMatch = matchPattern([
    /^(?:项目地址|工程地址|建设地点|建设地址|坐落地址|地址)[:：]\s*(.+)$/,
    /^(?:位于|地处|坐落于|地址在)[:：]?\s*(.+)$/,
  ]);
  if (addressMatch) result.address = addressMatch;

  // 建筑面积 - 多种格式
  const areaLine = lines.find((l) => /(建筑|总|占地|用地)?面积/.test(l));
  if (areaLine) {
    const areaMatch = areaLine.match(
      /(?:建筑|总|占地|用地)?面积[:：]?\s*([\d,，.]+)\s*(?:平方米|㎡|平米|平|M2|m²)?/i
    );
    if (areaMatch) {
      const n = parseNumber(areaMatch[1]);
      if (n !== undefined) result.area = n;
    }
  }

  // 层数 - 地上/地下
  const floorsLine = lines.find((l) => /层/.test(l));
  if (floorsLine) {
    const aboveMatch = floorsLine.match(/(?:地上)?[:：]?\s*(\d+)\s*层/);
    const belowMatch = floorsLine.match(/地下[:：]?\s*(\d+)\s*层/);
    if (aboveMatch) {
      const above = parseNumber(aboveMatch[1]) || 0;
      const below = belowMatch ? parseNumber(belowMatch[1]) || 0 : 0;
      result.floors = above + below;
    } else {
      const totalMatch = floorsLine.match(/(\d+)\s*层/);
      if (totalMatch) {
        const n = parseNumber(totalMatch[1]);
        if (n !== undefined) result.floors = n;
      }
    }
  }

  // 开工日期
  const startLine = lines.find((l) => /开工(日期)?|开始日期|动工日期/.test(l));
  if (startLine) {
    const dateMatch = startLine.match(
      /(?:开工(?:日期)?|开始日期|动工日期)[:：]?\s*(\d{1,4}[-年.\s]\d{1,2}[-月.\s]\d{1,2}日?)/
    );
    if (dateMatch) {
      const d = parseDate(dateMatch[1]);
      if (d) result.startDate = d;
    }
  }

  // 竣工日期
  const endLine = lines.find((l) => /(?:计划)?竣工(日期)?|完工日期|交付日期/.test(l));
  if (endLine) {
    const dateMatch = endLine.match(
      /(?:计划)?(?:竣工(?:日期)?|完工日期|交付日期)[:：]?\s*(\d{1,4}[-年.\s]\d{1,2}[-月.\s]\d{1,2}日?)/
    );
    if (dateMatch) {
      const d = parseDate(dateMatch[1]);
      if (d) result.plannedEndDate = d;
    }
  }

  // 如果第一行没有被识别为项目名，且看起来像项目名，则使用它
  if (!result.name && lines.length > 0) {
    const firstLine = lines[0];
    if (
      !/[:：]/.test(firstLine) &&
      /(项目|工程|花园|小区|大厦|广场|中心|医院|学校|道路|桥梁|厂房|车间|装修|改造|安装)/.test(firstLine)
    ) {
      result.name = firstLine;
    }
  }

  return result;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

export const generateAttachmentName = (
  projectName: string,
  category: string,
  materialName: string,
  version = 1
): string => {
  const shortProjectName = projectName.split('项目')[0] || projectName;
  const extMatch = materialName.match(/\.[^.]+$/);
  const extension = extMatch ? extMatch[0] : '';
  const baseName = materialName.replace(extension, '');

  return `${shortProjectName}-${category}-${baseName}-V${version}${extension}`;
};
