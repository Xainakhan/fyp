// ============================================================================
// ADVANCED HEALTHCARE SYSTEM - TYPESCRIPT IMPLEMENTATION (COMPLETED)
// NOTE: This is a demo-quality implementation that focuses on architecture and
// deterministic, lightweight math in place of real ML models.
// Do NOT use for medical decision-making without proper validation.
// ============================================================================

import { useEffect, useRef, useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

export interface VoiceBiomarkers {
  timestamp: number;
  stressLevel: number; // 0..1
  emotionalState: EmotionalState;
  cognitiveLoad: number; // 0..1
  fatigueLevel: number; // 0..1
  vocalHealthScore: number; // 0..100
  breathingPattern: BreathingPattern;
  heartRateVariability: number; // milliseconds, synthetic estimate
  speechClarity: number; // 0..1
  pitchStability: number; // 0..1
}

export interface EmotionalState {
  primary: 'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'excited' | 'neutral';
  confidence: number; // 0..1
  emotions: {
    happiness: number; // 0..1
    sadness: number;
    anger: number;
    anxiety: number;
    calmness: number;
    excitement: number;
  };
}

export interface BreathingPattern {
  rate: number; // breaths per minute
  regularity: number; // 0..1 score
  depth: 'shallow' | 'normal' | 'deep';
  pattern: 'regular' | 'irregular' | 'labored';
}

export interface HealthPrediction {
  id: string;
  condition: string;
  probability: number; // 0..1
  timeframe: string; // e.g., "1-2 weeks"
  severity: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  preventiveMeasures: string[];
  confidence: number; // 0..1
  basedOn: ('voice' | 'biometric' | 'behavioral' | 'historical')[];
}

export interface BiometricReading {
  timestamp: number;
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number; pulse: number };
  temperature: number;
  oxygenSaturation: number;
  skinConductance: number;
  glucoseLevel?: number;
  hydrationLevel: number; // 0..1
}

export interface AIInsight {
  id: string;
  type: 'alert' | 'recommendation' | 'achievement' | 'trend' | 'warning';
  category: 'physical' | 'mental' | 'behavioral' | 'environmental';
  title: string;
  message: string;
  confidence: number; // 0..1
  urgency: 1 | 2 | 3 | 4 | 5; // 1 = low, 5 = critical
  actionable: boolean;
  actions?: InsightAction[];
  expiresAt?: number;
}

export interface InsightAction {
  id: string;
  title: string;
  description: string;
  type: 'immediate' | 'scheduled' | 'reminder';
  category: 'exercise' | 'medication' | 'lifestyle' | 'medical';
}

export interface HealthGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: number; // epoch ms
  priority: 'low' | 'medium' | 'high';
  category: 'fitness' | 'mental' | 'nutrition' | 'sleep' | 'medical';
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  value: number;
  completed: boolean;
  completedAt?: number;
  reward?: string;
}

// Internal helper types used by the voice engine
export interface VoiceFeatures {
  f0: number;
  harmonics: number[];
  spectralCentroid: number;
  spectralRolloff: number;
  spectralFlux: number;
  mfcc: number[];
  zeroCrossingRate: number;
  energy: number;
  jitter: number;
  shimmer: number;
  hnr: number;
  pitch: number;
  intensity: number;
  speaking_rate: number; // words/min (rough estimate)
}

export interface StressAnalysis {
  level: number; // 0..1
  indicators: {
    pitchVariability: number;
    spectralAnxiety: number;
    voiceShakiness: number;
    speechRate: number;
  };
  confidence: number; // 0..1
  recommendations: string[];
}

export interface RiskModel {
  name: string;
  version: string;
  evaluate: (input: {
    voice?: VoiceBiomarkers[];
    biometrics?: BiometricReading[];
  }) => { condition: string; probability: number; severity: HealthPrediction['severity']; rationale: string[] };
}

// ============================================================================
// ADVANCED VOICE ANALYSIS ENGINE (demo implementation)
// ============================================================================

export class AdvancedVoiceAnalysisEngine {
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private isRecording = false;
  private analysisInterval: number | null = null;

