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
