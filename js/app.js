
"use strict";

// ========================================
// HGSS ポケモン図鑑
// ========================================

const TYPES = {
    normal: "ノーマル",
    fire: "ほのお",
    water: "みず",
    electric: "でんき",
    grass: "くさ",
    ice: "こおり",
    fighting: "かくとう",
    poison: "どく",
    ground: "じめん",
    flying: "ひこう",
    psychic: "エスパー",
    bug: "むし",
    rock: "いわ",
    ghost: "ゴースト",
    dragon: "ドラゴン",
    dark: "あく",
    steel: "はがね"
};

const STATS = {
    hp: "HP",
    attack: "攻撃",
    defense: "防御",
    "special-attack": "特攻",
    "special-defense": "特防",
    speed: "素早さ"
};

const METHODS = {
    "level-up": "レベルアップ",
    machine: "マシン",
    egg: "タマゴ技",
    tutor: "教え技"
};

const LOCATION_NAMES = {
    "new-bark-town": "ワカバタウン",
    "cherrygrove-city": "ヨシノシティ",
    "violet-city": "キキョウシティ",
    "azalea-town": "ヒワダタウン",
    "goldenrod-city": "コガネシティ",
    "ecruteak-city": "エンジュシティ",
    "olivine-city": "アサギシティ",
    "cianwood-city": "タンバシティ",
    "mahogany-town": "チョウジタウン",
    "blackthorn-city": "フスベシティ",
    "pallet-town": "マサラタウン",
    "viridian-city": "トキワシティ",
    "pewter-city": "ニビシティ",
    "cerulean-city": "ハナダシティ",
    "vermilion-city": "クチバシティ",
    "lavender-town": "シオンタウン",
    "celadon-city": "タマムシシティ",
    "fuchsia-city": "セキチクシティ",
    "saffron-city": "ヤマブキシティ",
    "cinnabar-island": "グレンじま",
    "ilex-forest": "ウバメのもり",
    "sprout-tower": "マダツボミのとう",
    "union-cave": "つながりのどうくつ",
    "slowpoke-well": "ヤドンのいど",
    "national-park": "しぜんこうえん",
    "burned-tower": "やけたとう",
    "bell-tower": "スズのとう",
    "tin-tower": "スズのとう",
    "whirl-islands": "うずまきじま",
    "mt-mortar": "スリバチやま",
    "ice-path": "こおりのぬけみち",
    "dark-cave": "くらやみのほらあな",
    "dragons-den": "りゅうのあな",
    "mt-silver": "シロガネやま",
    "tohjo-falls": "トージョウのたき",
    "ruins-of-alph": "アルフのいせき",
    "cliff-cave": "だんがいのどうくつ",
    "cliff-edge-gate": "だんがいのゲート",
    "safari-zone": "サファリゾーン",
    "safari-zone-gate": "サファリゾーンゲート",
    "viridian-forest": "トキワのもり",
    "digletts-cave": "ディグダのあな",
    "mt-moon": "おつきみやま",
    "rock-tunnel": "イワヤマトンネル",
    "seafoam-islands": "ふたごじま",
    "cerulean-cave": "ハナダのどうくつ",
    "power-plant": "はつでんしょ",
    "victory-road": "チャンピオンロード",
    "unknown-all-bugs-area":
        "虫取り大会の出現エリア（詳細地点不明）"
};

const AREA_DETAILS = {
    "north-towards-pewter-city": "ニビシティ方面・北側",
    "south-towards-viridian-city": "トキワシティ方面・南側",
    north: "北側",
    south: "南側",
    east: "東側",
    west: "西側",
    inside: "内部",
    outside: "屋外",
    interior: "内部",
    exterior: "屋外",
    entrance: "入口",
    grass: "草むら",
    water: "水上",
    cave: "洞窟",
    basement: "地下",
    roof: "屋上",
    "1f": "1階",
    "2f": "2階",
    "3f": "3階",
    "4f": "4階",
    "5f": "5階",
    b1f: "地下1階",
    b2f: "地下2階",
    b3f: "地下3階",
    b4f: "地下4階"
};

