const STORAGE_KEY = "gerador-evolucao-enfermagem:v1";

const ids = Array.from(document.querySelectorAll("input, select, textarea")).map((el) => el.id).filter(Boolean);
const $ = (id) => document.getElementById(id);
const value = (id) => ($(id)?.value || "").trim();
const checked = (id) => Boolean($(id)?.checked);
const has = (text) => Boolean(String(text || "").trim());
const lower = (text) => String(text || "").toLowerCase();

function line(text) {
  return has(text) ? text.trim() : "";
}

function endWithPeriod(text) {
  if (!has(text)) return "";
  const trimmed = text.trim();
  return /[.!?:;]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function joinSentence(parts) {
  return parts.filter(has).join(" ").replace(/\s+/g, " ").trim();
}

function parseDateValue(text) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return { year, month, day };
}

function formatDateBR(text) {
  const date = parseDateValue(text);
  if (!date) return "";
  return `${String(date.day).padStart(2, "0")}/${String(date.month).padStart(2, "0")}/${date.year}`;
}

function ageFromBirthDate(text) {
  const birth = parseDateValue(text);
  if (!birth) return "";
  const today = new Date();
  let age = today.getFullYear() - birth.year;
  const birthdayPassed = today.getMonth() + 1 > birth.month || (today.getMonth() + 1 === birth.month && today.getDate() >= birth.day);
  if (!birthdayPassed) age -= 1;
  if (age < 0) return "";
  return `${age} ${age === 1 ? "ano" : "anos"}`;
}

function satText() {
  return has(value("saturation")) ? `mantendo SatO₂ ${value("saturation")}%` : "";
}

function flowText() {
  return has(value("oxygenFlow")) ? `a ${value("oxygenFlow")} L/min` : "";
}

function fio2Text() {
  return has(value("fio2")) ? `FiO₂ ${value("fio2")}%` : "";
}

function respiratorySignsText() {
  const signs = [];
  if (checked("eupneic")) signs.push("eupneico");
  if (checked("noDistress")) signs.push("sem sinais de desconforto respiratório");
  if (checked("tirage")) signs.push("com tiragem");
  if (checked("cyanosis")) signs.push("com cianose");
  if (checked("noisyBreathing")) signs.push("com respiração ruidosa");
  if (checked("dyspnea")) signs.push("com dispneia");
  if (checked("tachypnea")) signs.push("com taquipneia");
  if (has(value("respRate"))) signs.push(`FR ${value("respRate")} irpm`);
  return signs.join(", ");
}

function accessDressingText() {
  const d = value("accessDressing");
  const obs = value("accessObservation");
  const map = {
    clean: "com curativo limpo, seco e íntegro, sem sinais flogísticos aparentes",
    dirty: "com curativo apresentando sujidade aparente; sítio de inserção sem sinais flogísticos aparentes, sendo indicada avaliação/troca conforme rotina",
    detached: "com curativo parcialmente descolado, necessitando reforço ou troca conforme rotina",
    dirtyDetached: "com curativo parcialmente descolado e com sujidade aparente; sítio de inserção avaliado, sem sinais flogísticos aparentes",
    phlogistic: "com sinais flogísticos aparentes em sítio de inserção, equipe responsável comunicada e paciente mantido em observação",
    bleeding: "com curativo apresentando sujidade hemática/sangramento local, equipe responsável comunicada"
  };
  return [map[d] || "", obs].filter(has).join(", ");
}

