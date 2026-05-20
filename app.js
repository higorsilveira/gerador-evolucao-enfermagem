const STORAGE_KEY = "gerador-evolucao-enfermagem:v1";

const ids = Array.from(document.querySelectorAll("input, select, textarea")).map((el) => el.id).filter(Boolean);
const $ = (id) => document.getElementById(id);
const value = (id) => ($(id)?.value || "").trim();
const checked = (id) => Boolean($(id)?.checked);
const has = (text) => Boolean(String(text || "").trim());
const lower = (text) => String(text || "").toLowerCase();
const DEFAULT_SIGNATURE = "Enfermeira Núbia Altina de Carvalho da Silveira\nCOREN-DF 635.011";
const WOUND_STORAGE_KEY = "__wounds__";
const CONDUCT_DEFAULT_IDS = ["condVitals", "condComfort", "condObservation"];
const CONDUCT_AUTO_IDS = [
  "condConsciousness",
  "condPain",
  "condFalls",
  "condDiet",
  "condElim",
  "condSkin",
  "condAccess",
  "condOrtho",
  "condPainReport",
  "condRespiratory",
  "condHeadboard",
  "condDietAcceptance",
  "condGlycemia",
  "condStump",
  "condAvp",
  "condPressurePrevention",
  "condReposition",
  "condSkinCare",
  "condFallsMorse",
  "condTransfers",
  "condSafeEnvironment",
  "condSvdDiuresis",
  "condSvdCare"
];

const woundLocations = [
  ["ombro_d", "Ombro direito"],
  ["ombro_e", "Ombro esquerdo"],
  ["torax_d", "Hemitórax direito"],
  ["torax_e", "Hemitórax esquerdo"],
  ["abdome", "Abdome"],
  ["quadril_d", "Quadril direito"],
  ["quadril_e", "Quadril esquerdo"],
  ["coxa_d", "Coxa direita"],
  ["coxa_e", "Coxa esquerda"],
  ["trocanter_d", "Região trocantérica direita"],
  ["trocanter_e", "Região trocantérica esquerda"],
  ["joelho_d", "Joelho direito"],
  ["joelho_e", "Joelho esquerdo"],
  ["perna_d", "Perna direita"],
  ["perna_e", "Perna esquerda"],
  ["tornozelo_d", "Tornozelo direito"],
  ["tornozelo_e", "Tornozelo esquerdo"],
  ["pe_d", "Pé direito"],
  ["pe_e", "Pé esquerdo"],
  ["escapular_d", "Região escapular direita"],
  ["escapular_e", "Região escapular esquerda"],
  ["lombar", "Região lombar"],
  ["sacral", "Região sacral"],
  ["glutea_d", "Região glútea direita"],
  ["glutea_e", "Região glútea esquerda"],
  ["calcaneo_d", "Calcâneo direito"],
  ["calcaneo_e", "Calcâneo esquerdo"],
  ["amputacao_transtibial_e", "Coto transtibial esquerdo"],
  ["amputacao_transtibial_d", "Coto transtibial direito"],
  ["other", "Outro"]
];