const METHOD_NAMES = {
    walk: "草むら・洞窟",
    surf: "なみのり",
    "old-rod": "ボロのつりざお",
    "good-rod": "いいつりざお",
    "super-rod": "すごいつりざお",
    "rock-smash": "いわくだき",
    "headbutt-low": "ずつき",
    "headbutt-normal": "ずつき",
    "headbutt-high": "ずつき",
    gift: "人からもらう",
    "gift-egg": "タマゴをもらう",
    "only-one": "固定シンボル"
};

const CONDITION_NAMES = {
    "time-morning": "朝",
    "time-day": "昼",
    "time-night": "夜",
    "swarm-yes": "大量発生時",
    "swarm-no": "通常時",
    "radio-on": "ラジオ使用中",
    "radio-off": "ラジオ未使用",
    "headbutt-tree-common": "ずつきで出現する通常の木",
    "headbutt-tree-rare": "ずつきで出現する珍しい木",
    "bug-catching-contest-yes": "虫取り大会開催中",
    "bug-catching-contest-no": "虫取り大会開催外",
    "story-progress-before-national-dex": "全国図鑑入手前",
    "story-progress-after-national-dex": "全国図鑑入手後",
    "radar-on": "ポケトレ使用",
    "radar-off": "ポケトレ未使用",
    "slot2-ruby": "ルビーを挿入",
    "slot2-sapphire": "サファイアを挿入",
    "slot2-emerald": "エメラルドを挿入",
    "slot2-firered": "ファイアレッドを挿入",
    "slot2-leafgreen": "リーフグリーンを挿入"
};

const PAGE_SIZE = 60;

let pokemonData = [];
let filteredData = [];
let shownCount = 0;

const $ = id => document.getElementById(id);

// ========================================
// 共通処理
// ========================================

function escapeHTML(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        ch => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[ch]
    );
}

function formatId(id) {
    return String(id).padStart(3, "0");
}

function typeBadges(types) {
    return `
    <div class="types">
      ${(types || []).map(type => `
        <span class="type type-${escapeHTML(type)}">
          ${escapeHTML(TYPES[type] || type)}
        </span>
      `).join("")}
    </div>
  `;
}

function hasEncounters(p, version) {
    return (p.encounters?.[version] || []).length > 0;
}

function versionLabel(p) {
    const hg = hasEncounters(p, "heartgold");
    const ss = hasEncounters(p, "soulsilver");

    if (hg && ss) return "HG・SSで野生出現";
    if (hg) return "HGのみ野生出現";
    if (ss) return "SSのみ野生出現";

    return "野生出現データなし";
}

// ========================================
// 出現場所の日本語変換
// ========================================

function translateAreaId(areaId) {
    let id = String(areaId ?? "").trim();

    if (!id) return "場所不明";

    id = id.replace(/-area$/, "");

    if (LOCATION_NAMES[id]) {
        return LOCATION_NAMES[id];
    }

    const route = id.match(
        /^(?:(?:johto|kanto)-)?route-(\d+)(?:-(.*))?$/
    );

    if (route) {
        const routeName = `${Number(route[1])}ばんどうろ`;
        const suffix = route[2] || "";

        if (!suffix) return routeName;

        const detail = AREA_DETAILS[suffix];

        if (detail) {
            return `${routeName}（${detail}）`;
        }

        return `${routeName}（未翻訳エリア: ${suffix}）`;
    }

    const keys = Object.keys(LOCATION_NAMES)
        .sort((a, b) => b.length - a.length);

    for (const key of keys) {
        if (id === key) {
            return LOCATION_NAMES[key];
        }

        if (id.startsWith(key + "-")) {
            const suffix = id.slice(key.length + 1);

            if (!suffix) return LOCATION_NAMES[key];

            const detail = AREA_DETAILS[suffix];

            if (detail) {
                return `${LOCATION_NAMES[key]}（${detail}）`;
            }

            return `${LOCATION_NAMES[key]}（未翻訳エリア: ${suffix}）`;
        }
    }

    return `未翻訳の場所（${id}）`;
}