function getHeader() {
  const lines = [];
  lines.push(line(value("hospital")));
  lines.push(line(value("sector")));
  lines.push(line(value("shift")));
  lines.push("");

  const patientParts = [];
  const birthDate = formatDateBR(value("patientBirthDate"));
  const age = ageFromBirthDate(value("patientBirthDate"));
  if (has(value("patientName"))) patientParts.push(value("patientName"));
  if (has(birthDate)) patientParts.push(`DN: ${birthDate}`);
  if (has(age)) patientParts.push(age);
  if (has(value("bed"))) patientParts.push(`leito ${value("bed")}`);
  if (patientParts.length) lines.push(`Paciente: ${patientParts.join(", ")}.`);

  lines.push(line(endWithPeriod(value("dihDpo"))));
  if (has(value("hpp"))) lines.push(`HPP/Comorbidades: ${endWithPeriod(value("hpp"))}`);

  const allergyStatus = value("allergyStatus");
  const allergyDetails = value("allergyDetails");
  if (allergyStatus === "no") lines.push("Alergias: negadas.");
  if (allergyStatus === "yes") lines.push(`Alergias: ${endWithPeriod(allergyDetails || "referidas, sem detalhamento")}`);

  const continuousMedsStatus = value("continuousMedsStatus");
  const continuousMedsDetails = value("continuousMedsDetails");
  if (continuousMedsStatus === "no") lines.push("Uso de medicação contínua: negado.");
  if (continuousMedsStatus === "yes") lines.push(`Uso de medicação contínua: ${endWithPeriod(continuousMedsDetails || "referido, sem detalhamento")}`);

  if (has(value("admissionHistory"))) lines.push(`História da admissão: ${endWithPeriod(value("admissionHistory"))}`);

  const braden = value("bradenClass");
  const bradenPts = value("bradenPoints");
  const morse = value("morseClass");
  const morsePts = value("morsePoints");
  if (has(braden) || has(morse)) lines.push("Escalas de risco:");
  if (has(braden)) lines.push(`Braden: ${braden}${has(bradenPts) ? ` — ${bradenPts} pontos` : ""}.`);
  if (has(morse)) lines.push(`Morse: ${morse}${has(morsePts) ? ` — ${morsePts} pontos` : ""}.`);
  return lines.filter((x, i, arr) => x !== "" || arr[i - 1] !== "").join("\n").trim();
}

function getCompanionSentence() {
  const status = value("companionStatus");
  const relation = value("companionRelation") || "acompanhante";
  if (status === "sem") return "Paciente sem acompanhante no momento da visita.";
  if (status === "com") return `Paciente acompanhado(a) pela(o) ${relation} no momento da visita.`;
  return "";
}

function getConsciousnessSentence() {
  const c = value("consciousness");
  const map = {
    bom: "Encontra-se em bom estado geral, consciente, orientado e comunicativo.",
    consciente_orientado: "Encontra-se consciente e orientado, comunicando-se adequadamente no momento da visita.",
    sonolento: "Encontra-se sonolento, responsivo aos estímulos, mantido em observação.",
    confuso: "Encontra-se confuso, necessitando orientação e observação durante o plantão.",
    agitado: "Encontra-se agitado, mantido em observação e com medidas de segurança conforme necessidade.",
    sedado: "Encontra-se sedado, mantido em observação conforme rotina assistencial.",
    inconsciente: "Encontra-se inconsciente no momento da avaliação, mantido em observação e sob cuidados da equipe.",
    personalizado: endWithPeriod(value("consciousnessCustom"))
  };
  return map[c] || "";
}

function getPainSentence() {
  const status = value("painStatus");
  if (status === "no") return "Nega queixas álgicas no momento.";
  if (status === "yesRoutine" || status === "yesMedical") {
    const location = value("painLocation") || "local não especificado";
    const scale = value("painScale") || "__";
    const base = `Refere queixa álgica em ${location}, intensidade ${scale}/10 na escala numérica da dor.`;
    if (status === "yesMedical") return `${base} Equipe médica comunicada para avaliação/conduta.`;
    return `${base} Mantido(a) em observação e realizada conduta conforme rotina/prescrição.`;
  }
  return "";
}

function getRespiratorySentence() {
  const type = value("oxygenType");
  if (!has(type)) return "";

  const sat = satText();
  const signs = respiratorySignsText();
  const obs = value("oxygenObservation");
  const flow = flowText();
  const fio2 = fio2Text();

  const suffix = [sat, signs, obs].filter(has).join(", ");
  const add = suffix ? `, ${suffix}` : "";

  const map = {
    roomAir: `Respira em ar ambiente${add}.`,
    roomAirTqt: `Respira em ar ambiente por traqueostomia${add}. Cânula pérvia, sem intercorrências aparentes no momento.`,
    nasal: `Em uso de O₂ por cateter nasal ${flow}${add}.`,
    simpleMask: `Em uso de O₂ por máscara simples ${flow}${add}.`,
    venturi: `Em uso de O₂ por máscara de Venturi ${fio2}${add}.`,
    nonRebreather: `Em uso de O₂ por máscara não reinalante ${flow}${add}. Paciente em observação quanto ao padrão respiratório.`,
    macro: `Em uso de macronebulização com O₂ ${flow}${add}.`,
    tqtO2: `Traqueostomizado(a), em uso de O₂ suplementar por TQT ${flow}${add}. Cânula pérvia, mantido(a) em observação.`,
    vni: `Em uso de ventilação não invasiva${has(obs) ? ` tipo ${obs}` : ""}${sat ? `, ${sat}` : ""}. Mantido(a) em observação quanto à adaptação e padrão respiratório.`,
    vm: `Paciente em ventilação mecânica invasiva${add}, sob monitorização. Cânula/TOT pérvio, sem intercorrências aparentes no momento.`,
    highFlow: `Em uso de oxigenoterapia de alto fluxo${flow ? `, fluxo ${value("oxygenFlow")} L/min` : ""}${fio2 ? `, ${fio2}` : ""}${sat ? `, ${sat}` : ""}. Paciente mantido(a) em observação.`
  };
  return map[type] || "";
}