const woundLocationMap = Object.fromEntries(woundLocations);
const BODY_FRONT_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/c/c7/Silhouette_humain_asexue_anterieur_posterieur.svg";
const BODY_BACK_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/c/c7/Silhouette_humain_asexue_anterieur_posterieur.svg";
const woundBodyHotspotsLegacy = [
  { value: "ombro_d", label: "Ombro direito", view: "front", top: 18, left: 38.5 },
  { value: "ombro_e", label: "Ombro esquerdo", view: "front", top: 18, left: 61.5 },
  { value: "torax_d", label: "Hemitórax direito", view: "front", top: 30, left: 44.5 },
  { value: "torax_e", label: "Hemitórax esquerdo", view: "front", top: 30, left: 55.5 },
  { value: "abdome", label: "Abdome", view: "front", top: 45, left: 50 },
  { value: "quadril_d", label: "Quadril direito", view: "front", top: 57, left: 45.5 },
  { value: "quadril_e", label: "Quadril esquerdo", view: "front", top: 57, left: 54.5 },
  { value: "coxa_d", label: "Coxa direita", view: "front", top: 68, left: 46.5 },
  { value: "coxa_e", label: "Coxa esquerda", view: "front", top: 68, left: 53.5 },
  { value: "joelho_d", label: "Joelho direito", view: "front", top: 79, left: 47.2 },
  { value: "joelho_e", label: "Joelho esquerdo", view: "front", top: 79, left: 52.8 },
  { value: "perna_d", label: "Perna direita", view: "front", top: 89, left: 47.4 },
  { value: "perna_e", label: "Perna esquerda", view: "front", top: 89, left: 52.6 },
  { value: "tornozelo_d", label: "Tornozelo direito", view: "front", top: 97, left: 47.5 },
  { value: "tornozelo_e", label: "Tornozelo esquerdo", view: "front", top: 97, left: 52.5 },
  { value: "pe_d", label: "Pé direito", view: "front", top: 104, left: 45.8 },
  { value: "pe_e", label: "Pé esquerdo", view: "front", top: 104, left: 54.2 },
  { value: "amputacao_transtibial_d", label: "Coto transtibial direito", view: "front", top: 92.5, left: 47.5 },
  { value: "amputacao_transtibial_e", label: "Coto transtibial esquerdo", view: "front", top: 92.5, left: 52.5 },
  { value: "escapular_d", label: "Região escapular direita", view: "back", top: 27.5, left: 43.5 },
  { value: "escapular_e", label: "Região escapular esquerda", view: "back", top: 27.5, left: 56.5 },
  { value: "lombar", label: "Região lombar", view: "back", top: 42.5, left: 50 },
  { value: "trocanter_d", label: "Região trocantérica direita", view: "back", top: 56, left: 45 },
  { value: "trocanter_e", label: "Região trocantérica esquerda", view: "back", top: 56, left: 55 },
  { value: "sacral", label: "Região sacral", view: "back", top: 60.5, left: 50 },
  { value: "glutea_d", label: "Região glútea direita", view: "back", top: 64.5, left: 46.5 },
  { value: "glutea_e", label: "Região glútea esquerda", view: "back", top: 64.5, left: 53.5 },
  { value: "calcaneo_d", label: "Calcâneo direito", view: "back", top: 104, left: 47 },
  { value: "calcaneo_e", label: "Calcâneo esquerdo", view: "back", top: 104, left: 53 }
];
const woundBodyHotspotsMisaligned = [
  { value: "ombro_d", label: "Ombro direito", view: "front", top: 17, left: 40 },
  { value: "ombro_e", label: "Ombro esquerdo", view: "front", top: 17, left: 60 },
  { value: "torax_d", label: "Hemitórax direito", view: "front", top: 28, left: 45 },
  { value: "torax_e", label: "Hemitórax esquerdo", view: "front", top: 28, left: 55 },
  { value: "abdome", label: "Abdome", view: "front", top: 43, left: 50 },
  { value: "quadril_d", label: "Quadril direito", view: "front", top: 56, left: 44.5 },
  { value: "quadril_e", label: "Quadril esquerdo", view: "front", top: 56, left: 55.5 },
  { value: "coxa_d", label: "Coxa direita", view: "front", top: 67, left: 45.5 },
  { value: "coxa_e", label: "Coxa esquerda", view: "front", top: 67, left: 54.5 },
  { value: "joelho_d", label: "Joelho direito", view: "front", top: 80, left: 46.5 },
  { value: "joelho_e", label: "Joelho esquerdo", view: "front", top: 80, left: 53.5 },
  { value: "perna_d", label: "Perna direita", view: "front", top: 91, left: 46.8 },
  { value: "perna_e", label: "Perna esquerda", view: "front", top: 91, left: 53.2 },
  { value: "tornozelo_d", label: "Tornozelo direito", view: "front", top: 97, left: 46.8 },
  { value: "tornozelo_e", label: "Tornozelo esquerdo", view: "front", top: 97, left: 53.2 },
  { value: "pe_d", label: "Pé direito", view: "front", top: 103, left: 44.8 },
  { value: "pe_e", label: "Pé esquerdo", view: "front", top: 103, left: 55.2 },
  { value: "amputacao_transtibial_d", label: "Coto transtibial direito", view: "front", top: 93.5, left: 46.8 },
  { value: "amputacao_transtibial_e", label: "Coto transtibial esquerdo", view: "front", top: 93.5, left: 53.2 },
  { value: "escapular_d", label: "Região escapular direita", view: "back", top: 23.5, left: 44.5 },
  { value: "escapular_e", label: "Região escapular esquerda", view: "back", top: 23.5, left: 55.5 },
  { value: "lombar", label: "Região lombar", view: "back", top: 41.5, left: 50 },
  { value: "trocanter_d", label: "Região trocantérica direita", view: "back", top: 57.5, left: 45 },
  { value: "trocanter_e", label: "Região trocantérica esquerda", view: "back", top: 57.5, left: 55 },
  { value: "sacral", label: "Região sacral", view: "back", top: 63.5, left: 50 },
  { value: "glutea_d", label: "Região glútea direita", view: "back", top: 67.5, left: 46.2 },
  { value: "glutea_e", label: "Região glútea esquerda", view: "back", top: 67.5, left: 53.8 },
  { value: "calcaneo_d", label: "Calcâneo direito", view: "back", top: 103, left: 46.7 },
  { value: "calcaneo_e", label: "Calcâneo esquerdo", view: "back", top: 103, left: 53.3 }
];
const woundBodyHotspots = [
  { value: "ombro_d", label: "Ombro direito", view: "front", top: 18.5, left: 44.5 },
  { value: "ombro_e", label: "Ombro esquerdo", view: "front", top: 18.5, left: 55.5 },
  { value: "torax_d", label: "Hemitórax direito", view: "front", top: 30.5, left: 47 },
  { value: "torax_e", label: "Hemitórax esquerdo", view: "front", top: 30.5, left: 53 },
  { value: "abdome", label: "Abdome", view: "front", top: 45.5, left: 50 },
  { value: "quadril_d", label: "Quadril direito", view: "front", top: 60.5, left: 47.5 },
  { value: "quadril_e", label: "Quadril esquerdo", view: "front", top: 60.5, left: 52.5 },
  { value: "coxa_d", label: "Coxa direita", view: "front", top: 73.5, left: 47.8 },
  { value: "coxa_e", label: "Coxa esquerda", view: "front", top: 73.5, left: 52.2 },
  { value: "joelho_d", label: "Joelho direito", view: "front", top: 86, left: 47.8 },
  { value: "joelho_e", label: "Joelho esquerdo", view: "front", top: 86, left: 52.2 },
  { value: "perna_d", label: "Perna direita", view: "front", top: 99, left: 48 },
  { value: "perna_e", label: "Perna esquerda", view: "front", top: 99, left: 52 },
  { value: "tornozelo_d", label: "Tornozelo direito", view: "front", top: 107.5, left: 48 },
  { value: "tornozelo_e", label: "Tornozelo esquerdo", view: "front", top: 107.5, left: 52 },
  { value: "pe_d", label: "Pé direito", view: "front", top: 112.5, left: 47.2 },
  { value: "pe_e", label: "Pé esquerdo", view: "front", top: 112.5, left: 52.8 },
  { value: "amputacao_transtibial_d", label: "Coto transtibial direito", view: "front", top: 100.5, left: 48 },
  { value: "amputacao_transtibial_e", label: "Coto transtibial esquerdo", view: "front", top: 100.5, left: 52 },
  { value: "escapular_d", label: "Região escapular direita", view: "back", top: 24.5, left: 46.5 },
  { value: "escapular_e", label: "Região escapular esquerda", view: "back", top: 24.5, left: 53.5 },
  { value: "lombar", label: "Região lombar", view: "back", top: 43.5, left: 50 },
  { value: "trocanter_d", label: "Região trocantérica direita", view: "back", top: 64, left: 47.2 },
  { value: "trocanter_e", label: "Região trocantérica esquerda", view: "back", top: 64, left: 52.8 },
  { value: "sacral", label: "Região sacral", view: "back", top: 71, left: 50 },
  { value: "glutea_d", label: "Região glútea direita", view: "back", top: 69, left: 47.5 },
  { value: "glutea_e", label: "Região glútea esquerda", view: "back", top: 69, left: 52.5 },
  { value: "calcaneo_d", label: "Calcâneo direito", view: "back", top: 111, left: 48.2 },
  { value: "calcaneo_e", label: "Calcâneo esquerdo", view: "back", top: 111, left: 51.8 }
];
const dressingOptionLabels = [
  "Aquacel",
  "Alginato",
  "Carvão ativado",
  "Acticoat",
  "Hidrogel",
  "Hidrocolóide",
  "Petrolato",
  "Allevyn",
  "Biatain",
  "Gazes estéreis",
  "Compressa estéril"
];

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildOptions(options, selected = "") {
  return options.map(([valueText, label]) => `<option value="${escapeHtml(valueText)}"${valueText === selected ? " selected" : ""}>${escapeHtml(label)}</option>`).join("");
}

function numericValue(id) {
  const raw = value(id);
  return raw === "" ? null : Number(raw);
}

function bodyFigureMarkup(view) {
  const alt = view === "front" ? "Silhueta humana assexuada em vista anterior" : "Silhueta humana assexuada em vista posterior";
  const src = view === "front" ? BODY_FRONT_IMAGE : BODY_BACK_IMAGE;
  return `
    <div class="body-reference-frame body-reference-frame--${view}">
      <img
        src="${src}"
        alt="${alt}"
        class="body-reference-image body-reference-image--${view}"
        loading="lazy"
        referrerpolicy="no-referrer"
      />
    </div>
  `;
}

function bodyMapMarkup(selected = "") {
  const selectedLabel = woundLocationMap[selected] || (selected === "other" ? "Outro local" : "Nenhum local selecionado");
  return `
    <div class="full body-picker-field">
      <div class="body-picker-header">
        <span>Local do curativo</span>
        <span class="body-picker-selection">${escapeHtml(selectedLabel)}</span>
      </div>
      <input type="hidden" data-field="location" value="${escapeHtml(selected)}" />
      <div class="body-picker-actions">
        <button type="button" class="secondary btn-open-body-map">Selecionar no mapa</button>
        <button type="button" class="ghost btn-clear-body-map">Limpar</button>
      </div>
    </div>
  `;
}

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

