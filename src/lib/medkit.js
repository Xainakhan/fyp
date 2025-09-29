// src/lib/medkit.js
export const URDU_DIGITS = { "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9" };
export const normalizeUrduDigits = s => s.replace(/[۰-۹]/g, d => URDU_DIGITS[d] ?? d);
export const isUrduText = (txt="") => /[\u0600-\u06FF]/.test(txt);
export const norm = (s="") => normalizeUrduDigits(s).toLowerCase().replace(/\s+/g, " ").trim();

export function buildSymptomIndex(db) {
  const idx = new Map(); // phrase -> symptomKey
  const push = (phrase, key) => {
    const p = norm(phrase);
    if (!p) return;
    if (!idx.has(p)) idx.set(p, key);
  };

  Object.entries(db.symptoms).forEach(([key, obj]) => {
    push(obj.labels.en, key);
    push(obj.labels.ur, key);
    (obj.synonyms.en || []).forEach(s => push(s, key));
    (obj.synonyms.ur || []).forEach(s => push(s, key));
  });

  return idx;
}

/** Greedy phrase matching by includes(); for production you can upgrade to regex/word-boundary/fuzzy */
export function findSymptomsInText(text, db, idx) {
  const t = norm(text);
  const found = new Set();
  // quick pass: exact phrase hits
  for (const [phrase, key] of idx.entries()) {
    if (t.includes(phrase)) found.add(key);
  }
  return Array.from(found);
}

export function scoreConditions(symptomKeys, db, days = 0) {
  const scores = [];
  const present = new Set(symptomKeys);

  Object.entries(db.conditions).forEach(([condKey, cond]) => {
    let score = 0;
    cond.rules.forEach(r => {
      if (present.has(r.symptom)) score += (r.weight || 1);
    });
    if (score > 0) {
      // add a very light time factor
      const sev = (cond.severity_base || 3) + (days > 7 ? 1 : 0);
      scores.push({ key: condKey, score, severity: Math.min(10, sev) });
    }
  });

  scores.sort((a,b) => b.score - a.score || b.severity - a.severity);
  return scores;
}

export const YES_EN = ["yes","yeah","yep","okay","ok","sure","absolutely","definitely"];
export const NO_EN  = ["no","nope","not really","none","nothing","never"];
export const YES_UR = ["ہاں", "جی", "جی ہاں", "بالکل"];
export const NO_UR  = ["نہیں","جی نہیں","ہرگز نہیں","کوئی نہیں"];

export function processInputBilingual(input) {
  const raw = input.trim();
  const ur = isUrduText(raw);
  const lower = norm(raw);

  if (!ur) {
    if (YES_EN.some(w => lower.includes(w))) return { lang: "en", token: "yes" };
    if (NO_EN.some(w => lower.includes(w)))  return { lang: "en", token: "no"  };
  } else {
    if (YES_UR.some(w => raw.includes(w))) return { lang: "ur", token: "yes" };
    if (NO_UR.some(w => raw.includes(w)))  return { lang: "ur", token: "no"  };
  }

  const numberMatch = normalizeUrduDigits(raw).match(/\d+/);
  if (numberMatch) return { lang: ur ? "ur" : "en", token: numberMatch[0] };

  return { lang: ur ? "ur" : "en", token: raw };
}
