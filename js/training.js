
"use strict";

const STAT_LABELS = { hp: "HP", attack: "攻撃", defense: "防御", "special-attack": "特攻", "special-defense": "特防", speed: "素早さ" };
const POWER_ITEMS = { none: { name: "なし", stat: null, bonus: 0 }, hp: { name: "パワーウエイト", stat: "hp", bonus: 4 }, attack: { name: "パワーリスト", stat: "attack", bonus: 4 }, defense: { name: "パワーベルト", stat: "defense", bonus: 4 }, "special-attack": { name: "パワーレンズ", stat: "special-attack", bonus: 4 }, "special-defense": { name: "パワーバンド", stat: "special-defense", bonus: 4 }, speed: { name: "パワーアンクル", stat: "speed", bonus: 4 } };
const NATURES = [
    ["がんばりや", null, null], ["さみしがり", "attack", "defense"], ["ゆうかん", "attack", "speed"], ["いじっぱり", "attack", "special-attack"], ["やんちゃ", "attack", "special-defense"],
    ["ずぶとい", "defense", "attack"], ["すなお", null, null], ["のんき", "defense", "speed"], ["わんぱく", "defense", "special-attack"], ["のうてんき", "defense", "special-defense"],
    ["おくびょう", "speed", "attack"], ["せっかち", "speed", "defense"], ["ようき", "speed", "special-attack"], ["むじゃき", "speed", "special-defense"], ["てれや", null, null],
    ["ひかえめ", "special-attack", "attack"], ["おっとり", "special-attack", "defense"], ["れいせい", "special-attack", "speed"], ["うっかりや", "special-attack", "special-defense"], ["まじめ", null, null],
    ["おだやか", "special-defense", "attack"], ["おとなしい", "special-defense", "defense"], ["なまいき", "special-defense", "speed"], ["しんちょう", "special-defense", "special-attack"], ["きまぐれ", null, null]
];
const TYPE_STYLES = { normal: ["ノーマル", "#9299a3", "#f0f1f3"], fire: ["ほのお", "#e76c35", "#fff0e6"], water: ["みず", "#3986d7", "#e8f3ff"], electric: ["でんき", "#c99b08", "#fff8d9"], grass: ["くさ", "#4d9d55", "#eaf7e8"], ice: ["こおり", "#55aeb7", "#e6f9fa"], fighting: ["かくとう", "#b94c43", "#ffebe8"], poison: ["どく", "#9b65b2", "#f6eafd"], ground: ["じめん", "#b58b46", "#f8efdf"], flying: ["ひこう", "#8299d7", "#edf1ff"], psychic: ["エスパー", "#d75b87", "#fff0f5"], bug: ["むし", "#8b9b35", "#f3f6df"], rock: ["いわ", "#a08b60", "#f4efe4"], ghost: ["ゴースト", "#7863a8", "#f0ebfa"], dragon: ["ドラゴン", "#6b63c9", "#efedff"], dark: ["あく", "#625b62", "#efedef"], steel: ["はがね", "#7e9aa6", "#eaf1f4"] };
const TYPE_ALIASES = Object.fromEntries(Object.entries(TYPE_STYLES).map(([key, val]) => [val[0], key]));

