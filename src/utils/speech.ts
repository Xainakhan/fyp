// Create ONE speech recognition instance for entire project
export const createSpeechRecognizer = () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) return null;

  const recog = new SpeechRecognition();
  recog.continuous = false;
  recog.interimResults = true;
  recog.maxAlternatives = 1;

  return recog;
};