function getThoraxSentence() {
  const t = value("thorax");
  const map = {
    symmetric: "Tórax simétrico, com expansibilidade preservada.",
    asymmetricRight: "Tórax assimétrico, com expansibilidade reduzida/desigual, apresentando menor expansão em hemitórax direito.",
    asymmetricLeft: "Tórax assimétrico, com expansibilidade reduzida/desigual, apresentando menor expansão em hemitórax esquerdo.",
    deep: "Tórax com expansibilidade preservada, apresentando movimentos respiratórios profundos.",
    superficial: "Tórax com expansibilidade superficial, apresentando movimentos respiratórios superficiais."
  };
  return map[t] || "";
}

function getFeedingSentence() {
  const route = value("feedingRoute");
  if (!has(route)) return "";
  const acceptance = value("feedingAcceptance");
  const obs = value("feedingObservation");

  const acceptanceText = {
    boa: "com boa aceitação/tolerância",
    parcial: "com aceitação parcial",
    baixa: "com baixa aceitação",
    nausea: "com relato/presença de náuseas",
    vomit: "com episódio/relato de vômitos",
    distension: "com distensão abdominal"
  }[acceptance] || "";

  const extra = [acceptanceText, obs].filter(has).join(", ");
  const suffix = extra ? `, ${extra}` : "";

  const map = {
    vo: `Em dieta por via oral${suffix || ", com boa aceitação, sem náuseas ou vômitos no momento"}.`,
    sne: `Recebendo dieta enteral por SNE${suffix || ", com boa tolerância, sem episódios de náuseas, vômitos ou distensão abdominal no momento"}.`,
    sng: `Recebendo dieta por SNG${suffix || ", com boa tolerância, sem náuseas, vômitos ou distensão abdominal no momento"}. Sonda fixada e pérvia.`,
    gtt: `Recebendo dieta enteral por gastrostomia${suffix || ", com boa tolerância"}. Dispositivo pérvio, fixado, com óstio em bom aspecto.`,
    jjt: `Em uso de jejunostomia para alimentação enteral${suffix || ", dieta infundindo conforme rotina, com boa tolerância"}. Óstio em bom aspecto, sem sinais flogísticos aparentes.`,
    npt: `Em NPT por acesso venoso central, solução em infusão contínua${suffix || ", sem sinais de reação ou intercorrências aparentes no momento"}.`,
    npp: `Em uso de nutrição parenteral periférica${suffix || ", sem intercorrências aparentes no momento"}.`,
    npo: "Paciente mantido(a) em jejum/NPO, sem oferta de dieta no momento.",
    suspended: "Com dieta suspensa no momento, sem oferta alimentar por via oral ou enteral. Mantido(a) em observação pela equipe de enfermagem.",
    refusal: `Em dieta por via oral, porém apresenta ${acceptanceText || "recusa alimentar/baixa aceitação"}${obs ? `, ${obs}` : ""}. Equipe ciente e paciente mantido(a) em observação.`
  };
  return map[route] || "";
}

