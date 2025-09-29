// src/lib/triageEngine.ts
export type Lang = 'en' | 'ur';
export type QKind = 'open' | 'yesno' | 'scale' | 'multi';

export type Question = {
  id: string;
  kind: QKind;
  text: { en: string; ur: string };
  options?: { v: string; label: { en: string; ur: string }; score?: number; redflag?: string }[];
  weight?: number;
  tag?: string;
  scale?: { min: number; max: number };
};

export type RedFlag = { key: string; label: { en: string; ur: string } };

export const TRIAGE_UI = {
  critical: { label:{en:'Emergency',ur:'ایمرجنسی'}, color:'red', bg:'bg-red-50', pill:'bg-red-600', txt:'text-red-700' },
  urgent: { label:{en:'Urgent',ur:'فوری'}, color:'orange', bg:'bg-orange-50', pill:'bg-orange-500', txt:'text-orange-700' },
  semiUrgent: { label:{en:'Soon',ur:'جلد'}, color:'yellow', bg:'bg-yellow-50', pill:'bg-yellow-500', txt:'text-yellow-700' },
  standard: { label:{en:'Routine',ur:'معمول'}, color:'blue', bg:'bg-blue-50', pill:'bg-blue-600', txt:'text-blue-700' },
  nonUrgent: { label:{en:'Self-care',ur:'خود نگہداشت'}, color:'green', bg:'bg-emerald-50', pill:'bg-emerald-600', txt:'text-emerald-700' },
} as const;

const SYMPTOM_SYNONYMS: Record<string, string[]> = {
  chest_pain: ['chest pain','pressure in chest','tightness chest','angina','سینے میں درد','سینے میں دباؤ'],
  dyspnea: ['shortness of breath','breathless','difficulty breathing','سانس میں دشواری','سانس پھولنا'],
  fever: ['fever','high temperature','pyrexia','بخار'],
  headache: ['headache','migraine','head pain','سر درد'],
  bleeding: ['bleeding','blood loss','hemorrhage','خون بہنا'],
  confusion: ['confused','confusion','disoriented','drowsy','fainted','ہوش کھونا','الجھن'],
  vomiting: ['vomit','vomiting','emesis','throwing up','قے'],
  dizziness: ['dizzy','lightheaded','vertigo','چکر آنا'],
};

export const RED_FLAGS: Record<string, { key:string; label:{en:string;ur:string}; score:number; critical:boolean }> = {
  chest_pain: { key:'chest_pain', label:{en:'Chest pain/pressure', ur:'سینے کا درد/دباؤ'}, score:15, critical:true },
  dyspnea:    { key:'dyspnea',    label:{en:'Breathing difficulty', ur:'سانس میں دشواری'}, score:15, critical:true },
  bleeding:   { key:'bleeding',   label:{en:'Severe bleeding', ur:'شدید خون بہنا'}, score:15, critical:true },
  consciousness:{ key:'consciousness', label:{en:'Altered consciousness', ur:'ہوش میں تبدیلی'}, score:10, critical:true },
};

export const QUESTION_BANK: Question[] = [
  { id:'pain_scale', kind:'scale', text:{en:'On a scale of 1–10, how severe is your pain?', ur:'1–10 پر درد کی شدت؟'}, scale:{min:1,max:10} },
  { id:'dyspnea_yesno', kind:'yesno', text:{en:'Are you having difficulty breathing?', ur:'کیا سانس میں مشکل ہے؟'}, weight:15, tag:'dyspnea' },
  { id:'chest_pain_yesno', kind:'yesno', text:{en:'Any chest pain or pressure?', ur:'سینے میں درد یا دباؤ؟'}, weight:15, tag:'chest_pain' },
  { id:'bleeding_grade', kind:'multi', text:{en:'Any bleeding?', ur:'کیا خون بہہ رہا ہے؟'}, tag:'bleeding',
    options:[
      { v:'none', label:{en:'No bleeding', ur:'نہیں'}, score:0 },
      { v:'minor', label:{en:'Minor', ur:'معمولی'}, score:2 },
      { v:'moderate', label:{en:'Moderate', ur:'درمیانہ'}, score:6 },
      { v:'severe', label:{en:'Severe / uncontrolled', ur:'شدید'}, score:15, redflag:'bleeding' },
    ]},
  { id:'fever_grade', kind:'multi', text:{en:'Do you have fever?', ur:'کیا بخار ہے؟'},
    options:[
      { v:'none', label:{en:'No', ur:'نہیں'}, score:0 },
      { v:'low', label:{en:'Low-grade', ur:'ہلکا'}, score:2 },
      { v:'high', label:{en:'High (>101°F)', ur:'زیادہ (101°F+)'}, score:6 },
    ]},
  { id:'onset', kind:'multi', text:{en:'When did it start?', ur:'یہ کب شروع ہوا؟'},
    options:[
      { v:'minutes', label:{en:'Minutes ago', ur:'منٹ پہلے'}, score:10 },
      { v:'hours', label:{en:'Hours ago', ur:'گھنٹے پہلے'}, score:8 },
      { v:'today', label:{en:'Today', ur:'آج'}, score:6 },
      { v:'days', label:{en:'Few days', ur:'کچھ دن'}, score:2 },
      { v:'weeks', label:{en:'Weeks', ur:'ہفتے'}, score:1 },
    ]},
  { id:'age', kind:'multi', text:{en:'Your age group?', ur:'عمر کا گروپ؟'},
    options:[
      { v:'under_18', label:{en:'Under 18', ur:'18 سے کم'}, score:2 },
      { v:'18_65', label:{en:'18–65', ur:'18–65'}, score:0 },
      { v:'over_65', label:{en:'Over 65', ur:'65 سے زائد'}, score:3 },
      { v:'over_80', label:{en:'Over 80', ur:'80 سے زائد'}, score:5 },
    ]},
];