function translateArea(record) {
    const area = String(record?.area ?? "");
    const areaId = String(record?.area_id ?? "");

    const candidates = [areaId, area].filter(Boolean);

    for (const candidate of candidates) {
        const normalized = candidate
            .replace(/^未翻訳の場所（/, "")
            .replace(/）$/, "")
            .replace(/^未翻訳エリア:\s*/, "")
            .trim();

        if (normalized === "unknown-all-bugs-area") {
            return "虫取り大会の出現エリア（詳細地点不明）";
        }
    }

    if (area.includes("north-towards-pewter-city")) {
        return area.replace(
            /未翻訳エリア:\s*north-towards-pewter-city/,
            "ニビシティ方面・北側"
        );
    }

    for (const candidate of candidates) {
        const translated = translateAreaId(candidate);

        if (!translated.startsWith("未翻訳の場所")) {
            return translated;
        }
    }

    if (/[ぁ-んァ-ヶ一-龠]/.test(area)) {
        let translated = area;

        for (const [english, japanese] of Object.entries(AREA_DETAILS)) {
            translated = translated.replaceAll(
                `未翻訳エリア: ${english}`,
                japanese
            );
        }

        if (translated.includes("unknown-all-bugs-area")) {
            translated = translated.replace(
                /unknown-all-bugs-area/g,
                "虫取り大会の出現エリア（詳細地点不明）"
            );
        }

        return translated;
    }

    return candidates.length
        ? translateAreaId(candidates[0])
        : "場所不明";
}

// ========================================
// 出現方法・条件の日本語変換
// ========================================

function translateEncounterMethod(method) {
    const value = String(method ?? "");
    return METHOD_NAMES[value] || value || "不明";
}

function translateCondition(condition) {
    const value = String(condition ?? "");

    if (CONDITION_NAMES[value]) {
        return CONDITION_NAMES[value];
    }

    return value.split(",").map(part => {
        const key = part.trim();
        return CONDITION_NAMES[key] || key;
    }).join("、");
}

// ========================================
// 初期化
// ========================================