function sentenceCase(text) {
  if (!has(text)) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function repairMojibakeText(text) {
  let current = String(text ?? "");
  if (!/[ÃÂâ]/.test(current)) return current;

  for (let i = 0; i < 3; i++) {
    if (!/[ÃÂâ]/.test(current)) break;
    try {
      current = decodeURIComponent(escape(current));
    } catch {
      break;
    }
  }

  return current.replace(/\uFFFD+/g, "").trim();
}

function normalizeVisibleText(root = document) {
  root.querySelectorAll("label, legend, summary, p, h1, h2, h3, button, option, span, strong").forEach((el) => {
    if (el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE) {
      el.textContent = repairMojibakeText(el.textContent);
    }
  });

  root.querySelectorAll("input, textarea").forEach((el) => {
    if (el.placeholder) el.placeholder = repairMojibakeText(el.placeholder);
    if (el.value && ["button", "submit"].includes(el.type)) el.value = repairMojibakeText(el.value);
  });

  root.querySelectorAll("select option").forEach((option) => {
    option.textContent = repairMojibakeText(option.textContent);
    option.value = repairMojibakeText(option.value);
  });
}

function inferDiabetesRisk() {
  const text = lower([value("hpp"), value("dihDpo"), value("admissionHistory"), value("importantMeds")].join(" "));
  return ["diabetes", "dm ", "dm1", "dm2", "insulina", "glicem"].some((term) => text.includes(term));
}

function likelyPressureRisk() {
  return ["bedridden", "restrictedBed", "wheelchair", "wheelchairIndependent", "wheelchairDependent", "paraplegic", "tetraplegic", "reduced", "postOpLimited", "noWalk"].includes(value("mobility"))
    || value("skin") === "risk"
    || value("skin") === "lesion"
    || value("bradenClass").startsWith("Risco");
}

function isMobilityReduced() {
  return has(value("mobility")) && value("mobility") !== "walkAlone";
}

function isConductAutoField(id) {
  return CONDUCT_AUTO_IDS.includes(id);
}

function resetConductOverrides() {
  CONDUCT_AUTO_IDS.forEach((id) => {
    const el = $(id);
    if (el) delete el.dataset.manual;
  });
}

function markConductOverridesFromData(data = {}) {
  CONDUCT_AUTO_IDS.forEach((id) => {
    const el = $(id);
    if (!el || data[id] === undefined) return;
    el.dataset.manual = "true";
  });
}

function applySuggestedConduct(id, shouldCheck) {
  const el = $(id);
  if (!el || el.dataset.manual === "true") return;
  el.checked = Boolean(shouldCheck);
}

function bindAutoUpdate(root = document) {
  root.querySelectorAll("input, select, textarea").forEach((el) => {
    if (el.dataset.bound === "true") return;
    el.addEventListener("input", () => {
      if (el.type === "checkbox" && isConductAutoField(el.id)) {
        el.dataset.manual = "true";
      }
      toggleConditionals();
      generateEvolution();
    });
    el.addEventListener("change", () => {
      if (el.type === "checkbox" && isConductAutoField(el.id)) {
        el.dataset.manual = "true";
      }
      toggleConditionals();
      generateEvolution();
    });
    el.dataset.bound = "true";
  });
}

function woundEntries() {
  return Array.from(document.querySelectorAll(".wound-entry"));
}

function woundField(entry, name) {
  return entry.querySelector(`[data-field="${name}"]`);
}

function woundValue(entry, name) {
  return (woundField(entry, name)?.value || "").trim();
}

function makeWoundEntry(data = {}) {
  const entry = document.createElement("section");
  entry.className = "wound-entry";
  const primaryOptions = [["", ""], ...dressingOptionLabels.map((label) => [label, label]), ["other", "Outro"]];
  const occlusionOptions = [["", ""], ["micropore", "Micropore"], ["filme_transparente", "Filme transparente"], ["other", "Outro"]];
  const cleaningOptions = [["", ""], ["sf_0_9", "Soro fisiológico 0,9%"], ["phmb", "Solução de PHMB (poliexametileno biguanida)"], ["other", "Outro"]];
  const perilesionalOptions = [["", ""], ["clorexidina", "Clorexidina"], ["other", "Outro"]];
  entry.innerHTML = `
    <div class="wound-entry-header">
      <h3 class="wound-entry-title"></h3>
      <button type="button" class="ghost btn-remove-wound">Remover</button>
    </div>
    <div class="wound-entry-grid">
      <label>Status do curativo/lesão
        <select data-field="status">
          <option value=""></option>
          <option value="clean">Curativo limpo, seco e íntegro</option>
          <option value="dirty">Curativo com sujidade</option>
          <option value="wet">Curativo úmido</option>
          <option value="bleeding">Curativo com sangramento aparente</option>
          <option value="secretion">Curativo com secreção aparente</option>
          <option value="performed">Curativo realizado no plantão</option>
        </select>
      </label>
      ${bodyMapMarkup(data.location || "")}
      <label class="full conditional wound-other-location">Outro local
        <input data-field="locationOther" placeholder="Descreva o local do curativo" />
      </label>
      <label class="full">Sinais ao redor/aspecto da lesão
        <input data-field="signs" placeholder="Ex.: sem hiperemia, bordas íntegras, sem sinais flogísticos" />
      </label>
      <div class="full conditional wound-performed">
        <div class="wound-entry-grid">
          <label>Cobertura anterior
            <select data-field="previousCover">
              <option value=""></option>
              <option value="yes">Sim</option>
              <option value="no">Não</option>
            </select>
          </label>
          <label class="conditional wound-previous-covered">Tipo de exsudato
            <select data-field="exudateType">
              <option value=""></option>
              <option value="seroso">Seroso</option>
              <option value="serossanguinolento">Serossanguinolento</option>
              <option value="sanguinolento">Sanguinolento</option>
              <option value="purulento">Purulento</option>
              <option value="seropurulento">Seropurulento</option>
              <option value="fibrinoso">Fibrinoso</option>
            </select>
          </label>
          <label class="conditional wound-previous-covered">Quantidade
            <select data-field="exudateAmount">
              <option value=""></option>
              <option value="pequena">Pequena</option>
              <option value="moderada">Moderada</option>
              <option value="grande">Grande</option>
            </select>
          </label>
          <label class="conditional wound-previous-covered">Odor
            <select data-field="odor">
              <option value=""></option>
              <option value="yes">Sim</option>
              <option value="no">Não</option>
            </select>
          </label>
          <label>Leito da ferida
            <select data-field="bed">
              <option value=""></option>
              <option value="avermelhado">Avermelhado</option>
              <option value="rosado">Rosado</option>
              <option value="amarelo">Amarelo</option>
              <option value="enegrecido">Enegrecido</option>
            </select>
          </label>
          <label>Limpeza do leito da ferida
            <select data-field="cleaning">
              ${buildOptions(cleaningOptions, data.cleaning || "")}
            </select>
          </label>
          <label class="conditional wound-cleaning-other">Outra limpeza
            <input data-field="cleaningOther" placeholder="Descreva a limpeza do leito" />
          </label>
          <label>Limpeza da pele perilesional
            <select data-field="perilesionalCleaning">
              ${buildOptions(perilesionalOptions, data.perilesionalCleaning || "")}
            </select>
          </label>
          <label class="conditional wound-perilesional-other">Outro cuidado perilesional
            <input data-field="perilesionalOther" placeholder="Descreva o cuidado perilesional" />
          </label>
          <label>Cobertura primária
            <select data-field="primaryCover">
              ${buildOptions(primaryOptions, data.primaryCover || "")}
            </select>
          </label>
          <label class="conditional wound-primary-other">Outra cobertura primária
            <input data-field="primaryCoverOther" placeholder="Descreva a cobertura" />
          </label>
          <label>Cobertura secundária
            <select data-field="secondaryCover">
              ${buildOptions(primaryOptions, data.secondaryCover || "")}
            </select>
          </label>
          <label class="conditional wound-secondary-other">Outra cobertura secundária
            <input data-field="secondaryCoverOther" placeholder="Descreva a cobertura secundária" />
          </label>
          <label>Oclusão/fixação
            <select data-field="occlusion">
              ${buildOptions(occlusionOptions, data.occlusion || "")}
            </select>
          </label>
          <label class="conditional wound-occlusion-other">Outra oclusão/fixação
            <input data-field="occlusionOther" placeholder="Descreva a oclusão/fixação" />
          </label>
        </div>
      </div>
    </div>
  `;

  Object.entries(data).forEach(([name, fieldValue]) => {
    const field = woundField(entry, name);
    if (field) field.value = fieldValue;
  });

  entry.querySelector(".btn-remove-wound").addEventListener("click", () => {
    entry.remove();
    refreshWoundEntryTitles();
    toggleConditionals();
    generateEvolution();
  });

  bindAutoUpdate(entry);
  bindWoundLocationMap(entry);
  $("woundEntries").appendChild(entry);
  normalizeVisibleText(entry);
  return entry;
}

function refreshWoundEntryTitles() {
  woundEntries().forEach((entry, index) => {
    const title = entry.querySelector(".wound-entry-title");
    if (title) title.textContent = `Curativo ${index + 1}`;
    const removeButton = entry.querySelector(".btn-remove-wound");
    if (removeButton) removeButton.hidden = woundEntries().length === 1;
  });
}

function collectWounds() {
  return woundEntries().map((entry) => {
    const data = {};
    entry.querySelectorAll("[data-field]").forEach((field) => {
      data[field.dataset.field] = field.value;
    });
    return data;
  }).filter((item) => Object.values(item).some(has));
}

function fillWounds(items = []) {
  $("woundEntries").innerHTML = "";
  const source = items.length ? items : [{}];
  source.forEach((item) => makeWoundEntry(item));
  refreshWoundEntryTitles();
  toggleConditionals();
}

function resolveWoundLocation(entry) {
  const selected = woundValue(entry, "location");
  if (selected === "other") return woundValue(entry, "locationOther") || "local não especificado";
  return woundLocationMap[selected] || "local não especificado";
}

function resolvedWoundOption(entry, fieldName, otherFieldName) {
  const selected = woundValue(entry, fieldName);
  if (selected === "other") return woundValue(entry, otherFieldName);
  return selected;
}
function resolvedDrainOption(fieldName, otherFieldName) {
  const selected = value(fieldName);
  if (selected === "other") return value(otherFieldName);
  return selected;
}

function getDrainDressingAssessment() {
  const status = value("drainDressingStatus");
  const map = {
    clean: "limpa, seca e íntegra",
    dirty: "com sujidade",
    wet: "úmida",
    bleeding: "com sangramento aparente",
    secretion: "com secreção aparente",
    performed: "limpa, seca e íntegra após curativo realizado no plantão"
  };
  return map[status] || "em bom estado";
}

function getDrainDressingProcedureSentence() {
  if (value("drainDressingStatus") !== "performed") return "";

  const bedMap = {
    avermelhado: "Leito da ferida avermelhado",
    rosado: "Leito da ferida rosado",
    amarelo: "Leito da ferida amarelado",
    enegrecido: "Leito da ferida enegrecido"
  };
  const cleaningMap = {
    sf_0_9: "limpeza do leito com SF 0,9%",
    phmb: "limpeza do leito com solução de PHMB"
  };
  const perilesionalMap = {
    clorexidina: "limpeza da pele perilesional com clorexidina"
  };
  const occlusionMap = {
    micropore: "micropore",
    filme_transparente: "filme transparente"
  };

  const parts = ["Curativo do óstio do dreno realizado no plantão."];
  const previousCover = value("drainPreviousCover");
  if (previousCover === "yes") {
    const exudateType = value("drainExudateType") || "não especificado";
    const exudateAmount = value("drainExudateAmount") || "não especificada";
    const odor = value("drainOdor") === "yes" ? "com" : "sem";
    parts.push(`Ao retirar cobertura anterior, observado exsudato ${exudateType} em ${exudateAmount} quantidade, ${odor} odor fétido.`);
  } else if (previousCover === "no") {
    parts.push("Sem cobertura anterior no momento do procedimento.");
  }

  if (bedMap[value("drainBed")]) parts.push(`${bedMap[value("drainBed")]}.`);

  const careParts = [];
  const cleaning = resolvedDrainOption("drainCleaning", "drainCleaningOther");
  const perilesional = resolvedDrainOption("drainPerilesionalCleaning", "drainPerilesionalOther");
  if (cleaningMap[cleaning]) careParts.push(cleaningMap[cleaning]);
  else if (has(cleaning)) careParts.push(`limpeza do leito com ${cleaning}`);
  if (perilesionalMap[perilesional]) careParts.push(perilesionalMap[perilesional]);
  else if (has(perilesional)) careParts.push(perilesional);
  if (careParts.length) parts.push(`${sentenceCase(careParts.join(" e "))}.`);

  const coverParts = [];
  const primary = resolvedDrainOption("drainPrimaryCover", "drainPrimaryCoverOther");
  const secondary = resolvedDrainOption("drainSecondaryCover", "drainSecondaryCoverOther");
  const occlusion = resolvedDrainOption("drainOcclusion", "drainOcclusionOther");
  if (has(primary) && has(secondary)) {
    coverParts.push(`Aplicada cobertura primária com ${primary}`);
    coverParts.push(`cobertura secundária com ${secondary}`);
  } else if (has(primary)) {
    coverParts.push(`Aplicada cobertura com ${primary}`);
  } else if (has(secondary)) {
    coverParts.push(`Aplicada cobertura secundária com ${secondary}`);
  }
  if (has(occlusion)) coverParts.push(`Realizada oclusão com ${occlusionMap[occlusion] || occlusion}`);
  if (coverParts.length) parts.push(`${coverParts.join(" e ")}.`);

  return parts.join(" ");
}

function toggleWoundConditionals() {
  woundEntries().forEach((entry) => {
    const status = woundValue(entry, "status");
    const previousCover = woundValue(entry, "previousCover");
    const location = woundValue(entry, "location");
    const cleaning = woundValue(entry, "cleaning");
    const perilesional = woundValue(entry, "perilesionalCleaning");
    const primary = woundValue(entry, "primaryCover");
    const secondary = woundValue(entry, "secondaryCover");
    const occlusion = woundValue(entry, "occlusion");

    entry.querySelectorAll(".wound-performed").forEach((el) => el.classList.toggle("is-hidden", status !== "performed"));
    entry.querySelectorAll(".wound-previous-covered").forEach((el) => el.classList.toggle("is-hidden", !(status === "performed" && previousCover === "yes")));
    entry.querySelectorAll(".wound-other-location").forEach((el) => el.classList.toggle("is-hidden", location !== "other"));
    entry.querySelectorAll(".wound-cleaning-other").forEach((el) => el.classList.toggle("is-hidden", !(status === "performed" && cleaning === "other")));
    entry.querySelectorAll(".wound-perilesional-other").forEach((el) => el.classList.toggle("is-hidden", !(status === "performed" && perilesional === "other")));
    entry.querySelectorAll(".wound-primary-other").forEach((el) => el.classList.toggle("is-hidden", !(status === "performed" && primary === "other")));
    entry.querySelectorAll(".wound-secondary-other").forEach((el) => el.classList.toggle("is-hidden", !(status === "performed" && secondary === "other")));
    entry.querySelectorAll(".wound-occlusion-other").forEach((el) => el.classList.toggle("is-hidden", !(status === "performed" && occlusion === "other")));
  });
}

function syncWoundLocationUi(entry) {
  const selected = woundValue(entry, "location");
  const selection = entry.querySelector(".body-picker-selection");
  if (selection) {
    selection.textContent = woundLocationMap[selected] || (selected === "other" ? "Outro local" : "Nenhum local selecionado");
  }
}

let activeWoundEntry = null;
let pendingWoundLocation = "";

function renderBodyMapDialog(selected = "") {
  const selectedLabel = woundLocationMap[selected] || (selected === "other" ? "Outro local" : "Nenhum local selecionado");
  const renderHotspots = (view) => woundBodyHotspots
    .filter((spot) => spot.view === view)
    .map((spot) => `
      <button
        type="button"
        class="body-hotspot${spot.value === selected ? " is-active" : ""}"
        data-dialog-location-choice="${spot.value}"
        data-label="${escapeHtml(spot.label)}"
        style="top:${spot.top}%;left:${spot.left}%"
        aria-label="${escapeHtml(spot.label)}"
        title="${escapeHtml(spot.label)}"
      ></button>
    `).join("");

  $("bodyMapDialogContent").innerHTML = `
    <div class="body-map-field body-map-field-dialog">
      <div class="body-map-header">
        <span>Local do curativo</span>
        <span class="body-map-selection">${escapeHtml(selectedLabel)}</span>
      </div>
      <div class="body-map-grid">
        <div class="body-map-card">
          <span class="body-map-caption">Frente</span>
          <div class="body-figure body-figure-dialog">
            ${bodyFigureMarkup("front")}
            ${renderHotspots("front")}
          </div>
        </div>
        <div class="body-map-card">
          <span class="body-map-caption">Dorso</span>
          <div class="body-figure body-figure-dialog">
            ${bodyFigureMarkup("back")}
            ${renderHotspots("back")}
          </div>
        </div>
      </div>
      <div class="body-map-actions">
        <button type="button" class="ghost body-map-other${selected === "other" ? " is-active" : ""}" data-dialog-location-choice="other">Outro local</button>
        <button type="button" class="ghost body-map-clear" id="btnClearDialogBodyMap">Limpar seleção</button>
      </div>
    </div>
  `;
  bindBodyMapDialogHotspots();
}

function bindBodyMapDialogHotspots() {
  document.querySelectorAll("[data-dialog-location-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      pendingWoundLocation = button.dataset.dialogLocationChoice || "";
      renderBodyMapDialog(pendingWoundLocation);
    });
  });
  $("btnClearDialogBodyMap")?.addEventListener("click", () => {
    pendingWoundLocation = "";
    renderBodyMapDialog("");
  });
}

