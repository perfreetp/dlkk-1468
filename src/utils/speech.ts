type SpeechRecognitionType = any;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionType;
    webkitSpeechRecognition?: SpeechRecognitionType;
  }
}

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const speakText = (text: string, lang = 'zh-CN'): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      reject(new Error('浏览器不支持语音合成'));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
};

export const stopSpeaking = (): void => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

export interface RecognitionResult {
  text: string;
  isFinal: boolean;
}

export const createSpeechRecognition = (
  onResult: (result: RecognitionResult) => void,
  onError: (error: string) => void,
  onEnd?: () => void,
  lang = 'zh-CN'
): SpeechRecognitionType | null => {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    let finalText = '';
    let interimText = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalText += transcript;
      } else {
        interimText += transcript;
      }
    }

    if (finalText) {
      onResult({ text: finalText.trim(), isFinal: true });
    } else if (interimText) {
      onResult({ text: interimText.trim(), isFinal: false });
    }
  };

  recognition.onerror = (event: any) => {
    let errorMessage = '语音识别出错';
    switch (event.error) {
      case 'no-speech':
        errorMessage = '没有检测到语音输入，请对着麦克风说话';
        break;
      case 'audio-capture':
        errorMessage = '未检测到麦克风设备，请检查麦克风是否连接正常';
        break;
      case 'not-allowed':
        errorMessage = '麦克风权限被拒绝，请在浏览器设置中允许使用麦克风';
        break;
      case 'network':
        errorMessage = '网络连接异常，语音识别需要网络支持';
        break;
      case 'aborted':
        errorMessage = '语音识别被中断';
        break;
      default:
        errorMessage = `语音识别出错：${event.error}`;
    }
    onError(errorMessage);
  };

  if (onEnd) {
    recognition.onend = onEnd;
  }

  return recognition;
};

export const getSpeechRecognitionErrorMessage = (): string => {
  if (typeof window === 'undefined') {
    return '当前环境不支持语音识别';
  }

  const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  const hasAPI = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  if (!hasAPI) {
    const browser = navigator.userAgent.toLowerCase();
    if (browser.includes('firefox')) {
      return '当前浏览器暂不支持语音识别功能，建议使用 Chrome 或 Edge 浏览器';
    } else if (browser.includes('safari')) {
      return 'Safari 浏览器的语音识别支持有限，建议使用 Chrome 或 Edge 浏览器';
    } else {
      return '当前浏览器不支持语音识别功能，建议使用最新版本的 Chrome 或 Edge 浏览器';
    }
  }

  if (!isHttps) {
    return '语音识别需要在 HTTPS 或 localhost 环境下使用';
  }

  return '';
};
