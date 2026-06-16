export const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

export const speakText = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      reject(new Error('语音合成不支持'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

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