function openBodyMapDialog(entry) {
  activeWoundEntry = entry;
  pendingWoundLocation = woundValue(entry, "location");
  renderBodyMapDialog(pendingWoundLocation);
  $("bodyMapDialog").showModal();
}

function applyBodyMapDialogSelection() {
  if (!activeWoundEntry) return;
  const field = woundField(activeWoundEntry, "location");
  if (field) field.value = pendingWoundLocation;
  if (pendingWoundLocation !== "other") {
    const other = woundField(activeWoundEntry, "locationOther");
    if (other) other.value = "";
  }
  syncWoundLocationUi(activeWoundEntry);
  toggleConditionals();
  generateEvolution();
  $("bodyMapDialog").close();
}

function bindWoundLocationMap(entry) {
  entry.querySelector(".btn-open-body-map")?.addEventListener("click", () => openBodyMapDialog(entry));
  entry.querySelector(".btn-clear-body-map")?.addEventListener("click", () => {
    const field = woundField(entry, "location");
    const other = woundField(entry, "locationOther");
    if (field) field.value = "";
    if (other) other.value = "";
    syncWoundLocationUi(entry);
    toggleConditionals();
    generateEvolution();
  });
  syncWoundLocationUi(entry);
}

function getBradenCalculation() {
  const ids = ["bradenSensory", "bradenMoisture", "bradenActivity", "bradenMobilityCalc", "bradenNutrition", "bradenFriction"];
  const values = ids.map(numericValue);
  if (values.some((item) => item === null || Number.isNaN(item))) {
    return { complete: false, points: "", classification: "Preencher todos os itens" };
  }
  const total = values.reduce((sum, item) => sum + item, 0);
  let classification = "Sem risco para lesão por pressão";
  if (total <= 9) classification = "Risco muito alto para lesão por pressão";
  else if (total <= 12) classification = "Risco alto para lesão por pressão";
  else if (total <= 14) classification = "Risco moderado para lesão por pressão";
  else if (total <= 18) classification = "Risco leve para lesão por pressão";
  return { complete: true, points: String(total), classification };
}

