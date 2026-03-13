const { useState, useRef, useEffect, useCallback } = React;
const C = { bg: "#ffffff", card: "#fff", alt: "#f0f7ff", tx: "#000000", tx2: "#1a1a1a", tx3: "#444444", sep: "#c6c6c8", sepL: "#e5e5ea", blue: "#007aff", red: "#ff3b30", org: "#ff9500", grn: "#34c759", pur: "#af52de", pk: "#ff2d55", teal: "#5ac8fa", ind: "#5856d6", yel: "#ffcc00", font: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif" };
const MED_TIME_COLORS = { "06:00": { bg: "#FFD6E0", bgL: "#FFF0F4", label: "Pink", hex: "#E91E6C" }, "07:00": { bg: "#FFE0CC", bgL: "#FFF4EB", label: "Peach", hex: "#E8751A" }, "08:00": { bg: "#FFF5CC", bgL: "#FFFBE6", label: "Yellow", hex: "#C49B00" }, "09:00": { bg: "#E0F5D0", bgL: "#F2FAEA", label: "Lime", hex: "#4CAF50" }, "10:00": { bg: "#D0F0E8", bgL: "#E8F8F4", label: "Mint", hex: "#00897B" }, "12:00": { bg: "#CCE5FF", bgL: "#E6F2FF", label: "Sky Blue", hex: "#1976D2" }, "14:00": { bg: "#E0D6FF", bgL: "#F0EBFF", label: "Lavender", hex: "#7C4DFF" }, "16:00": { bg: "#D6F5F5", bgL: "#E8FAFA", label: "Teal", hex: "#00ACC1" }, "17:00": { bg: "#FFE0F0", bgL: "#FFF0F8", label: "Rose", hex: "#D81B60" }, "18:00": { bg: "#F5E6CC", bgL: "#FAF2E6", label: "Tan", hex: "#A1887F" }, "20:00": { bg: "#D0D8FF", bgL: "#E6EBFF", label: "Periwinkle", hex: "#3F51B5" }, "21:00": { bg: "#E8D5F5", bgL: "#F4EAFA", label: "Orchid", hex: "#9C27B0" }, "22:00": { bg: "#D6D6E8", bgL: "#EBEBF4", label: "Slate", hex: "#546E7A" } };
const getMTC = (t) => {
  if (!t) return null;
  const k = t.length <= 2 ? t.padStart(2, "0") + ":00" : t;
  return MED_TIME_COLORS[k] || (() => {
    const h = parseInt(t);
    for (const [key, val] of Object.entries(MED_TIME_COLORS)) {
      if (parseInt(key) === h) return val;
    }
    return { bg: "#E8E8E8", bgL: "#F4F4F4", label: "Gray", hex: "#757575" };
  })();
};
const PillVisual = ({ pill, size = 60 }) => {
  const container = { width: size, height: size, borderRadius: size / 5, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f0f0" };
  if (!pill) return /* @__PURE__ */ React.createElement("div", { style: container }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: size * 0.25, color: "#999" } }, "Rx"));
  if (pill.img) return /* @__PURE__ */ React.createElement("div", { style: container }, /* @__PURE__ */ React.createElement("img", { src: pill.img, alt: "", style: { width: "100%", height: "100%", objectFit: "contain" }, onError: (e) => {
    e.target.parentElement.innerHTML = "<span style='font-size:" + size * 0.25 + "px;color:#999'>Rx</span>";
  } }));
  const s = pill.shape || "round";
  const clr = pill.color || "#E0E0E0";
  const imp = pill.imprint || "";
  const w = size;
  const h = s === "capsule" ? size * 0.45 : s === "oval" ? size * 0.55 : size * 0.85;
  const rx = s === "capsule" ? h / 2 : s === "oval" ? h / 2.5 : s === "diamond" ? 4 : s === "rectangle" ? size * 0.12 : size / 2;
  return /* @__PURE__ */ React.createElement("div", { style: { ...container, background: "transparent" } }, /* @__PURE__ */ React.createElement("svg", { width: w, height: h, viewBox: "0 0 " + w + " " + h }, s === "diamond" ? /* @__PURE__ */ React.createElement("polygon", { points: w / 2 + ",2 " + (w - 2) + "," + h / 2 + " " + w / 2 + "," + (h - 2) + " 2," + h / 2, fill: clr, stroke: "#00000015", strokeWidth: 1 }) : s === "triangle" ? /* @__PURE__ */ React.createElement("polygon", { points: w / 2 + ",2 " + (w - 2) + "," + (h - 2) + " 2," + (h - 2), fill: clr, stroke: "#00000015", strokeWidth: 1 }) : /* @__PURE__ */ React.createElement("rect", { x: 1, y: 1, width: w - 2, height: h - 2, rx, fill: clr, stroke: "#00000015", strokeWidth: 1 }), pill.scored && /* @__PURE__ */ React.createElement("line", { x1: w * 0.2, y1: h / 2, x2: w * 0.8, y2: h / 2, stroke: "#00000020", strokeWidth: 1.5 }), imp && /* @__PURE__ */ React.createElement("text", { x: w / 2, y: h / 2, textAnchor: "middle", dominantBaseline: "central", fontSize: Math.min(size * 0.18, 11), fontWeight: 700, fill: "#00000050", fontFamily: "Arial" }, imp.slice(0, 8))));
};
const MED_AI = {
  gabapentin: { gen: "Gabapentin", reason: "Nerve pain, seizures", sides: ["Drowsiness", "Dizziness", "Fatigue", "Nausea", "Blurred vision", "Weight gain", "Swelling"], warns: [], pill: { shape: "capsule", color: "#FFD700", imprint: "G 300", size: "12mm", scored: false, desc: "Yellow capsule" } },
  quetiapine: { gen: "Quetiapine (Seroquel)", reason: "Antipsychotic", sides: ["Drowsiness", "Weight gain", "Dry mouth", "Dizziness", "Constipation", "Increased appetite"], warns: [], pill: { shape: "round", color: "#FFFFFF", imprint: "SEROQUEL 25", size: "8mm", scored: true, desc: "White round tablet" } },
  lisinopril: { gen: "Lisinopril", reason: "Blood pressure", sides: ["Dry cough", "Dizziness", "Headache", "Fatigue", "Nausea", "Hyperkalemia"], warns: [], pill: { shape: "round", color: "#FFB6C1", imprint: "L 10", size: "7mm", scored: false, desc: "Pink round tablet" } },
  metformin: { gen: "Metformin", reason: "Type 2 diabetes", sides: ["Nausea", "Diarrhea", "Stomach pain", "Metallic taste", "Loss of appetite", "Lactic acidosis (rare)"], warns: [], pill: { shape: "oval", color: "#FFFFFF", imprint: "MET 500", size: "14mm", scored: true, desc: "White oval tablet" } },
  clozapine: { gen: "Clozapine (Clozaril)", reason: "Treatment-resistant schizophrenia", sides: ["Sedation", "Weight gain", "Drooling", "Constipation", "Tachycardia", "Dizziness", "Seizure risk"], warns: ["Requires weekly blood monitoring (ANC)"], pill: { shape: "round", color: "#FFFACD", imprint: "CLOZ 100", size: "9mm", scored: true, desc: "Pale yellow scored tablet" } }
};
function aiMed(name) {
  const k = name.toLowerCase().replace(/[^a-z]/g, "");
  for (const [n, v] of Object.entries(MED_AI)) {
    if (k.includes(n) || n.includes(k)) return v;
  }
  return { gen: name, reason: "Consult physician.", sides: ["See pharmacist"], warns: ["Review interactions"], pill: { shape: "round", color: "#E0E0E0", imprint: name.slice(0, 8).toUpperCase(), size: "10mm", scored: false, desc: "Tablet - verify with pharmacy" } };
}
function staffInit(name) {
  const p = name.split(/[\s,]+/).filter(Boolean);
  if (p.length >= 2 && name.includes(",")) return p[1] + " " + p[0][0] + ".";
  if (p.length >= 2) return p[0] + " " + p[p.length - 1][0] + ".";
  return p[0] || "??";
}
function pureInit(name) {
  const p = name.split(/[\s,]+/).filter(Boolean);
  if (p.length >= 2 && name.includes(",")) return (p[1][0] + p[0][0]).toUpperCase();
  if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  return (p[0] || "??").slice(0, 2).toUpperCase();
}
function getAge(dob) {
  if (!dob) return "?";
  const b = /* @__PURE__ */ new Date(dob + "T12:00:00");
  const now = /* @__PURE__ */ new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || m === 0 && now.getDate() < b.getDate()) age--;
  return age;
}
function analyzeDoc(text) {
  if (!text || text.length < 5) return { issues: [], sug: [], score: 0, ok: false, ck: {}, spellFlags: [], cmdFlags: [], biasFlags: [], replSug: [] };
  const lc = text.toLowerCase();
  const issues = [], cmdFlags = [], biasFlags = [], spellFlags = [], replSug = [];
  const _bn = [
    [/\bhad a good day\b/gi, "'had a good day' \u2014 subjective. Describe specific activities."],
    [/\bhad a bad day\b/gi, "'had a bad day' \u2014 subjective. Document events factually."],
    [/\bwas rude\b/gi, "'Was rude' is subjective. Describe exact words/actions."],
    [/\bhad a poor attitude\b/gi, "'Poor attitude' is biased. Document specific behaviors."],
    [/\bnot allowed to\b/gi, "'Not allowed to' implies command. Use 'was reminded that...'"],
    [/\bdid(n'?t| not) listen to me\b/gi, "'Didn't listen' is subjective. Describe non-compliance factually."],
    [/\bi told (client|resident|individual|him|her|them)\b/gi, "'I told' is a command. Use 'Staff reminded/advised/informed'."],
    [/\bgood mood\b/gi, "'Good mood' is interpretive. Describe observable behaviors."]
  ];
  _bn.forEach(([rx, msg]) => {
    const m = text.match(rx);
    if (m) biasFlags.push({ match: m[0], msg });
  });
  const cmdTerms = [
    { rx: /\btold\b/gi, word: "told", sug: "reminded, advised, informed" },
    { rx: /\bordered\b/gi, word: "ordered", sug: "directed, guided, suggested" },
    { rx: /\bdemanded\b/gi, word: "demanded", sug: "urged, encouraged, prompted" },
    { rx: /\bcommand(ed)?\b/gi, word: "command", sug: "directed, guided, instructed" },
    { rx: /\bprohibit(ed)?\b/gi, word: "prohibit", sug: "advised against, informed about guidelines" },
    { rx: /\bdeny\b|\bdenied\b/gi, word: "deny/denied", sug: "informed, explained, clarified" },
    { rx: /\bforced\b/gi, word: "forced", sug: "assisted, encouraged, prompted" }
  ];
  const cmdContext = [
    { rx: /\b(told|made|had)\s+(him|her|them|the client|the resident|the individual)\b/gi, word: "$1", sug: "advised, reminded, prompted, encouraged" }
  ];
  cmdTerms.forEach((ct) => {
    const m = text.match(ct.rx);
    if (m) cmdFlags.push({ match: m[0], word: ct.word, sug: ct.sug });
  });
  cmdContext.forEach((ct) => {
    const m = text.match(ct.rx);
    if (m) cmdFlags.push({ match: m[0], word: m[1], sug: ct.sug });
  });
  const _sp = "recieved:received,occured:occurred,occurence:occurrence,seperate:separate,definately:definitely,accomodate:accommodate,agressive:aggressive,aggresive:aggressive,behavoir:behavior,behavor:behavior,behaviur:behaviour,behaviior:behavior,medicaton:medication,medicaion:medication,mediction:medication,adminstered:administered,adminsitered:administered,adminstred:administered,complient:compliant,independant:independent,independnet:independent,immediatly:immediately,immedietly:immediately,imediately:immediately,occassionally:occasionally,occasionaly:occasionally,refridgerator:refrigerator,refigerator:refrigerator,restraunt:restaurant,resturant:restaurant,tomarrow:tomorrow,tommorow:tomorrow,tommorrow:tomorrow,untill:until,wich:which,wiht:with,thier:their,teh:the,adn:and,becuase:because,enviroment:environment,enviornment:environment,hygene:hygiene,hygeine:hygiene,aproved:approved,complience:compliance,documention:documentation,documenation:documentation,residental:residential,ambulence:ambulance,excercise:exercise,exersize:exercise,concious:conscious,consious:conscious,maintainence:maintenance,neccessary:necessary,necesary:necessary,neccesary:necessary,perscription:prescription,presciption:prescription";
  const misspellings = {};
  _sp.split(",").forEach((p) => {
    const [k, v] = p.split(":");
    misspellings[k] = v;
  });
  const words = text.split(/\s+/);
  words.forEach((w) => {
    const clean = w.replace(/[^a-zA-Z'-]/g, "").toLowerCase();
    if (clean.length > 2 && misspellings[clean]) {
      spellFlags.push({ word: w, fix: misspellings[clean] });
    }
  });
  const ck = {
    who: /(?:Kenyon|Wagoner|Dan|Michael|individual|client|he |she |resident|peer|housemate)/i.test(text),
    what: text.split(/[.!?]/).filter(function(s) {
      return s.trim().length > 10;
    }).length >= 2,
    when: /\d{1,2}:\d{2}|morning|afternoon|evening|during|at\s+(lunch|dinner|breakfast)|after\s+(program|dinner|lunch|breakfast)/i.test(text),
    where: /room|bathroom|hospital|home|program|bed|hallway|outside|dining|shower|rehab|facility|kitchen|living|community|outing|table/i.test(text),
    response: /staff|redirect|notif|assist|monitor|action|call|intervene|offered|reminded|advised|informed|prompted|guided|encouraged|counseled/i.test(text),
    followUp: /continue|follow.?up|plan|scheduled|reassess|ongoing|will|outcome|result|resolved|calm|settled|complied/i.test(text),
    factual: biasFlags.length === 0 && cmdFlags.length === 0
  };
  if (text.length < 41) issues.push({ msg: "Too brief. A fourth party must understand step-by-step what transpired. Include WHO, WHAT, WHEN, WHERE, RESPONSE, FOLLOW-UP.", sev: "error" });
  cmdFlags.forEach((cf) => replSug.push({ type: "cmd", match: cf.match, msg: "Replace '" + cf.match + "' with: " + cf.sug }));
  biasFlags.forEach((bf) => replSug.push({ type: "bias", match: bf.match, msg: bf.msg }));
  spellFlags.forEach((sf) => replSug.push({ type: "spell", match: sf.word, msg: "Spelling: '" + sf.word + "' \u2192 '" + sf.fix + "'" }));
  const sug = [];
  if (!ck.who) sug.push("WHO (identify client/individual)");
  if (!ck.what) sug.push("WHAT (2+ descriptive sentences)");
  if (!ck.when) sug.push("WHEN (time/period)");
  if (!ck.where) sug.push("WHERE (location)");
  if (!ck.response) sug.push("STAFF RESPONSE");
  if (!ck.followUp) sug.push("OUTCOME/FOLLOW-UP");
  const structScore = Object.values(ck).filter(Boolean).length / 7 * 100;
  const penaltyPer = 8;
  const score = Math.max(0, Math.round(structScore - biasFlags.length * penaltyPer - cmdFlags.length * penaltyPer - spellFlags.length * 2));
  const ok = issues.length === 0 && biasFlags.length === 0 && cmdFlags.length === 0 && score >= 70;
  return { issues, sug, score, ok, ck, spellFlags, cmdFlags, biasFlags, replSug };
}
function parseABC(text, behTypes, location, time) {
  if (!text || text.length < 10) return { a: "", b: "", c: "", conf: 0 };
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 6);
  let ant = "";
  const antRx = [
    /(?:antecedent|prior to|before the|leading up to|preceding)[:\s]*([^.!?]+)/i,
    /(?:when|while|after|during|as)\s+(?:staff|he|she|they|client|individual|peer|resident)\s+(?:was|were|asked|told|reminded|prompted|tried|attempted|began|started|entered|left|refused|denied)[^.!?]*/i,
    /(?:was asked to|was prompted to|was reminded to|was directed to)[^.!?]*/i,
    /(?:during\s+(?:transition|morning|ADL|hygiene|mealtime|breakfast|lunch|dinner|snack|medication|med pass|program|activity|outing|bath|shower|toileting|bedtime))[^.!?]*/i,
    /(?:denied access|couldn'?t|could not|unable to|wanted|requesting|asked for|after being|after staff|demand was placed|new staff)[^.!?]*/i
  ];
  for (const rx of antRx) {
    const m = text.match(rx);
    if (m) {
      ant = m[m.length > 1 && m[1] ? 1 : 0].trim();
      break;
    }
  }
  if (!ant && sentences.length >= 2) ant = sentences[0];
  let beh = "";
  const behRx = [
    /(?:client|individual|he|she|they|resident)\s+(?:began|started|engaged in|exhibited|displayed|showed|demonstrated|attempted to|proceeded to|escalated to)\s+([^.!?]+)/i,
    /(?:hit|kicked|punched|scratched|pushed|threw|bit|slapped|grabbed|pulled|spit at|banged|head.?banged|eloped|ran|fled|screamed|yelled|cursed|threatened|broke|destroyed|flipped|tore|ripped|refused|stripped|smeared|pinched|choked|stomped|paced|rocked|flopped|dropped to)[^.!?]*/i,
    /(?:physical aggress|verbal aggress|self.?injur|elopement|property destruct|non.?compliance|disruptive|intrusive|inappropriate|socially disruptive)[^.!?]*/i,
    /(?:kicking doors|throwing.?self|jumping|banging head|invad.+personal space|fixat.+on staff|stealing food|assaulted|attacking|lunging|charging|swinging|biting self)[^.!?]*/i
  ];
  for (const rx of behRx) {
    const m = text.match(rx);
    if (m) {
      beh = m[m.length > 1 && m[1] ? 1 : 0].trim();
      break;
    }
  }
  if (!beh && behTypes && behTypes.length) beh = behTypes.join(", ") + (sentences.length >= 2 ? ": " + sentences[Math.min(1, sentences.length - 1)] : "");
  let con = "";
  const conRx = [
    /(?:consequence|staff response|intervention|in response)[:\s]*([^.!?]+)/i,
    /(?:staff\s+(?:redirected|prompted|reminded|intervened|assisted|offered|provided|removed|separated|escorted|implemented|de-escalated|calmed|counseled|encouraged))[^.!?]*/i,
    /(?:was redirected|was prompted|verbal redirection|de-escalation|BIP|behavior intervention|PRN was|given PRN|contacted|notified)[^.!?]*/i,
    /(?:client\s+(?:calmed|settled|complied|returned|stopped|eventually|subsided|resumed|relaxed|fell asleep|walked away))[^.!?]*/i,
    /(?:resolved|incident ended|no further|continued to monitor)[^.!?]*/i
  ];
  for (const rx of conRx) {
    const m = text.match(rx);
    if (m) {
      con = m[m.length > 1 && m[1] ? 1 : 0].trim();
      break;
    }
  }
  if (!con && sentences.length >= 2) con = sentences[sentences.length - 1];
  const conf = (ant ? 33 : 0) + (beh ? 34 : 0) + (con ? 33 : 0);
  if (location && ant && !ant.toLowerCase().includes(location.toLowerCase())) ant += " (" + location + ")";
  return { a: ant, b: beh, c: con, conf, parsed: true };
}
const Ic = ({ n, s = 20, c = "currentColor" }) => {
  const d = { home: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" }), /* @__PURE__ */ React.createElement("polyline", { points: "9 22 9 12 15 12 15 22" })), users: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" }), /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "7", r: "4" }), /* @__PURE__ */ React.createElement("path", { d: "M23 21v-2a4 4 0 00-3-3.87" })), clip: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" }), /* @__PURE__ */ React.createElement("rect", { x: "8", y: "2", width: "8", height: "4", rx: "1" })), chart: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("line", { x1: "18", y1: "20", x2: "18", y2: "10" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "20", x2: "12", y2: "4" }), /* @__PURE__ */ React.createElement("line", { x1: "6", y1: "20", x2: "6", y2: "14" })), person: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "7", r: "4" })), lock: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M7 11V7a5 5 0 0110 0v4" })), plus: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), /* @__PURE__ */ React.createElement("line", { x1: "5", y1: "12", x2: "19", y2: "12" })), chev: /* @__PURE__ */ React.createElement("polyline", { points: "9 18 15 12 9 6" }), back: /* @__PURE__ */ React.createElement("polyline", { points: "15 18 9 12 15 6" }), out: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" }), /* @__PURE__ */ React.createElement("polyline", { points: "16 17 21 12 16 7" }), /* @__PURE__ */ React.createElement("line", { x1: "21", y1: "12", x2: "9", y2: "12" })), shield: /* @__PURE__ */ React.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }), x: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), /* @__PURE__ */ React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })), doc: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" }), /* @__PURE__ */ React.createElement("polyline", { points: "14 2 14 8 20 8" })), check: /* @__PURE__ */ React.createElement("polyline", { points: "20 6 9 17 4 12" }), memo: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" })), bot: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "8", width: "16", height: "11", rx: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "13.5", r: "1.5" }), /* @__PURE__ */ React.createElement("circle", { cx: "15", cy: "13.5", r: "1.5" }), /* @__PURE__ */ React.createElement("path", { d: "M12 2v4M8 8V6a4 4 0 018 0v2" })), alert: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "9", x2: "12", y2: "13" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })), print: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("polyline", { points: "6 9 6 2 18 2 18 9" }), /* @__PURE__ */ React.createElement("path", { d: "M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" }), /* @__PURE__ */ React.createElement("rect", { x: "6", y: "14", width: "12", height: "8" })) };
  return /* @__PURE__ */ React.createElement("svg", { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }, d[n]);
};
const Card = ({ children, style, onClick }) => /* @__PURE__ */ React.createElement("div", { onClick, style: { background: C.card, borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,.06), 0 0 1px rgba(0,0,0,.04)", overflow: "hidden", ...style } }, children);
const Row = ({ left, title, sub, right, onClick, last, wrap }) => /* @__PURE__ */ React.createElement("div", { onClick, style: { display: "flex", alignItems: wrap ? "flex-start" : "center", gap: 10, padding: "10px 14px", borderBottom: last ? "none" : "0.5px solid " + C.sepL, cursor: onClick ? "pointer" : "default" } }, left && /* @__PURE__ */ React.createElement("div", { style: { flexShrink: 0 } }, left), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, color: C.tx, ...wrap ? {} : { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } } }, title), sub && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3, marginTop: 1, ...wrap ? { lineHeight: 1.4 } : { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } } }, sub)), right && /* @__PURE__ */ React.createElement("div", { style: { flexShrink: 0, display: "flex", alignItems: "center", gap: 5 } }, right), onClick && /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 14, c: C.tx3 }));
const Btn = ({ children, onClick, v = "filled", color = C.blue, sm, disabled, full, style: sx }) => /* @__PURE__ */ React.createElement("button", { disabled, onClick, style: { padding: sm ? "5px 10px" : "10px 18px", borderRadius: sm ? 8 : 12, border: v === "filled" ? "none" : "1.5px solid " + color, background: v === "filled" ? disabled ? C.tx3 : "linear-gradient(180deg, " + color + ", " + color + "dd)" : "transparent", color: v === "filled" ? "#fff" : color, fontSize: sm ? 11 : 15, fontWeight: 600, fontFamily: C.font, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1, width: full ? "100%" : void 0, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4, boxShadow: v === "filled" && !disabled ? "0 2px 8px " + color + "30" : "none", ...sx } }, children);
const Badge = ({ n, cl = C.red }) => n > 0 ? /* @__PURE__ */ React.createElement("span", { style: { background: cl, color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 10, padding: "2px 7px" } }, n) : null;
const Seg = ({ opts, val, set }) => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", background: "rgba(118,118,128,.12)", borderRadius: 9, padding: 2 } }, opts.map((o) => /* @__PURE__ */ React.createElement("button", { key: o.v, onClick: () => set(o.v), style: { flex: 1, padding: "6px 6px", borderRadius: 7, border: "none", background: val === o.v ? C.card : "transparent", color: val === o.v ? C.tx : C.tx3, fontSize: 11, fontWeight: val === o.v ? 600 : 500, fontFamily: C.font, cursor: "pointer", boxShadow: val === o.v ? "0 1px 3px rgba(0,0,0,.08)" : "none" } }, o.l)));
const Hdr = ({ title, left, right }) => /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", display: "flex", alignItems: "center", background: "linear-gradient(180deg, rgba(240,245,255,.95), rgba(242,242,247,.92))", backdropFilter: "blur(20px)", borderBottom: "0.5px solid " + C.sep, position: "sticky", top: 0, zIndex: 50 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 80 } }, left), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 17, fontWeight: 600, color: C.tx, textAlign: "center" } }, title), /* @__PURE__ */ React.createElement("div", { style: { width: 80, display: "flex", justifyContent: "flex-end" } }, right));
const Sec = ({ title, right }) => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 14px 6px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: C.tx3, textTransform: "uppercase", letterSpacing: ".4px" } }, title), right);
const resInit = (name) => {
  const p = name.split(/[\s,]+/).filter(Boolean);
  if (p.length >= 2 && name.includes(",")) return (p[1][0] + p[0][0]).toUpperCase();
  return p.map((w) => w[0]).join("").slice(0, 2).toUpperCase();
};
const fullName = (name) => {
  const p = name.split(/[\s,]+/).filter(Boolean);
  if (p.length >= 2 && name.includes(",")) return p.slice(1).join(" ") + " " + p[0];
  return p.join(" ");
};
const Av = ({ name, s = 40, cl = C.blue }) => {
  return /* @__PURE__ */ React.createElement("div", { style: { width: s, height: s, borderRadius: s / 2, background: "linear-gradient(135deg, " + cl + "18, " + cl + "28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: s * 0.36, fontWeight: 600, color: cl, flexShrink: 0, letterSpacing: 0.5, boxShadow: "0 1px 3px " + cl + "20" } }, resInit(name));
};
const Modal = ({ title, onClose, children, wide }) => /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1e3 }, onClick: onClose }, /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: { background: C.bg, borderRadius: "18px 18px 0 0", width: "100%", maxWidth: wide ? 600 : 480, maxHeight: "90vh", display: "flex", flexDirection: "column", animation: "su .3s ease" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 14px", borderBottom: "0.5px solid " + C.sep, flexShrink: 0, background: "linear-gradient(180deg, #fff, #f8f9ff)" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 17, fontWeight: 600 } }, title), /* @__PURE__ */ React.createElement("button", { onClick: onClose, style: { background: "rgba(118,118,128,.12)", border: "none", borderRadius: 14, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Ic, { n: "x", s: 14, c: C.tx3 }))), /* @__PURE__ */ React.createElement("div", { style: { overflowY: "auto", flex: 1, paddingBottom: 24 } }, children)));
const Inp = ({ label, value, onChange, ph, opts, multi, type = "text", disabled }) => /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 9 } }, label && /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 3 } }, label), opts ? /* @__PURE__ */ React.createElement("select", { value, onChange: (e) => onChange(e.target.value), disabled, style: { width: "100%", padding: "9px 11px", borderRadius: 10, border: "1px solid " + C.sepL, background: C.card, fontSize: 15, fontFamily: C.font, color: C.tx, boxSizing: "border-box" } }, opts.map((o) => /* @__PURE__ */ React.createElement("option", { key: o }, o))) : multi ? /* @__PURE__ */ React.createElement("textarea", { value, onChange: (e) => onChange(e.target.value), placeholder: ph, rows: 3, style: { width: "100%", padding: "9px 11px", borderRadius: 10, border: "1px solid " + C.sepL, background: C.card, fontSize: 15, fontFamily: C.font, color: C.tx, resize: "vertical", boxSizing: "border-box" } }) : /* @__PURE__ */ React.createElement("input", { type, value, onChange: (e) => onChange(e.target.value), placeholder: ph, disabled, style: { width: "100%", padding: "9px 11px", borderRadius: 10, border: "1px solid " + C.sepL, background: C.card, fontSize: 15, fontFamily: C.font, color: C.tx, boxSizing: "border-box" } }));
const Pill = ({ text, cl = C.blue }) => /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, padding: "2px 7px", borderRadius: 6, background: cl + "12", color: cl, fontWeight: 600, display: "inline-block", border: "0.5px solid " + cl + "25" } }, text);
const SL = ({ status }) => {
  const c = { active: C.grn, hold: C.yel, homeVisit: C.pur, dcd: C.red };
  const l = { active: "Active", hold: "Hold", homeVisit: "Home Visit", dcd: "DC" };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, background: (c[status] || C.tx3) + "12", border: "1.5px solid " + (c[status] || C.tx3) + "30" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 10, height: 10, borderRadius: 5, background: c[status] || C.tx3, boxShadow: "0 0 5px " + (c[status] || C.tx3) + "50" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: c[status] || C.tx3 } }, l[status]));
};
const PERM_KEYS = ["mar", "meds", "behavior", "shift", "health", "skills", "reports", "staff", "admin", "memos", "duties", "editMeds", "printMAR", "appointments", "export", "import"];
const mkP = (bits) => {
  const p = {};
  PERM_KEYS.forEach((k, i) => p[k] = bits[i] === "1");
  return p;
};
const ROLES = {
  "System Admin": { level: 6, color: "#ff2d55", perms: mkP("1111111111111111") },
  "Manager": { level: 5, color: "#af52de", perms: mkP("1111111101111110") },
  "BCBA": { level: 4, color: "#5856d6", perms: mkP("0011010110100000") },
  "Sick Line Team": { level: 3, color: "#ff9500", perms: mkP("1100100001000010") },
  "Scheduler": { level: 2, color: "#34c759", perms: mkP("0000000100010100") },
  "CarehomeVA": { level: 3, color: "#5ac8fa", perms: mkP("0000000000001010") },
  "Staff": { level: 1, color: "#007aff", perms: mkP("1111110001100000") }
};
const ROLE_NAMES = Object.keys(ROLES);
const getPerms = (role) => (ROLES[role] || ROLES["Staff"]).perms;
const STAFF0 = [
  { id: "sa1", first: "System", last: "Admin", name: "Admin, System", role: "System Admin", pin: "0000", password: "Tehama909!", email: "sch.kgh.kts@gmail.com", phone: "", on: true, homes: ["SCH", "KGH", "HE", "CCS", "TRAIN"], isMaster: true },
  { id: "s0", first: "System", last: "Admin", name: "Admin, System", role: "System Admin", pin: "0000", phone: "", email: "", on: true, homes: ["SCH", "KGH", "HE"] },
  { id: "s1", first: "Ethel Joy", last: "Espa\xF1ola", name: "Espa\xF1ola, Ethel Joy", role: "Scheduler", pin: "1234", password: "ethel123", phone: "209-555-0101", email: "eespanola@isr.com", on: true, homes: ["SCH", "KGH", "HE"] },
  { id: "s2", first: "Crystal", last: "Bigler", name: "Bigler, Crystal", role: "Staff", pin: "5678", password: "staff123", phone: "209-555-0102", email: "cbigler@isr.com", on: true, homes: ["SCH"] },
  { id: "s3", first: "Aaron", last: "Khan", name: "Khan, Aaron", role: "Staff", pin: "9012", password: "staff123", phone: "209-555-0103", email: "akhan@isr.com", on: true, homes: ["SCH"] },
  { id: "s4", first: "Vanessa", last: "Garza", name: "Garza, Vanessa", role: "Staff", pin: "3456", password: "staff123", phone: "209-555-0104", email: "vgarza@isr.com", on: true, homes: ["SCH"] },
  { id: "s5", first: "Jacob", last: "Lawal", name: "Lawal, Jacob", role: "Staff", pin: "7890", password: "staff123", phone: "209-555-0105", email: "jlawal@isr.com", on: true, homes: ["SCH"] },
  { id: "s6", first: "Sajad", last: "Dad", name: "Dad, Sajad", role: "Staff", pin: "1111", password: "staff123", phone: "209-555-0106", email: "sdad@isr.com", on: true, homes: ["SCH", "KGH"] },
  { id: "s11", first: "Carehome", last: "VA", name: "VA, Carehome", role: "CarehomeVA", pin: "0000", password: "carehome123", phone: "", email: "va@teamisr.net", on: true, homes: ["SCH", "KGH", "HE"] },
  { id: "s10", first: "CCS", last: "Manager", name: "Manager, CCS", role: "Manager", pin: "0000", password: "CCSmanager1!", phone: "", email: "manager@ccs.com", on: true, homes: ["CCS"] },
  { id: "s9", first: "Training", last: "Manager", name: "Manager, Training", role: "Manager", pin: "0000", password: "manager123", phone: "", email: "trainmgr@teamisr.net", on: true, homes: ["TRAIN"] },
  { id: "s8", first: "Training", last: "Staff", name: "Staff, Training", role: "Staff", pin: "0000", password: "training123", phone: "", email: "training@teamisr.net", on: true, homes: ["TRAIN"] },
  { id: "s7", first: "Mohammad", last: "Basit", name: "Basit, Mohammad", role: "Staff", pin: "2222", password: "staff123", phone: "209-555-0107", email: "mbasit@isr.com", on: true, homes: ["SCH"] },
  { id: "r3", home: "TRAIN", first: "Sarah", last: "Mitchell", name: "Mitchell, Sarah", dob: "1978-09-12", uci: "UCI-DEMO001", admDate: "2023-03-01", bgInfo: "Sarah is a [AGE]-year-old female born on September 12th, 1978. She carries a diagnosis of Intellectual Disability (Mild), Generalized Anxiety Disorder, and Hypothyroidism. Sarah was placed at Shakil's Care Home on March 1st, 2023. She enjoys painting, listening to music, and going for walks. Sarah is verbal and communicates her needs independently. She requires moderate support with medication management, meal preparation, and community integration. Sarah responds well to positive reinforcement and structured routines. Her behavioral support plan focuses on anxiety management through deep breathing exercises and scheduled sensory breaks.", emergContact: { name: "Karen Mitchell", phone: "209-555-0099", relation: "Sister" }, conservator: { name: "County Public Guardian", phone: "209-555-9500", agency: "Stanislaus County" }, rcCoordinator: { name: "Lisa Martinez", phone: "209-555-2250", agency: "VMRC" }, diagnosis: ["Intellectual Disability (Mild)", "Generalized Anxiety Disorder", "Hypothyroidism"], allergies: [{ type: "medication", name: "Amoxicillin", reaction: "Rash & hives", sev: "moderate" }, { type: "food", name: "Peanuts", reaction: "Anaphylaxis", sev: "severe" }], doctors: [{ name: "Dr. Amanda Liu", specialty: "PCP", phone: "209-555-4100", fax: "209-555-4101", location: "Modesto Family Medicine", visitFreq: "Every 6 months" }, { name: "Dr. Marcus Webb, PsyD", specialty: "Psychiatrist", phone: "209-555-3020", fax: "", location: "Program Office", visitFreq: "Monthly" }, { name: "Dr. Nina Park, DDS", specialty: "Dentist", phone: "209-555-5050", fax: "", location: "Smile Dental Modesto", visitFreq: "Every 6 months" }, { name: "Dr. Rachel Torres", specialty: "Endocrinologist", phone: "209-555-6060", fax: "", location: "Valley Endocrine Center", visitFreq: "Every 3 months" }], medChanges: [{ d: "2026-02-15", type: "Dose Change", note: "Levothyroxine increased from 50mcg to 75mcg per Dr. Torres. TSH was 6.8.", sev: "moderate" }, { d: "2026-01-20", type: "New Medication", note: "Buspirone 10mg added for anxiety per Dr. Webb.", sev: "moderate" }], sirs: [{ d: "2026-01-05", desc: "Anxiety episode during fire drill. Deep breathing used. Resolved in 15 min.", st: "Closed" }] },
  { id: "r4", home: "TRAIN", first: "David", last: "Reyes", name: "Reyes, David", dob: "1992-04-18", uci: "UCI-DEMO002", admDate: "2024-06-01", bgInfo: "David is a [AGE]-year-old male born on April 18th, 1992. He carries a diagnosis of Autism Spectrum Disorder (Level 2), Epilepsy (controlled), and GERD. David was placed at Shakil's Care Home on June 1st, 2024. He communicates using short phrases and a communication board. David enjoys puzzles, watching nature documentaries, and swimming. He requires moderate support with daily living skills and community activities. David follows a structured visual schedule and responds well to consistent routines. His behavioral support plan focuses on reducing elopement attempts through environmental modifications and positive reinforcement for staying in designated areas.", emergContact: { name: "Maria Reyes", phone: "209-555-0088", relation: "Mother" }, conservator: { name: "Maria Reyes", phone: "209-555-0088", agency: "Family" }, rcCoordinator: { name: "Carlos Mendez", phone: "209-555-2280", agency: "VMRC" }, diagnosis: ["Autism Spectrum Disorder (Level 2)", "Epilepsy (controlled)", "GERD"], allergies: [{ type: "medication", name: "Phenytoin", reaction: "Stevens-Johnson Syndrome risk", sev: "severe" }, { type: "food", name: "Dairy", reaction: "GI distress, bloating", sev: "moderate" }, { type: "environmental", name: "Strong perfumes", reaction: "Sensory overload, agitation", sev: "mild" }], doctors: [{ name: "Dr. Amanda Liu", specialty: "PCP", phone: "209-555-4100", fax: "209-555-4101", location: "Modesto Family Medicine", visitFreq: "Every 6 months" }, { name: "Dr. Kevin Cho", specialty: "Neurologist", phone: "209-555-7070", fax: "", location: "Valley Neurology Center", visitFreq: "Every 3 months" }, { name: "Dr. Marcus Webb, PsyD", specialty: "Psychiatrist", phone: "209-555-3020", fax: "", location: "Program Office", visitFreq: "Monthly" }, { name: "Dr. Nina Park, DDS", specialty: "Dentist", phone: "209-555-5050", fax: "", location: "Smile Dental Modesto", visitFreq: "Every 6 months" }], medChanges: [{ d: "2026-03-01", type: "Lab Results", note: "Depakote level: 85 mcg/mL (therapeutic range). Continue current dose.", sev: "low" }, { d: "2026-02-10", type: "Behavioral Incident", note: "Elopement attempt from backyard. Staff redirected within 30 seconds. Gate alarm functioning.", sev: "high" }, { d: "2026-01-28", type: "Dose Change", note: "Omeprazole increased from 20mg to 40mg per Dr. Liu for breakthrough reflux.", sev: "moderate" }], sirs: [{ d: "2026-02-10", desc: "Elopement attempt from backyard during outdoor time. Staff intervened within 30 seconds.", st: "Closed" }] }
];
const HOMES = [{ id: "SCH", name: "SCH", full: "Shakil's Care Home", color: "#007aff" }, { id: "KGH", name: "KGH", full: "Khan Guest Home", color: "#34a853" }, { id: "HE", name: "HE", full: "Harvey Estates", color: "#ff9500" }, { id: "CCS", name: "CCS", full: "Community Connections Support", color: "#5856d6" }, { id: "TRAIN", name: "TRAIN", full: "Training Demo Home", color: "#ff2d55" }];
const INIT_MEDS = [
  { id: "m1", resId: "r1", name: "Aricept", dose: "10mg", tabsPerDose: 1, route: "By Mouth", freq: "Daily", times: ["08:00"], instr: "Give in evening if stomach upset.", doctor: "Dr. Sarah Chen - Neurology", rx: "RX-7742918", status: "active", ...aiMed("aricept") },
  { id: "m2", resId: "r1", name: "Metformin", dose: "1000mg", tabsPerDose: 2, route: "By Mouth", freq: "2x Daily", times: ["08:00", "20:00"], instr: "Take with meals. Hold if not eating.", doctor: "Dr. James Rivera - Internal Med", rx: "RX-7742920", status: "active", ...aiMed("metformin") },
  { id: "m3", resId: "r1", name: "Lisinopril", dose: "10mg", tabsPerDose: 1, route: "By Mouth", freq: "Daily", times: ["08:00"], instr: "Hold if blood pressure below 100.", doctor: "Dr. James Rivera - Internal Med", rx: "RX-7742921", status: "active", ...aiMed("lisinopril") },
  { id: "m4", resId: "r1", name: "Omeprazole", dose: "20mg", tabsPerDose: 1, route: "By Mouth", freq: "Daily", times: ["06:00"], instr: "30 min before meals. No crush.", doctor: "Dr. James Rivera - Internal Med", rx: "RX-7742922", status: "active", ...aiMed("omeprazole") },
  { id: "m5", resId: "r1", name: "Acetaminophen", dose: "500mg", tabsPerDose: 2, route: "By Mouth", freq: "PRN", times: [], instr: "PRN pain/fever. Max 3000mg/24hrs.", doctor: "Dr. James Rivera - Internal Med", rx: "RX-7742923", status: "active", ...aiMed("acetaminophen") },
  { id: "m6", resId: "r2", name: "Lisinopril", dose: "10mg", tabsPerDose: 1, route: "By Mouth", freq: "Daily", times: ["08:00"], instr: "For blood pressure. Monitor BP. Hold if blood pressure below 100.", doctor: "Dr. Castro - Primary Care", rx: "RX-9901201", status: "active", ...aiMed("lisinopril") },
  { id: "m7", resId: "r2", name: "Sertraline", dose: "100mg", tabsPerDose: 1, route: "By Mouth", freq: "Daily", times: ["08:00"], instr: "For anxiety/mood. Take in morning.", doctor: "Dr. Marcus Webb - Psychiatry", rx: "RX-9901202", status: "active", ...aiMed("sertraline") },
  { id: "m8", resId: "r2", name: "Risperidone", dose: "1mg", tabsPerDose: 1, route: "By Mouth", freq: "2x Daily", times: ["08:00", "20:00"], instr: "For emotional regulation. Watch for muscle stiffness or tremors.", doctor: "Dr. Marcus Webb - Psychiatry", rx: "RX-9901203", status: "active", ...aiMed("risperidone") },
  { id: "m9", resId: "r2", name: "Ibuprofen", dose: "400mg", tabsPerDose: 1, route: "By Mouth", freq: "PRN", times: [], instr: "PRN pain. Max 1200mg/24hrs. Take with food.", doctor: "Dr. Castro - Primary Care", rx: "RX-9901204", status: "active", ...aiMed("ibuprofen") },
  { id: "m10", resId: "r3", name: "Levothyroxine", dose: "75mcg", tabsPerDose: 1, route: "By Mouth", freq: "Daily", times: ["06:00"], instr: "Take on empty stomach 30-60 min before breakfast. Do not take with calcium or iron.", doctor: "Dr. Rachel Torres - Endocrinology", rx: "RX-DEMO001", status: "active", gen: "Levothyroxine", reason: "Hypothyroidism management", sides: ["Headache", "Insomnia", "Weight changes", "Hair loss"], warns: ["Take on empty stomach"], pill: { shape: "round", color: "#fff", imprint: "75", desc: "White round tablet" } },
  { id: "m11", resId: "r3", name: "Buspirone", dose: "10mg", tabsPerDose: 1, route: "By Mouth", freq: "2x Daily", times: ["08:00", "20:00"], instr: "For anxiety. Take consistently at same times daily.", doctor: "Dr. Marcus Webb - Psychiatry", rx: "RX-DEMO002", status: "active", gen: "Buspirone", reason: "Generalized Anxiety Disorder", sides: ["Dizziness", "Nausea", "Headache", "Drowsiness"], warns: [], pill: { shape: "oval", color: "#FFB6C1", imprint: "BUS 10", desc: "Pink oval tablet" } },
  { id: "m12", resId: "r3", name: "Vitamin D3", dose: "2000 IU", tabsPerDose: 1, route: "By Mouth", freq: "Daily", times: ["08:00"], instr: "Take with food for better absorption.", doctor: "Dr. Amanda Liu - Primary Care", rx: "RX-DEMO003", status: "active", gen: "Cholecalciferol", reason: "Vitamin D deficiency", sides: ["Nausea (rare)"], warns: [], pill: { shape: "round", color: "#FFD700", imprint: "D3", desc: "Yellow round softgel" } },
  { id: "m13", resId: "r3", name: "Lorazepam", dose: "0.5mg", tabsPerDose: 1, route: "By Mouth", freq: "PRN", times: [], instr: "PRN severe anxiety. Max 2mg/24hrs. Monitor for sedation. Document reason and response.", doctor: "Dr. Marcus Webb - Psychiatry", rx: "RX-DEMO004", status: "active", gen: "Lorazepam", reason: "Acute anxiety episodes", sides: ["Drowsiness", "Dizziness", "Weakness"], warns: ["Controlled substance", "Risk of dependence"], pill: { shape: "round", color: "#FFFFFF", imprint: "LOR 0.5", desc: "White round scored tablet", scored: true } },
  { id: "m14", resId: "r4", name: "Depakote", dose: "500mg", tabsPerDose: 2, route: "By Mouth", freq: "2x Daily", times: ["08:00", "20:00"], instr: "For seizure control. Take with food. Monitor liver function every 6 months.", doctor: "Dr. Kevin Cho - Neurology", rx: "RX-DEMO010", status: "active", gen: "Divalproex Sodium", reason: "Epilepsy / Seizure prevention", sides: ["Drowsiness", "Nausea", "Weight gain", "Tremor", "Hair thinning"], warns: ["Liver function monitoring required", "Do not crush"], pill: { shape: "oval", color: "#FFB6C1", imprint: "DP 500", desc: "Pink oval coated tablet" } },
  { id: "m15", resId: "r4", name: "Omeprazole", dose: "40mg", tabsPerDose: 1, route: "By Mouth", freq: "Daily", times: ["06:00"], instr: "Take 30 min before breakfast on empty stomach. Do not crush or chew.", doctor: "Dr. Amanda Liu - Primary Care", rx: "RX-DEMO011", status: "active", gen: "Omeprazole", reason: "GERD / Acid reflux", sides: ["Headache", "Nausea", "Diarrhea"], warns: [], pill: { shape: "capsule", color: "#9370DB", imprint: "OME 40", desc: "Purple capsule" } },
  { id: "m16", resId: "r4", name: "Risperdal", dose: "1mg", tabsPerDose: 1, route: "By Mouth", freq: "2x Daily", times: ["08:00", "20:00"], instr: "For irritability and behavioral management. Monitor for weight gain and metabolic changes.", doctor: "Dr. Marcus Webb - Psychiatry", rx: "RX-DEMO012", status: "active", gen: "Risperidone", reason: "ASD-related irritability and agitation", sides: ["Drowsiness", "Weight gain", "Increased appetite", "Drooling"], warns: ["Metabolic monitoring required"], pill: { shape: "round", color: "#FFFFFF", imprint: "R 1", desc: "White round tablet" } },
  { id: "m17", resId: "r4", name: "Melatonin", dose: "5mg", tabsPerDose: 1, route: "By Mouth", freq: "Daily", times: ["21:00"], instr: "For sleep support. Give 30 min before bedtime.", doctor: "Dr. Marcus Webb - Psychiatry", rx: "RX-DEMO013", status: "active", gen: "Melatonin", reason: "Sleep regulation", sides: ["Morning grogginess"], warns: [], pill: { shape: "round", color: "#E0E8F0", imprint: "MEL 5", desc: "White round chewable tablet" } },
  { id: "m18", resId: "r4", name: "Diazepam", dose: "5mg", tabsPerDose: 1, route: "By Mouth", freq: "PRN", times: [], instr: "PRN for seizure rescue ONLY. Administer if seizure lasts >3 min. Call 911 immediately. Document time of seizure, duration, and response.", doctor: "Dr. Kevin Cho - Neurology", rx: "RX-DEMO014", status: "active", gen: "Diazepam", reason: "Seizure rescue medication", sides: ["Sedation", "Confusion"], warns: ["Controlled substance", "Seizure rescue ONLY", "Call 911 if used"], pill: { shape: "round", color: "#FFD700", imprint: "DZ 5", desc: "Yellow round scored tablet", scored: true } }
];
const SKILLS_BY_RES = {
  r1: [{ name: "Teeth Brushing", steps: ["Wet toothbrush", "Apply toothpaste", "Brush top teeth", "Brush bottom teeth", "Rinse mouth", "Rinse toothbrush"] }, { name: "Hand Washing", steps: ["Turn on water", "Wet hands", "Apply soap", "Scrub 20s", "Rinse", "Dry hands"] }],
  r4: [{ name: "Hand Washing", steps: ["Go to sink", "Turn on water", "Wet hands", "Get soap", "Rub palms together", "Scrub between fingers", "Scrub back of hands", "Rinse thoroughly", "Turn off water", "Dry with towel"] }, { name: "Setting the Table", steps: ["Get placemat", "Place placemat", "Get plate", "Place plate on mat", "Get fork", "Place fork on left", "Get knife", "Place knife on right", "Get napkin", "Place napkin under fork", "Get cup", "Place cup top right"] }, { name: "Getting Dressed", steps: ["Pick out clothes", "Put on underwear", "Put on pants", "Put on socks", "Put on shirt", "Button/zip as needed", "Put on shoes", "Tie/velcro shoes", "Check appearance in mirror"] }],
  r3: [{ name: "Teeth Brushing", steps: ["Get toothbrush", "Apply toothpaste", "Brush top front", "Brush top back", "Brush bottom front", "Brush bottom back", "Brush tongue", "Rinse mouth", "Rinse toothbrush", "Put away supplies"] }, { name: "Making a Sandwich", steps: ["Wash hands", "Get bread", "Get fillings", "Open bread bag", "Place 2 slices on plate", "Add fillings", "Close sandwich", "Cut in half", "Clean up", "Put supplies away"] }],
  r2: [{ name: "Microwave Use", steps: ["Open door", "Place food", "Close door", "Set time", "Press start", "Wait for beep", "Remove food"] }, { name: "Table Setting", steps: ["Get placemat", "Place plate", "Add fork/knife", "Add napkin", "Add cup"] }]
};
const PROMPTS = ["Independent", "Indirect Verbal", "Verbal", "Gesture", "Visual", "Positional", "Model", "Partial Physical", "Full Physical", "Incomplete"];
const RES0 = [
  { id: "r1", home: "KGH", first: "Dan", last: "Kenyon", name: "Kenyon, Dan", dob: "1985-06-15", uci: "UCI-20198834", admDate: "2024-01-10", bgInfo: "Dan is a [AGE]-year-old Caucasian male born on June 15th, 1985. He carries a diagnosis of Intellectual Disability, Diabetes Mellitus Type 2, and Hypertension. Dan was placed at Khan Guest Home on January 10th, 2024. ", emergContact: { name: "Sarah Kenyon", phone: "209-555-8001", relation: "Sister" }, conservator: { name: "", phone: "", agency: "" }, rcCoordinator: { name: "Isabella Walsh", phone: "916-555-2200", agency: "ACRC" }, diagnosis: ["Intellectual Disability", "Diabetes Mellitus Type 2", "Hypertension"], allergies: [{ type: "medication", name: "Penicillin", reaction: "Anaphylaxis", sev: "severe" }, { type: "medication", name: "Sulfa Drugs", reaction: "Rash, hives", sev: "moderate" }, { type: "food", name: "Shellfish", reaction: "GI distress", sev: "moderate" }, { type: "environmental", name: "Latex", reaction: "Contact dermatitis", sev: "mild" }], doctors: [{ name: "Dr. Sarah Chen", specialty: "Neurologist", phone: "209-555-3001", fax: "209-555-3002", location: "Valley Medical Center", visitFreq: "Every 3 months" }, { name: "Dr. James Rivera", specialty: "PCP", phone: "209-555-3010", fax: "", location: "Lodi Family Practice", visitFreq: "Annually" }, { name: "Dr. Marcus Webb, PsyD", specialty: "Psychiatrist", phone: "209-555-3020", fax: "", location: "Program Office", visitFreq: "Monthly" }, { name: "Dr. Patel, DDS", specialty: "Dentist", phone: "209-555-3030", fax: "", location: "Bright Smile Dental", visitFreq: "Every 6 months" }], medChanges: [{ d: "2026-02-25", type: "Facility Transfer", note: "Lodi Nursing.", sev: "high" }, { d: "2026-02-24", type: "Drain Placement", note: "Surgical drain. Stable.", sev: "high" }, { d: "2026-02-12", type: "Behavioral Incident", note: "Altercation at day program.", sev: "high" }], sirs: [{ d: "2026-02-24", desc: "Drain placement.", st: "Open" }, { d: "2026-02-12", desc: "Altercation.", st: "Under Review" }] },
  { id: "r2", home: "KGH", first: "Michael", last: "Wagoner", name: "Wagoner, Michael", dob: "1990-03-22", uci: "UCI-20198847", admDate: "2023-06-15", bgInfo: "Michael is a [AGE]-year-old male born on March 22nd, 1990. He carries a diagnosis of Autism Spectrum Disorder, Anxiety Disorder, and GERD. Michael was placed at Khan Guest Home on June 15th, 2023. ", emergContact: { name: "James Wagoner", phone: "209-555-8002", relation: "Father" }, conservator: { name: "Public Guardian", phone: "209-555-9000", agency: "SJ County" }, rcCoordinator: { name: "Maria Santos", phone: "209-555-2210", agency: "VMRC" }, diagnosis: ["Autism Spectrum Disorder", "Anxiety Disorder", "GERD"], allergies: [{ type: "environmental", name: "Latex", reaction: "Contact dermatitis", sev: "mild" }], doctors: [{ name: "Dr. Castro", specialty: "PCP", phone: "209-555-4001", fax: "", location: "Valley Medical Center", visitFreq: "Annually" }, { name: "Dr. Marcus Webb, PsyD", specialty: "Psychiatrist", phone: "209-555-3020", fax: "", location: "Program Office" }], medChanges: [{ d: "2025-11-12", type: "Urgent Care Visit", note: "Leg pain. Ice, elevate, knee brace. No new Rx.", sev: "moderate" }, { d: "2022-08-30", type: "Dose Change", note: "Lisinopril 20mg DC to 10mg per Dr. Castro.", sev: "moderate" }, { d: "2021-10-19", type: "ER Visit", note: "Breathing problems, chest pain. Discharged Lodi Memorial.", sev: "high" }], sirs: [] }
];
function IndividualSupportRecord() {
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState("");
  const [loginMode, setLoginMode] = useState("staff");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [staff, setStaff] = useState(STAFF0);
  const [residents, setResidents] = useState(RES0);
  const [homeConfig, setHomeConfig] = useState({ SCH: { ips: [], teams: [] }, KGH: { ips: [], teams: [] }, HE: { ips: [], teams: [] }, CCS: { ips: [], teams: [] }, TRAIN: { ips: [], teams: [] } });
  const [userIP, setUserIP] = useState(null);
  const [ipChecked, setIpChecked] = useState(false);
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    if (!user) {
      setIpChecked(false);
      setUserIP(null);
      return;
    }
    const detectIP = async () => {
      try {
        const r = await fetch("https://api.ipify.org?format=json");
        const j = await r.json();
        setUserIP(j.ip);
      } catch (e) {
        try {
          const r2 = await fetch("https://api64.ipify.org?format=json");
          const j2 = await r2.json();
          setUserIP(j2.ip);
        } catch (e2) {
          setUserIP("UNKNOWN");
        }
      }
      setIpChecked(true);
    };
    detectIP();
  }, [user]);
  const isAdmin = user && (user.role === "System Admin" || user.role === "Manager");
  const ipAllowed = () => {
    if (user && (user.homes || []).every((h) => h === "CCS" || h === "TRAIN")) return true;
    if (user && user.role === "CarehomeVA") return true;
    if (!user || !ipChecked) return true;
    if (isAdmin) return true;
    if (user.role === "BCBA") return true;
    if (userIP === "UNKNOWN") return true;
    const userHomes = user.homes || [];
    for (const hid of userHomes) {
      const cfg = homeConfig[hid];
      if (!cfg || !cfg.ips || cfg.ips.length === 0) return true;
      if (cfg.ips.includes(userIP)) return true;
    }
    const allConfigured = userHomes.every((hid) => homeConfig[hid] && homeConfig[hid].ips && homeConfig[hid].ips.length > 0);
    return !allConfigured;
  };
  const sendTeamsAlert = (homeId, type, title, body) => {
    const cfg = homeConfig[homeId];
    if (!cfg || !cfg.teams) return;
    const homeName = (HOMES.find((h) => h.id === homeId) || {}).full || homeId;
    const colorMap = { behavior: "attention", memo: "accent", medChange: "warning", prn: "good", sir: "attention" };
    const emojiMap = { behavior: "\u26A1", memo: "\u{1F4CB}", medChange: "\u{1F3E5}", prn: "\u{1F48A}", sir: "\u{1F6A8}" };
    cfg.teams.filter((t) => t.on && t.types.includes(type)).forEach((t) => {
      const payload = { type: "message", attachments: [{ contentType: "application/vnd.microsoft.card.adaptive", content: { "$schema": "http://adaptivecards.io/schemas/adaptive-card.json", type: "AdaptiveCard", version: "1.4", body: [
        { type: "TextBlock", text: (emojiMap[type] || "") + " " + title, size: "Medium", weight: "Bolder", wrap: true },
        { type: "FactSet", facts: [
          { title: "Home", value: homeName },
          { title: "Type", value: type.charAt(0).toUpperCase() + type.slice(1) },
          { title: "Time", value: (/* @__PURE__ */ new Date()).toLocaleString() }
        ] },
        { type: "TextBlock", text: body, wrap: true, size: "Small" }
      ] } }] };
      try {
        fetch(t.url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).then((r) => {
          if (!r.ok) console.warn("Teams webhook failed:", r.status);
        }).catch((e) => console.warn("Teams webhook error:", e));
      } catch (e) {
        console.warn("Teams send error:", e);
      }
    });
  };
  const AI_VISIT_FREQ = {
    "pcp": "Annually",
    "primary care": "Annually",
    "family medicine": "Annually",
    "internist": "Annually",
    "neurologist": "Every 3 months",
    "neurology": "Every 3 months",
    "psychiatrist": "Monthly",
    "psychiatry": "Monthly",
    "behavioral health": "Monthly",
    "dentist": "Every 6 months",
    "dental": "Every 6 months",
    "dds": "Every 6 months",
    "ophthalmologist": "Annually",
    "optometrist": "Annually",
    "eye doctor": "Annually",
    "cardiologist": "Every 6 months",
    "cardiology": "Every 6 months",
    "endocrinologist": "Every 3 months",
    "endocrinology": "Every 3 months",
    "dermatologist": "Annually",
    "dermatology": "Annually",
    "podiatrist": "Every 6 months",
    "podiatry": "Every 6 months",
    "gastroenterologist": "Every 6 months",
    "gi doctor": "Every 6 months",
    "urologist": "Annually",
    "urology": "Annually",
    "pulmonologist": "Every 3 months",
    "pulmonology": "Every 3 months",
    "orthopedist": "As needed",
    "orthopedic": "As needed",
    "allergist": "Every 6 months",
    "rheumatologist": "Every 3 months",
    "oncologist": "Monthly",
    "oncology": "Monthly",
    "specialist": "Every 3 months"
  };
  const aiVisitFreq = (specialty) => {
    if (!specialty) return "";
    const s = specialty.toLowerCase().trim();
    for (const [k, v] of Object.entries(AI_VISIT_FREQ)) {
      if (s.includes(k)) return v;
    }
    return "";
  };
  const getLastVisit = (resId, doctorName) => {
    const past = appointments.filter((a) => a && a.resId === resId && a.doctor === doctorName && a.date && a.date < today).sort((a, b) => b.date.localeCompare(a.date));
    return past.length > 0 ? past[0].date : "";
  };
  const parseFreqDays = (freq) => {
    if (!freq) return 0;
    const f = freq.toLowerCase();
    if (f.includes("month")) {
      const n = parseInt(f) || 1;
      return n * 30;
    }
    if (f.includes("annual") || f.includes("year")) return 365;
    if (f.includes("week")) {
      const n = parseInt(f) || 1;
      return n * 7;
    }
    return 0;
  };
  const getNextDueDate = (lastVisit, freq) => {
    if (!lastVisit || !freq) return null;
    const days = parseFreqDays(freq);
    if (!days) return null;
    const d = /* @__PURE__ */ new Date(lastVisit + "T12:00:00");
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };
  const [tab, setTab] = useState("home");
  const [modal, setModal] = useState(null);
  const [selRes, setSelRes] = useState(null);
  const [subTab, setSubTab] = useState("ai");
  const [printContent, setPrintContent] = useState(null);
  const [printFilename, setPrintFilename] = useState("MAR-Print.html");
  const doPrint = (html, filename) => {
    setPrintContent(html);
    setPrintFilename(filename || "MAR-Print.html");
  };
  const [dashDate, setDashDate] = useState(() => (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const ddPrev = () => {
    const d = /* @__PURE__ */ new Date(dashDate + "T12:00:00");
    d.setDate(d.getDate() - 1);
    setDashDate(d.toISOString().split("T")[0]);
  };
  const ddNext = () => {
    const d = /* @__PURE__ */ new Date(dashDate + "T12:00:00");
    d.setDate(d.getDate() + 1);
    const t = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    if (d.toISOString().split("T")[0] <= t) setDashDate(d.toISOString().split("T")[0]);
  };
  const ddLabel = (d) => {
    if (d === today) return "Today";
    const dt = /* @__PURE__ */ new Date(d + "T12:00:00");
    return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };
  const [selHome, setSelHome] = useState(null);
  const [meds, setMeds] = useState(INIT_MEDS);
  const [docs, setDocs] = useState([
    { id: "dd1", resId: "r3", type: "Shift", d: "2026-03-12", t: "7:15 AM", user: "Training Staff", by: "s8", text: "Sarah had a calm morning. Woke at 6:30 AM, completed morning hygiene with minimal verbal prompts. Took all AM medications without issue. Ate breakfast (oatmeal with fruit). Participated in art activity from 9-10 AM \u2014 painted a landscape. No anxiety episodes during shift.", shiftData: { communityOffered: "yes", choicesOffered: "yes", illness: "no", sir: "no", medAppt: "no", outing: "no" } },
    { id: "dd2", resId: "r3", type: "Shift", d: "2026-03-11", t: "3:30 PM", user: "Training Staff", by: "s8", text: "Sarah had a mild anxiety episode at 2:15 PM when fire alarm test occurred. Deep breathing techniques were used \u2014 resolved in 8 minutes. Sarah chose to listen to music in her room for 20 minutes after. Ate lunch and dinner well. PM medications given on time.", shiftData: { communityOffered: "yes", choicesOffered: "yes", illness: "no", sir: "no", medAppt: "no", outing: "no" } },
    { id: "dd3", resId: "r4", type: "Shift", d: "2026-03-12", t: "7:30 AM", user: "Training Staff", by: "s8", text: "David followed his visual schedule well this morning. Completed hand washing independently (9/10 steps). Required full physical prompt for teeth brushing. AM medications given with breakfast. No seizure activity. Elopement prevention: gate alarm tested and functional. Marcus enjoyed puzzle time from 8:30-9:30 AM.", shiftData: { communityOffered: "yes", choicesOffered: "yes", illness: "no", sir: "no", medAppt: "no", outing: "no" } },
    { id: "dd4", resId: "r4", type: "Activity", d: "2026-03-11", t: "2:00 PM", user: "Training Staff", by: "s8", text: "Community outing: Walk to neighborhood park with 1:1 staffing. David walked alongside staff for 15 minutes without elopement attempt. Sat on bench and watched birds for 10 minutes. Returned home cooperatively. Great progress!" },
    { id: "dd5", resId: "r4", type: "Vitals", d: "2026-03-12", t: "7:00 AM", user: "Training Staff", by: "s8", text: "Vitals: Temp 97.8\xB0F, Pulse 72 bpm, O2 Sat 98%. All within normal range." }
  ]);
  const resMeds = selRes ? meds.filter((m) => m.resId === selRes) : meds;
  const [marRecs, setMarRecs] = useState([]);
  const [tallies, setTallies] = useState(() => {
    const bTypes = ["Physical Aggr", "Verbal Aggr", "Self-Injury", "Elopement", "Property Dest", "Non-Compliance"];
    const locs = ["Living Room", "Bedroom", "Kitchen", "Dining Room", "Bathroom", "Hallway", "Outside", "Program Area"];
    const times = ["7:15 AM", "8:30 AM", "9:45 AM", "10:20 AM", "11:00 AM", "12:30 PM", "1:15 PM", "2:45 PM", "3:30 PM", "4:00 PM", "5:15 PM", "6:30 PM", "7:45 PM", "8:00 PM", "9:15 PM"];
    const sIds = ["s1", "s2", "s3", "s4", "s5"];
    const rIds = ["r1", "r2"];
    const seed = [];
    const d0 = /* @__PURE__ */ new Date();
    for (let i = 0; i < 45; i++) {
      const dd = new Date(d0);
      dd.setDate(d0.getDate() - i);
      const ds = dd.toISOString().slice(0, 10);
      const cnt = Math.random() < 0.15 ? 0 : Math.random() < 0.3 ? 1 : Math.random() < 0.5 ? 2 : Math.random() < 0.7 ? 3 : Math.floor(Math.random() * 4) + 3;
      for (let j = 0; j < cnt; j++) {
        const bt = bTypes[Math.random() < 0.28 ? 0 : Math.random() < 0.35 ? 1 : Math.random() < 0.15 ? 2 : Math.random() < 0.1 ? 3 : Math.random() < 0.15 ? 4 : 5];
        seed.push({ id: "demo" + i + "_" + j, resId: rIds[Math.random() < 0.6 ? 0 : 1], b: bt, d: ds, t: times[Math.floor(Math.random() * times.length)], by: sIds[Math.floor(Math.random() * sIds.length)], note: { text: "Demo behavior entry for analytics.", location: locs[Math.floor(Math.random() * locs.length)], staffInv: "", resPres: "" } });
      }
    }
    return seed;
  });
  const [marArchive, setMarArchive] = useState([]);
  const [reports, setReports] = useState([{ id: "rp0", resId: "r1", d: "2026-02-18", by: "s2" }]);
  const [assigns, setAssigns] = useState({ r1: ["s4", "s5", "s6"] });
  const [staffShiftAssigns, setStaffShiftAssigns] = useState([]);
  const [docText, setDocText] = useState("");
  const [docType, setDocType] = useState("Shift");
  const [nStaff, setNStaff] = useState({ first: "", last: "", role: "Staff", pin: "", password: "", phone: "", email: "", homes: [] });
  const [editStaff, setEditStaff] = useState(null);
  const [editRes, setEditRes] = useState(null);
  const [newRes, setNewRes] = useState({ first: "", last: "", name: "", dob: "", home: "SCH", uci: "", admDate: "", bgInfo: "", emergContact: { name: "", phone: "", relation: "" }, conservator: { name: "", phone: "", agency: "" }, rcCoordinator: { name: "", phone: "", agency: "" }, diagnosis: [], diagInput: "", allergies: [], allergyInput: { name: "", reaction: "", sev: "moderate" }, medChanges: [], sirs: [] });
  const [adminTab, setAdminTab] = useState("staff");
  const [importText, setImportText] = useState("");
  const [newMed, setNewMed] = useState({ name: "", dose: "", route: "By Mouth", freq: "Daily", times: "08:00", instr: "", doctor: "", rx: "", pillColor: "", pillDesc: "", reason: "", tabsPerDose: 1 });
  const [aiPrev, setAiPrev] = useState(null);
  const [viewMed, setViewMed] = useState(null);
  const [marFilter, setMarFilter] = useState("due");
  const [holdForm, setHoldForm] = useState({ medId: null, reason: "", physician: "", fromDate: "", fromTime: "", toDate: "", toTime: "" });
  const [hvForm, setHvForm] = useState({ resId: null, fromDate: "", fromTime: "", toDate: "", toTime: "" });
  const [medMemoPrompt, setMedMemoPrompt] = useState(null);
  const [dcForm, setDcForm] = useState({ medId: null, reason: "", physician: "" });
  const [marErrors, setMarErrors] = useState([]);
  const [errForm, setErrForm] = useState({ date: "", time: "", med: "", reason: "" });
  const [shiftDuties, setShiftDuties] = useState([
    { id: "sd1", task: "Morning vitals check", time: "07:00", done: false, by: null },
    { id: "sd2", task: "Assist with breakfast", time: "07:30", done: false, by: null },
    { id: "sd3", task: "Administer AM medications", time: "08:00", done: false, by: null },
    { id: "sd4", task: "Personal hygiene / shower assist", time: "09:00", done: false, by: null },
    { id: "sd5", task: "Morning program activities", time: "10:00", done: false, by: null },
    { id: "sd6", task: "Lunch prep & assist", time: "12:00", done: false, by: null },
    { id: "sd7", task: "Administer PM medications", time: "13:00", done: false, by: null },
    { id: "sd8", task: "Afternoon activities / community outing", time: "14:00", done: false, by: null },
    { id: "sd9", task: "Dinner prep & assist", time: "17:00", done: false, by: null },
    { id: "sd10", task: "Evening vitals & documentation", time: "20:00", done: false, by: null },
    { id: "sd11", task: "Bedtime routine assist", time: "21:00", done: false, by: null }
  ]);
  const [newDuty, setNewDuty] = useState({ task: "", time: "" });
  const [dutiesDate, setDutiesDate] = useState(() => (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [dutiesHome, setDutiesHome] = useState(null);
  const [dutyLogs, setDutyLogs] = useState(() => {
    const seed = [];
    const tasks = ["Morning vitals check", "Assist with breakfast", "Administer AM medications", "Personal hygiene / shower assist", "Morning program activities", "Lunch prep & assist", "Administer PM medications", "Afternoon activities", "Dinner prep & assist", "Evening vitals & documentation", "Bedtime routine assist"];
    const times = ["07:00", "07:30", "08:00", "09:00", "10:00", "12:00", "13:00", "14:00", "17:00", "20:00", "21:00"];
    const hIds = ["SCH", "KGH", "HE"];
    const sIds = ["s2", "s4", "s5", "s6"];
    for (let i = 1; i <= 7; i++) {
      const dd = /* @__PURE__ */ new Date();
      dd.setDate(dd.getDate() - i);
      const ds = dd.toISOString().slice(0, 10);
      hIds.forEach((hid) => {
        tasks.forEach((tk, ti) => {
          const done = Math.random() < 0.82;
          seed.push({ id: "dl" + i + "_" + hid + "_" + ti, homeId: hid, d: ds, task: tk, time: times[ti], done, by: done ? sIds[Math.floor(Math.random() * sIds.length)] : null, doneAt: done ? times[ti].replace(":00", ":" + String(Math.floor(Math.random() * 30)).padStart(2, "0")) : null });
        });
      });
    }
    return seed;
  });
  const [appointments, setAppointments] = useState([
    { id: "apt1", resId: "r1", title: "Neurology Follow-Up", doctor: "Dr. Sarah Chen", location: "Valley Medical Center", date: "2026-02-27", time: "10:30", duration: "45 min", type: "Specialist", notes: "Bring med list. Discuss Aricept effectiveness.", status: "confirmed", visitFreq: "Every 3 months", lastVisit: "2025-11-15" },
    { id: "apt2", resId: "r1", title: "Dental Cleaning", doctor: "Dr. Patel, DDS", location: "Bright Smile Dental", date: "2026-02-27", time: "14:00", duration: "60 min", type: "Dental", notes: "Routine cleaning. Latex allergy alert.", status: "confirmed", visitFreq: "Every 6 months", lastVisit: "2025-08-20" },
    { id: "apt3", resId: "r1", title: "Behavioral Health Check", doctor: "Dr. Marcus Webb, PsyD", location: "Program Office", date: "2026-02-28", time: "09:00", duration: "30 min", type: "Behavioral", notes: "Monthly review. Bring behavior logs.", status: "scheduled" },
    { id: "apt4", resId: "r1", title: "Lab Work - Blood Panel", doctor: "Dr. James Rivera", location: "Quest Diagnostics", date: "2026-03-02", time: "07:30", duration: "20 min", type: "Lab", notes: "Fasting required. Metformin/renal panel.", status: "scheduled" },
    { id: "apt5", resId: "r2", title: "Primary Care Check-Up", doctor: "Dr. Castro", location: "Valley Medical Center", date: "2026-02-27", time: "11:00", duration: "30 min", type: "Primary Care", notes: "Annual wellness. Check BP. Discuss energy drinks.", status: "confirmed", visitFreq: "Annually", lastVisit: "2025-02-27" },
    { id: "apt6", resId: "r2", title: "Psychiatry Review", doctor: "Dr. Marcus Webb, PsyD", location: "Program Office", date: "2026-03-04", time: "10:00", duration: "45 min", type: "Behavioral", notes: "Review Risperidone. Discuss outburst patterns.", status: "scheduled" },
    ,
    { id: "apt-d1", resId: "r3", title: "Psychiatry Review", doctor: "Dr. Marcus Webb, PsyD", location: "Program Office", date: "2026-03-15", time: "10:00", duration: "45 min", type: "Behavioral", notes: "Monthly review. Discuss Buspirone effectiveness. Bring behavior logs.", status: "scheduled", visitFreq: "Monthly", lastVisit: "2026-02-15" },
    { id: "apt-d2", resId: "r3", title: "Endocrinology Check", doctor: "Dr. Rachel Torres", location: "Valley Endocrine Center", date: "2026-04-10", time: "09:00", duration: "30 min", type: "Specialist", notes: "Thyroid panel. Levothyroxine dose check.", status: "scheduled", visitFreq: "Every 3 months", lastVisit: "2026-01-10" },
    { id: "apt-d3", resId: "r3", title: "Dental Cleaning", doctor: "Dr. Nina Park, DDS", location: "Smile Dental Modesto", date: "2026-06-01", time: "14:00", duration: "60 min", type: "Dental", notes: "Routine cleaning. Peanut allergy - latex-free gloves.", status: "scheduled", visitFreq: "Every 6 months", lastVisit: "2025-12-01" },
    { id: "apt-d4", resId: "r4", title: "Neurology - Seizure Review", doctor: "Dr. Kevin Cho", location: "Valley Neurology Center", date: "2026-03-20", time: "09:30", duration: "45 min", type: "Specialist", notes: "Quarterly review. Bring Depakote levels. Discuss any seizure activity.", status: "scheduled", visitFreq: "Every 3 months", lastVisit: "2025-12-20" },
    { id: "apt-d5", resId: "r4", title: "Psychiatry Check-In", doctor: "Dr. Marcus Webb, PsyD", location: "Program Office", date: "2026-03-18", time: "11:00", duration: "30 min", type: "Behavioral", notes: "Monthly review. Discuss elopement data and Risperdal effectiveness.", status: "confirmed", visitFreq: "Monthly", lastVisit: "2026-02-18" }
  ]);
  const [viewApt, setViewApt] = useState(null);
  const [editApt, setEditApt] = useState(null);
  const [acctItems, setAcctItems] = useState([
    { id: "ai1", label: "Shift Duties Completed", key: "duties", on: true },
    { id: "ai2", label: "Client Notes Documented", key: "notes", on: true },
    { id: "ai3", label: "Skill Goals Logged", key: "skills", on: true },
    { id: "ai4", label: "Daily Activity Log Completed", key: "activity", on: true },
    { id: "ai5", label: "Vitals Recorded", key: "vitals", on: true },
    { id: "ai6", label: "Medications Given On Time", key: "medsOnTime", on: true },
    { id: "ai7", label: "PRN Follow-Ups Completed", key: "prnFollowUp", on: true }
  ]);
  const [newAcctItem, setNewAcctItem] = useState("");
  const [acctFrom, setAcctFrom] = useState("");
  const [acctTo, setAcctTo] = useState("");
  const [scoreHome, setScoreHome] = useState(null);
  const [scoreDate, setScoreDate] = useState(() => (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [teamsAdd, setTeamsAdd] = useState({ homeId: null, name: "", url: "" });
  const [ipAdd, setIpAdd] = useState({ homeId: null, ip: "" });
  const [staffView, setStaffView] = useState(null);
  const [walkthroughs, setWalkthroughs] = useState([]);
  const [activeWT, setActiveWT] = useState(null);
  const [wtConfirm, setWtConfirm] = useState(null);
  const [mealLog, setMealLog] = useState({ resId: "", meal: "Breakfast", desc: "", photo: null });
  const [irReports, setIrReports] = useState([]);
  const [irDraft, setIrDraft] = useState(null);
  const [irStep, setIrStep] = useState(0);
  const [irAiLoading, setIrAiLoading] = useState(false);
  const SIR_INC = ["Fire Setting", "Suicide Attempts/Threats", "Client Arrested", "Hospital Admission", "Media Attention", "Missing Person", "Physical Restraint", "Transportation Incident", "Death", "HIPAA Violation", "Other"];
  const SIR_NEG = ["Medical Care Needs", "Malnutrition/Dehydration", "Health & Safety Hazards", "Personal Hygiene", "Food/Clothing/Shelter", "Elder/Adult Care"];
  const SIR_CRM = ["Aggravated Assault", "Burglary", "Personal Robbery", "Larceny", "Rape/Attempted Rape"];
  const SIR_MED = ["Missed Dose", "Wrong Dose", "Wrong Medication", "Wrong Person", "Wrong Time", "Wrong Route", "Documentation Error", "Other"];
  const SIR_INJ = ["Internal Bleeding/Bruising", "Puncture Wounds", "Fractures", "Dislocation", "Lacerations (Sutures/Staples/Glue)"];
  const SIR_LOC = ["Community Care Facility", "Day Program", "Community Setting", "Other"];
  const SIR_ABU = ["Vendor/Employee of Vendor", "Employee of Non-vendor", "Relative/Family", "Regional Center Client", "Self", "Unknown", "Other Individual", "Not Applicable"];
  const mkIrDraft = () => ({ id: "ir" + Date.now(), d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), by: user.id, homeId: (user.homes || [])[0] || "SCH", resId: "", formType: "sir", status: "draft", narrative: "", clientName: "", sex: "", uci: "", dob: "", dateOcc: today, timeOcc: "", locType: "Community Care Facility", address: "", subByType: "Vendor", medTx: false, abuseBy: "Not Applicable", incTypes: [], negTypes: [], crmTypes: [], medErr: [], injTypes: [], desc: "", subBy: gn(user.id), subTitle: "Direct Care Staff", subPhone: "", agency: "", subTo: "ACRC Service Coordinator", dateSub: today, photos: [], reviewedBy: null, reviewDate: null, reviewNotes: "", returnReason: "" });
  const aiAnalyze = async (text, resId) => {
    setIrAiLoading(true);
    try {
      const r = residents.find((x) => x.id === resId);
      const resp = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1e3, messages: [{ role: "user", content: `Analyze this group home incident report narrative. Return ONLY valid JSON, no markdown backticks.
Resident: ${r ? fullName(r.name) : "Unknown"}
Narrative: "${text}"
Return JSON:
{"formType":"sir" or "shared" (sir=abuse/neglect/serious injury/death/missing person/restraint/med errors/crimes/hospital/suicide. shared=minor incidents/behavioral without injury/property damage/verbal altercations/minor falls),
"desc":"professional clinical rewrite",
"incTypes":[from: Fire Setting,Suicide Attempts/Threats,Client Arrested,Hospital Admission,Media Attention,Missing Person,Physical Restraint,Transportation Incident,Death,HIPAA Violation],
"negTypes":[from: Medical Care Needs,Malnutrition/Dehydration,Health & Safety Hazards,Personal Hygiene,Food/Clothing/Shelter,Elder/Adult Care],
"crmTypes":[from: Aggravated Assault,Burglary,Personal Robbery,Larceny,Rape/Attempted Rape],
"medErr":[from: Missed Dose,Wrong Dose,Wrong Medication,Wrong Person,Wrong Time,Wrong Route,Documentation Error],
"injTypes":[from: Internal Bleeding/Bruising,Puncture Wounds,Fractures,Dislocation,Lacerations (Sutures/Staples/Glue)],
"abuseBy":"from: Vendor/Employee of Vendor,Employee of Non-vendor,Relative/Family,Regional Center Client,Self,Unknown,Other Individual,Not Applicable",
"medTx":true/false,
"locType":"from: Community Care Facility,Day Program,Community Setting",
"timeOcc":"extracted time or empty",
"severity":"low/medium/high/critical"}` }] }) });
      const data = await resp.json();
      const txt2 = data.content?.map((c) => c.text || "").join("") || "";
      return JSON.parse(txt2.replace(/```json|```/g, "").trim());
    } catch (e) {
      console.error("AI err:", e);
      return null;
    } finally {
      setIrAiLoading(false);
    }
  };
  const calcAcct = (staffId, date) => {
    const s = staff.find((x) => x.id === staffId);
    if (!s) return {};
    const dutiesTotal = shiftDuties.length;
    const dutiesDoneCount = shiftDuties.filter((d) => d.done && d.by === staffId).length;
    const noteCount = docs.filter((d) => d.by === staffId && d.d === date).length;
    const assignedRes = Object.entries(assigns).filter(([, sids]) => sids.includes(staffId)).map(([rid]) => rid);
    const skillLogs = [];
    const activityLogs = docs.filter((d) => d.by === staffId && d.d === date && d.type === "Activity").length;
    const vitalsLogged = docs.filter((d) => d.by === staffId && d.d === date && (d.type === "Vitals" || d.text && d.text.toLowerCase().includes("vital"))).length > 0;
    const totalScheduledMeds = meds.filter((m) => m.status === "active" && m.freq !== "PRN" && assignedRes.includes(m.resId)).reduce((sum, m) => sum + (m.times || []).length, 0);
    const givenOnTime = marRecs.filter((r) => r.d === date && r.by === staffId).length;
    const prnGiven = prnRecs.filter((p) => p.d === date && p.by === staffId);
    const prnNeedingFollowUp = prnGiven.filter((p) => !p.followUp);
    const prnFollowedUp = prnGiven.filter((p) => p.followUp);
    return {
      duties: { done: dutiesDoneCount, total: dutiesTotal, pct: dutiesTotal > 0 ? Math.round(dutiesDoneCount / dutiesTotal * 100) : 0, pass: dutiesDoneCount === dutiesTotal },
      notes: { done: noteCount, total: assignedRes.length, pct: assignedRes.length > 0 ? Math.min(100, Math.round(noteCount / assignedRes.length * 100)) : 0, pass: noteCount >= assignedRes.length },
      skills: { done: skillLogs.length, total: assignedRes.length, pct: 0, pass: false },
      activity: { done: activityLogs, total: assignedRes.length, pct: assignedRes.length > 0 ? Math.min(100, Math.round(activityLogs / assignedRes.length * 100)) : 0, pass: activityLogs >= assignedRes.length },
      vitals: { done: vitalsLogged ? 1 : 0, total: 1, pct: vitalsLogged ? 100 : 0, pass: vitalsLogged },
      medsOnTime: { done: givenOnTime, total: totalScheduledMeds, pct: totalScheduledMeds > 0 ? Math.round(givenOnTime / totalScheduledMeds * 100) : 100, pass: givenOnTime >= totalScheduledMeds },
      prnFollowUp: { done: prnFollowedUp.length, total: prnGiven.length, pct: prnGiven.length > 0 ? Math.round(prnFollowedUp.length / prnGiven.length * 100) : 100, pass: prnNeedingFollowUp.length === 0 }
    };
  };
  const genAcctXlsx = async (dateFrom, dateTo) => {
    const rows = [];
    const df = /* @__PURE__ */ new Date(dateFrom + "T12:00:00");
    const dt = /* @__PURE__ */ new Date(dateTo + "T12:00:00");
    for (let d = new Date(df); d <= dt; d.setDate(d.getDate() + 1)) {
      const ds = d.toISOString().split("T")[0];
      staff.filter((s) => s.role === "Staff" && s.on).forEach((s) => {
        const a = calcAcct(s.id, ds);
        const row = { Date: ds, Staff: (s.first || "") + " " + (s.last || ""), Home: (s.homes || []).join(", ") };
        acctItems.filter((it) => it.on).forEach((it) => {
          const val = a[it.key];
          row[it.label] = val ? val.pass ? "\u2713 " + val.done + "/" + val.total : "\u2717 " + val.done + "/" + val.total : "N/A";
          row[it.label + " %"] = val ? val.pct : 0;
        });
        const activeItems = acctItems.filter((it) => it.on);
        const totalPct = activeItems.length > 0 ? Math.round(activeItems.reduce((sum, it) => sum + (a[it.key] ? a[it.key].pct : 0), 0) / activeItems.length) : 0;
        row["Overall %"] = totalPct;
        rows.push(row);
      });
    }
    return rows;
  };
  const [marTab, setMarTab] = useState("front");
  const [prnRecs, setPrnRecs] = useState([]);
  const [prnForm, setPrnForm] = useState({ medId: null, reason: "" });
  const [prnFollowUps, setPrnFollowUps] = useState([]);
  const [prnFollowForm, setPrnFollowForm] = useState({ prnId: null, result: "" });
  const prnStartDate = prnRecs.length > 0 ? prnRecs.reduce((mn, r) => r.d < mn ? r.d : mn, prnRecs[0].d) : null;
  const [behSel, setBehSel] = useState([]);
  const [behNote, setBehNote] = useState({ text: "", location: "", staffInv: "", resPres: "" });
  const [behView, setBehView] = useState(null);
  const [behAnalPeriod, setBehAnalPeriod] = useState("30d");
  const [behDomains, setBehDomains] = useState([
    { id: "bd1", resId: "r1", domain: "Physical Aggression", qualifier: "Toward Staff", severity: "Moderate", method: "Frequency", status: "Active", defs: ["Hitting, kicking, or pushing directed at staff members"], baseline: "Avg 3-4 per week", startDate: "2025-01-01", targetDate: "2025-12-31", criterion: { maxCount: 2, perPeriods: 1, periodType: "30 day periods", consecPeriods: 3, acrossPeriods: 3, acrossPeriodType: "Thirty (30) Day Periods" }, antecedents: ["Demand placed", "Transition", "Denied access", "Staff change"], consequences: ["Verbal redirection", "Offered choices", "Space provided"], prevention: ["Transition warnings", "Visual schedule", "Choice boards"], tallies: {} },
    { id: "bd2", resId: "r1", domain: "Elopement", qualifier: "From Supervised Area", severity: "Severe", method: "Frequency", status: "Active", defs: ["Leaving supervised area without staff permission"], baseline: "1-2 per month", startDate: "2025-01-01", targetDate: "2025-12-31", criterion: { maxCount: 0, perPeriods: 1, periodType: "30 day periods", consecPeriods: 3, acrossPeriods: 3, acrossPeriodType: "Thirty (30) Day Periods" }, antecedents: ["Unstructured time", "Loud environment", "Peer conflict"], consequences: ["Staff followed", "Verbal prompts to return", "Debriefing"], prevention: ["Increased supervision", "Environmental modifications"], tallies: {} },
    ,
    { id: "bd3", resId: "r3", domain: "Anxiety Behaviors", qualifier: "Verbal/Physical", severity: "Moderate", method: "Frequency", status: "Active", defs: ["Verbalizing worry or fear repeatedly", "Pacing or hand wringing", "Refusing to participate in activities due to stated fear"], baseline: "Avg 3 episodes per week in Dec 2025", startDate: "2026-01-01", targetDate: "2026-12-31", criterion: { maxCount: 1, perPeriods: 1, periodType: "Seven (7) Day Periods", consecPeriods: 4, acrossPeriods: 4, acrossPeriodType: "Seven (7) Day Periods" }, antecedents: ["Schedule changes", "New environments", "Loud noises", "Unfamiliar staff"], consequences: ["Deep breathing exercise", "Sensory break offered", "Verbal reassurance", "Choice board presented"], prevention: ["Visual schedule posted", "Transition warnings (5 min, 2 min)", "Consistent staff assignment", "Noise-canceling headphones available"], tallies: {} },
    { id: "bd4", resId: "r4", domain: "Elopement", qualifier: "From Designated Area", severity: "Severe", method: "Frequency", status: "Active", defs: ["Leaving or attempting to leave a supervised/designated area without staff permission or knowledge", "Climbing or attempting to climb fences or barriers", "Running toward exits or open gates"], baseline: "Avg 2 attempts per month in Nov-Dec 2025", startDate: "2026-01-01", targetDate: "2026-12-31", criterion: { maxCount: 0, perPeriods: 1, periodType: "Thirty (30) Day Periods", consecPeriods: 4, acrossPeriods: 4, acrossPeriodType: "Thirty (30) Day Periods" }, antecedents: ["Unstructured outdoor time", "Gate left unlocked", "Hearing cars/trucks", "Transition from preferred activity"], consequences: ["Staff immediate redirect", "Verbal prompt to return", "Preferred item offered upon return", "Debrief with visual social story"], prevention: ["Gate alarm activated", "1:1 staffing during outdoor time", "Visual boundary markers", "Preferred activities available in yard", "Noise-canceling headphones near road"], tallies: {} }
  ]);
  const [viewBehDomain, setViewBehDomain] = useState(null);
  const [editBehDomain, setEditBehDomain] = useState(null);
  const [progSections, setProgSections] = useState({ behActive: true, behInactive: false, skillActive: true, skillInactive: false, events: false });
  const [aptAlerts, setAptAlerts] = useState([]);
  const [ippDocs, setIppDocs] = useState([{ id: "ipp-demo1", resId: "r3", d: "2026-01-15", by: "sa1", filename: "SarahMitchell-IPP-2026.pdf", active: true, summary: "AI Review (2026-01-15): IPP for Sarah Mitchell uploaded. Key objectives: (1) Reduce anxiety episodes from 3/week to 1/week through deep breathing and scheduled sensory breaks. (2) Increase independence in meal preparation from 40% to 75%. (3) Community integration goal: 3 outings/week with fading staff support. (4) Medication management: self-administer AM meds with verbal prompt only. Behavioral support focuses on antecedent strategies and positive reinforcement. Review date: July 2026." }, { id: "ipp-demo2", resId: "r4", d: "2026-02-01", by: "sa1", filename: "DavidReyes-IPP-2026.pdf", active: true, summary: "AI Review (2026-02-01): IPP for David Reyes uploaded. Key objectives: (1) Zero elopement attempts for 4 consecutive months through environmental modifications and 1:1 outdoor supervision. (2) Increase daily living skills independence \u2014 hand washing from 60% to 90%, table setting from 30% to 70%. (3) Communication: expand functional vocabulary from 50 to 100 words using communication board + verbal. (4) Seizure management: maintain seizure-free status; all staff trained on rescue protocol. Behavioral support uses antecedent strategies, visual schedules, and positive reinforcement. Review date: August 2026." }]);
  const [ippPrompt, setIppPrompt] = useState(null);
  const curMonth = (/* @__PURE__ */ new Date()).getFullYear() + "-" + String((/* @__PURE__ */ new Date()).getMonth() + 1).padStart(2, "0");
  const [weightRecs, setWeightRecs] = useState([
    { id: "w1", resId: "r1", month: "2026-01", weight: 185, d: "2026-01-03", t: "8:30 AM", by: "s2" },
    { id: "w2", resId: "r1", month: "2026-02", weight: 183, d: "2026-02-02", t: "9:00 AM", by: "s2" },
    { id: "w3", resId: "r2", month: "2026-01", weight: 162, d: "2026-01-04", t: "8:45 AM", by: "s4" },
    { id: "w4", resId: "r2", month: "2026-02", weight: 164, d: "2026-02-03", t: "9:15 AM", by: "s4" }
  ]);
  const [bpRecs, setBpRecs] = useState(() => {
    const seed = [];
    const rIds = ["r1", "r2"];
    const sIds = ["s2", "s4", "s5"];
    for (let i = 0; i < 14; i++) {
      const dd = /* @__PURE__ */ new Date();
      dd.setDate(dd.getDate() - i);
      const ds = dd.toISOString().slice(0, 10);
      rIds.forEach((rid) => {
        const cnt = Math.random() < 0.3 ? 1 : Math.random() < 0.6 ? 2 : 3;
        for (let j = 0; j < cnt; j++) {
          const hr2 = [6, 8, 10, 12, 14, 16, 18, 20][Math.floor(Math.random() * 8)];
          const sys = Math.round(110 + Math.random() * 40);
          const dia = Math.round(65 + Math.random() * 25);
          const pulse = Math.round(60 + Math.random() * 30);
          seed.push({ id: "bp" + i + "_" + rid + j, resId: rid, sys, dia, pulse, d: ds, t: hr2 + ":" + String(Math.floor(Math.random() * 60)).padStart(2, "0") + (hr2 >= 12 ? " PM" : " AM"), by: sIds[Math.floor(Math.random() * sIds.length)] });
        }
      });
    }
    return seed;
  });
  const [bsRecs, setBsRecs] = useState(() => {
    const seed = [];
    const rIds = ["r1", "r2"];
    const sIds = ["s2", "s4"];
    const meals = ["Fasting", "Before Meal", "After Meal", "Bedtime"];
    for (let i = 0; i < 14; i++) {
      const dd = /* @__PURE__ */ new Date();
      dd.setDate(dd.getDate() - i);
      const ds = dd.toISOString().slice(0, 10);
      rIds.forEach((rid) => {
        const cnt = Math.random() < 0.4 ? 1 : 2;
        for (let j = 0; j < cnt; j++) {
          const hr2 = [6, 8, 11, 13, 17, 21][Math.floor(Math.random() * 6)];
          const level = Math.round(80 + Math.random() * 100);
          seed.push({ id: "bs" + i + "_" + rid + j, resId: rid, level, meal: meals[Math.floor(Math.random() * meals.length)], d: ds, t: hr2 + ":" + String(Math.floor(Math.random() * 60)).padStart(2, "0") + (hr2 >= 12 ? " PM" : " AM"), by: sIds[Math.floor(Math.random() * sIds.length)] });
        }
      });
    }
    return seed;
  });
  const [vitalsTab, setVitalsTab] = useState("weight");
  const [bType, setBType] = useState(null);
  const [bSize, setBSize] = useState(null);
  const [bTime, setBTime] = useState("");
  const [uploadPrompt, setUploadPrompt] = useState(null);
  const [resFiles, setResFiles] = useState([]);
  const [actFilter, setActFilter] = useState({ type: "all", staff: "all", dateFrom: "" });
  const [shiftNoteForm, setShiftNoteForm] = useState(null);
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const COMM_METHODS = ["Verbal", "Signed", "Gestured", "Icon/Picture", "Staff Selected"];
  const [meetings, setMeetings] = useState([]);
  const [meetingSchedule, setMeetingSchedule] = useState({ day: "Thursday", time: "10:00", homeId: "SCH" });
  const [mealCalendar, setMealCalendar] = useState([]);
  const [externalLinks, setExternalLinks] = useState({ mealSheet: "", meetingSheet: "", otherLinks: [] });
  const [meetingForm, setMeetingForm] = useState(null);
  const isMeetingDue = () => {
    const d = /* @__PURE__ */ new Date();
    const dow = d.getDay();
    const schedDow = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(meetingSchedule.day);
    if (dow !== schedDow) return false;
    const done = meetings.find((m2) => m2.d === today && m2.homeId === meetingSchedule.homeId);
    return !done;
  };
  const [rptSubmitted, setRptSubmitted] = useState([]);
  const getReportSchedule = (dob) => {
    const bm = parseInt(dob.split("-")[1]);
    return [{ type: "Annual", mo: bm }, { type: "Q1", mo: (bm - 1 + 3) % 12 + 1 }, { type: "Q2", mo: (bm - 1 + 6) % 12 + 1 }, { type: "Q3", mo: (bm - 1 + 9) % 12 + 1 }];
  };
  const moNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [reportTab, setReportTab] = useState("quarterly");
  const [reportRange, setReportRange] = useState({ from: "", to: "" });
  const [reportQtr, setReportQtr] = useState(() => {
    const q = Math.ceil(((/* @__PURE__ */ new Date()).getMonth() + 1) / 3);
    return (/* @__PURE__ */ new Date()).getFullYear() + "-Q" + q;
  });
  const [knownLocs, setKnownLocs] = useState(["Bathroom", "Bedroom", "Living Room", "Kitchen", "Dining Room", "Hallway", "Outside", "Program Area", "Shower"]);
  const [knownStaffInv, setKnownStaffInv] = useState(["Garza, Vanessa", "Bigler, Crystal", "Khan, Aaron", "Lawal, Jacob", "Dad, Sajad"]);
  const [knownResPres, setKnownResPres] = useState(["K., Dan", "W., Michael"]);
  const [resSubTab, setResSubTab] = useState("dash");
  const [memos, setMemos] = useState([
    { id: "mm1", text: "All staff must complete fire drill training by March 5th.", by: "s1", d: "2026-02-26", acks: [] },
    { id: "mm2", text: "New visitor sign-in policy effective immediately. See binder.", by: "s1", d: "2026-02-27", acks: [] },
    ,
    { id: "memo-demo1", d: "2026-03-13", t: "8:00 AM", by: "sa1", text: "TRAINING MEMO \u2014 Training Demo Home\n\nWelcome to Team ISR! This is a training environment with demo clients.\n\nSarah Mitchell \u2014 47yo female. Dx: Intellectual Disability, Anxiety, Hypothyroidism. Allergies: Amoxicillin, Peanuts (SEVERE). 4 medications. Anxiety management plan.\n\nDavid Reyes \u2014 33yo male. Dx: Autism (Level 2), Epilepsy, GERD. Allergies: Phenytoin (SEVERE), Dairy. 5 medications including seizure rescue. Elopement risk.\n\nReview each profile, MAR, behavior plans, IPP, and appointments. Practice shift notes, behavior logging, and medication administration.\n\nOriginal: Welcome to Team ISR! Please review each resident's profile, medications, and behavior plans before your first shift. All staff must complete the shift walkthrough checklist at the start and end of each shift. Contact your manager with any questions.", acks: ["sa1"], urgent: true, homeIds: ["TRAIN"] }
  ]);
  const [memoForm, setMemoForm] = useState({ text: "", type: "other", homeIds: [], urgent: true });
  const [tick, setTick] = useState(0);
  const [sheetsUrl, setSheetsUrl] = useState(() => {
    try {
      return localStorage.getItem("ba_sheets_url") || "";
    } catch (e) {
      return "";
    }
  });
  const [sheetsStatus, setSheetsStatus] = useState(null);
  const [lastSheetSync, setLastSheetSync] = useState(() => {
    try {
      return localStorage.getItem("ba_last_sync") || "";
    } catch (e) {
      return "";
    }
  });
  const exportToSheets = useCallback((url) => {
    if (!url) return;
    const payload = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      staff: staff.map((s) => ({ id: s.id, name: s.first + " " + s.last, role: s.role, homes: s.homes })),
      residents: residents.map((r2) => ({ id: r2.id, name: fullName(r2.name), dob: r2.dob, uci: r2.uci, home: r2.home, diagnosis: (r2.diagnosis || []).join("; "), allergies: r2.allergies.map((a) => a.name).join("; "), weight: (weightRecs.filter((w) => w.resId === r2.id).sort((a, b) => b.d.localeCompare(a.d))[0] || {}).weight || "" })),
      medications: meds.filter((m) => m.status === "active").map((m) => ({ resident: (residents.find((r2) => r2.id === m.resId) || {}).name || "", med: m.name, dose: m.dose, route: m.route, freq: m.freq, times: (m.times || []).join(","), doctor: m.doctor })),
      behaviors: tallies.slice(-100).map((t) => ({ resident: (residents.find((r2) => r2.id === (t.resId || "r1")) || {}).name || "", type: t.b, date: t.d, time: t.t, location: t.note ? t.note.location : "", staff: gn(t.by) })),
      vitals_bp: bpRecs.slice(-50).map((b) => ({ resident: (residents.find((r2) => r2.id === b.resId) || {}).name || "", sys: b.sys, dia: b.dia, pulse: b.pulse, date: b.d, time: b.t, staff: gn(b.by) })),
      vitals_bs: bsRecs.slice(-50).map((b) => ({ resident: (residents.find((r2) => r2.id === b.resId) || {}).name || "", level: b.level, meal: b.meal, date: b.d, time: b.t, staff: gn(b.by) })),
      weights: weightRecs.map((w) => ({ resident: (residents.find((r2) => r2.id === w.resId) || {}).name || "", weight: w.weight, month: w.month, date: w.d, staff: gn(w.by) })),
      dutyLogs: dutyLogs.slice(-200).map((dl) => ({ home: (HOMES.find((h) => h.id === dl.homeId) || {}).name || "", task: dl.task, date: dl.d, time: dl.time, done: dl.done ? "Yes" : "No", staff: dl.done ? gn(dl.by) : "" })),
      medChanges: residents.flatMap((r2) => (r2.medChanges || []).map((mc) => ({ resident: fullName(r2.name), type: mc.type, note: mc.note, severity: mc.sev, date: mc.d })))
    };
    setSheetsStatus("sending");
    fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).then(() => {
      const ts = (/* @__PURE__ */ new Date()).toLocaleString();
      setSheetsStatus("ok");
      setLastSheetSync(ts);
      try {
        localStorage.setItem("ba_last_sync", ts);
      } catch (e) {
      }
    }).catch((err) => {
      setSheetsStatus("error");
      console.error("Sheets sync error:", err);
    });
  }, [staff, residents, meds, tallies, bpRecs, bsRecs, weightRecs, dutyLogs]);
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 1e3);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => {
    if (!sheetsUrl) return;
    const checkTime = () => {
      const now = /* @__PURE__ */ new Date();
      if (now.getHours() === 23 && now.getMinutes() === 59 && now.getSeconds() < 2) {
        const todayStr = now.toISOString().slice(0, 10);
        if (lastSheetSync && lastSheetSync.includes(todayStr)) return;
        exportToSheets(sheetsUrl);
      }
    };
    const iv = setInterval(checkTime, 3e4);
    return () => clearInterval(iv);
  }, [sheetsUrl, lastSheetSync, exportToSheets]);
  useEffect(() => {
    if (!user) return;
    const now = /* @__PURE__ */ new Date();
    const curMonth2 = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    const prevRecs = marRecs.filter((r) => r.d && r.d.slice(0, 7) !== curMonth2);
    if (prevRecs.length > 0) {
      const months = [...new Set(prevRecs.map((r) => r.d.slice(0, 7)))];
      months.forEach((mo) => {
        const moRecs = prevRecs.filter((r) => r.d.slice(0, 7) === mo);
        const resIds = [...new Set(moRecs.map((r) => {
          const m = meds.find((mx) => mx.name === r.med);
          return m ? m.resId : "r1";
        }))];
        resIds.forEach((rid) => {
          const exists = marArchive.find((a) => a.month === mo && a.resId === rid);
          if (!exists) {
            const rMoRecs = moRecs.filter((r) => {
              const m = meds.find((mx) => mx.name === r.med);
              return m ? m.resId === rid : rid === "r1";
            });
            setMarArchive((p) => [...p, { month: mo, resId: rid, records: rMoRecs, medsSnapshot: meds.filter((m) => m.resId === rid).map((m) => ({ name: m.name, dose: m.dose, route: m.route, freq: m.freq, times: m.times, instr: m.instr, doctor: m.doctor, status: m.status })) }]);
          }
        });
      });
      setMarRecs((p) => p.filter((r) => r.d && r.d.slice(0, 7) === curMonth2));
    }
  }, [user, marRecs.length]);
  const getNextMedTime = (resMeds2) => {
    const now = /* @__PURE__ */ new Date();
    let nearest = null;
    let nearestDiff = Infinity;
    resMeds2.forEach((m) => {
      if (m.status !== "active" || m.freq === "PRN") return;
      m.times.forEach((t) => {
        const [h, mn] = t.split(":").map(Number);
        const medTime = /* @__PURE__ */ new Date();
        medTime.setHours(h, mn, 0, 0);
        const diff = medTime - now;
        if (Math.abs(diff) < Math.abs(nearestDiff)) {
          nearest = medTime;
          nearestDiff = diff;
        }
      });
    });
    if (!nearest) return null;
    const mins = Math.round(nearestDiff / 6e4);
    const absMins = Math.abs(mins);
    const hrs = Math.floor(absMins / 60);
    const rm = absMins % 60;
    const label = hrs > 0 ? hrs + "h " + rm + "m" : rm + "m";
    return { mins, label, overdue: mins < 0, within1hr: mins >= 0 && mins <= 60, overdueHrs: mins < 0 ? absMins / 60 : 0 };
  };
  const unackedMemos = memos.filter((m) => !m.acks.includes(user ? user.id : ""));
  const perms = user ? getPerms(user.role) : {};
  const cm = user && perms.editMeds;
  const isA = user && user.role === "System Admin";
  const isM = user && user.role === "Manager";
  const isAM = isA || isM;
  const isS = user && user.role === "Scheduler";
  const isVA = user && user.role === "CarehomeVA";
  const [prnAlarmActive, setPrnAlarmActive] = useState(false);
  const prnAlarmRef = useRef(null);
  const playPrnAlarm = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const play = (freq, start, dur, vol) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = freq;
        o.type = "square";
        g.gain.setValueAtTime(vol, ctx.currentTime + start);
        g.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + start + dur);
        o.start(ctx.currentTime + start);
        o.stop(ctx.currentTime + start + dur);
      };
      play(880, 0, 0.12, 0.3);
      play(1100, 0.15, 0.12, 0.3);
      play(880, 0.3, 0.12, 0.3);
      play(1100, 0.45, 0.12, 0.3);
      play(1320, 0.6, 0.2, 0.35);
      play(880, 0.85, 0.12, 0.3);
      play(1100, 1, 0.12, 0.3);
      play(1320, 1.15, 0.2, 0.35);
    } catch (e) {
    }
  }, []);
  useEffect(() => {
    if (!user) return;
    const iv = setInterval(() => {
      const due = prnFollowUps.filter((f) => !f.dismissed && f.by === user.id && Date.now() >= f.dueAt);
      if (due.length > 0) {
        setPrnAlarmActive(true);
        playPrnAlarm();
      } else setPrnAlarmActive(false);
    }, 3e4);
    const t = setTimeout(() => {
      const due = prnFollowUps.filter((f) => !f.dismissed && f.by === user.id && Date.now() >= f.dueAt);
      if (due.length > 0) {
        setPrnAlarmActive(true);
        playPrnAlarm();
      }
    }, 2e3);
    return () => {
      clearInterval(iv);
      clearTimeout(t);
    };
  });
  const gn = (id) => {
    const s = staff.find((x) => x.id === id);
    if (!s) return "Unknown";
    return s.first && s.last ? s.last + ", " + s.first : s.name || "Unknown";
  };
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const hr = (/* @__PURE__ */ new Date()).getHours();
  const curShift = hr < 8 ? "NOC" : hr < 16 ? "AM" : "PM";
  const shiftLabel = { NOC: "12am\u20138am", AM: "8am\u20134pm", PM: "4pm\u201312am" };
  const shiftDoneToday = walkthroughs.some((w) => w.d === today && w.shift === curShift && w.complete);
  const isHeldNow = (m) => {
    if (m.status !== "hold" || !m.holdData) return true;
    const hd = m.holdData;
    if (!hd.fromDate || !hd.toDate) return true;
    const now = /* @__PURE__ */ new Date();
    const from = /* @__PURE__ */ new Date(hd.fromDate + "T" + (hd.fromTime || "00:00"));
    const to = /* @__PURE__ */ new Date(hd.toDate + "T" + (hd.toTime || "23:59"));
    return now >= from && now <= to;
  };
  const isOnHV = (resId) => {
    const r = residents.find((x) => x.id === resId);
    if (!r || !r.hvData) return false;
    const now = /* @__PURE__ */ new Date();
    const from = /* @__PURE__ */ new Date(r.hvData.fromDate + "T" + (r.hvData.fromTime || "00:00"));
    const to = /* @__PURE__ */ new Date(r.hvData.toDate + "T" + (r.hvData.toTime || "23:59"));
    return now >= from && now <= to;
  };
  const dueMeds = (f) => {
    const a = meds.filter((m) => m.status !== "dcd" && !(m.status === "hold" && isHeldNow(m)) && !isOnHV(m.resId));
    if (f === "all") return a;
    if (f === "prn") return a.filter((m) => m.freq === "PRN");
    return a.filter((m) => {
      if (m.freq === "PRN") return false;
      return m.times.some((t) => Math.abs(hr - parseInt(t)) <= 2);
    });
  };
  const allergyCheck = (n) => {
    const r = residents.find((x) => x.id === selRes) || residents[0];
    const lc = n.toLowerCase();
    return r.allergies.filter((a) => a.type === "medication").find((a) => {
      const al = a.name.toLowerCase();
      return (lc.includes("penicillin") || lc.includes("amoxicillin")) && al.includes("penicillin") || lc.includes("sulfa") && al.includes("sulfa");
    });
  };
  const getMedStatus = (m) => isOnHV(m.resId) ? "homeVisit" : m.status === "hold" && isHeldNow(m) ? "hold" : m.status || "active";
  const [adminOvr, setAdminOvr] = useState({ type: null, med: null, staffId: "", prnReason: "", followResult: "", prnRecId: null, confirmed: false, qty: "1" });
  const adminMed = (m, sTime) => {
    if (isAM) {
      setAdminOvr({ type: "mar", med: m, sTime: sTime || "", staffId: "", prnReason: "", followResult: "", prnRecId: null, confirmed: false, qty: String(m.tabsPerDose || 1) });
      setModal("adminOvr");
    } else setMarRecs((p) => [...p, { med: m.name, d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), sTime: sTime || "", by: user.id, qty: m.tabsPerDose || 1 }]);
  };
  const adminPrn = (m) => {
    if (isAM) {
      setAdminOvr({ type: "prn", med: m, staffId: "", prnReason: "", followResult: "", prnRecId: null, confirmed: false });
      setModal("adminOvr");
    } else {
      setPrnForm({ medId: m.id, reason: "" });
      setModal("prnGive");
    }
  };
  const adminPrnFollow = (prnId) => {
    if (isAM) {
      setAdminOvr({ type: "prnFollow", med: null, staffId: "", prnReason: "", followResult: "", prnRecId: prnId, confirmed: false });
      setModal("adminOvr");
    } else {
      setPrnFollowForm({ prnId, result: "" });
      setModal("prnFollow");
    }
  };
  const genMARHTML = (archMonth) => {
    const r = residents.find((x) => x.id === selRes) || residents[0];
    const rm2 = archMonth ? (marArchive.find((a) => a.month === archMonth && a.resId === r.id) || {}).medsSnapshot || [] : meds.filter((m) => m.resId === (selRes || "r1"));
    const mo = archMonth || (/* @__PURE__ */ new Date()).getFullYear() + "-" + String((/* @__PURE__ */ new Date()).getMonth() + 1).padStart(2, "0");
    const [yr, mn] = mo.split("-");
    const moName = new Date(parseInt(yr), parseInt(mn) - 1).toLocaleString("en-US", { month: "long" }).toUpperCase();
    const days = new Date(parseInt(yr), parseInt(mn), 0).getDate();
    const recs = archMonth ? (marArchive.find((a) => a.month === archMonth && a.resId === r.id) || {}).records || [] : marRecs.filter((mr) => mr.d && mr.d.startsWith(mo));
    const hm = HOMES.find((hx) => hx.id === r.home) || {};
    const doctors = [...new Set((archMonth ? rm2 : meds.filter((m) => m.resId === (selRes || "r1"))).map((m) => m.doctor).filter(Boolean))];
    let h = "<style>@page{size:landscape;margin:.3in}body{font:9px sans-serif;padding:0;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}table{border-collapse:collapse;width:100%;margin:4px 0}th,td{border:1px solid #333;padding:1px 2px;text-align:center;font-size:7px}th{background:#e0e0e0;font-weight:700;font-size:6.5px}.hdr{text-align:center;font-size:16px;font-weight:700;border:2px solid #000;padding:6px;margin-bottom:2px}.info{font-size:9px;border:2px solid #000;border-top:none;padding:4px 8px}.al{background:#ffe0e0;border:2px solid #c00;padding:3px 8px;font-weight:700;color:#c00;font-size:8px;margin:2px 0}.doc{font-size:8px;padding:3px 8px;border:1px solid #999;margin:2px 0;background:#f0f8ff}td.ini{font-weight:700;color:#1a6b1a;font-size:7px}td.med{text-align:left;font-size:7px;font-weight:600;white-space:nowrap;max-width:80px;overflow:hidden}td.dose{font-size:7px;white-space:nowrap}td.time{font-size:7px}</style>";
    h += "<div class='hdr'>MEDICATION ADMINISTRATION RECORD \u2014 " + moName + " " + yr + "</div>";
    h += "<div class='info'>Resident: <b>" + fullName(r.name) + "</b> | DOB: " + r.dob + " | UCI#: " + (r.uci || "") + " | Home: " + (hm.full || "") + " | Room: " + (r.room || "") + "</div>";
    if (r.diagnosis && r.diagnosis.length) h += "<div style='font-size:8px;border:1px solid #999;border-top:none;padding:2px 8px'><b>Dx:</b> " + r.diagnosis.join(", ") + "</div>";
    h += "<div class='al'>ALLERGIES: " + (r.allergies.length ? r.allergies.map((a) => a.name + " (" + a.reaction + " - " + a.sev + ")").join(" | ") : "NKDA") + "</div>";
    h += "<div class='doc'><b>Physicians:</b> " + (doctors.length ? doctors.join(" | ") : "None listed") + "</div>";
    h += "<table><tr><th style='text-align:left;min-width:80px'>Medication</th><th style='min-width:40px'>Dose</th><th style='min-width:30px'>Route</th><th style='min-width:30px'>Freq</th><th style='min-width:28px'>Time</th>";
    for (let d = 1; d <= days; d++) h += "<th style='width:18px'>" + d + "</th>";
    h += "</tr>";
    const activeMeds = (archMonth ? rm2 : rm2.filter((m) => m.status !== "dcd")).filter((m) => m.freq !== "PRN");
    activeMeds.forEach((m) => {
      (m.times && m.times.length ? m.times : [""]).forEach((t, ti) => {
        const mtc = t ? getMTC(t) : null;
        const rowBg = mtc ? mtc.bgL : "";
        h += "<tr" + (rowBg ? " style='background:" + rowBg + "'" : "") + "><td class='med'" + (mtc ? " style='border-left:3px solid " + mtc.hex + "'" : "") + ">" + (ti === 0 ? m.name : "") + "</td><td class='dose'>" + (ti === 0 ? m.dose : "") + "</td><td class='dose'>" + (ti === 0 ? (m.route || "").replace("By Mouth", "PO") : "") + "</td><td class='dose'>" + (ti === 0 ? m.freq : "") + "</td><td class='time'" + (mtc ? " style='background:" + mtc.bg + ";color:" + mtc.hex + ";font-weight:700'" : "") + ">" + (t || "") + "</td>";
        for (let d = 1; d <= days; d++) {
          const dt = mo + "-" + String(d).padStart(2, "0");
          const rec = recs.find((r2) => r2.med === m.name && r2.d === dt && r2.sTime === t);
          const code = m.status === "hold" ? "H" : rec ? pureInit(gn(rec.by)) : "";
          const bg = m.status === "hold" ? "#fff3cd" : mtc ? mtc.bgL : "";
          h += "<td class='ini' style='" + (bg ? "background:" + bg + ";" : "") + (rec ? "color:#1a6b1a" : "") + "'>" + code + "</td>";
        }
        h += "</tr>";
      });
    });
    const prnMeds = (archMonth ? rm2 : rm2.filter((m) => m.status !== "dcd")).filter((m) => m.freq === "PRN");
    if (prnMeds.length) {
      h += "<tr><td colspan='" + (5 + days) + "' style='background:#e8f4fd;font-weight:700;text-align:left;font-size:8px;padding:3px 6px'>PRN MEDICATIONS</td></tr>";
      prnMeds.forEach((m) => {
        h += "<tr><td class='med'>" + m.name + "</td><td class='dose'>" + m.dose + "</td><td class='dose'>" + (m.route || "").replace("By Mouth", "PO") + "</td><td class='dose'>PRN</td><td class='time'></td>";
        for (let d = 1; d <= days; d++) {
          const dt = mo + "-" + String(d).padStart(2, "0");
          const prnGiven = prnRecs.filter((p) => p.medName === m.name && p.d === dt).length;
          h += "<td class='ini'" + (prnGiven ? " style='color:#1a6b1a'" : "") + ">" + (prnGiven ? prnGiven : "") + "</td>";
        }
        h += "</tr>";
      });
    }
    h += "</table>";
    const usedTimes = [...new Set(activeMeds.flatMap((m) => m.times || []))].sort();
    if (usedTimes.length > 1) {
      h += "<div style='margin-top:4px;font-size:7px;display:flex;gap:6px;flex-wrap:wrap'><b>Time Colors:</b>";
      usedTimes.forEach((t) => {
        const mtc = getMTC(t);
        if (mtc) h += "<span style='display:inline-block;padding:1px 5px;border-radius:3px;background:" + mtc.bg + ";color:" + mtc.hex + ";font-weight:700'>" + t + " = " + mtc.label + "</span>";
      });
      h += "</div>";
    }
    h += "<div style='margin-top:4px;font-size:7px'><b>Key:</b> Staff initials = Administered | H = On Hold | Number = PRN count given</div>";
    const usedStaffIds = [...new Set(recs.map((r2) => r2.by).concat(prnRecs.filter((p) => rm2.some((m2) => m2.name === p.medName)).map((p) => p.by)))];
    h += "<div style='margin-top:8px;border:2px solid #000;padding:0'>";
    h += "<div style='background:#000;color:#fff;padding:4px 8px;font-size:9px;font-weight:700'>STAFF IDENTIFICATION \u2014 MEDICATION ADMINISTRATION</div>";
    h += "<table style='margin:0;width:100%'><tr><th style='text-align:center;width:60px;background:#e8e8e8'>Initials</th><th style='text-align:left;background:#e8e8e8'>First Name</th><th style='text-align:left;background:#e8e8e8'>Last Name</th><th style='text-align:left;background:#e8e8e8'>Title</th></tr>";
    if (usedStaffIds.length) {
      usedStaffIds.forEach((id) => {
        const s = staff.find((x) => x.id === id);
        if (s) {
          h += "<tr><td style='text-align:center;font-weight:700;font-size:10px'>" + pureInit(gn(id)) + "</td><td style='text-align:left;font-size:9px'>" + (s.first || "") + "</td><td style='text-align:left;font-size:9px'>" + (s.last || "") + "</td><td style='text-align:left;font-size:9px'>" + (s.role || "Staff") + "</td></tr>";
        }
      });
    } else {
      for (let si = 0; si < 4; si++) h += "<tr><td>&nbsp;</td><td></td><td></td><td></td></tr>";
    }
    h += "</table></div>";
    h += "<div style='margin-top:10px;display:flex;gap:40px'><div><div style='border-bottom:1px solid #000;width:200px;height:20px'></div><div style='font-size:8px;margin-top:2px'>Manager Signature</div></div><div><div style='border-bottom:1px solid #000;width:120px;height:20px'></div><div style='font-size:8px;margin-top:2px'>Date</div></div></div>";
    const fn2 = "MAR-" + fullName(r.name).replace(/[^a-zA-Z]/g, "") + "-" + moName + yr + ".html";
    return { html: h, filename: fn2 };
  };
  const printMAR = (archMonth) => {
    const { html, filename } = genMARHTML(archMonth);
    doPrint(html, filename);
  };
  const dlMAR = (archMonth) => {
    const { html, filename } = genMARHTML(archMonth);
    downloadHTML(html, filename);
  };
  const printMedList = () => {
    const r = residents.find((x) => x.id === selRes) || residents[0];
    const rm2 = meds.filter((m) => m.resId === (selRes || "r1"));
    const hm = HOMES.find((hx) => hx.id === r.home) || {};
    let h = "<style>@page{size:landscape;margin:0.4in}body{font:10px Arial;padding:0}table{border-collapse:collapse;width:100%;margin:6px 0}th,td{border:1px solid #999;padding:4px 6px;font-size:9px;vertical-align:top;text-align:left}th{background:#e8e8e8;font-weight:700}.al{background:#ffe0e0;border:2px solid #c00;padding:5px 8px;font-weight:700;color:#c00;font-size:9px;margin:4px 0}.b{font-weight:700}</style>";
    h += "<h2 style='font-size:14px;margin:4px 0'>CURRENT MEDICATION LIST</h2>";
    h += "<div style='font-size:10px;margin-bottom:4px'>Resident: <b>" + fullName(r.name) + "</b> | DOB: " + r.dob + " | Home: " + (hm.full || "") + " | Printed: " + today + " by " + user.name + "</div>";
    if (r.diagnosis && r.diagnosis.length) h += "<div style='font-size:9px;margin-bottom:3px'><b>DIAGNOSIS:</b> " + r.diagnosis.join(", ") + "</div>";
    h += "<div class='al'>ALLERGIES: " + r.allergies.map((a) => a.name + " (" + a.reaction + " - " + a.sev + ")").join(" | ") + "</div>";
    h += "<h3 style='font-size:11px;margin:8px 0 3px'>Active Medications</h3><table><tr><th>Medication</th><th>Generic</th><th>Dose</th><th>Route</th><th>Frequency</th><th>Times</th><th>Instructions</th><th>Prescribing Doctor</th><th>Rx#</th><th>Reason</th></tr>";
    rm2.filter((m) => m.status === "active").forEach((m) => h += "<tr><td class='b'>" + m.name + "</td><td>" + (m.gen || "") + "</td><td>" + m.dose + "</td><td>" + m.route + "</td><td>" + m.freq + "</td><td>" + (m.times || []).join(", ") + "</td><td style='font-size:8px'>" + (m.instr || "") + "</td><td>" + (m.doctor || "") + "</td><td>" + (m.rx || "") + "</td><td style='font-size:8px'>" + (m.reason || "") + "</td></tr>");
    h += "</table>";
    const held = rm2.filter((m) => m.status === "hold");
    if (held.length) {
      h += "<h3 style='font-size:11px;margin:8px 0 3px;color:#b8860b'>On Hold</h3><table><tr><th>Medication</th><th>Dose</th><th>Reason</th></tr>";
      held.forEach((m) => h += "<tr><td class='b'>" + m.name + "</td><td>" + m.dose + "</td><td>" + (m.holdData ? m.holdData.reason : "On Hold") + "</td></tr>");
      h += "</table>";
    }
    const dcd = rm2.filter((m) => m.status === "dcd");
    if (dcd.length) {
      h += "<h3 style='font-size:11px;margin:8px 0 3px;color:#c00'>Discontinued</h3><table><tr><th>Medication</th><th>Dose</th></tr>";
      dcd.forEach((m) => h += "<tr><td style='text-decoration:line-through'>" + m.name + "</td><td>" + m.dose + "</td></tr>");
      h += "</table>";
    }
    h += "<div style='margin-top:16px;display:flex;justify-content:space-between'><div><div style='border-bottom:1px solid #000;width:200px;height:18px'></div><div style='font-size:8px'>Staff Signature</div></div><div><div style='border-bottom:1px solid #000;width:120px;height:18px'></div><div style='font-size:8px'>Date</div></div><div><div style='border-bottom:1px solid #000;width:200px;height:18px'></div><div style='font-size:8px'>Manager Signature</div></div></div>";
    doPrint(h, "MedList-" + fullName(r.name).replace(/[^a-zA-Z]/g, "") + "-" + today + ".html");
  };
  if (!user) return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: C.font, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 } }, /* @__PURE__ */ React.createElement("style", null, "@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes memoFlash{from{opacity:1}to{opacity:0.3}}@keyframes flash{0%,100%{opacity:1}50%{opacity:.3}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}input:focus,select:focus,textarea:focus{outline:none;border-color:" + C.blue + "!important;box-shadow:0 0 0 3px rgba(0,122,255,.12)!important}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}button{-webkit-appearance:none;touch-action:manipulation}::-webkit-scrollbar{width:0;display:none}"), /* @__PURE__ */ React.createElement("div", { style: { background: C.card, borderRadius: 24, padding: "30px 24px", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,.3)" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 28, color: "#fff" } }, "\u{1F3E0}"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: C.tx } }, "Team ISR"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, "Individual Support Record")), loginMode === "setPassword" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: C.pur } }, "Create Your Password"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, "Welcome ", loginEmail, "! Set a personal password.")), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: C.tx3, display: "block", marginBottom: 3 } }, "New Password"), /* @__PURE__ */ React.createElement("input", { type: "password", value: loginPass, onChange: (e) => setLoginPass(e.target.value), placeholder: "Create your password", style: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid " + C.sepL, fontSize: 15, fontFamily: C.font, boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: C.tx3, display: "block", marginBottom: 3 } }, "Confirm Password"), /* @__PURE__ */ React.createElement("input", { type: "password", value: pin, onChange: (e) => setPin(e.target.value), placeholder: "Confirm password", style: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid " + C.sepL, fontSize: 15, fontFamily: C.font, boxSizing: "border-box" }, onKeyDown: (e) => {
    if (e.key === "Enter") document.getElementById("set-pw-btn")?.click();
  } })), pinErr && /* @__PURE__ */ React.createElement("div", { style: { color: C.red, fontSize: 12, textAlign: "center", marginBottom: 8 } }, pinErr), /* @__PURE__ */ React.createElement("button", { id: "set-pw-btn", onClick: () => {
    if (!loginPass || loginPass.length < 6) {
      setPinErr("Password must be at least 6 characters");
      return;
    }
    if (loginPass !== pin) {
      setPinErr("Passwords do not match");
      return;
    }
    const tempUser = staff.find((s) => s.id === loginEmail);
    if (tempUser) {
      setStaff((p) => p.map((s) => s.id === tempUser.id ? { ...s, password: loginPass, tempPassword: false } : s));
      setUser({ ...tempUser, password: loginPass, tempPassword: false });
      setLoginMode("staff");
      setLoginPass("");
      setPin("");
      setLoginEmail("");
      setPinErr("");
    }
  }, style: { width: "100%", padding: "12px", borderRadius: 10, border: "none", background: C.grn, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: C.font } }, "Set Password & Sign In")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: C.tx3, display: "block", marginBottom: 3 } }, "Email or Name"), /* @__PURE__ */ React.createElement("input", { type: "text", value: loginEmail, onChange: (e) => setLoginEmail(e.target.value), placeholder: "Enter your email or first name", style: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid " + C.sepL, fontSize: 15, fontFamily: C.font, boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: C.tx3, display: "block", marginBottom: 3 } }, "Password"), /* @__PURE__ */ React.createElement("input", { type: "password", value: loginPass, onChange: (e) => setLoginPass(e.target.value), placeholder: "Enter your password", style: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid " + C.sepL, fontSize: 15, fontFamily: C.font, boxSizing: "border-box" }, onKeyDown: (e) => {
    if (e.key === "Enter") document.getElementById("login-btn")?.click();
  } })), pinErr && /* @__PURE__ */ React.createElement("div", { style: { color: C.red, fontSize: 12, textAlign: "center", marginBottom: 8 } }, pinErr), /* @__PURE__ */ React.createElement("button", { id: "login-btn", onClick: () => {
    const q = loginEmail.toLowerCase().trim();
    const found = staff.find((s) => s.on && s.password && s.password === loginPass && (s.email && s.email.toLowerCase() === q || s.email && s.email.split("@")[0].toLowerCase() === q || s.first && s.first.toLowerCase() === q || s.first && s.first.toLowerCase().split(" ")[0] === q || s.last && s.last.toLowerCase() === q || s.first && s.last && s.first.toLowerCase() + " " + s.last.toLowerCase() === q || s.first && s.last && s.first.toLowerCase() + s.last.toLowerCase() === q || s.name && s.name.toLowerCase().replace(/[, ]+/g, " ").includes(q) && q.length >= 3));
    if (found) {
      if (found.tempPassword) {
        setLoginEmail(found.id);
        setLoginPass("");
        setPin("");
        setLoginMode("setPassword");
        setPinErr("");
      } else {
        setUser(found);
        setLoginEmail("");
        setLoginPass("");
        setPinErr("");
      }
    } else {
      setPinErr("Invalid login or password");
    }
  }, style: { width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: C.font } }, "Sign In"), /* @__PURE__ */ React.createElement("button", { onClick: () => alert("Contact System Admin for password reset."), style: { width: "100%", padding: "8px", marginTop: 8, borderRadius: 10, border: "none", background: "transparent", fontSize: 12, cursor: "pointer", fontFamily: C.font, color: C.blue } }, "Forgot Password?"))));
  if (user && ipChecked && !ipAllowed()) {
    const userHomes = (user.homes || []).map((hid) => HOMES.find((h) => h.id === hid)).filter(Boolean);
    return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: C.font, minHeight: "100vh", background: "linear-gradient(170deg,#ffe0e0 0%,#fff5f5 30%," + C.bg + " 60%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 } }, /* @__PURE__ */ React.createElement("style", null, "@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}"), /* @__PURE__ */ React.createElement("div", { style: { width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg,#ff3b30,#ff6b6b)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 8px 32px rgba(255,59,48,.35)" } }, /* @__PURE__ */ React.createElement(Ic, { n: "lock", s: 40, c: "#fff" })), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 22, fontWeight: 700, margin: "0 0 6px", color: C.red } }, "Access Restricted"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: C.tx2, margin: "0 0 20px", textAlign: "center", maxWidth: 320, lineHeight: 1.5 } }, "You must be connected to an authorized home WiFi network to access this application."), /* @__PURE__ */ React.createElement(Card, { style: { width: "100%", maxWidth: 340, padding: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: C.tx3, marginBottom: 8 } }, "YOUR ASSIGNED HOME", userHomes.length > 1 ? "S" : ""), userHomes.map((h) => {
      const cfg = homeConfig[h.id] || {};
      return /* @__PURE__ */ React.createElement("div", { key: h.id, style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { width: 10, height: 10, borderRadius: 5, background: h.color } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, h.full), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "WiFi required to access")), /* @__PURE__ */ React.createElement(Ic, { n: "x", s: 14, c: C.red }));
    }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, padding: "8px 10px", background: C.org + "08", borderRadius: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.org, fontWeight: 600 } }, "\u26A0", " Your IP: ", userIP), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, marginTop: 2 } }, "Contact your administrator if you believe this is an error."))), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setUser(null);
      setLoginMode("login");
      setLoginPass("");
      setLoginEmail("");
      setPin("");
    }, style: { marginTop: 20, padding: "10px 28px", borderRadius: 12, border: "none", background: C.red, color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: C.font, cursor: "pointer" } }, "Sign Out"));
  }
  const downloadHTML = (html, filename) => {
    const full = "<!DOCTYPE html><html><head><title>" + (filename || "Print") + "</title></head><body>" + html + "</body></html>";
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(full);
      w.document.close();
      w.focus();
      setTimeout(() => w.print(), 400);
    }
  };
  if (printContent) return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Arial, sans-serif", background: "#fff", minHeight: "100vh" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "sticky", top: 0, zIndex: 10, background: "#f8f8f8", borderBottom: "2px solid #ddd", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPrintContent(null), style: { padding: "8px 18px", borderRadius: 8, border: "1px solid #ccc", background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "system-ui" } }, "\u2190", " Back"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "center", fontSize: 13, fontWeight: 600, color: "#666" } }, "Print Preview"), /* @__PURE__ */ React.createElement("button", { onClick: () => downloadHTML(printContent, printFilename), style: { padding: "8px 18px", borderRadius: 8, border: "none", background: "#007aff", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "system-ui" } }, "\u{1F5A8}\uFE0F", " Print")), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 20px", maxWidth: 1100, margin: "0 auto" }, dangerouslySetInnerHTML: { __html: printContent } }));
  const AllergyBanner = ({ r }) => {
    const ma = r.allergies.filter((a) => a.type === "medication");
    if (!ma.length) return null;
    return /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px", padding: "8px 12px", background: C.red + "06", borderRadius: 12, border: "1.5px solid " + C.red + "25" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5, marginBottom: 4 } }, /* @__PURE__ */ React.createElement(Ic, { n: "alert", s: 14, c: C.red }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: C.red } }, "MEDICATION ALLERGIES")), ma.map((a, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", padding: "3px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: a.sev === "severe" ? C.red : C.org } }, a.name), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.tx3 } }, a.reaction))));
  };
  const homeContent = tab !== "home" ? null : (() => {
    const userHomeIds = user.homes || ["SCH"];
    const homeTodayBeh = tallies.filter((t) => t.d === today && userHomeIds.includes((residents.find((rx) => rx.id === (t.resId || "r1")) || {}).home || "SCH")).length;
    const homeAllActiveMeds = meds.filter((m) => m && m.status === "active" && userHomeIds.includes((residents.find((rx) => rx.id === m.resId) || {}).home || "SCH") && m.freq !== "PRN" && !isOnHV(m.resId));
    const homeAllGiven = homeAllActiveMeds.length > 0 && homeAllActiveMeds.every((m) => m.times.every((t) => marRecs.find((mr) => mr.med === m.name && mr.d === today && mr.sTime === t)));
    const homeNextMed = getNextMedTime(meds.filter((m) => m && userHomeIds.includes((residents.find((rx) => rx.id === m.resId) || {}).home || "SCH")));
    return /* @__PURE__ */ React.createElement("div", null, (() => {
      const medStatus = residents.filter((rx) => userHomeIds.includes(rx.home)).map((res) => {
        const rMeds = meds.filter((m) => m.resId === res.id && m.status === "active" && m.freq !== "PRN" && !isOnHV(res.id));
        if (rMeds.length === 0) return null;
        const overdue = rMeds.filter((m) => m.times.some((t) => {
          const h = parseInt(t);
          return h < hr && (isAM || hr - h <= 1) && !marRecs.find((mr) => mr.med === m.name && mr.d === today && mr.sTime === t);
        }));
        const upcoming = rMeds.filter((m) => m.times.some((t) => {
          const h = parseInt(t);
          return h >= hr && h <= hr + 2 && !marRecs.find((mr) => mr.med === m.name && mr.d === today && mr.sTime === t);
        }));
        const allDone = rMeds.every((m) => m.times.length === 0 || m.times.every((t) => marRecs.find((mr) => mr.med === m.name && mr.d === today && mr.sTime === t)));
        if (!isAM && overdue.length === 0 && upcoming.length === 0 && !allDone) return null;
        return { r: res, ini: resInit(res.name), fn: fullName(res.name), overdue: overdue.length, upcoming: upcoming.length, allDone };
      }).filter(Boolean);
      return medStatus.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 4px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,.03)", borderRadius: 12, padding: "8px 12px" } }, /* @__PURE__ */ React.createElement(Ic, { n: "shield", s: 14, c: C.blue }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: C.tx3, marginRight: 4 } }, "MEDS"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flex: 1, flexWrap: "wrap" } }, medStatus.map((ms) => {
        const cl = ms.overdue > 0 ? C.red : ms.upcoming > 0 ? C.org : ms.allDone ? C.grn : C.tx3;
        const label = ms.overdue > 0 ? "LATE" : ms.upcoming > 0 ? "DUE" : ms.allDone ? "\u2713" : "";
        return /* @__PURE__ */ React.createElement("div", { key: ms.r.id, onClick: () => {
          setSelRes(ms.r.id);
          setResSubTab("mar");
          setSelHome(ms.r.home);
          setTab("res");
        }, style: { display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 8, background: cl + "10", cursor: "pointer", border: "1px solid " + cl + "30", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 14, background: cl + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: cl } }, ms.ini), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: cl, lineHeight: 1 } }, label), ms.overdue > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.red, fontWeight: 600 } }, ms.overdue, " med", ms.overdue > 1 ? "s" : ""), ms.overdue === 0 && ms.upcoming > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.org, fontWeight: 600 } }, ms.upcoming, " med", ms.upcoming > 1 ? "s" : "")), ms.overdue > 0 && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: 4, background: C.red, animation: "memoFlash 0.8s ease-in-out infinite alternate" } }));
      })))) : null;
    })(), /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 14px 4px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontWeight: 700 } }, hr < 12 ? "Good morning," : hr < 17 ? "Good afternoon," : "Good evening,"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, color: C.tx3 } }, user.name.split(",").reverse().join(" ").trim()), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.blue, fontWeight: 500 } }, user.role), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 4 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setPin("");
      setLoginPass("");
      setLoginEmail("");
      setPinErr("");
      setModal("changePw");
    }, style: { fontSize: 11, color: C.pur, background: "none", border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 600, padding: 0 } }, "Change Password"), /* @__PURE__ */ React.createElement("span", { style: { color: C.sepL } }, "|"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setUser(null);
      setLoginMode("login");
      setLoginPass("");
      setLoginEmail("");
      setPin("");
    }, style: { fontSize: 11, color: C.red, background: "none", border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 600, padding: 0 } }, "Sign Out"))), !homeAllGiven && homeNextMed && (isAM || !homeNextMed.overdue || homeNextMed.overdueHrs <= 1) && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginTop: 8 } }, /* @__PURE__ */ React.createElement(Card, { style: { background: homeNextMed.overdue ? "linear-gradient(135deg,rgba(255,59,48,.04),rgba(255,59,48,.08))" : homeNextMed.within1hr ? "linear-gradient(135deg,rgba(52,199,89,.04),rgba(52,199,89,.08))" : C.card, border: "1.5px solid " + (homeNextMed.overdue ? C.red + "30" : homeNextMed.within1hr ? C.grn + "30" : C.sepL) } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 50, height: 50, borderRadius: 25, background: homeNextMed.overdue ? C.red + "12" : homeNextMed.within1hr ? C.grn + "12" : C.blue + "12", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: homeNextMed.overdue ? C.red : homeNextMed.within1hr ? C.grn : C.blue } }, homeNextMed.overdue ? "LATE" : "NEXT"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 8, color: C.tx3 } }, "MED")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: homeNextMed.overdue ? C.red : homeNextMed.within1hr ? C.grn : C.blue, fontVariantNumeric: "tabular-nums" } }, homeNextMed.overdue ? "+" + homeNextMed.label + " overdue" : homeNextMed.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, homeNextMed.overdue ? "Medication is past due!" : homeNextMed.within1hr ? "Approaching \u2014 prepare medications" : "Until next scheduled medication")), homeNextMed.overdue && /* @__PURE__ */ React.createElement("div", { style: { width: 12, height: 12, borderRadius: 6, background: C.red, animation: "memoFlash 0.8s ease-in-out infinite alternate" } })))), homeAllGiven && homeAllActiveMeds.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginTop: 8 } }, /* @__PURE__ */ React.createElement(Card, { style: { background: "linear-gradient(135deg,rgba(52,199,89,.04),rgba(52,199,89,.08))", border: "1.5px solid " + C.grn + "30" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22 } }, "\u2705"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.grn } }, "All Medications Given"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "No pending medications this window"))))), isMeetingDue() && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginTop: 8 } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: "14px", border: "2px solid " + C.pur + "40", background: "linear-gradient(135deg," + C.pur + "06," + C.pur + "02)", cursor: "pointer" }, onClick: () => {
      setMeetingForm({ step: "pickHome" });
      setModal("resMeeting");
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 28 } }, "\u{1F4CB}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: C.pur } }, "Weekly Resident Meeting Due"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, "Tap to select home and start"))))), isAM && (() => {
      const reminders = [];
      appointments.forEach((apt2) => {
        if (!apt2 || !apt2.visitFreq || !apt2.date || !apt2.resId) return;
        const nextDue = getNextDueDate(apt2.date, apt2.visitFreq);
        if (!nextDue) return;
        const daysUntil = Math.round((/* @__PURE__ */ new Date(nextDue + "T12:00:00") - /* @__PURE__ */ new Date()) / 864e5);
        if (daysUntil <= 30 && daysUntil >= -30) {
          const hasFollowUp = appointments.find((a2) => a2 && a2.resId === apt2.resId && a2.doctor === apt2.doctor && a2.date > today);
          if (!hasFollowUp) {
            const rr = residents.find((x) => x.id === (apt2 || {}).resId);
            reminders.push({ apt: apt2, rr, nextDue, daysUntil });
          }
        }
      });
      return reminders.length > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "\u26A0\uFE0F Appointments Due (" + reminders.length + ")" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { border: "2px solid " + C.org + "30" } }, reminders.sort((a2, b2) => a2.daysUntil - b2.daysUntil).map((rm2, i) => /* @__PURE__ */ React.createElement(Row, { key: i, left: /* @__PURE__ */ React.createElement(Av, { name: rm2.rr ? rm2.rr.name : "?", s: 40, cl: rm2.daysUntil < 0 ? C.red : C.org }), title: (rm2.rr ? fullName(rm2.rr.name) : "?") + " \u2014 " + rm2.apt.doctor, sub: rm2.daysUntil < 0 ? Math.abs(rm2.daysUntil) + " days OVERDUE" : "Due in " + rm2.daysUntil + " days", right: /* @__PURE__ */ React.createElement(Pill, { text: rm2.daysUntil < 0 ? "OVERDUE" : rm2.daysUntil + "d", cl: rm2.daysUntil < 0 ? C.red : C.org }), last: i === reminders.length - 1 }))))) : null;
    })(), isAM && (() => {
      const curMo = (/* @__PURE__ */ new Date()).getMonth() + 1;
      const curYr = (/* @__PURE__ */ new Date()).getFullYear();
      const due = [];
      residents.forEach((r2) => {
        const sched = getReportSchedule(r2.dob);
        sched.forEach((s) => {
          if (s.mo === curMo) {
            const period = curYr + "-" + s.type;
            const submitted = rptSubmitted.find((rs) => rs.resId === r2.id && rs.period === period);
            if (!submitted) due.push({ r: r2, type: s.type, period });
          }
        });
      });
      return due.length > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Reports Due This Month (" + due.length + ")" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { border: "2px solid " + C.pk + "30" } }, due.map((d2, i) => {
        const hm = HOMES.find((h) => h.id === d2.r.home);
        return /* @__PURE__ */ React.createElement(Row, { key: d2.r.id + d2.type, left: /* @__PURE__ */ React.createElement(Av, { name: d2.r.name, s: 40, cl: C.pk }), title: fullName(d2.r.name) + " \u2014 " + d2.type, sub: moNames[(/* @__PURE__ */ new Date()).getMonth() + 1] + " | " + (hm ? hm.name : ""), right: /* @__PURE__ */ React.createElement(Pill, { text: "DUE", cl: C.red }), onClick: () => {
          setSelRes(d2.r.id);
          setResSubTab("reports");
          setSelHome(d2.r.home);
          setTab("res");
        }, last: i === due.length - 1 });
      })))) : null;
    })(), (() => {
      const assignedRes = isAM ? residents : residents.filter((r2) => (user.homes || []).includes(r2.home));
      const needWeight = assignedRes.filter((r2) => !weightRecs.find((w) => w.resId === r2.id && w.month === curMonth));
      return needWeight.length > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "\u26A0\uFE0F Monthly Weight Due (" + needWeight.length + ")" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { border: "2px solid " + C.org + "40" } }, needWeight.map((r2, i) => /* @__PURE__ */ React.createElement(Row, { key: r2.id, left: /* @__PURE__ */ React.createElement(Av, { name: r2.name, s: 40, cl: C.org }), title: fullName(r2.name), sub: (/* @__PURE__ */ new Date()).toLocaleString("en-US", { month: "long" }) + " weight not recorded", right: /* @__PURE__ */ React.createElement(Pill, { text: "Due", cl: C.org }), onClick: () => {
        setSelRes(r2.id);
        setResSubTab("hlth");
        setVitalsTab("weight");
        setSelHome(r2.home);
        setTab("res");
      }, last: i === needWeight.length - 1 }))))) : null;
    })(), (() => {
      const myRes = isAM ? residents : residents.filter((rx) => (user.homes || []).includes(rx.home));
      const resWithDue = myRes.map((res) => {
        const rMeds = meds.filter((m) => m.resId === res.id && m.status === "active" && m.freq !== "PRN" && !isOnHV(res.id));
        let dueCnt = 0;
        let givenCnt = 0;
        rMeds.forEach((m) => m.times.forEach((t) => {
          const h2 = parseInt(t);
          const diff = hr - h2;
          const isDue = isAM ? Math.abs(diff) <= 2 : diff >= -2 && diff <= 1;
          if (isDue) {
            dueCnt++;
            if (marRecs.find((mr) => mr.med === m.name && mr.d === today && mr.sTime === t)) givenCnt++;
          }
        }));
        return { r: res, cnt: dueCnt, given: givenCnt };
      }).filter((x) => x.cnt > 0);
      return resWithDue.length > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Meds Due" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, null, resWithDue.map((x, i) => /* @__PURE__ */ React.createElement(Row, { key: x.r.id, left: /* @__PURE__ */ React.createElement(Av, { name: x.r.name, s: 40, cl: x.given === x.cnt ? C.grn : C.org }), title: fullName(x.r.name), sub: x.given + " of " + x.cnt + " doses given", right: x.given === x.cnt ? /* @__PURE__ */ React.createElement(Pill, { text: "Complete", cl: C.grn }) : /* @__PURE__ */ React.createElement(Pill, { text: x.cnt - x.given + " Due", cl: C.org }), onClick: () => {
        setSelRes(x.r.id);
        setResSubTab("mar");
        setSelHome(x.r.home);
        setTab("res");
      }, last: i === resWithDue.length - 1 }))))) : null;
    })(), isVA && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 22 } }, "\u{1F4CB}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700 } }, "CarehomeVA Dashboard"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, "Shift Duty Assignments"))), (user.homes || []).map((hid) => HOMES.find((h) => h.id === hid)).filter(Boolean).map((hm) => {
      var cfg = homeDutyConfig[hm.id] || { shifts: {} };
      var shiftNames = Object.keys(cfg.shifts || {});
      var days2 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      return /* @__PURE__ */ React.createElement(Card, { key: hm.id, style: { marginBottom: 10, borderLeft: "4px solid " + hm.color, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", borderBottom: "0.5px solid " + C.sepL, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: hm.color } }, hm.full), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, shiftNames.length > 0 ? shiftNames.join(", ") : "No shifts configured \u2014 ask System Admin"))), shiftNames.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 14, textAlign: "center", color: C.tx3, fontSize: 12 } }, "System Admin needs to configure shift duties for this home first.") : shiftNames.map((sn) => /* @__PURE__ */ React.createElement("div", { key: sn, style: { padding: "10px 14px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.blue, marginBottom: 6 } }, sn, " Shift"), days2.map((day) => /* @__PURE__ */ React.createElement("div", { key: day, style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: C.tx3, marginBottom: 2 } }, day), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 3 } }, (cfg.shifts[sn] || []).map((duty, di) => {
        var wKey = hm.id + "-" + sn + "-" + day + "-" + di;
        var assigned = shiftDuties.find((sd) => sd.weekKey === wKey);
        return /* @__PURE__ */ React.createElement("button", { key: di, onClick: () => {
          if (assigned) {
            if (confirm('Remove "' + duty + '" from ' + day + " " + sn + "?")) setShiftDuties((p) => p.filter((sd) => sd.weekKey !== wKey));
          } else {
            setShiftDuties((p) => [...p, { id: "sd" + Date.now() + di, task: duty, time: sn, done: false, by: null, doneAt: null, homeId: hm.id, weekKey: wKey, day }]);
          }
        }, style: { padding: "3px 8px", borderRadius: 6, fontSize: 10, border: "1px solid " + (assigned ? C.grn : C.sepL), background: assigned ? C.grn + "10" : "transparent", color: assigned ? C.grn : C.tx3, cursor: "pointer", fontFamily: C.font, fontWeight: assigned ? 700 : 400 } }, assigned ? "\u2713 " : "", duty);
      })))))));
    }))), isS && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 22 } }, "\u{1F4C5}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700 } }, "Scheduler Dashboard"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 10, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: C.blue + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.blue } }, "\u{1F4C5}", " Today's Appointments (", appointments.filter((a) => a && a.date === today).length, ")")), appointments.filter((a) => a && a.date === today).length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 14, textAlign: "center", color: C.tx3, fontSize: 12 } }, "No appointments today") : appointments.filter((a) => a && a.date === today).sort((a, b) => a.time.localeCompare(b.time)).map((a, i, arr) => {
      const rr = residents.find((x) => x.id === a.resId);
      return /* @__PURE__ */ React.createElement("div", { key: a.id, onClick: () => {
        setViewApt(a);
        setModal("aptView");
      }, style: { padding: "10px 14px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700 } }, a.time, " \u2014 ", a.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, rr ? fullName(rr.name) : "?", " | ", a.doctor), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, a.location, '""')), /* @__PURE__ */ React.createElement(Pill, { text: a.status === "confirmed" ? "Confirmed" : "Scheduled", cl: a.status === "confirmed" ? C.grn : C.org })));
    })), (() => {
      const reminders = [];
      appointments.forEach((apt2) => {
        if (!apt2 || !apt2.visitFreq || !apt2.date || !apt2.resId) return;
        const nextDue = getNextDueDate(apt2.date, apt2.visitFreq);
        if (!nextDue) return;
        const daysUntil = Math.round((/* @__PURE__ */ new Date(nextDue + "T12:00:00") - /* @__PURE__ */ new Date()) / 864e5);
        if (daysUntil <= 30 && daysUntil >= -30) {
          const hasFollowUp = appointments.find((a2) => a2 && a2.resId === apt2.resId && a2.doctor === apt2.doctor && a2.date > today);
          if (!hasFollowUp) {
            const rr = residents.find((x) => x.id === (apt2 || {}).resId);
            reminders.push({ apt: apt2, rr, nextDue, daysUntil });
          }
        }
      });
      return reminders.length > 0 ? /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 10, overflow: "hidden", border: "2px solid " + C.red + "30" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: C.red + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.red } }, "\u26A0\uFE0F", " Follow-Up Appointments Needed (", reminders.length, ")"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "No follow-up scheduled within 30 days of due date")), reminders.sort((a2, b2) => a2.daysUntil - b2.daysUntil).map((rm2, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "8px 14px", borderBottom: i < reminders.length - 1 ? "0.5px solid " + C.sepL : "none", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: rm2.daysUntil < 0 ? C.red : C.org } }, rm2.rr ? fullName(rm2.rr.name) : "?", " \u2014 ", rm2.apt.doctor), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, rm2.apt.title, " | ", rm2.apt.visitFreq), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: rm2.daysUntil < 0 ? C.red : C.org, fontWeight: 600 } }, rm2.daysUntil < 0 ? Math.abs(rm2.daysUntil) + " days OVERDUE" : "Due in " + rm2.daysUntil + " days (" + rm2.nextDue + ")")), /* @__PURE__ */ React.createElement(Btn, { sm: true, color: C.blue, onClick: () => {
        const newApt2 = { id: "apt" + Date.now(), resId: rm2.apt.resId, title: rm2.apt.title, doctor: rm2.apt.doctor, location: rm2.apt.location, date: rm2.nextDue, time: rm2.apt.time, duration: rm2.apt.duration, type: rm2.apt.type, notes: "", status: "scheduled", visitFreq: rm2.apt.visitFreq, lastVisit: rm2.apt.date };
        setViewApt(newApt2);
        setEditApt({ ...newApt2 });
        setModal("aptEdit");
      } }, "Schedule")))) : null;
    })(), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 10, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: C.teal + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.teal } }, "\u{1F52E}", " Upcoming (7 days)")), (() => {
      const next7 = [];
      for (let i2 = 1; i2 <= 7; i2++) {
        const dd = /* @__PURE__ */ new Date();
        dd.setDate(dd.getDate() + i2);
        next7.push(dd.toISOString().slice(0, 10));
      }
      const upcoming = appointments.filter((a) => a && a.date && next7.includes(a.date)).sort((a, b) => a.date.localeCompare(b.date));
      return upcoming.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 14, textAlign: "center", color: C.tx3, fontSize: 12 } }, "No upcoming appointments") : upcoming.map((a, i) => {
        const rr = residents.find((x) => x.id === a.resId);
        return /* @__PURE__ */ React.createElement("div", { key: a.id, onClick: () => {
          setViewApt(a);
          setModal("aptView");
        }, style: { padding: "8px 14px", borderBottom: i < upcoming.length - 1 ? "0.5px solid " + C.sepL : "none", cursor: "pointer", display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, a.date, " ", a.time, " \u2014 ", a.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, rr ? fullName(rr.name) : "?", " | ", a.doctor)), /* @__PURE__ */ React.createElement(Pill, { text: a.status === "confirmed" ? "\u2713" : "Sched", cl: a.status === "confirmed" ? C.grn : C.org }));
      });
    })()), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 10, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: C.pur + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.pur } }, "\u{1F465}", " Staff Assignments")), residents.map((rx, i) => {
      const assigned = (assigns[rx.id] || []).map((sid) => staff.find((s2) => s2.id === sid)).filter(Boolean);
      return /* @__PURE__ */ React.createElement("div", { key: rx.id, style: { padding: "8px 14px", borderBottom: i < residents.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, marginBottom: 3 } }, fullName(rx.name)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 3 } }, assigned.length === 0 ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.tx3 } }, "No staff assigned") : assigned.map((s2) => /* @__PURE__ */ React.createElement("span", { key: s2.id, style: { fontSize: 10, padding: "2px 8px", borderRadius: 6, background: C.blue + "10", color: C.blue, fontWeight: 600 } }, s2.first)), /* @__PURE__ */ React.createElement("button", { onClick: () => {
        setSelRes(rx.id);
        setTab("res");
      }, style: { fontSize: 10, color: C.blue, background: "none", border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 600 } }, "Edit")));
    })), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 10, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: C.grn + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.grn } }, "\u{1F4CA}", " Today's Staff Scores")), staff.filter((s2) => s2.on && s2.role === "Staff" && (s2.homes || []).some((h) => (user.homes || []).includes(h))).map((s2, i, arr) => {
      const a = calcAcct(s2.id, today);
      const activeItems = acctItems.filter((it) => it.on);
      const overallPct = activeItems.length > 0 ? Math.round(activeItems.reduce((sum, it) => sum + (a[it.key] ? a[it.key].pct : 0), 0) / activeItems.length) : 0;
      const clr = overallPct >= 80 ? C.grn : overallPct >= 50 ? C.org : C.red;
      return /* @__PURE__ */ React.createElement("div", { key: s2.id, style: { padding: "8px 14px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(Av, { name: s2.name, s: 32, cl: clr }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 13, fontWeight: 600 } }, s2.first, " ", s2.last), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: clr } }, overallPct, "%"));
    })), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 10, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: "#5856d606", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#5856d6" } }, "\u{1FA7A}", " Doctors & Visit Schedule")), residents.map((rx, i) => {
      const docs2 = rx.doctors || [];
      if (!docs2.length) return null;
      return /* @__PURE__ */ React.createElement("div", { key: rx.id, style: { padding: "8px 14px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 4 } }, fullName(rx.name)), docs2.map((doc, di) => /* @__PURE__ */ React.createElement("div", { key: di, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx } }, doc.name, " ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, "(", doc.specialty, ")")), doc.visitFreq && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, padding: "2px 6px", borderRadius: 5, background: C.teal + "10", color: C.teal, fontWeight: 600 } }, doc.visitFreq))));
    })), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 10, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: C.org + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.org } }, "\u{1F30D}", " Community Integration")), /* @__PURE__ */ React.createElement("div", { style: { padding: 14, textAlign: "center" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.org, onClick: () => {
      const resId = prompt("Resident (enter name):");
      const activity = prompt("Activity (park, restaurant, store, etc):");
      const sDate = prompt("Date (YYYY-MM-DD):", today);
      const sStaff = prompt("Staff assigned:");
      if (resId && activity) {
        setDocs((p) => [{ id: "d" + Date.now(), resId: selRes || "r1", type: "Activity", d: sDate || today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), user: user.name, text: "Community Integration: " + activity + (sStaff ? " | Staff: " + sStaff : "") + " | Resident: " + resId }, ...p]);
      }
    } }, "Schedule Outing"))))), !isAM && !isS && !staffView && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { onClick: () => setStaffView("duties"), style: { borderRadius: 16, padding: "16px 14px", background: "linear-gradient(135deg, #00b894, #00cec9)", boxShadow: "0 4px 15px rgba(0,206,201,.3)", cursor: "pointer", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: -10, right: -10, width: 60, height: 60, borderRadius: 30, background: "rgba(255,255,255,.12)" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, marginBottom: 6 } }, "\u2705"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#fff" } }, "Shift Duties"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "rgba(255,255,255,.8)", marginTop: 2 } }, shiftDuties.filter((d) => d.done).length, "/", shiftDuties.length, " completed"), /* @__PURE__ */ React.createElement("div", { style: { height: 4, background: "rgba(255,255,255,.2)", borderRadius: 2, marginTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: (shiftDuties.length > 0 ? shiftDuties.filter((d) => d.done).length / shiftDuties.length * 100 : 0) + "%", background: "#fff", borderRadius: 2 } }))), /* @__PURE__ */ React.createElement("div", { onClick: () => {
      setIrDraft(null);
      setIrStep(0);
      setStaffView("injury");
    }, style: { borderRadius: 16, padding: "16px 14px", background: "linear-gradient(135deg, #e17055, #d63031)", boxShadow: "0 4px 15px rgba(214,48,49,.3)", cursor: "pointer", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: -10, right: -10, width: 60, height: 60, borderRadius: 30, background: "rgba(255,255,255,.12)" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, marginBottom: 6 } }, "\u{1F6A8}"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#fff" } }, "Incident Report"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "rgba(255,255,255,.8)", marginTop: 2 } }, irReports.filter((r) => r.d === today).length, " filed today"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "rgba(255,255,255,.6)", marginTop: 4 } }, "\u{1F916}", " AI-powered \xB7 SIR + Shared")), /* @__PURE__ */ React.createElement("div", { onClick: () => setStaffView("meals"), style: { borderRadius: 16, padding: "16px 14px", background: "linear-gradient(135deg, #fdcb6e, #e17055)", boxShadow: "0 4px 15px rgba(253,203,110,.3)", cursor: "pointer", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: -10, right: -10, width: 60, height: 60, borderRadius: 30, background: "rgba(255,255,255,.12)" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, marginBottom: 6 } }, "\u{1F37D}"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#fff" } }, "Meals"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "rgba(255,255,255,.8)", marginTop: 2 } }, docs.filter((d) => d.d === today && d.text && d.text.includes("meal")).length + photos.filter((p) => p.type === "meal" && p.d === today).length, " logged today"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "rgba(255,255,255,.6)", marginTop: 4 } }, "\u{1F4F7}", " Camera enabled")), /* @__PURE__ */ React.createElement("div", { onClick: () => setStaffView("activity"), style: { borderRadius: 16, padding: "16px 14px", background: "linear-gradient(135deg, #6c5ce7, #a29bfe)", boxShadow: "0 4px 15px rgba(108,92,231,.3)", cursor: "pointer", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: -10, right: -10, width: 60, height: 60, borderRadius: 30, background: "rgba(255,255,255,.12)" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, marginBottom: 6 } }, "\u{1F4DD}"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#fff" } }, "Activity Log"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "rgba(255,255,255,.8)", marginTop: 2 } }, docs.filter((d) => d.d === today && d.type === "Activity").length, " entries today"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "rgba(255,255,255,.6)", marginTop: 4 } }, "\u{1F4F7}", " Camera enabled")), (() => {
      const done = shiftDoneToday;
      return /* @__PURE__ */ React.createElement("div", { onClick: () => {
        if (done) return;
        if (!activeWT) {
          const items = shiftDuties.map((d) => ({ task: d.task, time: d.time, checked: false, confirmed: false, photo: null, note: "" }));
          const wt = { id: "wt" + Date.now(), d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), by: user.id, homeId: (user.homes || [])[0] || "SCH", shift: curShift, items, complete: false };
          setActiveWT(wt);
        }
        setStaffView("walkthrough");
      }, style: { gridColumn: "1 / -1", borderRadius: 16, padding: "16px 14px", background: done ? "linear-gradient(135deg, #00b894, #00cec9)" : "linear-gradient(135deg, #d63031, #e17055)", boxShadow: "0 4px 15px " + (done ? "rgba(0,184,148,.3)" : "rgba(214,48,49,.35)"), cursor: done ? "default" : "pointer", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: -15, right: -15, width: 80, height: 80, borderRadius: 40, background: "rgba(255,255,255,.1)" } }), !done && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 10, right: 10, width: 10, height: 10, borderRadius: 5, background: "#fff", animation: "memoFlash 0.8s ease-in-out infinite alternate" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 32 } }, done ? "\u2705" : "\u{1F6B6}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "#fff" } }, "Shift Walkthrough"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "rgba(255,255,255,.85)", marginTop: 2 } }, done ? "\u2713 Completed for " + shiftLabel[curShift] + " shift" : activeWT ? "In progress \u2014 " + activeWT.items.filter((i) => i.checked || i.confirmed).length + "/" + activeWT.items.length : "Required \u2014 " + shiftLabel[curShift] + " shift"), !done && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "rgba(255,255,255,.7)", marginTop: 2 } }, "\u26A0\uFE0F", " Must be completed before end of shift"), done && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "rgba(255,255,255,.7)", marginTop: 2 } }, "By: ", gn(walkthroughs.find((w) => w.d === today && w.shift === curShift && w.complete)?.by || "")))));
    })())), homeTodayBeh > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Today's Behavior Log" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, null, tallies.filter((t) => t.d === today && userHomeIds.includes((residents.find((rx) => rx.id === (t.resId || "r1")) || {}).home || "SCH")).map((t, i, arr) => {
      const bRes = residents.find((x) => x.id === (t.resId || "r1"));
      return /* @__PURE__ */ React.createElement("div", { key: t.id, onClick: () => {
        setBehView(t);
        setModal("behView");
      }, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: 10, background: C.red + "10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.red } }, bRes ? resInit(bRes.name) : "\u26A1"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500 } }, t.b, bRes ? " \u2014 " + fullName(bRes.name) : ""), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.t, t.note ? " \u2014 " + t.note.text.slice(0, 40) + "..." : "")), /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 14, c: C.tx3 }));
    }))))), !isAM && !isS && staffView === "duties" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 0" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setStaffView(null), style: { background: "none", border: "none", color: C.blue, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: C.font, padding: 0 } }, "\u2190", " Back to Dashboard")), /* @__PURE__ */ React.createElement(Sec, { title: "Shift Duties (" + shiftDuties.filter((d) => d.done).length + "/" + shiftDuties.length + ")" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { height: 4, background: C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: shiftDuties.filter((d) => d.done).length / shiftDuties.length * 100 + "%", background: shiftDuties.filter((d) => d.done).length === shiftDuties.length ? C.grn : C.teal, borderRadius: 2, transition: "width .3s" } })), shiftDuties.map((d, i) => /* @__PURE__ */ React.createElement("div", { key: d.id, onClick: () => {
      if (!d.done) {
        setShiftDuties((p) => p.map((x) => x.id === d.id ? { ...x, done: true, by: user.id, doneAt: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) } : x));
      } else {
        if (confirm('Are you sure you want to uncheck "' + d.task + '"? This will mark it as incomplete.')) setShiftDuties((p) => p.map((x) => x.id === d.id ? { ...x, done: false, by: null, doneAt: null } : x));
      }
    }, style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderBottom: i < shiftDuties.length - 1 ? "0.5px solid " + C.sepL : "none", cursor: "pointer", opacity: d.done ? 0.6 : 1 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 20, height: 20, borderRadius: 5, border: "2px solid " + (d.done ? C.teal : C.sepL), background: d.done ? C.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, d.done && /* @__PURE__ */ React.createElement(Ic, { n: "check", s: 12, c: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500, textDecoration: d.done ? "line-through" : "none", color: d.done ? C.tx3 : C.tx } }, d.task), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, d.time, d.done && d.by ? " \u2014 " + staffInit(gn(d.by)) + " at " + d.doneAt : "")), !d.done && /* @__PURE__ */ React.createElement(Pill, { text: d.time, cl: C.teal })))), /* @__PURE__ */ React.createElement(Card, { style: { padding: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("input", { value: newDuty.task, onChange: (e) => setNewDuty((p) => ({ ...p, task: e.target.value })), placeholder: "Add duty...", style: { flex: 1, padding: "7px 10px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 13, fontFamily: C.font, boxSizing: "border-box" } }), /* @__PURE__ */ React.createElement("input", { value: newDuty.time, onChange: (e) => setNewDuty((p) => ({ ...p, time: e.target.value })), type: "time", style: { width: 85, padding: "7px 6px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 13, fontFamily: C.font, boxSizing: "border-box" } }), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      if (!newDuty.task) return;
      setShiftDuties((p) => [...p, { id: "sd" + Date.now(), task: newDuty.task, time: newDuty.time || "--:--", done: false, by: null }].sort((a, b) => a.time.localeCompare(b.time)));
      setNewDuty({ task: "", time: "" });
    }, disabled: !newDuty.task, style: { padding: "7px 12px", borderRadius: 8, border: "none", background: newDuty.task ? C.teal : C.tx3, color: "#fff", fontSize: 13, fontWeight: 600, cursor: newDuty.task ? "pointer" : "default", fontFamily: C.font } }, "+"))))), !isAM && staffView === "injury" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 0", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setStaffView(null);
      setIrDraft(null);
      setIrStep(0);
    }, style: { background: "none", border: "none", color: C.blue, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: C.font, padding: 0 } }, "\u2190", " Back"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), irDraft && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, [0, 1, 2, 3].map((s) => /* @__PURE__ */ React.createElement("div", { key: s, style: { width: 28, height: 4, borderRadius: 2, background: s <= irStep ? C.red : C.sepL } })))), /* @__PURE__ */ React.createElement(Sec, { title: !irDraft ? "Incident Report" : irStep === 0 ? "Step 1: What Happened?" : irStep === 1 ? "Step 2: Review Form" : irStep === 2 ? "Step 3: Photos" : "Step 4: Submit" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, !irDraft && /* @__PURE__ */ React.createElement(Card, { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.tx3, marginBottom: 6 } }, "SELECT RESIDENT"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 } }, residents.map((r) => /* @__PURE__ */ React.createElement("button", { key: r.id, onClick: () => {
      const d = mkIrDraft();
      d.resId = r.id;
      d.clientName = fullName(r.name);
      d.sex = "";
      d.uci = r.uci || "";
      d.dob = r.dob || "";
      setIrDraft(d);
      setIrStep(0);
    }, style: { padding: "8px 14px", borderRadius: 10, border: "2px solid " + (irDraft?.resId === r.id ? C.red : C.sepL), background: irDraft?.resId === r.id ? C.red + "10" : C.card, color: irDraft?.resId === r.id ? C.red : C.tx, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, fullName(r.name))))), irDraft && irStep === 0 && /* @__PURE__ */ React.createElement(Card, { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { background: C.blue + "08", border: "1.5px solid " + C.blue + "20", borderRadius: 10, padding: "10px 12px", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: C.blue } }, "\u{1F916}", " AI-Assisted Report"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, marginTop: 2 } }, "Describe what happened in your own words. Our AI will determine the form type (SIR or Shared Information) and auto-fill the appropriate fields.")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.tx3, marginBottom: 4 } }, "TELL US WHAT HAPPENED"), /* @__PURE__ */ React.createElement("textarea", { id: "ir-narrative", defaultValue: "", placeholder: "Example: While assisting " + (irDraft.clientName || "the resident") + " with dinner, they fell from their chair and hit their head on the floor. Staff observed a 2-inch laceration above the left eye with moderate bleeding. First aid was applied. Called 911 per protocol...", rows: 6, style: { width: "100%", padding: "10px", borderRadius: 10, border: "1.5px solid " + C.sepL, fontSize: 13, fontFamily: C.font, resize: "vertical", boxSizing: "border-box", marginBottom: 10, lineHeight: 1.5 } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, marginBottom: 10 } }, "Be specific: who, what, when, where, how. Mention injuries, medical treatment, and who was notified."), irAiLoading && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, border: "3px solid " + C.sepL, borderTop: "3px solid " + C.red, borderRadius: 18, margin: "0 auto 8px", animation: "spin 1s linear infinite" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: C.red } }, "AI Analyzing Report..."), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Determining form type and auto-filling fields")), !irAiLoading && /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.red, onClick: async () => {
      const narr = document.getElementById("ir-narrative")?.value || "";
      if (!narr || narr.length < 20) {
        alert("Please describe what happened (at least a couple sentences).");
        return;
      }
      const ai = await aiAnalyze(narr, irDraft.resId);
      if (ai) {
        setIrDraft((p) => ({ ...p, narrative: narr, formType: ai.formType || "sir", desc: ai.desc || narr, incTypes: ai.incTypes || [], negTypes: ai.negTypes || [], crmTypes: ai.crmTypes || [], medErr: ai.medErr || [], injTypes: ai.injTypes || [], abuseBy: ai.abuseBy || "Not Applicable", medTx: ai.medTx || false, locType: ai.locType || "Community Care Facility", timeOcc: ai.timeOcc || "" }));
      } else {
        setIrDraft((p) => ({ ...p, narrative: narr, desc: narr }));
      }
      setIrStep(1);
    } }, "\u{1F916}", " Analyze & Continue")), irDraft && irStep === 1 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.tx3, marginBottom: 6 } }, "FORM TYPE (AI Selected)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, ["sir", "shared"].map((ft) => /* @__PURE__ */ React.createElement("button", { key: ft, onClick: () => setIrDraft((p) => ({ ...p, formType: ft })), style: { flex: 1, padding: "10px 8px", borderRadius: 10, border: "2px solid " + (irDraft.formType === ft ? ft === "sir" ? C.red : C.org : C.sepL), background: irDraft.formType === ft ? (ft === "sir" ? C.red : C.org) + "10" : C.card, cursor: "pointer", fontFamily: C.font } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: irDraft.formType === ft ? ft === "sir" ? C.red : C.org : C.tx } }, ft === "sir" ? "\u{1F6A8} Special Incident Report" : "\u{1F4CB} Shared Information"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, marginTop: 2 } }, ft === "sir" ? "Abuse, neglect, serious injury, death" : "Minor incidents, behavioral, property"))))), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.tx3, marginBottom: 6 } }, "CLIENT INFORMATION"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "Name"), /* @__PURE__ */ React.createElement("input", { value: irDraft.clientName, onChange: (e) => setIrDraft((p) => ({ ...p, clientName: e.target.value })), style: { width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box", background: C.grn + "06" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "UCI #"), /* @__PURE__ */ React.createElement("input", { value: irDraft.uci, onChange: (e) => setIrDraft((p) => ({ ...p, uci: e.target.value })), style: { width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box", background: irDraft.uci ? C.grn + "06" : C.card } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "DOB"), /* @__PURE__ */ React.createElement("input", { type: "date", value: irDraft.dob, onChange: (e) => setIrDraft((p) => ({ ...p, dob: e.target.value })), style: { width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box", background: irDraft.dob ? C.grn + "06" : C.card } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "Sex"), /* @__PURE__ */ React.createElement("select", { value: irDraft.sex, onChange: (e) => setIrDraft((p) => ({ ...p, sex: e.target.value })), style: { width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box" } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Select"), /* @__PURE__ */ React.createElement("option", null, "Male"), /* @__PURE__ */ React.createElement("option", null, "Female"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "Date of Occurrence"), /* @__PURE__ */ React.createElement("input", { type: "date", value: irDraft.dateOcc, onChange: (e) => setIrDraft((p) => ({ ...p, dateOcc: e.target.value })), style: { width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box", background: C.grn + "06" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "Time of Occurrence"), /* @__PURE__ */ React.createElement("input", { type: "time", value: irDraft.timeOcc, onChange: (e) => setIrDraft((p) => ({ ...p, timeOcc: e.target.value })), style: { width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box", background: irDraft.timeOcc ? C.grn + "06" : C.card } })))), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.tx3, marginBottom: 6 } }, "LOCATION OF INCIDENT"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 } }, SIR_LOC.map((l) => /* @__PURE__ */ React.createElement("button", { key: l, onClick: () => setIrDraft((p) => ({ ...p, locType: l })), style: { padding: "5px 8px", borderRadius: 6, border: "1.5px solid " + (irDraft.locType === l ? C.blue : C.sepL), background: irDraft.locType === l ? C.blue + "10" : C.card, color: irDraft.locType === l ? C.blue : C.tx, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, l))), /* @__PURE__ */ React.createElement("input", { value: irDraft.address, onChange: (e) => setIrDraft((p) => ({ ...p, address: e.target.value })), placeholder: "Address...", style: { width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box" } })), irDraft.formType === "sir" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 6 } }, "INCIDENT TYPE (check all that apply)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, SIR_INC.map((t) => {
      const on = irDraft.incTypes.includes(t);
      return /* @__PURE__ */ React.createElement("button", { key: t, onClick: () => setIrDraft((p) => ({ ...p, incTypes: on ? p.incTypes.filter((x) => x !== t) : [...p.incTypes, t] })), style: { padding: "5px 8px", borderRadius: 6, border: "1.5px solid " + (on ? C.red : C.sepL), background: on ? C.red + "12" : C.card, color: on ? C.red : C.tx, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, on ? "\u2713 " : "", t);
    }))), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.pur, marginBottom: 6 } }, "SUSPECTED ABUSE/NEGLECT BY"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, SIR_ABU.map((a) => /* @__PURE__ */ React.createElement("button", { key: a, onClick: () => setIrDraft((p) => ({ ...p, abuseBy: a })), style: { padding: "5px 8px", borderRadius: 6, border: "1.5px solid " + (irDraft.abuseBy === a ? C.pur : C.sepL), background: irDraft.abuseBy === a ? C.pur + "12" : C.card, color: irDraft.abuseBy === a ? C.pur : C.tx, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, irDraft.abuseBy === a ? "\u2713 " : "", a)))), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.org, marginBottom: 6 } }, "NEGLECT TYPE"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, SIR_NEG.map((t) => {
      const on = irDraft.negTypes.includes(t);
      return /* @__PURE__ */ React.createElement("button", { key: t, onClick: () => setIrDraft((p) => ({ ...p, negTypes: on ? p.negTypes.filter((x) => x !== t) : [...p.negTypes, t] })), style: { padding: "5px 8px", borderRadius: 6, border: "1.5px solid " + (on ? C.org : C.sepL), background: on ? C.org + "12" : C.card, color: on ? C.org : C.tx, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, on ? "\u2713 " : "", t);
    }))), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 4 } }, "VICTIM OF A CRIME"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 } }, SIR_CRM.map((t) => {
      const on = irDraft.crmTypes.includes(t);
      return /* @__PURE__ */ React.createElement("button", { key: t, onClick: () => setIrDraft((p) => ({ ...p, crmTypes: on ? p.crmTypes.filter((x) => x !== t) : [...p.crmTypes, t] })), style: { padding: "5px 8px", borderRadius: 6, border: "1.5px solid " + (on ? C.red : C.sepL), background: on ? C.red + "12" : C.card, color: on ? C.red : C.tx, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, on ? "\u2713 " : "", t);
    })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.teal, marginBottom: 4 } }, "SERIOUS INJURY / ACCIDENT"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 } }, SIR_INJ.map((t) => {
      const on = irDraft.injTypes.includes(t);
      return /* @__PURE__ */ React.createElement("button", { key: t, onClick: () => setIrDraft((p) => ({ ...p, injTypes: on ? p.injTypes.filter((x) => x !== t) : [...p.injTypes, t] })), style: { padding: "5px 8px", borderRadius: 6, border: "1.5px solid " + (on ? C.teal : C.sepL), background: on ? C.teal + "12" : C.card, color: on ? C.teal : C.tx, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, on ? "\u2713 " : "", t);
    })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.blue, marginBottom: 4 } }, "MEDICATION ERROR"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, SIR_MED.map((t) => {
      const on = irDraft.medErr.includes(t);
      return /* @__PURE__ */ React.createElement("button", { key: t, onClick: () => setIrDraft((p) => ({ ...p, medErr: on ? p.medErr.filter((x) => x !== t) : [...p.medErr, t] })), style: { padding: "5px 8px", borderRadius: 6, border: "1.5px solid " + (on ? C.blue : C.sepL), background: on ? C.blue + "12" : C.card, color: on ? C.blue : C.tx, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, on ? "\u2713 " : "", t);
    }))), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setIrDraft((p) => ({ ...p, medTx: !p.medTx })), style: { width: 22, height: 22, borderRadius: 6, border: "2px solid " + (irDraft.medTx ? C.red : C.sepL), background: irDraft.medTx ? C.red : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" } }, irDraft.medTx && /* @__PURE__ */ React.createElement(Ic, { n: "check", s: 14, c: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, "Medical Treatment Necessary")))), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.tx3, marginBottom: 4 } }, "DESCRIPTION OF INCIDENT"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.grn, fontWeight: 600, marginBottom: 4 } }, "\u2713", " AI-generated from your narrative"), /* @__PURE__ */ React.createElement("textarea", { id: "ir-desc", defaultValue: irDraft.desc, rows: 5, style: { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid " + C.sepL, fontSize: 12, fontFamily: C.font, resize: "vertical", boxSizing: "border-box", lineHeight: 1.5, background: C.grn + "04" }, onBlur: (e) => setIrDraft((p) => ({ ...p, desc: e.target.value })) })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.tx3, onClick: () => setIrStep(0) }, "Back"), /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.red, onClick: () => {
      const d = document.getElementById("ir-desc");
      if (d) setIrDraft((p) => ({ ...p, desc: d.value }));
      setIrStep(2);
    } }, "Next: Photos"))), irDraft && irStep === 2 && /* @__PURE__ */ React.createElement(Card, { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.tx3, marginBottom: 8 } }, "ATTACH PHOTOS ", "\u{1F4F7}"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 } }, irDraft.photos.map((p, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: p, style: { width: 75, height: 75, borderRadius: 10, objectFit: "cover", border: "2px solid " + C.red } }), /* @__PURE__ */ React.createElement("button", { onClick: () => setIrDraft((prev) => ({ ...prev, photos: prev.photos.filter((_, j) => j !== i) })), style: { position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: 10, background: C.red, border: "none", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" } }, "\u2715"))), /* @__PURE__ */ React.createElement("label", { style: { width: 75, height: 75, borderRadius: 10, border: "2px dashed " + C.red + "40", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", cursor: "pointer", background: C.red + "04" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 26 } }, "\u{1F4F7}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: C.red, fontWeight: 600 } }, "Add Photo"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", capture: "environment", style: { display: "none" }, onChange: (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setIrDraft((p) => ({ ...p, photos: [...p.photos, ev.target.result] }));
      reader.readAsDataURL(file);
      e.target.value = "";
    } }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.tx3, onClick: () => setIrStep(1) }, "Back"), /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.red, onClick: () => setIrStep(3) }, "Next: Review"))), irDraft && irStep === 3 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8, background: irDraft.formType === "sir" ? C.red + "04" : C.org + "04", border: "1.5px solid " + (irDraft.formType === "sir" ? C.red : C.org) + "20" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: irDraft.formType === "sir" ? C.red : C.org, marginBottom: 8 } }, irDraft.formType === "sir" ? "\u{1F6A8} ACRC Special Incident Report" : "\u{1F4CB} Shared Information Report"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 11 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Client:"), " ", /* @__PURE__ */ React.createElement("strong", null, irDraft.clientName)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "UCI:"), " ", irDraft.uci || "\u2014"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Date:"), " ", irDraft.dateOcc), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Time:"), " ", irDraft.timeOcc || "\u2014"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Location:"), " ", irDraft.locType), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Photos:"), " ", irDraft.photos.length)), irDraft.formType === "sir" && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, fontSize: 11 } }, irDraft.incTypes.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Incident:"), " ", irDraft.incTypes.join(", ")), irDraft.injTypes.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Injury:"), " ", irDraft.injTypes.join(", ")), irDraft.medErr.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Med Error:"), " ", irDraft.medErr.join(", ")), irDraft.crmTypes.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Crime:"), " ", irDraft.crmTypes.join(", ")), irDraft.medTx && /* @__PURE__ */ React.createElement("div", { style: { color: C.red, fontWeight: 600, marginTop: 4 } }, "\u26A0\uFE0F", " Medical Treatment Required"))), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: C.tx3 } }, "DESCRIPTION"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, marginTop: 4, lineHeight: 1.5 } }, irDraft.desc)), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.tx3, marginBottom: 6 } }, "SUBMITTED BY"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "Name"), /* @__PURE__ */ React.createElement("input", { value: irDraft.subBy, onChange: (e) => setIrDraft((p) => ({ ...p, subBy: e.target.value })), style: { width: "100%", padding: "5px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font, boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "Title"), /* @__PURE__ */ React.createElement("input", { value: irDraft.subTitle, onChange: (e) => setIrDraft((p) => ({ ...p, subTitle: e.target.value })), style: { width: "100%", padding: "5px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font, boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "Phone"), /* @__PURE__ */ React.createElement("input", { value: irDraft.subPhone, onChange: (e) => setIrDraft((p) => ({ ...p, subPhone: e.target.value })), style: { width: "100%", padding: "5px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font, boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "Agency"), /* @__PURE__ */ React.createElement("input", { value: irDraft.agency, onChange: (e) => setIrDraft((p) => ({ ...p, agency: e.target.value })), style: { width: "100%", padding: "5px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font, boxSizing: "border-box" } })))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.tx3, onClick: () => setIrStep(2) }, "Back"), /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.red, onClick: () => {
      const report = { ...irDraft, status: "pending", t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) };
      setIrReports((p) => [report, ...p]);
      report.photos.forEach((ph) => setPhotos((p) => [{ id: "ph" + Date.now() + Math.random(), resId: report.resId, d: today, t: report.t, by: user.id, type: "injury", note: report.desc.slice(0, 60), data: ph }, ...p]));
      const rr = residents.find((x) => x.id === report.resId);
      if (rr) sendTeamsAlert(rr.home, report.formType === "sir" ? "sir" : "medChange", (report.formType === "sir" ? "SIR" : "Shared Info") + ": " + fullName(rr.name), report.desc.slice(0, 200) + " | By: " + gn(user.id));
      setDocs((p) => [{ id: "d" + Date.now(), resId: report.resId, type: "Activity", d: today, t: report.t, user: user.name, text: (report.formType === "sir" ? "\u{1F6A8} SIR" : "\u{1F4CB} Shared Info") + " \u2014 " + (rr ? fullName(rr.name) : "") + ": " + report.desc.slice(0, 80) }, ...p]);
      setIrDraft(null);
      setIrStep(0);
      setStaffView(null);
    } }, "Submit to Manager for Review"))), !irDraft && irReports.filter((r) => r.by === user.id).length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Your Submitted Reports" }), /* @__PURE__ */ React.createElement(Card, null, irReports.filter((r) => r.by === user.id).map((r, i, arr) => {
      const rr = residents.find((x) => x.id === r.resId);
      const stColor = r.status === "approved" ? C.grn : r.status === "returned" ? C.org : C.blue;
      return /* @__PURE__ */ React.createElement(Row, { key: r.id, left: /* @__PURE__ */ React.createElement("div", { style: { width: 38, height: 38, borderRadius: 10, background: (r.formType === "sir" ? C.red : C.org) + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 } }, r.formType === "sir" ? "\u{1F6A8}" : "\u{1F4CB}"), title: (r.formType === "sir" ? "SIR" : "Shared Info") + " \u2014 " + (rr ? fullName(rr.name) : "?"), sub: r.d + " " + r.t, right: /* @__PURE__ */ React.createElement(Pill, { text: r.status === "approved" ? "\u2713 Approved" : r.status === "returned" ? "Returned" : "Pending", cl: stColor }), last: i === arr.length - 1 });
    }))))), !isAM && staffView === "meals" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 0" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setStaffView(null);
      setMealLog({ resId: "", meal: "Breakfast", desc: "", photo: null });
    }, style: { background: "none", border: "none", color: C.blue, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: C.font, padding: 0 } }, "\u2190", " Back to Dashboard")), /* @__PURE__ */ React.createElement(Sec, { title: "Meal Documentation" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.tx3, marginBottom: 6 } }, "SELECT RESIDENT"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 } }, residents.map((r) => /* @__PURE__ */ React.createElement("button", { key: r.id, onClick: () => setMealLog((p) => ({ ...p, resId: r.id })), style: { padding: "6px 12px", borderRadius: 8, border: "2px solid " + (mealLog.resId === r.id ? C.org : C.sepL), background: mealLog.resId === r.id ? C.org + "10" : C.card, color: mealLog.resId === r.id ? C.org : C.tx, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, fullName(r.name)))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.tx3, marginBottom: 4 } }, "MEAL"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 10 } }, ["Breakfast", "Lunch", "Dinner", "Snack"].map((m) => /* @__PURE__ */ React.createElement("button", { key: m, onClick: () => setMealLog((p) => ({ ...p, meal: m })), style: { flex: 1, padding: "8px 4px", borderRadius: 8, border: "2px solid " + (mealLog.meal === m ? C.org : C.sepL), background: mealLog.meal === m ? C.org + "10" : C.card, color: mealLog.meal === m ? C.org : C.tx, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, m))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.tx3, marginBottom: 4 } }, "NOTES"), /* @__PURE__ */ React.createElement("textarea", { id: "meal-notes", defaultValue: "", placeholder: "What did they eat? How much? Any concerns?", rows: 2, style: { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid " + C.sepL, fontSize: 13, fontFamily: C.font, resize: "vertical", boxSizing: "border-box", marginBottom: 10 } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.tx3, marginBottom: 6 } }, "MEAL PHOTO ", "\u{1F4F7}"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 10 } }, mealLog.photo && /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: mealLog.photo, style: { width: 80, height: 80, borderRadius: 10, objectFit: "cover", border: "2px solid " + C.grn } }), /* @__PURE__ */ React.createElement("button", { onClick: () => setMealLog((p) => ({ ...p, photo: null })), style: { position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: 9, background: C.red, border: "none", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer" } }, "\u2715")), /* @__PURE__ */ React.createElement("label", { style: { width: 80, height: 80, borderRadius: 10, border: "2px dashed " + C.grn + "40", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", cursor: "pointer", background: C.grn + "04" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 24 } }, "\u{1F37D}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: C.grn, fontWeight: 600 } }, "Take Photo"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", capture: "environment", style: { display: "none" }, onChange: (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setMealLog((p) => ({ ...p, photo: ev.target.result }));
      reader.readAsDataURL(file);
      e.target.value = "";
    } }))), /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.org, onClick: () => {
      if (!mealLog.resId) return;
      const mealDesc = document.getElementById("meal-notes")?.value || "";
      const rr = residents.find((x) => x.id === mealLog.resId);
      if (mealLog.photo) setPhotos((p) => [{ id: "ph" + Date.now(), resId: mealLog.resId, d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), by: user.id, type: "meal", note: mealLog.meal + ": " + mealDesc, data: mealLog.photo }, ...p]);
      setDocs((p) => [{ id: "d" + Date.now(), resId: mealLog.resId, type: "Activity", d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), user: user.name, text: "\u{1F37D} " + mealLog.meal + " \u2014 " + (rr ? fullName(rr.name) : "") + (mealDesc ? ": " + mealDesc : "") + (mealLog.photo ? " (photo attached)" : "") }, ...p]);
      setMealLog({ resId: "", meal: "Breakfast", desc: "", photo: null });
      setStaffView(null);
    }, disabled: !mealLog.resId }, "Log Meal")), /* @__PURE__ */ React.createElement(Sec, { title: "Today's Meal Logs" }), /* @__PURE__ */ React.createElement(Card, null, docs.filter((d) => d.d === today && d.text && d.text.includes("\u{1F37D}")).length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 16, textAlign: "center", color: C.tx3, fontSize: 12 } }, "No meals logged today") : docs.filter((d) => d.d === today && d.text && d.text.includes("\u{1F37D}")).map((d, i, arr) => /* @__PURE__ */ React.createElement(Row, { key: d.id, title: d.text.slice(2).slice(0, 50), sub: d.t + " | " + d.user, last: i === arr.length - 1 }))))), !isAM && staffView === "activity" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 0" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setStaffView(null), style: { background: "none", border: "none", color: C.blue, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: C.font, padding: 0 } }, "\u2190", " Back to Dashboard")), /* @__PURE__ */ React.createElement(Sec, { title: "Activity Log" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.tx3, marginBottom: 6 } }, "SELECT RESIDENT"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 } }, residents.map((r) => /* @__PURE__ */ React.createElement("button", { key: r.id, onClick: () => setDocType(r.id), style: { padding: "6px 12px", borderRadius: 8, border: "2px solid " + (docType === r.id ? C.ind : C.sepL), background: docType === r.id ? C.ind + "10" : C.card, color: docType === r.id ? C.ind : C.tx, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, fullName(r.name)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 } }, ["Ate breakfast", "Ate lunch", "Ate dinner", "Showered", "Took medications", "Attended program", "Community outing", "Napped", "Watched TV", "Exercised", "Socialized with peers", "Completed chores"].map((q) => /* @__PURE__ */ React.createElement("button", { key: q, onClick: () => {
      if (!docType || !residents.find((x) => x.id === docType)) return;
      const rr = residents.find((x) => x.id === docType);
      setDocs((p) => [{ id: "d" + Date.now(), resId: docType, type: "Activity", d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), user: user.name, text: q + " \u2014 " + fullName(rr.name) }, ...p]);
    }, style: { padding: "6px 10px", borderRadius: 8, fontSize: 11, fontWeight: 500, border: "1px solid " + C.sepL, background: C.card, color: C.tx2, cursor: "pointer", fontFamily: C.font } }, q))), /* @__PURE__ */ React.createElement("textarea", { id: "staff-activity-text", defaultValue: "", placeholder: "Describe activity...", rows: 2, style: { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid " + C.sepL, fontSize: 13, fontFamily: C.font, resize: "vertical", boxSizing: "border-box", marginBottom: 6 } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("label", { style: { flex: 1, padding: "8px 0", borderRadius: 8, border: "1.5px solid " + C.ind, background: C.ind + "06", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.ind } }, /* @__PURE__ */ React.createElement("span", null, "\u{1F4F7}"), " Attach Photo", /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", capture: "environment", style: { display: "none" }, onChange: (e) => {
      const file = e.target.files[0];
      if (!file || !docType) return;
      const rr = residents.find((x) => x.id === docType);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos((p) => [{ id: "ph" + Date.now(), resId: docType, d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), by: user.id, type: "other", note: "Activity photo", data: ev.target.result }, ...p]);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    } }))), /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.ind, onClick: () => {
      const txt = document.getElementById("staff-activity-text")?.value || "";
      if (!txt || txt.length < 5 || !docType) {
        if (!docType) alert("Select a resident first");
        return;
      }
      const rr = residents.find((x) => x.id === docType);
      setDocs((p) => [{ id: "d" + Date.now(), resId: docType, type: "Activity", d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), user: user.name, text: txt + (rr ? " \u2014 " + fullName(rr.name) : "") }, ...p]);
      const el = document.getElementById("staff-activity-text");
      if (el) el.value = "";
    }, disabled: !docType }, "Log Activity")), /* @__PURE__ */ React.createElement(Sec, { title: "Today's Activities (" + docs.filter((d) => d.d === today && d.type === "Activity").length + ")" }), /* @__PURE__ */ React.createElement(Card, null, docs.filter((d) => d.d === today && d.type === "Activity").length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 16, textAlign: "center", color: C.tx3, fontSize: 12 } }, "No activities today") : docs.filter((d) => d.d === today && d.type === "Activity").slice(0, 15).map((d, i, arr) => /* @__PURE__ */ React.createElement(Row, { key: d.id, title: d.text.slice(0, 50) + (d.text.length > 50 ? "..." : ""), sub: d.t + " | " + d.user, wrap: true, last: i === arr.length - 1 }))))), !isAM && staffView === "walkthrough" && activeWT && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 0" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setStaffView(null), style: { background: "none", border: "none", color: C.blue, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: C.font, padding: 0 } }, "\u2190", " Back to Dashboard")), /* @__PURE__ */ React.createElement(Sec, { title: "Shift Walkthrough", right: /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.tx3 } }, activeWT.items.filter((i) => i.checked || i.confirmed).length, "/", activeWT.items.length) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, padding: "10px 12px", background: C.blue + "06", border: "1.5px solid " + C.blue + "15", borderRadius: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: C.blue } }, "Verify each duty from the previous shift"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Check off completed items. Unchecked items will need confirmation and optional photo.")), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { style: { height: 4, background: C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: activeWT.items.filter((i) => i.checked || i.confirmed).length / activeWT.items.length * 100 + "%", background: C.blue, borderRadius: 2, transition: "width .3s" } })), activeWT.items.map((item, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, style: { padding: "10px 12px", borderBottom: idx < activeWT.items.length - 1 ? "0.5px solid " + C.sepL : "none", background: item.confirmed && !item.checked ? C.red + "04" : item.checked ? C.grn + "04" : "transparent" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      if (item.confirmed) return;
      if (item.checked) {
        setActiveWT((p) => ({ ...p, items: p.items.map((it, i) => i === idx ? { ...it, checked: false } : it) }));
        return;
      }
      setActiveWT((p) => ({ ...p, items: p.items.map((it, i) => i === idx ? { ...it, checked: true } : it) }));
    }, style: { width: 24, height: 24, borderRadius: 6, border: "2px solid " + (item.checked ? C.grn : item.confirmed ? C.red : C.sepL), background: item.checked ? C.grn : item.confirmed ? C.red : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: item.confirmed ? "default" : "pointer" } }, item.checked && /* @__PURE__ */ React.createElement(Ic, { n: "check", s: 14, c: "#fff" }), item.confirmed && !item.checked && /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontSize: 12, fontWeight: 700 } }, "\u2715")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500, color: item.checked ? C.grn : item.confirmed ? C.red : C.tx, textDecoration: item.checked ? "line-through" : "none" } }, item.task), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, item.time)), !item.checked && !item.confirmed && /* @__PURE__ */ React.createElement("button", { onClick: () => setWtConfirm(idx), style: { padding: "4px 8px", borderRadius: 6, border: "1px solid " + C.red, background: C.red + "08", color: C.red, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, "Not Done"), item.confirmed && item.photo && /* @__PURE__ */ React.createElement("div", { style: { width: 30, height: 30, borderRadius: 6, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("img", { src: item.photo, style: { width: "100%", height: "100%", objectFit: "cover" } }))), item.confirmed && item.note && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, marginLeft: 34, fontSize: 11, color: C.red, fontStyle: "italic" } }, item.note)))), activeWT.items.every((i) => i.checked || i.confirmed) && /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 0" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.blue, onClick: () => {
      const completed = { ...activeWT, complete: true, completedAt: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) };
      setWalkthroughs((p) => [completed, ...p]);
      let csv = "Task,Time,Status,Notes\\n";
      completed.items.forEach((it) => {
        csv += '"' + it.task + '","' + it.time + '","' + (it.checked ? "Complete" : "NOT COMPLETE") + '","' + (it.note || "") + '"\\n';
      });
      const blob = new Blob([csv.replace(/\\n/g, "\n")], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "Walkthrough-" + today + "-" + user.name.replace(/[^a-zA-Z]/g, "") + ".csv";
      a.click();
      const incomplete = completed.items.filter((i) => !i.checked);
      if (incomplete.length > 0) {
        const hid = completed.homeId;
        const issues = incomplete.map((i) => i.task + (i.note ? " (" + i.note + ")" : "")).join(", ");
        sendTeamsAlert(hid, "memo", "Walkthrough \u2014 " + incomplete.length + " Issue(s)", "By: " + gn(user.id) + " | Incomplete: " + issues);
      }
      setActiveWT(null);
      setStaffView(null);
    } }, "Complete Walkthrough & Download CSV")))), wtConfirm !== null && activeWT && (() => {
      const item = activeWT.items[wtConfirm];
      return /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }, onClick: () => setWtConfirm(null) }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,.4)" } }), /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: { position: "relative", width: "100%", maxWidth: 420, background: C.card, borderRadius: "20px 20px 0 0", padding: "20px 16px 30px", boxShadow: "0 -4px 30px rgba(0,0,0,.15)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 4, borderRadius: 2, background: C.sepL, margin: "0 auto 14px" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: C.red, marginBottom: 4 } }, "Confirm Item Not Completed"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, marginBottom: 8 } }, item.task, " (", item.time, ")"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3, marginBottom: 10 } }, "This item was not completed from the previous shift. Add a note and optionally take a photo."), /* @__PURE__ */ React.createElement("textarea", { id: "wt-note", placeholder: "Describe the issue...", rows: 2, style: { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid " + C.sepL, fontSize: 13, fontFamily: C.font, resize: "none", boxSizing: "border-box", marginBottom: 8 } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 10 } }, item.photo && /* @__PURE__ */ React.createElement("img", { src: item.photo, style: { width: 60, height: 60, borderRadius: 8, objectFit: "cover", border: "2px solid " + C.red } }), /* @__PURE__ */ React.createElement("label", { style: { width: 60, height: 60, borderRadius: 8, border: "2px dashed " + C.red + "40", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", cursor: "pointer", background: C.red + "04" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18 } }, "\u{1F4F7}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 8, color: C.red } }, "Photo"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", capture: "environment", style: { display: "none" }, onChange: (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          setActiveWT((p) => ({ ...p, items: p.items.map((it, i) => i === wtConfirm ? { ...it, photo: ev.target.result } : it) }));
        };
        reader.readAsDataURL(file);
        e.target.value = "";
      } }))), /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.red, onClick: () => {
        const note = document.getElementById("wt-note")?.value || "";
        setActiveWT((p) => ({ ...p, items: p.items.map((it, i) => i === wtConfirm ? { ...it, confirmed: true, note } : it) }));
        setWtConfirm(null);
      } }, "Confirm Not Completed")));
    })(), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 0, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("button", { onClick: ddPrev, style: { background: "none", border: "none", cursor: "pointer", padding: "6px 10px" } }, /* @__PURE__ */ React.createElement(Ic, { n: "back", s: 18, c: C.blue })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, fontWeight: 700, color: dashDate === today ? C.blue : C.tx } }, ddLabel(dashDate)), dashDate !== today && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, dashDate)), /* @__PURE__ */ React.createElement("button", { onClick: ddNext, style: { background: "none", border: "none", cursor: dashDate === today ? "not-allowed" : "pointer", padding: "6px 10px", opacity: dashDate === today ? 0.3 : 1 } }, /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 18, c: C.blue })), dashDate !== today && /* @__PURE__ */ React.createElement("button", { onClick: () => setDashDate(today), style: { background: C.blue, border: "none", borderRadius: 6, color: "#fff", fontSize: 10, fontWeight: 600, padding: "4px 8px", cursor: "pointer", fontFamily: C.font } }, "Today"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, null, (() => {
      const dd = dashDate;
      const alerts = [];
      residents.forEach((r) => {
        (r.medChanges || []).forEach((mc) => {
          if (mc.d === dd) alerts.push({ type: "med", d: mc.d, sev: mc.sev, icon: "\u{1F3E5}", color: mc.sev === "high" ? C.red : C.org, title: mc.type, sub: fullName(r.name) + " \u2014 " + mc.note });
        });
        (r.sirs || []).forEach((s) => {
          if (s.d === dd) alerts.push({ type: "sir", d: s.d, sev: "high", icon: "\u26A0\uFE0F", color: C.red, title: "SIR: " + s.desc, sub: fullName(r.name) + " \u2014 " + s.st });
        });
      });
      prnRecs.filter((p) => p && p.d === dd).forEach((p) => {
        const rr = residents.find((x) => x.id === (meds.find((m) => m.id === p.medId) || {}).resId);
        alerts.push({ type: "prn", d: p.d, t: p.t, sev: "low", icon: "\u{1F48A}", color: C.blue, title: "PRN: " + p.medName + " " + p.dose, sub: (rr ? fullName(rr.name) : "?") + " \u2014 " + p.reason + (p.followUp ? " \u2713 " + p.followUp.result : " \u23F3 Pending"), tap: () => setModal("prnDash") });
      });
      tallies.filter((t) => t.d === dd).forEach((t) => {
        const rr = residents.find((x) => x.id === (t.resId || "r1"));
        alerts.push({ type: "beh", d: t.d, t: t.t, sev: "moderate", icon: "\u26A1", color: C.red, title: t.b, sub: (rr ? fullName(rr.name) : "?") + " at " + t.t + (t.note ? " \u2014 " + t.note.text.slice(0, 60) : ""), tap: () => {
          setBehView(t);
          setModal("behView");
        } });
      });
      memos.filter((m) => m.d === dd).forEach((m) => alerts.push({ type: "memo", d: m.d, sev: "low", icon: "\u{1F4E2}", color: C.pur, title: "Memo", sub: m.text.slice(0, 80) + (m.text.length > 80 ? "..." : ""), tap: () => setModal("memos") }));
      marRecs.filter((r) => r.d === dd).forEach((r) => alerts.push({ type: "mar", d: r.d, t: r.t, sev: "low", icon: "\u2705", color: C.grn, title: r.med, sub: gn(r.by) + " at " + r.t }));
      alerts.sort((a, b) => (b.t || "99:99").localeCompare(a.t || "99:99"));
      if (alerts.length === 0) return /* @__PURE__ */ React.createElement("div", { style: { padding: 20, textAlign: "center", color: C.tx3, fontSize: 13 } }, "No activity on ", ddLabel(dd));
      return alerts.map((a, i) => /* @__PURE__ */ React.createElement("div", { key: a.type + i, onClick: a.tap || void 0, style: { display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 12px", borderBottom: i < alerts.length - 1 ? "0.5px solid " + C.sepL : "none", cursor: a.tap ? "pointer" : "default", background: a.sev === "high" ? a.color + "04" : "transparent" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, marginTop: 1 } }, a.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: a.sev === "high" ? a.color : C.tx } }, a.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, a.sub)), a.t && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3, flexShrink: 0 } }, a.t), a.sev === "high" && /* @__PURE__ */ React.createElement("div", { style: { width: 7, height: 7, borderRadius: 4, background: C.red, marginTop: 5, flexShrink: 0 } }), a.tap && /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 14, c: C.tx3 + "60" })));
    })())), isAM && (() => {
      const pending = irReports.filter((r) => r.status === "pending");
      const myHomes = user.homes || [];
      const filtered = pending.filter((r) => myHomes.length === 0 || myHomes.includes(r.homeId));
      return filtered.length > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "\u{1F6A8} Incident Reports for Review (" + filtered.length + ")" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, null, filtered.map((ir, i) => {
        const rr = residents.find((x) => x.id === ir.resId);
        return /* @__PURE__ */ React.createElement("div", { key: ir.id, style: { padding: "10px 14px", borderBottom: i < filtered.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 42, height: 42, borderRadius: 12, background: (ir.formType === "sir" ? C.red : C.org) + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 } }, ir.formType === "sir" ? "\u{1F6A8}" : "\u{1F4CB}"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, ir.formType === "sir" ? "Special Incident Report" : "Shared Information"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, rr ? fullName(rr.name) : "?", " | ", ir.d, " ", ir.t, " | By: ", gn(ir.by)))), /* @__PURE__ */ React.createElement("div", { style: { margin: "8px 0", padding: 10, background: C.bg, borderRadius: 8, fontSize: 11 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Location:"), " ", ir.locType), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Medical Tx:"), " ", ir.medTx ? "Yes" : "No"), ir.incTypes?.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { gridColumn: "1/-1" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Incident:"), " ", ir.incTypes.join(", ")), ir.injTypes?.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { gridColumn: "1/-1" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Injury:"), " ", ir.injTypes.join(", ")), ir.medErr?.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { gridColumn: "1/-1" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Med Error:"), " ", ir.medErr.join(", "))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, fontSize: 11, lineHeight: 1.4 } }, ir.desc?.slice(0, 200), ir.desc?.length > 200 ? "..." : ""), ir.photos?.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, marginTop: 6 } }, ir.photos.map((ph, pi) => /* @__PURE__ */ React.createElement("img", { key: pi, src: ph, style: { width: 50, height: 50, borderRadius: 6, objectFit: "cover" } })))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
          setIrReports((p) => p.map((r) => r.id === ir.id ? { ...r, status: "approved", reviewedBy: user.id, reviewDate: today } : r));
        }, style: { flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: C.grn, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: C.font } }, "\u2713", " Approve"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
          const reason = prompt("Reason for returning?");
          if (reason) setIrReports((p) => p.map((r) => r.id === ir.id ? { ...r, status: "returned", returnReason: reason, reviewedBy: user.id } : r));
        }, style: { flex: 1, padding: "8px 0", borderRadius: 8, border: "1.5px solid " + C.org, background: C.card, color: C.org, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: C.font } }, "Return"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
          const lines = [
            ir.formType === "sir" ? "ALTA CALIFORNIA REGIONAL CENTER - SPECIAL INCIDENT REPORT" : "SHARED INFORMATION REPORT",
            "",
            "Client: " + ir.clientName,
            "UCI: " + (ir.uci || "N/A"),
            "DOB: " + (ir.dob || "N/A"),
            "Sex: " + (ir.sex || "N/A"),
            "Date of Occurrence: " + ir.dateOcc,
            "Time: " + (ir.timeOcc || "N/A"),
            "Location: " + ir.locType,
            "Address: " + (ir.address || "N/A"),
            ""
          ];
          if (ir.formType === "sir") {
            if (ir.incTypes?.length) lines.push("Incident Type: " + ir.incTypes.join(", "));
            if (ir.abuseBy && ir.abuseBy !== "Not Applicable") lines.push("Suspected Abuse By: " + ir.abuseBy);
            if (ir.negTypes?.length) lines.push("Neglect: " + ir.negTypes.join(", "));
            if (ir.crmTypes?.length) lines.push("Crime: " + ir.crmTypes.join(", "));
            if (ir.injTypes?.length) lines.push("Injury: " + ir.injTypes.join(", "));
            if (ir.medErr?.length) lines.push("Med Error: " + ir.medErr.join(", "));
            lines.push("Medical Treatment: " + (ir.medTx ? "Yes" : "No"));
            lines.push("");
          }
          lines.push("DESCRIPTION:", ir.desc || "", "", "Submitted By: " + (ir.subBy || ""), "Title: " + (ir.subTitle || ""), "Phone: " + (ir.subPhone || ""), "Agency: " + (ir.agency || ""), "Date Submitted: " + ir.dateSub);
          if (ir.reviewedBy) lines.push("", "Reviewed By: " + gn(ir.reviewedBy), "Review Date: " + ir.reviewDate);
          const blob = new Blob([lines.join("\n")], { type: "text/plain" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = (ir.formType === "sir" ? "SIR" : "SharedInfo") + "-" + (ir.clientName || "").replace(/[^a-zA-Z]/g, "") + "-" + ir.dateOcc + ".txt";
          a.click();
        }, style: { padding: "8px 12px", borderRadius: 8, border: "1.5px solid " + C.blue, background: C.card, color: C.blue, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: C.font } }, "\u2B07")));
      })))) : null;
    })(), isAM && homeTodayBeh > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Behavior Tracking (" + homeTodayBeh + " today)" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, (() => {
      const byRes = {};
      tallies.filter((t) => t.d === today).forEach((t) => {
        const rid = t.resId || "r1";
        if (!byRes[rid]) byRes[rid] = [];
        byRes[rid].push(t);
      });
      return /* @__PURE__ */ React.createElement(Card, null, Object.entries(byRes).map(([rid, ts], i, arr) => {
        const r = residents.find((x) => x.id === rid);
        return /* @__PURE__ */ React.createElement("div", { key: rid, onClick: () => setModal("adminBeh_" + rid), style: { padding: "10px 14px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 42, height: 42, borderRadius: 12, background: C.red + "10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: C.red } }, r ? resInit(r.name) : "?"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, r ? fullName(r.name) : "Unknown"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 3, marginTop: 3 } }, [...new Set(ts.map((t) => t.b))].map((b) => /* @__PURE__ */ React.createElement("span", { key: b, style: { fontSize: 10, padding: "2px 6px", borderRadius: 5, background: C.red + "10", color: C.red, fontWeight: 600 } }, b, " (", ts.filter((t) => t.b === b).length, ")"))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, marginTop: 2 } }, ts.length, " incident", ts.length !== 1 ? "s" : "", " | Last: ", ts[ts.length - 1].t)), /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 16, c: C.tx3 }));
      }));
    })())), (() => {
      const todayApts = appointments.filter((a) => a && a.date === today && a.resId);
      return todayApts.length > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Appointments Today (" + todayApts.length + ")" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, null, todayApts.map((a, i) => {
        const r = residents.find((x) => x.id === a.resId);
        const ini = r ? r.name.split(/[\s,.]+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "??";
        const tc = a.type === "Specialist" ? C.pur : a.type === "Dental" ? C.teal : a.type === "Behavioral" ? C.org : C.blue;
        return /* @__PURE__ */ React.createElement(Row, { key: a.id, left: /* @__PURE__ */ React.createElement("div", { style: { width: 40, height: 40, borderRadius: 10, background: tc + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: tc } }, ini), title: a.time + " \u2014 " + a.title, sub: a.doctor + " | " + (a.location || "").split(",")[0], right: /* @__PURE__ */ React.createElement(Pill, { text: a.status === "confirmed" ? "\u2713 Confirmed" : "Scheduled", cl: a.status === "confirmed" ? C.grn : C.org }), onClick: () => {
          setViewApt(a);
          setModal("aptView");
        }, last: i === todayApts.length - 1 });
      })))) : null;
    })());
  })();
  const ResDetail = () => {
    const r = residents.find((x) => x.id === selRes);
    if (!r) return null;
    const rm = resMeds;
    const todayBeh = tallies.filter((t) => t.d === today);
    const fn = fullName(r.name);
    const rSkills = SKILLS_BY_RES[selRes] || [];
    const activeMeds = rm.filter((m) => m.status === "active");
    const todayDocs = docs.filter((d) => d.resId === r.id && d.d === today);
    const ChipSelect = ({ label, options, value, onChange, onAdd }) => {
      return /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 9 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 3 } }, label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 } }, options.map((o) => /* @__PURE__ */ React.createElement("button", { key: o, onClick: () => onChange(o), style: { padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: value === o ? 600 : 500, border: "1px solid " + (value === o ? C.blue : C.sepL), background: value === o ? C.blue + "10" : "transparent", color: value === o ? C.blue : C.tx2, cursor: "pointer", fontFamily: C.font } }, o))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement("input", { defaultValue: "", id: "cs-" + label, placeholder: "Add new...", style: { flex: 1, padding: "6px 10px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box" } }), custom.trim() && /* @__PURE__ */ React.createElement("button", { onClick: () => {
        onAdd(cv.value.trim());
        onChange(custom.trim());
        cv.value = "";
      }, style: { padding: "6px 10px", borderRadius: 8, border: "none", background: C.blue, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" } }, "+")));
    };
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Hdr, { title: fn, left: /* @__PURE__ */ React.createElement("button", { onClick: () => {
      if (resSubTab !== "dash") {
        setResSubTab("dash");
      } else {
        setSelRes(null);
        setResSubTab("dash");
      }
    }, style: { background: "none", border: "none", cursor: "pointer", color: C.blue, fontSize: 14, fontFamily: C.font, display: "flex", alignItems: "center" } }, /* @__PURE__ */ React.createElement(Ic, { n: "back", s: 16, c: C.blue }), " ", resSubTab !== "dash" ? fn.split(" ")[0] : "Back"), right: perms.mar && (resSubTab === "mar" || resSubTab === "medlist") ? /* @__PURE__ */ React.createElement(Btn, { sm: true, onClick: () => resSubTab === "medlist" ? printMedList() : printMAR() }, /* @__PURE__ */ React.createElement(Ic, { n: "print", s: 12, c: "#fff" })) : null }), /* @__PURE__ */ React.createElement(AllergyBanner, { r }), resSubTab === "dash" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 14px 6px", display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(180deg, rgba(0,122,255,.04), transparent)", borderRadius: "0 0 16px 16px" } }, /* @__PURE__ */ React.createElement(Av, { name: r.name, s: 56, cl: C.blue }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 700 } }, fn), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.tx3 } }, "DOB: ", r.dob, " | Age: ", getAge(r.dob), " | UCI: ", r.uci || "\u2014"), (() => {
      const lastW = weightRecs.filter((w) => w.resId === selRes).sort((a, b) => b.d.localeCompare(a.d))[0];
      const prevW = weightRecs.filter((w) => w.resId === selRes).sort((a, b) => b.d.localeCompare(a.d))[1];
      const diff = lastW && prevW ? lastW.weight - prevW.weight : null;
      return lastW ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2, marginTop: 2, display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700 } }, "\u2696\uFE0F", " ", lastW.weight, " lbs"), diff !== null && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: diff > 0 ? C.red : diff < 0 ? C.blue : C.grn } }, diff > 0 ? "\u25B2+" + diff : diff < 0 ? "\u25BC" + diff : "\u2014 0"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, "(", lastW.month, ")")) : /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.org, marginTop: 2, fontWeight: 600 } }, "\u26A0\uFE0F", " Weight needed");
    })(), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2, marginTop: 2 } }, activeMeds.length, " active med", activeMeds.length !== 1 ? "s" : "", " | ", rSkills.length, " skill goal", rSkills.length !== 1 ? "s" : ""))), (r.bgInfo || r.diagnosis && r.diagnosis.length > 0) && /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 14px 0" } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: "10px 14px", background: "linear-gradient(135deg, #f0f7ff, #fff)", border: "1px solid #e0edff" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12 } }, "\u{1F4CB}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: C.blue } }, "BACKGROUND")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2, lineHeight: 1.5 } }, r.bgInfo ? r.bgInfo.replace(/\[AGE\]/g, String(getAge(r.dob))).replace(/\[age\]/g, String(getAge(r.dob))) : fn + " is a " + getAge(r.dob) + "-year-old individual. " + (r.diagnosis && r.diagnosis.length ? "Diagnosis: " + r.diagnosis.join(", ") + "." : "")))), (() => {
      const recentAlerts = aptAlerts.filter((a) => a.resId === selRes).sort((a, b) => b.d.localeCompare(a.d)).slice(0, 5);
      const recentMC = r.medChanges.slice(0, 3);
      return recentAlerts.length > 0 || recentMC.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 14px 0" } }, /* @__PURE__ */ React.createElement(Card, { style: { overflow: "hidden", border: "1px solid " + C.pk + "20" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.pk + "06", borderBottom: "0.5px solid " + C.sepL, display: "flex", alignItems: "center", gap: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12 } }, "\u{1F6A8}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: C.pk } }, "CHANGES SINCE LAST MEETING")), recentAlerts.map((al, i) => /* @__PURE__ */ React.createElement("div", { key: al.id, style: { padding: "6px 12px", borderBottom: "0.5px solid " + C.sepL, fontSize: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, color: C.pk } }, al.aptTitle || "Alert"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, al.d)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2, marginTop: 1 } }, al.text.slice(0, 80), al.text.length > 80 ? "..." : ""))), recentMC.map((mc, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "6px 12px", borderBottom: "0.5px solid " + C.sepL, fontSize: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, color: mc.sev === "high" ? C.red : C.org } }, mc.type), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, mc.d)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2, marginTop: 1 } }, mc.note))))) : null;
    })(), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } }, [
      ...isS ? [
        { l: "Appointments", sub: appointments.filter((a) => a && a.resId === selRes).length + " scheduled", e: "\u{1F4C5}", c: C.blue, v: "apt" },
        { l: "Doctors", sub: (r.doctors || []).length + " provider" + ((r.doctors || []).length !== 1 ? "s" : ""), e: "\u{1FA7A}", c: "#5856d6", v: "doctors" },
        { l: "Activity Feed", sub: "Staff documentation", e: "\u{1F4DD}", c: C.ind, v: "activity" }
      ] : [
        { l: "MAR", sub: (() => {
          let dueCnt = 0;
          let givenCnt = 0;
          activeMeds.filter((m) => m.freq !== "PRN").forEach((m) => m.times.forEach((t) => {
            if (Math.abs(hr - parseInt(t)) <= 2) {
              dueCnt++;
              if (marRecs.find((mr) => mr.med === m.name && mr.d === today && mr.sTime === t)) givenCnt++;
            }
          }));
          return givenCnt + "/" + dueCnt + " given";
        })(), e: "\u{1F48A}", c: C.grn, v: "mar" },
        { l: "Medication List", sub: activeMeds.length + " active", e: "\u{1F4C4}", c: C.blue, v: "medlist" },
        { l: "Behaviors", sub: todayBeh.length + " today", e: "\u26A1", c: C.red, v: "beh" },
        { l: "Programs", sub: (() => {
          const bd = behDomains.filter((d) => d.resId === selRes);
          return bd.filter((d) => d.status.includes("Active") && !d.status.includes("Inactive")).length + " active";
        })(), e: "\u{1F4CB}", c: "#34c759", v: "programs" },
        { l: "Analytics", sub: "Trends & charts", e: "\u{1F4C8}", c: "#5856d6", v: "analytics" },
        { l: "Skill Goals", sub: rSkills.length + " goals", e: "\u{1F3AF}", c: C.teal, v: "skill" },
        { l: "Vitals", sub: (() => {
          const wt = weightRecs.filter((w) => w.resId === selRes && w.month === curMonth);
          return wt.length ? wt[0].weight + " lbs" : "\u26A0\uFE0F Weight due";
        })(), e: "\u2764\uFE0F", c: C.pk, v: "hlth" },
        { l: "Medical Changes", sub: r.medChanges.length + " recorded", e: "\u{1F3E5}", c: C.org, v: "medch" },
        { l: "Doctors", sub: (r.doctors || []).length + " provider" + ((r.doctors || []).length !== 1 ? "s" : ""), e: "\u{1FA7A}", c: "#5856d6", v: "doctors" },
        { l: "Reports", sub: "Annual/Quarterly", e: "\u{1F4CA}", c: "#ff2d55", v: "reports" },
        ...cm ? [{ l: "IPP", sub: (() => {
          const aIPP = ippDocs.find((ip) => ip.resId === selRes && ip.active);
          return aIPP ? aIPP.filename.slice(0, 18) : "No active IPP";
        })(), e: "\u{1F4C4}", c: "#5856d6", v: "ipp" }] : [],
        { l: "Activity", sub: todayDocs.length + " entries today", e: "\u{1F4DD}", c: C.ind, v: "activity" }
      ]
    ].map((w) => /* @__PURE__ */ React.createElement(Card, { key: w.v, onClick: () => setResSubTab(w.v), style: { cursor: "pointer", padding: 14, transition: "transform .15s ease", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #f0f7ff 0%, #fff 50%, " + w.c + "0a 100%)", border: "1px solid #e0edff" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, marginBottom: 6, filter: "drop-shadow(0 1px 2px rgba(0,0,0,.1))" } }, w.e), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: C.tx } }, w.l), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: w.c, fontWeight: 500, marginTop: 2 } }, w.sub), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 8, right: 8 } }, /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 14, c: w.c + "50" })), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, " + w.c + "60, " + w.c + "20)" } })))), isAM && marArchive.filter((a) => a.resId === (selRes || "r1")).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 0" } }, /* @__PURE__ */ React.createElement(Sec, { title: "\u{1F4C1} Archived MARs" }), /* @__PURE__ */ React.createElement(Card, null, [...new Set(marArchive.filter((a) => a.resId === (selRes || "r1")).map((a) => a.month))].sort().reverse().map((mo, i, arr) => {
      const [y, m] = mo.split("-");
      const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
      const arc = marArchive.find((a) => a.month === mo && a.resId === (selRes || "r1"));
      return /* @__PURE__ */ React.createElement("div", { key: mo, style: { padding: "10px 12px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none", display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, (arc.records || []).length, " administrations \xB7 ", (arc.medsSnapshot || []).length, " medications")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => printMAR(mo), style: { padding: "6px 10px", borderRadius: 8, border: "1px solid " + C.blue, background: C.blue + "08", color: C.blue, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: C.font, display: "flex", alignItems: "center", gap: 3 } }, /* @__PURE__ */ React.createElement(Ic, { n: "print", s: 12, c: C.blue }), " View"), /* @__PURE__ */ React.createElement("button", { onClick: () => dlMAR(mo), style: { padding: "6px 10px", borderRadius: 8, border: "none", background: C.blue, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: C.font, display: "flex", alignItems: "center", gap: 3 } }, "\u2B07", " Download")));
    })))), resSubTab === "mar" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Sec, { title: "Medications", right: /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, cm && /* @__PURE__ */ React.createElement("button", { onClick: () => setModal("addMed"), style: { background: "none", border: "none", cursor: "pointer", color: C.blue, fontSize: 12, fontWeight: 600, fontFamily: C.font } }, "+ Add"), /* @__PURE__ */ React.createElement("button", { onClick: () => marTab === "prn" ? null : printMAR(), style: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2, color: C.blue, fontSize: 11, fontWeight: 600, fontFamily: C.font } }, /* @__PURE__ */ React.createElement(Ic, { n: "print", s: 13, c: C.blue }), " Print")) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", background: "rgba(118,118,128,.12)", borderRadius: 9, padding: 2 } }, [{ l: "Front", v: "front" }, { l: "PRN", v: "prn" }].map((o) => /* @__PURE__ */ React.createElement("button", { key: o.v, onClick: () => setMarTab(o.v), style: { flex: 1, padding: "6px 4px", borderRadius: 7, border: "none", background: marTab === o.v ? o.v === "prn" ? C.blue : C.card : "transparent", color: marTab === o.v ? o.v === "prn" ? "#fff" : C.tx : C.tx3, fontSize: 11, fontWeight: marTab === o.v ? 600 : 500, fontFamily: C.font, cursor: "pointer", boxShadow: marTab === o.v ? "0 1px 3px rgba(0,0,0,.08)" : "none" } }, o.l, o.v === "prn" && prnRecs.filter((p) => p.d === today).length > 0 ? " (" + prnRecs.filter((p) => p.d === today).length + ")" : "")))), marTab === "front" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, (() => {
      const now = /* @__PURE__ */ new Date();
      const moLabel = now.toLocaleString("en-US", { month: "long", year: "numeric" }).toUpperCase();
      const doctors = [...new Set(rm.filter((m) => m.status === "active").map((m) => m.doctor).filter(Boolean))];
      return /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 12px", background: C.blue + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.blue, textAlign: "center" } }, "MAR \u2014 ", moLabel)), doctors.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 12px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 600, color: C.tx3, marginBottom: 2 } }, "PHYSICIANS"), doctors.map((d, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { fontSize: 12, color: C.tx2, padding: "1px 0" } }, d))));
    })(), /* @__PURE__ */ React.createElement(Card, null, isOnHV(selRes) && /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.pur + "08" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: C.pur } }, "HOME VISIT \u2014 Meds paused until ", (residents.find((x) => x.id === selRes)?.hvData?.toDate || "?") + " " + (residents.find((x) => x.id === selRes)?.hvData?.toTime || ""))), rm.filter((m) => m.status === "active" && m.freq !== "PRN" && !isOnHV(m.resId)).length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: 16, textAlign: "center", color: C.tx3, fontSize: 13 } }, isOnHV(selRes) ? "Meds paused (home visit)" : "No active meds"), rm.filter((m) => m.status === "active" && m.freq !== "PRN" && !isOnHV(m.resId)).map((m, i, arr) => {
      const tc = m.times && m.times[0] ? getMTC(m.times[0]) : null;
      const allGiven = m.times.length > 0 && m.times.every((st) => marRecs.find((mr) => mr.med === m.name && mr.d === today && mr.sTime === st));
      return /* @__PURE__ */ React.createElement("div", { key: m.id, style: { padding: "10px 12px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none", background: tc ? tc.bgL : "transparent" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, cm ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 3 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, background: C.grn + "12", border: "1.5px solid " + C.grn + "40" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 10, height: 10, borderRadius: 5, background: C.grn } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: 700, color: C.grn } }, "Active")), /* @__PURE__ */ React.createElement("div", { onClick: () => {
        setHoldForm({ medId: m.id, reason: "", physician: "", fromDate: today, fromTime: "", toDate: "", toTime: "" });
        setModal("hold");
      }, style: { display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, background: C.yel + "10", border: "1.5px solid " + C.yel + "30", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 10, height: 10, borderRadius: 5, background: C.yel } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: 700, color: C.yel } }, "Hold")), /* @__PURE__ */ React.createElement("div", { onClick: () => {
        setHvForm({ resId: selRes, fromDate: today, fromTime: "", toDate: "", toTime: "" });
        setModal("hv");
      }, style: { display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, background: C.pur + "10", border: "1.5px solid " + C.pur + "30", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 10, height: 10, borderRadius: 5, background: C.pur } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: 700, color: C.pur } }, "Home Visit")), /* @__PURE__ */ React.createElement("div", { onClick: () => {
        setDcForm({ medId: m.id, reason: "", physician: "" });
        setModal("dc");
      }, style: { display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, background: C.red + "08", border: "1.5px solid " + C.red + "25", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 10, height: 10, borderRadius: 5, background: C.red } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: 700, color: C.red } }, "DC"))) : /* @__PURE__ */ React.createElement(SL, { status: "active" }), /* @__PURE__ */ React.createElement(PillVisual, { pill: m.pill, size: 36 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, cursor: "pointer" }, onClick: () => {
        setViewMed(m.id);
        setModal("medD");
      } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, m.name, " ", m.dose, " ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: C.blue, background: C.blue + "10", padding: "1px 5px", borderRadius: 4 } }, "x", m.tabsPerDose || 1)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, m.route, " | ", m.freq), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 } }, m.times.map((st, ti) => {
        const g = marRecs.find((mr) => mr.med === m.name && mr.d === today && mr.sTime === st);
        const tc2 = getMTC(st);
        return /* @__PURE__ */ React.createElement("div", { key: ti, style: { display: "flex", alignItems: "center", gap: 3, padding: "2px 6px", borderRadius: 6, background: g ? C.grn + "15" : tc2 ? tc2.bg : "#eee" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: tc2 ? tc2.hex : C.tx3 } }, st), g ? /* @__PURE__ */ React.createElement("span", { onClick: () => {
          if (confirm("Are you sure you want to unmark " + m.name + " (" + st + ") as given? This will remove the administration record.")) setMarRecs((p) => p.filter((mr) => !(mr.med === m.name && mr.d === today && mr.sTime === st)));
        }, style: { fontSize: 10, fontWeight: 700, color: C.grn, cursor: "pointer" } }, pureInit(gn(g.by)), " x", g.qty || 1) : /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
          e.stopPropagation();
          adminMed(m, st);
        }, style: { fontSize: 9, fontWeight: 700, color: "#fff", background: C.grn, border: "none", borderRadius: 4, padding: "1px 6px", cursor: "pointer", fontFamily: C.font } }, "Give"));
      })))));
    }), cm && (rm.filter((m) => m.status === "hold" || m.status === "dcd").length > 0 || isOnHV(selRes)) && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.tx3 + "08", borderTop: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: C.tx3 } }, "INACTIVE (Admin)")), rm.filter((m) => m.status === "hold").map((m) => /* @__PURE__ */ React.createElement("div", { key: m.id, style: { padding: "8px 12px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { onClick: () => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, status: "active", holdData: void 0 } : x)), style: { width: 14, height: 14, borderRadius: 7, background: C.yel, border: "1.5px solid " + C.yel, cursor: "pointer" } }), /* @__PURE__ */ React.createElement(PillVisual, { pill: m.pill, size: 28 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, opacity: 0.6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, m.name, " ", m.dose), m.holdData && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.yel } }, "HOLD: ", m.holdData.reason, " | ", m.holdData.fromDate, " \u2192 ", m.holdData.toDate)), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.yel } }, "H")))), isOnHV(selRes) && rm.filter((m) => m.status === "active").map((m) => /* @__PURE__ */ React.createElement("div", { key: "hv" + m.id, style: { padding: "8px 12px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { onClick: () => {
      const r2 = residents.find((x) => x.id === selRes);
      if (r2) setResidents((p) => p.map((x) => x.id === selRes ? { ...x, hvData: void 0 } : x));
    }, style: { width: 14, height: 14, borderRadius: 7, background: C.pur, border: "1.5px solid " + C.pur, cursor: "pointer" } }), /* @__PURE__ */ React.createElement(PillVisual, { pill: m.pill, size: 28 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, opacity: 0.6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13 } }, m.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.pur } }, "HOME VISIT")), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.pur } }, "HV")))), rm.filter((m) => m.status === "dcd").map((m) => /* @__PURE__ */ React.createElement("div", { key: m.id, style: { padding: "8px 12px", opacity: 0.5 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 14, height: 14, borderRadius: 7, background: C.red } }), /* @__PURE__ */ React.createElement(PillVisual, { pill: m.pill, size: 24 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, textDecoration: "line-through" } }, m.name, " ", m.dose), m.dcData && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.red } }, "DC: ", m.dcData.reason)), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.red } }, "DC"))))))), marTab === "prn" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, rm.filter((m) => m.freq === "PRN" && m.status === "active").length > 0 && /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.blue + "08", borderBottom: "0.5px solid " + C.sepL, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: C.blue } }, "PRN Medication Record"), perms.mar && /* @__PURE__ */ React.createElement("button", { onClick: () => {
      const r2 = residents.find((x) => x.id === selRes) || residents[0];
      const css = "@page{size:landscape;margin:0.4in}*{margin:0;padding:0;box-sizing:border-box}body{font:10px Arial;padding:0}table{border-collapse:collapse;width:100%}th,td{border:1px solid #000;padding:3px 5px;font-size:9px}th{background:#f0f0f0;font-weight:700;text-align:center;font-size:8px}.t{text-align:center;font-size:15px;font-weight:700;border:2px solid #000;padding:6px}.ir{border:2px solid #000;border-top:none;padding:5px 10px;font-size:10px}.al{background:#ffe0e0;border:2px solid #c00;padding:5px 8px;font-weight:700;color:#c00;font-size:9px;margin:4px 0}td.c{text-align:center}td.b{font-weight:700;text-align:center}";
      let h = "<style>" + css + "</style>";
      h += "<div class='t'>PRN Medication Record</div><div class='ir'>Consumer: <b>" + fullName(r2.name) + "</b> | DOB: " + r2.dob + " | Home: " + (HOMES.find((hx) => hx.id === r2.home) || {}).full + " | Date: <b>" + today + "</b></div>";
      h += "<div class='al'>ALLERGIES: " + r2.allergies.map((a) => a.name + " (" + a.reaction + " - " + a.sev + ")").join(" | ") + "</div>";
      h += "<table style='margin:8px 0'><tr><th>Date</th><th>Time</th><th>Medication</th><th>Dose</th><th>Route</th><th>Int.</th><th>Reason Given</th><th>Follow-Up Results</th><th>Time Checked</th><th>Int.</th></tr>";
      prnRecs.forEach((rec) => {
        h += "<tr><td class='c'>" + rec.d + "</td><td class='c'>" + rec.t + "</td><td>" + rec.medName + "</td><td class='c'>" + rec.dose + "</td><td class='c'>" + rec.route + "</td><td class='b'>" + pureInit(gn(rec.by)) + "</td><td>" + rec.reason + "</td><td>" + (rec.followUp ? rec.followUp.result : "") + "</td><td class='c'>" + (rec.followUp ? rec.followUp.t : "") + "</td><td class='b'>" + (rec.followUp ? pureInit(gn(rec.followUp.by)) : "") + "</td></tr>";
      });
      for (let i2 = 0; i2 < Math.max(0, 15 - prnRecs.length); i2++) h += "<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
      h += "</table><div style='margin-top:12px;font-size:10px;display:flex;justify-content:space-between'><div><div style='border-bottom:1px solid #000;width:200px;height:18px'></div><div style='font-size:8px'>Staff Signature</div></div><div><div style='border-bottom:1px solid #000;width:120px;height:18px'></div><div style='font-size:8px'>Date</div></div></div>";
      doPrint(h, "PRN-" + fullName(r2.name).replace(/[^a-zA-Z]/g, "") + "-" + today + ".html");
    }, style: { background: "none", border: "none", cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Ic, { n: "print", s: 16, c: C.blue }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 12px", display: "flex", justifyContent: "space-between", fontSize: 12, borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", null, "Consumer: ", /* @__PURE__ */ React.createElement("b", null, r.name)), /* @__PURE__ */ React.createElement("span", null, "Total PRNs: ", /* @__PURE__ */ React.createElement("b", { style: { color: C.blue } }, prnRecs.length))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "0.5px solid " + C.sepL } }, [...rm.filter((m) => m.freq === "PRN" && m.status === "active"), null, null, null, null, null, null].slice(0, 6).map((m, i) => {
      const medPrnStart = m && prnRecs.filter((p) => p.medId === m.id).length > 0 ? prnRecs.filter((p) => p.medId === m.id).reduce((mn, r2) => r2.d < mn ? r2.d : mn, prnRecs.filter((p) => p.medId === m.id)[0].d) : null;
      return /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "6px 10px", borderBottom: "0.5px solid " + C.sepL, borderRight: i % 2 === 0 ? "0.5px solid " + C.sepL : "none", minHeight: 36, background: m ? "transparent" : C.alt } }, m ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 600 } }, "Date Started: ", medPrnStart || "\u2014"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600 } }, m.name, " ", m.dose), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, m.route, " \u2014 ", m.instr)) : /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 + "60", fontStyle: "italic" } }, "Empty slot"));
    }))), prnFollowUps.filter((f) => !f.dismissed && f.by === user.id && Date.now() >= f.dueAt).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 12px", background: tick % 2 === 0 ? C.red + "12" : C.red + "06", borderRadius: 12, border: "2px solid " + C.red, marginBottom: 8, transition: "background 0.5s" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16 } }, tick % 2 === 0 ? "\u{1F514}" : "\u{1F515}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: C.red, flex: 1 } }, "PRN FOLLOW-UP DUE"), /* @__PURE__ */ React.createElement("button", { onClick: playPrnAlarm, style: { background: "none", border: "1px solid " + C.red + "40", borderRadius: 6, padding: "2px 8px", color: C.red, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, "\u{1F50A} Sound")), prnFollowUps.filter((f) => !f.dismissed && f.by === user.id && Date.now() >= f.dueAt).map((f) => {
      const rec = prnRecs.find((r2) => r2.id === f.prnId);
      if (!rec) return null;
      const minsAgo = Math.round((Date.now() - f.dueAt) / 6e4);
      return /* @__PURE__ */ React.createElement("div", { key: f.prnId, style: { display: "flex", alignItems: "center", gap: 6, padding: "4px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, flex: 1 } }, /* @__PURE__ */ React.createElement("b", null, rec.medName), " ", rec.dose, " given at ", rec.t, " ", /* @__PURE__ */ React.createElement("span", { style: { color: C.red, fontWeight: 600 } }, "(", minsAgo > 0 ? minsAgo + "m overdue" : "now", ")")), /* @__PURE__ */ React.createElement(Btn, { sm: true, color: C.red, onClick: () => adminPrnFollow(f.prnId) }, "Complete"));
    })), rm.filter((m) => m.freq === "PRN" && m.status === "active").map((m) => {
      const todayGiven = prnRecs.filter((r2) => r2.medId === m.id && r2.d === today);
      return /* @__PURE__ */ React.createElement(Card, { key: m.id, style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(PillVisual, { pill: m.pill, size: 36 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, cursor: "pointer" }, onClick: () => {
        setViewMed(m.id);
        setModal("medD");
      } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, m.name, " ", m.dose, " ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: C.blue, background: C.blue + "10", padding: "1px 5px", borderRadius: 4 } }, "x", m.tabsPerDose || 1)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, m.route, " | PRN | ", m.instr)), /* @__PURE__ */ React.createElement(Btn, { sm: true, color: C.blue, onClick: () => adminPrn(m) }, "Give PRN")), todayGiven.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { borderTop: "0.5px solid " + C.sepL, padding: "6px 12px", background: C.blue + "04" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 600, color: C.blue, marginBottom: 2 } }, "Today (", todayGiven.length, "x)"), todayGiven.map((rec, i) => /* @__PURE__ */ React.createElement("div", { key: rec.id, style: { display: "flex", justifyContent: "space-between", fontSize: 11, padding: "2px 0" } }, /* @__PURE__ */ React.createElement("span", null, rec.t, " \u2014 ", rec.reason), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, color: rec.followUp ? C.grn : C.org } }, rec.followUp ? pureInit(gn(rec.by)) + " \u2713" : "F/U pending")))));
    }), prnRecs.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 0 4px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: C.tx3 } }, "PRN Record (", prnRecs.length, " total)")), /* @__PURE__ */ React.createElement(Card, null, prnRecs.slice().reverse().slice(0, 15).map((rec, i, arr) => /* @__PURE__ */ React.createElement("div", { key: rec.id, style: { padding: "8px 12px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, rec.medName, " ", rec.dose), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, rec.d, " at ", rec.t, " | ", rec.route)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.blue } }, pureInit(gn(rec.by))))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2, marginTop: 2 } }, "Reason: ", rec.reason), rec.followUp ? /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, padding: "4px 8px", background: C.grn + "06", borderRadius: 6, fontSize: 11 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, color: C.grn } }, "Results:"), " ", rec.followUp.result)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 2, color: C.tx3, fontSize: 10 } }, /* @__PURE__ */ React.createElement("span", null, "Time Results Checked: ", /* @__PURE__ */ React.createElement("b", null, rec.followUp.t)), /* @__PURE__ */ React.createElement("span", null, "Int: ", /* @__PURE__ */ React.createElement("b", null, pureInit(gn(rec.followUp.by)))))) : /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, padding: "4px 8px", background: C.org + "06", borderRadius: 6, fontSize: 11, color: C.org, fontWeight: 600 } }, "Results pending \u2014 awaiting follow-up")))))), isAM && marArchive.filter((a) => a.resId === (selRes || "r1")).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.tx3, marginBottom: 4 } }, "Archived MARs"), [...new Set(marArchive.filter((a) => a.resId === (selRes || "r1")).map((a) => a.month))].sort().reverse().map((mo) => {
      const [y, m] = mo.split("-");
      const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
      const arc = marArchive.find((a) => a.month === mo && a.resId === (selRes || "r1"));
      return /* @__PURE__ */ React.createElement(Card, { key: mo, style: { marginBottom: 4, padding: "10px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, (arc.records || []).length, " administrations \xB7 ", (arc.medsSnapshot || []).length, " meds")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => printMAR(mo), style: { padding: "5px 8px", borderRadius: 6, border: "1px solid " + C.blue, background: "transparent", color: C.blue, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, /* @__PURE__ */ React.createElement(Ic, { n: "print", s: 11, c: C.blue }), " View"), /* @__PURE__ */ React.createElement("button", { onClick: () => dlMAR(mo), style: { padding: "5px 8px", borderRadius: 6, border: "none", background: C.blue, color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, "\u2B07"))));
    }))), resSubTab === "medlist" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.blue + "06", borderBottom: "0.5px solid " + C.sepL, display: "flex", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: C.blue, flex: 1 } }, "Current Medications"), /* @__PURE__ */ React.createElement("button", { onClick: () => printMedList(), style: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, color: C.blue, fontSize: 11, fontWeight: 600, fontFamily: C.font } }, /* @__PURE__ */ React.createElement(Ic, { n: "print", s: 14, c: C.blue }), " Print")), rm.filter((m) => m.status === "active").length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 16, textAlign: "center", color: C.tx3 } }, "No active medications") : rm.filter((m) => m.status === "active").map((m, i, arr) => /* @__PURE__ */ React.createElement("div", { key: m.id, style: { padding: "10px 12px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(PillVisual, { pill: m.pill, size: 30 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, m.name, " ", /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 400, color: C.tx2 } }, m.dose)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, m.route, " | ", m.freq, m.times.length ? /* @__PURE__ */ React.createElement(React.Fragment, null, " | ", m.times.map((t, ti) => {
      const tc2 = getMTC(t);
      return /* @__PURE__ */ React.createElement("span", { key: ti, style: { display: "inline-block", padding: "1px 5px", borderRadius: 4, background: tc2 ? tc2.bg : "#eee", color: tc2 ? tc2.hex : C.tx3, fontWeight: 600, fontSize: 10, marginLeft: ti > 0 ? 2 : 0 } }, t);
    })) : ""), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2, marginTop: 2 } }, m.instr)), /* @__PURE__ */ React.createElement(Pill, { text: m.freq === "PRN" ? "PRN" : "Sched", cl: m.freq === "PRN" ? C.blue : C.grn })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, marginTop: 4, paddingLeft: 40 } }, m.doctor, " | Rx: ", m.rx, " | " + (m.tabsPerDose || 1) + " tab" + ((m.tabsPerDose || 1) > 1 ? "s" : "") + "/dose", m.reason ? " | " + m.reason : ""), m.pill && !m.pill.img && /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 3, padding: "2px 6px", borderRadius: 5, background: C.teal + "10", cursor: "pointer", marginTop: 2, width: "fit-content" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: C.teal, fontWeight: 600 } }, "\\uD83D\\uDCF7 Add Photo"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", capture: "environment", style: { display: "none" }, onChange: (e2) => {
      const f2 = e2.target.files[0];
      if (!f2) return;
      const reader = new FileReader();
      reader.onload = (ev) => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, pill: { ...x.pill || {}, img: ev.target.result } } : x));
      reader.readAsDataURL(f2);
    } }))))), rm.filter((m) => m.status === "hold").length > 0 && /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.yel + "08", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: C.yel } }, "On Hold")), rm.filter((m) => m.status === "hold").map((m, i, arr) => /* @__PURE__ */ React.createElement("div", { key: m.id, style: { padding: "8px 12px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none", opacity: 0.7 } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600 } }, m.name), " ", m.dose, " \\u2014 ", /* @__PURE__ */ React.createElement("span", { style: { color: C.yel } }, m.holdData ? m.holdData.reason : "On Hold")))), rm.filter((m) => m.status === "dcd").length > 0 && /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.red + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: C.red } }, "Discontinued")), rm.filter((m) => m.status === "dcd").map((m, i, arr) => /* @__PURE__ */ React.createElement("div", { key: m.id, style: { padding: "8px 12px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none", opacity: 0.5, textDecoration: "line-through" } }, m.name, " ", m.dose)))), resSubTab === "beh" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.red + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: C.red } }, "Track Behavior")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr" } }, [{ l: "Physical Aggr", e: "\u26A1", c: C.red }, { l: "Verbal Aggr", e: "\u{1F5E3}\uFE0F", c: C.org }, { l: "Self-Injury", e: "\u26A0\uFE0F", c: C.pk }, { l: "Elopement", e: "\u{1F6AA}", c: C.pur }, { l: "Property Dest", e: "\u{1F4A5}", c: C.ind }, { l: "Non-Compliance", e: "\u{1F6AB}", c: C.blue }].map((b, i) => {
      const sel = behSel.includes(b.l);
      return /* @__PURE__ */ React.createElement("div", { key: b.l, onClick: () => setBehSel((p) => sel ? p.filter((x) => x !== b.l) : [...p, b.l]), style: { padding: 12, textAlign: "center", borderBottom: "0.5px solid " + C.sepL, borderRight: i % 2 === 0 ? "0.5px solid " + C.sepL : "none", cursor: "pointer", background: sel ? b.c + "10" : "transparent", transition: "background .2s" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22 } }, b.e), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 600, margin: "2px 0", color: sel ? b.c : C.tx2 } }, b.l), sel && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, color: b.c } }, "\u2713"));
    })), behSel.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: 10 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.red, onClick: () => setModal("behNote") }, "Submit ", behSel.length, " Behavior", behSel.length > 1 ? "s" : ""))), /* @__PURE__ */ React.createElement(Sec, { title: "Today's Log (" + todayBeh.length + ")" }), todayBeh.length === 0 ? /* @__PURE__ */ React.createElement(Card, { style: { padding: 16, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3, fontSize: 13 } }, "No behaviors today")) : /* @__PURE__ */ React.createElement(Card, null, todayBeh.map((t, i) => /* @__PURE__ */ React.createElement("div", { key: t.id, onClick: () => {
      setBehView(t);
      setModal("behView");
    }, style: { padding: "10px 12px", borderBottom: i < todayBeh.length - 1 ? "0.5px solid " + C.sepL : "none", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 6, height: 6, borderRadius: 3, background: C.red } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, t.b), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, t.t, t.note ? " | " + t.note.location : "")), t.note && /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 14, c: C.tx3 })), t.note && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, marginLeft: 14, fontSize: 12, color: C.tx2 } }, t.note.text.slice(0, 60), t.note.text.length > 60 ? "..." : ""), (t.abc || t.note && t.note.text) && (() => {
      const abc2 = t.abc || parseABC(t.note ? t.note.text : "", [t.b], t.note ? t.note.location : "", t.t);
      return abc2.a ? /* @__PURE__ */ React.createElement("div", { style: { marginTop: 3, marginLeft: 14, display: "flex", gap: 4, flexWrap: "wrap" } }, abc2.a && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, padding: "1px 5px", borderRadius: 4, background: C.org + "10", color: C.org, fontWeight: 600 } }, "A: ", abc2.a.slice(0, 25), abc2.a.length > 25 ? "..." : ""), abc2.c && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, padding: "1px 5px", borderRadius: 4, background: C.blue + "10", color: C.blue, fontWeight: 600 } }, "C: ", abc2.c.slice(0, 25), abc2.c.length > 25 ? "..." : ""), t.flagged && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, padding: "1px 5px", borderRadius: 4, background: C.grn + "15", color: C.grn, fontWeight: 700 } }, "\u2713", " Report")) : null;
    })()))), (() => {
      const d0 = /* @__PURE__ */ new Date();
      const last30 = [];
      for (let i = 0; i < 30; i++) {
        const dd = new Date(d0);
        dd.setDate(d0.getDate() - i);
        last30.push(dd.toISOString().slice(0, 10));
      }
      const recentT = tallies.filter((t) => (t.resId || "r1") === selRes && last30.includes(t.d));
      if (recentT.length < 2) return null;
      const withAbc = recentT.map((t) => ({ ...t, abc: t.abc || (t.note ? parseABC(t.note.text, [t.b], t.note.location, t.t) : { a: "", b: "", c: "" }) }));
      const antTally = {};
      withAbc.forEach((t) => {
        if (t.abc.a) {
          const k = t.abc.a.slice(0, 60);
          antTally[k] = (antTally[k] || 0) + 1;
        }
      });
      const topAnts = Object.entries(antTally).sort((a, b) => b[1] - a[1]).slice(0, 6);
      const conTally = {};
      withAbc.forEach((t) => {
        if (t.abc.c) {
          const k = t.abc.c.slice(0, 60);
          conTally[k] = (conTally[k] || 0) + 1;
        }
      });
      const topCons = Object.entries(conTally).sort((a, b) => b[1] - a[1]).slice(0, 6);
      const locTally = {};
      recentT.forEach((t) => {
        if (t.note && t.note.location) {
          locTally[t.note.location] = (locTally[t.note.location] || 0) + 1;
        }
      });
      const topLocT = Object.entries(locTally).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const todTally = { "Morning (6-12)": 0, "Afternoon (12-5)": 0, "Evening (5-10)": 0, "Night (10-6)": 0 };
      recentT.forEach((t) => {
        const hr2 = parseInt(t.t);
        const pm = t.t.includes("PM");
        const h24 = pm && hr2 !== 12 ? hr2 + 12 : !pm && hr2 === 12 ? 0 : hr2;
        if (h24 >= 6 && h24 < 12) todTally["Morning (6-12)"]++;
        else if (h24 >= 12 && h24 < 17) todTally["Afternoon (12-5)"]++;
        else if (h24 >= 17 && h24 < 22) todTally["Evening (5-10)"]++;
        else todTally["Night (10-6)"]++;
      });
      const staffTally = {};
      recentT.forEach((t) => {
        const sn = gn(t.by);
        staffTally[sn] = (staffTally[sn] || 0) + 1;
      });
      const topStaff = Object.entries(staffTally).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const maxAnt = topAnts.length ? topAnts[0][1] : 1;
      const maxCon = topCons.length ? topCons[0][1] : 1;
      const maxLocT2 = topLocT.length ? topLocT[0][1] : 1;
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "ABC Pattern Tracker (30 days: " + recentT.length + " incidents)" }), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden", border: "1.5px solid #5856d618" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: "#5856d606", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, "\u{1F50D}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: C.org } }, "Top Antecedents"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, "(triggers)"))), topAnts.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 12, fontSize: 12, color: C.tx3, textAlign: "center" } }, "More data needed") : topAnts.map(([k, v], i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "6px 12px", borderBottom: "0.5px solid " + C.sepL, display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.org, width: 22, textAlign: "center" } }, v), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { height: 6, background: C.sepL, borderRadius: 3, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: v / maxAnt * 100 + "%", background: "linear-gradient(90deg," + C.org + "," + C.org + "80)", borderRadius: 3 } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2, marginTop: 2 } }, k))))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden", border: "1.5px solid " + C.blue + "18" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.blue + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, "\u{1F6E1}\uFE0F"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: C.blue } }, "Top Consequences"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, "(interventions used)"))), topCons.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 12, fontSize: 12, color: C.tx3, textAlign: "center" } }, "More data needed") : topCons.map(([k, v], i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "6px 12px", borderBottom: "0.5px solid " + C.sepL, display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.blue, width: 22, textAlign: "center" } }, v), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { height: 6, background: C.sepL, borderRadius: 3, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: v / maxCon * 100 + "%", background: "linear-gradient(90deg," + C.blue + "," + C.blue + "80)", borderRadius: 3 } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2, marginTop: 2 } }, k))))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement(Card, { style: { overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 10px", background: C.grn + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: C.grn } }, "\u{1F4CD}", " WHERE")), topLocT.map(([k, v], i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "4px 10px", borderBottom: "0.5px solid " + C.sepL, display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.tx2 } }, k), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: C.grn } }, v)))), /* @__PURE__ */ React.createElement(Card, { style: { overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 10px", background: C.pur + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: C.pur } }, "\u23F0", " WHEN")), Object.entries(todTally).filter(([, v]) => v > 0).map(([k, v], i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "4px 10px", borderBottom: "0.5px solid " + C.sepL, display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.tx2 } }, k), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: C.pur } }, v))))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 10px", background: C.pk + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: C.pk } }, "\u{1F465}", " WHO (staff on shift during incidents)")), /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 10px", display: "flex", flexWrap: "wrap", gap: 4 } }, topStaff.map(([k, v], i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "4px 8px", borderRadius: 8, background: C.pk + "08", border: "1px solid " + C.pk + "20" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: C.pk } }, k), " ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: C.red } }, v))))), (cm || isS) && (() => {
        const flagged = recentT.filter((t) => t.flagged);
        return flagged.length > 0 ? /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden", border: "1.5px solid " + C.grn + "30" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.grn + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.grn } }, "\u2705", " Flagged for Report (", flagged.length, ")")), flagged.map((t, i) => {
          const abc2 = t.abc || parseABC(t.note ? t.note.text : "", [t.b], t.note ? t.note.location : "", t.t);
          return /* @__PURE__ */ React.createElement("div", { key: t.id, style: { padding: "8px 12px", borderBottom: i < flagged.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 3 } }, /* @__PURE__ */ React.createElement(Pill, { text: t.b, cl: C.red }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, t.d, " ", t.t)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2, lineHeight: 1.4 } }, abc2.a && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, color: C.org } }, "A:"), " ", abc2.a), abc2.b && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, color: C.red } }, "B:"), " ", abc2.b), abc2.c && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, color: C.blue } }, "C:"), " ", abc2.c)), /* @__PURE__ */ React.createElement("button", { onClick: () => setTallies((p) => p.map((t2) => t2.id === t.id ? { ...t2, flagged: false } : t2)), style: { fontSize: 10, color: C.red, background: "none", border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 600, marginTop: 2 } }, "Remove from Report"));
        })) : null;
      })());
    })()), resSubTab === "analytics" && (() => {
      const days = behAnalPeriod === "7d" ? 7 : behAnalPeriod === "14d" ? 14 : behAnalPeriod === "30d" ? 30 : 90;
      const d0 = /* @__PURE__ */ new Date();
      const periodDates = [];
      for (let i = days - 1; i >= 0; i--) {
        const dd = new Date(d0);
        dd.setDate(d0.getDate() - i);
        periodDates.push(dd.toISOString().slice(0, 10));
      }
      const resTallies = tallies.filter((t) => (t.resId || "r1") === selRes && periodDates.includes(t.d));
      const prevDates = [];
      for (let i = days * 2 - 1; i >= days; i--) {
        const dd = new Date(d0);
        dd.setDate(d0.getDate() - i);
        prevDates.push(dd.toISOString().slice(0, 10));
      }
      const prevTallies = tallies.filter((t) => (t.resId || "r1") === selRes && prevDates.includes(t.d));
      const total = resTallies.length;
      const prevTotal = prevTallies.length;
      const avg = days > 0 ? (total / days).toFixed(1) : 0;
      const pctChange = prevTotal > 0 ? Math.round((total - prevTotal) / prevTotal * 100) : 0;
      const trendUp = pctChange > 0;
      const bTypes = ["Physical Aggr", "Verbal Aggr", "Self-Injury", "Elopement", "Property Dest", "Non-Compliance"];
      const bColors = { "Physical Aggr": "#ff3b30", "Verbal Aggr": "#ff9500", "Self-Injury": "#ff2d55", "Elopement": "#af52de", "Property Dest": "#5856d6", "Non-Compliance": "#007aff" };
      const bEmoji = { "Physical Aggr": "\u26A1", "Verbal Aggr": "\u{1F5E3}\uFE0F", "Self-Injury": "\u26A0\uFE0F", "Elopement": "\u{1F6AA}", "Property Dest": "\u{1F4A5}", "Non-Compliance": "\u{1F6AB}" };
      const byType = {};
      bTypes.forEach((bt) => {
        byType[bt] = resTallies.filter((t) => t.b === bt).length;
      });
      const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
      const dailyCounts = periodDates.map((d) => ({ d, cnt: resTallies.filter((t) => t.d === d).length }));
      const maxCnt = Math.max(...dailyCounts.map((x) => x.cnt), 1);
      const timeSlots = [{ l: "Morning", r: "6AM-12PM", h: [6, 7, 8, 9, 10, 11] }, { l: "Afternoon", r: "12PM-5PM", h: [12, 13, 14, 15, 16] }, { l: "Evening", r: "5PM-10PM", h: [17, 18, 19, 20, 21] }];
      const byTime = timeSlots.map((sl) => {
        const cnt = resTallies.filter((t) => {
          const hr2 = parseInt(t.t);
          const isPM = t.t.includes("PM");
          const h24 = isPM && hr2 !== 12 ? hr2 + 12 : !isPM && hr2 === 12 ? 0 : hr2;
          return sl.h.includes(h24);
        }).length;
        return { ...sl, cnt };
      });
      const maxTime = Math.max(...byTime.map((x) => x.cnt), 1);
      const byLoc = {};
      resTallies.forEach((t) => {
        if (t.note && t.note.location) {
          byLoc[t.note.location] = (byLoc[t.note.location] || 0) + 1;
        }
      });
      const topLocs = Object.entries(byLoc).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const maxLoc = topLocs.length > 0 ? topLocs[0][1] : 1;
      const typeEntries = Object.entries(byType).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
      const donutTotal = typeEntries.reduce((s, [, v]) => s + v, 0) || 1;
      let donutAcc = 0;
      const wk1 = dailyCounts.slice(-7).reduce((s, x) => s + x.cnt, 0);
      const wk2 = dailyCounts.slice(-14, -7).reduce((s, x) => s + x.cnt, 0);
      return /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", background: "rgba(118,118,128,.12)", borderRadius: 9, padding: 2, marginBottom: 12 } }, [{ l: "7 Days", v: "7d" }, { l: "14 Days", v: "14d" }, { l: "30 Days", v: "30d" }, { l: "90 Days", v: "90d" }].map((o) => /* @__PURE__ */ React.createElement("button", { key: o.v, onClick: () => setBehAnalPeriod(o.v), style: { flex: 1, padding: "7px 4px", borderRadius: 7, border: "none", background: behAnalPeriod === o.v ? C.card : "transparent", color: behAnalPeriod === o.v ? "#5856d6" : C.tx3, fontSize: 12, fontWeight: behAnalPeriod === o.v ? 700 : 500, fontFamily: C.font, cursor: "pointer", boxShadow: behAnalPeriod === o.v ? "0 1px 4px rgba(0,0,0,.1)" : "none", transition: "all .2s" } }, o.l))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: 14, background: "linear-gradient(135deg, #fff 50%, #5856d610)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, fontWeight: 600 } }, "Total Incidents"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 800, color: "#5856d6", letterSpacing: -1 } }, total), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: pctChange === 0 ? C.tx3 : trendUp ? C.red : C.grn, fontWeight: 600 } }, pctChange === 0 ? "No change" : (trendUp ? "\u2191 " : "\u2193 ") + Math.abs(pctChange) + "% vs prior")), /* @__PURE__ */ React.createElement(Card, { style: { padding: 14, background: "linear-gradient(135deg, #fff 50%, " + (topType ? bColors[topType[0]] : C.tx3) + "10)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, fontWeight: 600 } }, "Most Frequent"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: topType ? bColors[topType[0]] : C.tx3, letterSpacing: -0.5 } }, topType ? topType[0].replace(" Aggr", "") : "None"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2, fontWeight: 500 } }, topType ? topType[1] + " incidents (" + Math.round(topType[1] / donutTotal * 100) + "%)" : "")), /* @__PURE__ */ React.createElement(Card, { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, fontWeight: 600 } }, "Daily Average"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 800, color: C.tx, letterSpacing: -1 } }, avg), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, fontWeight: 500 } }, "per day over ", days, "d")), /* @__PURE__ */ React.createElement(Card, { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, fontWeight: 600 } }, "This Week"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 800, color: wk1 > wk2 ? C.red : wk1 < wk2 ? C.grn : C.tx, letterSpacing: -1 } }, wk1), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, fontWeight: 500 } }, "vs ", wk2, " last week"))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 12, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px 6px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.tx } }, "Daily Trend"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Incidents per day \u2014 ", days, " day view")), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 10px 8px", overflowX: "auto", WebkitOverflowScrolling: "touch" } }, /* @__PURE__ */ React.createElement("svg", { width: Math.max(dailyCounts.length * (days <= 14 ? 32 : days <= 30 ? 18 : 10), 300), height: 140, style: { display: "block" } }, [0, 0.25, 0.5, 0.75, 1].map((f, i) => /* @__PURE__ */ React.createElement("line", { key: i, x1: 0, y1: 120 - f * 100, x2: Math.max(dailyCounts.length * (days <= 14 ? 32 : days <= 30 ? 18 : 10), 300), y2: 120 - f * 100, stroke: C.sepL, strokeWidth: 0.5 })), [0, Math.round(maxCnt / 2), maxCnt].map((v, i) => /* @__PURE__ */ React.createElement("text", { key: i, x: 2, y: 120 - v / maxCnt * 100 + 3, fontSize: 8, fill: C.tx3 }, v)), dailyCounts.map((dc, i) => {
        const bw = days <= 14 ? 22 : days <= 30 ? 10 : 5;
        const gap = days <= 14 ? 32 : days <= 30 ? 18 : 10;
        const bh = dc.cnt > 0 ? Math.max(dc.cnt / maxCnt * 100, 3) : 0;
        const isToday = dc.d === today;
        return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("rect", { x: i * gap + (gap - bw) / 2, y: 120 - bh, width: bw, height: bh, rx: bw > 8 ? 4 : 2, fill: isToday ? "#5856d6" : dc.cnt >= maxCnt * 0.75 ? "#ff3b30" : dc.cnt >= maxCnt * 0.5 ? "#ff9500" : "#5856d680" }), days <= 14 && /* @__PURE__ */ React.createElement("text", { x: i * gap + gap / 2, y: 134, fontSize: 8, fill: isToday ? "#5856d6" : C.tx3, textAnchor: "middle", fontWeight: isToday ? 700 : 400 }, parseInt(dc.d.slice(8))), days <= 14 && dc.cnt > 0 && /* @__PURE__ */ React.createElement("text", { x: i * gap + gap / 2, y: 120 - bh - 4, fontSize: 9, fill: C.tx2, textAnchor: "middle", fontWeight: 600 }, dc.cnt));
      })))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 12, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px 6px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.tx } }, "By Behavior Type")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", padding: "14px 12px", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 120, height: 120, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 120 120", width: 120, height: 120 }, /* @__PURE__ */ React.createElement("circle", { cx: 60, cy: 60, r: 48, fill: "none", stroke: C.sepL, strokeWidth: 14 }), typeEntries.map(([bt, cnt], i) => {
        const pct = cnt / donutTotal;
        const offset = donutAcc;
        donutAcc += pct;
        const circumference = 2 * Math.PI * 48;
        const dashLen = pct * circumference;
        const dashOff = -offset * circumference;
        return /* @__PURE__ */ React.createElement("circle", { key: bt, cx: 60, cy: 60, r: 48, fill: "none", stroke: bColors[bt], strokeWidth: 14, strokeDasharray: dashLen + " " + (circumference - dashLen), strokeDashoffset: dashOff, transform: "rotate(-90 60 60)", style: { transition: "all .4s ease" } });
      })), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: C.tx, lineHeight: 1 } }, total), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 500 } }, "total"))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 5 } }, typeEntries.map(([bt, cnt]) => /* @__PURE__ */ React.createElement("div", { key: bt, style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 10, height: 10, borderRadius: 3, background: bColors[bt], flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: C.tx2, flex: 1 } }, bt.replace(" Aggr", "")), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: bColors[bt] } }, cnt), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3, width: 32, textAlign: "right" } }, Math.round(cnt / donutTotal * 100), "%"))), typeEntries.length === 0 && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: C.tx3 } }, "No data")))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 12, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px 6px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.tx } }, "Time of Day"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "When incidents occur most")), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px" } }, byTime.map((sl, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, marginBottom: i < byTime.length - 1 ? 12 : 0 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 70 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.tx } }, sl.l), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, sl.r)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 28, background: C.sepL + "80", borderRadius: 8, overflow: "hidden", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: sl.cnt / maxTime * 100 + "%", background: "linear-gradient(90deg, #5856d6, " + (sl.cnt === maxTime ? "#ff3b30" : "#5ac8fa") + ")", borderRadius: 8, transition: "width .4s ease", minWidth: sl.cnt > 0 ? 24 : 0 } }), /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, fontWeight: 700, color: sl.cnt > maxTime * 0.5 ? "#fff" : C.tx2 } }, sl.cnt)))))), topLocs.length > 0 && /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 12, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px 6px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.tx } }, "Top Locations")), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, topLocs.map(([loc, cnt], i) => /* @__PURE__ */ React.createElement("div", { key: loc, style: { display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < topLocs.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 22, height: 22, borderRadius: 6, background: "#5856d6" + (20 + i * 15).toString(16), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#5856d6" } }, i + 1), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 13, fontWeight: 600, color: C.tx2 } }, loc), /* @__PURE__ */ React.createElement("div", { style: { width: 80 } }, /* @__PURE__ */ React.createElement("div", { style: { height: 6, background: C.sepL, borderRadius: 3, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: cnt / maxLoc * 100 + "%", background: "#5856d6", borderRadius: 3 } }))), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: "#5856d6", width: 24, textAlign: "right" } }, cnt))))), (() => {
        const byStaff = {};
        resTallies.forEach((t) => {
          const nm = gn(t.by);
          byStaff[nm] = (byStaff[nm] || 0) + 1;
        });
        const staffList = Object.entries(byStaff).sort((a, b) => b[1] - a[1]);
        const maxS = staffList[0] ? staffList[0][1] : 1;
        return staffList.length > 0 ? /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 12, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px 6px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.tx } }, "Documented By"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Staff who documented incidents")), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, staffList.map(([nm, cnt], i) => /* @__PURE__ */ React.createElement("div", { key: nm, style: { display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < staffList.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement(Av, { name: nm, s: 28, cl: "#5856d6" }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 13, fontWeight: 600, color: C.tx2 } }, nm), /* @__PURE__ */ React.createElement("div", { style: { width: 60 } }, /* @__PURE__ */ React.createElement("div", { style: { height: 6, background: C.sepL, borderRadius: 3, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: cnt / maxS * 100 + "%", background: "#5856d6", borderRadius: 3 } }))), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: "#5856d6", width: 28, textAlign: "right" } }, cnt))))) : null;
      })());
    })(), resSubTab === "programs" && (() => {
      const resDomains = behDomains.filter((d) => d.resId === selRes);
      const activeBD = resDomains.filter((d) => d.status && d.status.includes("Active") && !d.status.includes("Inactive"));
      const inactiveBD = resDomains.filter((d) => !d.status || d.status.includes("Inactive") || d.status.includes("Discontinued"));
      const rSk2 = SKILLS_BY_RES[selRes] || [];
      const sevCol = (s) => s === "Severe" ? C.red : s === "Moderate" ? C.org : "#34c759";
      const SectHdr = ({ title, ct, open, toggle, color }) => /* @__PURE__ */ React.createElement("button", { onClick: toggle, style: { display: "flex", alignItems: "center", width: "100%", padding: "13px 14px", background: open ? "linear-gradient(135deg," + color + "06," + color + "02)" : C.card, border: "none", borderRadius: 14, cursor: "pointer", fontFamily: C.font, marginBottom: 6, boxShadow: "0 0.5px 2px rgba(0,0,0,.06)", transition: "all .25s ease" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 30, height: 30, borderRadius: 9, background: color + "14", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12, transition: "transform .25s", transform: open ? "rotate(90deg)" : "none" } }, /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 14, c: color })), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, textAlign: "left", fontSize: 15, fontWeight: 700, color: C.tx, letterSpacing: -0.2 } }, title), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color, background: color + "12", padding: "3px 10px", borderRadius: 10, minWidth: 22, textAlign: "center" } }, ct));
      const DomCard = ({ d }) => {
        const bc = sevCol(d.severity);
        const mc = [];
        const n2 = /* @__PURE__ */ new Date();
        for (let i2 = 5; i2 >= 0; i2--) {
          const dd2 = new Date(n2.getFullYear(), n2.getMonth() - i2, 1);
          const mStr = dd2.toISOString().slice(0, 7);
          const cnt = tallies.filter((t) => (t.resId || "r1") === selRes && t.d && t.d.startsWith(mStr)).length;
          mc.push({ cnt, lbl: dd2.toLocaleString("en-US", { month: "short" }) });
        }
        const mMax = Math.max(...mc.map((x) => x.cnt), 1);
        return /* @__PURE__ */ React.createElement(Card, { onClick: () => setViewBehDomain(d.id), style: { marginBottom: 8, cursor: "pointer", overflow: "hidden", borderLeft: "4px solid " + bc, WebkitTapHighlightColor: "transparent" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px 10px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, paddingRight: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: C.tx, lineHeight: 1.25 } }, d.domain, d.qualifier ? " \u2014 " + d.qualifier : ""), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: "#fff", background: bc, padding: "2px 8px", borderRadius: 6 } }, d.severity), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: C.tx3, background: C.bg, padding: "2px 8px", borderRadius: 6, border: "0.5px solid " + C.sepL } }, d.method), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: d.status.includes("Active") ? "#34c759" : C.tx3, background: (d.status.includes("Active") ? "#34c759" : C.tx3) + "10", padding: "2px 8px", borderRadius: 6 } }, d.status))), /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 14, c: C.tx3 + "80" })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2, lineHeight: 1.45, marginTop: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } }, d.defs[0] || "No definitions"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 3, height: 30, marginTop: 8 } }, mc.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { flex: 1, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { height: m.cnt > 0 ? Math.max(m.cnt / mMax * 22, 3) : 2, background: m.cnt > 0 ? bc + "50" : C.sepL, borderRadius: 2, marginBottom: 2, transition: "height .3s" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 7, color: C.tx3, letterSpacing: -0.3 } }, m.lbl)))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, marginTop: 4 } }, d.startDate || "\u2014", " \u2192 ", d.targetDate || "ongoing")));
      };
      return /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, (cm || perms.behavior) && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, v: "outline", color: "#34c759", onClick: () => {
        setEditBehDomain({ id: "bd" + Date.now(), resId: selRes, domain: "", qualifier: "", severity: "Moderate", method: "Frequency", status: "Active", defs: [""], baseline: "", startDate: today, targetDate: "", criterion: { maxCount: 3, perPeriods: 4, periodType: "Thirty (30) Day Periods", acrossPeriods: 4, acrossPeriodType: "Thirty (30) Day Periods" }, antecedents: [], consequences: [], prevention: [], _isNew: true });
      } }, "+ Add Behavior Domain")), /* @__PURE__ */ React.createElement(SectHdr, { title: "Active Behaviors", ct: activeBD.length, open: progSections.behActive, toggle: () => setProgSections((p) => ({ ...p, behActive: !p.behActive })), color: C.red }), progSections.behActive && (activeBD.length === 0 ? /* @__PURE__ */ React.createElement(Card, { style: { padding: 20, textAlign: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3, fontSize: 13 } }, "No active behavior domains")) : activeBD.map((d) => /* @__PURE__ */ React.createElement(DomCard, { key: d.id, d }))), /* @__PURE__ */ React.createElement(SectHdr, { title: "Inactive Behaviors", ct: inactiveBD.length, open: progSections.behInactive, toggle: () => setProgSections((p) => ({ ...p, behInactive: !p.behInactive })), color: C.tx3 }), progSections.behInactive && (inactiveBD.length === 0 ? /* @__PURE__ */ React.createElement(Card, { style: { padding: 20, textAlign: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3, fontSize: 13 } }, "No inactive domains")) : inactiveBD.map((d) => /* @__PURE__ */ React.createElement(DomCard, { key: d.id, d }))), /* @__PURE__ */ React.createElement(SectHdr, { title: "Active Skills", ct: rSk2.length, open: progSections.skillActive, toggle: () => setProgSections((p) => ({ ...p, skillActive: !p.skillActive })), color: C.teal }), progSections.skillActive && (rSk2.length === 0 ? /* @__PURE__ */ React.createElement(Card, { style: { padding: 20, textAlign: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3, fontSize: 13 } }, "No active skills")) : rSk2.map((sk, si) => /* @__PURE__ */ React.createElement(Card, { key: sk.name, onClick: () => setModal("sk_" + si), style: { marginBottom: 8, cursor: "pointer", overflow: "hidden", borderLeft: "4px solid " + C.teal } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: C.tx } }, sk.name), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, marginTop: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: C.teal, background: C.teal + "12", padding: "2px 8px", borderRadius: 6 } }, "Task Analysis"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: C.tx3, background: C.bg, padding: "2px 8px", borderRadius: 6, border: "0.5px solid " + C.sepL } }, sk.steps.length, " steps"))), /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 14, c: C.tx3 + "80" })))))), /* @__PURE__ */ React.createElement(SectHdr, { title: "Event Tracking", ct: 0, open: progSections.events, toggle: () => setProgSections((p) => ({ ...p, events: !p.events })), color: C.blue }), progSections.events && /* @__PURE__ */ React.createElement(Card, { style: { padding: 20, textAlign: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3, fontSize: 13 } }, "No event tracking configured")));
    })(), resSubTab === "apt" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18 } }, "\u{1F4C5}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 700 } }, "Appointments")), (cm || isS) && /* @__PURE__ */ React.createElement(Btn, { sm: true, color: C.blue, onClick: () => {
      const newApt = { id: "apt" + Date.now(), resId: selRes, title: "", doctor: "", location: "", date: "", time: "", duration: "30 min", type: "Primary Care", notes: "", status: "scheduled", visitFreq: "", lastVisit: "" };
      setViewApt(newApt);
      setEditApt({ ...newApt });
      setModal("aptEdit");
    } }, "+ Add")), appointments.filter((a) => a && a.resId === selRes).sort((a, b) => b.date.localeCompare(a.date)).map((a, i) => {
      const tc2 = a.type === "Specialist" ? C.pur : a.type === "Dental" ? C.teal : a.type === "Behavioral" ? C.org : C.blue;
      const isPast = a.date < today;
      return /* @__PURE__ */ React.createElement(Card, { key: a.id, onClick: () => {
        setViewApt(a);
        setModal("aptView");
      }, style: { marginBottom: 6, cursor: "pointer", borderLeft: "4px solid " + tc2, opacity: isPast ? 0.6 : 1 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.tx } }, a.title || "Untitled"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, a.date, " at ", a.time, " | ", a.doctor), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, a.location, a.visitFreq ? " | " + a.visitFreq : "")), /* @__PURE__ */ React.createElement(Pill, { text: a.status === "confirmed" ? "\u2713" : "Sched", cl: a.status === "confirmed" ? C.grn : C.org })));
    }), appointments.filter((a) => a && a.resId === selRes).length === 0 && /* @__PURE__ */ React.createElement(Card, { style: { padding: 20, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "No appointments"))), resSubTab === "ipp" && cm && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, "\u{1F4C4}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700 } }, fn, " \u2014 IPP"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Individual Program Plan"))), /* @__PURE__ */ React.createElement("label", { style: { cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".pdf,.doc,.docx,.txt", style: { display: "none" }, onChange: (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setIppPrompt({ step: "isNew", resId: selRes, filename: f.name, data: ev.target.result, size: f.size });
      };
      reader.readAsDataURL(f);
      e.target.value = "";
    } }), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px", borderRadius: 10, background: "#5856d6", color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: C.font, display: "flex", alignItems: "center", gap: 4 } }, "\u2B06\uFE0F", " Upload IPP"))), (() => {
      const activeIPP2 = ippDocs.find((ip) => ip.resId === selRes && ip.active);
      return activeIPP2 ? /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 10, overflow: "hidden", border: "1.5px solid #34c75930" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: "#34c75906", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 10, height: 10, borderRadius: 5, background: "#34c759" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "#34c759" } }, "CURRENT IPP")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: C.tx } }, activeIPP2.filename), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, marginTop: 2 } }, "Uploaded ", activeIPP2.d, " by ", gn(activeIPP2.by))), activeIPP2.summary && /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: "#5856d606", borderRadius: 10, border: "0.5px solid #5856d615" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#5856d6", marginBottom: 3 } }, "AI SUMMARY"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2, lineHeight: 1.5 } }, activeIPP2.summary)))) : /* @__PURE__ */ React.createElement(Card, { style: { padding: 20, textAlign: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3, fontSize: 13 } }, "No active IPP uploaded"));
    })(), (() => {
      const pastIPPs2 = ippDocs.filter((ip) => ip.resId === selRes && !ip.active);
      return pastIPPs2.length > 0 ? /* @__PURE__ */ React.createElement(Card, { style: { overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px", background: C.alt, borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: C.tx3 } }, "PREVIOUS IPPs (", pastIPPs2.length, ")")), pastIPPs2.map((ip, i) => /* @__PURE__ */ React.createElement("div", { key: ip.id, style: { padding: "8px 14px", borderBottom: i < pastIPPs2.length - 1 ? "0.5px solid " + C.sepL : "none", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, ip.filename), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, ip.d, " \u2014 ", gn(ip.by)), ip.summary && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#5856d6", marginTop: 2 } }, ip.summary.slice(0, 80), "...")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
        if (confirm("Make this the active IPP?")) setIppDocs((p) => p.map((x) => x.resId === selRes ? { ...x, active: x.id === ip.id } : x));
      }, style: { fontSize: 11, color: "#5856d6", background: "#5856d608", border: "1px solid #5856d620", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontWeight: 600, fontFamily: C.font } }, "Restore")))) : null;
    })()), resSubTab === "activity" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18 } }, "\u{1F4DD}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 700 } }, "Activity")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement(Btn, { sm: true, color: C.blue, onClick: () => setShiftNoteForm({ communityOffered: "yes", choicesOffered: "yes", illness: "no", sir: "no", medAppt: "no", outing: "no", notes: "" }) }, "Add Note"), /* @__PURE__ */ React.createElement(Btn, { sm: true, v: "outline", color: C.ind, onClick: () => setResSubTab("daily") }, "Quick Log"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("select", { value: actFilter.type, onChange: (e) => setActFilter((p) => ({ ...p, type: e.target.value })), style: { padding: "5px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font, flex: 1 } }, /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Events"), /* @__PURE__ */ React.createElement("option", { value: "shift" }, "Shift Notes"), /* @__PURE__ */ React.createElement("option", { value: "vitals" }, "Vitals"), /* @__PURE__ */ React.createElement("option", { value: "behavior" }, "Behaviors"), /* @__PURE__ */ React.createElement("option", { value: "Activity" }, "Activities"), /* @__PURE__ */ React.createElement("option", { value: "med" }, "Medications")), /* @__PURE__ */ React.createElement("select", { value: actFilter.staff, onChange: (e) => setActFilter((p) => ({ ...p, staff: e.target.value })), style: { padding: "5px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font, flex: 1 } }, /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Staff"), staff.filter((s2) => s2.on).map((s2) => /* @__PURE__ */ React.createElement("option", { key: s2.id, value: s2.id }, s2.first, " ", s2.last))), /* @__PURE__ */ React.createElement("input", { type: "date", value: actFilter.dateFrom, onChange: (e) => setActFilter((p) => ({ ...p, dateFrom: e.target.value })), style: { padding: "5px 6px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 10, fontFamily: C.font, flex: 1 } }), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      const allDocs2 = docs.filter((d2) => d2.resId === selRes).sort((a, b) => b.d.localeCompare(a.d));
      let csv2 = "Date,Time,Type,Domain,Notes,Staff\n";
      allDocs2.forEach((d2) => csv2 += '"' + d2.d + '","' + (d2.t || "") + '","' + (d2.type || "Notes") + '","' + (d2.domain || "") + '","' + (d2.text || "").replace(/"/g, '""').replace(/\n/g, " ") + '","' + (d2.user || gn(d2.by || "")) + '"\n');
      const blob = new Blob([csv2], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a2 = document.createElement("a");
      a2.href = url;
      a2.download = "Activity-" + fn.replace(/[^a-zA-Z]/g, "") + "-" + today + ".csv";
      a2.click();
    }, style: { padding: "5px 10px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: C.font, background: C.card } }, "Export")), (() => {
      let feed = docs.filter((d2) => d2.resId === selRes);
      if (actFilter.type !== "all") feed = feed.filter((d2) => actFilter.type === "shift" ? d2.type === "Shift" || (d2.text || "").includes("Shift") : actFilter.type === "vitals" ? d2.type === "Vitals" || (d2.text || "").includes("Vitals") || (d2.text || "").includes("BP") || (d2.text || "").includes("Blood") : actFilter.type === "behavior" ? d2.type === "Behavior" : actFilter.type === "med" ? (d2.text || "").includes("medication") || (d2.text || "").includes("PRN") || (d2.text || "").includes("med") : d2.type === actFilter.type);
      if (actFilter.staff !== "all") feed = feed.filter((d2) => (d2.by || "") === actFilter.staff || (d2.user || "").includes(gn(actFilter.staff)));
      if (actFilter.dateFrom) feed = feed.filter((d2) => d2.d >= actFilter.dateFrom);
      feed = feed.sort((a, b) => b.d.localeCompare(a.d) || (b.t || "").localeCompare(a.t || ""));
      const grouped = {};
      feed.forEach((d2) => {
        const mo = d2.d ? d2.d.slice(0, 7) : "unknown";
        if (!grouped[mo]) grouped[mo] = [];
        grouped[mo].push(d2);
      });
      return Object.keys(grouped).length === 0 ? /* @__PURE__ */ React.createElement(Card, { style: { padding: 20, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "No activity logged yet")) : Object.entries(grouped).map(([mo, items]) => /* @__PURE__ */ React.createElement("div", { key: mo }, /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 0", display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.ind } }, "\\u25BC"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: C.ind } }, (/* @__PURE__ */ new Date(mo + "-01T12:00:00")).toLocaleDateString("en-US", { month: "2-digit", year: "numeric" }))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", padding: "6px 10px", borderBottom: "1.5px solid " + C.sepL, background: C.alt } }, /* @__PURE__ */ React.createElement("span", { style: { width: 55, fontSize: 9, fontWeight: 700, color: C.tx3 } }, "Date"), /* @__PURE__ */ React.createElement("span", { style: { width: 50, fontSize: 9, fontWeight: 700, color: C.tx3 } }, "Time"), /* @__PURE__ */ React.createElement("span", { style: { width: 42, fontSize: 9, fontWeight: 700, color: C.tx3 } }, "Type"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 9, fontWeight: 700, color: C.tx3 } }, "Details"), /* @__PURE__ */ React.createElement("span", { style: { width: 55, fontSize: 9, fontWeight: 700, color: C.tx3, textAlign: "right" } }, "Staff")), items.map((d2, i) => {
        const typeColor = d2.type === "Shift" || (d2.text || "").includes("Shift") ? C.grn : d2.type === "Vitals" || (d2.text || "").includes("Vitals") ? C.pk : d2.type === "Behavior" ? C.red : C.ind;
        const typeLabel = d2.type || "Notes";
        return /* @__PURE__ */ React.createElement("div", { key: d2.id || i, style: { display: "flex", padding: "8px 10px", borderBottom: i < items.length - 1 ? "0.5px solid " + C.sepL : "none", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 55, fontSize: 10, color: C.tx3, flexShrink: 0 } }, d2.d ? parseInt(d2.d.slice(5, 7)) + "/" + parseInt(d2.d.slice(8, 10)) + "/" + d2.d.slice(2, 4) : ""), /* @__PURE__ */ React.createElement("span", { style: { width: 50, fontSize: 10, color: C.tx3, flexShrink: 0 } }, d2.t || ""), /* @__PURE__ */ React.createElement("span", { style: { width: 42, fontSize: 9, fontWeight: 600, color: typeColor, flexShrink: 0 } }, typeLabel), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 11, color: C.tx, lineHeight: 1.5 } }, d2.shiftData ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, marginBottom: 2 } }, "\\u2714 Shift - This note captures required shift information"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, lineHeight: 1.8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.grn } }, "Offered to Community or Leisure Activity Offered:"), " ", d2.shiftData.communityOffered || "\u2014", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.grn } }, "Choices Offered:"), " ", d2.shiftData.choicesOffered || "\u2014", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.blue } }, "Illness During Shift:"), " ", d2.shiftData.illness || "no", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.red } }, "Special Incident Report:"), " ", d2.shiftData.sir || "no", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.blue } }, "Medical or Dental Appointment:"), " ", d2.shiftData.medAppt || "no", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.blue } }, "Overnight Outing:"), " ", d2.shiftData.outing || "no"), d2.text && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, fontSize: 11, color: C.tx } }, "Notes: ", d2.text)) : /* @__PURE__ */ React.createElement("div", null, d2.text || "")), /* @__PURE__ */ React.createElement("span", { style: { width: 55, fontSize: 10, color: C.tx3, textAlign: "right", flexShrink: 0 } }, d2.user || (d2.by ? gn(d2.by) : "")));
      }))));
    })()), shiftNoteForm && /* @__PURE__ */ React.createElement(Modal, { title: "Add Shift Note", onClose: () => setShiftNoteForm(null), wide: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, marginBottom: 8, padding: "8px 10px", background: C.alt, borderRadius: 8 } }, "This note captures required shift information for ", fn, "."), [
      { key: "communityOffered", label: "Offered to Community or Leisure Activity", c: C.grn },
      { key: "choicesOffered", label: "Choices Offered", c: C.grn },
      { key: "illness", label: "Illness During Shift", c: C.blue },
      { key: "sir", label: "Special Incident Report", c: C.red },
      { key: "medAppt", label: "Medical or Dental Appointment", c: C.blue },
      { key: "outing", label: "Overnight Outing", c: C.blue }
    ].map((fld) => /* @__PURE__ */ React.createElement("div", { key: fld.key, style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: fld.c } }, fld.label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, ["yes", "no"].map((v) => /* @__PURE__ */ React.createElement("button", { key: v, onClick: () => setShiftNoteForm((p) => ({ ...p, [fld.key]: v })), style: { padding: "5px 14px", borderRadius: 8, border: "1.5px solid " + (shiftNoteForm[fld.key] === v ? v === "yes" ? C.grn : C.red : C.sepL), background: shiftNoteForm[fld.key] === v ? v === "yes" ? C.grn + "10" : C.red + "10" : "transparent", color: shiftNoteForm[fld.key] === v ? v === "yes" ? C.grn : C.red : C.tx3, fontSize: 12, fontWeight: shiftNoteForm[fld.key] === v ? 700 : 500, cursor: "pointer", fontFamily: C.font } }, v))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: C.tx3, marginBottom: 3 } }, "NOTES"), /* @__PURE__ */ React.createElement("textarea", { value: shiftNoteForm.notes, onChange: (e) => setShiftNoteForm((p) => ({ ...p, notes: e.target.value })), rows: 5, placeholder: "Document what happened during the shift...", style: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid " + C.sepL, fontSize: 13, fontFamily: C.font, resize: "vertical", boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.grn, onClick: () => {
      const doc2 = { id: "d" + Date.now(), resId: selRes, type: "Shift", d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), user: user.name, by: user.id, text: shiftNoteForm.notes, shiftData: { communityOffered: shiftNoteForm.communityOffered, choicesOffered: shiftNoteForm.choicesOffered, illness: shiftNoteForm.illness, sir: shiftNoteForm.sir, medAppt: shiftNoteForm.medAppt, outing: shiftNoteForm.outing } };
      setDocs((p) => [doc2, ...p]);
      setShiftNoteForm(null);
    } }, "Submit Shift Note")))), resSubTab === "shift" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: C.ind + "08", borderRadius: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement(Ic, { n: "bot", s: 18, c: C.ind }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: C.ind } }, "AI Documentation Assistant"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "Real-time spell check, bias detection, command-word flagging & structural validation")), /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: 4, background: C.grn, animation: "pulse 2s ease-in-out infinite" } })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement(Seg, { opts: [{ l: "Shift", v: "Shift" }, { l: "Behavior", v: "Behavior" }, { l: "Health", v: "Health" }, { l: "Alert", v: "Alert" }], val: docType, set: setDocType })), /* @__PURE__ */ React.createElement("textarea", { value: docText, onChange: (e) => setDocText(e.target.value), placeholder: "Begin documentation... (AI monitors as you type)", rows: 5, style: { width: "100%", padding: 11, borderRadius: 12, border: "1.5px solid " + (docText.length > 15 ? analyzeDoc(docText).ok ? C.grn : analyzeDoc(docText).biasFlags.length || analyzeDoc(docText).cmdFlags.length ? C.red : C.org : C.sepL), background: C.card, fontSize: 15, fontFamily: C.font, resize: "vertical", boxSizing: "border-box", transition: "border-color .2s" } }), docText.length > 15 && (() => {
      const res = analyzeDoc(docText);
      return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 6, background: C.sepL, borderRadius: 3, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: res.score + "%", background: res.score >= 70 ? C.grn : res.score >= 40 ? C.org : C.red, borderRadius: 3, transition: "width .3s" } })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: res.score >= 70 ? C.grn : res.score >= 40 ? C.org : C.red } }, res.score, "%")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 6 } }, Object.entries(res.ck).map(([k, v]) => /* @__PURE__ */ React.createElement(Pill, { key: k, text: (v ? "\u2713 " : "\u2717 ") + k.toUpperCase(), cl: v ? C.grn : C.red }))), res.spellFlags.length > 0 && /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 6, border: "1px solid " + C.blue + "30" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 10px", background: C.blue + "06", borderBottom: "0.5px solid " + C.sepL, display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, "\u{1F524}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: C.blue } }, "Spelling (", res.spellFlags.length, ")")), res.spellFlags.map((sf, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "5px 10px", borderBottom: i < res.spellFlags.length - 1 ? "0.5px solid " + C.sepL : "none", display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, textDecoration: "line-through", color: C.red } }, sf.word), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.tx3 } }, "\u2192"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
        const rx = new RegExp("\\b" + sf.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi");
        setDocText((p) => p.replace(rx, sf.fix));
      }, style: { fontSize: 12, fontWeight: 600, color: C.blue, background: C.blue + "08", border: "1px solid " + C.blue + "20", borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontFamily: C.font } }, sf.fix)))), res.biasFlags.length > 0 && /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 6, border: "1px solid " + C.red + "30" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 10px", background: C.red + "06", borderBottom: "0.5px solid " + C.sepL, display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, "\u{1F6AB}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: C.red } }, "Biased/Banned Phrases (", res.biasFlags.length, ")")), res.biasFlags.map((bf, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "6px 10px", borderBottom: i < res.biasFlags.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: C.red, background: C.red + "10", padding: "1px 6px", borderRadius: 4 } }, "\u2717", " ", bf.match)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2, lineHeight: 1.4 } }, bf.msg)))), res.cmdFlags.length > 0 && /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 6, border: "1px solid " + C.org + "30" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 10px", background: C.org + "06", borderBottom: "0.5px solid " + C.sepL, display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, "\u26A0\uFE0F"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: C.org } }, "Command Words (", res.cmdFlags.length, ")")), res.cmdFlags.map((cf, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "5px 10px", borderBottom: i < res.cmdFlags.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: C.org, background: C.org + "10", padding: "1px 6px", borderRadius: 4 } }, '"', cf.match, '"'), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, "Replace with:"), cf.sug.split(", ").map((s) => /* @__PURE__ */ React.createElement("button", { key: s, onClick: () => {
        const rx = new RegExp("\\b" + cf.match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
        setDocText((p) => p.replace(rx, s));
      }, style: { fontSize: 11, fontWeight: 500, color: C.grn, background: C.grn + "08", border: "1px solid " + C.grn + "20", borderRadius: 6, padding: "2px 7px", cursor: "pointer", fontFamily: C.font } }, s)))))), res.issues.map((x, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "6px 10px", background: C.red + "06", borderRadius: 8, marginBottom: 3, borderLeft: "3px solid " + C.red } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2 } }, x.msg))), res.sug.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 4 } }, res.sug.map((sg, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "4px 8px", background: C.org + "08", borderRadius: 6, fontSize: 11, color: C.org, fontWeight: 500 } }, "\u2717", " ", sg))), res.ok && /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.grn + "06", borderRadius: 10, borderLeft: "3px solid " + C.grn, display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16 } }, "\u2705"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: C.grn } }, "Documentation Ready"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "Facts only, no bias, no command language"))));
    })(), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, onClick: () => {
      const res = analyzeDoc(docText);
      if (!res || !res.ok) return;
      setDocs((p) => [{ id: "d" + Date.now(), resId: r.id, type: docType, d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), user: user.name, text: docText }, ...p]);
      setDocText("");
    }, disabled: !docText || docText.length < 15 || !analyzeDoc(docText).ok, color: analyzeDoc(docText).ok ? C.grn : C.tx3 }, analyzeDoc(docText).ok ? "\u2713 Submit Documentation" : "Fix Issues to Submit")), docs.filter((d) => d.resId === r.id).length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Previous Notes" }), /* @__PURE__ */ React.createElement(Card, null, docs.filter((d) => d.resId === r.id).slice(0, 10).map((d, i, arr) => /* @__PURE__ */ React.createElement(Row, { key: d.id, title: d.type + " - " + d.d, sub: d.text.slice(0, 50) + "...", wrap: true, last: i === arr.length - 1 }))))), resSubTab === "hlth" && (() => {
      const rW = weightRecs.filter((w) => w.resId === selRes).sort((a, b) => b.month.localeCompare(a.month));
      const curW = rW.find((w) => w.month === curMonth);
      const prevW = rW.find((w) => w.month !== curMonth);
      const weightDiff = curW && prevW ? curW.weight - prevW.weight : null;
      const rBP = bpRecs.filter((b) => b.resId === selRes).sort((a, b) => b.d.localeCompare(a.d) || b.t.localeCompare(a.t));
      const rBS = bsRecs.filter((b) => b.resId === selRes).sort((a, b) => b.d.localeCompare(a.d) || b.t.localeCompare(a.t));
      const bpClass = (s, d) => s >= 180 || d >= 120 ? { l: "Crisis", c: "#8B0000" } : s >= 140 || d >= 90 ? { l: "High", c: C.red } : s >= 130 || d >= 80 ? { l: "Elevated", c: C.org } : s >= 120 && d < 80 ? { l: "Elevated", c: C.yel } : { l: "Normal", c: C.grn };
      const bsClass = (v) => v < 70 ? { l: "Low", c: C.red } : v < 100 ? { l: "Normal", c: C.grn } : v < 140 ? { l: "Pre-meal OK", c: C.grn } : v < 180 ? { l: "Post-meal OK", c: C.yel } : v < 250 ? { l: "High", c: C.org } : { l: "Critical", c: C.red };
      const parseHr = (t) => {
        if (!t) return 12;
        const parts = t.split(":");
        let h = parseInt(parts[0]);
        if (t.includes("PM") && h !== 12) h += 12;
        if (t.includes("AM") && h === 12) h = 0;
        return h;
      };
      return /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, "\u2764\uFE0F"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700 } }, fn, " \u2014 Vitals"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Weight, BP & Blood Sugar"))), /* @__PURE__ */ React.createElement(Seg, { opts: [{ l: "Weight", v: "weight" }, { l: "Blood Pressure", v: "bp" }, { l: "Blood Sugar", v: "bs" }], val: vitalsTab, set: setVitalsTab }), vitalsTab === "weight" && /* @__PURE__ */ React.createElement(React.Fragment, null, !curW ? /* @__PURE__ */ React.createElement(Card, { style: { marginTop: 8, marginBottom: 8, border: "2px solid " + C.red + "40", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: C.red + "08", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16 } }, "\u26A0\uFE0F"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: C.red } }, "Monthly Weight Required")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, marginTop: 2 } }, (/* @__PURE__ */ new Date()).toLocaleString("en-US", { month: "long", year: "numeric" }), " \u2014 not yet recorded")), /* @__PURE__ */ React.createElement("div", { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 11, color: C.tx3, fontWeight: 600, display: "block", marginBottom: 3 } }, "Weight (lbs) *"), /* @__PURE__ */ React.createElement("input", { id: "weight-inp", type: "number", placeholder: "e.g., 185", style: { width: "100%", padding: "10px", borderRadius: 10, border: "1.5px solid " + C.red + "40", fontSize: 16, fontWeight: 700, fontFamily: C.font, textAlign: "center", boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement(Btn, { color: C.grn, onClick: () => {
        const v = parseFloat(document.getElementById("weight-inp")?.value);
        if (!v || v < 30 || v > 600) return;
        setWeightRecs((p) => [...p, { id: "w" + Date.now(), resId: selRes, month: curMonth, weight: v, d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), by: user.id }]);
        const r3 = residents.find((x) => x.id === selRes);
        if (r3) sendTeamsAlert(r3.home, "medChange", "Monthly Weight: " + fullName(r3.name), v + " lbs \u2014 Recorded by " + gn(user.id));
      } }, "Save")))) : /* @__PURE__ */ React.createElement(Card, { style: { marginTop: 8, marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", background: C.grn + "06", display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 800, color: C.grn } }, curW.weight, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 600 } }, " lbs")), weightDiff !== null && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 3, padding: "4px 10px", borderRadius: 8, background: (weightDiff > 0 ? C.red : weightDiff < 0 ? C.blue : C.grn) + "10" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16 } }, weightDiff > 0 ? "\u2B06\uFE0F" : weightDiff < 0 ? "\u2B07\uFE0F" : "\u2796"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: weightDiff > 0 ? C.red : weightDiff < 0 ? C.blue : C.grn } }, weightDiff > 0 ? "+" : "", weightDiff, " lbs")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, curW.d, " at ", curW.t), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "By: ", gn(curW.by)))), /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 14px", fontSize: 10, color: C.grn, fontWeight: 600 } }, "\u2705", " ", (/* @__PURE__ */ new Date()).toLocaleString("en-US", { month: "long" }), " weight recorded \u2014 locked")), (cm || isA) && rW.length > 1 && /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px", background: C.pk + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: C.pk } }, "Weight Trend")), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement("svg", { width: "100%", height: 80, viewBox: "0 0 " + Math.max(rW.length * 50, 200) + " 80" }, (() => {
        const sorted = [...rW].reverse();
        const minW = Math.min(...sorted.map((w) => w.weight)) - 3;
        const maxW = Math.max(...sorted.map((w) => w.weight)) + 3;
        const rng = maxW - minW || 1;
        return sorted.map((w, i) => {
          const x = 25 + i * 50;
          const y = 70 - (w.weight - minW) / rng * 55;
          const prev = i > 0 ? sorted[i - 1] : null;
          const diff = prev ? w.weight - prev.weight : 0;
          return /* @__PURE__ */ React.createElement("g", { key: w.id }, i > 0 && /* @__PURE__ */ React.createElement("line", { x1: 25 + (i - 1) * 50, y1: 70 - (prev.weight - minW) / rng * 55, x2: x, y2: y, stroke: diff > 0 ? "#ff3b30" : diff < 0 ? "#007aff" : "#34c759", strokeWidth: 2 }), /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y, r: 4, fill: diff > 0 ? "#ff3b30" : diff < 0 ? "#007aff" : "#34c759" }), /* @__PURE__ */ React.createElement("text", { x, y: y - 8, textAnchor: "middle", fontSize: 9, fontWeight: 700, fill: C.tx }, w.weight), /* @__PURE__ */ React.createElement("text", { x, y: 78, textAnchor: "middle", fontSize: 7, fill: C.tx3 }, w.month.slice(5), "/", w.month.slice(2, 4)), diff !== 0 && /* @__PURE__ */ React.createElement("text", { x: x + 12, y: y + 3, fontSize: 8, fontWeight: 700, fill: diff > 0 ? "#ff3b30" : "#007aff" }, diff > 0 ? "\u25B2" : "\u25BC", Math.abs(diff)));
        });
      })())), rW.slice(0, 12).map((w, i) => {
        const prev = rW[i + 1];
        const diff = prev ? w.weight - prev.weight : null;
        return /* @__PURE__ */ React.createElement("div", { key: w.id, style: { padding: "6px 14px", borderBottom: "0.5px solid " + C.sepL, display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: C.tx, width: 50 } }, w.weight, " lbs"), diff !== null && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: diff > 0 ? C.red : diff < 0 ? C.blue : C.grn } }, diff > 0 ? "\u2B06 +" + diff : diff < 0 ? "\u2B07 " + diff : "\u2796 0"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 10, color: C.tx3, textAlign: "right" } }, w.month, " | ", w.d, " | ", gn(w.by)));
      }))), vitalsTab === "bp" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, { style: { marginTop: 8, marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px", background: C.red + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: C.red } }, "\u2764\uFE0F", " Record Blood Pressure")), /* @__PURE__ */ React.createElement("div", { style: { padding: 12, display: "flex", gap: 6, alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 9, color: C.tx3, fontWeight: 600 } }, "SYS"), /* @__PURE__ */ React.createElement("input", { id: "bp-sys", type: "number", placeholder: "120", style: { width: "100%", padding: 8, borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 14, fontWeight: 700, fontFamily: C.font, textAlign: "center", boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 700, color: C.tx3, paddingBottom: 8 } }, "/"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 9, color: C.tx3, fontWeight: 600 } }, "DIA"), /* @__PURE__ */ React.createElement("input", { id: "bp-dia", type: "number", placeholder: "80", style: { width: "100%", padding: 8, borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 14, fontWeight: 700, fontFamily: C.font, textAlign: "center", boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 9, color: C.tx3, fontWeight: 600 } }, "PULSE"), /* @__PURE__ */ React.createElement("input", { id: "bp-pulse", type: "number", placeholder: "72", style: { width: "100%", padding: 8, borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 13, fontFamily: C.font, textAlign: "center", boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement(Btn, { color: C.red, onClick: () => {
        const s = parseInt(document.getElementById("bp-sys")?.value);
        const d2 = parseInt(document.getElementById("bp-dia")?.value);
        const p = parseInt(document.getElementById("bp-pulse")?.value) || 0;
        if (!s || !d2) return;
        const now = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        setBpRecs((prev) => [{ id: "bp" + Date.now(), resId: selRes, sys: s, dia: d2, pulse: p, d: today, t: now, by: user.id }, ...prev]);
        document.getElementById("bp-sys").value = "";
        document.getElementById("bp-dia").value = "";
        document.getElementById("bp-pulse").value = "";
      } }, "Log"))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px", background: C.red + "04", borderBottom: "0.5px solid " + C.sepL, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: C.red } }, "BP by Hour (7-day avg)"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: C.tx3 } }, "For PCP review")), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 10px", overflowX: "auto" } }, (() => {
        const last7 = [];
        for (let i = 0; i < 7; i++) {
          const dd = /* @__PURE__ */ new Date();
          dd.setDate(dd.getDate() - i);
          last7.push(dd.toISOString().slice(0, 10));
        }
        const bp7 = rBP.filter((b) => last7.includes(b.d));
        const hours = [];
        for (let h2 = 6; h2 <= 22; h2++) hours.push(h2);
        const byHr = hours.map((h2) => {
          const inHr = bp7.filter((b) => parseHr(b.t) === h2);
          const avgS = inHr.length ? Math.round(inHr.reduce((s, b) => s + b.sys, 0) / inHr.length) : null;
          const avgD = inHr.length ? Math.round(inHr.reduce((s, b) => s + b.dia, 0) / inHr.length) : null;
          return { h: h2, avgS, avgD, cnt: inHr.length };
        });
        const maxS = Math.max(...byHr.map((x) => x.avgS || 0), 160);
        return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 2, alignItems: "flex-end", minHeight: 100 } }, byHr.map((x) => {
          if (!x.avgS) return /* @__PURE__ */ React.createElement("div", { key: x.h, style: { flex: 1, minWidth: 20, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { height: 80, display: "flex", alignItems: "flex-end", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 14, height: 4, background: C.sepL, borderRadius: 2 } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 7, color: C.tx3, marginTop: 2 } }, x.h > 12 ? x.h - 12 + "p" : x.h + "a"));
          const cl = bpClass(x.avgS, x.avgD);
          const hPct = x.avgS / maxS * 70;
          return /* @__PURE__ */ React.createElement("div", { key: x.h, style: { flex: 1, minWidth: 20, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { height: 80, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 7, fontWeight: 700, color: cl.c, marginBottom: 1 } }, x.avgS, "/", x.avgD), /* @__PURE__ */ React.createElement("div", { style: { width: 16, height: hPct, background: "linear-gradient(180deg," + cl.c + "," + cl.c + "60)", borderRadius: "3px 3px 0 0" } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 7, color: C.tx3, marginTop: 2 } }, x.h > 12 ? x.h - 12 + "p" : x.h + "a"));
        }));
      })()), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px 8px", display: "flex", gap: 6, flexWrap: "wrap" } }, [{ l: "Normal", c: C.grn }, { l: "Elevated", c: C.org }, { l: "High", c: C.red }, { l: "Crisis", c: "#8B0000" }].map((x) => /* @__PURE__ */ React.createElement("span", { key: x.l, style: { fontSize: 8, display: "flex", alignItems: "center", gap: 3 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: 4, background: x.c } }), x.l)))), /* @__PURE__ */ React.createElement(Sec, { title: "Recent Readings (" + Math.min(rBP.length, 20) + ")" }), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8 } }, rBP.slice(0, 20).map((b, i) => {
        const cl = bpClass(b.sys, b.dia);
        return /* @__PURE__ */ React.createElement("div", { key: b.id, style: { padding: "6px 14px", borderBottom: i < 19 ? "0.5px solid " + C.sepL : "none", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: 4, background: cl.c } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: C.tx, width: 55 } }, b.sys, "/", b.dia), /* @__PURE__ */ React.createElement(Pill, { text: cl.l, cl: cl.c }), b.pulse > 0 && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, "P:", b.pulse), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 10, color: C.tx3, textAlign: "right" } }, b.d, " ", b.t, " | ", gn(b.by)));
      }))), vitalsTab === "bs" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, { style: { marginTop: 8, marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px", background: C.pur + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: C.pur } }, "\u{1FA78}", " Record Blood Sugar")), /* @__PURE__ */ React.createElement("div", { style: { padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "flex-end", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 9, color: C.tx3, fontWeight: 600 } }, "mg/dL"), /* @__PURE__ */ React.createElement("input", { id: "bs-level", type: "number", placeholder: "120", style: { width: "100%", padding: 8, borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 16, fontWeight: 700, fontFamily: C.font, textAlign: "center", boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement(Btn, { color: C.pur, onClick: () => {
        const v = parseInt(document.getElementById("bs-level")?.value);
        if (!v) return;
        const meal = document.getElementById("bs-meal")?.value || "Fasting";
        const now = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        setBsRecs((prev) => [{ id: "bs" + Date.now(), resId: selRes, level: v, meal, d: today, t: now, by: user.id }, ...prev]);
        document.getElementById("bs-level").value = "";
      } }, "Log")), /* @__PURE__ */ React.createElement("select", { id: "bs-meal", style: { width: "100%", padding: 8, borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } }, /* @__PURE__ */ React.createElement("option", null, "Fasting"), /* @__PURE__ */ React.createElement("option", null, "Before Meal"), /* @__PURE__ */ React.createElement("option", null, "After Meal"), /* @__PURE__ */ React.createElement("option", null, "Bedtime")))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px", background: C.pur + "04", borderBottom: "0.5px solid " + C.sepL, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: C.pur } }, "Blood Sugar by Hour (7-day avg)"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: C.tx3 } }, "For PCP review")), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 10px", overflowX: "auto" } }, (() => {
        const last7 = [];
        for (let i = 0; i < 7; i++) {
          const dd = /* @__PURE__ */ new Date();
          dd.setDate(dd.getDate() - i);
          last7.push(dd.toISOString().slice(0, 10));
        }
        const bs7 = rBS.filter((b) => last7.includes(b.d));
        const hours = [];
        for (let h2 = 6; h2 <= 22; h2++) hours.push(h2);
        const byHr = hours.map((h2) => {
          const inHr = bs7.filter((b) => parseHr(b.t) === h2);
          const avg = inHr.length ? Math.round(inHr.reduce((s, b) => s + b.level, 0) / inHr.length) : null;
          return { h: h2, avg, cnt: inHr.length };
        });
        const maxV = Math.max(...byHr.map((x) => x.avg || 0), 200);
        return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 2, alignItems: "flex-end", minHeight: 100 } }, byHr.map((x) => {
          if (!x.avg) return /* @__PURE__ */ React.createElement("div", { key: x.h, style: { flex: 1, minWidth: 20, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { height: 80, display: "flex", alignItems: "flex-end", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 14, height: 4, background: C.sepL, borderRadius: 2 } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 7, color: C.tx3, marginTop: 2 } }, x.h > 12 ? x.h - 12 + "p" : x.h + "a"));
          const cl = bsClass(x.avg);
          const hPct = x.avg / maxV * 70;
          return /* @__PURE__ */ React.createElement("div", { key: x.h, style: { flex: 1, minWidth: 20, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { height: 80, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 7, fontWeight: 700, color: cl.c, marginBottom: 1 } }, x.avg), /* @__PURE__ */ React.createElement("div", { style: { width: 16, height: hPct, background: "linear-gradient(180deg," + cl.c + "," + cl.c + "60)", borderRadius: "3px 3px 0 0" } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 7, color: C.tx3, marginTop: 2 } }, x.h > 12 ? x.h - 12 + "p" : x.h + "a"));
        }));
      })()), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px 8px", display: "flex", gap: 6, flexWrap: "wrap" } }, [{ l: "Low <70", c: C.red }, { l: "Normal", c: C.grn }, { l: "Pre-meal OK", c: C.grn }, { l: "Post-meal OK", c: C.yel }, { l: "High", c: C.org }, { l: "Critical", c: C.red }].map((x) => /* @__PURE__ */ React.createElement("span", { key: x.l, style: { fontSize: 8, display: "flex", alignItems: "center", gap: 3 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: 4, background: x.c } }), x.l)))), /* @__PURE__ */ React.createElement(Sec, { title: "Recent Readings (" + Math.min(rBS.length, 20) + ")" }), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8 } }, rBS.slice(0, 20).map((b, i) => {
        const cl = bsClass(b.level);
        return /* @__PURE__ */ React.createElement("div", { key: b.id, style: { padding: "6px 14px", borderBottom: i < 19 ? "0.5px solid " + C.sepL : "none", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: 4, background: cl.c } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: C.tx, width: 40 } }, b.level), /* @__PURE__ */ React.createElement(Pill, { text: cl.l, cl: cl.c }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, padding: "1px 6px", borderRadius: 4, background: C.pur + "10", color: C.pur, fontWeight: 600 } }, b.meal), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 10, color: C.tx3, textAlign: "right" } }, b.d, " ", b.t, " | ", gn(b.by)));
      }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 8 } }, [{ l: "Water", e: "\u{1F4A7}", c: C.blue, m: "water" }, { l: "Bowel", e: "\u{1F6BD}", c: C.org, m: "bowel" }, { l: "Urine", e: "\u{1F9EA}", c: C.yel, m: "urine" }, { l: "Temp", e: "\u{1F321}\uFE0F", c: C.pk, m: "vitals" }].map((x) => /* @__PURE__ */ React.createElement(Card, { key: x.l, onClick: () => setModal(x.m), style: { padding: 10, textAlign: "center", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18 } }, x.e), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 600, color: x.c } }, x.l)))));
    })(), resSubTab === "skill" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, (SKILLS_BY_RES[selRes] || []).map((sk) => /* @__PURE__ */ React.createElement(Card, { key: sk.name, style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.teal + "06" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: C.teal } }, sk.name)), sk.steps.map((st, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderBottom: i < sk.steps.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, flex: 1 } }, st), /* @__PURE__ */ React.createElement("select", { style: { fontSize: 10, padding: 3, borderRadius: 6, border: "1px solid " + C.sepL, fontFamily: C.font, maxWidth: 90 } }, PROMPTS.map((p) => /* @__PURE__ */ React.createElement("option", { key: p }, p))))), /* @__PURE__ */ React.createElement("div", { style: { padding: 8 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, sm: true, color: C.teal }, "Save"))))), resSubTab === "medch" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, "\u{1F3E5}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700 } }, fn), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Medical Change History"))), /* @__PURE__ */ React.createElement(Card, null, r.medChanges.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 16, textAlign: "center", color: C.tx3 } }, "None recorded") : r.medChanges.map((mc, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "10px 14px", borderBottom: i < r.medChanges.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: 4, background: mc.sev === "high" ? C.red : mc.sev === "moderate" ? C.org : C.blue, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 600 } }, mc.type), /* @__PURE__ */ React.createElement(Pill, { text: mc.sev, cl: mc.sev === "high" ? C.red : mc.sev === "moderate" ? C.org : C.blue })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.tx2, marginTop: 2, lineHeight: 1.4 } }, mc.note), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, marginTop: 2 } }, mc.d)))))), r.sirs && r.sirs.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Special Incident Reports" }), /* @__PURE__ */ React.createElement(Card, null, r.sirs.map((s, i) => /* @__PURE__ */ React.createElement(Row, { key: i, left: /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: 4, background: s.st === "Open" ? C.red : C.org } }), title: s.desc, sub: s.d + " \u2014 " + s.st, last: i === r.sirs.length - 1 }))))), resSubTab === "doctors" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, "\u{1FA7A}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700 } }, fn), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Doctors & Specialists"))), (cm || isS) && /* @__PURE__ */ React.createElement(Btn, { sm: true, v: "outline", color: "#5856d6", onClick: () => {
      const nd = { name: "", specialty: "", phone: "", fax: "", location: "", visitFreq: "" };
      const updated = { ...r, doctors: [...r.doctors || [], nd] };
      setResidents((p) => p.map((x) => x.id === r.id ? updated : x));
    } }, "+ Add")), (r.doctors || []).length === 0 ? /* @__PURE__ */ React.createElement(Card, { style: { padding: 20, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3, fontSize: 13 } }, "No doctors/specialists on file")) : (r.doctors || []).map((doc, di) => {
      const specColors = { PCP: C.blue, Neurologist: C.pur, Psychiatrist: "#5856d6", Dentist: C.teal, Cardiologist: C.red, Podiatrist: C.org, Nephrologist: "#34c759", Endocrinologist: C.pk, ER: C.red };
      const sc = specColors[doc.specialty] || C.tx3;
      return /* @__PURE__ */ React.createElement(Card, { key: di, style: { marginBottom: 8, overflow: "hidden", borderLeft: "4px solid " + sc } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: C.tx } }, doc.name || "New Doctor"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: "#fff", background: sc, padding: "2px 8px", borderRadius: 6, display: "inline-block", marginTop: 3 } }, doc.specialty || "Specialty")), (cm || isS) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
        const nm = prompt("Doctor name:", doc.name);
        if (nm !== null) {
          const sp = prompt("Specialty:", doc.specialty);
          const ph = prompt("Phone:", doc.phone);
          const fx = prompt("Fax:", doc.fax);
          const loc = prompt("Location:", doc.location);
          const vf = prompt("Visit frequency (e.g., Every 3 months, Annually):", doc.visitFreq || "");
          const docs2 = [...r.doctors || []];
          docs2[di] = { name: nm, specialty: sp || doc.specialty, phone: ph || doc.phone, fax: fx || doc.fax, location: loc || doc.location, visitFreq: vf || doc.visitFreq || "" };
          setResidents((p) => p.map((x) => x.id === r.id ? { ...x, doctors: docs2 } : x));
        }
      }, style: { fontSize: 11, color: C.blue, background: "none", border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 600 } }, "Edit"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
        if (confirm("Remove " + doc.name + "?")) {
          setResidents((p) => p.map((x) => x.id === r.id ? { ...x, doctors: (x.doctors || []).filter((_, j) => j !== di) } : x));
        }
      }, style: { fontSize: 11, color: C.red, background: "none", border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 600 } }, "Remove"))), doc.visitFreq && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, marginTop: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, padding: "2px 8px", borderRadius: 6, background: C.teal + "10", color: C.teal, fontWeight: 700 } }, "Visit: ", doc.visitFreq)), doc.phone && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2, marginTop: 6 } }, "\u{1F4DE}", " ", doc.phone, doc.fax ? " | Fax: " + doc.fax : ""), doc.location && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3, marginTop: 2 } }, "\u{1F4CD}", " ", doc.location)));
    })), resSubTab === "reports" && (() => {
      const getQtrDates = (qStr) => {
        const [yr, qp] = qStr.split("-");
        if (qp === "Annual") return { from: yr + "-01-01", to: yr + "-12-31" };
        const q = parseInt(qp.replace("Q", ""));
        const sm = (q - 1) * 3;
        return { from: yr + "-" + String(sm + 1).padStart(2, "0") + "-01", to: yr + "-" + String(sm + 3).padStart(2, "0") + "-" + new Date(parseInt(yr), sm + 3, 0).getDate() };
      };
      const baseDates = getQtrDates(reportQtr);
      const rangeFrom = reportRange.from || baseDates.from;
      const rangeTo = reportRange.to || baseDates.to;
      const range = { from: rangeFrom, to: rangeTo };
      const inRange = (d) => d && d >= range.from && d <= range.to;
      const rMC = r.medChanges.filter((mc) => inRange(mc.d));
      const rBeh = tallies.filter((t) => (t.resId || "r1") === selRes && inRange(t.d));
      const rApts = appointments.filter((a) => a && a.resId === selRes && inRange(a.date));
      const rAlerts = aptAlerts.filter((a) => a.resId === selRes && inRange(a.d));
      const rDocs2 = docs.filter((d2) => d2.resId === selRes && inRange(d2.d));
      const rDomains = behDomains.filter((d) => d.resId === selRes);
      const rSk3 = SKILLS_BY_RES[selRes] || [];
      const cy = (/* @__PURE__ */ new Date()).getFullYear();
      const periods = [];
      [cy, cy - 1].forEach((yr) => {
        periods.push(yr + "-Annual");
        for (let q = 1; q <= 4; q++) periods.push(yr + "-Q" + q);
      });
      const isOverridden = reportRange.from || reportRange.to;
      return /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, "\u{1F4CA}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700 } }, fn, " \\u2014 Reports"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: isOverridden ? C.blue : C.tx3, fontWeight: isOverridden ? 600 : 400 } }, range.from, " to ", range.to, isOverridden ? " (custom)" : ""))), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: C.tx3, marginBottom: 6 } }, "REPORT PERIOD"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 5 } }, periods.map((p) => {
        const isAn = p.includes("Annual");
        const sel = reportQtr === p;
        const yr = p.split("-")[0];
        const label = isAn ? yr + " Annual" : p;
        return /* @__PURE__ */ React.createElement("button", { key: p, onClick: () => {
          setReportQtr(p);
          setReportRange({ from: "", to: "" });
        }, style: { padding: isAn ? "8px 14px" : "6px 10px", borderRadius: 8, fontSize: isAn ? 13 : 12, fontWeight: sel ? 700 : 500, border: "1.5px solid " + (sel ? "#ff2d55" : C.sepL), background: sel ? "#ff2d5510" : C.card, color: sel ? "#ff2d55" : C.tx2, cursor: "pointer", fontFamily: C.font, width: isAn ? "100%" : "auto" } }, isAn ? "\u{1F4C5} " + label : label);
      })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, padding: "10px 12px", background: isOverridden ? C.blue + "08" : C.alt, borderRadius: 10, border: isOverridden ? "1.5px solid " + C.blue + "30" : "1px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: isOverridden ? C.blue : C.tx3 } }, isOverridden ? "\u2705 DATE OVERRIDE ACTIVE" : "OVERRIDE DATES (optional)"), isOverridden && /* @__PURE__ */ React.createElement("button", { onClick: () => setReportRange({ from: "", to: "" }), style: { fontSize: 10, color: C.red, background: "none", border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 600 } }, "\u2717", " Reset")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, marginBottom: 2 } }, "From"), /* @__PURE__ */ React.createElement("input", { type: "date", value: range.from, onChange: (e) => setReportRange((p) => ({ ...p, from: e.target.value })), style: { width: "100%", padding: 8, borderRadius: 8, border: "1.5px solid " + (reportRange.from ? C.blue : C.sepL), fontSize: 12, fontFamily: C.font, boxSizing: "border-box", fontWeight: reportRange.from ? 700 : 400 } })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, marginBottom: 2 } }, "To"), /* @__PURE__ */ React.createElement("input", { type: "date", value: range.to, onChange: (e) => setReportRange((p) => ({ ...p, to: e.target.value })), style: { width: "100%", padding: 8, borderRadius: 8, border: "1.5px solid " + (reportRange.to ? C.blue : C.sepL), fontSize: 12, fontFamily: C.font, boxSizing: "border-box", fontWeight: reportRange.to ? 700 : 400 } }))))), isAM && /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 10, border: "1px solid " + C.pk + "20" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: C.pk, marginBottom: 6 } }, "REPORT SCHEDULE (by DOB: ", r.dob, ")"), (() => {
        const sched = getReportSchedule(r.dob);
        const curYr = (/* @__PURE__ */ new Date()).getFullYear();
        const curMo2 = (/* @__PURE__ */ new Date()).getMonth() + 1;
        return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, sched.map((s) => {
          const period = curYr + "-" + s.type;
          const submitted = rptSubmitted.find((rs) => rs.resId === selRes && rs.period === period);
          const isDue = s.mo === curMo2;
          return /* @__PURE__ */ React.createElement("div", { key: s.type, style: { padding: "6px 10px", borderRadius: 8, flex: 1, minWidth: 70, textAlign: "center", border: "1.5px solid " + (submitted ? C.grn + "40" : isDue ? C.red + "40" : C.sepL), background: submitted ? C.grn + "06" : isDue ? C.red + "06" : "transparent" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: submitted ? C.grn : isDue ? C.red : C.tx } }, s.type), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3 } }, "Due: ", moNames[s.mo]), submitted ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 700, color: C.grn } }, "Submitted ", submitted.d) : isDue ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 700, color: C.red } }, "DUE NOW") : /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3 } }, "Pending"));
        }));
      })()), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden", border: "1px solid #e0edff" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: C.blue + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.blue } }, "\u{1F4CB}", " Background Information")), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", fontSize: 12, color: C.tx2, lineHeight: 1.5 } }, r.bgInfo ? r.bgInfo.replace(/\[AGE\]/g, String(getAge(r.dob))).replace(/\[age\]/g, String(getAge(r.dob))) : fn + " is a " + getAge(r.dob) + "-year-old individual born on " + r.dob + ". " + (r.diagnosis && r.diagnosis.length ? "Carries a diagnosis of " + r.diagnosis.join(", ") + ". " : "") + (r.admDate ? "Placed at " + (HOMES.find((hx) => hx.id === r.home) || {}).full + " on " + r.admDate + "." : ""))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden", border: "1px solid " + C.pk + "20" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: C.pk + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.pk } }, "\u{1F6A8}", " Changes Since Last Meeting (", rAlerts.length + rMC.length, ")")), rAlerts.length === 0 && rMC.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 14, textAlign: "center", color: C.tx3, fontSize: 12 } }, "No changes in this period") : /* @__PURE__ */ React.createElement(React.Fragment, null, rAlerts.map((al, i) => /* @__PURE__ */ React.createElement("div", { key: al.id, style: { padding: "8px 14px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: C.pk } }, al.aptTitle || "Alert"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, al.d, " ", al.t)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2, marginTop: 2 } }, al.text), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, marginTop: 1 } }, "By: ", gn(al.by)))), rMC.map((mc, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "8px 14px", borderBottom: i < rMC.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: mc.sev === "high" ? C.red : C.org } }, mc.type), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, mc.d)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2, marginTop: 2 } }, mc.note))))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: C.red + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.red } }, "\u26A1", " Behavior Summary (", rBeh.length, ")")), rBeh.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 14, textAlign: "center", color: C.tx3, fontSize: 12 } }, "None in period") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, (() => {
        const byType = {};
        rBeh.forEach((t) => {
          byType[t.b] = (byType[t.b] || 0) + 1;
        });
        return Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([k, v]) => /* @__PURE__ */ React.createElement("div", { key: k, style: { display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "0.5px solid " + C.sepL, fontSize: 13 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx2 } }, k), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.red } }, v)));
      })()))), rBeh.length > 0 && (() => {
        const abcRep = rBeh.map((t) => ({ ...t, abc: t.abc || (t.note ? parseABC(t.note.text, [t.b], t.note ? t.note.location : "", t.t) : { a: "", b: "", c: "" }) }));
        const flaggedR = abcRep.filter((t) => t.flagged);
        const antT = {};
        abcRep.forEach((t) => {
          if (t.abc.a) {
            const k = t.abc.a.slice(0, 50);
            antT[k] = (antT[k] || 0) + 1;
          }
        });
        const topA = Object.entries(antT).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const locT = {};
        abcRep.forEach((t) => {
          if (t.note && t.note.location) {
            locT[t.note.location] = (locT[t.note.location] || 0) + 1;
          }
        });
        const topL = Object.entries(locT).sort((a, b) => b[1] - a[1]).slice(0, 4);
        const stfT = {};
        abcRep.forEach((t) => {
          const sn = gn(t.by);
          stfT[sn] = (stfT[sn] || 0) + 1;
        });
        const topSt = Object.entries(stfT).sort((a, b) => b[1] - a[1]).slice(0, 4);
        return /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden", border: "1.5px solid #5856d618" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: "#5856d606", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, "\u{1F9E0}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "#5856d6" } }, "ABC Pattern Data")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, marginTop: 2 } }, "Tallied from ", abcRep.length, " incidents")), flaggedR.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 14px", background: C.grn + "04", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: C.grn, marginBottom: 4 } }, "\u2705", " Flagged for Report (", flaggedR.length, ")"), flaggedR.slice(0, 5).map((t) => /* @__PURE__ */ React.createElement("div", { key: t.id, style: { padding: "4px 0", borderBottom: "0.5px solid " + C.sepL + "50", fontSize: 11 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.red } }, t.b), /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, t.d, " ", t.t)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } }, t.abc.a && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, padding: "1px 5px", borderRadius: 4, background: C.org + "10", color: C.org } }, "A: ", t.abc.a.slice(0, 35), t.abc.a.length > 35 ? "..." : ""), t.abc.c && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, padding: "1px 5px", borderRadius: 4, background: C.blue + "10", color: C.blue } }, "C: ", t.abc.c.slice(0, 35), t.abc.c.length > 35 ? "..." : ""))))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, topA.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.org, marginBottom: 3 } }, "\u{1F50D}", " TOP ANTECEDENTS (tallied)"), topA.map(([k, v], i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", fontSize: 11, padding: "2px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx2 } }, k), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.org } }, v, "x")))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.grn, marginBottom: 3 } }, "\u{1F4CD}", " WHERE"), topL.map(([k, v], i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", fontSize: 11, padding: "1px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, k), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700 } }, v)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.pk, marginBottom: 3 } }, "\u{1F465}", " WHO (staff)"), topSt.map(([k, v], i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", fontSize: 11, padding: "1px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, k), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700 } }, v)))))));
      })(), rDomains.length > 0 && /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: "#34c75906", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#34c759" } }, "\u{1F4CB}", " Behavior Domains (", rDomains.length, ")")), rDomains.map((d, i) => /* @__PURE__ */ React.createElement("div", { key: d.id, style: { padding: "8px 14px", borderBottom: i < rDomains.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, d.domain, d.qualifier ? " \u2014 " + d.qualifier : ""), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, d.severity, " | ", d.method, " | ", d.status), d.criterion && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#5856d6", marginTop: 2 } }, "Criterion: \u2264", d.criterion.maxCount, " per ", d.criterion.perPeriods, " ", d.criterion.periodType)))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: C.org + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.org } }, "\u{1F3E5}", " Medical Changes (", rMC.length, ")")), rMC.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 14, textAlign: "center", color: C.tx3, fontSize: 12 } }, "None in period") : rMC.map((mc, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "8px 14px", borderBottom: i < rMC.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600 } }, mc.type), /* @__PURE__ */ React.createElement(Pill, { text: mc.sev, cl: mc.sev === "high" ? C.red : C.org })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2, marginTop: 2 } }, mc.note), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, marginTop: 2 } }, mc.d)))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: C.blue + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.blue } }, "\u{1F4C5}", " Appointments (", rApts.length, ")")), rApts.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 14, textAlign: "center", color: C.tx3, fontSize: 12 } }, "None in period") : rApts.map((a, i) => /* @__PURE__ */ React.createElement("div", { key: a.id, style: { padding: "8px 14px", borderBottom: i < rApts.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, a.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, a.date, " at ", a.time, " \u2014 ", a.doctor, " | ", a.location.split(",")[0]), a.notes && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2, marginTop: 2 } }, a.notes)))), rSk3.length > 0 && /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: C.teal + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.teal } }, "\u{1F3AF}", " Skill Goals (", rSk3.length, ")")), rSk3.map((sk, i) => /* @__PURE__ */ React.createElement("div", { key: sk.name, style: { padding: "8px 14px", borderBottom: i < rSk3.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, sk.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, sk.steps.length, " steps \u2014 Task Analysis")))), ippDocs.filter((ip) => ip.resId === selRes && ip.active).length > 0 && /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: "#5856d606", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#5856d6" } }, "\u{1F4C4}", " Current IPP Summary")), ippDocs.filter((ip) => ip.resId === selRes && ip.active).map((ip) => /* @__PURE__ */ React.createElement("div", { key: ip.id, style: { padding: "10px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600 } }, ip.filename), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Uploaded ", ip.d, " by ", gn(ip.by)), ip.summary && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2, marginTop: 4, lineHeight: 1.45, background: "#5856d604", padding: 8, borderRadius: 8 } }, ip.summary)))), (r.doctors || []).length > 0 && /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: "#5856d606", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#5856d6" } }, "\u{1FA7A}", " Care Team (", (r.doctors || []).length, ")")), (r.doctors || []).map((doc, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "6px 14px", borderBottom: i < (r.doctors || []).length - 1 ? "0.5px solid " + C.sepL : "none", fontSize: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600 } }, doc.name), " \u2014 ", /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, doc.specialty), doc.phone ? " | " + doc.phone : ""))), /* @__PURE__ */ React.createElement(Btn, { full: true, color: "#ff2d55", onClick: () => {
        const hm = HOMES.find((hx) => hx.id === r.home) || {};
        const age = getAge(r.dob);
        const qLabel = reportTab === "custom" ? "Custom Period" : reportQtr.includes("Annual") ? reportQtr.split("-")[0] + " Annual" : reportQtr.replace("-Q", " Quarter ");
        const fmtD = (d) => {
          if (!d) return "\u2014";
          const dt = /* @__PURE__ */ new Date(d + "T12:00:00");
          return dt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        };
        const fmtDS = (d) => {
          if (!d) return "\u2014";
          const dt = /* @__PURE__ */ new Date(d + "T12:00:00");
          return dt.getMonth() + 1 + "/" + dt.getDate() + "/" + String(dt.getFullYear()).slice(2);
        };
        const leadStaff = staff.find((s2) => s2.role === "Scheduler" && (s2.homes || []).includes(r.home));
        const bcba = staff.find((s2) => s2.role === "BCBA" && (s2.homes || []).includes(r.home));
        const admin = staff.find((s2) => (s2.role === "System Admin" || s2.role === "Manager") && (s2.homes || []).includes(r.home));
        const activeIPP = ippDocs.find((ip) => ip.resId === selRes && ip.active);
        let h = "<style>@page{size:portrait;margin:0.6in 0.5in}body{font:11px 'Calibri','Segoe UI',Arial,sans-serif;line-height:1.5;color:#1a1a1a;padding:0;margin:0}h1{font-size:17px;font-weight:700;text-align:center;margin:0 0 10px;padding:8px 0;border-bottom:2.5px solid #000}h2{font-size:14px;font-weight:700;margin:16px 0 6px;padding:4px 0;border-bottom:1.5px solid #333}table{border-collapse:collapse;width:100%;margin:6px 0}th,td{border:1px solid #888;padding:5px 7px;text-align:left;font-size:10px;vertical-align:top}th{background:#e8e8e8;font-weight:700;font-size:10px}.hdr-tbl td{border:1.5px solid #333;padding:4px 8px;font-size:11px}.hdr-tbl td:first-child{font-weight:700;width:35%;background:#f4f4f4}.bold{font-weight:700}.field{margin:3px 0;font-size:11px}.field b{color:#333}.al{background:#ffe5e5;border:1.5px solid #cc0000;padding:6px 10px;color:#cc0000;font-weight:700;font-size:11px;margin:6px 0;border-radius:2px}.note-tbl td{font-size:10px;line-height:1.4}ul{margin:3px 0 3px 18px;padding:0}ul li{font-size:11px;margin:2px 0}.sig-block{margin-top:30px;display:flex;justify-content:space-between;align-items:flex-end}.sig-box{text-align:center}.sig-line{border-bottom:1.5px solid #000;width:200px;height:20px;margin-bottom:2px}.sig-label{font-size:9px;color:#555}</style>";
        h += "<h1>" + qLabel + " Report \u2013 " + fmtD(range.to).split(",")[0].split(" ").slice(0, 1).join(" ") + " " + (/* @__PURE__ */ new Date(range.to + "T12:00:00")).getFullYear() + "</h1>";
        h += "<table class='hdr-tbl'><tr><td>Client:</td><td>" + fullName(r.name) + "</td></tr>";
        h += "<tr><td>Date of Birth:</td><td>" + fmtD(r.dob) + "</td></tr>";
        h += "<tr><td>Age:</td><td>" + age + " years old</td></tr>";
        h += "<tr><td>Start of Services:</td><td>" + fmtD(r.admDate) + "</td></tr>";
        h += "<tr><td>&nbsp;</td><td></td></tr>";
        h += "<tr><td>Facility</td><td>" + (hm.full || "") + "</td></tr>";
        h += "<tr><td>Administrator</td><td>" + (admin ? admin.first + " " + admin.last : "\u2014") + "</td></tr>";
        h += "<tr><td>Lead Staff</td><td>" + (leadStaff ? leadStaff.first + " " + leadStaff.last : "\u2014") + "</td></tr>";
        h += "<tr><td>Behavior Specialist</td><td>" + (bcba ? bcba.first + " " + bcba.last : "\u2014") + "</td></tr>";
        h += "<tr><td>Report Date:</td><td>" + fmtD(today) + "</td></tr>";
        h += "<tr><td>Report Period:</td><td>" + fmtD(range.from) + " \u2013 " + fmtD(range.to) + "</td></tr></table>";
        h += "<div class='field'><b>UCI#:</b> " + (r.uci || "\u2014") + "</div>";
        h += "<div class='field'><b>PRIMARY LANGUAGE:</b> English</div>";
        h += "<div class='field'><b>EMERGENCY CONTACT:</b> " + (r.emergContact ? r.emergContact.name + " \u2014 " + r.emergContact.phone : "\u2014") + "</div>";
        h += "<div class='field'><b>ADMINISTRATOR'S CELL:</b> " + (admin ? admin.first + " " + admin.last + " \u2014 " + (admin.phone || "") : "\u2014") + "</div>";
        h += "<div class='field'><b>HOUSE MANAGER:</b> " + (leadStaff ? leadStaff.first + " " + leadStaff.last + " " + (leadStaff.phone || "") : "\u2014") + "</div>";
        h += "<div class='field'><b>COURT APPOINTED GUARDIAN CONSERVATOR:</b> " + (r.conservator && r.conservator.name ? r.conservator.name + (r.conservator.phone ? " \u2014 " + r.conservator.phone : "") + (r.conservator.agency ? " (" + r.conservator.agency + ")" : "") : "N/A") + "</div>";
        h += "<div class='field'><b>REGIONAL CENTER:</b> " + (r.rcCoordinator && r.rcCoordinator.name ? r.rcCoordinator.name + (r.rcCoordinator.agency ? " (" + r.rcCoordinator.agency + ")" : "") + (r.rcCoordinator.phone ? " \u2014 " + r.rcCoordinator.phone : "") : "\u2014") + "</div>";
        h += "<div class='field'><b>BACKGROUND INFORMATION:</b> " + (r.bgInfo ? r.bgInfo.replace(/\[AGE\]/g, String(age)).replace(/\[age\]/g, String(age)) : fn + " is a " + age + "-year-old individual born on " + fmtD(r.dob) + ". " + (r.diagnosis && r.diagnosis.length ? "Carries a diagnosis of " + r.diagnosis.join(", ") + ". " : "") + "Placed at " + (hm.full || "") + " on " + fmtD(r.admDate) + ".") + "</div>";
        h += "<div class='al'>ALLERGIES: " + (r.allergies.length ? r.allergies.map((a) => a.name + " (" + a.reaction + ")").join(", ") : "NKA") + "</div>";
        h += "<h2>Summarization of Quarterly Changes</h2>";
        const allChanges = [...rAlerts.map((a) => ({ d: a.d, text: a.text })), ...rMC.map((mc) => ({ d: mc.d, text: mc.type + ": " + mc.note }))].sort((a, b) => a.d.localeCompare(b.d));
        if (allChanges.length === 0) h += "<p style='font-size:11px;color:#666'>None this period.</p>";
        else {
          h += "<ul>";
          allChanges.forEach((c2) => {
            h += "<li>" + fmtDS(c2.d) + " \u2013 " + c2.text + "</li>";
          });
          h += "</ul>";
        }
        h += "<h2>New, Discontinued or Completed Medications</h2>";
        const medChanges = rMC.filter((mc) => /add|new|start|dc|disc|change|dose|titrat/i.test(mc.type + " " + mc.note));
        if (medChanges.length === 0 && rMC.length === 0) h += "<p style='font-size:11px;color:#666'>None this period.</p>";
        else {
          h += "<ul>";
          (medChanges.length ? medChanges : rMC).forEach((mc) => {
            h += "<li><b>" + fmtDS(mc.d) + ":</b> " + mc.note + "</li>";
          });
          h += "</ul>";
        }
        h += "<h2>Current Medication List</h2>";
        const activeMeds2 = meds.filter((m) => m.resId === selRes && m.status === "active");
        h += "<table><tr><th>Medication</th><th>Dose</th><th>Route</th><th>Frequency</th><th>Times</th><th>Prescribing Physician</th></tr>";
        activeMeds2.forEach((m) => {
          h += "<tr><td><b>" + m.name + "</b>" + (m.gen ? " (" + m.gen + ")" : "") + "</td><td>" + m.dose + "</td><td>" + m.route + "</td><td>" + m.freq + "</td><td>" + (m.times || []).join(", ") + "</td><td>" + (m.doctor || "") + "</td></tr>";
        });
        h += "</table>";
        h += "<h2>Current Doctors &amp; Specialists</h2>";
        h += "<table><tr><th>Specialty</th><th>Doctor</th><th>Address</th><th>Phone #</th><th>Reason Seen</th><th>Frequency &amp; Last Visit</th></tr>";
        (r.doctors || []).forEach((doc) => {
          h += "<tr><td>" + (doc.specialty || "") + "</td><td>" + doc.name + "</td><td>" + (doc.location || "") + "</td><td>" + (doc.phone || "") + "</td><td>" + (doc.specialty === "PCP" ? "Routine visits, medication monitoring" : doc.specialty === "Psychiatrist" ? "Medication monitoring, psychiatric services" : doc.specialty === "Dentist" ? "Routine oral care" : doc.specialty || "") + "</td><td>" + (doc.specialty || "") + "</td></tr>";
        });
        h += "</table>";
        h += "<h2>" + fn.split(" ")[0] + "'s Quarterly Appointment Notes</h2>";
        h += "<table class='note-tbl'><tr><th style='width:75px'>Date</th><th style='width:75px'>Time</th><th>Title</th><th style='width:100px'>Staff</th></tr>";
        rApts.sort((a, b) => b.date.localeCompare(a.date)).forEach((a) => {
          h += "<tr><td>" + fmtDS(a.date) + "</td><td>" + (a.time || "") + "</td><td>" + a.title + "</td><td>" + (a.doctor || "") + "</td></tr>";
          if (a.notes) h += "<tr><td></td><td></td><td colspan='2' style='font-size:10px;color:#333;line-height:1.4'><b>Notes:</b> " + a.notes.replace(/\n/g, "<br>") + "</td></tr>";
        });
        rAlerts.filter((al) => al.aptTitle).forEach((al) => {
          if (!rApts.find((a) => a.id === al.aptId)) {
            h += "<tr><td>" + fmtDS(al.d) + "</td><td>" + (al.t || "") + "</td><td>" + (al.aptTitle || "Alert") + "</td><td>" + gn(al.by) + "</td></tr>";
            h += "<tr><td></td><td></td><td colspan='2' style='font-size:10px;color:#333'><b>Notes:</b> " + al.text + "</td></tr>";
          }
        });
        h += "</table>";
        const abcBeh = rBeh.map((t) => ({ ...t, abc: t.abc || (t.note ? parseABC(t.note.text, [t.b], t.note ? t.note.location : "", t.t) : { a: "", b: "", c: "" }) }));
        const flaggedBeh = abcBeh.filter((t) => t.flagged);
        const unflaggedBeh = abcBeh.filter((t) => !t.flagged);
        if (abcBeh.length > 0) {
          h += "<h2>Behavioral ABC Data (" + abcBeh.length + " incidents)</h2>";
          const byType2 = {};
          abcBeh.forEach((t) => {
            byType2[t.b] = (byType2[t.b] || 0) + 1;
          });
          h += "<table><tr><th>Behavior Type</th><th>Count</th><th>% of Total</th></tr>";
          Object.entries(byType2).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
            h += "<tr><td>" + k + "</td><td style='text-align:center'>" + v + "</td><td style='text-align:center'>" + Math.round(v / abcBeh.length * 100) + "%</td></tr>";
          });
          h += "</table>";
          if (flaggedBeh.length > 0) {
            h += "<div style='margin:10px 0;padding:6px 10px;background:#f0fff0;border:1.5px solid #34c759;border-radius:3px'><b style='color:#34c759'>Flagged ABC Entries (" + flaggedBeh.length + ")</b> \u2014 detailed initial documentation</div>";
            h += "<table><tr><th style='width:60px'>Date</th><th style='width:55px'>Time</th><th>Type</th><th style='background:#fff3e0'>Antecedent</th><th style='background:#fce4ec'>Behavior</th><th style='background:#e3f2fd'>Consequence</th><th style='width:55px'>Staff</th></tr>";
            flaggedBeh.sort((a, b) => a.d.localeCompare(b.d) || a.t.localeCompare(b.t)).forEach((t) => {
              h += "<tr><td>" + fmtDS(t.d) + "</td><td>" + t.t + "</td><td><b>" + t.b + "</b></td>";
              h += "<td style='background:#fff8f0;font-size:9px'>" + (t.abc.a || "\u2014") + "</td>";
              h += "<td style='background:#fff0f3;font-size:9px'>" + (t.abc.b || t.b) + "</td>";
              h += "<td style='background:#f0f7ff;font-size:9px'>" + (t.abc.c || "\u2014") + "</td>";
              h += "<td>" + gn(t.by) + "</td></tr>";
            });
            h += "</table>";
          }
          const antTally2 = {};
          abcBeh.forEach((t) => {
            if (t.abc.a) {
              const k = t.abc.a.slice(0, 80);
              antTally2[k] = (antTally2[k] || 0) + 1;
            }
          });
          const topAnts2 = Object.entries(antTally2).sort((a, b) => b[1] - a[1]).slice(0, 8);
          if (topAnts2.length > 0) {
            h += "<div style='margin:8px 0 4px'><b>Antecedent Patterns (triggers tallied):</b></div>";
            h += "<table><tr><th>Antecedent / Trigger</th><th style='width:50px;text-align:center'>Count</th></tr>";
            topAnts2.forEach(([k, v]) => {
              h += "<tr><td>" + k + "</td><td style='text-align:center'><b>" + v + "</b></td></tr>";
            });
            h += "</table>";
          }
          const locTally2 = {};
          abcBeh.forEach((t) => {
            if (t.note && t.note.location) {
              locTally2[t.note.location] = (locTally2[t.note.location] || 0) + 1;
            }
          });
          const topLocs2 = Object.entries(locTally2).sort((a, b) => b[1] - a[1]);
          const timeTally2 = { "Morning (6AM-12PM)": 0, "Afternoon (12PM-5PM)": 0, "Evening (5PM-10PM)": 0, "Night (10PM-6AM)": 0 };
          abcBeh.forEach((t) => {
            const hr2 = parseInt(t.t);
            const pm = (t.t || "").includes("PM");
            const h24 = pm && hr2 !== 12 ? hr2 + 12 : !pm && hr2 === 12 ? 0 : hr2;
            if (h24 >= 6 && h24 < 12) timeTally2["Morning (6AM-12PM)"]++;
            else if (h24 >= 12 && h24 < 17) timeTally2["Afternoon (12PM-5PM)"]++;
            else if (h24 >= 17 && h24 < 22) timeTally2["Evening (5PM-10PM)"]++;
            else timeTally2["Night (10PM-6AM)"]++;
          });
          const staffTally2 = {};
          abcBeh.forEach((t) => {
            const sn = gn(t.by);
            staffTally2[sn] = (staffTally2[sn] || 0) + 1;
          });
          const topStaff2 = Object.entries(staffTally2).sort((a, b) => b[1] - a[1]);
          h += "<table style='margin:8px 0'><tr><th colspan='2'>WHERE \u2014 Location</th><th colspan='2'>WHEN \u2014 Time of Day</th><th colspan='2'>WHO \u2014 Staff on Shift</th></tr>";
          const maxRows = Math.max(topLocs2.length, Object.entries(timeTally2).filter(([, v2]) => v2 > 0).length, topStaff2.length);
          for (let ri = 0; ri < maxRows; ri++) {
            h += "<tr>";
            h += topLocs2[ri] ? "<td>" + topLocs2[ri][0] + "</td><td style='text-align:center'><b>" + topLocs2[ri][1] + "</b></td>" : "<td></td><td></td>";
            const te = Object.entries(timeTally2).filter(([, v2]) => v2 > 0);
            h += te[ri] ? "<td>" + te[ri][0] + "</td><td style='text-align:center'><b>" + te[ri][1] + "</b></td>" : "<td></td><td></td>";
            h += topStaff2[ri] ? "<td>" + topStaff2[ri][0] + "</td><td style='text-align:center'><b>" + topStaff2[ri][1] + "</b></td>" : "<td></td><td></td>";
            h += "</tr>";
          }
          h += "</table>";
        }
        const rWt = weightRecs.filter((w) => w.resId === selRes && inRange(w.d)).sort((a, b) => a.month.localeCompare(b.month));
        const rBPr = bpRecs.filter((b) => b.resId === selRes && inRange(b.d));
        const rBSr = bsRecs.filter((b) => b.resId === selRes && inRange(b.d));
        if (rWt.length || rBPr.length || rBSr.length) {
          h += "<h2>Vitals Summary</h2>";
          if (rWt.length) {
            h += "<div style='margin:6px 0'><b>WEIGHT:</b> ";
            const latest = rWt[rWt.length - 1];
            h += latest.weight + " lbs (" + latest.month + ")";
            if (rWt.length >= 2) {
              const diff2 = rWt[rWt.length - 1].weight - rWt[0].weight;
              h += " | Period change: <b style='color:" + (diff2 > 0 ? "#c00" : diff2 < 0 ? "#007aff" : "#34c759") + "'>" + (diff2 > 0 ? "&#9650; +" : diff2 < 0 ? "&#9660; " : "") + diff2 + " lbs</b>";
            }
            h += "</div>";
            if (rWt.length > 1) {
              h += "<table><tr><th>Month</th><th>Weight</th><th>Change</th><th>Date</th><th>Staff</th></tr>";
              rWt.forEach((w, wi) => {
                const prev2 = wi > 0 ? rWt[wi - 1] : null;
                const d2 = prev2 ? w.weight - prev2.weight : 0;
                h += "<tr><td>" + w.month + "</td><td><b>" + w.weight + " lbs</b></td><td style='color:" + (d2 > 0 ? "#c00" : d2 < 0 ? "#007aff" : "#333") + "'>" + (d2 > 0 ? "&#9650;+" + d2 : d2 < 0 ? "&#9660;" + d2 : "\u2014") + "</td><td>" + fmtDS(w.d) + "</td><td>" + gn(w.by) + "</td></tr>";
              });
              h += "</table>";
            }
          }
          if (rBPr.length) {
            const avgS2 = Math.round(rBPr.reduce((s, b) => s + b.sys, 0) / rBPr.length);
            const avgD2 = Math.round(rBPr.reduce((s, b) => s + b.dia, 0) / rBPr.length);
            const avgP2 = Math.round(rBPr.filter((b) => b.pulse).reduce((s, b) => s + b.pulse, 0) / (rBPr.filter((b) => b.pulse).length || 1));
            const highest = rBPr.reduce((best, b) => b.sys > (best ? best.sys : 0) ? b : best, null);
            const lowest = rBPr.reduce((best, b) => b.sys < (best ? best.sys : 999) ? b : best, null);
            h += "<div style='margin:8px 0'><b>BLOOD PRESSURE:</b> " + rBPr.length + " readings</div>";
            h += "<table><tr><th></th><th>Reading</th><th>Heart Rate</th><th>Date</th><th>Time</th><th>Staff</th></tr>";
            if (highest) h += "<tr><td style='color:#c00;font-weight:700'>HIGH</td><td style='font-weight:700'>" + highest.sys + "/" + highest.dia + "</td><td>" + (highest.pulse || "\u2014") + "</td><td>" + fmtDS(highest.d) + "</td><td>" + highest.t + "</td><td>" + gn(highest.by) + "</td></tr>";
            if (lowest) h += "<tr><td style='color:#007aff;font-weight:700'>LOW</td><td style='font-weight:700'>" + lowest.sys + "/" + lowest.dia + "</td><td>" + (lowest.pulse || "\u2014") + "</td><td>" + fmtDS(lowest.d) + "</td><td>" + lowest.t + "</td><td>" + gn(lowest.by) + "</td></tr>";
            h += "<tr><td style='color:#333;font-weight:700'>AVERAGE</td><td style='font-weight:700'>" + avgS2 + "/" + avgD2 + "</td><td>" + avgP2 + "</td><td colspan='3' style='font-style:italic'>" + rBPr.length + " total</td></tr>";
            h += "</table>";
          }
          if (rBSr.length) {
            const avgBS = Math.round(rBSr.reduce((s, b) => s + b.level, 0) / rBSr.length);
            const highestBS = rBSr.reduce((best, b) => b.level > (best ? best.level : 0) ? b : best, null);
            const lowestBS = rBSr.reduce((best, b) => b.level < (best ? best.level : 9999) ? b : best, null);
            h += "<div style='margin:8px 0'><b>BLOOD SUGAR:</b> " + rBSr.length + " readings</div>";
            h += "<table><tr><th></th><th>Level (mg/dL)</th><th>Context</th><th>Date</th><th>Time</th><th>Staff</th></tr>";
            if (highestBS) h += "<tr><td style='color:#c00;font-weight:700'>HIGH</td><td style='font-weight:700'>" + highestBS.level + "</td><td>" + (highestBS.meal || "") + "</td><td>" + fmtDS(highestBS.d) + "</td><td>" + highestBS.t + "</td><td>" + gn(highestBS.by) + "</td></tr>";
            if (lowestBS) h += "<tr><td style='color:#007aff;font-weight:700'>LOW</td><td style='font-weight:700'>" + lowestBS.level + "</td><td>" + (lowestBS.meal || "") + "</td><td>" + fmtDS(lowestBS.d) + "</td><td>" + lowestBS.t + "</td><td>" + gn(lowestBS.by) + "</td></tr>";
            h += "<tr><td style='color:#333;font-weight:700'>AVERAGE</td><td style='font-weight:700'>" + avgBS + "</td><td></td><td colspan='3' style='font-style:italic'>" + rBSr.length + " total</td></tr>";
            h += "</table>";
          }
        }
        h += "<h2>Outings</h2>";
        const outingDocs = rDocs2.filter((d2) => /outing|community|park|walk|burger|restaurant|museum/i.test(d2.text || ""));
        if (outingDocs.length > 0) {
          h += "<table><tr><th>Date</th><th>Staff</th><th>Title</th><th>Notes</th></tr>";
          outingDocs.forEach((d2) => {
            h += "<tr><td>" + fmtDS(d2.d) + "</td><td>" + (d2.user || "") + "</td><td>Outing</td><td style='font-size:10px;line-height:1.4'>" + (d2.text || "") + "</td></tr>";
          });
          h += "</table>";
        } else h += "<p style='font-size:11px;color:#666'>None documented.</p>";
        h += "<h2>Individual Program Plan</h2>";
        if (rDomains.length > 0) {
          rDomains.forEach((d, i) => {
            h += "<div style='margin:10px 0'><b>Objective #" + (i + 1) + ":</b> " + d.domain + (d.qualifier ? " \u2014 " + d.qualifier : "") + "</div>";
            h += "<div style='margin:3px 0'><b>Current Status:</b> " + (d.defs.join(". ") || "") + " " + (d.criterion ? "Criterion: Client will exhibit no more than " + d.criterion.maxCount + " behaviors per " + d.criterion.perPeriods + " " + d.criterion.periodType + ". " : "") + "Status: " + d.status + ".</div>";
          });
        } else {
          h += "<p style='font-size:11px;color:#666'>None configured.</p>";
        }
        if (activeIPP && activeIPP.summary) h += "<div style='margin:10px 0;padding:8px;background:#f0f0ff;border:1px solid #ccc;font-size:10px'><b>IPP AI Summary:</b> " + activeIPP.summary + "</div>";
        h += "<div class='sig-block'><div class='sig-box'><div class='sig-line'></div><div class='sig-label'>" + (leadStaff ? leadStaff.first + " " + leadStaff.last : "Staff") + "<br>Lead Staff</div></div><div class='sig-box'><div class='sig-line'></div><div class='sig-label'>" + fmtD(today) + "<br>Date</div></div></div>";
        if (confirm("Ready to submit " + qLabel + " report for " + fn + "?\n\nThis will print the report and mark it as submitted.")) {
          doPrint(h, fn.replace(/[^a-zA-Z]/g, "") + "-" + qLabel.replace(/\s+/g, "") + "-Report.html");
          const period = (/* @__PURE__ */ new Date()).getFullYear() + "-" + (reportQtr.includes("Annual") ? "Annual" : reportQtr.split("-")[1]);
          setRptSubmitted((p) => [...p.filter((rs) => !(rs.resId === selRes && rs.period === period)), { resId: selRes, type: reportQtr.includes("Annual") ? "Annual" : reportQtr.split("-")[1], period, d: today, by: user.id }]);
        }
      } }, "\u{1F5A8}\uFE0F", " Submit & Print Report"));
    })(), resSubTab === "daily" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, "\u{1F4DD}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700 } }, fn), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Daily Activity Log \u2014 ", today))), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.tx3, marginBottom: 6 } }, "Quick Log Entry"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 } }, ["Ate breakfast", "Ate lunch", "Ate dinner", "Showered", "Took medications", "Attended program", "Community outing", "Napped", "Watched TV", "Exercised", "Socialized with peers", "Received visitors", "Completed chores", "Personal hygiene"].map((q) => /* @__PURE__ */ React.createElement("button", { key: q, onClick: () => {
      setDocs((p) => [{ id: "d" + Date.now(), resId: r.id, type: "Activity", d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), user: user.name, text: q + " \u2014 " + fn + " at " + (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + "." }, ...p]);
    }, style: { padding: "6px 10px", borderRadius: 8, fontSize: 11, fontWeight: 500, border: "1px solid " + C.sepL, background: C.card, color: C.tx2, cursor: "pointer", fontFamily: C.font } }, q))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("label", { style: { flex: 1, padding: "8px 0", borderRadius: 8, border: "1.5px solid " + C.org, background: C.org + "08", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.org } }, /* @__PURE__ */ React.createElement("span", null, "\u{1FA79}"), " Injury Photo", /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", capture: "environment", style: { display: "none" }, onChange: (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos((p) => [{ id: "ph" + Date.now(), resId: r.id, d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), by: user.id, type: "injury", note: "", data: ev.target.result }, ...p]);
        setDocs((p) => [{ id: "d" + Date.now(), resId: r.id, type: "Activity", d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), user: user.name, text: "\u{1F4F7} Injury photo documented for " + fn.split(" ")[0] + ".", by: user.id }, ...p]);
        sendTeamsAlert(r.home, "medChange", "Injury Photo: " + fn, "Injury photo documented by " + gn(user.id) + " at " + (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    } })), /* @__PURE__ */ React.createElement("label", { style: { flex: 1, padding: "8px 0", borderRadius: 8, border: "1.5px solid " + C.grn, background: C.grn + "08", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.grn } }, /* @__PURE__ */ React.createElement("span", null, "\u{1F37D}"), " Meal Photo", /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", capture: "environment", style: { display: "none" }, onChange: (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos((p) => [{ id: "ph" + Date.now(), resId: r.id, d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), by: user.id, type: "meal", note: "", data: ev.target.result }, ...p]);
        setDocs((p) => [{ id: "d" + Date.now(), resId: r.id, type: "Activity", d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), user: user.name, text: "\u{1F37D} Meal photo documented for " + fn.split(" ")[0] + "." }, ...p]);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    } })), /* @__PURE__ */ React.createElement("label", { style: { flex: 1, padding: "8px 0", borderRadius: 8, border: "1.5px solid " + C.blue, background: C.blue + "08", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.blue } }, /* @__PURE__ */ React.createElement("span", null, "\u{1F4F7}"), " Other", /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", capture: "environment", style: { display: "none" }, onChange: (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos((p) => [{ id: "ph" + Date.now(), resId: r.id, d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), by: user.id, type: "other", note: "", data: ev.target.result }, ...p]);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    } }))), photos.filter((p) => p.resId === r.id && p.d === today).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 600, color: C.tx3, marginBottom: 4 } }, "TODAY'S PHOTOS (", photos.filter((p) => p.resId === r.id && p.d === today).length, ")"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, overflowX: "auto" } }, photos.filter((p) => p.resId === r.id && p.d === today).map((p) => /* @__PURE__ */ React.createElement("div", { key: p.id, style: { flexShrink: 0, position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: p.data, style: { width: 70, height: 70, borderRadius: 8, objectFit: "cover", border: "2px solid " + (p.type === "injury" ? C.org : p.type === "meal" ? C.grn : C.blue) } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 2, left: 2, fontSize: 8, padding: "1px 4px", borderRadius: 3, background: "rgba(0,0,0,.6)", color: "#fff", fontWeight: 600 } }, p.type === "injury" ? "\u{1FA79}" : p.type === "meal" ? "\u{1F37D}" : "\u{1F4F7}", " ", p.t))))), /* @__PURE__ */ React.createElement("textarea", { value: docText, onChange: (e) => setDocText(e.target.value), placeholder: "Describe " + fn.split(" ")[0] + "'s activity...", rows: 3, style: { width: "100%", padding: 10, borderRadius: 10, border: "1.5px solid " + C.sepL, fontSize: 14, fontFamily: C.font, resize: "vertical", boxSizing: "border-box" } }), docText.length > 10 && (() => {
      const res = analyzeDoc(docText);
      return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4 } }, (res.biasFlags.length > 0 || res.cmdFlags.length > 0 || res.spellFlags.length > 0) && /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 8px", background: C.red + "04", borderRadius: 6, marginBottom: 4 } }, res.spellFlags.map((sf, i) => /* @__PURE__ */ React.createElement("div", { key: "s" + i, style: { fontSize: 11, color: C.blue } }, "\u{1F524}", " ", /* @__PURE__ */ React.createElement("span", { style: { textDecoration: "line-through" } }, sf.word), " ", "\u2192", " ", /* @__PURE__ */ React.createElement("button", { onClick: () => {
        const rx = new RegExp("\\b" + sf.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi");
        setDocText((p) => p.replace(rx, sf.fix));
      }, style: { color: C.blue, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: C.font, textDecoration: "underline", fontSize: 11 } }, sf.fix))), res.biasFlags.map((bf, i) => /* @__PURE__ */ React.createElement("div", { key: "b" + i, style: { fontSize: 11, color: C.red } }, "\u{1F6AB}", " ", bf.match, " \u2014 ", bf.msg)), res.cmdFlags.map((cf, i) => /* @__PURE__ */ React.createElement("div", { key: "c" + i, style: { fontSize: 11, color: C.org } }, "\u26A0\uFE0F", ' "', cf.match, '" ', "\u2192", " ", cf.sug))));
    })(), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, sm: true, color: C.ind, onClick: () => {
      if (!docText || docText.length < 5) return;
      setDocs((p) => [{ id: "d" + Date.now(), resId: r.id, type: "Activity", d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), user: user.name, text: docText }, ...p]);
      setDocText("");
    } }, "Log Activity"))), /* @__PURE__ */ React.createElement(Sec, { title: "Today's Log (" + todayDocs.length + ")" }), todayDocs.length === 0 ? /* @__PURE__ */ React.createElement(Card, { style: { padding: 16, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "No activities logged today")) : /* @__PURE__ */ React.createElement(Card, null, todayDocs.map((d, i) => /* @__PURE__ */ React.createElement("div", { key: d.id, style: { padding: "10px 12px", borderBottom: i < todayDocs.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: d.type === "Activity" ? C.ind + "12" : d.type === "Behavior" ? C.red + "12" : C.blue + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 } }, d.type === "Activity" ? "\u{1F4DD}" : d.type === "Behavior" ? "\u26A1" : "\u{1F4C4}"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.tx, lineHeight: 1.4 } }, d.text), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, marginTop: 2 } }, d.t, " | ", d.user, " | ", d.type)))))), docs.filter((d) => d.resId === r.id && d.d !== today).length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Previous Days" }), /* @__PURE__ */ React.createElement(Card, null, docs.filter((d) => d.resId === r.id && d.d !== today).slice(0, 8).map((d, i, arr) => /* @__PURE__ */ React.createElement(Row, { key: d.id, title: d.type + " \u2014 " + d.text.slice(0, 45) + (d.text.length > 45 ? "..." : ""), sub: d.d + " at " + d.t + " by " + d.user, wrap: true, last: i === arr.length - 1 }))))));
  };
  const renderModal = () => {
    if (modal === "resMeeting" && meetingForm) {
      const mf = meetingForm;
      if (mf.step === "pickHome") {
        return /* @__PURE__ */ React.createElement(Modal, { title: "Resident Meeting", onClose: () => {
          setMeetingForm(null);
          setModal(null);
        }, wide: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.tx3, marginBottom: 8 } }, "SELECT HOME"), HOMES.map((hm2) => {
          const hCnt = residents.filter((r2) => r2.home === hm2.id).length;
          return /* @__PURE__ */ React.createElement(Card, { key: hm2.id, onClick: () => {
            const hRes2 = residents.filter((r2) => r2.home === hm2.id);
            setMeetingForm({ homeId: hm2.id, d: today, staffPresent: [user.id], residentsPresent: hRes2.map((r2) => r2.id), topics: [""], appointments: DAYS.map((d2) => ({ day: d2, entries: [{ res: "", subj: "" }] })), chores: hRes2.map((r2) => ({ resId: r2.id, chore: "" })), meals: DAYS.map((d2) => ({ day: d2, entries: [{ resId: "", mealType: "Breakfast", meal: "", comm: "" }] })), outings: hRes2.map((r2) => ({ resId: r2.id, suggestion: "", comm: "", staff: "", date: "" })), activities: DAYS.map((d2) => ({ day: d2, res: "", activity: "", comm: "" })), signatures: hRes2.map((r2) => ({ resId: r2.id, signed: false })) });
          }, style: { marginBottom: 8, padding: "14px", cursor: "pointer", borderLeft: "4px solid " + hm2.color } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: hm2.color } }, hm2.full), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, hCnt, " resident", hCnt !== 1 ? "s" : ""));
        })));
      }
      const hm = HOMES.find((h) => h.id === mf.homeId);
      const hRes = residents.filter((r2) => r2.home === mf.homeId);
      const upMF = (obj) => setMeetingForm((p) => ({ ...p, ...obj }));
      const SecH = ({ t, c: cl }) => /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 0 4px", fontSize: 12, fontWeight: 700, color: cl || C.pur, textTransform: "uppercase", letterSpacing: 0.5, borderTop: "1px solid " + C.sepL, marginTop: 8 } }, t);
      return /* @__PURE__ */ React.createElement(Modal, { title: "Resident Meeting \u2014 " + (hm ? hm.name : ""), onClose: () => {
        setMeetingForm(null);
        setModal(null);
      }, wide: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, lineHeight: 1.5, marginBottom: 8, padding: "8px 10px", background: C.alt, borderRadius: 8 } }, "Team members conduct and document this meeting weekly. All staff must read and review meeting notes."), /* @__PURE__ */ React.createElement(SecH, { t: "Attendance" }), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600, marginBottom: 3 } }, "Staff Present"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, staff.filter((s2) => s2.on && (s2.homes || []).includes(mf.homeId)).map((s2) => {
        const sel = mf.staffPresent.includes(s2.id);
        return /* @__PURE__ */ React.createElement("button", { key: s2.id, onClick: () => upMF({ staffPresent: sel ? mf.staffPresent.filter((x) => x !== s2.id) : [...mf.staffPresent, s2.id] }), style: { padding: "5px 10px", borderRadius: 8, border: "1.5px solid " + (sel ? C.grn : C.sepL), background: sel ? C.grn + "10" : "transparent", color: sel ? C.grn : C.tx3, fontSize: 11, fontWeight: sel ? 700 : 500, cursor: "pointer", fontFamily: C.font } }, sel ? "\u2713 " : "", s2.first);
      }))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600, marginBottom: 3 } }, "Residents Present"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, hRes.map((r2) => {
        const sel = mf.residentsPresent.includes(r2.id);
        return /* @__PURE__ */ React.createElement("button", { key: r2.id, onClick: () => upMF({ residentsPresent: sel ? mf.residentsPresent.filter((x) => x !== r2.id) : [...mf.residentsPresent, r2.id] }), style: { padding: "5px 10px", borderRadius: 8, border: "1.5px solid " + (sel ? C.blue : C.sepL), background: sel ? C.blue + "10" : "transparent", color: sel ? C.blue : C.tx3, fontSize: 11, fontWeight: sel ? 700 : 500, cursor: "pointer", fontFamily: C.font } }, sel ? "\u2713 " : "", fullName(r2.name));
      }))), /* @__PURE__ */ React.createElement(SecH, { t: "New Topics / Suggestions" }), mf.topics.map((t2, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 4, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("input", { value: t2, onChange: (e) => {
        const nt = [...mf.topics];
        nt[i] = e.target.value;
        upMF({ topics: nt });
      }, placeholder: "Topic " + (i + 1), style: { flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } }), mf.topics.length > 1 && /* @__PURE__ */ React.createElement("button", { onClick: () => upMF({ topics: mf.topics.filter((_, j) => j !== i) }), style: { width: 30, borderRadius: 8, border: "1px solid " + C.red + "30", background: C.red + "06", color: C.red, fontSize: 16, cursor: "pointer" } }, "-"))), /* @__PURE__ */ React.createElement("button", { onClick: () => upMF({ topics: [...mf.topics, ""] }), style: { fontSize: 11, fontWeight: 600, color: C.pur, background: "none", border: "none", cursor: "pointer", fontFamily: C.font } }, "+ Add Topic"), /* @__PURE__ */ React.createElement(SecH, { t: "Appointments This Week" }), mf.appointments.map((apt, di) => /* @__PURE__ */ React.createElement("div", { key: apt.day, style: { marginBottom: 6, padding: "6px 8px", background: di % 2 === 0 ? C.alt : "transparent", borderRadius: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.pur, marginBottom: 3 } }, apt.day), apt.entries.map((en, ei) => /* @__PURE__ */ React.createElement("div", { key: ei, style: { display: "flex", gap: 4, marginBottom: 3, alignItems: "center" } }, /* @__PURE__ */ React.createElement("input", { value: en.res || "", onChange: (e) => {
        const na = [...mf.appointments];
        na[di].entries[ei] = { ...na[di].entries[ei], res: e.target.value };
        upMF({ appointments: na });
      }, placeholder: "Resident", style: { flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font } }), /* @__PURE__ */ React.createElement("input", { value: en.subj || "", onChange: (e) => {
        const na = [...mf.appointments];
        na[di].entries[ei] = { ...na[di].entries[ei], subj: e.target.value };
        upMF({ appointments: na });
      }, placeholder: "Subject", style: { flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font } }), apt.entries.length > 1 && /* @__PURE__ */ React.createElement("button", { onClick: () => {
        const na = [...mf.appointments];
        na[di].entries = na[di].entries.filter((_, j) => j !== ei);
        upMF({ appointments: na });
      }, style: { width: 24, height: 24, borderRadius: 6, border: "1px solid " + C.red + "30", background: C.red + "06", color: C.red, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, "-"))), /* @__PURE__ */ React.createElement("button", { onClick: () => {
        const na = [...mf.appointments];
        na[di].entries = [...na[di].entries, { res: "", subj: "" }];
        upMF({ appointments: na });
      }, style: { fontSize: 10, fontWeight: 600, color: C.pur, background: "none", border: "none", cursor: "pointer", fontFamily: C.font } }, "+ Add appointment"))), /* @__PURE__ */ React.createElement(SecH, { t: "Volunteered Chores" }), mf.chores.map((ch, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 4, marginBottom: 3, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 50, fontSize: 10, fontWeight: 600, color: C.tx2 } }, fullName((hRes.find((r2) => r2.id === ch.resId) || {}).name || "").split(" ")[0]), /* @__PURE__ */ React.createElement("input", { value: ch.chore, onChange: (e) => {
        const nc = [...mf.chores];
        nc[i].chore = e.target.value;
        upMF({ chores: nc });
      }, placeholder: "Chore", style: { flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font } }))), /* @__PURE__ */ React.createElement(SecH, { t: "Meals for the Week" }), mf.meals.map((ml, di) => /* @__PURE__ */ React.createElement("div", { key: ml.day, style: { marginBottom: 6, padding: "6px 8px", background: di % 2 === 0 ? C.alt : "transparent", borderRadius: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.pur, marginBottom: 3 } }, ml.day), ml.entries.map((en, ei) => /* @__PURE__ */ React.createElement("div", { key: ei, style: { display: "flex", gap: 3, marginBottom: 3, alignItems: "center" } }, /* @__PURE__ */ React.createElement("select", { value: en.resId || "", onChange: (e) => {
        const nm = [...mf.meals];
        nm[di].entries[ei] = { ...nm[di].entries[ei], resId: e.target.value };
        upMF({ meals: nm });
      }, style: { width: 55, padding: "5px 2px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 9, fontFamily: C.font } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Who"), hRes.map((r2) => /* @__PURE__ */ React.createElement("option", { key: r2.id, value: r2.id }, r2.first ? r2.first[0] + ". " + (r2.last || "")[0] : fullName(r2.name).slice(0, 4)))), /* @__PURE__ */ React.createElement("select", { value: en.mealType || "Breakfast", onChange: (e) => {
        const nm = [...mf.meals];
        nm[di].entries[ei] = { ...nm[di].entries[ei], mealType: e.target.value };
        upMF({ meals: nm });
      }, style: { width: 65, padding: "5px 2px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 9, fontFamily: C.font } }, /* @__PURE__ */ React.createElement("option", null, "Breakfast"), /* @__PURE__ */ React.createElement("option", null, "Lunch"), /* @__PURE__ */ React.createElement("option", null, "Dinner"), /* @__PURE__ */ React.createElement("option", null, "Snack")), /* @__PURE__ */ React.createElement("input", { value: en.meal || "", onChange: (e) => {
        const nm = [...mf.meals];
        nm[di].entries[ei] = { ...nm[di].entries[ei], meal: e.target.value };
        upMF({ meals: nm });
      }, placeholder: "Meal", style: { flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font } }), /* @__PURE__ */ React.createElement("select", { value: en.comm || "", onChange: (e) => {
        const nm = [...mf.meals];
        nm[di].entries[ei] = { ...nm[di].entries[ei], comm: e.target.value };
        upMF({ meals: nm });
      }, style: { width: 55, padding: "5px 2px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 9, fontFamily: C.font } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Comm"), COMM_METHODS.map((cm2) => /* @__PURE__ */ React.createElement("option", { key: cm2 }, cm2))), ml.entries.length > 1 && /* @__PURE__ */ React.createElement("button", { onClick: () => {
        const nm = [...mf.meals];
        nm[di].entries = nm[di].entries.filter((_, j) => j !== ei);
        upMF({ meals: nm });
      }, style: { width: 22, height: 22, borderRadius: 6, border: "1px solid " + C.red + "30", background: C.red + "06", color: C.red, fontSize: 13, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" } }, "-"))), /* @__PURE__ */ React.createElement("button", { onClick: () => {
        const nm = [...mf.meals];
        nm[di].entries = [...nm[di].entries, { resId: "", mealType: "Lunch", meal: "", comm: "" }];
        upMF({ meals: nm });
      }, style: { fontSize: 10, fontWeight: 600, color: C.pur, background: "none", border: "none", cursor: "pointer", fontFamily: C.font } }, "+ Add meal entry"))), /* @__PURE__ */ React.createElement(SecH, { t: "Weekly Outing Suggestions" }), mf.outings.map((ot, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 4, marginBottom: 3, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 50, fontSize: 10, fontWeight: 600, color: C.tx2 } }, fullName((hRes.find((r2) => r2.id === ot.resId) || {}).name || "").split(" ")[0]), /* @__PURE__ */ React.createElement("input", { value: ot.suggestion, onChange: (e) => {
        const no = [...mf.outings];
        no[i].suggestion = e.target.value;
        upMF({ outings: no });
      }, placeholder: "Suggestion", style: { flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font } }), /* @__PURE__ */ React.createElement("select", { value: ot.comm, onChange: (e) => {
        const no = [...mf.outings];
        no[i].comm = e.target.value;
        upMF({ outings: no });
      }, style: { width: 60, padding: "5px 4px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 9, fontFamily: C.font } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Comm"), COMM_METHODS.map((cm2) => /* @__PURE__ */ React.createElement("option", { key: cm2 }, cm2))))), /* @__PURE__ */ React.createElement(SecH, { t: "Weekly Activities" }), mf.activities.map((ac, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 4, marginBottom: 3, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 28, fontSize: 9, fontWeight: 700, color: C.tx3 } }, ac.day.slice(0, 3)), /* @__PURE__ */ React.createElement("input", { value: ac.activity, onChange: (e) => {
        const na = [...mf.activities];
        na[i].activity = e.target.value;
        upMF({ activities: na });
      }, placeholder: "Activity", style: { flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font } }), /* @__PURE__ */ React.createElement("select", { value: ac.comm, onChange: (e) => {
        const na = [...mf.activities];
        na[i].comm = e.target.value;
        upMF({ activities: na });
      }, style: { width: 60, padding: "5px 4px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 9, fontFamily: C.font } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Comm"), COMM_METHODS.map((cm2) => /* @__PURE__ */ React.createElement("option", { key: cm2 }, cm2))))), /* @__PURE__ */ React.createElement(SecH, { t: "Resident Acknowledgment" }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 } }, mf.signatures.map((sg, i) => {
        const rr = hRes.find((r2) => r2.id === sg.resId);
        return /* @__PURE__ */ React.createElement("button", { key: i, onClick: () => {
          const ns = [...mf.signatures];
          ns[i].signed = !ns[i].signed;
          upMF({ signatures: ns });
        }, style: { padding: "6px 12px", borderRadius: 8, border: "1.5px solid " + (sg.signed ? C.grn : C.sepL), background: sg.signed ? C.grn + "10" : "transparent", color: sg.signed ? C.grn : C.tx3, fontSize: 12, fontWeight: sg.signed ? 700 : 500, cursor: "pointer", fontFamily: C.font } }, sg.signed ? "\u2713 " : "", rr ? fullName(rr.name) : "?");
      })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.pur, onClick: () => {
        if (!confirm("Submit this meeting and notify all staff?")) return;
        const meeting = { id: "mtg" + Date.now(), ...mf, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), by: user.id, complete: true };
        setMeetings((p) => [...p, meeting]);
        const mealEntries = [];
        mf.meals.forEach((ml) => (ml.entries || []).filter((en) => en.meal && en.meal.trim()).forEach((en) => {
          mealEntries.push({ id: "mc" + Date.now() + Math.random(), homeId: mf.homeId, d: today, weekDay: ml.day, resId: en.resId, mealType: en.mealType, meal: en.meal, comm: en.comm, by: user.id });
        }));
        setMealCalendar((p) => [...p, ...mealEntries]);
        if (externalLinks.mealSheet) {
          const mealTsv = [["Date", "Home", "Day", "Resident", "Type", "Meal", "Communication", "Staff"]];
          mealEntries.forEach((me) => {
            const rr = residents.find((r2) => r2.id === me.resId);
            mealTsv.push([today, hm ? hm.full : "", me.weekDay, rr ? fullName(rr.name) : "", me.mealType, me.meal, me.comm, gn(user.id)]);
          });
          navigator.clipboard.writeText(mealTsv.map((r2) => r2.join("	")).join("\n")).then(() => {
          });
        }
        const topicList = mf.topics.filter((t2) => t2.trim()).join("; ");
        const choreList = mf.chores.filter((ch) => ch.chore.trim()).map((ch) => {
          const rr = hRes.find((r2) => r2.id === ch.resId);
          return (rr ? fullName(rr.name).split(" ")[0] : "?") + ": " + ch.chore;
        }).join(", ");
        const mealList = mf.meals.flatMap((ml) => (ml.entries || []).filter((en) => en.meal && en.meal.trim())).map((en) => {
          const rr = hRes.find((r2) => r2.id === en.resId);
          return (rr ? rr.first[0] + "." : "?") + " " + (en.mealType || "") + ": " + en.meal;
        }).join(", ");
        const outList = mf.outings.filter((ot) => ot.suggestion.trim()).map((ot) => {
          const rr = hRes.find((r2) => r2.id === ot.resId);
          return (rr ? fullName(rr.name).split(" ")[0] : "?") + " wants " + ot.suggestion;
        }).join("; ");
        const memo = { id: "me" + Date.now(), d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), by: user.id, text: "\u{1F4CB} RESIDENT MEETING \u2014 " + (hm ? hm.name : "") + " (" + today + ")\n" + (topicList ? "Topics: " + topicList + "\n" : "") + (choreList ? "Chores: " + choreList + "\n" : "") + (mealList ? "Meals: " + mealList + "\n" : "") + (outList ? "Outings: " + outList : ""), acks: [user.id], urgent: true };
        setMemos((p) => [memo, ...p]);
        if (hm) sendTeamsAlert(hm.id, "memo", "Resident Meeting Complete", memo.text);
        setMeetingForm(null);
        setModal(null);
      } }, "Submit Meeting"), /* @__PURE__ */ React.createElement(Btn, { full: true, v: "outline", color: C.teal, onClick: () => {
        const rows = [["RESIDENT MEETING \u2014 " + (hm ? hm.full : ""), today]];
        rows.push([]);
        rows.push(["STAFF PRESENT", mf.staffPresent.map((sid) => gn(sid)).join(", ")]);
        rows.push(["RESIDENTS PRESENT", mf.residentsPresent.map((rid) => fullName((residents.find((r2) => r2.id === rid) || {}).name || "")).join(", ")]);
        rows.push([]);
        rows.push(["TOPICS"]);
        mf.topics.filter((t2) => t2.trim()).forEach((t2) => rows.push(["", t2]));
        rows.push([]);
        rows.push(["APPOINTMENTS", "Day", "Resident", "Subject"]);
        mf.appointments.forEach((a) => {
          if (a.entries[0] && a.entries[0].res) rows.push(["", a.day, a.entries[0].res, a.entries[0].subj]);
        });
        rows.push([]);
        rows.push(["CHORES", "Resident", "Chore"]);
        mf.chores.filter((ch) => ch.chore.trim()).forEach((ch) => {
          const rr = hRes.find((r2) => r2.id === ch.resId);
          rows.push(["", rr ? fullName(rr.name) : "", ch.chore]);
        });
        rows.push([]);
        rows.push(["MEALS", "Day", "Resident", "Type", "Meal", "Communication"]);
        mf.meals.forEach((ml) => (ml.entries || []).filter((en) => en.meal && en.meal.trim()).forEach((en) => {
          const rr = hRes.find((r2) => r2.id === en.resId);
          rows.push(["", ml.day, rr ? fullName(rr.name) : "", en.mealType || "", en.meal, en.comm || ""]);
        }));
        rows.push([]);
        rows.push(["OUTING SUGGESTIONS", "Resident", "Suggestion", "Communication"]);
        mf.outings.filter((ot) => ot.suggestion.trim()).forEach((ot) => {
          const rr = hRes.find((r2) => r2.id === ot.resId);
          rows.push(["", rr ? fullName(rr.name) : "", ot.suggestion, ot.comm]);
        });
        rows.push([]);
        rows.push(["ACTIVITIES", "Day", "Activity", "Communication"]);
        mf.activities.filter((ac) => ac.activity.trim()).forEach((ac) => rows.push(["", ac.day, ac.activity, ac.comm]));
        const tsv = rows.map((r2) => r2.join("	")).join("\n");
        navigator.clipboard.writeText(tsv).then(() => alert("Copied! Open Google Sheets \u2192 cell A1 \u2192 Paste (Ctrl+V)")).catch(() => {
          const b = new Blob([tsv], { type: "text/tsv" });
          const u = URL.createObjectURL(b);
          const a2 = document.createElement("a");
          a2.href = u;
          a2.download = "Meeting-" + today + ".tsv";
          a2.click();
        });
      } }, "Google Sheets"))));
    }
    if (modal === "uploadFile" && uploadPrompt) {
      const up = uploadPrompt;
      return /* @__PURE__ */ React.createElement(Modal, { title: "Upload File", onClose: () => {
        setUploadPrompt(null);
        setModal(null);
      }, wide: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8, background: C.alt } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, up.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, (up.size / 1024).toFixed(1), " KB | ", up.type || "file")), !up.homeId ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.tx3, marginBottom: 6 } }, "SELECT HOME"), HOMES.map((hm) => /* @__PURE__ */ React.createElement(Card, { key: hm.id, onClick: () => setUploadPrompt((p) => ({ ...p, homeId: hm.id })), style: { marginBottom: 6, padding: "12px 14px", cursor: "pointer", borderLeft: "4px solid " + hm.color } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: hm.color } }, hm.full)))) : !up.resId ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => setUploadPrompt((p) => ({ ...p, homeId: null })), style: { fontSize: 12, color: C.blue, background: "none", border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 600, marginBottom: 8 } }, "\\u2190 Back to Homes"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.tx3, marginBottom: 6 } }, "SELECT RESIDENT"), residents.filter((r2) => r2.home === up.homeId).map((r2) => /* @__PURE__ */ React.createElement(Card, { key: r2.id, onClick: () => setUploadPrompt((p) => ({ ...p, resId: r2.id })), style: { marginBottom: 6, padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(Av, { name: r2.name, s: 36 }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, fullName(r2.name))))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginBottom: 8, background: C.grn + "06", border: "1px solid " + C.grn + "20" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.grn } }, "\\u2705 Uploading to: ", fullName((residents.find((x) => x.id === up.resId) || {}).name || "")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, (HOMES.find((h) => h.id === up.homeId) || {}).full || "")), /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.grn, onClick: () => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setResFiles((p) => [...p, { id: "rf" + Date.now(), resId: up.resId, homeId: up.homeId, name: up.name, type: up.type, size: up.size, data: ev.target.result, d: today, by: user.id }]);
          setUploadPrompt(null);
          setModal(null);
        };
        reader.readAsDataURL(up.file);
      } }, "Upload to Resident File"))));
    }
    if (modal === "addTeams" && teamsAdd.homeId) {
      const hm = HOMES.find((x) => x.id === teamsAdd.homeId);
      return /* @__PURE__ */ React.createElement(Modal, { title: "Add Teams Channel" + (hm ? " \u2014 " + hm.name : ""), onClose: () => {
        setTeamsAdd({ homeId: null, name: "", url: "" });
        setModal(null);
      } }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Channel Name *", value: teamsAdd.name, onChange: (v) => setTeamsAdd((p) => ({ ...p, name: v })), ph: "e.g., Memo, Alerts, Injuries" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 3 } }, "Webhook URL *"), /* @__PURE__ */ React.createElement("textarea", { value: teamsAdd.url, onChange: (e) => setTeamsAdd((p) => ({ ...p, url: e.target.value })), placeholder: "Paste your Teams webhook URL here", rows: 4, style: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid " + C.sepL, fontSize: 12, fontFamily: "monospace", resize: "none", boxSizing: "border-box", background: C.card, color: C.tx } })), teamsAdd.url && /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px", padding: "6px 8px", background: C.grn + "08", borderRadius: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: C.grn } }, "\u2713", " URL entered (", teamsAdd.url.length, " chars)")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 10px", background: C.blue + "06", borderRadius: 8, border: "1px solid " + C.blue + "15" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: C.blue, marginBottom: 2 } }, "How to get the URL:"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx2, lineHeight: 1.5 } }, 'Teams \u2192 Channel \u2192 \u2022\u2022\u2022 \u2192 Workflows \u2192 "Post to a channel when a webhook request is received" \u2192 Save \u2192 Copy URL'))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.ind, onClick: () => {
        if (!teamsAdd.name.trim() || !teamsAdd.url.trim()) return;
        setHomeConfig((p) => ({ ...p, [teamsAdd.homeId]: { ...p[teamsAdd.homeId], teams: [...p[teamsAdd.homeId].teams || [], { name: teamsAdd.name.trim(), url: teamsAdd.url.trim(), on: true, types: ["behavior", "memo", "medChange"] }] } }));
        setTeamsAdd({ homeId: null, name: "", url: "" });
        setModal(null);
      }, disabled: !teamsAdd.name.trim() || !teamsAdd.url.trim() }, "Add Channel"))));
    }
    if (modal === "addIP" && ipAdd.homeId) {
      const hm = HOMES.find((x) => x.id === ipAdd.homeId);
      return /* @__PURE__ */ React.createElement(Modal, { title: "Add Allowed IP" + (hm ? " \u2014 " + hm.name : ""), onClose: () => {
        setIpAdd({ homeId: null, ip: "" });
        setModal(null);
      } }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Public IP Address *", value: ipAdd.ip, onChange: (v) => setIpAdd((p) => ({ ...p, ip: v })), ph: "e.g., 74.125.224.72" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 10px", background: C.org + "06", borderRadius: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx2, lineHeight: 1.5 } }, "Go to ", /* @__PURE__ */ React.createElement("b", null, "whatismyip.com"), " on a device connected to the home WiFi to find the IP address."))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.red, onClick: () => {
        if (!ipAdd.ip.trim()) return;
        setHomeConfig((p) => ({ ...p, [ipAdd.homeId]: { ...p[ipAdd.homeId], ips: [...p[ipAdd.homeId].ips || [], ipAdd.ip.trim()] } }));
        setIpAdd({ homeId: null, ip: "" });
        setModal(null);
      }, disabled: !ipAdd.ip.trim() }, "Add IP Address"))));
    }
    if (modal === "hold") return /* @__PURE__ */ React.createElement(Modal, { title: "Hold Medication", onClose: () => setModal(null) }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px", padding: "8px 10px", background: C.yel + "08", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: C.yel } }, "Will show H on MAR during hold period")), /* @__PURE__ */ React.createElement(Inp, { label: "Reason *", value: holdForm.reason, onChange: (v) => setHoldForm((p) => ({ ...p, reason: v })), multi: true, ph: "Why hold?" }), /* @__PURE__ */ React.createElement(Inp, { label: "Physician *", value: holdForm.physician, onChange: (v) => setHoldForm((p) => ({ ...p, physician: v })), ph: "Dr. Name" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.yel } }, "Hold From"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("input", { type: "date", value: holdForm.fromDate, onChange: (e) => setHoldForm((p) => ({ ...p, fromDate: e.target.value })), style: { flex: 2, padding: "8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } }), /* @__PURE__ */ React.createElement("input", { type: "time", value: holdForm.fromTime, onChange: (e) => setHoldForm((p) => ({ ...p, fromTime: e.target.value })), placeholder: "Optional", style: { flex: 1, padding: "8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } })), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.yel } }, "Hold Until"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("input", { type: "date", value: holdForm.toDate, onChange: (e) => setHoldForm((p) => ({ ...p, toDate: e.target.value })), style: { flex: 2, padding: "8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } }), /* @__PURE__ */ React.createElement("input", { type: "time", value: holdForm.toTime, onChange: (e) => setHoldForm((p) => ({ ...p, toTime: e.target.value })), placeholder: "Optional", style: { flex: 1, padding: "8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } })), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px 4px", fontSize: 10, color: C.tx3 } }, "Time is optional. If omitted, hold starts at midnight and ends at 11:59 PM."), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.yel, onClick: () => {
      if (!holdForm.reason || !holdForm.physician || !holdForm.fromDate || !holdForm.toDate) return;
      setMeds((p) => p.map((x) => x.id === holdForm.medId ? { ...x, status: "hold", holdData: holdForm } : x));
      setModal(null);
    }, disabled: !holdForm.reason || !holdForm.physician || !holdForm.fromDate || !holdForm.toDate }, "Submit Hold"))));
    if (modal === "hv") return /* @__PURE__ */ React.createElement(Modal, { onClose: () => setModal(null) }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px", padding: "8px 10px", background: C.pur + "08", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: C.pur } }, "All medications paused during home visit. Meds auto-resume when visit ends.")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.pur } }, "Visit From"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("input", { type: "date", value: hvForm.fromDate, onChange: (e) => setHvForm((p) => ({ ...p, fromDate: e.target.value })), style: { flex: 2, padding: "8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } }), /* @__PURE__ */ React.createElement("input", { type: "time", value: hvForm.fromTime, onChange: (e) => setHvForm((p) => ({ ...p, fromTime: e.target.value })), placeholder: "Optional", style: { flex: 1, padding: "8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } })), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.pur } }, "Visit Until"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("input", { type: "date", value: hvForm.toDate, onChange: (e) => setHvForm((p) => ({ ...p, toDate: e.target.value })), style: { flex: 2, padding: "8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } }), /* @__PURE__ */ React.createElement("input", { type: "time", value: hvForm.toTime, onChange: (e) => setHvForm((p) => ({ ...p, toTime: e.target.value })), placeholder: "Optional", style: { flex: 1, padding: "8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } })), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px 4px", fontSize: 10, color: C.tx3 } }, "Time is optional. Medications auto-resume after the end date/time."), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.pur, onClick: () => {
      if (!hvForm.fromDate || !hvForm.toDate) return;
      setResidents((p) => p.map((r) => r.id === hvForm.resId ? { ...r, hvData: hvForm } : r));
      setModal(null);
    }, disabled: !hvForm.fromDate || !hvForm.toDate }, "Set Home Visit"))));
    if (modal === "dc") return /* @__PURE__ */ React.createElement(Modal, { title: "Discontinue Medication", onClose: () => setModal(null) }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px", padding: "8px 10px", background: C.red + "08", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: C.red } }, "Permanently discontinues medication. A memo will be required.")), /* @__PURE__ */ React.createElement(Inp, { label: "Reason *", value: dcForm.reason, onChange: (v) => setDcForm((p) => ({ ...p, reason: v })), multi: true, ph: "Why discontinue?" }), /* @__PURE__ */ React.createElement(Inp, { label: "Physician *", value: dcForm.physician, onChange: (v) => setDcForm((p) => ({ ...p, physician: v })), ph: "Dr. Name" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.red, onClick: () => {
      if (!dcForm.reason || !dcForm.physician) return;
      const m = meds.find((x) => x.id === dcForm.medId);
      setMeds((p) => p.map((x) => x.id === dcForm.medId ? { ...x, status: "dcd", dcData: { date: today, ...dcForm } } : x));
      setModal(null);
      if (m) setMedMemoPrompt({ type: "dc", medName: m.name, dose: m.dose, resId: m.resId, reason: dcForm.reason, physician: dcForm.physician });
    }, disabled: !dcForm.reason || !dcForm.physician }, "Confirm DC"))));
    if (medMemoPrompt) {
      const mp = medMemoPrompt;
      const rr = residents.find((x) => x.id === mp.resId);
      return /* @__PURE__ */ React.createElement(Modal, { title: "\u{1F4CB} Memo Required \u2014 Med " + (mp.type === "add" ? "Added" : "Discontinued"), onClose: () => setMedMemoPrompt(null) }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px", padding: "10px 12px", background: (mp.type === "add" ? C.grn : C.red) + "08", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: mp.type === "add" ? C.grn : C.red } }, mp.type === "add" ? "New Medication Added" : "Medication Discontinued"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, marginTop: 2 } }, /* @__PURE__ */ React.createElement("strong", null, mp.medName), " ", mp.dose, " \u2014 ", rr ? fullName(rr.name) : ""), mp.physician && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Ordered by: ", mp.physician), mp.reason && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Reason: ", mp.reason)), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.tx3 } }, "MEMO MESSAGE *"), /* @__PURE__ */ React.createElement("textarea", { id: "med-memo-text", defaultValue: mp.type === "add" ? "New medication " + mp.medName + " " + (mp.dose || "") + " has been added for " + (rr ? fullName(rr.name) : "") + ". Ordered by " + (mp.physician || "") + "." : mp.medName + " " + (mp.dose || "") + " has been discontinued for " + (rr ? fullName(rr.name) : "") + ". Reason: " + (mp.reason || "") + ". Ordered by " + (mp.physician || "") + ".", rows: 4, style: { margin: "0 14px 8px", width: "calc(100% - 28px)", padding: "10px", borderRadius: 10, border: "1.5px solid " + C.sepL, fontSize: 13, fontFamily: C.font, resize: "vertical", boxSizing: "border-box" } }), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px 8px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.blue, onClick: () => {
        const txt = document.getElementById("med-memo-text")?.value || "";
        if (!txt) return;
        const memo = { id: "me" + Date.now(), d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), by: user.id, text: (mp.type === "add" ? "\u{1F48A} NEW MED: " : "\u274C DC MED: ") + txt, acks: [user.id], urgent: true };
        setMemos((p) => [memo, ...p]);
        if (rr) sendTeamsAlert(rr.home, "medChange", mp.type === "add" ? "New Medication: " + mp.medName : "Med Discontinued: " + mp.medName, txt + " | By: " + gn(user.id));
        setMedMemoPrompt(null);
      } }, "Post Memo & Alert Team"))));
    }
    {
    }
    {
      ippPrompt && (() => {
        const ip = ippPrompt;
        const rr = residents.find((x) => x.id === ip.resId);
        const rName = rr ? fullName(rr.name) : "Unknown";
        const hasActive = ippDocs.some((d) => d.resId === ip.resId && d.active);
        const doUpload = (makeActive) => {
          const newIPP = { id: "ipp" + Date.now(), resId: ip.resId, d: today, by: user.id, filename: ip.filename, data: ip.data, active: makeActive, summary: null };
          if (makeActive) {
            setIppDocs((p) => [...p.map((x) => x.resId === ip.resId ? { ...x, active: false } : x), newIPP]);
          } else {
            setIppDocs((p) => [...p, newIPP]);
          }
          setTimeout(() => {
            const aiSummary = "AI Review (" + today + '): New IPP "' + ip.filename + '" uploaded for ' + rName + ". Document has been analyzed. Key areas identified include behavioral objectives, skill acquisition targets, and medical protocols. Report data will auto-update to reflect this IPP's goals and criteria. Uploaded by " + gn(user.id) + ".";
            setIppDocs((p) => p.map((x) => x.id === newIPP.id ? { ...x, summary: aiSummary } : x));
          }, 800);
          setIppPrompt(null);
        };
        if (ip.step === "isNew") return /* @__PURE__ */ React.createElement(Modal, { title: "\u{1F4C4} IPP Upload", onClose: () => setIppPrompt(null) }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 56, height: 56, borderRadius: 16, background: "#5856d612", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 28 } }, "\u{1F4C4}")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: C.tx } }, ip.filename), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, (ip.size / 1024).toFixed(1), " KB \u2014 for ", rName)), /* @__PURE__ */ React.createElement(Card, { style: { padding: 14, background: "#5856d606", border: "1.5px solid #5856d618", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#5856d6", textAlign: "center", marginBottom: 6 } }, "Is this ", rName, "'s new IPP?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3, textAlign: "center" } }, "If yes, AI will review and update the resident's report data automatically.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: "#34c759", onClick: () => {
          if (hasActive) setIppPrompt({ ...ip, step: "replace" });
          else doUpload(true);
        } }, "Yes, New IPP")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.tx3, onClick: () => setIppPrompt({ ...ip, step: "uploadAnyway" }) }, "No")))));
        if (ip.step === "replace") return /* @__PURE__ */ React.createElement(Modal, { title: "\u{1F4C4} Replace Current IPP?", onClose: () => setIppPrompt(null) }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, background: C.org + "06", border: "1.5px solid " + C.org + "20", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.org, marginBottom: 4 } }, "\u26A0\uFE0F", " ", rName, " already has an active IPP"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2 } }, "Current: ", /* @__PURE__ */ React.createElement("strong", null, (ippDocs.find((d) => d.resId === ip.resId && d.active) || {}).filename || "\u2014")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2, marginTop: 2 } }, "New: ", /* @__PURE__ */ React.createElement("strong", null, ip.filename))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.tx, textAlign: "center", marginBottom: 10 } }, "Do you want to replace the current IPP?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3, textAlign: "center", marginBottom: 12 } }, "The old IPP will be archived. AI will re-analyze and update reports."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: "#34c759", onClick: () => doUpload(true) }, "Yes, Replace")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.tx3, onClick: () => doUpload(false) }, "No, Keep Both")))));
        if (ip.step === "uploadAnyway") return /* @__PURE__ */ React.createElement(Modal, { title: "\u{1F4C4} Upload Document", onClose: () => setIppPrompt(null) }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, background: C.blue + "06", border: "1.5px solid " + C.blue + "20", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.blue, marginBottom: 4 } }, "\u{1F4C1}", " This is not a new IPP"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2 } }, "File: ", /* @__PURE__ */ React.createElement("strong", null, ip.filename), " for ", rName)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: C.tx, textAlign: "center", marginBottom: 10 } }, "Do you still want to upload this document?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3, textAlign: "center", marginBottom: 12 } }, "It will be saved in the resident's document library but won't replace the current IPP."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.blue, onClick: () => doUpload(false) }, "Yes, Upload")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, v: "outline", color: C.tx3, onClick: () => setIppPrompt(null) }, "Cancel")))));
        return null;
      })();
    }
    if (modal === "medD" && viewMed) {
      const m = meds.find((x) => x.id === viewMed);
      if (!m) return null;
      const ac = allergyCheck(m.name);
      const st = getMedStatus(m);
      return /* @__PURE__ */ React.createElement(Modal, { title: m.name + " " + m.dose, onClose: () => {
        setModal(null);
        setViewMed(null);
      }, wide: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, ac && /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.red + "08", borderRadius: 12, border: "1.5px solid " + C.red + "30", margin: "8px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.red } }, "ALLERGY: ", ac.name, " - ", ac.reaction)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", padding: "16px 0", background: C.alt, borderRadius: 12, margin: "8px 0" } }, /* @__PURE__ */ React.createElement(PillVisual, { pill: m.pill, size: 70 })), m.pill && m.pill.desc && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", fontSize: 11, color: C.tx3, fontStyle: "italic", margin: "0 0 8px" } }, m.pill.desc), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement(SL, { status: st })), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 } }, [["Brand", m.name], ["Generic", m.gen], ["Dose", m.dose], ["Route", m.route], ["Freq", m.freq], ["Tabs/Dose", (m.tabsPerDose || 1) + ""], ["Times", m.times.length ? m.times.join(", ") : "PRN"], ["Rx", m.rx], ["Doctor", m.doctor]].map(([l, v]) => /* @__PURE__ */ React.createElement("div", { key: l }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, l), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500 } }, v))))), m.instr && /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.blue, marginBottom: 3 } }, "Special Instructions"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.tx2 } }, m.instr)), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.ind, marginBottom: 3 } }, "AI - Reason for Use"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.tx2 } }, m.reason)), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: C.org } }, "Side Effects"), /* @__PURE__ */ React.createElement("a", { href: "https://www.drugs.com/" + encodeURIComponent(m.name.toLowerCase().split(" ")[0]) + ".html", target: "_blank", rel: "noopener noreferrer", style: { fontSize: 10, color: C.ind, fontWeight: 600, textDecoration: "none" } }, "Full list on Drugs.com")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 3 } }, m.sides.map((s2, i) => /* @__PURE__ */ React.createElement(Pill, { key: i, text: s2, cl: C.org })))), m.warns && /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.red, marginBottom: 3 } }, "Warnings"), m.warns.map((w, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { fontSize: 11, color: C.tx2 } }, "- " + w))), cm && m.name && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6 } }, /* @__PURE__ */ React.createElement("a", { href: "https://www.drugs.com/imprints.php?drugname=" + encodeURIComponent(m.name) + (m.pillColor ? "&color=" + ({ White: 12, Yellow: 7, Orange: 11, Pink: 8, Red: 1, Blue: 2, Green: 5, Brown: 3, Tan: 10, Purple: 9, Gray: 4 }[m.pillColor] || "") : "") + (m.pill && m.pill.imprint ? "&imprint=" + encodeURIComponent(m.pill.imprint) : ""), target: "_blank", rel: "noopener noreferrer", style: { display: "block", padding: "8px 0", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#5856d6", background: "#5856d608", borderRadius: 10, border: "1px solid #5856d620", cursor: "pointer" } }, "Search Drugs.com Pill Identifier ", "\u2197\uFE0F")), cm && /* @__PURE__ */ React.createElement(Card, { style: { marginTop: 8, overflow: "hidden", border: "1.5px solid " + C.blue + "20" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.blue + "06", borderBottom: "0.5px solid " + C.sepL, display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(Ic, { n: "doc", s: 14, c: C.blue }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: C.blue } }, "Update Medication")), /* @__PURE__ */ React.createElement("div", { style: { padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 600, marginBottom: 2 } }, "Rx Number"), /* @__PURE__ */ React.createElement("input", { defaultValue: m.rx || "", onBlur: (e) => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, rx: e.target.value } : x)), style: { width: "100%", padding: "7px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 600, marginBottom: 2 } }, "Dose"), /* @__PURE__ */ React.createElement("input", { defaultValue: m.dose || "", onBlur: (e) => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, dose: e.target.value } : x)), style: { width: "100%", padding: "7px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box" } }))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 600, marginBottom: 2 } }, "Reason for Use"), /* @__PURE__ */ React.createElement("input", { defaultValue: m.reason || "", onBlur: (e) => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, reason: e.target.value } : x)), style: { width: "100%", padding: "7px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 600, marginBottom: 2 } }, "Special Instructions"), /* @__PURE__ */ React.createElement("input", { defaultValue: m.instr || "", onBlur: (e) => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, instr: e.target.value } : x)), style: { width: "100%", padding: "7px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 700, marginBottom: 4, marginTop: 8 } }, "PILL APPEARANCE"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 600, marginBottom: 2 } }, "Color"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 3 } }, ["White", "Yellow", "Orange", "Pink", "Red", "Blue", "Green", "Brown", "Tan", "Purple", "Gray"].map((pc) => {
        const hex = { White: "#f5f5f5", Yellow: "#FFD700", Orange: "#FF8C00", Pink: "#FFB6C1", Red: "#DC143C", Blue: "#4169E1", Green: "#3CB371", Brown: "#8B4513", Tan: "#D2B48C", Purple: "#9370DB", Gray: "#A9A9A9" }[pc];
        const isSel = m.pillColor || m.pill && m.pill.color === hex;
        return /* @__PURE__ */ React.createElement("button", { key: pc, onClick: () => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, pillColor: pc, pill: { ...x.pill || {}, color: hex, desc: pc + " " + (x.pillDesc || x.pill?.desc?.split(" ").slice(1).join(" ") || "tablet") } } : x)), style: { width: 22, height: 22, borderRadius: 11, background: hex, border: m.pillColor === pc ? "2.5px solid " + C.blue : "1px solid #00000020", cursor: "pointer" } });
      })))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 600, marginBottom: 2 } }, "Shape"), /* @__PURE__ */ React.createElement("select", { defaultValue: m.pill && m.pill.shape || "round", onChange: (e) => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, pill: { ...x.pill || {}, shape: e.target.value } } : x)), style: { width: "100%", padding: "6px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font } }, ["round", "oval", "capsule", "oblong", "diamond", "rectangle"].map((s2) => /* @__PURE__ */ React.createElement("option", { key: s2, value: s2 }, s2.charAt(0).toUpperCase() + s2.slice(1))))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 600, marginBottom: 2 } }, "Imprint"), /* @__PURE__ */ React.createElement("input", { defaultValue: m.pill && m.pill.imprint || "", onBlur: (e) => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, pill: { ...x.pill || {}, imprint: e.target.value } } : x)), style: { width: "100%", padding: "7px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box" } }))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 700, marginBottom: 4 } }, "PILL PHOTO"), m.pill && m.pill.img && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("img", { src: m.pill.img, style: { width: 60, height: 60, borderRadius: 10, objectFit: "contain", background: "#f8f8f8" } })), /* @__PURE__ */ React.createElement("div", { onPaste: (e) => {
        const items = e.clipboardData.items;
        for (let i2 = 0; i2 < items.length; i2++) {
          if (items[i2].type.indexOf("image") !== -1) {
            const blob = items[i2].getAsFile();
            const reader = new FileReader();
            reader.onload = (ev) => {
              setMeds((p) => p.map((x) => x.id === m.id ? { ...x, pill: { ...x.pill || {}, img: ev.target.result } } : x));
            };
            reader.readAsDataURL(blob);
            e.preventDefault();
            return;
          }
        }
      }, tabIndex: 0, style: { padding: 12, borderRadius: 10, border: "2px dashed " + C.ind + "40", background: C.ind + "04", textAlign: "center", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.ind } }, "Tap to paste or use buttons below"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, marginTop: 2 } }, "Copy image from Google Images then paste here")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, marginTop: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, marginTop: 4 } }, /* @__PURE__ */ React.createElement("label", { style: { flex: 1, padding: "8px 0", borderRadius: 8, background: C.teal + "10", border: "1px solid " + C.teal + "25", textAlign: "center", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: C.teal } }, "\\uD83D\\uDCF7 Take Photo"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", capture: "environment", style: { display: "none" }, onChange: (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, pill: { ...x.pill || {}, img: ev.target.result } } : x));
        reader.readAsDataURL(f);
      } })), /* @__PURE__ */ React.createElement("label", { style: { flex: 1, padding: "8px 0", borderRadius: 8, background: C.grn + "10", border: "1px solid " + C.grn + "25", textAlign: "center", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: C.grn } }, "\\uD83D\\uDDBC Gallery"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", style: { display: "none" }, onChange: (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, pill: { ...x.pill || {}, img: ev.target.result } } : x));
        reader.readAsDataURL(f);
      } }))), /* @__PURE__ */ React.createElement("a", { href: "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(m.name + " " + m.dose + " pill"), target: "_blank", rel: "noopener noreferrer", style: { flex: 1, padding: "7px 0", borderRadius: 8, background: C.blue + "08", color: C.blue, fontSize: 11, fontWeight: 600, border: "1px solid " + C.blue + "20", textDecoration: "none", textAlign: "center", cursor: "pointer" } }, "Search Google Images"), m.pill && m.pill.img && /* @__PURE__ */ React.createElement("button", { onClick: () => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, pill: { ...x.pill || {}, img: "" } } : x)), style: { padding: "7px 10px", borderRadius: 8, background: C.red + "08", color: C.red, fontSize: 11, fontWeight: 600, border: "1px solid " + C.red + "20", cursor: "pointer", fontFamily: C.font } }, "Remove"))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 600, marginBottom: 2 } }, "Description"), /* @__PURE__ */ React.createElement("input", { defaultValue: m.pill && m.pill.desc || "", onBlur: (e) => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, pill: { ...x.pill || {}, desc: e.target.value }, pillDesc: e.target.value } : x)), style: { width: "100%", padding: "7px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 600, marginBottom: 2 } }, "Doctor"), /* @__PURE__ */ React.createElement("input", { defaultValue: m.doctor || "", onBlur: (e) => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, doctor: e.target.value } : x)), style: { width: "100%", padding: "7px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font, boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 600, marginBottom: 2 } }, "Tabs/Caps Per Dose"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 3 } }, [1, 2, 3, 4, 5, 6].map((n) => /* @__PURE__ */ React.createElement("button", { key: n, onClick: () => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, tabsPerDose: n } : x)), style: { width: 30, height: 30, borderRadius: 8, border: "1.5px solid " + ((m.tabsPerDose || 1) === n ? C.blue : C.sepL), background: (m.tabsPerDose || 1) === n ? C.blue + "12" : "transparent", color: (m.tabsPerDose || 1) === n ? C.blue : C.tx3, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: C.font } }, n)))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 600, marginBottom: 2 } }, "Frequency"), /* @__PURE__ */ React.createElement("select", { defaultValue: m.freq || "Daily", onChange: (e) => setMeds((p) => p.map((x) => x.id === m.id ? { ...x, freq: e.target.value } : x)), style: { width: "100%", padding: "6px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font } }, ["Daily", "2x Daily", "3x Daily", "4x Daily", "Every 4 Hours", "Every 6 Hours", "Every 8 Hours", "Every 12 Hours", "PRN", "Weekly", "Monthly"].map((f) => /* @__PURE__ */ React.createElement("option", { key: f }, f))))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, marginTop: 8, textAlign: "center" } }, "Changes save automatically when you tap out of a field"))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8 } }, st === "hold" ? /* @__PURE__ */ React.createElement("div", { style: { padding: 10, background: C.yel + "08", borderRadius: 12, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.yel } }, "H - On Hold")) : st === "homeVisit" ? /* @__PURE__ */ React.createElement("div", { style: { padding: 10, background: C.pur + "08", borderRadius: 12, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.pur } }, "HV - Home Visit")) : m.freq === "PRN" ? /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.grn, onClick: () => adminPrn(m) }, "Give PRN") : /* @__PURE__ */ React.createElement(Card, { style: { padding: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, marginBottom: 6 } }, "Today's Doses"), m.times.map((st2, ti) => {
        const g = marRecs.find((mr) => mr.med === m.name && mr.d === today && mr.sTime === st2);
        const tc2 = getMTC(st2);
        return /* @__PURE__ */ React.createElement("div", { key: ti, style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: ti < m.times.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { padding: "2px 8px", borderRadius: 5, background: tc2 ? tc2.bg : "#eee", color: tc2 ? tc2.hex : C.tx3, fontWeight: 700, fontSize: 12 } }, st2), g && /* @__PURE__ */ React.createElement("span", { onClick: cm ? () => {
          const nq = prompt("Update tablets/capsules count:", g.qty || 1);
          if (nq !== null) setMarRecs((p) => p.map((mr) => mr.med === m.name && mr.d === today && mr.sTime === st2 ? { ...mr, qty: parseInt(nq) || 1 } : mr));
        } : void 0, style: { fontSize: 12, color: C.grn, fontWeight: 600, cursor: cm ? "pointer" : "default" } }, pureInit(gn(g.by)), g.qty ? " (x" + g.qty + " tab)" : "", " at ", g.t, " ", cm ? "\u270F" : "")), g ? /* @__PURE__ */ React.createElement("span", { onClick: () => {
          if (confirm("Are you sure you want to unmark " + m.name + " (" + st2 + ") as given?")) setMarRecs((p) => p.filter((mr) => !(mr.med === m.name && mr.d === today && mr.sTime === st2)));
        }, style: { fontSize: 18, color: C.grn, cursor: "pointer" } }, "\u2713") : /* @__PURE__ */ React.createElement(Btn, { sm: true, color: C.grn, onClick: () => adminMed(m, st2) }, "Give"));
      })))));
    }
    {
    }
    if (viewBehDomain) {
      const d = behDomains.find((x) => x.id === viewBehDomain);
      if (!d) {
      } else {
        return (() => {
          const bc = d.severity === "Severe" ? C.red : d.severity === "Moderate" ? C.org : "#34c759";
          const mc2 = [];
          const n3 = /* @__PURE__ */ new Date();
          for (let i3 = 11; i3 >= 0; i3--) {
            const dd3 = new Date(n3.getFullYear(), n3.getMonth() - i3, 1);
            const ms = dd3.toISOString().slice(0, 7);
            const c3 = tallies.filter((t) => (t.resId || "r1") === (d.resId || selRes) && t.d && t.d.startsWith(ms)).length;
            mc2.push({ cnt: c3, lbl: dd3.toLocaleString("en-US", { month: "short" }), yr: dd3.getFullYear() });
          }
          const mMax2 = Math.max(...mc2.map((x) => x.cnt), 1);
          const cText = d.criterion ? "Client will exhibit no more than " + d.criterion.maxCount + " " + d.domain.toLowerCase() + " behaviors per " + d.criterion.perPeriods + " " + d.criterion.periodType + " across " + d.criterion.acrossPeriods + " consecutive " + d.criterion.acrossPeriodType + " by " + (d.targetDate || "TBD") + "." : "";
          const IR = ({ l, v, vc }) => /* @__PURE__ */ React.createElement("div", { style: { padding: "11px 16px", borderBottom: "0.5px solid " + C.sepL, display: "flex" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 115, flexShrink: 0, fontSize: 12, fontWeight: 600, color: C.tx3 } }, l), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 13, color: vc || C.tx, lineHeight: 1.5 } }, v || /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 + "60", fontStyle: "italic" } }, "not specified")));
          const SH = ({ t, clr }) => /* @__PURE__ */ React.createElement("div", { style: { padding: "9px 16px 5px", background: (clr || C.tx3) + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 800, color: clr || C.tx3, letterSpacing: 0.8, textTransform: "uppercase" } }, t));
          return /* @__PURE__ */ React.createElement(Modal, { title: "Behavior Domain", onClose: () => setViewBehDomain(null), wide: true }, /* @__PURE__ */ React.createElement("div", { style: { background: "linear-gradient(135deg," + bc + "10," + bc + "03)", padding: "16px 16px 14px", borderBottom: "1px solid " + bc + "18" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 19, fontWeight: 800, color: C.tx, letterSpacing: -0.3 } }, d.domain), d.qualifier && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: bc, fontWeight: 600, marginTop: 2 } }, d.qualifier), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: "#fff", background: bc, padding: "3px 10px", borderRadius: 8, boxShadow: "0 1px 3px " + bc + "40" } }, d.severity), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: C.tx2, background: C.card, padding: "3px 10px", borderRadius: 8, border: "0.5px solid " + C.sepL } }, d.method), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: d.status.includes("Active") ? "#34c759" : C.tx3, background: (d.status.includes("Active") ? "#34c759" : C.tx3) + "12", padding: "3px 10px", borderRadius: 8 } }, d.status)), (cm || perms.behavior) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 12 } }, /* @__PURE__ */ React.createElement(Btn, { sm: true, v: "outline", color: bc, onClick: () => {
            setEditBehDomain({ ...d });
            setViewBehDomain(null);
          } }, "Edit Behavior"), /* @__PURE__ */ React.createElement(Btn, { sm: true, v: "outline", color: C.blue, onClick: () => {
            setBehDomains((p) => [...p, { ...d, id: "bd" + Date.now(), qualifier: (d.qualifier || "") + " (Copy)" }]);
          } }, "Copy"))), /* @__PURE__ */ React.createElement(Card, { style: { margin: "10px 14px", overflow: "hidden", borderRadius: 14 } }, /* @__PURE__ */ React.createElement(IR, { l: "Domain", v: d.domain }), /* @__PURE__ */ React.createElement(IR, { l: "Severity", v: d.severity, vc: bc }), /* @__PURE__ */ React.createElement(IR, { l: "Recording Method", v: d.method })), /* @__PURE__ */ React.createElement(Card, { style: { margin: "0 14px 10px", overflow: "hidden", borderRadius: 14 } }, /* @__PURE__ */ React.createElement(SH, { t: "Definitions", clr: bc }), d.defs.map((df, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "10px 16px", borderBottom: i < d.defs.length - 1 ? "0.5px solid " + C.sepL : "none", background: i % 2 === 0 ? bc + "03" : "transparent" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.tx, lineHeight: 1.5 } }, df), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: bc, fontWeight: 600, marginTop: 4, opacity: 0.8 } }, "[", d.method, "]")))), /* @__PURE__ */ React.createElement(Card, { style: { margin: "0 14px 10px", overflow: "hidden", borderRadius: 14 } }, /* @__PURE__ */ React.createElement(IR, { l: "Baseline", v: d.baseline }), /* @__PURE__ */ React.createElement(IR, { l: "Start Date", v: d.startDate }), /* @__PURE__ */ React.createElement(IR, { l: "Target Date", v: d.targetDate })), cText && /* @__PURE__ */ React.createElement(Card, { style: { margin: "0 14px 10px", overflow: "hidden", borderRadius: 14 } }, /* @__PURE__ */ React.createElement(SH, { t: "Criterion", clr: "#5856d6" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", background: "#5856d605" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "#5856d6", lineHeight: 1.55, fontWeight: 500 } }, cText))), (d.antecedents.length > 0 || d.consequences.length > 0 || d.prevention.length > 0) && /* @__PURE__ */ React.createElement(Card, { style: { margin: "0 14px 10px", overflow: "hidden", borderRadius: 14 } }, d.antecedents.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SH, { t: "Antecedents", clr: C.org }), /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 16px" } }, d.antecedents.map((a2, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "6px 0", borderBottom: i < d.antecedents.length - 1 ? "0.5px solid " + C.sepL : "none", fontSize: 13, color: C.tx2, display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.org, fontWeight: 600, fontSize: 11, minWidth: 14, textAlign: "right" } }, i + 1, "."), a2)))), d.consequences.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SH, { t: "Consequences", clr: C.blue }), /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 16px" } }, d.consequences.map((c2, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "6px 0", borderBottom: i < d.consequences.length - 1 ? "0.5px solid " + C.sepL : "none", fontSize: 13, color: C.tx2, display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.blue, fontWeight: 600, fontSize: 11, minWidth: 14, textAlign: "right" } }, i + 1, "."), c2)))), d.prevention.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SH, { t: "Prevention Strategies", clr: "#34c759" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 16px" } }, d.prevention.map((p3, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "6px 0", borderBottom: i < d.prevention.length - 1 ? "0.5px solid " + C.sepL : "none", fontSize: 13, color: C.tx2, display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#34c759", fontWeight: 600, fontSize: 11, minWidth: 14, textAlign: "right" } }, i + 1, "."), p3))))), /* @__PURE__ */ React.createElement(Card, { style: { margin: "0 14px 10px", overflow: "hidden", borderRadius: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px 6px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700 } }, "12-Month Overview")), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 8px 6px", overflowX: "auto", WebkitOverflowScrolling: "touch" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 3, height: 80, minWidth: 300 } }, mc2.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { flex: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" } }, m.cnt > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, fontWeight: 700, color: bc, marginBottom: 1 } }, m.cnt), /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 20, height: m.cnt > 0 ? Math.max(m.cnt / mMax2 * 50, 4) : 2, background: m.cnt > 0 ? "linear-gradient(180deg," + bc + "," + bc + "60)" : C.sepL, borderRadius: 3, transition: "height .3s" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 7, color: C.tx3, marginTop: 3 } }, m.lbl), (i === 0 || mc2[i - 1].yr !== m.yr) && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 6, color: C.tx3 + "80" } }, m.yr)))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right", padding: "6px 6px 2px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: C.tx } }, "Total: ", mc2.reduce((s, x) => s + x.cnt, 0))))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 16px", display: "flex", gap: 8, justifyContent: "center" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
            setViewBehDomain(null);
            setResSubTab("analytics");
          }, style: { fontSize: 13, fontWeight: 600, color: C.blue, background: "none", border: "none", cursor: "pointer", fontFamily: C.font, padding: "6px 12px" } }, "View Full Analytics \u2192")));
        })();
      }
    }
    {
    }
    if (editBehDomain) {
      return (() => {
        const ed = editBehDomain;
        const isNew = ed._isNew;
        const upd = (obj) => setEditBehDomain((p) => ({ ...p, ...obj }));
        const FL = ({ t }) => /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: C.tx3, padding: "10px 0 4px", letterSpacing: 0.5, textTransform: "uppercase" } }, t);
        const FI = ({ v, s, ph, multi }) => multi ? /* @__PURE__ */ React.createElement("textarea", { value: v, onChange: (e) => s(e.target.value), placeholder: ph, rows: 3, style: { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1.5px solid " + C.sepL, fontSize: 14, fontFamily: C.font, resize: "vertical", boxSizing: "border-box", background: C.card } }) : /* @__PURE__ */ React.createElement("input", { value: v, onChange: (e) => s(e.target.value), placeholder: ph, style: { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1.5px solid " + C.sepL, fontSize: 14, fontFamily: C.font, boxSizing: "border-box", background: C.card } });
        const FS = ({ v, s, opts }) => /* @__PURE__ */ React.createElement("select", { value: v, onChange: (e) => s(e.target.value), style: { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1.5px solid " + C.sepL, fontSize: 14, fontFamily: C.font, background: C.card, WebkitAppearance: "none", appearance: "none" } }, opts.map((o) => /* @__PURE__ */ React.createElement("option", { key: o }, o)));
        const ListEditor = ({ items, setItems, label, color }) => /* @__PURE__ */ React.createElement(React.Fragment, null, items.map((itm, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 6, marginBottom: 5 } }, /* @__PURE__ */ React.createElement("input", { value: itm, onChange: (e) => {
          const c = [...items];
          c[i] = e.target.value;
          setItems(c);
        }, placeholder: label + " " + (i + 1), style: { flex: 1, padding: "8px 10px", borderRadius: 10, border: "1px solid " + C.sepL, fontSize: 13, fontFamily: C.font, background: C.card } }), items.length > 0 && /* @__PURE__ */ React.createElement("button", { onClick: () => setItems(items.filter((_, j) => j !== i)), style: { width: 30, height: 36, borderRadius: 8, border: "1px solid " + C.red + "30", background: C.red + "06", color: C.red, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.font, flexShrink: 0 } }, "\u2212"))), /* @__PURE__ */ React.createElement("button", { onClick: () => setItems([...items, ""]), style: { fontSize: 12, fontWeight: 600, color: color || C.blue, background: "none", border: "none", cursor: "pointer", fontFamily: C.font, padding: "4px 0" } }, "+ Add ", label));
        const PERIOD_OPTS = ["Thirty (30) Day Periods", "Seven (7) Day Periods", "Fourteen (14) Day Periods", "Sixty (60) Day Periods", "Ninety (90) Day Periods"];
        return /* @__PURE__ */ React.createElement(Modal, { title: isNew ? "Add Behavior Domain" : "Edit Behavior Domain", onClose: () => setEditBehDomain(null), wide: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 20px" } }, /* @__PURE__ */ React.createElement(FL, { t: "Domain" }), /* @__PURE__ */ React.createElement(FI, { v: ed.domain, s: (v) => upd({ domain: v }), ph: "e.g. Socially Disruptive Behavior" }), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(FL, { t: "Qualifier" }), /* @__PURE__ */ React.createElement(FI, { v: ed.qualifier, s: (v) => upd({ qualifier: v }), ph: "Optional" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(FL, { t: "Severity" }), /* @__PURE__ */ React.createElement(FS, { v: ed.severity, s: (v) => upd({ severity: v }), opts: ["Mild", "Moderate", "Severe"] }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(FL, { t: "Recording Method" }), /* @__PURE__ */ React.createElement(FS, { v: ed.method, s: (v) => upd({ method: v }), opts: ["Frequency", "Duration", "Interval", "Latency", "Rate"] })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(FL, { t: "Status" }), /* @__PURE__ */ React.createElement(FS, { v: ed.status, s: (v) => upd({ status: v }), opts: ["Active", "Active, Continued", "Inactive", "On-Hold", "Discontinued"] }))), /* @__PURE__ */ React.createElement(FL, { t: "Definitions" }), ed.defs.map((df2, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 6, marginBottom: 5 } }, /* @__PURE__ */ React.createElement("input", { value: df2, onChange: (e) => {
          const nd = [...ed.defs];
          nd[i] = e.target.value;
          upd({ defs: nd });
        }, placeholder: "Definition " + (i + 1), style: { flex: 1, padding: "8px 10px", borderRadius: 10, border: "1px solid " + C.sepL, fontSize: 13, fontFamily: C.font, background: C.card } }), ed.defs.length > 1 && /* @__PURE__ */ React.createElement("button", { onClick: () => upd({ defs: ed.defs.filter((_, j) => j !== i) }), style: { width: 30, height: 36, borderRadius: 8, border: "1px solid " + C.red + "30", background: C.red + "06", color: C.red, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.font, flexShrink: 0 } }, "\u2212"))), /* @__PURE__ */ React.createElement("button", { onClick: () => upd({ defs: [...ed.defs, ""] }), style: { fontSize: 12, fontWeight: 600, color: C.blue, background: "none", border: "none", cursor: "pointer", fontFamily: C.font, padding: "4px 0" } }, "+ Add Definition"), /* @__PURE__ */ React.createElement(FL, { t: "Baseline Statement" }), /* @__PURE__ */ React.createElement(FI, { v: ed.baseline, s: (v) => upd({ baseline: v }), ph: "e.g. Client exhibited 26 behaviors across 2 months in July 2025", multi: true }), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(FL, { t: "Start Date" }), /* @__PURE__ */ React.createElement("input", { type: "date", value: ed.startDate, onChange: (e) => upd({ startDate: e.target.value }), style: { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1.5px solid " + C.sepL, fontSize: 14, fontFamily: C.font, background: C.card, boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(FL, { t: "Target Date" }), /* @__PURE__ */ React.createElement("input", { type: "date", value: ed.targetDate, onChange: (e) => upd({ targetDate: e.target.value }), style: { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1.5px solid " + C.sepL, fontSize: 14, fontFamily: C.font, background: C.card, boxSizing: "border-box" } }))), /* @__PURE__ */ React.createElement(FL, { t: "Criterion" }), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, background: "#5856d606", border: "1.5px solid #5856d618", borderRadius: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#5856d6", lineHeight: 2.2, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("span", null, "Client will exhibit no more than"), /* @__PURE__ */ React.createElement("input", { type: "number", value: ed.criterion.maxCount, onChange: (e) => upd({ criterion: { ...ed.criterion, maxCount: parseInt(e.target.value) || 0 } }), style: { width: 42, padding: "4px 2px", borderRadius: 8, border: "1.5px solid #5856d640", textAlign: "center", fontSize: 14, fontFamily: C.font, fontWeight: 700, background: C.card } }), /* @__PURE__ */ React.createElement("span", null, "behaviors per"), /* @__PURE__ */ React.createElement("input", { type: "number", value: ed.criterion.perPeriods, onChange: (e) => upd({ criterion: { ...ed.criterion, perPeriods: parseInt(e.target.value) || 0 } }), style: { width: 42, padding: "4px 2px", borderRadius: 8, border: "1.5px solid #5856d640", textAlign: "center", fontSize: 14, fontFamily: C.font, fontWeight: 700, background: C.card } }), /* @__PURE__ */ React.createElement("select", { value: ed.criterion.periodType, onChange: (e) => upd({ criterion: { ...ed.criterion, periodType: e.target.value } }), style: { padding: "4px 6px", borderRadius: 8, border: "1px solid #5856d630", fontSize: 11, fontFamily: C.font, background: C.card } }, PERIOD_OPTS.map((o) => /* @__PURE__ */ React.createElement("option", { key: o }, o))), /* @__PURE__ */ React.createElement("span", null, "across"), /* @__PURE__ */ React.createElement("input", { type: "number", value: ed.criterion.acrossPeriods, onChange: (e) => upd({ criterion: { ...ed.criterion, acrossPeriods: parseInt(e.target.value) || 0 } }), style: { width: 42, padding: "4px 2px", borderRadius: 8, border: "1.5px solid #5856d640", textAlign: "center", fontSize: 14, fontFamily: C.font, fontWeight: 700, background: C.card } }), /* @__PURE__ */ React.createElement("span", null, "consecutive"), /* @__PURE__ */ React.createElement("select", { value: ed.criterion.acrossPeriodType, onChange: (e) => upd({ criterion: { ...ed.criterion, acrossPeriodType: e.target.value } }), style: { padding: "4px 6px", borderRadius: 8, border: "1px solid #5856d630", fontSize: 11, fontFamily: C.font, background: C.card } }, PERIOD_OPTS.map((o) => /* @__PURE__ */ React.createElement("option", { key: o }, o))), /* @__PURE__ */ React.createElement("span", null, "by ", ed.targetDate || "TBD", "."))), /* @__PURE__ */ React.createElement(FL, { t: "Antecedents" }), /* @__PURE__ */ React.createElement(ListEditor, { items: ed.antecedents || [], setItems: (v) => upd({ antecedents: v }), label: "Antecedent", color: C.org }), /* @__PURE__ */ React.createElement(FL, { t: "Consequences" }), /* @__PURE__ */ React.createElement(ListEditor, { items: ed.consequences || [], setItems: (v) => upd({ consequences: v }), label: "Consequence", color: C.blue }), /* @__PURE__ */ React.createElement(FL, { t: "Prevention Strategies" }), /* @__PURE__ */ React.createElement(ListEditor, { items: ed.prevention || [], setItems: (v) => upd({ prevention: v }), label: "Strategy", color: "#34c759" }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: "#34c759", onClick: () => {
          const cleaned = { ...ed };
          delete cleaned._isNew;
          cleaned.defs = cleaned.defs.filter((x) => x.trim());
          cleaned.antecedents = (cleaned.antecedents || []).filter((x) => x.trim());
          cleaned.consequences = (cleaned.consequences || []).filter((x) => x.trim());
          cleaned.prevention = (cleaned.prevention || []).filter((x) => x.trim());
          if (!cleaned.defs.length) cleaned.defs = ["(no definition)"];
          if (isNew) setBehDomains((p) => [...p, cleaned]);
          else setBehDomains((p) => p.map((x) => x.id === cleaned.id ? cleaned : x));
          setEditBehDomain(null);
        } }, isNew ? "Add Domain" : "Save Changes")), !isNew && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.red, onClick: () => {
          if (confirm("Delete this behavior domain?")) {
            setBehDomains((p) => p.filter((x) => x.id !== ed.id));
            setEditBehDomain(null);
          }
        } }, "Delete")))));
      })();
    }
    if (modal === "mar") {
      const fl = dueMeds(marFilter);
      return /* @__PURE__ */ React.createElement(Modal, { title: "MAR", onClose: () => setModal(null), wide: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 14px 0" } }, /* @__PURE__ */ React.createElement(Seg, { opts: [{ l: "Due Now", v: "due" }, { l: "All", v: "all" }, { l: "PRN", v: "prn" }], val: marFilter, set: setMarFilter })), /* @__PURE__ */ React.createElement(AllergyBanner, { r: residents.find((x) => x.id === selRes) || residents[0] }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, fl.length === 0 ? /* @__PURE__ */ React.createElement(Card, { style: { padding: 16, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "No meds ", marFilter === "due" ? "due now" : "here")) : fl.map((m) => {
        const st = getMedStatus(m);
        const tc = m.times && m.times[0] ? getMTC(m.times[0]) : null;
        return /* @__PURE__ */ React.createElement(Card, { key: m.id, style: { marginBottom: 6, padding: 10, background: tc ? tc.bgL : C.card, borderLeft: tc ? "4px solid " + tc.hex : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(PillVisual, { pill: m.pill, size: 32 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, cursor: "pointer" }, onClick: () => {
          setViewMed(m.id);
          setModal("medD");
        } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, m.name, " ", m.dose, " ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: C.blue, background: C.blue + "10", padding: "1px 5px", borderRadius: 4 } }, "x", m.tabsPerDose || 1)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, marginBottom: 4 } }, m.freq, " | ", m.route, " | ", /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.blue } }, m.tabsPerDose || 1, " tab", (m.tabsPerDose || 1) > 1 ? "s" : "", "/dose")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, m.times.map((st2, ti) => {
          const g = marRecs.find((mr) => mr.med === m.name && mr.d === today && mr.sTime === st2);
          const tc2 = getMTC(st2);
          return /* @__PURE__ */ React.createElement("div", { key: ti, style: { display: "flex", alignItems: "center", gap: 3, padding: "2px 6px", borderRadius: 6, background: g ? C.grn + "15" : tc2 ? tc2.bg : "#eee" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: tc2 ? tc2.hex : C.tx3 } }, st2), g ? /* @__PURE__ */ React.createElement("span", { onClick: (e2) => {
            e2.stopPropagation();
            if (confirm("Are you sure you want to unmark " + m.name + " (" + st2 + ") as given? This will remove the administration record.")) setMarRecs((p) => p.filter((mr) => !(mr.med === m.name && mr.d === today && mr.sTime === st2)));
          }, style: { fontSize: 10, fontWeight: 700, color: C.grn, cursor: "pointer" } }, pureInit(gn(g.by)), " x", g.qty || 1) : /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
            e.stopPropagation();
            adminMed(m, st2);
          }, style: { fontSize: 9, fontWeight: 700, color: "#fff", background: C.grn, border: "none", borderRadius: 4, padding: "1px 6px", cursor: "pointer", fontFamily: C.font } }, "Give"));
        })))));
      })), cm && /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, v: "outline", color: C.blue, onClick: () => setModal("addMed") }, "+ Add Medication")));
    }
    if (modal === "addMed") {
      if (!cm) return /* @__PURE__ */ React.createElement(Modal, { title: "Denied", onClose: () => setModal(null) }, /* @__PURE__ */ React.createElement("div", { style: { padding: 20, textAlign: "center", color: C.red } }, "Admin/Manager only"));
      const pillColorOpts = ["White", "Yellow", "Orange", "Pink", "Red", "Blue", "Green", "Brown", "Tan", "Peach", "Purple", "Gray", "Black", "Clear"];
      const pillColorHex = { White: "#f5f5f5", Yellow: "#FFD700", Orange: "#FF8C00", Pink: "#FFB6C1", Red: "#DC143C", Blue: "#4169E1", Green: "#3CB371", Brown: "#8B4513", Tan: "#D2B48C", Peach: "#FFDAB9", Purple: "#9370DB", Gray: "#A9A9A9", Black: "#333", Clear: "#E0E8F0" };
      const pillShapes = ["Round", "Oval", "Capsule", "Oblong", "Diamond", "Triangle", "Rectangle"];
      const pillSearchReady = newMed.name && newMed.dose && (newMed.pillColor || newMed.pillDesc);
      const buildPillUrl = () => {
        const colorMap = { White: 12, Yellow: 7, Orange: 11, Pink: 8, Red: 1, Blue: 2, Green: 5, Brown: 3, Tan: 10, Purple: 9, Gray: 4, Black: 13, Clear: 15 };
        const shapeMap = { Round: 24, Oval: 17, Capsule: 5, Oblong: 16, Diamond: 7, Triangle: 27, Rectangle: 22 };
        const cId = colorMap[newMed.pillColor] || "";
        const sId = shapeMap[newMed.pillDesc] || "";
        return "https://www.drugs.com/imprints.php?drugname=" + encodeURIComponent(newMed.name) + (cId ? "&color=" + cId : "") + (sId ? "&shape=" + sId : "") + (newMed.pillImprint ? "&imprint=" + encodeURIComponent(newMed.pillImprint) : "");
      };
      const userPill = {
        shape: (newMed.pillDesc || "").toLowerCase().includes("capsule") ? "capsule" : (newMed.pillDesc || "").toLowerCase().includes("oval") ? "oval" : "round",
        color: pillColorHex[newMed.pillColor] || "#E0E0E0",
        imprint: (newMed.name || "").slice(0, 6).toUpperCase(),
        size: "10mm",
        scored: (newMed.pillDesc || "").toLowerCase().includes("scored"),
        desc: [newMed.pillColor, newMed.pillDesc].filter(Boolean).join(" ") + (newMed.pillDesc ? "" : " tablet")
      };
      return /* @__PURE__ */ React.createElement(Modal, { title: "Add Medication", onClose: () => setModal(null), wide: true }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Medication Name *", value: newMed.name, onChange: (v) => {
        setNewMed((p) => ({ ...p, name: v }));
        if (v.length > 2) setAiPrev(aiMed(v));
        else setAiPrev(null);
      }, ph: "e.g., Gabapentin" }), aiPrev && newMed.name.length > 2 && /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", padding: 10, background: C.alt, borderRadius: 10, marginBottom: 4 } }, /* @__PURE__ */ React.createElement(PillVisual, { pill: newMed.pillColor ? userPill : aiPrev.pill, size: 55 })), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 10px", background: C.ind + "06", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: C.ind, marginBottom: 2 } }, "AI Auto-Fill"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2 } }, "Generic: ", aiPrev.gen), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2 } }, "Reason: ", aiPrev.reason), (newMed.pillColor || aiPrev.pill && aiPrev.pill.desc) && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontStyle: "italic" } }, newMed.pillColor ? userPill.desc : aiPrev.pill.desc), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 2, marginTop: 3 } }, aiPrev.sides.map((s2, i) => /* @__PURE__ */ React.createElement(Pill, { key: i, text: s2, cl: C.org }))))), /* @__PURE__ */ React.createElement(Inp, { label: "Dose *", value: newMed.dose, onChange: (v) => setNewMed((p) => ({ ...p, dose: v })), ph: "10mg" }), /* @__PURE__ */ React.createElement(Inp, { label: "Reason for Use *", value: newMed.reason, onChange: (v) => setNewMed((p) => ({ ...p, reason: v })), ph: "e.g., Blood pressure management, Seizure prevention..." }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 9 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 3 } }, "Tabs/Caps Per Dose"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, [1, 2, 3, 4, 5, 6].map((n) => /* @__PURE__ */ React.createElement("button", { key: n, onClick: () => setNewMed((p) => ({ ...p, tabsPerDose: n })), style: { width: 36, height: 36, borderRadius: 10, border: "2px solid " + (newMed.tabsPerDose === n ? C.blue : C.sepL), background: newMed.tabsPerDose === n ? C.blue + "12" : "transparent", color: newMed.tabsPerDose === n ? C.blue : C.tx3, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: C.font } }, n)))), /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 10px", padding: "10px 12px", background: "#5856d606", borderRadius: 12, border: "1.5px solid #5856d618" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, "\u{1F48A}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "#5856d6" } }, "Pill Identification")), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.tx3, marginBottom: 4 } }, "PILL COLOR"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, pillColorOpts.map((pc) => /* @__PURE__ */ React.createElement("button", { key: pc, onClick: () => setNewMed((p) => ({ ...p, pillColor: p.pillColor === pc ? "" : pc })), style: { display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 8, fontSize: 11, fontWeight: newMed.pillColor === pc ? 700 : 500, border: "1.5px solid " + (newMed.pillColor === pc ? "#5856d6" : C.sepL), background: newMed.pillColor === pc ? "#5856d610" : C.card, color: newMed.pillColor === pc ? "#5856d6" : C.tx2, cursor: "pointer", fontFamily: C.font } }, /* @__PURE__ */ React.createElement("div", { style: { width: 12, height: 12, borderRadius: 6, background: pillColorHex[pc] || "#ccc", border: "1px solid #00000015" } }), pc)))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.tx3, marginBottom: 4 } }, "PILL SHAPE"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, pillShapes.map((ps) => /* @__PURE__ */ React.createElement("button", { key: ps, onClick: () => setNewMed((p) => ({ ...p, pillDesc: p.pillDesc === ps ? "" : ps })), style: { padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: newMed.pillDesc === ps ? 700 : 500, border: "1.5px solid " + (newMed.pillDesc === ps ? "#5856d6" : C.sepL), background: newMed.pillDesc === ps ? "#5856d610" : C.card, color: newMed.pillDesc === ps ? "#5856d6" : C.tx2, cursor: "pointer", fontFamily: C.font } }, ps)))), /* @__PURE__ */ React.createElement(Inp, { label: "Imprint / Markings", value: newMed.pillImprint || "", onChange: (v) => setNewMed((p) => ({ ...p, pillImprint: v })), ph: "e.g., G 300, IP 102, M 15" }), pillSearchReady && /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 10px", background: "#5856d604", borderRadius: 10, border: "1px solid #5856d615", marginTop: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12 } }, "\u{1F916}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: "#5856d6" } }, "AI Pill Match")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 6 } }, /* @__PURE__ */ React.createElement(PillVisual, { pill: userPill, size: 50 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.tx } }, newMed.name, " ", newMed.dose), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, [newMed.pillColor, newMed.pillDesc, newMed.pillImprint].filter(Boolean).join(" | ")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontStyle: "italic", color: "#5856d6", marginTop: 2 } }, "Visual generated from pill details"))), /* @__PURE__ */ React.createElement("a", { href: buildPillUrl(), target: "_blank", rel: "noopener noreferrer", style: { display: "block", padding: "6px 0", textAlign: "center", fontSize: 11, fontWeight: 600, color: "#5856d6", textDecoration: "underline", cursor: "pointer" } }, "Search Drugs.com Pill Identifier ", "\u2197\uFE0F")), /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, fontWeight: 700, marginBottom: 4 } }, "PILL PHOTO (optional)"), newMed.pillImg && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("img", { src: newMed.pillImg, style: { width: 50, height: 50, borderRadius: 8, objectFit: "contain", background: "#f8f8f8" } })), /* @__PURE__ */ React.createElement("div", { onPaste: (e) => {
        const items = e.clipboardData.items;
        for (let i2 = 0; i2 < items.length; i2++) {
          if (items[i2].type.indexOf("image") !== -1) {
            const blob = items[i2].getAsFile();
            const reader = new FileReader();
            reader.onload = (ev) => setNewMed((p) => ({ ...p, pillImg: ev.target.result }));
            reader.readAsDataURL(blob);
            e.preventDefault();
            return;
          }
        }
      }, tabIndex: 0, style: { padding: 10, borderRadius: 10, border: "2px dashed " + C.ind + "40", background: C.ind + "04", textAlign: "center", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: C.ind } }, "Tap to paste image"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, marginTop: 2 } }, "Copy image from Google then paste")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, marginTop: 4 } }, /* @__PURE__ */ React.createElement("label", { style: { flex: 1, padding: "7px 0", borderRadius: 8, background: C.teal + "10", border: "1px solid " + C.teal + "25", textAlign: "center", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: C.teal } }, "\\uD83D\\uDCF7 Camera"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", capture: "environment", style: { display: "none" }, onChange: (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => setNewMed((p) => ({ ...p, pillImg: ev.target.result }));
        reader.readAsDataURL(f);
      } })), /* @__PURE__ */ React.createElement("label", { style: { flex: 1, padding: "7px 0", borderRadius: 8, background: C.grn + "10", border: "1px solid " + C.grn + "25", textAlign: "center", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: C.grn } }, "\\uD83D\\uDDBC Gallery"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", style: { display: "none" }, onChange: (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => setNewMed((p) => ({ ...p, pillImg: ev.target.result }));
        reader.readAsDataURL(f);
      } }))), /* @__PURE__ */ React.createElement("a", { href: "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent((newMed.name || "medication") + " " + (newMed.dose || "") + " pill"), target: "_blank", rel: "noopener noreferrer", style: { display: "block", marginTop: 4, padding: "6px 0", borderRadius: 8, background: C.blue + "08", color: C.blue, fontSize: 10, fontWeight: 600, border: "1px solid " + C.blue + "20", textDecoration: "none", textAlign: "center" } }, "Search Google Images"))), /* @__PURE__ */ React.createElement(Inp, { label: "Route", value: newMed.route, onChange: (v) => setNewMed((p) => ({ ...p, route: v })), opts: ["By Mouth", "Injection", "IV Drip", "Under Skin", "Under Tongue", "On Skin", "Inhaled", "Rectal", "Eye Drops", "Ear Drops", "Nasal Spray"] }), /* @__PURE__ */ React.createElement(Inp, { label: "Frequency", value: newMed.freq, onChange: (v) => setNewMed((p) => ({ ...p, freq: v })), opts: ["Daily", "2x Daily", "3x Daily", "4x Daily", "Every 4 Hours", "Every 6 Hours", "Every 8 Hours", "Every 12 Hours", "PRN", "Weekly", "Monthly"] }), /* @__PURE__ */ React.createElement(Inp, { label: "Admin Times", value: newMed.times, onChange: (v) => setNewMed((p) => ({ ...p, times: v })), ph: "08:00, 20:00" }), /* @__PURE__ */ React.createElement(Inp, { label: "Prescribing Doctor *", value: newMed.doctor, onChange: (v) => setNewMed((p) => ({ ...p, doctor: v })), ph: "Dr. Name" }), /* @__PURE__ */ React.createElement(Inp, { label: "Rx Number *", value: newMed.rx, onChange: (v) => setNewMed((p) => ({ ...p, rx: v })), ph: "RX-XXXXXXX" }), /* @__PURE__ */ React.createElement(Inp, { label: "Special Instructions", value: newMed.instr, onChange: (v) => setNewMed((p) => ({ ...p, instr: v })), multi: true, ph: "Take with food..." }), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, onClick: () => {
        if (!newMed.name || !newMed.dose || !newMed.doctor || !newMed.rx || !newMed.reason || !newMed.reason) return;
        const ai = aiMed(newMed.name);
        const customPill = newMed.pillColor ? { ...userPill, imprint: newMed.pillImprint || userPill.imprint } : ai.pill;
        const nm = { id: "m" + Date.now(), resId: selRes || "r1", name: newMed.name, dose: newMed.dose, route: newMed.route, freq: newMed.freq, times: newMed.times.split(",").map((x) => x.trim()).filter(Boolean), instr: newMed.instr, doctor: newMed.doctor, rx: newMed.rx, reason: newMed.reason, status: "active", ...ai, pill: { ...customPill, img: newMed.pillImg || "" }, pillColor: newMed.pillColor, pillDesc: newMed.pillDesc, tabsPerDose: newMed.tabsPerDose || 1 };
        setMeds((p) => [...p, nm]);
        setNewMed({ name: "", dose: "", route: "By Mouth", freq: "Daily", times: "08:00", instr: "", doctor: "", rx: "", pillColor: "", pillDesc: "", reason: "", tabsPerDose: 1 });
        setAiPrev(null);
        setModal(null);
        setMedMemoPrompt({ type: "add", medName: newMed.name, dose: newMed.dose, resId: selRes || "r1", physician: newMed.doctor });
      }, disabled: !newMed.name || !newMed.dose || !newMed.doctor || !newMed.rx || !newMed.reason, color: C.grn }, "Add to MAR"))));
    }
    if (modal === "bowel") {
      const BowelSVG = ({ type, s }) => {
        const w = s || 60;
        const h = s ? s * 0.5 : 30;
        if (type === 1) return /* @__PURE__ */ React.createElement("svg", { width: w, height: h, viewBox: "0 0 60 30" }, /* @__PURE__ */ React.createElement("circle", { cx: "10", cy: "15", r: "6", fill: "#5C3317" }), /* @__PURE__ */ React.createElement("circle", { cx: "24", cy: "12", r: "5", fill: "#6B3A1F" }), /* @__PURE__ */ React.createElement("circle", { cx: "36", cy: "17", r: "6.5", fill: "#5C3317" }), /* @__PURE__ */ React.createElement("circle", { cx: "50", cy: "14", r: "5.5", fill: "#6B3A1F" }));
        if (type === 2) return /* @__PURE__ */ React.createElement("svg", { width: w, height: h, viewBox: "0 0 60 30" }, /* @__PURE__ */ React.createElement("rect", { x: "6", y: "8", width: "48", height: "14", rx: "7", fill: "#5C3317" }), /* @__PURE__ */ React.createElement("circle", { cx: "16", cy: "12", r: "3", fill: "#4A2510" }), /* @__PURE__ */ React.createElement("circle", { cx: "30", cy: "18", r: "3.5", fill: "#4A2510" }), /* @__PURE__ */ React.createElement("circle", { cx: "44", cy: "13", r: "3", fill: "#4A2510" }));
        if (type === 3) return /* @__PURE__ */ React.createElement("svg", { width: w, height: h, viewBox: "0 0 60 30" }, /* @__PURE__ */ React.createElement("rect", { x: "5", y: "8", width: "50", height: "14", rx: "7", fill: "#6B3A1F" }), /* @__PURE__ */ React.createElement("line", { x1: "15", y1: "9", x2: "14", y2: "21", stroke: "#4A2510", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("line", { x1: "25", y1: "8.5", x2: "26", y2: "21.5", stroke: "#4A2510", strokeWidth: "0.8" }), /* @__PURE__ */ React.createElement("line", { x1: "37", y1: "9", x2: "36", y2: "21", stroke: "#4A2510", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("line", { x1: "47", y1: "9.5", x2: "48", y2: "20.5", stroke: "#4A2510", strokeWidth: "0.7" }));
        if (type === 4) return /* @__PURE__ */ React.createElement("svg", { width: w, height: h, viewBox: "0 0 60 30" }, /* @__PURE__ */ React.createElement("rect", { x: "5", y: "9", width: "50", height: "12", rx: "6", fill: "#7B4B2A" }));
        if (type === 5) return /* @__PURE__ */ React.createElement("svg", { width: w, height: h, viewBox: "0 0 60 30" }, /* @__PURE__ */ React.createElement("ellipse", { cx: "14", cy: "15", rx: "9", ry: "7", fill: "#8B6914" }), /* @__PURE__ */ React.createElement("ellipse", { cx: "32", cy: "14", rx: "10", ry: "8", fill: "#9B7924" }), /* @__PURE__ */ React.createElement("ellipse", { cx: "50", cy: "16", rx: "8", ry: "6", fill: "#8B6914" }));
        if (type === 6) return /* @__PURE__ */ React.createElement("svg", { width: w, height: h, viewBox: "0 0 60 30" }, /* @__PURE__ */ React.createElement("ellipse", { cx: "30", cy: "16", rx: "24", ry: "10", fill: "#A08030", opacity: "0.7" }));
        if (type === 7) return /* @__PURE__ */ React.createElement("svg", { width: w, height: h, viewBox: "0 0 60 30" }, /* @__PURE__ */ React.createElement("ellipse", { cx: "30", cy: "18", rx: "24", ry: "8", fill: "#B8960C", opacity: "0.35" }));
        return null;
      };
      const bowelTypes = [
        { id: 1, label: "Type 1: Hard lumps", desc: "Hard balls like nuts", c: "#8B4513" },
        { id: 2, label: "Type 2: Lumpy sausage", desc: "Lumpy sausage shape", c: "#6B3A1F" },
        { id: 3, label: "Type 3: Cracked sausage", desc: "Sausage with cracks on surface", c: "#6B4226" },
        { id: 4, label: "Type 4: Smooth & soft", desc: "Smooth, soft snake shape \u2014 NORMAL", c: C.grn },
        { id: 5, label: "Type 5: Soft blobs", desc: "Soft blobs, clear edges", c: C.org },
        { id: 6, label: "Type 6: Mushy", desc: "Fluffy, ragged edges, mushy", c: "#A08030" },
        { id: 7, label: "Type 7: Liquid", desc: "Watery, all liquid", c: C.red }
      ];
      return /* @__PURE__ */ React.createElement(Modal, { title: "\u{1F6BD} Bowel Movement", onClose: () => setModal(null), wide: true }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 6px", fontSize: 11, fontWeight: 700, color: C.tx3 } }, "WHAT DID IT LOOK LIKE? (tap one)"), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, bowelTypes.map((bt) => /* @__PURE__ */ React.createElement("div", { key: bt.id, onClick: () => setBType(bt.id), style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 5, borderRadius: 12, border: "2px solid " + (bType === bt.id ? bt.c : C.sepL), background: bType === bt.id ? bt.c + "10" : C.card, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 64, flexShrink: 0, display: "flex", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(BowelSVG, { type: bt.id, s: 60 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: bType === bt.id ? bt.c : C.tx } }, bt.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, lineHeight: 1.3 } }, bt.desc)), bType === bt.id && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18, color: bt.c } }, "\u2713")))), /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 14px", fontSize: 11, fontWeight: 700, color: C.tx3, marginTop: 4 } }, "HOW MUCH?"), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", display: "flex", gap: 6 } }, ["Small", "Medium", "Large"].map((sz) => /* @__PURE__ */ React.createElement("button", { key: sz, onClick: () => setBSize(sz), style: { flex: 1, padding: "10px 8px", borderRadius: 10, border: "2px solid " + (bSize === sz ? C.org : C.sepL), background: bSize === sz ? C.org + "10" : C.card, color: bSize === sz ? C.org : C.tx2, fontSize: 13, fontWeight: bSize === sz ? 700 : 500, cursor: "pointer", fontFamily: C.font } }, sz === "Small" ? "\u{1F90F} " : sz === "Large" ? "\u{1F4AA} " : "", sz))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 11, color: C.tx3, fontWeight: 600 } }, "Time"), /* @__PURE__ */ React.createElement("input", { type: "time", value: bTime, onChange: (e) => setBTime(e.target.value), style: { width: "100%", padding: 8, borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 13, fontFamily: C.font, marginTop: 3 } })), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.org, onClick: () => {
        if (!bType) return;
        const bt = bowelTypes.find((x) => x.id === bType);
        const r3 = residents.find((x) => x.id === selRes);
        setDocs((p) => [{ id: "d" + Date.now(), resId: selRes, type: "Activity", d: today, t: bTime || (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), user: user.name, text: "\u{1F6BD} Bowel \u2014 " + (bt ? bt.label : "") + (bSize ? " (" + bSize + ")" : "") + (r3 ? " \u2014 " + fullName(r3.name) : "") }, ...p]);
        setModal(null);
      }, disabled: !bType }, "Record"))));
    }
    if (["water", "urine", "vitals"].includes(modal)) {
      const cfg = { water: { t: "Water", f: [["Oz", "number", "8"], ["Time", "time", ""], ["Method", null, null, ["Cup", "Straw", "Thickened", "Assisted"]]] }, urine: { t: "Urine", f: [["mL", "number", "200"], ["Time", "time", ""], ["Color", null, null, ["Clear", "Light Yellow", "Dark Yellow"]]] }, vitals: { t: "\u{1F321}\uFE0F Temperature", f: [["Temp (\xB0F)", "text", "98.6"], ["O2 Sat (%)", "number", "98"], ["Time", "time", ""]] } }[modal];
      return /* @__PURE__ */ React.createElement(Modal, { title: cfg.t, onClose: () => setModal(null) }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, cfg.f.map((f) => f[3] ? /* @__PURE__ */ React.createElement(Inp, { key: f[0], label: f[0], value: "", onChange: () => {
      }, opts: f[3] }) : /* @__PURE__ */ React.createElement(Inp, { key: f[0], label: f[0], value: "", onChange: () => {
      }, type: f[1] || "text", ph: f[2] })), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, onClick: () => setModal(null) }, "Record"))));
    }
    if (modal === "addStaff") {
      const rl = ROLES[nStaff.role] || ROLES["Staff"];
      return /* @__PURE__ */ React.createElement(Modal, { title: "Add Staff", onClose: () => setModal(null), wide: true }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "First Name *", value: nStaff.first, onChange: (v) => setNStaff((p) => ({ ...p, first: v })), ph: "Jane" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Last Name *", value: nStaff.last, onChange: (v) => setNStaff((p) => ({ ...p, last: v })), ph: "Doe" }))), /* @__PURE__ */ React.createElement(Inp, { label: "Phone", value: nStaff.phone, onChange: (v) => setNStaff((p) => ({ ...p, phone: v })), ph: "209-555-0100" }), /* @__PURE__ */ React.createElement(Inp, { label: "Email", value: nStaff.email, onChange: (v) => setNStaff((p) => ({ ...p, email: v })), ph: "name@isr.com" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 6px" } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 4 } }, "Role *"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, ROLE_NAMES.filter((r) => r !== "System Admin").map((r) => {
        const c = ROLES[r].color;
        return /* @__PURE__ */ React.createElement("button", { key: r, onClick: () => setNStaff((p) => ({ ...p, role: r })), style: { padding: "5px 10px", borderRadius: 8, border: "2px solid " + (nStaff.role === r ? c : C.sepL), background: nStaff.role === r ? c + "12" : "transparent", color: nStaff.role === r ? c : C.tx3, fontSize: 11, fontWeight: nStaff.role === r ? 700 : 500, cursor: "pointer", fontFamily: C.font } }, r);
      }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 9 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 3 } }, "Temporary Password"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("input", { value: nStaff.password || "", onChange: (e) => setNStaff((p) => ({ ...p, password: e.target.value })), placeholder: "Auto-generated", style: { flex: 1, padding: "9px 11px", borderRadius: 10, border: "1px solid " + C.sepL, background: C.card, fontSize: 15, fontFamily: C.font } }), /* @__PURE__ */ React.createElement("button", { onClick: () => {
        const tp = "temp" + Math.floor(1e3 + Math.random() * 9e3);
        setNStaff((p) => ({ ...p, password: tp }));
      }, style: { padding: "8px 12px", borderRadius: 10, border: "1px solid " + C.org, background: C.org + "08", color: C.org, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, "Generate")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.org, marginTop: 3 } }, "Give this temp password to the staff member. They will create their own on first login.")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 6px" } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 4 } }, "Homes *"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, HOMES.map((h) => {
        const on = nStaff.homes.includes(h.id);
        return /* @__PURE__ */ React.createElement("button", { key: h.id, onClick: () => setNStaff((p) => ({ ...p, homes: on ? p.homes.filter((x) => x !== h.id) : [...p.homes, h.id] })), style: { flex: 1, padding: "8px", borderRadius: 10, border: "2px solid " + (on ? h.color : C.sepL), background: on ? h.color + "12" : "transparent", color: on ? h.color : C.tx3, fontSize: 12, fontWeight: on ? 700 : 500, cursor: "pointer", fontFamily: C.font } }, h.name);
      }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, onClick: () => {
        if (!nStaff.first || !nStaff.last || nStaff.pin.length !== 4 || nStaff.homes.length === 0) return;
        setStaff((p) => [...p, { id: "s" + Date.now(), first: nStaff.first, last: nStaff.last, name: nStaff.last + ", " + nStaff.first, role: nStaff.role, pin: nStaff.pin, phone: nStaff.phone, email: nStaff.email, on: true, homes: nStaff.homes, tempPassword: true }]);
        setNStaff({ first: "", last: "", role: "Staff", pin: "", phone: "", email: "", homes: [] });
        setModal(null);
      }, disabled: !nStaff.first || !nStaff.last || nStaff.pin.length !== 4 || nStaff.homes.length === 0 }, "Add Staff"))));
    }
    if (modal === "editStaff" && editStaff) {
      const es = editStaff;
      const rl = ROLES[es.role] || ROLES["Staff"];
      return /* @__PURE__ */ React.createElement(Modal, { title: "Edit: " + (es.first || "") + " " + (es.last || ""), onClose: () => {
        setEditStaff(null);
        setModal(null);
      }, wide: true }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "First", value: es.first || "", onChange: (v) => setEditStaff((p) => ({ ...p, first: v, name: (p.last || "") + ", " + v })) })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Last", value: es.last || "", onChange: (v) => setEditStaff((p) => ({ ...p, last: v, name: v + ", " + (p.first || "") })) }))), /* @__PURE__ */ React.createElement(Inp, { label: "Phone", value: es.phone || "", onChange: (v) => setEditStaff((p) => ({ ...p, phone: v })) }), /* @__PURE__ */ React.createElement(Inp, { label: "Email", value: es.email || "", onChange: (v) => setEditStaff((p) => ({ ...p, email: v })) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 6px" } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 4 } }, "Role"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, ROLE_NAMES.filter((r) => r !== "System Admin" || es.role === "System Admin").map((r) => {
        const c = ROLES[r].color;
        return /* @__PURE__ */ React.createElement("button", { key: r, onClick: () => setEditStaff((p) => ({ ...p, role: r })), style: { padding: "5px 10px", borderRadius: 8, border: "2px solid " + (es.role === r ? c : C.sepL), background: es.role === r ? c + "12" : "transparent", color: es.role === r ? c : C.tx3, fontSize: 11, fontWeight: es.role === r ? 700 : 500, cursor: "pointer", fontFamily: C.font } }, r);
      }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Password", value: es.password || "", onChange: (v) => setEditStaff((p) => ({ ...p, password: v })) })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", alignItems: "flex-end", paddingBottom: 8 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, sm: true, v: "outline", color: C.org, onClick: () => {
        const np = "reset" + Math.floor(1e3 + Math.random() * 9e3);
        setEditStaff((p) => ({ ...p, password: np, tempPassword: true }));
        alert("Temporary password: " + np + "\n\nGive this to the staff member. They will set their own password on next login.");
      } }, "Reset Password"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 6px" } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 4 } }, "Homes"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, HOMES.map((h) => {
        const on = (es.homes || []).includes(h.id);
        return /* @__PURE__ */ React.createElement("button", { key: h.id, onClick: () => setEditStaff((p) => ({ ...p, homes: on ? (p.homes || []).filter((x) => x !== h.id) : [...p.homes || [], h.id] })), style: { flex: 1, padding: "8px", borderRadius: 10, border: "2px solid " + (on ? h.color : C.sepL), background: on ? h.color + "12" : "transparent", color: on ? h.color : C.tx3, fontSize: 12, fontWeight: on ? 700 : 500, cursor: "pointer", fontFamily: C.font } }, h.name);
      }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px 6px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.grn, onClick: () => {
        setStaff((p) => p.map((s) => s.id === es.id ? es : s));
        setEditStaff(null);
        setModal(null);
      } }, "Save"), /* @__PURE__ */ React.createElement(Btn, { full: true, v: "outline", color: C.red, onClick: () => {
        setStaff((p) => p.map((s) => s.id === es.id ? { ...s, on: !s.on } : s));
        setEditStaff(null);
        setModal(null);
      } }, es.on ? "Deactivate" : "Activate")))));
    }
    if (modal === "addRes") {
      const nr = newRes;
      const resetNR = () => setNewRes({ first: "", last: "", name: "", dob: "", home: "SCH", uci: "", admDate: "", bgInfo: "", emergContact: { name: "", phone: "", relation: "" }, conservator: { name: "", phone: "", agency: "" }, rcCoordinator: { name: "", phone: "", agency: "" }, diagnosis: [], diagInput: "", allergies: [], allergyInput: { name: "", reaction: "", sev: "moderate" }, medChanges: [], sirs: [] });
      return /* @__PURE__ */ React.createElement(Modal, { title: "New Resident Intake", onClose: () => {
        resetNR();
        setModal(null);
      }, wide: true }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.blue } }, "Personal Information"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "First Name *", value: nr.first, onChange: (v) => setNewRes((p) => ({ ...p, first: v, name: (p.last || "") + ", " + v })), ph: "Jane" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Last Name *", value: nr.last, onChange: (v) => setNewRes((p) => ({ ...p, last: v, name: v + ", " + (p.first || "") })), ph: "Doe" }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Date of Birth *", value: nr.dob, onChange: (v) => setNewRes((p) => ({ ...p, dob: v })), type: "date" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "UCI # *", value: nr.uci, onChange: (v) => setNewRes((p) => ({ ...p, uci: v })), ph: "e.g., 4915732" }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Admission Date *", value: nr.admDate, onChange: (v) => setNewRes((p) => ({ ...p, admDate: v })), type: "date" }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 6px" } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 4 } }, "Home *"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, HOMES.map((h) => /* @__PURE__ */ React.createElement("button", { key: h.id, onClick: () => setNewRes((p) => ({ ...p, home: h.id })), style: { flex: 1, padding: "8px", borderRadius: 10, border: "2px solid " + (nr.home === h.id ? h.color : C.sepL), background: nr.home === h.id ? h.color + "12" : "transparent", color: nr.home === h.id ? h.color : C.tx3, fontSize: 12, fontWeight: nr.home === h.id ? 700 : 500, cursor: "pointer", fontFamily: C.font, textAlign: "center" } }, h.name)))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.blue, marginTop: 4, borderTop: "0.5px solid " + C.sepL, paddingTop: 8 } }, "Emergency Contact"), /* @__PURE__ */ React.createElement(Inp, { label: "Contact Name *", value: nr.emergContact.name, onChange: (v) => setNewRes((p) => ({ ...p, emergContact: { ...p.emergContact, name: v } })), ph: "Full name" }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Phone *", value: nr.emergContact.phone, onChange: (v) => setNewRes((p) => ({ ...p, emergContact: { ...p.emergContact, phone: v } })), ph: "209-555-0000" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Relation", value: nr.emergContact.relation, onChange: (v) => setNewRes((p) => ({ ...p, emergContact: { ...p.emergContact, relation: v } })), ph: "Mother, Father..." }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: "#5856d6", marginTop: 4, borderTop: "0.5px solid " + C.sepL, paddingTop: 8 } }, "Conservator ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 400, color: C.tx3 } }, "(optional)")), /* @__PURE__ */ React.createElement(Inp, { label: "Conservator Name", value: nr.conservator.name, onChange: (v) => setNewRes((p) => ({ ...p, conservator: { ...p.conservator, name: v } })), ph: "Full name or N/A" }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Phone", value: nr.conservator.phone, onChange: (v) => setNewRes((p) => ({ ...p, conservator: { ...p.conservator, phone: v } })), ph: "Phone number" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Agency", value: nr.conservator.agency, onChange: (v) => setNewRes((p) => ({ ...p, conservator: { ...p.conservator, agency: v } })), ph: "Agency name" }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.teal, marginTop: 4, borderTop: "0.5px solid " + C.sepL, paddingTop: 8 } }, "Regional Center Service Coordinator"), /* @__PURE__ */ React.createElement(Inp, { label: "Coordinator Name", value: nr.rcCoordinator.name, onChange: (v) => setNewRes((p) => ({ ...p, rcCoordinator: { ...p.rcCoordinator, name: v } })), ph: "e.g., Isabella Walsh" }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Phone", value: nr.rcCoordinator.phone, onChange: (v) => setNewRes((p) => ({ ...p, rcCoordinator: { ...p.rcCoordinator, phone: v } })), ph: "Phone number" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Regional Center", value: nr.rcCoordinator.agency, onChange: (v) => setNewRes((p) => ({ ...p, rcCoordinator: { ...p.rcCoordinator, agency: v } })), ph: "e.g., ACRC, VMRC" }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.org, marginTop: 4, borderTop: "0.5px solid " + C.sepL, paddingTop: 8 } }, "Background Information"), nr.dob && /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 6px", padding: "8px 10px", background: C.org + "06", borderRadius: 10, border: "1px solid " + C.org + "15" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12 } }, "\u{1F916}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: C.org } }, "AUTO-CALCULATED")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2 } }, /* @__PURE__ */ React.createElement("b", null, nr.first || "[First]", " ", nr.last || "[Last]"), " is a ", /* @__PURE__ */ React.createElement("b", null, getAge(nr.dob), "-year-old"), " individual born on ", (/* @__PURE__ */ new Date(nr.dob + "T12:00:00")).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), ". ", nr.diagnosis.length > 0 ? "Carries a diagnosis of " + nr.diagnosis.join(", ") + ". " : "", nr.admDate ? "Placed at " + (HOMES.find((h2) => h2.id === nr.home) || {}).full + " on " + (/* @__PURE__ */ new Date(nr.admDate + "T12:00:00")).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) + "." : ""), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.tx3, marginTop: 3, fontStyle: "italic" } }, "Age auto from DOB")), /* @__PURE__ */ React.createElement(Inp, { label: "Background (use [AGE] for auto-age)", value: nr.bgInfo, onChange: (v) => setNewRes((p) => ({ ...p, bgInfo: v })), multi: true, ph: "e.g., [Name] is a [AGE]-year-old male who carries a diagnosis of..." }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.blue, marginTop: 4, borderTop: "0.5px solid " + C.sepL, paddingTop: 8 } }, "Diagnosis"), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, nr.diagnosis.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 } }, nr.diagnosis.map((d, i) => /* @__PURE__ */ React.createElement("span", { key: i, style: { display: "flex", alignItems: "center", gap: 3, fontSize: 11, padding: "3px 8px", borderRadius: 6, background: C.ind + "10", color: C.ind, fontWeight: 500 } }, d, /* @__PURE__ */ React.createElement("button", { onClick: () => setNewRes((p) => ({ ...p, diagnosis: p.diagnosis.filter((_, j) => j !== i) })), style: { background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 11, padding: 0 } }, "\u2717")))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement("input", { value: nr.diagInput || "", onChange: (e) => setNewRes((p) => ({ ...p, diagInput: e.target.value })), onKeyDown: (e) => {
        if (e.key === "Enter" && nr.diagInput) {
          setNewRes((p) => ({ ...p, diagnosis: [...p.diagnosis, p.diagInput], diagInput: "" }));
        }
      }, placeholder: "Type diagnosis, press Enter...", style: { flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 13, fontFamily: C.font } }), /* @__PURE__ */ React.createElement(Btn, { sm: true, color: C.ind, onClick: () => {
        if (nr.diagInput) setNewRes((p) => ({ ...p, diagnosis: [...p.diagnosis, p.diagInput], diagInput: "" }));
      } }, "+"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.blue, marginTop: 8, borderTop: "0.5px solid " + C.sepL, paddingTop: 8 } }, "Allergies"), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, nr.allergies.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 6 } }, nr.allergies.map((a, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 4, marginBottom: 3 } }, /* @__PURE__ */ React.createElement(Pill, { text: a.name + " (" + a.sev + ")", cl: a.sev === "severe" ? C.red : C.org }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, a.reaction), /* @__PURE__ */ React.createElement("button", { onClick: () => setNewRes((p) => ({ ...p, allergies: p.allergies.filter((_, j) => j !== i) })), style: { background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 11 } }, "\u2717")))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("input", { value: nr.allergyInput.name, onChange: (e) => setNewRes((p) => ({ ...p, allergyInput: { ...p.allergyInput, name: e.target.value } })), placeholder: "Allergy name", style: { flex: 2, minWidth: 80, padding: "7px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } }), /* @__PURE__ */ React.createElement("input", { value: nr.allergyInput.reaction, onChange: (e) => setNewRes((p) => ({ ...p, allergyInput: { ...p.allergyInput, reaction: e.target.value } })), placeholder: "Reaction", style: { flex: 2, minWidth: 70, padding: "7px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } }), /* @__PURE__ */ React.createElement("select", { value: nr.allergyInput.sev, onChange: (e) => setNewRes((p) => ({ ...p, allergyInput: { ...p.allergyInput, sev: e.target.value } })), style: { flex: 1, minWidth: 65, padding: "7px 4px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 11, fontFamily: C.font } }, /* @__PURE__ */ React.createElement("option", { value: "mild" }, "Mild"), /* @__PURE__ */ React.createElement("option", { value: "moderate" }, "Moderate"), /* @__PURE__ */ React.createElement("option", { value: "severe" }, "Severe")), /* @__PURE__ */ React.createElement(Btn, { sm: true, color: C.org, onClick: () => {
        if (nr.allergyInput.name) setNewRes((p) => ({ ...p, allergies: [...p.allergies, { type: "medication", ...p.allergyInput }], allergyInput: { name: "", reaction: "", sev: "moderate" } }));
      } }, "+"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, onClick: () => {
        if (!nr.first || !nr.last || !nr.dob || !nr.uci || !nr.admDate) return;
        const id = "r" + Date.now();
        const name = nr.last + ", " + nr.first;
        setResidents((p) => [...p, { id, first: nr.first, last: nr.last, name, dob: nr.dob, home: nr.home, uci: nr.uci, admDate: nr.admDate, bgInfo: nr.bgInfo, emergContact: nr.emergContact, conservator: nr.conservator, rcCoordinator: nr.rcCoordinator, diagnosis: nr.diagnosis, allergies: nr.allergies, medChanges: [], sirs: [], doctors: [] }]);
        SKILLS_BY_RES[id] = [];
        resetNR();
        setModal(null);
      }, disabled: !nr.first || !nr.last || !nr.dob || !nr.uci || !nr.admDate }, "Add Resident"))));
    }
    if (modal === "editRes" && editRes) {
      const er = editRes;
      return /* @__PURE__ */ React.createElement(Modal, { title: "Edit: " + fullName(er.name), onClose: () => {
        setEditRes(null);
        setModal(null);
      }, wide: true }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Name (Last, First)", value: er.name, onChange: (v) => setEditRes((p) => ({ ...p, name: v })) }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Date of Birth", value: er.dob, onChange: (v) => setEditRes((p) => ({ ...p, dob: v })) })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "UCI #", value: er.uci || "", onChange: (v) => setEditRes((p) => ({ ...p, uci: v })) }))), /* @__PURE__ */ React.createElement(Inp, { label: "Admission Date", value: er.admDate || "", onChange: (v) => setEditRes((p) => ({ ...p, admDate: v })) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 4 } }, "Home"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, HOMES.map((h) => /* @__PURE__ */ React.createElement("button", { key: h.id, onClick: () => setEditRes((p) => ({ ...p, home: h.id })), style: { flex: 1, padding: "10px 8px", borderRadius: 10, border: "2px solid " + (er.home === h.id ? h.color : C.sepL), background: er.home === h.id ? h.color + "12" : "transparent", color: er.home === h.id ? h.color : C.tx3, fontSize: 13, fontWeight: er.home === h.id ? 700 : 500, cursor: "pointer", fontFamily: C.font, textAlign: "center" } }, h.name)))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.blue, borderTop: "0.5px solid " + C.sepL, paddingTop: 8 } }, "Emergency Contact"), /* @__PURE__ */ React.createElement(Inp, { label: "Name", value: (er.emergContact || {}).name || "", onChange: (v) => setEditRes((p) => ({ ...p, emergContact: { ...p.emergContact || {}, name: v } })), ph: "Full name" }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Phone", value: (er.emergContact || {}).phone || "", onChange: (v) => setEditRes((p) => ({ ...p, emergContact: { ...p.emergContact || {}, phone: v } })), ph: "Phone" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Relation", value: (er.emergContact || {}).relation || "", onChange: (v) => setEditRes((p) => ({ ...p, emergContact: { ...p.emergContact || {}, relation: v } })), ph: "Relation" }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: "#5856d6", borderTop: "0.5px solid " + C.sepL, paddingTop: 8 } }, "Conservator ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 400, color: C.tx3 } }, "(optional)")), /* @__PURE__ */ React.createElement(Inp, { label: "Name", value: (er.conservator || {}).name || "", onChange: (v) => setEditRes((p) => ({ ...p, conservator: { ...p.conservator || {}, name: v } })), ph: "Name or N/A" }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Phone", value: (er.conservator || {}).phone || "", onChange: (v) => setEditRes((p) => ({ ...p, conservator: { ...p.conservator || {}, phone: v } })), ph: "Phone" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Agency", value: (er.conservator || {}).agency || "", onChange: (v) => setEditRes((p) => ({ ...p, conservator: { ...p.conservator || {}, agency: v } })), ph: "Agency" }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.teal, borderTop: "0.5px solid " + C.sepL, paddingTop: 8 } }, "RC Service Coordinator"), /* @__PURE__ */ React.createElement(Inp, { label: "Name", value: (er.rcCoordinator || {}).name || "", onChange: (v) => setEditRes((p) => ({ ...p, rcCoordinator: { ...p.rcCoordinator || {}, name: v } })), ph: "Coordinator name" }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Phone", value: (er.rcCoordinator || {}).phone || "", onChange: (v) => setEditRes((p) => ({ ...p, rcCoordinator: { ...p.rcCoordinator || {}, phone: v } })), ph: "Phone" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Regional Center", value: (er.rcCoordinator || {}).agency || "", onChange: (v) => setEditRes((p) => ({ ...p, rcCoordinator: { ...p.rcCoordinator || {}, agency: v } })), ph: "e.g., ACRC" }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 4px", fontSize: 12, fontWeight: 600, color: C.org, borderTop: "0.5px solid " + C.sepL, paddingTop: 8 } }, "Background Information"), er.dob && /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 4px", padding: "6px 10px", background: C.org + "06", borderRadius: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2 } }, /* @__PURE__ */ React.createElement("b", null, "Age: ", getAge(er.dob)), " (auto from DOB)")), /* @__PURE__ */ React.createElement(Inp, { label: "Background (use [AGE] for auto-age)", value: er.bgInfo || "", onChange: (v) => setEditRes((p) => ({ ...p, bgInfo: v })), multi: true, ph: "Custom background narrative..." }), /* @__PURE__ */ React.createElement(Sec, { title: "Allergies (" + er.allergies.length + ")" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, er.allergies.map((a, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 } }, /* @__PURE__ */ React.createElement(Pill, { text: a.name + " (" + a.sev + ")", cl: a.sev === "severe" ? C.red : C.org }), /* @__PURE__ */ React.createElement("button", { onClick: () => setEditRes((p) => ({ ...p, allergies: p.allergies.filter((_, j) => j !== i) })), style: { background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: 12 } }, "\u2717"))), /* @__PURE__ */ React.createElement("button", { onClick: () => {
        const name = prompt("Allergy name:");
        const reaction = prompt("Reaction:");
        const sev = prompt("Severity (mild/moderate/severe):");
        if (name) setEditRes((p) => ({ ...p, allergies: [...p.allergies, { type: "medication", name, reaction: reaction || "", sev: sev || "moderate" }] }));
      }, style: { padding: "6px 10px", borderRadius: 8, border: "1px dashed " + C.sepL, background: "none", color: C.blue, fontSize: 12, cursor: "pointer", fontFamily: C.font, width: "100%" } }, "+ Add Allergy")), /* @__PURE__ */ React.createElement(Sec, { title: "Medical Changes (" + er.medChanges.length + ")" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
        const type = prompt("Type (e.g. ER Visit, Dose Change):");
        const note = prompt("Notes:");
        const sev = prompt("Severity (high/moderate/low):");
        if (type) {
          setEditRes((p) => ({ ...p, medChanges: [{ d: today, type, note: note || "", sev: sev || "moderate" }, ...p.medChanges] }));
          sendTeamsAlert(editRes.home, "medChange", "Medical Change: " + type + " \u2014 " + fullName(editRes.name), (note || "No details") + " | Severity: " + (sev || "moderate") + " | By: " + gn(user.id));
        }
      }, style: { padding: "6px 10px", borderRadius: 8, border: "1px dashed " + C.sepL, background: "none", color: C.blue, fontSize: 12, cursor: "pointer", fontFamily: C.font, width: "100%" } }, "+ Add Medical Change")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.grn, onClick: () => {
        setResidents((p) => p.map((r) => r.id === er.id ? er : r));
        setEditRes(null);
        setModal(null);
      } }, "Save Changes"), /* @__PURE__ */ React.createElement(Btn, { full: true, v: "outline", color: C.red, onClick: () => {
        if (confirm("Remove " + fullName(er.name) + "?")) {
          setResidents((p) => p.filter((r) => r.id !== er.id));
          setEditRes(null);
          setModal(null);
        }
      } }, "Remove")))));
    }
    if (modal && modal.startsWith("sk_")) {
      const sk = (SKILLS_BY_RES[selRes] || [])[parseInt(modal.split("_")[1])];
      if (!sk) return null;
      return /* @__PURE__ */ React.createElement(Modal, { title: sk.name, onClose: () => setModal(null) }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", paddingTop: 6 } }, /* @__PURE__ */ React.createElement(Card, null, sk.steps.map((st, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderBottom: i < sk.steps.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, flex: 1 } }, st), /* @__PURE__ */ React.createElement("select", { style: { fontSize: 10, padding: 3, borderRadius: 6, border: "1px solid " + C.sepL, fontFamily: C.font, maxWidth: 90 } }, PROMPTS.map((p) => /* @__PURE__ */ React.createElement("option", { key: p }, p)))))), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 0" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.teal }, "Save"))));
    }
    if (modal === "memos") {
      return /* @__PURE__ */ React.createElement(Modal, { title: "Memos", onClose: () => setModal(null), wide: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", paddingTop: 8 } }, memos.map((m, i) => {
        const acked = m.acks.includes(user.id);
        return /* @__PURE__ */ React.createElement(Card, { key: m.id, style: { marginBottom: 8, border: !acked ? "1.5px solid " + C.red + "40" : "1px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 12px" } }, !acked && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: 4, background: C.red, animation: "memoFlash 1s ease-in-out infinite alternate" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: C.red } }, "REQUIRES ACKNOWLEDGMENT")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: C.tx, lineHeight: 1.5, marginBottom: 6 } }, m.text), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, marginBottom: 6 } }, "Posted ", m.d, " by ", gn(m.by)), m.acks.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3, fontWeight: 600 } }, "Acknowledged (", m.acks.length, "): "), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.grn } }, m.acks.map((a) => staffInit(gn(a))).join(", "))), (isAM || isS) && (() => {
          var tStaff = staff.filter((s2) => s2.on && s2.role === "Staff" && (!m.homeIds || m.homeIds.length === 0 || (s2.homes || []).some((h) => m.homeIds.includes(h))));
          var notAck = tStaff.filter((s2) => !m.acks.includes(s2.id));
          return notAck.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 6, padding: "4px 8px", background: C.red + "06", borderRadius: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.red, fontWeight: 700 } }, "Not yet read (", notAck.length, "): "), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.red } }, notAck.map((s2) => s2.first + " " + s2.last[0]).join(", "))) : /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.grn, fontWeight: 600 } }, "All staff have acknowledged"));
        })(), !acked ? /* @__PURE__ */ React.createElement(Btn, { full: true, sm: true, color: C.grn, onClick: () => setMemos((p) => p.map((x) => x.id === m.id ? { ...x, acks: [...x.acks, user.id] } : x)) }, "Acknowledge") : /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement(Pill, { text: "Acknowledged \u2713", cl: C.grn }))));
      })));
    }
    if (modal === "changePw") {
      return /* @__PURE__ */ React.createElement(Modal, { title: "Change Password", onClose: () => setModal(null) }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Current Password *", value: pin, onChange: setPin, ph: "Enter current password" }), /* @__PURE__ */ React.createElement(Inp, { label: "New Password *", value: loginPass, onChange: setLoginPass, ph: "Enter new password (min 6 chars)" }), /* @__PURE__ */ React.createElement(Inp, { label: "Confirm New Password *", value: loginEmail, onChange: setLoginEmail, ph: "Confirm new password" }), pinErr && /* @__PURE__ */ React.createElement("div", { style: { color: C.red, fontSize: 12, textAlign: "center", padding: "0 14px", marginBottom: 8 } }, pinErr), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.grn, onClick: () => {
        if (pin !== user.password) {
          setPinErr("Current password is incorrect");
          return;
        }
        if (!loginPass || loginPass.length < 6) {
          setPinErr("New password must be at least 6 characters");
          return;
        }
        if (loginPass !== loginEmail) {
          setPinErr("Passwords do not match");
          return;
        }
        setStaff((p) => p.map((s) => s.id === user.id ? { ...s, password: loginPass } : s));
        setUser({ ...user, password: loginPass });
        setPin("");
        setLoginPass("");
        setLoginEmail("");
        setPinErr("");
        alert("Password changed successfully!");
        setModal(null);
      } }, "Update Password"))));
    }
    if (modal === "newMemo") {
      const memoHomes = isA ? HOMES : HOMES.filter((h) => (user.homes || []).includes(h.id));
      const MEMO_TYPES = [{ id: "staff", label: "Staff Related", icon: "\u{1F465}", color: C.blue }, { id: "medication", label: "Medication", icon: "\u{1F48A}", color: C.grn }, { id: "house", label: "House Related", icon: "\u{1F3E0}", color: C.org }, { id: "resident", label: "Resident Related", icon: "\u{1F464}", color: C.pur }, { id: "other", label: "Other", icon: "\u{1F4CC}", color: C.tx3 }];
      return /* @__PURE__ */ React.createElement(Modal, { title: "New Memo", onClose: () => {
        setMemoForm({ text: "", type: "other", homeIds: [], urgent: true });
        setModal(null);
      }, wide: true }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: C.tx3, marginBottom: 4 } }, "MEMO TYPE"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, MEMO_TYPES.map((mt) => /* @__PURE__ */ React.createElement("button", { key: mt.id, onClick: () => setMemoForm((p) => ({ ...p, type: mt.id })), style: { padding: "6px 12px", borderRadius: 8, border: "1.5px solid " + (memoForm.type === mt.id ? mt.color : C.sepL), background: memoForm.type === mt.id ? mt.color + "12" : "transparent", color: memoForm.type === mt.id ? mt.color : C.tx3, fontSize: 11, fontWeight: memoForm.type === mt.id ? 700 : 500, cursor: "pointer", fontFamily: C.font } }, mt.icon, " ", mt.label)))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: C.tx3, marginBottom: 4 } }, "SEND TO"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setMemoForm((p) => ({ ...p, homeIds: p.homeIds.length === memoHomes.length ? [] : memoHomes.map((h) => h.id) })), style: { padding: "6px 12px", borderRadius: 8, border: "1.5px solid " + (memoForm.homeIds.length === memoHomes.length ? C.blue : C.sepL), background: memoForm.homeIds.length === memoHomes.length ? C.blue + "12" : "transparent", color: memoForm.homeIds.length === memoHomes.length ? C.blue : C.tx3, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: C.font } }, "All Homes"), memoHomes.map((h) => {
        var sel = memoForm.homeIds.includes(h.id);
        return /* @__PURE__ */ React.createElement("button", { key: h.id, onClick: () => setMemoForm((p) => ({ ...p, homeIds: sel ? p.homeIds.filter((x) => x !== h.id) : [...p.homeIds, h.id] })), style: { padding: "6px 12px", borderRadius: 8, border: "1.5px solid " + (sel ? h.color : C.sepL), background: sel ? h.color + "12" : "transparent", color: sel ? h.color : C.tx3, fontSize: 11, fontWeight: sel ? 700 : 500, cursor: "pointer", fontFamily: C.font } }, h.name);
      }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setMemoForm((p) => ({ ...p, urgent: !p.urgent })), style: { padding: "6px 12px", borderRadius: 8, border: "1.5px solid " + (memoForm.urgent ? C.red : C.sepL), background: memoForm.urgent ? C.red + "12" : "transparent", color: memoForm.urgent ? C.red : C.tx3, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: C.font } }, memoForm.urgent ? "\u2713 " : "", "Urgent (staff must acknowledge)")), /* @__PURE__ */ React.createElement(Inp, { label: "Memo Text *", value: memoForm.text, onChange: (v) => setMemoForm((p) => ({ ...p, text: v })), multi: true, ph: "Write your memo..." }), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, onClick: () => {
        if (!memoForm.text.trim()) return;
        var typeIcon = (MEMO_TYPES.find((mt) => mt.id === memoForm.type) || {}).icon || "";
        var targetHomes = memoForm.homeIds.length > 0 ? memoForm.homeIds : memoHomes.map((h) => h.id);
        setMemos((p) => [{ id: "mm" + Date.now(), text: typeIcon + " " + memoForm.text.trim(), by: user.id, d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), acks: [user.id], urgent: memoForm.urgent, memoType: memoForm.type, homeIds: targetHomes }, ...p]);
        targetHomes.forEach((hid) => sendTeamsAlert(hid, "memo", "Memo from " + gn(user.id), memoForm.text.trim().slice(0, 200)));
        setMemoForm({ text: "", type: "other", homeIds: [], urgent: true });
        setModal("memos");
      }, disabled: !memoForm.text.trim() }, "Post Memo"))));
    }
    if (modal === "aptEdit" && viewApt) {
      const a = viewApt;
      const ea = editApt || a;
      const setEa = (fn) => setEditApt(typeof fn === "function" ? fn(editApt || a) : fn);
      return /* @__PURE__ */ React.createElement(Modal, { title: "Edit Appointment", onClose: () => setModal("aptView"), wide: true }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement(Inp, { label: "Title", value: ea.title, onChange: (v) => setEa((p) => ({ ...p, title: v })) }), /* @__PURE__ */ React.createElement(Inp, { label: "Doctor / Provider", value: ea.doctor, onChange: (v) => setEa((p) => ({ ...p, doctor: v })) }), /* @__PURE__ */ React.createElement(Inp, { label: "Location", value: ea.location, onChange: (v) => setEa((p) => ({ ...p, location: v })) }), /* @__PURE__ */ React.createElement(Inp, { label: "Date", value: ea.date, onChange: (v) => setEa((p) => ({ ...p, date: v })), type: "date" }), /* @__PURE__ */ React.createElement(Inp, { label: "Time", value: ea.time, onChange: (v) => setEa((p) => ({ ...p, time: v })), type: "time" }), /* @__PURE__ */ React.createElement(Inp, { label: "Duration", value: ea.duration, onChange: (v) => setEa((p) => ({ ...p, duration: v })) }), /* @__PURE__ */ React.createElement(Inp, { label: "Type", value: ea.type, onChange: (v) => setEa((p) => ({ ...p, type: v })), opts: ["Specialist", "Dental", "Behavioral", "Lab", "Primary Care", "Other"] }), /* @__PURE__ */ React.createElement(Inp, { label: "Status", value: ea.status, onChange: (v) => setEa((p) => ({ ...p, status: v })), opts: ["scheduled", "confirmed", "cancelled"] }), /* @__PURE__ */ React.createElement(Inp, { label: "Notes", value: ea.notes, onChange: (v) => setEa((p) => ({ ...p, notes: v })), multi: true }), /* @__PURE__ */ React.createElement(Inp, { label: "Visit Frequency", value: ea.visitFreq || "", onChange: (v) => setEa((p) => ({ ...p, visitFreq: v })), ph: "e.g., Every 3 months, Annually" }), /* @__PURE__ */ React.createElement(Inp, { label: "Last Visit Date", value: ea.lastVisit || "", onChange: (v) => setEa((p) => ({ ...p, lastVisit: v })), ph: "YYYY-MM-DD" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, onClick: () => {
        const isNewApt = !appointments.find((x) => x.id === a.id);
        let finalApt = { ...ea };
        if (!finalApt.visitFreq && finalApt.type) {
          const aiFreq = aiVisitFreq(finalApt.type);
          if (aiFreq) finalApt.visitFreq = aiFreq;
        }
        if (!finalApt.lastVisit && finalApt.doctor) {
          const lv = getLastVisit(finalApt.resId || selRes, finalApt.doctor);
          if (lv) finalApt.lastVisit = lv;
        }
        if (isNewApt) setAppointments((p) => [...p, finalApt]);
        else setAppointments((p) => p.map((x) => x.id === a.id ? finalApt : x));
        setViewApt(finalApt);
        setEditApt(null);
        setModal("aptView");
      } }, "Save Changes"))));
    }
    if (modal === "aptView" && viewApt) {
      const a = viewApt;
      const r = residents.find((x) => x.id === a.resId);
      const tc = a.type === "Specialist" ? C.pur : a.type === "Dental" ? C.teal : a.type === "Behavioral" ? C.org : C.blue;
      return /* @__PURE__ */ React.createElement(Modal, { title: "Appointment Details", onClose: () => {
        setModal(null);
        setViewApt(null);
      }, wide: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", paddingTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 48, height: 48, borderRadius: 12, background: tc + "12", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 700, color: tc } }, a.type === "Specialist" ? "\u{1FA7A}" : a.type === "Dental" ? "\u{1F9B7}" : a.type === "Behavioral" ? "\u{1F9E0}" : "\u{1F9EA}")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, fontWeight: 600 } }, a.title), /* @__PURE__ */ React.createElement(Pill, { text: a.type, cl: tc })), /* @__PURE__ */ React.createElement(Pill, { text: a.status === "confirmed" ? "\u2713 Confirmed" : "Scheduled", cl: a.status === "confirmed" ? C.grn : C.org })), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600, textTransform: "uppercase" } }, "Resident"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500 } }, r ? r.name : "\u2014")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600, textTransform: "uppercase" } }, "Date"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500 } }, a.date)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600, textTransform: "uppercase" } }, "Time"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500 } }, a.time)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600, textTransform: "uppercase" } }, "Duration"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500 } }, a.duration)), /* @__PURE__ */ React.createElement("div", { style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600, textTransform: "uppercase" } }, "Provider"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500 } }, a.doctor)), /* @__PURE__ */ React.createElement("div", { style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600, textTransform: "uppercase" } }, "Location"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500 } }, a.location)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600, textTransform: "uppercase" } }, "Insurance"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500 } }, a.ins)))), a.notes && /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600, textTransform: "uppercase", marginBottom: 3 } }, "Notes / Instructions"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.tx2, lineHeight: 1.5 } }, a.notes)), (a.visitFreq || a.lastVisit) && /* @__PURE__ */ React.createElement(Card, { style: { marginTop: 8, padding: "10px 12px", background: C.teal + "04", border: "1px solid " + C.teal + "15" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.teal, textTransform: "uppercase", marginBottom: 4 } }, "Visit Schedule"), a.visitFreq && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 3 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: C.tx3 } }, "How Often"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: C.teal } }, a.visitFreq)), a.lastVisit && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: C.tx3 } }, "Last Visit"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: C.tx } }, a.lastVisit))), r && r.allergies.length > 0 && /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginTop: 8, border: "1px solid " + C.red + "20" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.red, fontWeight: 700, textTransform: "uppercase", marginBottom: 3 } }, "Allergies \u2014 Alert Provider"), r.allergies.map((al, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { fontSize: 12, color: C.tx2 } }, /* @__PURE__ */ React.createElement("b", { style: { color: al.sev === "severe" ? C.red : C.org } }, al.name), " \u2014 ", al.reaction, " (", al.sev, ")"))), /* @__PURE__ */ React.createElement(Card, { style: { padding: 12, marginTop: 8, border: "1.5px solid " + C.pk + "30", background: C.pk + "04" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 22, height: 22, borderRadius: 6, background: C.pk + "18", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12 } }, "\u{1F6A8}")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.pk } }, "Alert Note"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: C.tx3, fontStyle: "italic" } }, 'Auto-appears in "Changes Since Last Meeting"')), /* @__PURE__ */ React.createElement("textarea", { id: "apt-alert-" + a.id, placeholder: "Document important changes, new orders, medication adjustments, or anything the team should know...", rows: 3, style: { width: "100%", padding: 10, borderRadius: 10, border: "1.5px solid " + C.pk + "30", fontSize: 13, fontFamily: C.font, resize: "vertical", boxSizing: "border-box", background: "#fff" } }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, sm: true, color: C.pk, onClick: () => {
        const txt = document.getElementById("apt-alert-" + a.id)?.value || "";
        if (!txt.trim()) return;
        const alertNote = { id: "aa" + Date.now(), aptId: a.id, resId: a.resId, d: a.date || today, t: a.time || (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), by: user.id, text: txt.trim(), isAlert: true, aptTitle: a.title, doctor: a.doctor };
        setAptAlerts((p) => [alertNote, ...p]);
        setDocs((p) => [{ id: "d" + Date.now(), resId: a.resId, type: "Alert", d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), user: user.name, text: "\u{1F6A8} APT ALERT \u2014 " + a.title + " (" + a.doctor + "): " + txt.trim() }, ...p]);
        setAppointments((p) => p.map((x) => x.id === a.id ? { ...x, notes: (x.notes || "") + "\n\u{1F6A8} ALERT: " + txt.trim() + " (" + today + " " + gn(user.id) + ")" } : x));
        setViewApt((prev) => ({ ...prev, notes: (prev.notes || "") + "\n\u{1F6A8} ALERT: " + txt.trim() }));
        const el = document.getElementById("apt-alert-" + a.id);
        if (el) el.value = "";
        if (r) sendTeamsAlert(r.home, "medChange", "Appointment Alert \u2014 " + a.title, txt.trim().slice(0, 200) + " | " + a.doctor + " | " + gn(user.id));
      } }, "\u{1F6A8}", " Save Alert Note")), aptAlerts.filter((al) => al.aptId === a.id).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, borderTop: "0.5px solid " + C.pk + "20", paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.pk, marginBottom: 4 } }, "PREVIOUS ALERT NOTES"), aptAlerts.filter((al) => al.aptId === a.id).map((al) => /* @__PURE__ */ React.createElement("div", { key: al.id, style: { padding: "4px 0", borderBottom: "0.5px solid " + C.sepL, fontSize: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { color: C.tx2, lineHeight: 1.4 } }, al.text), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, al.d, " ", al.t, " \u2014 ", gn(al.by)))))), (cm || isS) && /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 0" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, v: "outline", color: tc, onClick: () => {
        setEditApt({ ...a });
        setModal("aptEdit");
      } }, "Edit Appointment"))));
    }
    if (modal === "behToday") {
      const todayB = tallies.filter((t) => t.d === today);
      return /* @__PURE__ */ React.createElement(Modal, { title: "Behaviors Today", onClose: () => setModal(null), wide: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", paddingTop: 6 } }, todayB.length === 0 ? /* @__PURE__ */ React.createElement(Card, { style: { padding: 16, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "No behaviors today")) : todayB.map((t, i) => {
        const bRes = residents.find((x) => x.id === (t.resId || "r1"));
        return /* @__PURE__ */ React.createElement(Card, { key: t.id, style: { marginBottom: 6, cursor: t.note ? "pointer" : "default" }, onClick: t.note ? () => {
          setBehView(t);
          setModal("behView");
        } : void 0 }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 40, height: 40, borderRadius: 10, background: C.red + "10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: C.red } }, bRes ? resInit(bRes.name) : "?"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, t.b, bRes ? " \u2014 " + fullName(bRes.name) : ""), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, t.t, " ", t.note ? "\u2014 " + t.note.text.slice(0, 50) + "..." : ""), t.note && t.note.location && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "\\uD83D\\uDCCD ", t.note.location)), t.note && /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 16, c: C.tx3 })));
      })));
    }
    if (modal === "prnDash") {
      const todayPrn = prnRecs.filter((p) => p.d === today);
      const allPrn = prnRecs.slice().reverse();
      const grouped = {};
      allPrn.forEach((p) => {
        if (!p) return;
        const rId = (meds.find((m) => m.id === p.medId) || {}).resId || "r1";
        if (!grouped[rId]) grouped[rId] = [];
        grouped[rId].push(p);
      });
      return /* @__PURE__ */ React.createElement(Modal, { title: "PRN Records (" + todayPrn.length + " today)", onClose: () => setModal(null), wide: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 14px" } }, todayPrn.length === 0 && allPrn.length === 0 && /* @__PURE__ */ React.createElement(Card, { style: { padding: 16, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "No PRN medications administered")), todayPrn.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Today \u2014 " + today }), todayPrn.map((rec) => {
        const rr = residents.find((x) => x.id === meds.find((m) => m.id === rec.medId)?.resId);
        return /* @__PURE__ */ React.createElement(Card, { key: rec.id, style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(Av, { name: rr ? rr.name : "?", s: 36, cl: C.blue }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, rec.medName, " ", /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 400, color: C.tx2 } }, rec.dose)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, rr ? fullName(rr.name) : "Unknown", " | ", rec.route, " | Given at ", rec.t))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, fontSize: 12, padding: "4px 8px", background: C.blue + "06", borderRadius: 6 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Reason:"), " ", rec.reason), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Given by:"), " ", gn(rec.by))), rec.followUp ? /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, fontSize: 12, padding: "4px 8px", background: C.grn + "06", borderRadius: 6 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.grn, fontWeight: 600 } }, "\u2713 Follow-Up Complete")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Results:"), " ", rec.followUp.result), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Checked at:"), " ", rec.followUp.t, " by ", gn(rec.followUp.by))) : /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, fontSize: 12, padding: "4px 8px", background: C.org + "06", borderRadius: 6, color: C.org, fontWeight: 600 } }, "\u23F3 Follow-up pending")));
      })), Object.keys(grouped).length > 0 && allPrn.length > todayPrn.length && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "All PRN History" }), Object.entries(grouped).map(([rId, recs]) => {
        const rr = residents.find((x) => x.id === rId);
        return /* @__PURE__ */ React.createElement("div", { key: rId, style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.blue, marginBottom: 4 } }, rr ? fullName(rr.name) : "Unknown", " (", recs.length, " PRNs)"), /* @__PURE__ */ React.createElement(Card, null, recs.slice(0, 10).map((rec, i, arr) => /* @__PURE__ */ React.createElement("div", { key: rec.id, style: { padding: "8px 12px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 6, height: 6, borderRadius: 3, background: rec.followUp ? C.grn : C.org } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, rec.medName, " ", rec.dose), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, rec.d, " at ", rec.t, " | By: ", gn(rec.by), " | ", rec.reason), rec.followUp && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.grn } }, "Results: ", rec.followUp.result, " (checked ", rec.followUp.t, ")"))))));
      }))));
    }
    if (modal === "prnGive" && prnForm.medId) {
      const m = meds.find((x) => x.id === prnForm.medId);
      if (!m) return null;
      const nowTime = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      const nowDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      return /* @__PURE__ */ React.createElement(Modal, { title: "Administer PRN Medication", onClose: () => {
        setModal(null);
        setPrnForm({ medId: null, reason: "" });
      }, wide: true }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px", display: "flex", justifyContent: "center", padding: 12, background: C.blue + "04", borderRadius: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement(PillVisual, { pill: m.pill, size: 55 })), /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px", padding: "10px 12px", background: C.card, borderRadius: 10, border: "1px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600 } }, "MEDICATION"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, m.name)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600 } }, "DOSAGE"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, m.dose)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600 } }, "ROUTE"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, m.route)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600 } }, "DATE & TIME"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, nowDate, /* @__PURE__ */ React.createElement("br", null), nowTime))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, padding: "4px 0", borderTop: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600 } }, "INSTRUCTIONS"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2 } }, m.instr)), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600 } }, "STAFF"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, user.name, " (", staffInit(user.name), ")"))), /* @__PURE__ */ React.createElement(Inp, { label: "Reason for giving PRN *", value: prnForm.reason, onChange: (v) => setPrnForm((p) => ({ ...p, reason: v })), multi: true, ph: "e.g., Headache, pain level 6/10, patient requesting..." }), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.blue, onClick: () => {
        if (!prnForm.reason) return;
        const id = "prn" + Date.now();
        const rec = { id, medId: m.id, medName: m.name, dose: m.dose, route: m.route, reason: prnForm.reason, d: today, t: nowTime, by: user.id, followUp: null };
        setPrnRecs((p) => [...p, rec]);
        setPrnFollowUps((p) => [...p, { prnId: id, dueAt: Date.now() + 15e3, by: user.id, dismissed: false }]);
        const prnRes = residents.find((x) => x.id === m.resId);
        const prnMemo = { id: "me" + Date.now(), d: today, t: nowTime, by: user.id, text: "\u{1F48A} PRN GIVEN: " + m.name + " " + m.dose + " \u2014 " + (prnRes ? fullName(prnRes.name) : "?") + "\nReason: " + prnForm.reason + "\nStaff: " + gn(user.id) + " at " + nowTime, acks: [user.id], urgent: true };
        setMemos((p) => [prnMemo, ...p]);
        if (prnRes) sendTeamsAlert(prnRes.home, "medChange", "PRN Given: " + m.name + " " + m.dose, (prnRes ? fullName(prnRes.name) : "") + " | Reason: " + prnForm.reason + " | Staff: " + gn(user.id));
        setPrnForm({ medId: null, reason: "" });
        setModal(null);
      }, disabled: !prnForm.reason }, "Administer")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 10px", background: C.org + "06", borderRadius: 8, borderLeft: "3px solid " + C.org } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.org, fontWeight: 600 } }, "Follow-up alert in ~15 seconds (demo) \u2014 1 hour in production")))));
    }
    if (modal === "adminOvr") {
      const nowTime = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      const staffOpts = staff.filter((s2) => s2.on && s2.role === "Staff" && (isA || (s2.homes || []).some((h) => (user.homes || []).includes(h))));
      const selStaff = staff.find((s2) => s2.id === adminOvr.staffId);
      const ovrMed = adminOvr.med;
      const ovrPrnRec = adminOvr.prnRecId ? prnRecs.find((r2) => r2.id === adminOvr.prnRecId) : null;
      const timePassed = ovrMed && ovrMed.times && ovrMed.times.length > 0 ? ovrMed.times.every((t) => {
        const h2 = parseInt(t);
        return Math.abs(hr - h2) > 2;
      }) : false;
      const typeLabel = adminOvr.type === "mar" ? "Record Medication Given" : adminOvr.type === "prn" ? "Record PRN Given" : "Record PRN Follow-Up";
      return /* @__PURE__ */ React.createElement(Modal, { title: typeLabel, onClose: () => {
        setAdminOvr({ type: null, med: null, staffId: "", prnReason: "", followResult: "", prnRecId: null, confirmed: false });
        setModal(null);
      } }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, ovrMed && /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px", padding: "10px 12px", background: C.blue + "06", borderRadius: 10, border: "1px solid " + C.blue + "20" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3, fontSize: 10 } }, "MEDICATION"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600 } }, ovrMed.name)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3, fontSize: 10 } }, "DOSE"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600 } }, ovrMed.dose)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3, fontSize: 10 } }, "ROUTE"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600 } }, ovrMed.route)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3, fontSize: 10 } }, "FREQUENCY"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600 } }, ovrMed.freq)), ovrMed.times && ovrMed.times.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3, fontSize: 10 } }, "SCHEDULED"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600 } }, ovrMed.times.join(", "))))), ovrPrnRec && /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px", padding: "10px 12px", background: C.red + "06", borderRadius: 10, border: "1px solid " + C.red + "20" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 4 } }, "PRN Follow-Up"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Med:"), " ", /* @__PURE__ */ React.createElement("b", null, ovrPrnRec.medName, " ", ovrPrnRec.dose)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Given:"), " ", /* @__PURE__ */ React.createElement("b", null, ovrPrnRec.t, " on ", ovrPrnRec.d)), /* @__PURE__ */ React.createElement("div", { style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Reason:"), " ", /* @__PURE__ */ React.createElement("b", null, ovrPrnRec.reason)))), adminOvr.type === "mar" && timePassed && /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px", padding: "10px 12px", background: C.org + "08", borderRadius: 10, border: "1.5px solid " + C.org } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.org, marginBottom: 4 } }, "\u26A0", " Medication Time Has Passed"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2 } }, "The scheduled time for this medication has passed. Are you sure you want to document this as given?"), /* @__PURE__ */ React.createElement("button", { onClick: () => setAdminOvr((p) => ({ ...p, confirmed: true })), style: { marginTop: 8, padding: "6px 16px", borderRadius: 8, border: "1.5px solid " + C.org, background: adminOvr.confirmed ? C.org : "transparent", color: adminOvr.confirmed ? "#fff" : C.org, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, adminOvr.confirmed ? "\u2713 Confirmed" : "Yes, document this medication")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 9 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 3 } }, "Staff Member Who Gave Medication *"), /* @__PURE__ */ React.createElement("select", { value: adminOvr.staffId, onChange: (e) => setAdminOvr((p) => ({ ...p, staffId: e.target.value })), style: { width: "100%", padding: "9px 11px", borderRadius: 10, border: "1px solid " + C.sepL, background: C.card, fontSize: 15, fontFamily: C.font, color: C.tx } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Select staff..."), staffOpts.map((s2) => /* @__PURE__ */ React.createElement("option", { key: s2.id, value: s2.id }, s2.first, " ", s2.last, " (", staffInit(gn(s2.id)), ")")))), adminOvr.type === "mar" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 9 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 3 } }, "Number of Tablets / Capsules Given *"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, ["1", "2", "3", "4"].map((n) => /* @__PURE__ */ React.createElement("button", { key: n, onClick: () => setAdminOvr((p) => ({ ...p, qty: n })), style: { width: 40, height: 40, borderRadius: 10, border: "2px solid " + (adminOvr.qty === n ? C.blue : C.sepL), background: adminOvr.qty === n ? C.blue + "12" : "transparent", color: adminOvr.qty === n ? C.blue : C.tx3, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: C.font } }, n)), /* @__PURE__ */ React.createElement("input", { type: "number", value: adminOvr.qty || "1", onChange: (e) => setAdminOvr((p) => ({ ...p, qty: e.target.value })), min: "1", max: "20", style: { width: 60, padding: "8px", borderRadius: 10, border: "1.5px solid " + C.sepL, fontSize: 16, fontWeight: 700, textAlign: "center", fontFamily: C.font } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.tx3 } }, "tab/cap"))), selStaff && /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px", padding: "8px 12px", background: C.grn + "06", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12 } }, "Will appear as: ", /* @__PURE__ */ React.createElement("b", { style: { color: C.grn } }, staffInit(gn(selStaff.id))), " \u2014 ", selStaff.first, " ", selStaff.last)), adminOvr.type === "prn" && /* @__PURE__ */ React.createElement(Inp, { label: "Reason for giving PRN *", value: adminOvr.prnReason, onChange: (v) => setAdminOvr((p) => ({ ...p, prnReason: v })), multi: true, ph: "e.g., Headache, pain level 6/10, patient requesting..." }), adminOvr.type === "prnFollow" && /* @__PURE__ */ React.createElement(Inp, { label: "Follow-Up Results *", value: adminOvr.followResult, onChange: (v) => setAdminOvr((p) => ({ ...p, followResult: v })), multi: true, ph: "e.g., Pain reduced to 3/10, patient resting comfortably..." }), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: adminOvr.type === "prnFollow" ? C.grn : C.blue, onClick: () => {
        if (!adminOvr.staffId) return;
        if (adminOvr.type === "mar" && timePassed && !adminOvr.confirmed) return;
        if (adminOvr.type === "mar") {
          setMarRecs((p) => [...p, { med: ovrMed.name, d: today, t: nowTime, sTime: adminOvr.sTime || "", by: adminOvr.staffId, qty: parseInt(adminOvr.qty) || 1 }]);
        } else if (adminOvr.type === "prn") {
          if (!adminOvr.prnReason) return;
          const id = "prn" + Date.now();
          setPrnRecs((p) => [...p, { id, medId: ovrMed.id, medName: ovrMed.name, dose: ovrMed.dose, route: ovrMed.route, reason: adminOvr.prnReason, d: today, t: nowTime, by: adminOvr.staffId, followUp: null }]);
          setPrnFollowUps((p) => [...p, { prnId: id, dueAt: Date.now() + 15e3, by: adminOvr.staffId, dismissed: false }]);
          const prnRes2 = residents.find((x) => x.id === ovrMed.resId);
          const prnMemo2 = { id: "me" + Date.now(), d: today, t: nowTime, by: user.id, text: "\u{1F48A} PRN GIVEN: " + ovrMed.name + " " + ovrMed.dose + " \u2014 " + (prnRes2 ? fullName(prnRes2.name) : "?") + "\nReason: " + adminOvr.prnReason + "\nStaff: " + gn(adminOvr.staffId) + " | Recorded by: " + gn(user.id), acks: [user.id], urgent: true };
          setMemos((p) => [prnMemo2, ...p]);
          if (prnRes2) sendTeamsAlert(prnRes2.home, "medChange", "PRN Given: " + ovrMed.name + " " + ovrMed.dose, (prnRes2 ? fullName(prnRes2.name) : "") + " | Reason: " + adminOvr.prnReason + " | Staff: " + gn(adminOvr.staffId));
        } else if (adminOvr.type === "prnFollow") {
          if (!adminOvr.followResult) return;
          const fuRec = prnRecs.find((r2) => r2.id === adminOvr.prnRecId);
          setPrnRecs((p) => p.map((r2) => r2.id === adminOvr.prnRecId ? { ...r2, followUp: { result: adminOvr.followResult, t: nowTime, by: adminOvr.staffId } } : r2));
          setPrnFollowUps((p) => p.map((f) => f.prnId === adminOvr.prnRecId ? { ...f, dismissed: true } : f));
          if (fuRec) {
            const fuRes = residents.find((x) => x.id === (meds.find((mx) => mx.id === fuRec.medId) || {}).resId);
            const fuMemo = { id: "me" + Date.now(), d: today, t: nowTime, by: user.id, text: "\u{1F48A} PRN FOLLOW-UP: " + fuRec.medName + " " + fuRec.dose + " \u2014 " + (fuRes ? fullName(fuRes.name) : "?") + "\nResult: " + adminOvr.followResult + "\nStaff: " + gn(adminOvr.staffId || user.id), acks: [user.id], urgent: false };
            setMemos((p) => [fuMemo, ...p]);
          }
        }
        setAdminOvr({ type: null, med: null, staffId: "", prnReason: "", followResult: "", prnRecId: null, confirmed: false });
        setModal(null);
      }, disabled: !adminOvr.staffId || adminOvr.type === "mar" && timePassed && !adminOvr.confirmed || adminOvr.type === "prn" && !adminOvr.prnReason || adminOvr.type === "prnFollow" && !adminOvr.followResult }, "Document ", adminOvr.type === "mar" ? "Medication Given" : adminOvr.type === "prn" ? "PRN Administered" : "Follow-Up"))));
    }
    if (modal === "prnFollow" && prnFollowForm.prnId) {
      const rec = prnRecs.find((r2) => r2.id === prnFollowForm.prnId);
      if (!rec) return null;
      const nowTime = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      return /* @__PURE__ */ React.createElement(Modal, { title: "PRN Follow-Up", onClose: () => {
        setModal(null);
        setPrnFollowForm({ prnId: null, result: "" });
      } }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px", padding: "8px 12px", background: C.red + "06", borderRadius: 10, border: "1px solid " + C.red + "20" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 3 } }, "1-Hour Follow-Up Required"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Med:"), " ", /* @__PURE__ */ React.createElement("b", null, rec.medName, " ", rec.dose)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Route:"), " ", /* @__PURE__ */ React.createElement("b", null, rec.route)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Given:"), " ", /* @__PURE__ */ React.createElement("b", null, rec.t)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Reason:"), " ", /* @__PURE__ */ React.createElement("b", null, rec.reason)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "By:"), " ", /* @__PURE__ */ React.createElement("b", null, staffInit(gn(rec.by)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: C.tx3 } }, "Now:"), " ", /* @__PURE__ */ React.createElement("b", null, nowTime)))), /* @__PURE__ */ React.createElement(Inp, { label: "Results *", value: prnFollowForm.result, onChange: (v) => setPrnFollowForm((p) => ({ ...p, result: v })), multi: true, ph: "e.g., Pain reduced to 3/10, patient resting comfortably, headache resolved..." }), /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 4px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Follow-up by: ", /* @__PURE__ */ React.createElement("b", null, user.name), " (", staffInit(user.name), ") at ", nowTime)), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.grn, onClick: () => {
        if (!prnFollowForm.result) return;
        setPrnRecs((p) => p.map((r2) => r2.id === prnFollowForm.prnId ? { ...r2, followUp: { result: prnFollowForm.result, t: nowTime, by: user.id } } : r2));
        const sfRec = prnRecs.find((r2) => r2.id === prnFollowForm.prnId);
        if (sfRec) {
          const sfRes = residents.find((x) => x.id === (meds.find((mx) => mx.id === sfRec.medId) || {}).resId);
          const sfMemo = { id: "me" + Date.now(), d: today, t: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), by: user.id, text: "\u{1F48A} PRN FOLLOW-UP: " + sfRec.medName + " " + sfRec.dose + " \u2014 " + (sfRes ? fullName(sfRes.name) : "?") + "\nResult: " + prnFollowForm.result + "\nStaff: " + gn(user.id), acks: [user.id], urgent: false };
          setMemos((p) => [sfMemo, ...p]);
          if (sfRes) sendTeamsAlert(sfRes.home, "medChange", "PRN Follow-Up: " + sfRec.medName, (sfRes ? fullName(sfRes.name) : "") + " | Result: " + prnFollowForm.result + " | Staff: " + gn(user.id));
        }
        setPrnFollowUps((p) => p.map((f) => f.prnId === prnFollowForm.prnId ? { ...f, dismissed: true } : f));
        setPrnFollowForm({ prnId: null, result: "" });
        setModal(null);
      }, disabled: !prnFollowForm.result }, "Submit Follow-Up"))));
    }
    if (modal === "behNote") {
      const ChipPick = ({ label, opts, val, onPick, onNew }) => {
        return /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 9 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.tx3, fontWeight: 500, display: "block", marginBottom: 4 } }, label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 } }, opts.map((o) => /* @__PURE__ */ React.createElement("button", { key: o, onClick: () => onPick(o), style: { padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: val === o ? 600 : 400, border: "1.5px solid " + (val === o ? C.blue : C.sepL), background: val === o ? C.blue + "10" : C.card, color: val === o ? C.blue : C.tx2, cursor: "pointer", fontFamily: C.font } }, o))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement("input", { defaultValue: "", id: "cp-" + label, placeholder: "Type new...", style: { flex: 1, padding: "7px 10px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 13, fontFamily: C.font, boxSizing: "border-box" } }), cust.trim() && /* @__PURE__ */ React.createElement("button", { onClick: () => {
          onNew(cv2.value.trim());
          onPick(cust.trim());
          cv2.value = "";
        }, style: { padding: "7px 12px", borderRadius: 8, border: "none", background: C.blue, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, "Add")));
      };
      const matchedDomains = behDomains.filter((d) => d.resId === selRes && d.status && d.status.includes("Active"));
      const allAntecedents = [...new Set(matchedDomains.flatMap((d) => d.antecedents || []))];
      const allConsequences = [...new Set(matchedDomains.flatMap((d) => d.consequences || []))];
      const allPrevention = [...new Set(matchedDomains.flatMap((d) => d.prevention || []))];
      const clinicalPhrases = [
        { l: "Verbal redirection provided", c: C.grn },
        { l: "De-escalation techniques applied", c: "#5856d6" },
        { l: "BIP interventions implemented per protocol", c: C.pur },
        { l: "Client responded to verbal prompts", c: C.grn },
        { l: "Staff offered preferred choices", c: C.blue },
        { l: "Incident resolved without physical intervention", c: "#34c759" }
      ];
      const aiInsights = behNote.text.length > 20 ? (() => {
        const txt = behNote.text.toLowerCase();
        const hints = [];
        if (/hit|kick|punch|scratch|push|threw|bit|bite|slap|grab/i.test(txt)) hints.push({ type: "antecedent", msg: "Physical aggression detected. Consider documenting: what occurred immediately before, was a demand placed, were transitions involved?" });
        if (/scream|yell|curse|threat|name.?call/i.test(txt)) hints.push({ type: "antecedent", msg: "Verbal aggression noted. Document: was this directed at staff/peers, what triggered the outburst?" });
        if (/elope|ran|left|exit|door|escape|fled/i.test(txt)) hints.push({ type: "safety", msg: "Elopement risk. Document: duration, distance traveled, how was client returned safely?" });
        if (/head.?bang|self.?harm|bit.?self|hit.?self|scratch.?self/i.test(txt)) hints.push({ type: "safety", msg: "Self-injury detected. Document: body part affected, severity, any marks/injuries visible, first aid provided?" });
        if (!/redirect|prompt|intervene|de-escalat|bip|offer|calm|safe/i.test(txt)) hints.push({ type: "intervention", msg: "Consider adding staff interventions used (redirecting, BIP techniques, verbal prompts, offering choices)." });
        if (!/result|after|calm|resolved|subsid|return/i.test(txt)) hints.push({ type: "outcome", msg: "Add outcome: how did the incident resolve? Did client eventually calm, return to activity, etc.?" });
        if (txt.length > 30 && !/duration|minut|second|hour|lasted|approximate/i.test(txt)) hints.push({ type: "detail", msg: "Consider adding duration/intensity (e.g., 'lasted approximately 3 minutes', 'moderate intensity')." });
        return hints;
      })() : [];
      const aiSummary = behNote.text.length > 40 ? (() => {
        const r3 = residents.find((x) => x.id === selRes);
        const nm = r3 ? r3.first || fullName(r3.name).split(" ")[0] : "Client";
        const behs = behSel.join(" and ");
        const loc = behNote.location || "unspecified location";
        const time = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        return nm + " exhibited " + behs.toLowerCase() + " at " + time + " in the " + loc + ". " + (behNote.staffInv ? "Staff involved: " + behNote.staffInv + ". " : "") + "Per BIP protocol, staff implemented appropriate interventions. " + (behNote.text.length > 80 ? "See detailed narrative above." : "") + " Staff will continue to monitor and document.";
      })() : "";
      return /* @__PURE__ */ React.createElement(Modal, { title: "Document Behavior", onClose: () => {
        setModal(null);
        setBehSel([]);
        setBehNote({ text: "", location: "", staffInv: "", resPres: "" });
      }, wide: true }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px", padding: "8px 12px", background: C.red + "06", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.red, marginBottom: 4 } }, "Tracking: ", behSel.join(", ")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), " | ", user.name)), allAntecedents.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 6px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, marginBottom: 4 } }, /* @__PURE__ */ React.createElement(Ic, { n: "bot", s: 12, c: C.org }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: C.org } }, "LIKELY ANTECEDENTS")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 3 } }, allAntecedents.map((a) => /* @__PURE__ */ React.createElement("button", { key: a, onClick: () => setBehNote((p) => ({ ...p, text: p.text + (p.text && !p.text.endsWith(" ") ? " " : "") + "Antecedent: " + a + ". " })), style: { padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 500, border: "1px solid " + C.org + "30", background: C.org + "08", color: C.org, cursor: "pointer", fontFamily: C.font } }, "+ ", a)))), /* @__PURE__ */ React.createElement(Inp, { label: "What occurred? *", value: behNote.text, onChange: (v) => setBehNote((p) => ({ ...p, text: v })), multi: true, ph: "Describe incident \u2014 AI monitors..." }), behNote.text.length > 10 && (() => {
        const res = analyzeDoc(behNote.text);
        return /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 6px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 } }, /* @__PURE__ */ React.createElement(Ic, { n: "bot", s: 14, c: C.ind }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: C.ind } }, "AI Check"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 4, background: C.sepL, borderRadius: 2, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: res.score + "%", background: res.score >= 70 ? C.grn : res.score >= 40 ? C.org : C.red, borderRadius: 2 } })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: res.score >= 70 ? C.grn : res.score >= 40 ? C.org : C.red } }, res.score, "%")), res.spellFlags.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 8px", background: C.blue + "06", borderRadius: 8, marginBottom: 3, borderLeft: "3px solid " + C.blue } }, res.spellFlags.map((sf, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 4, marginBottom: 1 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, textDecoration: "line-through", color: C.red } }, sf.word), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, "\u2192"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
          const rx = new RegExp("\\b" + sf.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi");
          setBehNote((p) => ({ ...p, text: p.text.replace(rx, sf.fix) }));
        }, style: { fontSize: 11, color: C.blue, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: C.font, textDecoration: "underline" } }, sf.fix)))), res.biasFlags.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 8px", background: C.red + "06", borderRadius: 8, marginBottom: 3, borderLeft: "3px solid " + C.red } }, res.biasFlags.map((bf, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { fontSize: 11, color: C.tx2, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.red } }, "\u{1F6AB}", " ", bf.match), " \u2014 ", bf.msg))), res.cmdFlags.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 8px", background: C.org + "06", borderRadius: 8, marginBottom: 3, borderLeft: "3px solid " + C.org } }, res.cmdFlags.map((cf, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { fontSize: 11, color: C.tx2, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, color: C.org } }, "\u26A0\uFE0F", ' "', cf.match, '"'), " ", "\u2192", " use: ", cf.sug.split(", ").map((s) => /* @__PURE__ */ React.createElement("button", { key: s, onClick: () => {
          const rx = new RegExp("\\b" + cf.match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
          setBehNote((p) => ({ ...p, text: p.text.replace(rx, s) }));
        }, style: { fontSize: 10, color: C.grn, background: C.grn + "08", border: "1px solid " + C.grn + "20", borderRadius: 4, padding: "1px 5px", cursor: "pointer", fontFamily: C.font, marginLeft: 2 } }, s))))), res.ok && /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 8px", background: C.grn + "06", borderRadius: 8, borderLeft: "3px solid " + C.grn } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: C.grn } }, "\u2705", " Documentation meets standards")));
      })(), aiInsights.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, marginBottom: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12 } }, "\u{1F9E0}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: "#5856d6" } }, "AI CLINICAL INSIGHTS")), aiInsights.map((h2, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "6px 8px", background: (h2.type === "safety" ? C.red : h2.type === "antecedent" ? C.org : h2.type === "intervention" ? C.blue : "#5856d6") + "06", borderRadius: 8, marginBottom: 3, borderLeft: "3px solid " + (h2.type === "safety" ? C.red : h2.type === "antecedent" ? C.org : h2.type === "intervention" ? C.blue : "#5856d6") } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 700, color: h2.type === "safety" ? C.red : h2.type === "antecedent" ? C.org : h2.type === "intervention" ? C.blue : "#5856d6", marginBottom: 1, textTransform: "uppercase" } }, h2.type === "safety" ? "\u{1F6A8} Safety" : h2.type === "antecedent" ? "\u{1F50D} Antecedent" : h2.type === "intervention" ? "\u{1F6E1}\uFE0F Intervention" : h2.type === "outcome" ? "\u2705 Outcome" : "\u{1F4CB} Detail"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2, lineHeight: 1.4 } }, h2.msg)))), /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.tx3, marginBottom: 4 } }, "QUICK INSERT \u2014 CLINICAL PHRASES"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 3 } }, clinicalPhrases.map((cp) => /* @__PURE__ */ React.createElement("button", { key: cp.l, onClick: () => setBehNote((p) => ({ ...p, text: p.text + (p.text && !p.text.endsWith(" ") ? " " : "") + cp.l + ". " })), style: { padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 500, border: "1px solid " + cp.c + "25", background: cp.c + "06", color: cp.c, cursor: "pointer", fontFamily: C.font } }, "+ ", cp.l)))), allConsequences.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 6px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, marginBottom: 4 } }, /* @__PURE__ */ React.createElement(Ic, { n: "bot", s: 12, c: C.blue }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: C.blue } }, "CONSEQUENCE INTERVENTIONS (from BIP)")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 3 } }, allConsequences.map((c2) => /* @__PURE__ */ React.createElement("button", { key: c2, onClick: () => setBehNote((p) => ({ ...p, text: p.text + (p.text && !p.text.endsWith(" ") ? " " : "") + "Staff: " + c2 + ". " })), style: { padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 500, border: "1px solid " + C.blue + "30", background: C.blue + "08", color: C.blue, cursor: "pointer", fontFamily: C.font } }, "+ ", c2)))), /* @__PURE__ */ React.createElement(ChipPick, { label: "Location *", opts: knownLocs, val: behNote.location, onPick: (v) => setBehNote((p) => ({ ...p, location: v })), onNew: (v) => setKnownLocs((p) => [...p, v]) }), /* @__PURE__ */ React.createElement(ChipPick, { label: "Staff Involved", opts: knownStaffInv, val: behNote.staffInv, onPick: (v) => setBehNote((p) => ({ ...p, staffInv: v })), onNew: (v) => setKnownStaffInv((p) => [...p, v]) }), /* @__PURE__ */ React.createElement(ChipPick, { label: "Residents Present", opts: knownResPres, val: behNote.resPres, onPick: (v) => setBehNote((p) => ({ ...p, resPres: v })), onNew: (v) => setKnownResPres((p) => [...p, v]) }), aiSummary && /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 12px", background: "#5856d606", borderRadius: 12, border: "1.5px solid #5856d618" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12 } }, "\u{1F916}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: "#5856d6" } }, "AI CLINICAL SUMMARY (auto-generated)")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx2, lineHeight: 1.5, fontStyle: "italic" } }, aiSummary), /* @__PURE__ */ React.createElement("button", { onClick: () => setBehNote((p) => ({ ...p, text: p.text + "\n\nSummary: " + aiSummary })), style: { marginTop: 6, padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: "1.5px solid #5856d630", background: "#5856d608", color: "#5856d6", cursor: "pointer", fontFamily: C.font } }, "Append Summary to Note"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px" } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.red, onClick: () => {
        if (!behNote.text || !behNote.location) return;
        const now = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        const abc = parseABC(behNote.text, behSel, behNote.location, now);
        const newTallies = behSel.map((b) => ({ id: "t" + Date.now() + Math.random(), resId: selRes, b, d: today, t: now, by: user.id, note: { ...behNote }, abc: { a: abc.a, b: abc.b || b, c: abc.c, conf: abc.conf }, flagged: false }));
        setTallies((p) => [...p, ...newTallies]);
        const r3 = residents.find((x) => x.id === selRes);
        if (r3) behSel.forEach((b) => sendTeamsAlert(r3.home, "behavior", "Behavior: " + b + " \u2014 " + fullName(r3.name), behNote.text + " | Location: " + behNote.location + " | Staff: " + gn(user.id)));
        setBehSel([]);
        setBehNote({ text: "", location: "", staffInv: "", resPres: "" });
        setModal(null);
      }, disabled: !behNote.text || !behNote.location }, "Submit & Log"))));
    }
    if (modal && modal.startsWith("adminBeh_")) {
      const rid = modal.replace("adminBeh_", "");
      const r = residents.find((x) => x.id === rid);
      const rTallies = tallies.filter((t) => t.d === today && (t.resId || "r1") === rid);
      return /* @__PURE__ */ React.createElement(Modal, { title: (r ? fullName(r.name) : "Unknown") + " \u2014 Behaviors", onClose: () => setModal(null), wide: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", paddingTop: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "10px 12px", background: C.red + "04", borderRadius: 12 } }, /* @__PURE__ */ React.createElement(Av, { name: r ? r.name : "?", s: 48, cl: C.red }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700 } }, r ? fullName(r.name) : "Unknown"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, rTallies.length, " incident", rTallies.length !== 1 ? "s" : "", " today | ", [...new Set(rTallies.map((t) => t.b))].join(", ")))), rTallies.map((t, i) => /* @__PURE__ */ React.createElement(Card, { key: t.id, style: { marginBottom: 6 }, onClick: () => {
        setBehView(t);
        setModal("behView");
      } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 12px", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 } }, /* @__PURE__ */ React.createElement(Pill, { text: t.b, cl: C.red }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.tx3 } }, t.t, " | ", gn(t.by))), t.note && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.tx, lineHeight: 1.5, marginBottom: 4 } }, t.note.text), t.note && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, t.note.location && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, "\u{1F4CD}", " ", t.note.location), t.note.staffInv && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, "\u{1F465}", " ", t.note.staffInv), t.note.resPres && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, "\u{1F3E0}", " ", t.note.resPres)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 4 } }, /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 14, c: C.tx3 })))))));
    }
    if (modal === "behView" && behView) {
      const bvAbc = behView.abc || (behView.note ? parseABC(behView.note.text, [behView.b], behView.note && behView.note.location, behView.t) : { a: "", b: "", c: "", conf: 0 });
      const isFlagged = behView.flagged;
      return /* @__PURE__ */ React.createElement(Modal, { title: behView.b, onClose: () => {
        setModal(null);
        setBehView(null);
      }, wide: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", paddingTop: 8 } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 } }, /* @__PURE__ */ React.createElement(Pill, { text: behView.b, cl: C.red }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: C.tx3 } }, behView.d, " at ", behView.t)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: C.tx, lineHeight: 1.5, marginBottom: 10 } }, behView.note ? behView.note.text : "No note recorded"), behView.note && /* @__PURE__ */ React.createElement("div", { style: { borderTop: "0.5px solid " + C.sepL, paddingTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600 } }, "LOCATION"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500 } }, behView.note.location || "\u2014")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600 } }, "STAFF INVOLVED"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500 } }, behView.note.staffInv || "\u2014")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600 } }, "RESIDENTS PRESENT"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500 } }, behView.note.resPres || "\u2014")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, fontWeight: 600 } }, "DOCUMENTED BY"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500 } }, gn(behView.by)))))), /* @__PURE__ */ React.createElement(Card, { style: { marginTop: 8, overflow: "hidden", border: "1.5px solid #5856d618" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: "#5856d606", borderBottom: "0.5px solid " + C.sepL, display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, "\u{1F9E0}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "#5856d6" } }, "AI \u2014 ABC Analysis"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), bvAbc.conf > 0 && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: bvAbc.conf >= 80 ? C.grn : bvAbc.conf >= 50 ? C.org : C.red } }, bvAbc.conf, "% confidence")), [
        { label: "ANTECEDENT", sub: "What happened before", val: bvAbc.a, color: C.org, emoji: "\u{1F50D}", field: "a" },
        { label: "BEHAVIOR", sub: "What the client did", val: bvAbc.b, color: C.red, emoji: "\u26A1", field: "b" },
        { label: "CONSEQUENCE", sub: "Staff response / outcome", val: bvAbc.c, color: C.blue, emoji: "\u{1F6E1}\uFE0F", field: "c" }
      ].map((item) => /* @__PURE__ */ React.createElement("div", { key: item.field, style: { padding: "10px 14px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12 } }, item.emoji), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: item.color, letterSpacing: 0.5 } }, item.label), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: C.tx3 } }, item.sub)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: item.val ? C.tx : C.tx3, lineHeight: 1.5, fontStyle: item.val ? "normal" : "italic" } }, item.val || "Not detected"), (cm || isS) && /* @__PURE__ */ React.createElement("button", { onClick: () => {
        const nv = prompt(item.label + ":", item.val || "");
        if (nv !== null) {
          const newAbc = { ...bvAbc, [item.field]: nv };
          setTallies((p) => p.map((t2) => t2.id === behView.id ? { ...t2, abc: newAbc } : t2));
          setBehView((p) => ({ ...p, abc: newAbc }));
        }
      }, style: { fontSize: 10, color: "#5856d6", background: "none", border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 600, marginTop: 3 } }, "Edit")))), (cm || isS) && /* @__PURE__ */ React.createElement(Card, { style: { marginTop: 8, padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
        setTallies((p) => p.map((t2) => t2.id === behView.id ? { ...t2, flagged: !t2.flagged } : t2));
        setBehView((p) => ({ ...p, flagged: !p.flagged }));
      }, style: { width: 44, height: 26, borderRadius: 13, background: isFlagged ? C.grn : C.sepL, border: "none", cursor: "pointer", position: "relative", transition: "background .2s" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 22, height: 22, borderRadius: 11, background: "#fff", position: "absolute", top: 2, left: isFlagged ? 20 : 2, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: isFlagged ? C.grn : C.tx2 } }, isFlagged ? "\u2705 Flagged for Report" : "Include in Quarterly Report?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "Appears in report ABC section"))))));
    }
    return null;
  };
  const exportData = () => {
    const data = { v: 1, exported: (/* @__PURE__ */ new Date()).toISOString(), staff, residents, meds, docs, tallies, marRecs, marArchive, prnRecs, memos, assigns, staffShiftAssigns, shiftDuties, appointments, reports, acctItems, homeConfig, photos, walkthroughs, irReports, weightRecs, bpRecs, bsRecs, dutyLogs, rptSubmitted, resFiles, meetings, meetingSchedule, mealCalendar, externalLinks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ISR-Backup-" + today + ".json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const importData = (json) => {
    try {
      const d = JSON.parse(json);
      if (!d.v || !d.staff || !d.residents) {
        alert("Invalid backup file.");
        return;
      }
      setStaff(d.staff);
      setResidents(d.residents);
      setMeds(d.meds || []);
      setDocs(d.docs || []);
      setTallies(d.tallies || []);
      setMarRecs(d.marRecs || []);
      setMarArchive(d.marArchive || []);
      setPrnRecs(d.prnRecs || []);
      setMemos(d.memos || []);
      setAssigns(d.assigns || {});
      if (d.staffShiftAssigns) setStaffShiftAssigns(d.staffShiftAssigns);
      setShiftDuties(d.shiftDuties || []);
      setAppointments(d.appointments || []);
      setReports(d.reports || []);
      if (d.acctItems) setAcctItems(d.acctItems);
      if (d.homeConfig) setHomeConfig(d.homeConfig);
      if (d.photos) setPhotos(d.photos);
      if (d.walkthroughs) setWalkthroughs(d.walkthroughs);
      if (d.irReports) setIrReports(d.irReports);
      if (d.weightRecs) setWeightRecs(d.weightRecs);
      if (d.bpRecs) setBpRecs(d.bpRecs);
      if (d.bsRecs) setBsRecs(d.bsRecs);
      if (d.dutyLogs) setDutyLogs(d.dutyLogs);
      if (d.rptSubmitted) setRptSubmitted(d.rptSubmitted);
      if (d.resFiles) setResFiles(d.resFiles);
      if (d.meetings) setMeetings(d.meetings);
      if (d.meetingSchedule) setMeetingSchedule(d.meetingSchedule);
      if (d.mealCalendar) setMealCalendar(d.mealCalendar);
      if (d.externalLinks) setExternalLinks(d.externalLinks);
      alert("Data restored successfully! " + d.staff.length + " staff, " + d.residents.length + " residents loaded.");
      setImportText("");
    } catch (e) {
      alert("Error parsing file: " + e.message);
    }
  };
  const StaffPage = () => /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Hdr, { title: isAM ? isA ? "System Admin" : "Manager Panel" : "Staff", right: isAM && (adminTab === "staff" || adminTab === "residents") ? /* @__PURE__ */ React.createElement("button", { onClick: () => setModal(adminTab === "staff" ? "addStaff" : "addRes"), style: { background: "none", border: "none", cursor: "pointer", color: C.blue, fontSize: 13, fontWeight: 600, fontFamily: C.font } }, "+ Add") : null }), isAM && /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px 6px" } }, /* @__PURE__ */ React.createElement(Seg, { opts: [{ l: "\u{1F465} Staff", v: "staff" }, { l: "\u{1F3E0} Residents", v: "residents" }, { l: "\u{1F5FA} Homes", v: "homes" }, { l: "\u2705 Acct", v: "acct" }, ...isA ? [{ l: "\u{1F4CB} Duties", v: "duties" }, { l: "\u{1F4BE} Data", v: "data" }, { l: "\u{1F4CA} Sheets", v: "sheets" }] : []], val: adminTab, set: setAdminTab })), (adminTab === "staff" || !isAM) && /* @__PURE__ */ React.createElement(React.Fragment, null, isAM && /* @__PURE__ */ React.createElement(Sec, { title: "Staff Directory (" + staff.filter((s2) => s2.on && (isA || (s2.homes || []).some((h) => (user.homes || []).includes(h)))).length + " active)" }), !isAM && /* @__PURE__ */ React.createElement(Sec, { title: "Staff Directory" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, null, staff.filter((s2) => isA || (s2.homes || []).some((h) => (user.homes || []).includes(h))).map((s2, i, arr) => {
    const rl = ROLES[s2.role] || ROLES["Staff"];
    const ini = s2.first && s2.last ? (s2.first[0] + s2.last[0]).toUpperCase() : resInit(s2.name);
    return /* @__PURE__ */ React.createElement("div", { key: s2.id, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none", opacity: s2.on ? 1 : 0.4, cursor: isAM ? "pointer" : "default" }, onClick: isAM ? () => {
      setEditStaff({ ...s2 });
      setModal("editStaff");
    } : void 0 }, /* @__PURE__ */ React.createElement("div", { style: { width: 40, height: 40, borderRadius: 20, background: rl.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: rl.color } }, ini), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, s2.first ? s2.first + " " + s2.last : s2.name, " ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3, fontWeight: 400 } }, "(", ini, ")")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 1 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, padding: "1px 6px", borderRadius: 4, background: rl.color + "14", color: rl.color, fontWeight: 600 } }, s2.role), isA && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, s2.email || "Staff login")), isAM && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, marginTop: 2 } }, s2.phone || "No phone", " | ", s2.email || "No email", !s2.on ? " | INACTIVE" : ""), isAM && s2.homes && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 3, marginTop: 3 } }, s2.homes.map((hid) => {
      const h = HOMES.find((x) => x.id === hid);
      return h ? /* @__PURE__ */ React.createElement("span", { key: hid, style: { fontSize: 8, padding: "1px 5px", borderRadius: 3, background: h.color + "14", color: h.color, fontWeight: 600 } }, h.name) : null;
    }))), s2.id === user.id && /* @__PURE__ */ React.createElement(Pill, { text: "You", cl: C.grn }), isAM && /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 14, c: C.tx3 }));
  }))), (isS || cm) && !isAM && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Assignments" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, null, residents.map((r) => /* @__PURE__ */ React.createElement("div", { key: r.id, style: { padding: 11 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, marginBottom: 5 } }, fullName(r.name)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, staff.filter((s2) => s2.on && s2.role === "Staff").map((s2) => {
    const on = (assigns[r.id] || []).includes(s2.id);
    return /* @__PURE__ */ React.createElement("button", { key: s2.id, onClick: () => setAssigns((p) => {
      const c2 = p[r.id] || [];
      return { ...p, [r.id]: on ? c2.filter((x) => x !== s2.id) : [...c2, s2.id] };
    }), style: { padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: on ? 600 : 500, border: "1px solid " + (on ? C.blue : C.sepL), background: on ? "rgba(0,122,255,.06)" : "transparent", color: on ? C.blue : C.tx3, cursor: "pointer", fontFamily: C.font } }, s2.name.split(",")[0]);
  }))))))), isS && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Staff Report" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3, marginBottom: 8 } }, "Download staff accountability data as a spreadsheet for scheduling reviews."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 10, color: C.tx3, fontWeight: 500 } }, "From"), /* @__PURE__ */ React.createElement("input", { type: "date", value: acctFrom || today, onChange: (e) => setAcctFrom(e.target.value), style: { width: "100%", padding: "8px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 13, fontFamily: C.font } })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 10, color: C.tx3, fontWeight: 500 } }, "To"), /* @__PURE__ */ React.createElement("input", { type: "date", value: acctTo || today, onChange: (e) => setAcctTo(e.target.value), style: { width: "100%", padding: "8px 8px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 13, fontFamily: C.font } }))), /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.ind, onClick: () => {
    const from = acctFrom || today;
    const to = acctTo || today;
    const rows2 = [];
    const df3 = /* @__PURE__ */ new Date(from + "T12:00:00");
    const dt3 = /* @__PURE__ */ new Date(to + "T12:00:00");
    for (let d = new Date(df3); d <= dt3; d.setDate(d.getDate() + 1)) {
      const ds = d.toISOString().split("T")[0];
      staff.filter((s3) => s3.role === "Staff" && s3.on).forEach((s3) => {
        const a = calcAcct(s3.id, ds);
        const row = [ds, (s3.first || "") + " " + (s3.last || ""), (s3.homes || []).map((hid) => (HOMES.find((h2) => h2.id === hid) || {}).name).join(", ")];
        const activeItems2 = acctItems.filter((it) => it.on);
        activeItems2.forEach((it) => {
          const val = a[it.key];
          row.push(val ? val.pass ? "YES" : "NO" : "N/A");
          row.push(val ? val.done + "/" + val.total : "");
          row.push(val ? val.pct + "%" : "");
        });
        const totalPct = activeItems2.length > 0 ? Math.round(activeItems2.reduce((sum, it) => sum + (a[it.key] ? a[it.key].pct : 0), 0) / activeItems2.length) : 0;
        row.push(totalPct + "%");
        rows2.push(row);
      });
    }
    const activeItems = acctItems.filter((it) => it.on);
    const headers = ["Date", "Staff Name", "Home"];
    activeItems.forEach((it) => {
      headers.push(it.label + " (Pass)");
      headers.push(it.label + " (Count)");
      headers.push(it.label + " (%)");
    });
    headers.push("Overall %");
    let csv = headers.map((h2) => '"' + h2.replace(/"/g, '""') + '"').join(",") + "\n";
    rows2.forEach((r) => {
      csv += r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(",") + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a2 = document.createElement("a");
    a2.href = url;
    a2.download = "Staff-Accountability-" + from + "-to-" + to + ".csv";
    a2.click();
    URL.revokeObjectURL(url);
  } }, "\u{1F4E5}", " Download CSV"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, marginTop: 6, textAlign: "center" } }, "Opens in Excel or Google Sheets"))), /* @__PURE__ */ React.createElement(Sec, { title: "Today's Scores" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, null, staff.filter((s2) => s2.on && s2.role === "Staff").map((s2, i, arr) => {
    const a = calcAcct(s2.id, today);
    const activeItems = acctItems.filter((it) => it.on);
    const overallPct = activeItems.length > 0 ? Math.round(activeItems.reduce((sum, it) => sum + (a[it.key] ? a[it.key].pct : 0), 0) / activeItems.length) : 0;
    const clr = overallPct >= 80 ? C.grn : overallPct >= 50 ? C.org : C.red;
    return /* @__PURE__ */ React.createElement("div", { key: s2.id, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement(Av, { name: s2.name, s: 34, cl: clr }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, s2.first, " ", s2.last)), /* @__PURE__ */ React.createElement("div", { style: { width: 60, height: 6, borderRadius: 3, background: C.sepL, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: overallPct + "%", background: clr, borderRadius: 3 } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: clr, width: 38, textAlign: "right" } }, overallPct, "%"));
  }))))), isAM && adminTab === "residents" && (() => {
    const rl2 = isA ? residents : residents.filter((r) => (user.homes || []).includes(r.home));
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Residents (" + rl2.length + ")" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, null, rl2.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 16, textAlign: "center", color: C.tx3 } }, "No residents") : rl2.map((r, i) => {
      const h = HOMES.find((x) => x.id === r.home);
      return /* @__PURE__ */ React.createElement("div", { key: r.id, onClick: () => {
        setEditRes({ ...r });
        setModal("editRes");
      }, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < rl2.length - 1 ? "0.5px solid " + C.sepL : "none", cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Av, { name: r.name, s: 44, cl: h ? h.color : C.blue }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 600 } }, fullName(r.name), " ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, "(", resInit(r.name), ")")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, "UCI: ", r.uci || "\u2014", " | DOB: ", r.dob), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, marginTop: 3 } }, h && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, padding: "1px 6px", borderRadius: 4, background: h.color + "14", color: h.color, fontWeight: 600 } }, h.name), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, padding: "1px 6px", borderRadius: 4, background: C.blue + "10", color: C.blue } }, meds.filter((m) => m.resId === r.id && m.status === "active").length, " meds"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, padding: "1px 6px", borderRadius: 4, background: C.red + "10", color: C.red } }, r.allergies.length, " allergies"))), /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 14, c: C.tx3 }));
    }))));
  })(), isA && adminTab === "data" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Export Backup" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3, marginBottom: 8 } }, staff.length, " data loaded"), /* @__PURE__ */ React.createElement(Btn, { full: true, color: C.grn, onClick: exportData }, "Export Full Backup"))), /* @__PURE__ */ React.createElement(Sec, { title: "Upload Files" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", marginBottom: 8 } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3, marginBottom: 8 } }, "Upload files to resident records (PDF, JPG, Excel, Word, etc.)"), /* @__PURE__ */ React.createElement("label", { style: { display: "block", padding: "12px 0", borderRadius: 10, border: "2px dashed " + C.blue + "40", background: C.blue + "04", textAlign: "center", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: C.blue } }, "\\uD83D\\uDCC1 Tap to Select File"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3, marginTop: 2 } }, "JPG, PDF, Excel, Word accepted"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".jpg,.jpeg,.png,.pdf,.xlsx,.xls,.docx,.doc", style: { display: "none" }, onChange: (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setUploadPrompt({ file: f, name: f.name, size: f.size, type: f.type });
    setModal("uploadFile");
    e.target.value = "";
  } })), resFiles.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, fontSize: 11, color: C.tx3 } }, resFiles.length, " files uploaded"))), /* @__PURE__ */ React.createElement(Sec, { title: "Import Backup" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3, marginBottom: 8 } }, "Upload JSON backup."), /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".json,.jpg,.jpeg,.png,.pdf,.xlsx,.xls,.docx,.doc", onChange: (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (confirm("REPLACE all current data with this backup?")) importData(ev.target.result);
      };
      reader.readAsText(f);
    } else {
      setUploadPrompt({ file: f, name: f.name, size: f.size, type: f.type });
      setModal("uploadFile");
    }
    e.target.value = "";
  }, style: { fontSize: 12, fontFamily: C.font, marginBottom: 8 } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "JSON = full backup restore. Other files = upload to resident folder.")))), isA && adminTab === "duties" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Shift Duty Templates by Home" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3, marginBottom: 10 } }, "Configure shift duties for each home. These templates will be used by CarehomeVA to assign weekly duties. Select a home to configure."), HOMES.filter((h) => h.id !== "TRAIN").map((hm) => {
    const cfg = homeDutyConfig[hm.id] || { shifts: {} };
    const shiftNames = Object.keys(cfg.shifts || {});
    return /* @__PURE__ */ React.createElement(Card, { key: hm.id, style: { marginBottom: 10, borderLeft: "4px solid " + hm.color, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: hm.color } }, hm.full), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, shiftNames.length, " shift", shiftNames.length !== 1 ? "s" : "", " configured")), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px" } }, shiftNames.map((sn) => /* @__PURE__ */ React.createElement("div", { key: sn, style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: C.blue, marginBottom: 3 } }, sn), (cfg.shifts[sn] || []).map((duty, di) => /* @__PURE__ */ React.createElement("div", { key: di, style: { fontSize: 12, padding: "3px 0", display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", null, duty), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      var ns = { ...cfg };
      ns.shifts[sn] = ns.shifts[sn].filter((_, j) => j !== di);
      setHomeDutyConfig((p) => ({ ...p, [hm.id]: ns }));
    }, style: { fontSize: 10, color: C.red, background: "none", border: "none", cursor: "pointer" } }, "Remove"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, marginTop: 4 } }, /* @__PURE__ */ React.createElement("input", { id: "duty-" + hm.id + "-" + sn, placeholder: "New duty...", style: { flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } }), /* @__PURE__ */ React.createElement(Btn, { sm: true, color: hm.color, onClick: () => {
      var inp = document.getElementById("duty-" + hm.id + "-" + sn);
      if (!inp || !inp.value.trim()) return;
      var ns = { ...cfg };
      ns.shifts[sn] = [...ns.shifts[sn] || [], inp.value.trim()];
      setHomeDutyConfig((p) => ({ ...p, [hm.id]: ns }));
      inp.value = "";
    } }, "+")))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, marginTop: 8 } }, /* @__PURE__ */ React.createElement("input", { id: "shift-" + hm.id, placeholder: "New shift name (e.g. AM, PM, NOC)...", style: { flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } }), /* @__PURE__ */ React.createElement(Btn, { sm: true, v: "outline", color: hm.color, onClick: () => {
      var inp = document.getElementById("shift-" + hm.id);
      if (!inp || !inp.value.trim()) return;
      var ns = { ...cfg, shifts: { ...cfg.shifts || {}, [inp.value.trim()]: [] } };
      setHomeDutyConfig((p) => ({ ...p, [hm.id]: ns }));
      inp.value = "";
    } }, "+ Add Shift"))));
  }))), isA && adminTab === "sheets" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Google Sheets Auto-Export" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: 14, border: "1.5px solid " + C.grn + "25", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 40, height: 40, borderRadius: 10, background: "#34a85320", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 22 } }, "\u{1F4CA}")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#34a853" } }, "Google Sheets Sync"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, "Auto-exports all data nightly at 11:59 PM"))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: C.tx3, marginBottom: 4 } }, "Google Apps Script URL"), /* @__PURE__ */ React.createElement("input", { value: sheetsUrl, onChange: (e) => {
    const v = e.target.value;
    setSheetsUrl(v);
    try {
      localStorage.setItem("ba_sheets_url", v);
    } catch (ex) {
    }
  }, placeholder: "Paste your Google Apps Script web app URL here...", style: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid " + (sheetsUrl ? C.grn + "40" : C.sepL), fontSize: 13, fontFamily: C.font, boxSizing: "border-box", marginBottom: 8 } }), sheetsUrl && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: 4, background: C.grn } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.grn, fontWeight: 600 } }, "Connected"), lastSheetSync && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, "Last sync: ", lastSheetSync)), sheetsUrl && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement(Btn, { full: true, color: "#34a853", onClick: () => exportToSheets(sheetsUrl) }, sheetsStatus === "sending" ? "Sending..." : sheetsStatus === "ok" ? "\u2705 Sent!" : sheetsStatus === "error" ? "\u274C Error \u2014 retry" : "\u{1F504} Sync Now")), !sheetsUrl && /* @__PURE__ */ React.createElement("div", { style: { padding: "10px", background: C.alt, borderRadius: 10, fontSize: 11, color: C.tx3, lineHeight: 1.5 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: C.tx2, marginBottom: 4 } }, "Setup Instructions:"), /* @__PURE__ */ React.createElement("div", null, "1. Go to sheets.google.com \u2014 create new spreadsheet"), /* @__PURE__ */ React.createElement("div", null, "2. Click Extensions \u2192 Apps Script"), /* @__PURE__ */ React.createElement("div", null, "3. Delete everything and paste the script code (see below)"), /* @__PURE__ */ React.createElement("div", null, "4. Click Deploy \u2192 New Deployment \u2192 Web App"), /* @__PURE__ */ React.createElement("div", null, '5. Set "Who has access" to "Anyone"'), /* @__PURE__ */ React.createElement("div", null, "6. Click Deploy and copy the URL"), /* @__PURE__ */ React.createElement("div", null, "7. Paste the URL above"))), /* @__PURE__ */ React.createElement(Card, { style: { padding: 14, marginTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: C.ind } }, "Google Apps Script Code"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    navigator.clipboard.writeText("function doPost(e) {\n var data = JSON.parse(e.postData.contents);\n var ss = SpreadsheetApp.getActiveSpreadsheet();\n \n // Helper: write array of objects to sheet\n function writeSheet(name, arr) {\n if (!arr || !arr.length) return;\n var sh = ss.getSheetByName(name);\n if (!sh) sh = ss.insertSheet(name);\n var keys = Object.keys(arr[0]);\n sh.clear();\n sh.appendRow(['Last Updated: ' + new Date().toLocaleString()]);\n sh.appendRow(keys);\n arr.forEach(function(row) {\n sh.appendRow(keys.map(function(k) { return row[k] || ''; }));\n });\n }\n \n writeSheet('Staff', data.staff || []);\n writeSheet('Residents', data.residents || []);\n writeSheet('Medications', data.medications || []);\n writeSheet('Behaviors', data.behaviors || []);\n writeSheet('BP Readings', data.vitals_bp || []);\n writeSheet('Blood Sugar', data.vitals_bs || []);\n writeSheet('Weights', data.weights || []);\n writeSheet('Duty Logs', data.dutyLogs || []);\n writeSheet('Med Changes', data.medChanges || []);\n \n return ContentService.createTextOutput('OK');\n}");
    setSheetsStatus("copied");
    setTimeout(() => setSheetsStatus(null), 2e3);
  }, style: { padding: "5px 10px", borderRadius: 6, border: "1px solid " + C.ind + "30", background: C.ind + "08", color: C.ind, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, sheetsStatus === "copied" ? "\u2705 Copied!" : "Copy Script")), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 10px", background: "#1a1a2e", borderRadius: 8, fontSize: 10, color: "#a0e0a0", fontFamily: "monospace", lineHeight: 1.6, overflow: "auto", maxHeight: 200 } }, /* @__PURE__ */ React.createElement("div", null, "function doPost(e) {"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "var data = JSON.parse(e.postData.contents);"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "var ss = SpreadsheetApp.getActiveSpreadsheet();"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12, color: "#666" } }, "// Writes each data type to its own tab"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "function writeSheet(name, arr) {"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 24 } }, "if (!arr || !arr.length) return;"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 24 } }, "var sh = ss.getSheetByName(name);"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 24 } }, "if (!sh) sh = ss.insertSheet(name);"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 24 } }, "sh.clear(); sh.appendRow(Object.keys(arr[0]));"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 24 } }, "arr.forEach(function(row) {"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 36 } }, "sh.appendRow(Object.keys(row).map(function(k){return row[k]||'';}));"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 24 } }, "});"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "}"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "writeSheet('Staff', data.staff);"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "writeSheet('Residents', data.residents);"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "writeSheet('Medications', data.medications);"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "writeSheet('Behaviors', data.behaviors);"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "writeSheet('BP Readings', data.vitals_bp);"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "writeSheet('Blood Sugar', data.vitals_bs);"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "writeSheet('Weights', data.weights);"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "writeSheet('Duty Logs', data.dutyLogs);"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "writeSheet('Med Changes', data.medChanges);"), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 12 } }, "return ContentService.createTextOutput('OK');"), /* @__PURE__ */ React.createElement("div", null, "}"))), /* @__PURE__ */ React.createElement(Card, { style: { padding: 14, marginTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.tx, marginBottom: 6 } }, "Data Exported (9 sheets)"), ["Staff \u2014 names, roles, homes", "Residents \u2014 names, DOB, UCI, diagnosis, allergies, weight", "Medications \u2014 active meds with dose, route, doctor", "Behaviors \u2014 last 100 incidents with ABC data", "BP Readings \u2014 last 50 with timestamps", "Blood Sugar \u2014 last 50 with meal context", "Weights \u2014 all monthly weights with trends", "Duty Logs \u2014 last 200 with completion status", "Med Changes \u2014 all medical changes with severity"].map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "4px 0", fontSize: 11, color: C.tx2, borderBottom: i < 8 ? "0.5px solid " + C.sepL : "none", display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.grn, fontWeight: 700 } }, "\u2713"), s))))), isAM && adminTab === "homes" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Home Configuration" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, HOMES.map((hm) => {
    const cfg = homeConfig[hm.id] || { ips: [], teams: [] };
    return /* @__PURE__ */ React.createElement(Card, { key: hm.id, style: { marginBottom: 10, overflow: "hidden", borderLeft: "4px solid " + hm.color } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: hm.color } }, hm.full), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, residents.filter((r2) => r2.home === hm.id).length, " residents | ", staff.filter((s2) => s2.on && (s2.homes || []).includes(hm.id)).length, " staff")), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: C.tx3, marginBottom: 4 } }, "TEAMS CHANNELS (", (cfg.teams || []).length, ")"), (cfg.teams || []).map((tc2, ti) => /* @__PURE__ */ React.createElement("div", { key: ti, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12 } }, tc2.name, " ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: tc2.on ? C.grn : C.red } }, tc2.on ? "Active" : "Off")), /* @__PURE__ */ React.createElement("button", { onClick: () => setHomeConfig((p) => ({ ...p, [hm.id]: { ...p[hm.id], teams: p[hm.id].teams.map((t2, j) => j === ti ? { ...t2, on: !t2.on } : t2) } })), style: { fontSize: 10, color: tc2.on ? C.red : C.grn, background: "none", border: "none", cursor: "pointer", fontFamily: C.font } }, tc2.on ? "Disable" : "Enable"))), /* @__PURE__ */ React.createElement(Btn, { sm: true, v: "outline", color: hm.color, onClick: () => {
      setTeamsAdd({ homeId: hm.id, name: "", url: "" });
      setModal("addTeams");
    } }, "+ Add Teams Channel")), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", borderTop: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: C.tx3, marginBottom: 4 } }, "ALLOWED IPs (", (cfg.ips || []).length, ")"), (cfg.ips || []).map((ip2, ii) => /* @__PURE__ */ React.createElement("div", { key: ii, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontFamily: "monospace" } }, ip2), /* @__PURE__ */ React.createElement("button", { onClick: () => setHomeConfig((p) => ({ ...p, [hm.id]: { ...p[hm.id], ips: p[hm.id].ips.filter((_, j) => j !== ii) } })), style: { fontSize: 10, color: C.red, background: "none", border: "none", cursor: "pointer" } }, "Remove"))), /* @__PURE__ */ React.createElement(Btn, { sm: true, v: "outline", color: C.blue, onClick: () => {
      const ip2 = prompt("Enter allowed IP address:");
      if (ip2) setHomeConfig((p) => ({ ...p, [hm.id]: { ...p[hm.id], ips: [...p[hm.id].ips || [], ip2.trim()] } }));
    } }, "+ Add IP")));
  }))), isAM && adminTab === "acct" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Staff Accountability Tracking" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: 14, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, marginBottom: 8 } }, "Tracking Items"), acctItems.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: it.key, style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < acctItems.length - 1 ? "0.5px solid " + C.sepL : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, it.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, it.key)), /* @__PURE__ */ React.createElement("button", { onClick: () => setAcctItems((p) => p.map((x) => x.key === it.key ? { ...x, on: !x.on } : x)), style: { padding: "5px 12px", borderRadius: 8, border: "1.5px solid " + (it.on ? C.grn : C.sepL), background: it.on ? C.grn + "10" : "transparent", color: it.on ? C.grn : C.tx3, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, it.on ? "Active" : "Off"))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("input", { value: newAcctItem, onChange: (e) => setNewAcctItem(e.target.value), placeholder: "New tracking item...", style: { flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid " + C.sepL, fontSize: 12, fontFamily: C.font } }), /* @__PURE__ */ React.createElement(Btn, { sm: true, color: C.blue, onClick: () => {
    if (!newAcctItem.trim()) return;
    const key = newAcctItem.trim().toLowerCase().replace(/\s+/g, "_");
    setAcctItems((p) => [...p, { id: "ai" + Date.now(), label: newAcctItem.trim(), key, on: true }]);
    setNewAcctItem("");
  } }, "Add"))))));
  const unacked = memos.filter((m) => !m.acks.includes(user.id)).length;
  const dutiesDone = shiftDuties.filter((d) => d.done).length === shiftDuties.length;
  const tabs = isVA ? [{ id: "home", l: "Home", i: "home" }, { id: "duties", l: "Duties", i: "check" }] : [{ id: "home", l: "Home", i: "home" }, { id: "res", l: "Residents", i: "users" }, { id: "memo", l: "Memos", i: "memo", badge: unacked, flash: unacked > 0 }, ...perms.duties || isAM ? [{ id: "duties", l: "Duties", i: "check", flash: isAM ? false : !dutiesDone }] : [], ...perms.staff || perms.admin ? [{ id: "staff", l: isAM ? isA ? "Admin" : "Manage" : "Staff", i: isAM ? "shield" : "person" }] : []];
  return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: C.font, background: "linear-gradient(180deg, #eef2f9 0%, " + C.bg + " 120px)", minHeight: "100vh", paddingBottom: 78, maxWidth: 500, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("style", null, "@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes memoFlash{from{opacity:1}to{opacity:0.3}}@keyframes flash{0%,100%{opacity:1}50%{opacity:.3}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}input:focus,select:focus,textarea:focus{outline:none;border-color:" + C.blue + "!important;box-shadow:0 0 0 3px rgba(0,122,255,.12)!important}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}html{scroll-behavior:smooth;-webkit-overflow-scrolling:touch}body{overscroll-behavior:none}::-webkit-scrollbar{width:0;display:none}button{-webkit-appearance:none;touch-action:manipulation}select{-webkit-appearance:none;appearance:none}input[type=time]{-webkit-appearance:none}"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5, padding: "5px 14px", background: "linear-gradient(90deg, rgba(52,199,89,.06), rgba(0,122,255,.04))", borderBottom: "0.5px solid rgba(52,199,89,.12)" } }, /* @__PURE__ */ React.createElement(Ic, { n: "shield", s: 11, c: C.grn }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: C.grn, letterSpacing: 0.3 } }, "HIPAA COMPLIANT"), /* @__PURE__ */ React.createElement(Ic, { n: "lock", s: 9, c: C.grn })), user && !isAM && !isS && !isVA && memos.filter((m2) => !m2.acks.includes(user.id) && (!m2.homeIds || m2.homeIds.length === 0 || m2.homeIds.some((hid) => (user.homes || []).includes(hid)))).length > 0 && (() => {
    const urgentUnacked = memos.filter((m2) => !m2.acks.includes(user.id) && (!m2.homeIds || m2.homeIds.length === 0 || m2.homeIds.some((hid) => (user.homes || []).includes(hid))));
    return /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { background: C.card, borderRadius: 20, width: "100%", maxWidth: 420, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.5)" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "20px 20px 10px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 60, height: 60, borderRadius: 30, background: C.red + "12", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 28 } }, "\u{1F514}"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: C.red } }, "Memo", urgentUnacked.length > 1 ? "s" : "", " Require Your Review"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3, marginTop: 4 } }, "Please read each memo carefully. You must review and acknowledge ", urgentUnacked.length === 1 ? "this memo" : "all " + urgentUnacked.length + " memos", " before proceeding.")), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 16px 20px" } }, urgentUnacked.map((m2, i) => /* @__PURE__ */ React.createElement("div", { key: m2.id, style: { marginBottom: 10, padding: "12px 14px", background: C.red + "04", borderRadius: 14, border: "1.5px solid " + C.red + "25" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: C.red } }, "MEMO ", i + 1, " of ", urgentUnacked.length), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.tx3 } }, m2.d, " ", m2.t)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, marginBottom: 6 } }, "From: ", gn(m2.by)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.tx, lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 12, padding: "10px 12px", background: "#f8f9fa", borderRadius: 10, border: "1px solid " + C.sepL, maxHeight: 300, overflow: "auto" } }, m2.text), /* @__PURE__ */ React.createElement("button", { onClick: () => setMemos((p) => p.map((mx) => mx.id === m2.id ? { ...mx, acks: [...mx.acks, user.id] } : mx)), style: { width: "100%", padding: "10px", borderRadius: 10, border: "none", background: C.grn, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: C.font } }, "\u2713", " I have reviewed this memo and acknowledge that I understand its contents"))))));
  })(), tab === "home" && homeContent, tab === "res" && (selRes ? /* @__PURE__ */ React.createElement(ResDetail, null) : selHome ? (() => {
    const hm = HOMES.find((h) => h.id === selHome);
    const hRes = residents.filter((r) => r.home === selHome);
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Hdr, { title: hm ? hm.full : selHome, left: user.homes && user.homes.length > 1 ? /* @__PURE__ */ React.createElement("button", { onClick: () => setSelHome(null), style: { background: "none", border: "none", cursor: "pointer", color: C.blue, fontSize: 14, fontFamily: C.font, display: "flex", alignItems: "center" } }, /* @__PURE__ */ React.createElement(Ic, { n: "back", s: 16, c: C.blue }), " Homes") : null }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, null, hRes.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 16, textAlign: "center", color: C.tx3 } }, "No residents at this home") : hRes.map((r, i) => /* @__PURE__ */ React.createElement(Row, { key: r.id, left: /* @__PURE__ */ React.createElement(Av, { name: r.name, s: 44 }), title: fullName(r.name), sub: r.room, right: /* @__PURE__ */ React.createElement(Badge, { n: r.allergies.filter((a) => a.type === "medication").length, cl: C.red }), onClick: () => setSelRes(r.id), last: i === hRes.length - 1 })))));
  })() : (() => {
    const uHomes = (user.homes || ["SCH"]).map((hid) => HOMES.find((h) => h.id === hid)).filter(Boolean);
    if (uHomes.length <= 1) return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Hdr, { title: uHomes[0] ? uHomes[0].full : "Residents" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, null, residents.filter((r) => r.home === (uHomes[0] ? uHomes[0].id : "SCH")).map((r, i, arr) => /* @__PURE__ */ React.createElement(Row, { key: r.id, left: /* @__PURE__ */ React.createElement(Av, { name: r.name, s: 44 }), title: fullName(r.name), sub: r.room, right: /* @__PURE__ */ React.createElement(Badge, { n: r.allergies.filter((a) => a.type === "medication").length, cl: C.red }), onClick: () => setSelRes(r.id), last: i === arr.length - 1 })))));
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Hdr, { title: "Select Home", right: /* @__PURE__ */ React.createElement("button", { onClick: () => setUser(null), style: { background: "none", border: "none", cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Ic, { n: "out", s: 18, c: C.red })) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", display: "grid", gap: 8 } }, uHomes.map((h) => {
      const cnt = residents.filter((r) => r.home === h.id).length;
      return /* @__PURE__ */ React.createElement(Card, { key: h.id, onClick: () => setSelHome(h.id), style: { padding: 16, cursor: "pointer", borderLeft: "4px solid " + h.color } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 50, height: 50, borderRadius: 14, background: h.color + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: h.color } }, h.name.charAt(0)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: h.color } }, h.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, h.full), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx2, marginTop: 2 } }, cnt, " resident", cnt !== 1 ? "s" : "")), /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 18, c: C.tx3 })));
    })));
  })()), tab === "memo" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Hdr, { title: "Memos", right: cm || isS ? /* @__PURE__ */ React.createElement("button", { onClick: () => setModal("newMemo"), style: { background: "none", border: "none", cursor: "pointer", color: C.blue, fontSize: 14, fontWeight: 600, fontFamily: C.font } }, "+ New") : null }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, null, memos.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 16, textAlign: "center", color: C.tx3, fontSize: 13 } }, "No memos") : memos.map((m, i) => {
    const acked = m.acks.includes(user.id);
    return /* @__PURE__ */ React.createElement("div", { key: m.id, style: { padding: "12px 14px", borderBottom: i < memos.length - 1 ? "0.5px solid " + C.sepL : "none", cursor: "pointer", background: !acked ? C.red + "04" : "transparent" }, onClick: () => setModal("memos") }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, !acked && /* @__PURE__ */ React.createElement("div", { style: { width: 10, height: 10, borderRadius: 5, background: C.red, animation: "memoFlash 1s ease-in-out infinite alternate", flexShrink: 0 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: acked ? 400 : 600, color: acked ? C.tx2 : C.tx } }, m.text.slice(0, 70), m.text.length > 70 ? "..." : ""), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, marginTop: 2 } }, m.d, " | ", gn(m.by))), acked ? /* @__PURE__ */ React.createElement(Pill, { text: "Acknowledged", cl: C.grn }) : /* @__PURE__ */ React.createElement(Pill, { text: "Action Required", cl: C.red })));
  })))), tab === "duties" && isAM && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Hdr, { title: "Duty Accountability", right: /* @__PURE__ */ React.createElement("button", { onClick: () => {
    let csv = "Date,Home,Task,Time,Done,Completed By,Completed At\n";
    dutyLogs.sort((a2, b) => b.d.localeCompare(a2.d)).forEach((dl) => {
      csv += '"' + dl.d + '","' + (HOMES.find((h) => h.id === dl.homeId) || {}).name + '","' + dl.task + '","' + dl.time + '","' + (dl.done ? "Yes" : "NO") + '","' + (dl.done ? gn(dl.by) : "\u2014") + '","' + (dl.doneAt || "\u2014") + '"\n';
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DutyLog-" + today + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  }, style: { background: "none", border: "none", cursor: "pointer", color: C.blue, fontSize: 12, fontWeight: 600, fontFamily: C.font } }, "Export CSV") }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Card, { style: { padding: "8px 12px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    const d2 = /* @__PURE__ */ new Date(dutiesDate + "T12:00:00");
    d2.setDate(d2.getDate() - 1);
    setDutiesDate(d2.toISOString().slice(0, 10));
    setDutiesHome(null);
  }, style: { background: "none", border: "none", cursor: "pointer", padding: "6px 12px" } }, /* @__PURE__ */ React.createElement(Ic, { n: "back", s: 18, c: C.blue })), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700 } }, (/* @__PURE__ */ new Date(dutiesDate + "T12:00:00")).toLocaleDateString("en-US", { weekday: "long" })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, (/* @__PURE__ */ new Date(dutiesDate + "T12:00:00")).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }))), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    const d2 = /* @__PURE__ */ new Date(dutiesDate + "T12:00:00");
    d2.setDate(d2.getDate() + 1);
    if (d2 <= /* @__PURE__ */ new Date()) setDutiesDate(d2.toISOString().slice(0, 10));
    setDutiesHome(null);
  }, style: { background: "none", border: "none", cursor: "pointer", padding: "6px 12px", opacity: dutiesDate >= today ? 0.3 : 1 } }, /* @__PURE__ */ React.createElement(Ic, { n: "chev", s: 18, c: C.blue }))), dutiesDate === today && /* @__PURE__ */ React.createElement("button", { onClick: () => setDutiesDate(today), style: { display: "block", margin: "0 auto 8px", padding: "4px 14px", borderRadius: 8, border: "1px solid " + C.blue, background: C.blue + "08", color: C.blue, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: C.font } }, "Today"), !dutiesHome ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Sec, { title: "Homes" }), HOMES.map((hm) => {
    const dayLogs = dutyLogs.filter((dl) => dl.homeId === hm.id && dl.d === dutiesDate);
    const totalTasks = shiftDuties.length;
    const doneTasks = dayLogs.filter((dl) => dl.done).length;
    const notDone = totalTasks - doneTasks;
    const pct = totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0;
    return /* @__PURE__ */ React.createElement(Card, { key: hm.id, onClick: () => setDutiesHome(hm.id), style: { marginBottom: 8, cursor: "pointer", borderLeft: "4px solid " + hm.color, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 48, height: 48, borderRadius: 12, background: hm.color + "12", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 22 } }, "\u{1F3E0}")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: hm.color } }, hm.full), /* @__PURE__ */ React.createElement("div", { style: { height: 5, background: C.sepL, borderRadius: 3, marginTop: 4, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: pct + "%", background: pct === 100 ? C.grn : pct >= 50 ? C.org : C.red, borderRadius: 3 } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3, marginTop: 2 } }, doneTasks, "/", totalTasks, " done")), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, notDone > 0 ? /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: 18, background: C.red + "12", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 800, color: C.red } }, notDone)) : /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: 18, background: C.grn + "12", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(Ic, { n: "check", s: 18, c: C.grn })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: notDone > 0 ? C.red : C.grn, fontWeight: 700, marginTop: 2 } }, notDone > 0 ? "INCOMPLETE" : "COMPLETE"))));
  })) : (() => {
    const hm = HOMES.find((h) => h.id === dutiesHome);
    const dayLogs = dutyLogs.filter((dl) => dl.homeId === dutiesHome && dl.d === dutiesDate);
    const taskMap = {};
    shiftDuties.forEach((sd) => {
      const log = dayLogs.find((dl) => dl.task === sd.task);
      taskMap[sd.task] = log || { task: sd.task, time: sd.time, done: false, by: null, doneAt: null };
    });
    const incomplete = Object.values(taskMap).filter((t) => !t.done);
    const complete = Object.values(taskMap).filter((t) => t.done);
    const staffMissed = {};
    const homeStaff = staff.filter((s2) => s2.on && (s2.homes || []).includes(dutiesHome) && s2.role !== "System Admin");
    homeStaff.forEach((s2) => {
      const theirDone = dayLogs.filter((dl) => dl.done && dl.by === s2.id).length;
      staffMissed[s2.id] = { name: (s2.first || "") + " " + (s2.last || ""), done: theirDone, total: shiftDuties.length };
    });
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => setDutiesHome(null), style: { display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: C.blue, fontSize: 13, fontWeight: 600, fontFamily: C.font, marginBottom: 8 } }, /* @__PURE__ */ React.createElement(Ic, { n: "back", s: 14, c: C.blue }), " All Homes"), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, padding: "10px 14px", borderLeft: "4px solid " + (hm ? hm.color : C.blue) } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: hm ? hm.color : C.tx } }, hm ? hm.full : ""), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, dutiesDate, " | ", complete.length, "/", shiftDuties.length, " duties done")), incomplete.length > 0 && /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, border: "1.5px solid " + C.red + "30", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.red + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: C.red } }, "\u274C", " Not Completed (", incomplete.length, ")")), incomplete.map((t, i) => /* @__PURE__ */ React.createElement("div", { key: t.task, style: { padding: "8px 14px", borderBottom: i < incomplete.length - 1 ? "0.5px solid " + C.sepL : "none", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 20, height: 20, borderRadius: 10, border: "2px solid " + C.red, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: C.red } }, t.task), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, "Due: ", t.time))))), complete.length > 0 && /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", background: C.grn + "06", borderBottom: "0.5px solid " + C.sepL } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: C.grn } }, "\u2705", " Completed (", complete.length, ")")), complete.map((t, i) => /* @__PURE__ */ React.createElement("div", { key: t.task, style: { padding: "6px 14px", borderBottom: i < complete.length - 1 ? "0.5px solid " + C.sepL : "none", display: "flex", alignItems: "center", gap: 8, opacity: 0.7 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 20, height: 20, borderRadius: 10, background: C.grn, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Ic, { n: "check", s: 12, c: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.tx3 } }, t.task), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.tx3 } }, t.time, " \u2014 ", t.by ? gn(t.by) : "?", " at ", t.doneAt || "?"))))), /* @__PURE__ */ React.createElement(Sec, { title: "Staff Stats" }), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 8 } }, Object.entries(staffMissed).map(([sid, s2], i, arr) => /* @__PURE__ */ React.createElement("div", { key: sid, style: { padding: "8px 12px", borderBottom: i < arr.length - 1 ? "0.5px solid " + C.sepL : "none", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(Av, { name: s2.name, s: 32, cl: s2.done > 0 ? C.grn : C.red }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, s2.name)), /* @__PURE__ */ React.createElement(Pill, { text: s2.done + " done", cl: s2.done > 0 ? C.grn : C.red })))));
  })())), tab === "duties" && !isAM && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Hdr, { title: "Shift Duties", right: /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: shiftDuties.filter((d) => d.done).length === shiftDuties.length ? C.grn : C.org, fontWeight: 600 } }, shiftDuties.filter((d) => d.done).length, "/", shiftDuties.length) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { height: 6, borderRadius: 3, background: C.sepL, marginBottom: 10, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", borderRadius: 3, background: shiftDuties.filter((d) => d.done).length === shiftDuties.length ? C.grn : C.teal, width: shiftDuties.filter((d) => d.done).length / shiftDuties.length * 100 + "%", transition: "width .3s ease" } })), /* @__PURE__ */ React.createElement(Card, null, shiftDuties.map((d, i) => /* @__PURE__ */ React.createElement("div", { key: d.id, onClick: () => {
    if (!d.done) {
      const now = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      setShiftDuties((p) => p.map((x) => x.id === d.id ? { ...x, done: true, by: user.id, doneAt: now } : x));
      const uHomes = user.homes || ["SCH"];
      uHomes.forEach((hid) => setDutyLogs((p) => [...p, { id: "dl" + Date.now() + Math.random(), homeId: hid, d: today, task: d.task, time: d.time, done: true, by: user.id, doneAt: now }]));
    } else {
      if (confirm('Are you sure you want to uncheck "' + d.task + '"? This will mark it as incomplete.')) {
        setShiftDuties((p) => p.map((x) => x.id === d.id ? { ...x, done: false, by: null, doneAt: null } : x));
      }
    }
  }, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < shiftDuties.length - 1 ? "0.5px solid " + C.sepL : "none", cursor: d.done ? "default" : "pointer", background: d.done ? C.grn + "04" : "transparent" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 24, height: 24, borderRadius: 12, border: d.done ? "none" : "2px solid " + C.sepL, background: d.done ? C.grn : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s ease" } }, d.done && /* @__PURE__ */ React.createElement(Ic, { n: "check", s: 14, c: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: d.done ? 400 : 500, textDecoration: d.done ? "line-through" : "none", color: d.done ? C.tx3 : C.tx } }, d.task), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.tx3 } }, d.time, d.done && d.by ? " \u2014 " + staffInit(gn(d.by)) + " at " + d.doneAt : ""))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 10 } }, /* @__PURE__ */ React.createElement("input", { value: newDuty.task, onChange: (e) => setNewDuty((p) => ({ ...p, task: e.target.value })), placeholder: "Add custom duty...", style: { flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid " + C.sepL, fontSize: 14, fontFamily: C.font, outline: "none" } }), /* @__PURE__ */ React.createElement("input", { type: "time", value: newDuty.time, onChange: (e) => setNewDuty((p) => ({ ...p, time: e.target.value })), style: { width: 90, padding: "10px 6px", borderRadius: 10, border: "1px solid " + C.sepL, fontSize: 13, fontFamily: C.font } }), /* @__PURE__ */ React.createElement(Btn, { sm: true, color: C.teal, onClick: () => {
    if (!newDuty.task) return;
    setShiftDuties((p) => [...p, { id: "d" + Date.now(), task: newDuty.task, time: newDuty.time, done: false, by: null, doneAt: null }].sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99")));
    setNewDuty({ task: "", time: "" });
  } }, "+")))), tab === "staff" && (perms.staff || perms.admin) && /* @__PURE__ */ React.createElement(StaffPage, null), user && prnFollowUps.filter((f) => !f.dismissed && f.by === user.id && Date.now() >= f.dueAt).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, padding: "8px 14px", background: "linear-gradient(135deg,#ff3b30,#ff6b6b)", color: "#fff", display: "flex", alignItems: "center", gap: 8, animation: "su .3s ease" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700 } }, "\u{1F514}", " PRN Follow-Up Due!"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.9 } }, prnFollowUps.filter((f) => !f.dismissed && f.by === user.id && Date.now() >= f.dueAt).length, " medication(s) need follow-up")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    const due = prnFollowUps.find((f) => !f.dismissed && f.by === user.id && Date.now() >= f.dueAt);
    if (due) adminPrnFollow(due.prnId);
  }, style: { padding: "6px 14px", borderRadius: 8, border: "2px solid rgba(255,255,255,.5)", background: "rgba(255,255,255,.15)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: C.font } }, "Respond")), renderModal(), /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", bottom: 0, left: 0, right: 0, background: "linear-gradient(180deg, rgba(214,235,255,.92), rgba(214,235,255,.98))", backdropFilter: "blur(20px)", borderTop: "0.5px solid " + C.sep, display: "flex", justifyContent: "space-around", padding: "4px 0 env(safe-area-inset-bottom,16px)", zIndex: 100 } }, tabs.map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, onClick: () => {
    setTab(t.id);
    if (t.id !== "res") {
      setSelRes(null);
      setSelHome(null);
    }
    setResSubTab("dash");
  }, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 1, background: "none", border: "none", padding: "3px 8px", cursor: "pointer", color: tab === t.id ? C.blue : C.tx3, fontFamily: C.font, position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", padding: "2px 8px", borderRadius: 10, background: tab === t.id ? C.blue + "10" : "transparent", transition: "background .2s" } }, /* @__PURE__ */ React.createElement(Ic, { n: t.i, s: 20, c: tab === t.id ? C.blue : t.flash ? C.red : C.tx3 }), t.badge > 0 && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: -4, right: -8, minWidth: 16, height: 16, borderRadius: 8, background: C.red, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", animation: "memoFlash 1s ease-in-out infinite alternate" } }, t.badge), t.flash && !t.badge && tab !== t.id && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: -2, right: -4, width: 8, height: 8, borderRadius: 4, background: C.red, animation: "memoFlash 1s ease-in-out infinite alternate" } })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: tab === t.id ? 600 : 500, color: tab === t.id ? C.blue : t.flash ? C.red : C.tx3 } }, t.l)))));
}
const App = IndividualSupportRecord;

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));