// --- Tiny in-browser “NLP” ---
export function extractSignals(text: string): string[] {
  const found = new Set<string>();
  const t = (text || '').toLowerCase();
  for (const [key, syns] of Object.entries(SYMPTOM_SYNONYMS)) {
    if (syns.some(s => t.includes(s))) found.add(key);
  }
  return Array.from(found);
}

export function nextQuestion(state:{ answers:Record<string,any>; signals:string[] }): Question | null {
  const asked = new Set(Object.keys(state.answers||{}));
  const sigs = new Set(state.signals||[]);
  const ranked: { q:Question; p:number }[] = [];

  QUESTION_BANK.forEach(q => {
    if (asked.has(q.id)) return;
    let p = 0;
    if (q.tag && sigs.has(q.tag)) p += 10;
    if (q.id === 'pain_scale') p += 5;
    if (q.id === 'onset') p += 4;
    if (q.kind === 'yesno') p += 2;
    if (q.kind === 'multi') p += 1;
    ranked.push({ q, p });
  });

  ranked.sort((a,b) => b.p - a.p);
  return ranked[0]?.q || null;
}

export function computeTriage(state:{ answers:Record<string,any>; signals:string[] }) {
  const thresholds = { critical:25, urgent:15, semi:8, standard:3 };
  let score = 0;
  let criticalFlags = 0;
  let flags: Record<string, RedFlag> = {};

  // score from answers
  for (const [qid, v] of Object.entries(state.answers||{})) {
    const q = QUESTION_BANK.find(x => x.id === qid);
    if (!q) continue;

    if (q.kind === 'scale') {
      const n = Number(v);
      if (n >= 8) { score += 15; criticalFlags++; }
      else if (n >= 6) score += 8;
      else score += n * 0.5;
    }
    if (q.kind === 'yesno') {
      if (v === 'yes') { score += q.weight || 0; if (q.tag && RED_FLAGS[q.tag]) { criticalFlags++; flags[q.tag] = RED_FLAGS[q.tag]; } }
    }
    if (q.kind === 'multi') {
      const opt = q.options?.find(o => o.v === v);
      if (opt) {
        score += opt.score || 0;
        if (opt.redflag && RED_FLAGS[opt.redflag]) { criticalFlags++; flags[opt.redflag] = RED_FLAGS[opt.redflag]; }
      }
    }
  }

  // from detected signals
  (state.signals||[]).forEach(sig => {
    if (RED_FLAGS[sig]) { score += RED_FLAGS[sig].score; criticalFlags++; flags[sig] = RED_FLAGS[sig]; }
    else score += 2;
  });

  // level
  let level: keyof typeof TRIAGE_UI = 'nonUrgent';
  if (criticalFlags > 0 || score >= thresholds.critical) level = 'critical';
  else if (score >= thresholds.urgent) level = 'urgent';
  else if (score >= thresholds.semi) level = 'semiUrgent';
  else if (score >= thresholds.standard) level = 'standard';

  const riskPct = Math.max(0, Math.min(100, Math.round(
    (score/35)*80 + (level==='critical'?20:level==='urgent'?12:level==='semiUrgent'?8:level==='standard'?5:2)
  )));
  const answered = Object.keys(state.answers||{}).length;
  const completion = Math.min(1, answered / 6);
  const margin = level==='critical' ? score-25 :
                 level==='urgent' ? score-15 :
                 level==='semiUrgent' ? score-8 :
                 level==='standard' ? score-3 : 3-score;
  const confidence = Math.max(0, Math.min(100, Math.round(50 + completion*30 + margin*4 - (level==='critical'?5:0))));

  return { level, score:Math.round(score), riskPct, confidence, redFlags: Object.values(flags) };
}