function getMorseCalculation() {
  const ids = ["morseHistory", "morseSecondaryDiagnosis", "morseAmbulationAid", "morseIvAccess", "morseGait", "morseMentalStatus"];
  const values = ids.map(numericValue);
  if (values.some((item) => item === null || Number.isNaN(item))) {
    return { complete: false, points: "", classification: "Preencher todos os itens" };
  }
  const total = values.reduce((sum, item) => sum + item, 0);
  let classification = "Baixo risco para queda";
  if (total >= 45) classification = "Alto risco para queda";
  else if (total >= 25) classification = "Médio risco para queda";
  return { complete: true, points: String(total), classification };
}

function syncBradenSummary() {
  const result = getBradenCalculation();
  $("bradenCalcPoints").textContent = result.points || "-";
  $("bradenCalcClass").textContent = result.classification;
}

function syncMorseSummary() {
  const result = getMorseCalculation();
  $("morseCalcPoints").textContent = result.points || "-";
  $("morseCalcClass").textContent = result.classification;
}

function resetScaleFields(ids, syncFn) {
  ids.forEach((id) => {
    const el = $(id);
    if (el) el.value = "";
  });
  syncFn();
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
  return has(value("saturation")) ? `mantendo SatO2 ${value("saturation")}%` : "";
}

function flowText() {
  return has(value("oxygenFlow")) ? `a ${value("oxygenFlow")} L/min` : "";
}