// 参考サイトの表に掲載された行のみを登録。1行=1ポケモン・1出現場所。
// version: "heartgold" / "soulsilver" は片方限定。省略時は共通扱い。
// Lvや備考が原表で空欄のものは、推測して補完しない。
const EFFORT_SPOTS = [
    ["hp", "ヤドン", "ヤドンのいど", "なみのり", "5～25", 1, ""],
    ["hp", "ホーホー", "しぜんこうえん", "草むら", "10・12", 1, "夜"],
    ["hp", "ウパー", "アルフのいせき", "なみのり", "10～20", 1, ""],
    ["hp", "ヌオー", "アルフのいせき", "なみのり", "10～25", 2, ""],
    ["hp", "ベトベター", "タマムシシティ", "なみのり", "15 または 20", 1, "ベトベトンは攻撃の努力値も+1されるため注意"],
    ["attack", "トサキント", "9・10ばんどうろ", "なみのり", "10・15", 1, ""],
    ["attack", "アズマオウ", "9・10ばんどうろ", "なみのり", "15", 2, ""],
    ["attack", "トサキント", "24ばんどうろ", "なみのり", "5・10", 1, ""],
    ["attack", "アズマオウ", "24ばんどうろ", "なみのり", "10", 2, ""],
    ["attack", "アズマオウ", "スリバチやま", "なみのり", "15～25", 2, "入ってすぐの部屋"],
    ["attack", "トサキント", "スリバチやま", "なみのり", "10～25", 1, "入ってすぐの部屋"],
    ["attack", "アズマオウ", "シロガネやま どうくつ", "なみのり", "30～44", 2, "どうくつ内の水上ならどこでも可"],
    ["defense", "ゴローン", "45ばんどうろ", "草むら", "23～27", 2, "ゴマゾウ・ヒメグマも出現する"],
    ["defense", "グライガー", "45ばんどうろ", "草むら", "", 1, "ハートゴールド限定。ゴマゾウ・ヒメグマも出現する", "heartgold"],
    ["defense", "エアームド", "45ばんどうろ", "草むら", "", 2, "ソウルシルバー限定。ゴマゾウ・ヒメグマも出現する", "soulsilver"],
    ["special-attack", "コダック", "35ばんどうろ", "なみのり", "10～25", 1, ""],
    ["special-attack", "ゴルダック", "35ばんどうろ", "なみのり", "15～31", 2, ""],
    ["special-attack", "メリープ", "43ばんどうろ", "草むら", "15", 1, ""],
    ["special-attack", "モココ", "43ばんどうろ", "草むら", "15～17", 2, ""],
    ["special-attack", "キリンリキ", "43ばんどうろ", "草むら", "15", 2, ""],
    ["special-attack", "ゴース", "マダツボミのとう 2・3F", "ランダムエンカウント", "3～6", 1, "夜"],
    ["special-defense", "メノクラゲ", "40・41ばんすいどう", "なみのり", "14～25", 1, ""],
    ["special-defense", "ドククラゲ", "40・41ばんすいどう", "なみのり", "14～24", 2, ""],
    ["special-defense", "メノクラゲ", "25ばんどうろ", "なみのり", "15・20", 1, ""],
    ["special-defense", "ドククラゲ", "25ばんどうろ", "なみのり", "25・30", 2, ""],
    ["special-defense", "メノクラゲ", "クチバシティ", "なみのり", "30・35", 1, ""],
    ["special-defense", "ドククラゲ", "クチバシティ", "なみのり", "35", 2, ""],
    ["speed", "コイキング", "ワカバタウン", "ボロのつりざお", "10", 1, "まれにメノクラゲが出現"],
    ["speed", "コラッタ", "マダツボミのとう 2・3F", "ランダムエンカウント", "3～6", 1, "朝・昼は100%"],
    ["speed", "コイキング", "いかりのみずうみ", "なみのり", "8～20", 1, "まれにギャラドス（攻撃+2）が出現"],
    ["speed", "コラッタ", "スズのとう", "記載なし", "20", 1, ""],
    ["speed", "コイキング", "フスベシティ", "なみのり／すごいつりざお", "2～40", 1, ""],
    ["speed", "ディグダ", "ディグダのあな", "記載なし", "12～30", 1, "まれにダグトリオ（素早さ+2）が出現"],
    ["speed", "ニョロモ", "シロガネやま", "なみのり", "30～40", 1, "ポケモンセンターのそばの池"],
    ["speed", "ニョロゾ", "シロガネやま", "なみのり", "30～48", 2, "ポケモンセンターのそばの池"],
    ["speed", "コラッタ", "9ばんどうろ", "記載なし", "13～15", 1, "HGはマンキーが出るため不向き"],
    ["speed", "ラッタ", "9ばんどうろ", "記載なし", "13～15", 2, "HGはマンキーが出るため不向き"],
    ["speed", "オニスズメ", "9ばんどうろ", "記載なし", "13～15", 1, "HGはマンキーが出るため不向き"],
    ["speed", "オニドリル", "9ばんどうろ", "記載なし", "13～15", 2, "HGはマンキーが出るため不向き"],
    ["speed", "コラッタ", "1ばんどうろ", "記載なし", "2～3", 1, "夜はホーホーが大量に出るため不向き"],
    ["speed", "ポッポ", "1ばんどうろ", "記載なし", "2～3", 1, "夜はホーホーが大量に出るため不向き"],
    ["speed", "ニョロモ", "キキョウシティ", "なみのり", "10～25", 1, "まれにニョロゾ（素早さ+2）が出現"]
].map(([stat, name, area, method, level, effort, note, version]) => ({ stat, name, area, method, level, effort, note, version: version || "both" }));