function getEliminationSentence() {
  const urine = value("urine");
  const bowel = value("bowel");
  const parts = [];

  const detailedUrineMap = {
    clear: "amarelo-clara, aspecto límpido, sem sedimentos e sem hematúria aparente",
    concentrated: "amarelo-escura/concentrada, sem hematúria aparente",
    bloody: "hematúrica, com presença de sangue visível em bolsa coletora",
    turbid: "amarelo-turva, com presença de sedimentos em bolsa coletora"
  };
  const urineMap = {
    spontaneous: "refere diurese espontânea presente",
    svd: "mantém diurese por sonda vesical de demora",
    sva: "mantém diurese por sonda vesical de alívio conforme necessidade/rotina",
    absent: "sem diurese referida/observada no momento",
    notInformed: "diurese não informada no momento"
  };
  const bowelMap = {
    present: "evacuação presente",
    absent: "evacuação ausente no momento",
    rectalTube: "evacuação por sonda retal",
    diaper: "em uso de fralda",
    notInformed: "evacuação não informada no momento"
  };

  if (urine === "svd" || urine === "sva") {
    const catheter = urine === "svd" ? "sonda vesical de demora" : "sonda vesical de alívio";
    const aspect = detailedUrineMap[value("urineAspect")];
    const amount = value("urineAmount");
    const amountWithUnit = /\bml\b/i.test(amount) ? amount : `${amount} ml`;
    const aspectText = aspect ? `, com débito urinário de coloração ${aspect}` : "";
    const amountText = has(amount) ? `, em quantidade ${amountWithUnit} no momento` : "";
    const urineSentence = `Diurese presente por ${catheter}, em bolsa coletora${aspectText}${amountText}.`;
    if (bowelMap[bowel]) return `${urineSentence} Quanto às eliminações intestinais, ${bowelMap[bowel]}.`;
    return urineSentence;
  }

  if (urineMap[urine]) parts.push(urineMap[urine]);
  if (bowelMap[bowel]) parts.push(bowelMap[bowel]);
  if (!parts.length) return "";
  return `Quanto às eliminações, ${parts.join(" e ")}.`;
}

function getAccessSentence() {
  const type = value("accessType");
  if (!has(type)) return "";
  if (type === "none") return "Desprovido(a) de acesso venoso no momento.";
  const loc = value("accessLocation") || "local não especificado";
  const dressing = accessDressingText();
  const suffix = dressing ? `, ${dressing}` : ", pérvio, com fixação adequada, sem sinais flogísticos aparentes";

  const map = {
    avp: `Mantém AVP em ${loc}, pérvio, salinizado${suffix}.`,
    cvc: `Mantém CVC em ${loc}, pérvio${suffix}.`,
    picc: `Mantém PICC em ${loc}, pérvio${suffix}.`,
    port: `Mantém Port-a-Cath em ${loc}, pérvio${suffix}.`,
    shilley: `Mantém cateter Shilley em ${loc}${suffix}.`,
    permcath: `Mantém Permcath em ${loc}${suffix}.`,
    arterial: `Mantém cateter arterial em ${loc}, pérvio${suffix}.`,
    other: `Mantém dispositivo de acesso em ${loc}${suffix}.`
  };
  return map[type] || "";
}

function getDrainSentence() {
  if (value("hasDrain") !== "yes") return "";
  const loc = value("drainLocation") || "região não especificada";
  const dressing = value("drainDressing") || "em bom aspecto";
  const amount = value("drainAmount") || "não quantificada";
  const aspect = value("drainAspect") || "não especificado";
  return `Mantém dreno em ${loc}, fixado adequadamente, com curativo em óstio de inserção ${dressing}, sem sinais flogísticos aparentes no momento. Apresenta débito em quantidade ${lower(amount)}, de aspecto ${aspect}. Dispositivo mantido pérvio e posicionado adequadamente. Paciente mantido(a) em observação quanto a débito, aspecto da secreção, fixação e integridade do curativo.`;
}

function getWoundSentence() {
  const status = value("woundStatus");
  if (!has(status)) return "";
  const loc = value("woundLocation") || "região não especificada";
  const signs = value("woundSigns");

  if (status === "none") return "Não apresenta curativo em regiões avaliadas no momento da visita. Pele observada sem cobertura externa.";
  if (status === "clean") return `Curativo em região de ${loc}, com cobertura externa limpa, seca e íntegra, sem sinais de sangramento, secreção ou sujidade aparente${signs ? `, ${signs}` : ""}.`;
  if (status === "dirty") return `Curativo em região de ${loc}, com cobertura externa apresentando sujidade, sem sangramento ativo aparente${signs ? `, ${signs}` : ""}. Equipe de enfermagem comunicada para avaliação da cobertura e realização de troca conforme necessidade/rotina do setor.`;
  if (status === "wet") return `Curativo em região de ${loc}, com cobertura externa úmida${signs ? `, ${signs}` : ""}. Equipe de enfermagem comunicada para avaliação e troca conforme necessidade/rotina do setor.`;
  if (status === "bleeding") return `Curativo em região de ${loc}, com presença de sangramento aparente em cobertura externa${signs ? `, ${signs}` : ""}. Equipe responsável comunicada e paciente mantido(a) em observação.`;
  if (status === "secretion") return `Curativo em região de ${loc}, com presença de secreção aparente em cobertura externa${signs ? `, ${signs}` : ""}. Equipe responsável comunicada para avaliação e conduta.`;

  if (status === "performed") {
    const cleaning = value("woundCleaning") || "SF 0,9%";
    const primary = value("primaryCover");
    const secondary = value("secondaryCover");
    const occlusion = value("occlusion");
    const steps = [];
    steps.push(`limpeza com ${cleaning}`);
    if (primary) steps.push(`cobertura primária ${primary}`);
    if (secondary) steps.push(`cobertura secundária ${secondary}`);
    if (occlusion) steps.push(`oclusão/fixação com ${occlusion}`);
    return `Realizado curativo em região de ${loc}, ${steps.join(", ")}${signs ? `, ${signs}` : ""}. Paciente tolerou procedimento sem intercorrências aparentes.`;
  }
  return "";
}