function fio2Text() {
  return has(value("fio2")) ? `FiO2 ${value("fio2")}%` : "";
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
  if (allergyStatus === "no") lines.push("Alergias: Não refere alergias conhecidas.");
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
  if (has(braden)) lines.push(`Braden: ${braden}${has(bradenPts) ? `  ${bradenPts} pontos` : ""}.`);
  if (has(morse)) lines.push(`Morse: ${morse}${has(morsePts) ? `  ${morsePts} pontos` : ""}.`);
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
    nasal: `Em uso de O2 por cateter nasal ${flow}${add}.`,
    simpleMask: `Em uso de O2 por máscara simples ${flow}${add}.`,
    venturi: `Em uso de O2 por máscara de Venturi ${fio2}${add}.`,
    nonRebreather: `Em uso de O2 por máscara não reinalante ${flow}${add}. Paciente em observação quanto ao padrão respiratório.`,
    macro: `Em uso de macronebulização com O2 ${flow}${add}.`,
    tqtO2: `Traqueostomizado(a), em uso de O2 suplementar por TQT ${flow}${add}. Cânula pérvia, mantido(a) em observação.`,
    vni: `Em uso de ventilação não invasiva${has(obs) ? ` tipo ${obs}` : ""}${sat ? `, ${sat}` : ""}. Mantido(a) em observação quanto à adaptação e ao padrão respiratório.`,
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
    const catheter = urine === "svd" ? "sonda vesical de demora" : "sonda vesical de alvio";
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
  const suffix = dressing ? `, ${dressing}` : ", prvio, com fixao adequada, sem sinais flogsticos aparentes";

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
  const type = value("drainType");
  if (!has(type)) return "";

  const typeMap = {
    chestWaterSeal: "dreno de tórax em selo d'água",
    penrose: "Penrose",
    portovac: "Portovac / Redon",
    jacksonPratt: "Jackson-Pratt / JP",
    custom: value("drainTypeCustom") || "dreno personalizado"
  };

  const rawLocation = value("drainLocation");
  const loc = rawLocation === "custom"
    ? (value("drainLocationCustom") || "local no especificado")
    : (rawLocation || "local não especificado");
  const dressing = getDrainDressingAssessment();
  const dressingProcedure = getDrainDressingProcedureSentence();
  const amount = value("drainAmount") || "___";
  const aspect = value("drainAspect") || "não especificado";

  if (type === "chestWaterSeal") {
    const waterSeal = value("drainWaterSeal") || "não informada";
    const bubbling = value("drainBubbling") || "não informado";
    const connections = value("drainConnections") === "com" ? "com" : "sem";
    const base = `Mantém dreno de tórax em selo d'água em ${loc}, com sistema fechado, íntegro e mantido abaixo do nível do tórax. Observado débito de ${amount} ml, com aspecto ${aspect} no reservatório. Curativo em óstio de inserção com cobertura externa apresentando-se ${dressing}. Selo d'água com oscilação respiratória ${waterSeal} e borbulhamento ${bubbling} no momento. Conexões avaliadas, ${connections} sinais aparentes de desconexão, dobras, tração ou acotovelamento. Paciente mantido(a) em observação quanto ao débito, aspecto da secreção, fixação do dreno, permeabilidade do sistema e integridade do curativo.`;
    return dressingProcedure ? `${base} ${dressingProcedure}` : base;
  }

  return `Mantém ${typeMap[type]} em ${loc}. Observado débito de ${amount} ml, com aspecto ${aspect}. Curativo em óstio de inserção com cobertura externa apresentando-se ${dressing}. Paciente mantido(a) em observação quanto ao débito, aspecto da secreção, fixação do dreno, permeabilidade do sistema e integridade do curativo.${dressingProcedure ? ` ${dressingProcedure}` : ""}`;
}

function getWoundSentence() {
  const bedMap = {
    avermelhado: "Lesão com leito avermelhado, viável, com aspecto de tecido de granulação, sem áreas de necrose aparente, sem sangramento ativo no momento.",
    rosado: "Lesão com leito rosado, aspecto viável, discretamente úmido, sem presença aparente de necrose, fibrina ou sangramento ativo no momento.",
    amarelo: "Lesão com leito parcialmente amarelado, com presença de fibrina/esfacelo, sem sangramento ativo no momento.",
    enegrecido: "Lesão com leito enegrecido, sugestivo de tecido desvitalizado/necrose, sem sangramento ativo no momento."
  };
  const cleaningMap = {
    sf_0_9: "Realizada limpeza do leito da ferida com SF 0,9%",
    phmb: "Realizada limpeza do leito da ferida com solução de PHMB"
  };
  const perilesionalMap = {
    clorexidina: "antissepsia da pele perilesional com clorexidina"
  };
  const occlusionMap = {
    micropore: "micropore",
    filme_transparente: "filme transparente"
  };

  const items = collectWounds();

  const parts = items.map((item) => {
    const entry = {
      querySelector: (selector) => {
        const match = /\[data-field="(.+)"\]/.exec(selector);
        return match ? { value: item[match[1]] || "" } : null;
      }
    };
    const status = woundValue(entry, "status");
    if (!has(status)) return "";
    const loc = resolveWoundLocation(entry);
    const signs = woundValue(entry, "signs");

    if (status === "clean") return `Curativo em região de ${loc}, com cobertura externa limpa, seca e íntegra, sem sinais de sangramento, secreção ou sujidade aparente${signs ? `, ${signs}` : ""}.`;
    if (status === "dirty") return `Curativo em região de ${loc}, com cobertura externa apresentando sujidade, sem sangramento ativo aparente${signs ? `, ${signs}` : ""}. Equipe de enfermagem comunicada para avaliação da cobertura e realização de troca conforme necessidade/rotina do setor.`;
    if (status === "wet") return `Curativo em região de ${loc}, com cobertura externa úmida${signs ? `, ${signs}` : ""}. Equipe de enfermagem comunicada para avaliação e troca conforme necessidade/rotina do setor.`;
    if (status === "bleeding") return `Curativo em região de ${loc}, com presença de sangramento aparente em cobertura externa${signs ? `, ${signs}` : ""}. Equipe responsável comunicada e paciente mantido(a) em observação.`;
    if (status === "secretion") return `Curativo em região de ${loc}, com presença de secreção aparente em cobertura externa${signs ? `, ${signs}` : ""}. Equipe responsável comunicada para avaliação e conduta.`;

    if (status === "performed") {
      const previousCover = woundValue(entry, "previousCover");
      const exudateType = woundValue(entry, "exudateType");
      const exudateAmount = woundValue(entry, "exudateAmount");
      const odor = woundValue(entry, "odor");
      const bed = woundValue(entry, "bed");
      const cleaning = resolvedWoundOption(entry, "cleaning", "cleaningOther");
      const perilesional = resolvedWoundOption(entry, "perilesionalCleaning", "perilesionalOther");
      const primaryCover = resolvedWoundOption(entry, "primaryCover", "primaryCoverOther");
      const secondary = resolvedWoundOption(entry, "secondaryCover", "secondaryCoverOther");
      const occlusion = resolvedWoundOption(entry, "occlusion", "occlusionOther");
      const fragments = [`Realizado curativo em região de ${loc}.`];

      if (previousCover === "yes") {
        fragments.push(`Ao retirar cobertura anterior, observado exsudato ${exudateType || "no especificado"} em ${exudateAmount || "no especificada"} quantidade, ${odor === "yes" ? "com" : "sem"} odor ftido.`);
      } else if (previousCover === "no") {
        fragments.push("Sem cobertura anterior no momento do procedimento.");
      }

      if (bedMap[bed]) fragments.push(bedMap[bed]);
      if (signs) fragments.push(endWithPeriod(sentenceCase(signs)));

      const careParts = [];
      if (cleaningMap[cleaning]) careParts.push(cleaningMap[cleaning]);
      else if (has(cleaning)) careParts.push(`Realizada limpeza do leito da ferida com ${cleaning}`);

      if (perilesionalMap[perilesional]) careParts.push(perilesionalMap[perilesional]);
      else if (has(perilesional)) careParts.push(perilesional);

      if (careParts.length) fragments.push(`${sentenceCase(careParts.join(" e "))}.`);

      const coverParts = [];
      if (has(primaryCover) && has(secondary)) {
        coverParts.push(`Aplicada cobertura primária com ${primaryCover}`);
        coverParts.push(`cobertura secundária com ${secondary}`);
      } else if (has(primaryCover)) {
        coverParts.push(`Aplicada cobertura com ${primaryCover}`);
      } else if (has(secondary)) {
        coverParts.push(`Aplicada cobertura secundária com ${secondary}`);
      }
      if (has(occlusion)) coverParts.push(`Realizada oclusão com ${occlusionMap[occlusion] || occlusion}, mantendo curativo limpo, seco e bem fixado`);

      if (coverParts.length) fragments.push(`${coverParts.join(" e ")}.`);
      fragments.push("Paciente orientado e segue aos cuidados da equipe de enfermagem.");
      return fragments.join(" ");
    }

    return "";
  }).filter(has);

  return parts.join(" ");
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
    intact: `Pele ntegra nas demais reas avaliadas${obs ? `, ${obs}` : ", sem leses aparentes"}.`,
    risk: `Pele com risco aumentado para leso por presso${obs ? `, ${obs}` : ""}. Mantidas medidas preventivas conforme rotina assistencial.`,
    lesion: `Apresenta alterao/leso de pele${obs ? `: ${endWithPeriod(obs)}` : "."}`
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
  const wounds = collectWounds();
  const hasWound = wounds.length > 0;
  const infection = value("accessType") && value("accessType") !== "none" || has(value("drainType")) || hasWound || ["sne", "sng", "gtt", "jjt", "npt", "npp"].includes(value("feedingRoute"));
  const skin = ["Risco leve", "Risco moderado", "Risco alto", "Risco muito alto"].some((risk) => value("bradenClass").startsWith(risk)) || ["bedridden", "restrictedBed", "wheelchair", "wheelchairIndependent", "wheelchairDependent", "paraplegic", "tetraplegic", "reduced"].includes(value("mobility")) || hasWound || value("skin") === "risk" || value("skin") === "lesion";
  const falls = lower(value("morseClass")).includes("médio") || lower(value("morseClass")).includes("alto") || ["walkHelp", "walker", "crutch", "cane", "wheelchair", "wheelchairIndependent", "wheelchairDependent", "unstable", "fallRisk", "postOpLimited"].includes(value("mobility"));
  const pain = value("painStatus") === "yesRoutine" || value("painStatus") === "yesMedical" || ["alteredWithImmobilization", "alteredWithoutImmobilization", "tractionAltered"].includes(value("orthoType"));
  const perfusion = has(value("orthoType")) || ["postOpLimited", "limping"].includes(value("mobility"));
  const tissue = hasWound || value("skin") === "lesion";
  const mobility = isMobilityReduced();
  const glycemia = inferDiabetesRisk();
  const selfCare = ["wheelchairDependent", "bedridden", "restrictedBed", "reduced", "tetraplegic", "paraplegic", "postOpLimited", "noWalk"].includes(value("mobility"));
  const pressure = likelyPressureRisk();
  return { infection, skin, falls, pain, perfusion, tissue, mobility, glycemia, selfCare, pressure };
}