  // ML model placeholders
  private stressDetectionModel: unknown = null;
  private emotionRecognitionModel: unknown = null;
  private cognitiveLoadModel: unknown = null;
  private healthRiskModel: unknown = null;

  constructor() {
    this.initializeAudioWorklet();
  }

  private async initializeAudioWorklet(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
      if (this.audioContext.audioWorklet) {
        try {
          await this.audioContext.audioWorklet.addModule('/audio-worklets/voice-analyzer.js');
        } catch (e) {
          // Worklet is optional for this demo; ignore if not present
          console.warn('AudioWorklet module not loaded; continuing with Analyser only.');
        }
      }
      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = 4096;
      this.analyzer.smoothingTimeConstant = 0.8;
      // console.log('Advanced Voice Analysis Engine initialized');
    } catch (error) {
      console.error('Failed to initialize voice analysis engine:', error);
    }
  }

  async startAdvancedRecording(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      });

      if (!this.audioContext) await this.initializeAudioWorklet();
      if (!this.audioContext || !this.analyzer) throw new Error('AudioContext not ready');

      this.microphone = this.audioContext.createMediaStreamSource(stream);
      if (this.audioContext.audioWorklet) {
        try { this.workletNode = new AudioWorkletNode(this.audioContext, 'voice-analyzer'); } catch {}
      }

      // Connect processing chain
      this.microphone.connect(this.analyzer);
      if (this.workletNode) this.analyzer.connect(this.workletNode);

      this.isRecording = true;
      this.startRealTimeAnalysis();
      return true;
    } catch (error) {
      console.error('Failed to start advanced recording:', error);
      return false;
    }
  }

  private startRealTimeAnalysis(): void {
    const tick = () => {
      if (!this.isRecording || !this.analyzer) return;
      const bufferLength = this.analyzer.frequencyBinCount;
      const frequencyData = new Uint8Array(bufferLength);
      const timeData = new Uint8Array(bufferLength);
      this.analyzer!.getByteFrequencyData(frequencyData);
      this.analyzer!.getByteTimeDomainData(timeData);
      const features = this.extractVoiceFeatures(frequencyData, timeData);
      const biomarkers = this.analyzeBiomarkers(features);
      this.onAnalysisUpdate?.(biomarkers);
    };
    // ~10 FPS
    this.analysisInterval = window.setInterval(tick, 100);
  }

  private extractVoiceFeatures(frequencyData: Uint8Array, timeData: Uint8Array): VoiceFeatures {
    return {
      f0: this.calculateFundamentalFrequency(timeData),
      harmonics: this.extractHarmonics(frequencyData),
      spectralCentroid: this.calculateSpectralCentroid(frequencyData),
      spectralRolloff: this.calculateSpectralRolloff(frequencyData),
      spectralFlux: this.calculateSpectralFlux(frequencyData),
      mfcc: this.calculateMFCC(frequencyData),
      zeroCrossingRate: this.calculateZeroCrossingRate(timeData),
      energy: this.calculateEnergy(timeData),
      jitter: this.calculateJitter(timeData),
      shimmer: this.calculateShimmer(timeData),
      hnr: this.calculateHarmonicToNoiseRatio(frequencyData, timeData),
      pitch: this.extractPitch(timeData),
      intensity: this.calculateIntensity(timeData),
      speaking_rate: this.estimateSpeakingRate(timeData),
    };
  }

  private analyzeBiomarkers(features: VoiceFeatures): VoiceBiomarkers {
    const timestamp = Date.now();
    const stress = this.analyzeStressFromVoice(features);
    const emotionalState = this.analyzeEmotionalState(features);
    const cognitiveLoad = this.analyzeCognitiveLoad(features);
    const fatigue = this.analyzeFatigue(features);
    const breathing = this.analyzeBreathingFromVoice(features);

    return {
      timestamp,
      stressLevel: Math.max(0, Math.min(1, stress.level)),
      emotionalState,
      cognitiveLoad: Math.max(0, Math.min(1, cognitiveLoad.level)),
      fatigueLevel: Math.max(0, Math.min(1, fatigue.level)),
      vocalHealthScore: Math.max(0, Math.min(100, this.calculateVocalHealthScore(features))),
      breathingPattern: breathing,
      heartRateVariability: Math.max(20, Math.min(150, this.estimateHRVFromVoice(features))),
      speechClarity: Math.max(0, Math.min(1, this.calculateSpeechClarity(features))),
      pitchStability: Math.max(0, Math.min(1, this.calculatePitchStability(features))),
    };
  }

  // ------------------------ DSP helpers (simple approximations) ------------------------
  private mean(arr: number[]): number { return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0; }
  private std(arr: number[]): number {
    const m = this.mean(arr);
    return Math.sqrt(this.mean(arr.map(x => (x - m) ** 2)));
  }

  private calculateFundamentalFrequency(timeData: Uint8Array): number {
    // Very rough autocorrelation-based pitch
    if (!this.audioContext) return 0;
    const sr = this.audioContext.sampleRate;
    const minPeriod = Math.floor(sr / 800);
    const maxPeriod = Math.floor(sr / 80);
    let best = minPeriod, bestCorr = 0;
    for (let p=minPeriod; p<=maxPeriod; p++){
      let corr = 0; for (let i=0;i<timeData.length-p;i++){ corr += (timeData[i]-128)*(timeData[i+p]-128); }
      if (corr > bestCorr){ bestCorr = corr; best = p; }
    }
    return sr / best;
  }

  private extractHarmonics(freq: Uint8Array): number[] {
    const out: number[] = [];
    const step = Math.floor(freq.length / 8) || 1;
    for (let i = step; i < freq.length; i += step) out.push(freq[i] / 255);
    return out.slice(0, 8);
  }

  private calculateSpectralCentroid(freq: Uint8Array): number {
    let num = 0, den = 0;
    for (let i=0;i<freq.length;i++){ num += i*freq[i]; den += freq[i]; }
    return den ? num/den : 0;
  }

  private calculateSpectralRolloff(freq: Uint8Array): number {
    const total = freq.reduce((a,b)=>a+b,0);
    const threshold = total * 0.85;
    let acc = 0;
    for (let i=0;i<freq.length;i++){ acc+=freq[i]; if (acc>=threshold) return i; }
    return freq.length-1;
  }

  private calculateSpectralFlux(freq: Uint8Array): number {
    // Approximate frame-to-frame flux by comparing halves
    const mid = Math.floor(freq.length/2);
    const a = this.mean(Array.from(freq.slice(0, mid)));
    const b = this.mean(Array.from(freq.slice(mid)));
    return Math.abs(b - a) / 255;
  }

  private calculateMFCC(freq: Uint8Array): number[] {
    const num = 13; const out = new Array(num).fill(0);
    for (let i=0;i<num;i++){
      let s=0; const w = (i+1);
      for (let j=0;j<freq.length;j++) s += freq[j] * Math.sin((j*w*Math.PI)/freq.length);
      out[i] = Math.log(Math.max(1e-6, Math.abs(s))) / 10;
    }
    return out;
  }

  private calculateZeroCrossingRate(time: Uint8Array): number {
    let zc=0; for (let i=1;i<time.length;i++){ const a=time[i-1]-128, b=time[i]-128; if ((a>=0&&b<0)||(a<0&&b>=0)) zc++; }
    return zc / time.length;
  }

  private calculateEnergy(time: Uint8Array): number {
    let e=0; for (let i=0;i<time.length;i++){ const v=time[i]-128; e += v*v; }
    return e / (time.length * 128*128);
  }

  private calculateJitter(time: Uint8Array): number {
    // Fake jitter from short-term ZCR variance
    const win = 64; const vals: number[] = [];
    for (let i=0;i<time.length-win;i+=win){ vals.push(this.calculateZeroCrossingRate(time.slice(i,i+win))); }
    return Math.min(1, this.std(vals) * 5);
  }

  private calculateShimmer(time: Uint8Array): number {
    // Fake shimmer from amplitude variance
    const win = 64; const vals: number[] = [];
    for (let i=0;i<time.length-win;i+=win){
      const seg = Array.from(time.slice(i,i+win)).map(v=>Math.abs(v-128));
      vals.push(this.std(seg)/128);
    }
    return Math.min(1, this.mean(vals));
  }

  private calculateHarmonicToNoiseRatio(freq: Uint8Array, time: Uint8Array): number {
    const energy = this.calculateEnergy(time);
    const centroid = this.calculateSpectralCentroid(freq) / freq.length;
    return Math.max(0, Math.min(1, (energy * (1 - centroid))));
  }

  private extractPitch(time: Uint8Array): number { return this.calculateFundamentalFrequency(time); }
  private calculateIntensity(time: Uint8Array): number { return Math.min(1, Math.sqrt(this.calculateEnergy(time))); }
  private estimateSpeakingRate(_time: Uint8Array): number { return 140 + Math.round((Math.random()-0.5)*40); }

  // ------------------------ Higher-level analytics ------------------------
  private analyzeStressFromVoice(f: VoiceFeatures): StressAnalysis {
    const pitchVariability = Math.min(1, Math.abs(f.pitch - f.f0) / 200);
    const spectralAnxiety = Math.min(1, (f.spectralFlux + (1 - f.hnr)) / 2);
    const voiceShakiness = Math.min(1, (f.jitter + f.shimmer) / 2);
    const speechRate = f.speaking_rate;
    const stressScore = (
      pitchVariability * 0.3 +
      spectralAnxiety * 0.25 +
      voiceShakiness * 0.2 +
      Math.min(1, Math.abs(speechRate - 150) / 150) * 0.25
    );
    return {
      level: Math.max(0, Math.min(1, stressScore)),
      indicators: { pitchVariability, spectralAnxiety, voiceShakiness, speechRate },
      confidence: this.calculateConfidence([1 - f.jitter, f.hnr, 1 - f.shimmer]),
      recommendations: this.generateStressRecommendations(stressScore),
    };
  }

  private analyzeEmotionalState(f: VoiceFeatures): EmotionalState {
    const p = Math.min(1, f.pitch / 400);
    const e = Math.min(1, f.intensity);
    const rate = Math.min(1, Math.abs(f.speaking_rate - 140) / 140);

    const emotions = {
      happiness: Math.max(0, p * 0.6 + e * 0.4 - 0.1*rate),
      sadness: Math.max(0, (1 - p) * 0.7 + (1 - e) * 0.3),
      anger: Math.max(0, e * 0.6 + rate * 0.4),
      anxiety: Math.max(0, rate * 0.7 + (1 - f.hnr) * 0.3),
      calmness: Math.max(0, (1 - rate) * 0.6 + f.hnr * 0.4),
      excitement: Math.max(0, p * 0.5 + e * 0.5),
    };
    const entries = Object.entries(emotions) as [keyof typeof emotions, number][];
    entries.sort((a,b)=>b[1]-a[1]);
    const primary = (entries[0]?.[0] ?? 'neutral') as EmotionalState['primary'];
    const top = entries[0]?.[1] ?? 0.5;

    return { primary: (['happiness','excitement'].includes(primary as any) ? (primary === 'happiness' ? 'happy' : 'excited') : (primary as any)), confidence: Math.min(1, top), emotions } as EmotionalState;
  }

  private analyzeCognitiveLoad(f: VoiceFeatures): { level: number } {
    const load = Math.min(1, (f.spectralCentroid / 2048 + f.zeroCrossingRate + (1 - f.hnr)) / 3);
    return { level: load };
  }

  private analyzeFatigue(f: VoiceFeatures): { level: number } {
    const fatigue = Math.min(1, (1 - f.intensity) * 0.6 + (1 - f.spectralFlux) * 0.4);
    return { level: fatigue };
  }

  private analyzeBreathingFromVoice(_f: VoiceFeatures): BreathingPattern {
    const rate = 10 + Math.round(Math.random() * 10); // 10-20 bpm
    const regularity = Math.random() * 0.5 + 0.5;
    const depth: BreathingPattern['depth'] = regularity > 0.7 ? 'normal' : (Math.random() > 0.5 ? 'shallow' : 'deep');
    const pattern: BreathingPattern['pattern'] = regularity > 0.6 ? 'regular' : (Math.random() > 0.5 ? 'irregular' : 'labored');
    return { rate, regularity, depth, pattern };
  }

  private calculateVocalHealthScore(f: VoiceFeatures): number {
    const score = (f.hnr * 40) + ((1 - f.jitter) * 30) + ((1 - f.shimmer) * 30);
    return Math.max(0, Math.min(100, score));
  }

  private estimateHRVFromVoice(f: VoiceFeatures): number {
    // synthetic: higher calmness proxy => higher HRV
    const calmProxy = Math.max(0, 1 - this.analyzeCognitiveLoad(f).level);
    return 40 + calmProxy * 60; // 40..100 ms
  }

  private calculateSpeechClarity(f: VoiceFeatures): number {
    return Math.max(0, Math.min(1, f.hnr * 0.6 + (1 - f.jitter) * 0.2 + (1 - f.shimmer) * 0.2));
  }

  private calculatePitchStability(f: VoiceFeatures): number {
    return Math.max(0, Math.min(1, 1 - Math.min(1, Math.abs(f.pitch - f.f0) / 300)));
  }

  private calculateConfidence(signals: number[]): number {
    const m = this.mean(signals.map(x=>Math.max(0,Math.min(1,x))));
    return Math.max(0.2, Math.min(0.95, m));
  }

  private generateStressRecommendations(level: number): string[] {
    if (level > 0.75) return ['Pause and take 5 slow breaths', 'Consider a short walk', 'Limit stimulants for 1h'];
    if (level > 0.5) return ['1–2 minutes of box-breathing', 'Stretch shoulders/neck'];
    if (level > 0.25) return ['Stay hydrated', 'Brief posture check'];
    return ['Keep up the good work'];
  }

  // Callback
  onAnalysisUpdate?: (biomarkers: VoiceBiomarkers) => void;

  stopRecording(): void {
    if (this.analysisInterval) { window.clearInterval(this.analysisInterval); this.analysisInterval = null; }
    if (this.microphone) { this.microphone.disconnect(); this.microphone = null; }
    this.isRecording = false;
  }
}