function getMobilitySentence() {
  const m = value("mobility");
  const detail = value("mobilityDetail");
  const add = detail ? ` ${endWithPeriod(detail)}` : "";
  const map = {
    walkAlone: "Paciente deambula sem auxílio, com marcha preservada, sem necessidade de apoio para locomoção no momento.",
    walkHelp: "Paciente deambula com auxílio da equipe, necessitando supervisão durante a locomoção para maior segurança.",
    walker: "Paciente deambula com auxílio de andador, apresentando necessidade de apoio para locomoção segura.",
    crutch: "Paciente deambula com auxílio de muleta, mantendo restrição/apoio parcial conforme condição clínica.",
    cane: "Paciente deambula com auxílio de bengala, apresentando necessidade de apoio para equilíbrio durante a marcha.",
    wheelchair: "Paciente utiliza cadeira de rodas para locomoção, necessitando auxílio/supervisão para transferência conforme necessidade.",
    wheelchairIndependent: "Paciente cadeirante, com boa autonomia funcional, realiza transferências leito/cadeira de rodas de forma independente e locomove-se em cadeira de rodas sem necessidade de auxílio ou supervisão da equipe no momento.",
    wheelchairDependent: "Paciente cadeirante, sem autonomia funcional para locomoção, necessitando de auxílio da equipe para transferências e deslocamento em cadeira de rodas.",
    bedridden: "Paciente encontra-se acamado(a), com mobilidade reduzida, necessitando auxílio para mudança de decúbito e cuidados de prevenção de lesão por pressão.",
    restrictedBed: "Paciente restrito(a) ao leito no momento, sem deambulação, necessitando auxílio para mobilização e cuidados no leito.",
    reduced: "Paciente apresenta mobilidade reduzida, necessitando auxílio/supervisão para locomoção e realização de mudanças de posição.",
    paraplegic: "Paciente paraplégico(a), com mobilidade prejudicada em membros inferiores, dependente de cadeira de rodas/auxílio para locomoção e transferência.",
    tetraplegic: "Paciente tetraplégico(a), com mobilidade prejudicada em membros superiores e inferiores, dependente de auxílio integral para mobilização, mudança de decúbito e cuidados no leito.",
    noWalk: "Paciente não deambula no momento, permanecendo em leito/cadeira, necessitando auxílio para mobilização conforme tolerância.",
    unstable: "Paciente deambula com marcha instável, necessitando supervisão/auxílio durante locomoção devido ao risco de desequilíbrio.",
    fallRisk: "Paciente deambula com risco de queda, necessitando supervisão durante locomoção e manutenção de medidas preventivas.",
    limping: "Paciente deambula com claudicação, apresentando alteração da marcha, necessitando observação e auxílio conforme necessidade.",
    postOpLimited: "Paciente em pós-operatório, apresentando limitação de mobilidade relacionada ao procedimento cirúrgico, necessitando auxílio para mobilização e medidas de segurança."
  };
  return (map[m] || "") + add;
}