async function initialize() {
    const count = $("count");

    try {
        if (
            !$("pokemonList") ||
            !$("search") ||
            !$("typeFilter") ||
            !$("versionFilter")
        ) {
            throw new Error(
                "pokedex.html に必要なHTML要素がありません。"
            );
        }

        const response = await fetch(
            "data/pokemon.json",
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error(
                `pokemon.json の取得に失敗しました: HTTP ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data.pokemon)) {
            throw new Error("pokemon.json の形式が正しくありません。");
        }

        pokemonData = data.pokemon;
        pokemonData.sort((a, b) => a.id - b.id);

        const typeSelect = $("typeFilter");

        Object.entries(TYPES).forEach(([key, name]) => {
            if ([...typeSelect.options].some(o => o.value === key)) {
                return;
            }

            const option = document.createElement("option");
            option.value = key;
            option.textContent = name;
            typeSelect.appendChild(option);
        });

        $("search").addEventListener("input", applyFilters);
        $("typeFilter").addEventListener("change", applyFilters);
        $("versionFilter").addEventListener("change", applyFilters);

        if ($("moreButton")) {
            $("moreButton").addEventListener("click", showNextPage);
        }

        if ($("closeButton")) {
            $("closeButton").addEventListener("click", closeDetail);
        }

        if ($("backdrop")) {
            $("backdrop").addEventListener("click", closeDetail);
        }

        // 進化情報のポケモン名をクリックしたときの処理
        // 図鑑番号からデータを検索するので、個別のポケモン設定は不要
        if ($("pokemonDetail")) {
            $("pokemonDetail").addEventListener("click", event => {
                const button = event.target.closest(
                    "[data-evolution-id]"
                );

                if (!button) return;

                const targetId = Number(button.dataset.evolutionId);

                const targetPokemon = pokemonData.find(
                    p => Number(p.id) === targetId
                );

                if (targetPokemon) {
                    openDetail(targetPokemon);
                } else {
                    console.warn(
                        `図鑑番号 ${targetId} のポケモンが見つかりません。`
                    );
                }
            });
        }

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeDetail();
        });

        applyFilters();

    } catch (error) {
        console.error("図鑑の初期化エラー:", error);

        if (count) {
            count.textContent =
                `データの読み込みに失敗しました: ${error.message}`;
        }
    }
}

// ========================================
// 一覧・検索
// ========================================

function applyFilters() {
    const query = $("search").value.trim().toLowerCase();
    const type = $("typeFilter").value;
    const version = $("versionFilter").value;

    filteredData = pokemonData.filter(p => {
        const nameMatch =
            !query ||
            String(p.name || "").toLowerCase().includes(query) ||
            String(p.english || "").toLowerCase().includes(query) ||
            String(p.id).includes(query) ||
            formatId(p.id).includes(query);

        const typeMatch =
            !type || (p.types || []).includes(type);

        const hg = hasEncounters(p, "heartgold");
        const ss = hasEncounters(p, "soulsilver");

        let versionMatch = true;

        if (version === "heartgold") versionMatch = hg;
        if (version === "soulsilver") versionMatch = ss;
        if (version === "hg-only") versionMatch = hg && !ss;
        if (version === "ss-only") versionMatch = ss && !hg;

        return nameMatch && typeMatch && versionMatch;
    });

    shownCount = 0;
    $("pokemonList").replaceChildren();

    $("count").textContent =
        `${filteredData.length}匹 / 収録${pokemonData.length}匹`;

    showNextPage();
}

function showNextPage() {
    const next = filteredData.slice(
        shownCount,
        shownCount + PAGE_SIZE
    );

    const fragment = document.createDocumentFragment();

    next.forEach(p => {
        const card = document.createElement("button");
        card.className = "pokemon-card";
        card.type = "button";

        card.innerHTML = `
      <div class="number">No.${formatId(p.id)}</div>
      <img
        src="${escapeHTML(p.sprite || "")}"
        alt="${escapeHTML(p.name)}"
        loading="lazy"
      >
      <h3>${escapeHTML(p.name)}</h3>
      ${typeBadges(p.types)}
    `;

        card.addEventListener("click", () => openDetail(p));
        fragment.appendChild(card);
    });

    $("pokemonList").appendChild(fragment);
    shownCount += next.length;

    if ($("moreButton")) {
        $("moreButton").hidden =
            shownCount >= filteredData.length;
    }
}

// ========================================
// 種族値
// ========================================

function renderStats(p) {
    const stats = p.stats || {};

    const total = Object.values(stats).reduce(
        (sum, value) => sum + Number(value || 0),
        0
    );

    return `
    <section class="detail-section">
      <h3>種族値（合計 ${total}）</h3>

      ${Object.entries(STATS).map(([key, label]) => {
        const value = Number(stats[key] || 0);
        const width = Math.min(value / 255 * 100, 100);

        return `
          <div class="stat-row">
            <span>${label}</span>
            <strong>${value}</strong>
            <div class="stat-bar">
              <div class="stat-fill" style="width:${width}%"></div>
            </div>
          </div>
        `;
    }).join("")}
    </section>
  `;
}

// ========================================
// 技・マシン番号
// ========================================

function machineSortKey(machine) {
    const text = String(machine || "");
    const match = text.match(
        /(?:わざマシン|ひでんマシン|TM|HM)\s*0*(\d+)/i
    );

    if (!match) return 99999;

    const number = Number(match[1]);
    const isHM = /ひでんマシン|HM/i.test(text);

    return (isHM ? 1000 : 0) + number;
}

function renderMoves(p) {
    const moves = p.moves || [];

    const categories = [
        ["level-up", "レベルアップ"],
        ["machine", "わざマシン・ひでんマシン"],
        ["egg", "タマゴ技"],
        ["tutor", "教え技"]
    ];

    const available = categories.filter(([key]) =>
        moves.some(m => m.method === key)
    );

    if (moves.some(m =>
        !categories.some(([key]) => key === m.method)
    )) {
        available.push(["other", "その他"]);
    }

    if (!available.length) {
        return `
      <section class="detail-section">
        <h3>HGSSで覚える技</h3>
        <p>技データがありません。</p>
      </section>
    `;
    }

    return `
    <section class="detail-section">
      <h3>HGSSで覚える技</h3>

      <div class="tab-buttons" id="moveTabs">
        ${available.map(([key, label], i) => `
          <button
            type="button"
            class="move-tab ${i === 0 ? "active" : ""}"
            data-method="${key}"
          >${label}</button>
        `).join("")}
      </div>

      <div id="moveTable"></div>
    </section>
  `;
}

function showMoveTable(p, method) {
    const known = ["level-up", "machine", "egg", "tutor"];

    let moves = (p.moves || []).filter(m =>
        method === "other"
            ? !known.includes(m.method)
            : m.method === method
    );

    let rows = "";

    if (method === "machine") {
        const machineRows = moves.flatMap(m => {
            const machines = m.machines || [];

            if (!machines.length) {
                return [{ number: "番号未取得", name: m.name }];
            }

            return machines.map(number => ({
                number,
                name: m.name
            }));
        });

        machineRows.sort((a, b) =>
            machineSortKey(a.number) - machineSortKey(b.number)
        );

        rows = machineRows.map(m => `
      <tr>
        <td>${escapeHTML(m.number)}</td>
        <td>${escapeHTML(m.name)}</td>
      </tr>
    `).join("");

    } else {
        if (method === "level-up") {
            moves.sort((a, b) =>
                Number(a.level || 0) - Number(b.level || 0)
            );
        }

        rows = moves.map(m => `
      <tr>
        <td>${m.method === "level-up"
                ? `Lv.${m.level}`
                : escapeHTML(METHODS[m.method] || m.method)
            }</td>
        <td>${escapeHTML(m.name)}</td>
      </tr>
    `).join("");
    }

    $("moveTable").innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>${method === "machine" ? "マシン番号" : "習得方法"}</th>
            <th>技名</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

// ========================================
// 出現情報
// ========================================

function renderEncounterTable(records) {
    if (!records.length) {
        return "<p>PokéAPIに野生遭遇データがありません。</p>";
    }

    return `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>出現場所</th>
            <th>入手方法</th>
            <th>レベル</th>
            <th>条件</th>
          </tr>
        </thead>
        <tbody>
          ${records.map(r => {
        const min = r.min_level;
        const max = r.max_level;

        const level = min === max
            ? `Lv.${min}`
            : `Lv.${min}〜${max}`;

        const conditions = (r.conditions || [])
            .map(translateCondition)
            .join("、");

        return `
              <tr>
                <td>${escapeHTML(translateArea(r))}</td>
                <td>${escapeHTML(translateEncounterMethod(r.method))}</td>
                <td>${escapeHTML(level)}</td>
                <td>${escapeHTML(conditions || "指定なし")}</td>
              </tr>
            `;
    }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderEncounters(p) {
    const hg = p.encounters?.heartgold || [];
    const ss = p.encounters?.soulsilver || [];

    return `
    <section class="detail-section">
      <h3>出現場所・入手方法</h3>
      <p><strong>${versionLabel(p)}</strong></p>

      <p class="note">
        HGSSの野生遭遇データを表示しています。
        イベント・通信交換など、すべての入手方法を網羅するものではありません。
      </p>

      <div class="tab-buttons" id="encounterTabs">
        <button
          type="button"
          class="encounter-tab active"
          data-version="heartgold"
        >ハートゴールド (${hg.length})</button>

        <button
          type="button"
          class="encounter-tab"
          data-version="soulsilver"
        >ソウルシルバー (${ss.length})</button>
      </div>

      <div id="encounterTable"></div>
    </section>
  `;
}

// ========================================
// 進化情報
// ========================================

function evolutionCondition(conditions) {
    if (!conditions || !conditions.length) {
        return "進化条件不明";
    }

    const triggers = {
        "level-up": "レベルアップ",
        trade: "通信交換",
        "use-item": "道具を使用",
        shed: "特殊進化"
    };

    return conditions.map(c => {
        const parts = [triggers[c.trigger] || c.trigger];

        if (c.min_level) parts.push(`Lv.${c.min_level}以上`);
        if (c.item) parts.push(c.item);
        if (c.held_item) parts.push(`${c.held_item}を所持`);
        if (c.min_happiness) parts.push("なつき度条件");
        if (c.min_beauty) parts.push("うつくしさ条件");
        if (c.time_of_day) parts.push(c.time_of_day);
        if (c.known_move) parts.push(`${c.known_move}を覚える`);
        if (c.location) parts.push(`場所: ${c.location}`);
        if (c.gender === 1) parts.push("♀");
        if (c.gender === 2) parts.push("♂");

        return parts.join("・");
    }).join(" / ");
}

function renderEvolution(p) {
    const evolution = p.evolution || [];

    if (!evolution.length) {
        return `
        <section class="detail-section">
          <h3>進化情報</h3>
          <p>進化情報がありません。</p>
        </section>
        `;
    }

    return `
    <section class="detail-section">
      <h3>進化情報</h3>

      ${evolution.map(e => `
        <div class="evolution-row">
          <button
            type="button"
            class="evolution-link"
            data-evolution-id="${Number(e.id)}"
            style="
              background: none;
              border: none;
              padding: 0;
              color: #1769aa;
              text-decoration: underline;
              cursor: pointer;
              font: inherit;
              font-weight: bold;
            "
          >
            No.${formatId(e.id)} ${escapeHTML(e.name)}
          </button>

          ${e.from_id ? `
            <div class="note">
              No.${formatId(e.from_id)} から進化：
              ${escapeHTML(evolutionCondition(e.conditions))}
            </div>
          ` : `
            <div class="note">進化系列の起点</div>
          `}
        </div>
      `).join("")}

      <p class="note">
        進化条件は簡易表示です。
        後世代の進化条件が含まれる場合があります。
      </p>
    </section>
  `;
}

// ========================================
// 詳細画面
// ========================================

function openDetail(p) {
    const abilityText = (p.abilities || [])
        .map(a =>
            `${escapeHTML(a.name)}${a.hidden ? "（隠れ特性・HGSS対象外）" : ""}`
        )
        .join("、");

    $("pokemonDetail").innerHTML = `
    <div class="detail-top">
      <div class="number">全国図鑑 No.${formatId(p.id)}</div>

      <img
        src="${escapeHTML(p.sprite || "")}"
        alt="${escapeHTML(p.name)}"
      >

      <h2>${escapeHTML(p.name)}</h2>
      <p>${escapeHTML(p.english)}</p>
      ${typeBadges(p.types)}
    </div>

    <section class="detail-section">
      <h3>基本情報</h3>
      <p>身長：${p.height} m</p>
      <p>体重：${p.weight} kg</p>
      <p>特性：${abilityText || "不明"}</p>
      <p class="note">
        特性は現行データ由来です。隠れ特性はHGSSには存在しません。
      </p>
    </section>

    ${renderStats(p)}
    ${renderEvolution(p)}
    ${renderMoves(p)}
    ${renderEncounters(p)}
  `;

    $("modal").hidden = false;
    document.body.classList.add("modal-open");

    const moveTabs = $("moveTabs");

    if (moveTabs) {
        const first = moveTabs.querySelector("button");

        if (first) {
            showMoveTable(p, first.dataset.method);
        }

        moveTabs.addEventListener("click", event => {
            const button = event.target.closest("button");
            if (!button) return;

            moveTabs.querySelectorAll("button").forEach(b =>
                b.classList.remove("active")
            );

            button.classList.add("active");
            showMoveTable(p, button.dataset.method);
        });
    }

    const encounterTabs = $("encounterTabs");

    if (encounterTabs) {
        $("encounterTable").innerHTML =
            renderEncounterTable(p.encounters?.heartgold || []);

        encounterTabs.addEventListener("click", event => {
            const button = event.target.closest("button");
            if (!button) return;

            encounterTabs.querySelectorAll("button").forEach(b =>
                b.classList.remove("active")
            );

            button.classList.add("active");

            $("encounterTable").innerHTML =
                renderEncounterTable(
                    p.encounters?.[button.dataset.version] || []
                );
        });
    }
}

function closeDetail() {
    $("modal").hidden = true;
    document.body.classList.remove("modal-open");
}

// ========================================
// 起動処理
// ========================================

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}