function getDiagnosesSection() {
  const items = [];
  if (checked("diagInfection")) items.push("Risco de infecção.");
  if (checked("diagSkin")) items.push("Risco de integridade da pele prejudicada.");
  if (checked("diagFalls")) items.push("Risco de quedas.");
  if (checked("diagPain")) {
    items.push(value("painStatus") === "yesRoutine" || value("painStatus") === "yesMedical" ? "Dor aguda." : "Risco de dor aguda.");
  }
  if (checked("diagPerfusion")) items.push("Risco de alteração da perfusão periférica em membro acometido/imobilizado.");
  if (checked("diagTissue")) items.push("Integridade tissular prejudicada.");
  if (checked("diagMobility")) items.push("Mobilidade física prejudicada.");
  if (checked("diagGlycemia")) items.push("Risco de glicemia instável.");
  if (checked("diagSelfCare")) items.push("Déficit no autocuidado para higiene/conforto.");
  if (checked("diagPressure")) items.push("Risco de lesão por pressão, relacionado à mobilidade reduzida e permanência prolongada em leito/cadeira de rodas.");
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
    ["condObservation", "Manter paciente em observação conforme rotina do setor"],
    ["condHemodynamic", "Manter vigilância hemodinâmica"],
    ["condPainReport", "Monitorar queixas álgicas e comunicar equipe médica se necessário"],
    ["condRespiratory", "Observar padrão respiratório e sinais de desconforto respiratório"],
    ["condHeadboard", "Manter cabeceira elevada, conforme tolerância"],
    ["condDietAcceptance", "Observar aceitação da dieta"],
    ["condGlycemia", "Monitorar glicemia capilar conforme rotina/prescrição"],
    ["condStump", "Observar curativo em coto cirúrgico quanto à presença de sangramento, secreção, sujidade, odor, dor local ou sinais flogísticos"],
    ["condAvp", "Manter AVP pérvio e observar sinais de flebite/infiltração"],
    ["condPressurePrevention", "Manter medidas de prevenção de lesão por pressão conforme risco avaliado"],
    ["condReposition", "Orientar mudança frequente de posição, alívio de pressão e inspeção da pele"],
    ["condSkinCare", "Manter pele limpa, seca e hidratada, conforme necessidade"],
    ["condFallsMorse", "Manter medidas de prevenção de quedas conforme risco pela Escala de Morse"],
    ["condTransfers", "Orientar cuidado durante transferências, banho em cadeira higiênica e deslocamentos em cadeira de rodas"],
    ["condSafeEnvironment", "Manter ambiente seguro, com pertences ao alcance e rodas da cadeira travadas durante transferências"],
    ["condSvdDiuresis", "Monitorar diurese por SVD, aspecto, coloração e débito urinário"],
    ["condSvdCare", "Manter cuidados com SVD e bolsa coletora abaixo do nível da bexiga"]
  ];
  const selected = map.filter(([id]) => checked(id)).map(([, text]) => text);
  if (!selected.length) return "";
  return `Cuidados/Conduta de enfermagem:\n${selected.map((item) => `- ${item};`).join("\n")}`;
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
  const shouldSkin = value("skin") || collectWounds().length || value("bradenClass");
  const shouldAccess = value("accessType") && value("accessType") !== "none" || has(value("drainType"));
  const shouldOrtho = value("orthoType") || ["postOpLimited", "limping", "reduced"].includes(value("mobility"));
  const shouldPressure = likelyPressureRisk();
  const shouldGlycemia = inferDiabetesRisk();
  const shouldResp = has(value("oxygenType")) || checked("dyspnea") || checked("tachypnea") || checked("tirage") || checked("cyanosis");
  const shouldHeadboard = ["sne", "sng", "gtt", "jjt"].includes(value("feedingRoute")) || shouldResp;
  const shouldTransfers = ["wheelchair", "wheelchairIndependent", "wheelchairDependent", "reduced", "postOpLimited", "noWalk"].includes(value("mobility"));
  const shouldSvd = value("urine") === "svd";
  const shouldAvp = value("accessType") === "avp";
  const shouldStump = collectWounds().some((item) => lower(`${item.location || ""} ${item.locationOther || ""}`).includes("amput"));

  applySuggestedConduct("condPain", shouldPain);
  applySuggestedConduct("condFalls", shouldFalls);
  applySuggestedConduct("condDiet", shouldDiet);
  applySuggestedConduct("condElim", shouldElim);
  applySuggestedConduct("condSkin", shouldSkin);
  applySuggestedConduct("condAccess", shouldAccess);
  applySuggestedConduct("condOrtho", shouldOrtho);
  applySuggestedConduct("condConsciousness", value("consciousness") && value("consciousness") !== "bom");
  applySuggestedConduct("condPainReport", shouldPain);
  applySuggestedConduct("condRespiratory", shouldResp);
  applySuggestedConduct("condHeadboard", shouldHeadboard);
  applySuggestedConduct("condDietAcceptance", shouldDiet);
  applySuggestedConduct("condGlycemia", shouldGlycemia);
  applySuggestedConduct("condStump", shouldStump);
  applySuggestedConduct("condAvp", shouldAvp);
  applySuggestedConduct("condPressurePrevention", shouldPressure);
  applySuggestedConduct("condReposition", shouldPressure);
  applySuggestedConduct("condSkinCare", shouldPressure);
  applySuggestedConduct("condFallsMorse", shouldFalls);
  applySuggestedConduct("condTransfers", shouldTransfers);
  applySuggestedConduct("condSafeEnvironment", shouldTransfers);
  applySuggestedConduct("condSvdDiuresis", shouldSvd);
  applySuggestedConduct("condSvdCare", shouldSvd);
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
    "Segue aos cuidados da equipe multiprofissional.",
    getDiagnosesSection(),
    getConductsSection(),
    getPendingSection(),
    value("signature") || DEFAULT_SIGNATURE
  ].filter(has);

  const text = repairMojibakeText(sections.join("\n\n").replace(/\n{3,}/g, "\n\n").trim());
  $("output").value = text;
  $("statusBadge").textContent = text.length ? "gerado" : "rascunho";
}