// ============================================================================
// PREDICTIVE HEALTH ANALYTICS ENGINE
// ============================================================================

export class PredictiveHealthAnalytics {
  private healthHistory: VoiceBiomarkers[] = [];
  private biometricHistory: BiometricReading[] = [];
  private riskModels: Map<string, RiskModel> = new Map();
  private goals: HealthGoal[] = [];

  addBiomarkers(b: VoiceBiomarkers) { this.healthHistory.push(b); }
  addBiometricReading(r: BiometricReading) { this.biometricHistory.push(r); }
  addGoal(g: HealthGoal) { this.goals.push(g); }

  updateRiskModel(model: RiskModel) { this.riskModels.set(model.name, model); }

  getPredictions(): HealthPrediction[] {
    const preds: HealthPrediction[] = [];
    for (const model of this.riskModels.values()) {
      const res = model.evaluate({ voice: this.healthHistory, biometrics: this.biometricHistory });
      preds.push({
        id: `${model.name}-${Date.now()}`,
        condition: res.condition,
        probability: Math.max(0, Math.min(1, res.probability)),
        timeframe: '1–4 weeks',
        severity: res.severity,
        riskFactors: res.rationale,
        preventiveMeasures: this.defaultPreventive(res.condition),
        confidence: 0.7,
        basedOn: ['voice', 'biometric'],
      });
    }
    return preds.sort((a,b)=>b.probability-a.probability);
  }