function getOrthoSentence() {
  const type = value("orthoType");
  if (!has(type)) return "";
  const limb = value("orthoLimb") || "membro acometido";
  const edema = value("orthoEdema") || "sem edema aparente";
  const perfusion = value("orthoPerfusion") || "extremidade corada, aquecida e com perfusão periférica preservada";
  const sensitivity = value("orthoSensitivity") || "sensibilidade preservada, nega dormência ou formigamento";
  const movement = value("orthoMovement") || "movimentação preservada nas extremidades livres";
  const device = value("orthoDevice") || "dispositivo em bom aspecto, limpo, seco, íntegro e sem sinais aparentes de compressão";

  const normalBase = `${limb} apresenta-se ${edema}, ${perfusion}. ${sensitivity}. ${movement}.`;

  const map = {
    normalWithImmobilization: `${normalBase} Mantém ${device}. Paciente mantido(a) em observação e aos cuidados da equipe de enfermagem.`,
    normalWithoutImmobilization: `${normalBase} Sem alterações aparentes no momento da avaliação.`,
    alteredWithImmobilization: `${limb} apresenta ${edema}, ${perfusion}. ${sensitivity}. ${movement}. Mantém ${device}. Equipe responsável comunicada quando necessário. Paciente mantido(a) em observação e aos cuidados da equipe de enfermagem.`,
    alteredWithoutImmobilization: `${limb} apresenta ${edema}, ${perfusion}. ${sensitivity}. ${movement}. Equipe responsável comunicada quando necessário. Paciente mantido(a) em observação e aos cuidados da equipe de enfermagem.`,
    fixatorNormal: `${limb} com fixador externo. Observa-se inserção dos pinos em bom aspecto, sem hiperemia, edema importante, secreção ou sangramento ativo aparente. ${perfusion}. ${sensitivity}. ${movement}. Paciente mantido(a) em observação e aos cuidados da equipe de enfermagem.`,
    fixatorAltered: `${limb} com fixador externo. Observam-se alterações no local do fixador/dispositivo: ${device}. ${perfusion}. ${sensitivity}. ${movement}. Equipe responsável comunicada para avaliação. Paciente mantido(a) em observação.`,
    tractionNormal: `Mantém tração em ${limb}, bem posicionada, com membro alinhado e pesos suspensos livremente, sem contato com leito ou chão. Cordas íntegras, tracionadas e correndo livremente nas roldanas. Pele íntegra nas áreas de apoio, sem sinais de pressão aparente. ${perfusion}. ${sensitivity}. ${movement}. Paciente mantido(a) em observação e aos cuidados da equipe de enfermagem.`,
    tractionAltered: `Mantém tração em ${limb}. Observa-se alteração relacionada à tração/dispositivo: ${device}. ${limb} apresenta ${edema}, ${perfusion}. ${sensitivity}. ${movement}. Equipe responsável comunicada e paciente mantido(a) em observação.`
  };
  return map[type] || "";
}

function getSkinSentence() {
  const s = value("skin");
  const obs = value("skinObservation");
  const map = {
    intact: `Pele íntegra nas demais áreas avaliadas${obs ? `, ${obs}` : ", sem lesões aparentes"}.`,
    risk: `Pele com risco aumentado para lesão por pressão${obs ? `, ${obs}` : ""}. Mantidas medidas preventivas conforme rotina assistencial.`,
    lesion: `Apresenta alteração/lesão de pele${obs ? `: ${endWithPeriod(obs)}` : "."}`
  };
  return map[s] || "";
}

function getIdentificationSentence() {
  const plate = value("bedPlate");
  const wrist = value("wristband");
  if (!plate && !wrist) return "";
  if (plate === "yes" && wrist === "yes") return "Identificado(a) por placa no leito e com pulseira de identificação.";
  if (plate === "yes" && wrist === "no") return "Identificado(a) por placa no leito, porém sem pulseira de identificação no momento da visita.";
  if (plate === "no" && wrist === "yes") return "Não identificado(a) por placa no leito, porém com pulseira de identificação.";
  if (plate === "no" && wrist === "no") return "Não identificado(a) por placa no leito e sem pulseira de identificação no momento da visita.";
  if (plate === "yes") return "Identificado(a) por placa no leito.";
  if (wrist === "yes") return "Identificado(a) com pulseira de identificação.";
  return "";
}

function autoDiagnoses() {
  const infection = value("accessType") && value("accessType") !== "none" || value("hasDrain") === "yes" || ["clean", "dirty", "wet", "bleeding", "secretion", "performed"].includes(value("woundStatus")) || ["sne", "sng", "gtt", "jjt", "npt", "npp"].includes(value("feedingRoute"));
  const skin = ["Risco leve", "Risco moderado", "Risco alto", "Risco muito alto"].some((risk) => value("bradenClass").startsWith(risk)) || ["bedridden", "restrictedBed", "wheelchair", "wheelchairIndependent", "wheelchairDependent", "paraplegic", "tetraplegic", "reduced"].includes(value("mobility")) || value("woundStatus") && value("woundStatus") !== "none" || value("skin") === "risk" || value("skin") === "lesion";
  const falls = lower(value("morseClass")).includes("médio") || lower(value("morseClass")).includes("alto") || ["walkHelp", "walker", "crutch", "cane", "wheelchair", "wheelchairIndependent", "wheelchairDependent", "unstable", "fallRisk", "postOpLimited"].includes(value("mobility"));
  const pain = value("painStatus") === "yesRoutine" || value("painStatus") === "yesMedical" || ["alteredWithImmobilization", "alteredWithoutImmobilization", "tractionAltered"].includes(value("orthoType"));
  const perfusion = has(value("orthoType")) || ["postOpLimited", "limping"].includes(value("mobility"));
  return { infection, skin, falls, pain, perfusion };
}