function toggleConditionals() {
  document.querySelectorAll(".conditional[data-show]").forEach((el) => {
    const [field, expected] = el.dataset.show.split(":");
    const expectedValues = expected.split(",");
    el.classList.toggle("is-hidden", !expectedValues.includes(value(field)));
  });
  toggleWoundConditionals();
}

function collectForm() {
  const data = {};
  ids.forEach((id) => {
    const el = $(id);
    if (!el) return;
    if (el.type === "checkbox") data[id] = el.checked;
    else data[id] = el.value;
  });
  data[WOUND_STORAGE_KEY] = collectWounds();
  return data;
}

function fillForm(data, options = {}) {
  resetConductOverrides();
  ids.forEach((id) => {
    const el = $(id);
    if (!el || data[id] === undefined) return;
    if (el.type === "checkbox") el.checked = Boolean(data[id]);
    else el.value = data[id];
  });
  if (options.preserveConductChoices) {
    markConductOverridesFromData(data);
  }
  fillWounds(data[WOUND_STORAGE_KEY] || []);
  if (!has(value("signature"))) $("signature").value = DEFAULT_SIGNATURE;
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
  fillForm(JSON.parse(raw), { preserveConductChoices: true });
  $("statusBadge").textContent = "rascunho carregado";
}

function clearForm() {
  if (!confirm("Deseja limpar todos os campos?")) return;
  resetConductOverrides();
  ids.forEach((id) => {
    const el = $(id);
    if (!el) return;
    if (["hospital", "sector", "shift"].includes(id)) return;
    if (el.type === "checkbox") el.checked = CONDUCT_DEFAULT_IDS.includes(id);
    else el.value = "";
  });
  fillWounds([]);
  $("signature").value = DEFAULT_SIGNATURE;
  toggleConditionals();
  generateEvolution();
}

function applyDefaultPatient() {
  resetConductOverrides();
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
    signature: value("signature") || DEFAULT_SIGNATURE,
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
  bindAutoUpdate(document);
  normalizeVisibleText(document);

  $("btnDefault").addEventListener("click", applyDefaultPatient);
  $("btnClear").addEventListener("click", clearForm);
  $("btnCopy").addEventListener("click", copyOutput);
  $("btnSave").addEventListener("click", saveDraft);
  $("btnLoad").addEventListener("click", loadDraft);
  $("btnTxt").addEventListener("click", downloadTxt);
  $("btnAddWound").addEventListener("click", () => {
    makeWoundEntry({});
    refreshWoundEntryTitles();
    toggleConditionals();
    generateEvolution();
  });
  $("btnCalcBraden").addEventListener("click", () => {
    syncBradenSummary();
    $("bradenDialog").showModal();
  });
  $("btnCalcMorse").addEventListener("click", () => {
    syncMorseSummary();
    $("morseDialog").showModal();
  });
  $("btnCloseBraden").addEventListener("click", () => $("bradenDialog").close());
  $("btnCloseMorse").addEventListener("click", () => $("morseDialog").close());
  $("btnResetBraden").addEventListener("click", () => resetScaleFields(["bradenSensory", "bradenMoisture", "bradenActivity", "bradenMobilityCalc", "bradenNutrition", "bradenFriction"], syncBradenSummary));
  $("btnResetMorse").addEventListener("click", () => resetScaleFields(["morseHistory", "morseSecondaryDiagnosis", "morseAmbulationAid", "morseIvAccess", "morseGait", "morseMentalStatus"], syncMorseSummary));
  $("btnCloseBodyMap").addEventListener("click", () => $("bodyMapDialog").close());
  $("btnCancelBodyMap").addEventListener("click", () => $("bodyMapDialog").close());
  $("btnApplyBodyMap").addEventListener("click", applyBodyMapDialogSelection);
  $("btnApplyBraden").addEventListener("click", () => {
    const result = getBradenCalculation();
    if (!result.complete) return;
    $("bradenPoints").value = result.points;
    $("bradenClass").value = result.classification;
    $("bradenDialog").close();
    toggleConditionals();
    generateEvolution();
  });
  $("btnApplyMorse").addEventListener("click", () => {
    const result = getMorseCalculation();
    if (!result.complete) return;
    $("morsePoints").value = result.points;
    $("morseClass").value = result.classification;
    $("morseDialog").close();
    toggleConditionals();
    generateEvolution();
  });
  ["bradenSensory", "bradenMoisture", "bradenActivity", "bradenMobilityCalc", "bradenNutrition", "bradenFriction"].forEach((id) => {
    $(id).addEventListener("change", syncBradenSummary);
  });
  ["morseHistory", "morseSecondaryDiagnosis", "morseAmbulationAid", "morseIvAccess", "morseGait", "morseMentalStatus"].forEach((id) => {
    $(id).addEventListener("change", syncMorseSummary);
  });

  fillWounds([]);
  if (!has(value("signature"))) $("signature").value = DEFAULT_SIGNATURE;
  $("signature").value = repairMojibakeText($("signature").value);
  syncBradenSummary();
  syncMorseSummary();
  toggleConditionals();
  generateEvolution();
  normalizeVisibleText(document);
}

init();