  generateInsights(): AIInsight[] {
    const insights: AIInsight[] = [];

    const last = this.healthHistory[this.healthHistory.length - 1];
    if (last) {
      if (last.stressLevel > 0.75) {
        insights.push({
          id: `stress-${last.timestamp}`,
          type: 'alert',
          category: 'mental',
          title: 'High stress detected',
          message: 'Consider a 2-minute breathing break and reduce multitasking.',
          confidence: 0.8,
          urgency: 4,
          actionable: true,
          actions: [{ id: 'breath', title: 'Start box-breathing', description: '4-4-4-4 for 2 minutes', type: 'immediate', category: 'lifestyle' }],
          expiresAt: Date.now() + 15 * 60 * 1000,
        });
      }

      if (last.vocalHealthScore > 85) {
        insights.push({
          id: `voice-${last.timestamp}`,
          type: 'achievement',
          category: 'physical',
          title: 'Great vocal health',
          message: 'Your vocal clarity and stability look excellent today.',
          confidence: 0.7,
          urgency: 1,
          actionable: false,
        });
      }
    }

    // Trend: rising fatigue over last 5 entries
    if (this.healthHistory.length >= 5) {
      const slice = this.healthHistory.slice(-5).map(b=>b.fatigueLevel);
      const trend = slice[slice.length-1] - slice[0];
      if (trend > 0.2) {
        insights.push({
          id: `fatigue-trend-${Date.now()}`,
          type: 'trend',
          category: 'physical',
          title: 'Fatigue trending up',
          message: 'Fatigue has increased recently. Consider earlier sleep and hydration.',
          confidence: 0.65,
          urgency: 2,
          actionable: true,
          actions: [{ id: 'sleep', title: 'Set sleep reminder', description: 'Wind-down at 10:30 PM', type: 'reminder', category: 'lifestyle' }],
        });
      }
    }

    return insights;
  }