let pokemonList = [];
function escapeHTML(value) { return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]); }
function renderNatures() {
    const body = document.getElementById("natureTableBody"), up = document.getElementById("natureUpFilter").value, down = document.getElementById("natureDownFilter").value;
    const filtered = NATURES.filter(([, u, d]) => (up === "all" || up === (u || "none")) && (down === "all" || down === (d || "none")));
    const cell = (stat, direction) => stat ? `<span class="nature-cell ${direction}">${direction === "up" ? "▲" : "▼"} ${escapeHTML(STAT_LABELS[stat])}</span>` : '<span class="nature-cell neutral">● 補正なし</span>';
    body.innerHTML = filtered.map(([name, u, d]) => `<tr><td>${escapeHTML(name)}</td><td>${cell(u, "up")}</td><td>${cell(d, "down")}</td></tr>`).join("");
    document.getElementById("natureCount").textContent = `${filtered.length}件表示（全25種類）`;
}
function pokemonByName(name) { return pokemonList.find(p => p.name === name) || null; }
function pokemonTypes(pokemon) {
    const raw = pokemon?.types ?? pokemon?.type ?? [];
    return (Array.isArray(raw) ? raw : [raw]).map(t => typeof t === "object" ? (t.name || t.type || t.type_name) : t).map(t => TYPE_STYLES[String(t).toLowerCase()] ? String(t).toLowerCase() : TYPE_ALIASES[t]).filter(Boolean).slice(0, 2);
}
function renderRecommendations() {
    const stat = document.getElementById("effortStat").value, version = document.getElementById("effortVersion").value;
    const rows = EFFORT_SPOTS.filter(s => s.stat === stat && (version === "both" || s.version === "both" || s.version === version));
    document.getElementById("effortStatus").textContent = `${STAT_LABELS[stat]}の特訓スポット：${rows.length}件（参考サイト掲載分）`;
    document.getElementById("effortResults").innerHTML = rows.map(s => {
        const p = pokemonByName(s.name), types = pokemonTypes(p), style = TYPE_STYLES[types[0]] || ["", "#8993a3", "#f0f2f5"];
        const sprite = p?.sprite ? `<img src="${escapeHTML(p.sprite)}" alt="${escapeHTML(s.name)}" loading="lazy">` : "";
        const no = p?.id ? `<div class="pokemon-number">全国図鑑 No.${String(p.id).padStart(3, "0")}</div>` : "";
        const tags = types.map(t => `<span class="type-tag" style="background:${TYPE_STYLES[t][1]}">${TYPE_STYLES[t][0]}</span>`).join("");
        const v = s.version === "heartgold" ? "HG限定" : s.version === "soulsilver" ? "SS限定" : "HG・SS";
        return `<article class="pokemon-card" style="--type-color:${style[1]};--type-soft:${style[2]}">
   ${sprite}${no}<h3>${escapeHTML(s.name)}</h3><div class="pokemon-types">${tags}</div>
   <p class="effort-value">${escapeHTML(STAT_LABELS[stat])} +${s.effort}</p>
   <p><strong>出現場所：</strong>${escapeHTML(s.area)}</p>
   <p><strong>出現方法：</strong>${escapeHTML(s.method)}</p>
   <p><strong>レベル：</strong>${escapeHTML(s.level || "参考サイトに記載なし")}</p>
   <p><strong>バージョン：</strong>${v}</p>
   ${s.note ? `<p class="effort-note"><strong>備考：</strong>${escapeHTML(s.note)}</p>` : ""}
   </article>`;
    }).join("");
}
function fillPokemonSelect() {
    const select = document.getElementById("calculatorPokemon");
    select.innerHTML = '<option value="">ポケモンを選択</option>' + [...pokemonList].sort((a, b) => a.id - b.id).map(p => `<option value="${Number(p.id)}">No.${String(p.id).padStart(3, "0")} ${escapeHTML(p.name)}</option>`).join("");
}
function getTargetEffort() {
    const select = document.getElementById("targetEffort"), wrap = document.getElementById("customTargetWrap");
    wrap.classList.toggle("hidden", select.value !== "custom");
    if (select.value !== "custom") return Number(select.value);
    const val = Number(document.getElementById("customTarget").value);
    return Number.isFinite(val) ? Math.max(0, Math.min(252, Math.floor(val))) : 252;
}
function calculateEffort() {
    const id = Number(document.getElementById("calculatorPokemon").value), stat = document.getElementById("calculatorStat").value;
    const power = POWER_ITEMS[document.getElementById("powerItem").value] || POWER_ITEMS.none;
    const pokerus = document.getElementById("pokerus").checked, target = getTargetEffort();
    const result = document.getElementById("calculatorResult"), pokemon = pokemonList.find(p => Number(p.id) === id);
    if (!pokemon) { result.textContent = "対象ポケモンを選択してください。"; return; }
    const base = Number(pokemon.effort?.[stat] || 0), bonus = power.stat === stat ? power.bonus : 0, gained = (base + bonus) * (pokerus ? 2 : 1);
    const needed = target === 0 ? 0 : gained > 0 ? Math.ceil(target / gained) : null;
    const itemText = power.stat === stat ? `${power.name}（+${power.bonus}）` : power.stat ? `${power.name}（選択能力への追加なし）` : "なし";
    result.innerHTML = `<p><strong>${escapeHTML(pokemon.name)}</strong>を倒した場合</p>
 <p>基礎努力値：${base}</p><p>パワー系アイテム：${escapeHTML(itemText)}</p><p>ポケルス：${pokerus ? "あり（2倍）" : "なし"}</p><hr>
 <p>1匹あたりの${escapeHTML(STAT_LABELS[stat])}努力値：<strong>${gained}</strong></p>
 <p>目標努力値：${target}</p><p>必要な撃破数の目安：<strong>${needed === null ? "計算不可（獲得量0）" : `${needed}匹`}</strong></p>
 <p class="small-note">${target === 0 ? "目標が0のため、撃破する必要はありません。" : needed === null ? "この組み合わせでは選択した能力の努力値を獲得できません。" : `獲得量の合計は${needed * gained}です。`}</p>
 <p class="small-note">※ 現在の努力値や、他の能力の努力値は考慮していません。</p>`;
}
async function initializeTrainingPage() {
    document.getElementById("natureUpFilter").addEventListener("change", renderNatures);
    document.getElementById("natureDownFilter").addEventListener("change", renderNatures);
    document.getElementById("effortStat").addEventListener("change", renderRecommendations);
    document.getElementById("effortVersion").addEventListener("change", renderRecommendations);
    document.getElementById("targetEffort").addEventListener("change", getTargetEffort);
    document.getElementById("calculateButton").addEventListener("click", calculateEffort);
    renderNatures(); getTargetEffort(); renderRecommendations();
    try {
        const response = await fetch("data/pokemon.json"); if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json(); if (!Array.isArray(data.pokemon)) throw new Error("pokemon配列がありません");
        pokemonList = data.pokemon; fillPokemonSelect(); renderRecommendations();
    } catch (error) {
        console.error("ポケモンデータの読み込みに失敗:", error);
        document.getElementById("calculatorResult").textContent = "努力値計算用のポケモンデータを読み込めませんでした。data/pokemon.json を確認してください。";
    }
}
document.addEventListener("DOMContentLoaded", initializeTrainingPage);