function diagnosisAllowed(id, autoValue) {
  const setting = value(id);
  if (setting === "yes") return true;
  if (setting === "no") return false;
  return Boolean(autoValue);
}

function getDiagnosesSection() {
  const auto = autoDiagnoses();
  const items = [];
  if (diagnosisAllowed("diagInfection", auto.infection)) items.push("Risco de infecção.");
  if (diagnosisAllowed("diagSkin", auto.skin)) items.push("Risco de integridade da pele prejudicada.");
  if (diagnosisAllowed("diagFalls", auto.falls)) items.push("Risco de quedas.");
  if (diagnosisAllowed("diagPain", auto.pain)) {
    items.push(value("painStatus") === "yesRoutine" || value("painStatus") === "yesMedical" ? "Dor aguda." : "Risco de dor aguda.");
  }
  if (diagnosisAllowed("diagPerfusion", auto.perfusion)) items.push("Risco de alteração da perfusão periférica em membro acometido/imobilizado.");
  if (!items.length) return "";
  return `Diagnósticos de enfermagem:\n${items.map((item) => `(x) ${item}`).join("\n")}`;
}

function getConductsSection() {
  const map = [
    ["condConsciousness", "Monitorar nível de consciência"],
    ["condVitals", "Monitorar sinais vitais conforme rotina do setor"],
    ["condPain", "Avaliar e registrar queixas álgicas"],
    ["condComfort", "Manter medidas de conforto e bem-estar"],
    ["condFalls", "Orientar paciente/acompanhante quanto ao risco de quedas e manter medidas de segurança"],
    ["condDiet", "Observar aceitação/tolerância da dieta"],
    ["condElim", "Avaliar eliminações urinárias e intestinais"],
    ["condSkin", "Realizar avaliação diária da pele"],
    ["condAccess", "Avaliar acesso/dispositivo quanto à permeabilidade, fixação e presença de sinais flogísticos"],
    ["condOrtho", "Observar membro acometido/imobilização/tração quanto à integridade, posicionamento, compressão, edema, dor, perfusão distal e alteração de sensibilidade"],
    ["condObservation", "Manter paciente em observação conforme rotina do setor"]
  ];
  const selected = map.filter(([id]) => checked(id)).map(([, text]) => text);
  if (!selected.length) return "";
  return `Cuidados/Conduta de enfermagem:\n${selected.map((item) => `– ${item};`).join("\n")}`;
}

function getPendingSection() {
  const items = [];
  if (has(value("importantMeds"))) items.push(`Medicações importantes: ${endWithPeriod(value("importantMeds"))}`);
  if (has(value("pendingExams"))) items.push(`Exames/pareceres pendentes: ${endWithPeriod(value("pendingExams"))}`);
  if (has(value("programming"))) items.push(`Programação: ${endWithPeriod(value("programming"))}`);
  if (has(value("pendingNotes"))) items.push(`Pendências: ${endWithPeriod(value("pendingNotes"))}`);
  return items.join("\n");
}

function applyAutoConducts() {
  const shouldPain = value("painStatus") || value("orthoType");
  const shouldFalls = lower(value("morseClass")).includes("médio") || lower(value("morseClass")).includes("alto") || ["walkHelp", "walker", "crutch", "cane", "wheelchair", "wheelchairIndependent", "wheelchairDependent", "unstable", "fallRisk", "bedridden", "restrictedBed"].includes(value("mobility"));
  const shouldDiet = value("feedingRoute");
  const shouldElim = value("urine") || value("bowel");
  const shouldSkin = value("skin") || value("woundStatus") || value("bradenClass");
  const shouldAccess = value("accessType") && value("accessType") !== "none" || value("hasDrain") === "yes";
  const shouldOrtho = value("orthoType") || ["postOpLimited", "limping", "reduced"].includes(value("mobility"));

  if (shouldPain) $("condPain").checked = true;
  if (shouldFalls) $("condFalls").checked = true;
  if (shouldDiet) $("condDiet").checked = true;
  if (shouldElim) $("condElim").checked = true;
  if (shouldSkin) $("condSkin").checked = true;
  if (shouldAccess) $("condAccess").checked = true;
  if (shouldOrtho) $("condOrtho").checked = true;
  if (value("consciousness") && value("consciousness") !== "bom") $("condConsciousness").checked = true;
}