  updateGoalsProgress(): void {
    const last = this.biometricHistory[this.biometricHistory.length - 1];
    if (!last) return;
    this.goals = this.goals.map(g => ({ ...g, currentValue: Math.min(g.targetValue, g.currentValue + Math.random()* (g.targetValue*0.02)) }));
  }

  private defaultPreventive(condition: string): string[] {
    switch (condition.toLowerCase()) {
      case 'burnout risk': return ['Take micro-breaks', 'Time-block deep work', 'Maintain hydration'];
      case 'respiratory strain': return ['Avoid shouting', 'Humidify environment', 'Short voice rests'];
      default: return ['Balanced nutrition', 'Regular activity', 'Adequate sleep'];
    }
  }
}

// ============================================================================
// SAMPLE RISK MODELS
// ============================================================================

export const BurnoutRiskModel: RiskModel = {
  name: 'burnout',
  version: '1.0.0',
  evaluate: ({ voice = [], biometrics = [] }) => {
    const v = voice.slice(-10);
    const avgStress = v.length ? v.reduce((a,b)=>a+b.stressLevel,0)/v.length : 0.3;
    const avgFatigue = v.length ? v.reduce((a,b)=>a+b.fatigueLevel,0)/v.length : 0.3;
    const hr = biometrics.slice(-10);
    const avgHR = hr.length ? hr.reduce((a,b)=>a+b.heartRate,0)/hr.length : 72;

    const probability = Math.max(0, Math.min(1, avgStress*0.5 + avgFatigue*0.4 + (avgHR>85?0.2:0)));
    const severity: HealthPrediction['severity'] = probability>0.75? 'high' : probability>0.5? 'medium' : 'low';
    const rationale = [
      `Avg stress: ${(avgStress*100).toFixed(0)}%`,
      `Avg fatigue: ${(avgFatigue*100).toFixed(0)}%`,
      `Avg HR: ${avgHR.toFixed(0)} bpm`,
    ];
    return { condition: 'Burnout risk', probability, severity, rationale };
  },
};

export const RespiratoryStrainModel: RiskModel = {
  name: 'respiratory',
  version: '1.0.0',
  evaluate: ({ voice = [] }) => {
    const v = voice.slice(-10);
    const avgBreathIrreg = v.length ? 1 - (v.reduce((a,b)=>a+b.breathingPattern.regularity,0)/v.length) : 0.3;
    const probability = Math.max(0, Math.min(1, avgBreathIrreg*0.8));
    const severity: HealthPrediction['severity'] = probability>0.7? 'high' : probability>0.4? 'medium' : 'low';
    const rationale = [`Breathing irregularity: ${(avgBreathIrreg*100).toFixed(0)}%`];
    return { condition: 'Respiratory strain', probability, severity, rationale };
  },
};

// ============================================================================
// REACT HOOK: END-TO-END WIRED EXPERIENCE
// ============================================================================

export function useVoiceHealth() {
  const engineRef = useRef<AdvancedVoiceAnalysisEngine | null>(null);
  const analyticsRef = useRef<PredictiveHealthAnalytics | null>(null);

  const [biomarker, setBiomarker] = useState<VoiceBiomarkers | null>(null);
  const [predictions, setPredictions] = useState<HealthPrediction[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [recording, setRecording] = useState(false);

  // lazy init
  useEffect(() => {
    if (!engineRef.current) engineRef.current = new AdvancedVoiceAnalysisEngine();
    if (!analyticsRef.current) {
      analyticsRef.current = new PredictiveHealthAnalytics();
      analyticsRef.current.updateRiskModel(BurnoutRiskModel);
      analyticsRef.current.updateRiskModel(RespiratoryStrainModel);
    }

    const engine = engineRef.current;
    if (!engine) return;
    engine.onAnalysisUpdate = (b) => {
      setBiomarker(b);
      analyticsRef.current!.addBiomarkers(b);
      setPredictions(analyticsRef.current!.getPredictions());
      setInsights(analyticsRef.current!.generateInsights());
    };
    return () => { engine.onAnalysisUpdate = undefined; };
  }, []);

  const start = async () => {
    const ok = await engineRef.current?.startAdvancedRecording();
    setRecording(!!ok);
    return ok;
  };
  const stop = () => { engineRef.current?.stopRecording(); setRecording(false); };

  return { recording, start, stop, biomarker, predictions, insights };
}

// ============================================================================
// SIMPLE UI COMPONENT (optional)
// ============================================================================

export function VoiceHealthWidget() {
  const { recording, start, stop, biomarker, predictions, insights } = useVoiceHealth();

  return (
    <div style={{border:'1px solid #e5e7eb', borderRadius:12, padding:16, fontFamily:'ui-sans-serif'}}>
      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:12}}>
        <button onClick={() => recording ? stop() : start()} style={{padding:'8px 12px', borderRadius:8}}>
          {recording ? 'Stop' : 'Start'} voice scan
        </button>
        <span style={{fontSize:12, opacity:.7}}>
          Demo only • Uses microphone locally • Not medical advice
        </span>
      </div>

      {biomarker && (
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:12, marginBottom:16}}>
          <Stat label="Stress" value={(biomarker.stressLevel*100).toFixed(0)+'%'} />
          <Stat label="Cognitive load" value={(biomarker.cognitiveLoad*100).toFixed(0)+'%'} />
          <Stat label="Fatigue" value={(biomarker.fatigueLevel*100).toFixed(0)+'%'} />
          <Stat label="Vocal health" value={biomarker.vocalHealthScore.toFixed(0)} />
          <Stat label="Clarity" value={(biomarker.speechClarity*100).toFixed(0)+'%'} />
          <Stat label="Pitch stability" value={(biomarker.pitchStability*100).toFixed(0)+'%'} />
          <Stat label="HRV est." value={biomarker.heartRateVariability.toFixed(0)+' ms'} />
          <Stat label="Emotion" value={`${biomarker.emotionalState.primary} ${(biomarker.emotionalState.confidence*100).toFixed(0)}%`} />
        </div>
      )}

      {!!predictions.length && (
        <div style={{marginTop:8}}>
          <h4 style={{margin:'8px 0'}}>Predictions</h4>
          {predictions.map(p => (
            <div key={p.id} style={{border:'1px solid #eee', borderRadius:8, padding:8, marginBottom:8}}>
              <strong>{p.condition}</strong> — {(p.probability*100).toFixed(0)}% ({p.severity})
              <div style={{fontSize:12, opacity:.8}}>Rationale: {p.riskFactors.join('; ')}</div>
            </div>
          ))}
        </div>
      )}

      {!!insights.length && (
        <div style={{marginTop:8}}>
          <h4 style={{margin:'8px 0'}}>Insights</h4>
          {insights.map(i => (
            <div key={i.id} style={{border:'1px solid #eee', borderRadius:8, padding:8, marginBottom:8}}>
              <strong>[{i.type}]</strong> {i.title}
              <div style={{fontSize:12, opacity:.85}}>{i.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }){
  return (
    <div style={{background:'#fafafa', border:'1px solid #eee', borderRadius:8, padding:8}}>
      <div style={{fontSize:12, opacity:.7}}>{label}</div>
      <div style={{fontWeight:600}}>{value}</div>
    </div>
  );
}

// ============================================================================
// END OF FILE
// ============================================================================