function generateEvolution() {
  applyAutoConducts();

  const header = getHeader();
  const paragraphs = [
    getCompanionSentence(),
    getConsciousnessSentence(),
    getPainSentence(),
    getRespiratorySentence(),
    getThoraxSentence(),
    getFeedingSentence(),
    getEliminationSentence(),
    getAccessSentence(),
    getDrainSentence(),
    getWoundSentence(),
    getMobilitySentence(),
    getOrthoSentence(),
    getSkinSentence(),
    getIdentificationSentence()
  ].filter(has);

  const body = paragraphs.join(" ");
  const sections = [
    header,
    body,
    getDiagnosesSection(),
    getConductsSection(),
    getPendingSection(),
    "Segue aos cuidados da equipe multiprofissional.",
    value("signature")
  ].filter(has);

  const text = sections.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
  $("output").value = text;
  $("statusBadge").textContent = text.length ? "gerado" : "rascunho";
}

function toggleConditionals() {
  document.querySelectorAll(".conditional[data-show]").forEach((el) => {
    const [field, expected] = el.dataset.show.split(":");
    const expectedValues = expected.split(",");
    el.classList.toggle("is-hidden", !expectedValues.includes(value(field)));
  });
}

function collectForm() {
  const data = {};
  ids.forEach((id) => {
    const el = $(id);
    if (!el) return;
    if (el.type === "checkbox") data[id] = el.checked;
    else data[id] = el.value;
  });
  return data;
}

function fillForm(data) {
  ids.forEach((id) => {
    const el = $(id);
    if (!el || data[id] === undefined) return;
    if (el.type === "checkbox") el.checked = Boolean(data[id]);
    else el.value = data[id];
  });
  toggleConditionals();
  generateEvolution();
}

function saveDraft() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collectForm()));
  $("statusBadge").textContent = "salvo local";
}

function loadDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    alert("Nenhum rascunho local salvo neste dispositivo.");
    return;
  }
  fillForm(JSON.parse(raw));
  $("statusBadge").textContent = "rascunho carregado";
}

function clearForm() {
  if (!confirm("Deseja limpar todos os campos?")) return;
  ids.forEach((id) => {
    const el = $(id);
    if (!el) return;
    if (["hospital", "sector", "shift"].includes(id)) return;
    if (el.type === "checkbox") el.checked = ["condVitals", "condComfort", "condObservation"].includes(id);
    else el.value = "";
  });
  toggleConditionals();
  generateEvolution();
}

function applyDefaultPatient() {
  fillForm({
    ...collectForm(),
    companionStatus: value("companionStatus") || "sem",
    consciousness: "bom",
    painStatus: "no",
    oxygenType: "roomAir",
    eupneic: true,
    noDistress: true,
    thorax: "symmetric",
    feedingRoute: "vo",
    feedingAcceptance: "boa",
    urine: "spontaneous",
    bowel: "present",
    accessType: value("accessType") || "none",
    mobility: value("mobility") || "walkAlone",
    skin: "intact",
    bedPlate: value("bedPlate") || "yes",
    wristband: value("wristband") || "yes",
    condVitals: true,
    condComfort: true,
    condObservation: true,
    condPain: true,
    condDiet: true,
    condElim: true,
    condSkin: true
  });
}

async function copyOutput() {
  const text = $("output").value;
  if (!has(text)) return;
  try {
    await navigator.clipboard.writeText(text);
    $("statusBadge").textContent = "copiado";
  } catch (error) {
    $("output").select();
    document.execCommand("copy");
    $("statusBadge").textContent = "copiado";
  }
}

function downloadTxt() {
  const text = $("output").value;
  if (!has(text)) return;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "evolucao-enfermagem.txt";
  link.click();
  URL.revokeObjectURL(url);
}

function init() {
  document.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("input", () => {
      toggleConditionals();
      generateEvolution();
    });
    el.addEventListener("change", () => {
      toggleConditionals();
      generateEvolution();
    });
  });

  $("btnDefault").addEventListener("click", applyDefaultPatient);
  $("btnClear").addEventListener("click", clearForm);
  $("btnCopy").addEventListener("click", copyOutput);
  $("btnSave").addEventListener("click", saveDraft);
  $("btnLoad").addEventListener("click", loadDraft);
  $("btnTxt").addEventListener("click", downloadTxt);

  toggleConditionals();
  generateEvolution();
}

init();
