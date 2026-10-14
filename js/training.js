"use strict";

const STAT_LABELS = {
    hp: "HP",
    attack: "攻撃",
    defense: "防御",
    "special-attack": "特攻",
    "special-defense": "特防",
    speed: "素早さ"
};

const POWER_ITEMS = {
    none: { name: "なし", stat: null, bonus: 0 },
    hp: { name: "パワーウエイト", stat: "hp", bonus: 4 },
    attack: { name: "パワーリスト", stat: "attack", bonus: 4 },
    defense: { name: "パワーベルト", stat: "defense", bonus: 4 },
    "special-attack": {
        name: "パワーレンズ",
        stat: "special-attack",
        bonus: 4
    },
    "special-defense": {
        name: "パワーバンド",
        stat: "special-defense",
        bonus: 4
    },
    speed: { name: "パワーアンクル", stat: "speed", bonus: 4 }
};

/*
 * 序盤向けエリア。
 * 序盤に訪れやすい道路・施設を中心に候補を選ぶ。
 */
const EARLY_AREA_PATTERNS = [
    {
        pattern: /route-(?:29|30|31|32|33|34|35)(?:\b|-)/,
        label: null,
        rank: 1
    },
    {
        pattern: /sprout-tower/,
        label: "マダツボミのとう",
        rank: 2
    },
    {
        pattern: /dark-cave/,
        label: "くらやみのほらあな",
        rank: 3
    },
    {
        pattern: /ruins-of-alph/,
        label: "アルフのいせき",
        rank: 4
    },
    {
        pattern: /union-cave/,
        label: "つながりのどうくつ",
        rank: 5
    },
    {
        pattern: /slowpoke-well/,
        label: "ヤドンのいど",
        rank: 6
    },
    {
        pattern: /ilex-forest/,
        label: "ウバメのもり",
        rank: 7
    },
    {
        pattern: /national-park/,
        label: "しぜんこうえん",
        rank: 8
    }
];

/*
 * 殿堂入り後向けエリア。
 * カントー地方やシロガネやまなどを優先する。
 *
 * エリア名は pokemon.json の area / area_id に含まれる
 * 英語スラッグを想定する。
 */
const POSTGAME_AREA_PATTERNS = [
    {
        pattern: /route-(?:[1-9]|1\d|2[0-5])(?:\b|-)/,
        label: null,
        rank: 1
    },
    {
        pattern: /mt-silver|mount-silver/,
        label: "シロガネやま",
        rank: 2
    },
    {
        pattern: /cerulean-cave/,
        label: "ハナダのどうくつ",
        rank: 3
    },
    {
        pattern: /rock-tunnel/,
        label: "イワヤマトンネル",
        rank: 4
    },
    {
        pattern: /power-plant/,
        label: "むじんはつでんしょ",
        rank: 5
    },
    {
        pattern: /seafoam-islands/,
        label: "ふたごじま",
        rank: 6
    },
    {
        pattern: /pokemon-mansion/,
        label: "ポケモンやしき",
        rank: 7
    },
    {
        pattern: /digletts-cave|digletts-tunnel/,
        label: "ディグダのあな",
        rank: 8
    },
    {
        pattern: /kanto/,
        label: "カントー地方",
        rank: 20
    }
];

const NATURES = [
    { name: "がんばりや", up: null, down: null },
    { name: "さみしがり", up: "attack", down: "defense" },
    { name: "ゆうかん", up: "attack", down: "speed" },
    { name: "いじっぱり", up: "attack", down: "special-attack" },
    { name: "やんちゃ", up: "attack", down: "special-defense" },

    { name: "ずぶとい", up: "defense", down: "attack" },
    { name: "すなお", up: null, down: null },
    { name: "のんき", up: "defense", down: "speed" },
    { name: "わんぱく", up: "defense", down: "special-attack" },
    { name: "のうてんき", up: "defense", down: "special-defense" },

    { name: "おくびょう", up: "speed", down: "attack" },
    { name: "せっかち", up: "speed", down: "defense" },
    { name: "ようき", up: "speed", down: "special-attack" },
    { name: "むじゃき", up: "speed", down: "special-defense" },
    { name: "てれや", up: null, down: null },

    { name: "ひかえめ", up: "special-attack", down: "attack" },
    { name: "おっとり", up: "special-attack", down: "defense" },
    { name: "れいせい", up: "special-attack", down: "speed" },
    { name: "うっかりや", up: "special-attack", down: "special-defense" },
    { name: "まじめ", up: null, down: null },

    { name: "おだやか", up: "special-defense", down: "attack" },
    { name: "おとなしい", up: "special-defense", down: "defense" },
    { name: "なまいき", up: "special-defense", down: "speed" },
    { name: "しんちょう", up: "special-defense", down: "special-attack" },
    { name: "きまぐれ", up: null, down: null }
];

/*
 * 第4世代のタイプカラー。
 * 日本語・英語のタイプ名どちらにも対応する。
 */
const TYPE_STYLES = {
    normal: { label: "ノーマル", color: "#9299a3", soft: "#f0f1f3" },
    fire: { label: "ほのお", color: "#e76c35", soft: "#fff0e6" },
    water: { label: "みず", color: "#3986d7", soft: "#e8f3ff" },
    electric: { label: "でんき", color: "#c99b08", soft: "#fff8d9" },
    grass: { label: "くさ", color: "#4d9d55", soft: "#eaf7e8" },
    ice: { label: "こおり", color: "#55aeb7", soft: "#e6f9fa" },
    fighting: { label: "かくとう", color: "#b94c43", soft: "#ffebe8" },
    poison: { label: "どく", color: "#9b65b2", soft: "#f6eafd" },
    ground: { label: "じめん", color: "#b58b46", soft: "#f8efdf" },
    flying: { label: "ひこう", color: "#8299d7", soft: "#edf1ff" },
    psychic: { label: "エスパー", color: "#d75b87", soft: "#fff0f5" },
    bug: { label: "むし", color: "#8b9b35", soft: "#f3f6df" },
    rock: { label: "いわ", color: "#a08b60", soft: "#f4efe4" },
    ghost: { label: "ゴースト", color: "#7863a8", soft: "#f0ebfa" },
    dragon: { label: "ドラゴン", color: "#6b63c9", soft: "#efedff" },
    dark: { label: "あく", color: "#625b62", soft: "#efedef" },
    steel: { label: "はがね", color: "#7e9aa6", soft: "#eaf1f4" }
};

const TYPE_ALIASES = {
    ノーマル: "normal",
    ほのお: "fire",
    みず: "water",
    でんき: "electric",
    くさ: "grass",
    こおり: "ice",
    かくとう: "fighting",
    どく: "poison",
    じめん: "ground",
    ひこう: "flying",
    エスパー: "psychic",
    むし: "bug",
    いわ: "rock",
    ゴースト: "ghost",
    ドラゴン: "dragon",
    あく: "dark",
    はがね: "steel"
};

let pokemonList = [];

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function getStatLabel(stat) {
    return STAT_LABELS[stat] || stat || "不明";
}

/* =========================
   性格早見表
========================= */

function createNatureCell(stat, direction) {
    if (!stat) {
        return '<span class="nature-cell neutral">● 補正なし</span>';
    }

    const arrow = direction === "up" ? "▲" : "▼";
    const className = direction === "up" ? "up" : "down";

    return `
        <span class="nature-cell ${className}">
            ${arrow} ${escapeHTML(getStatLabel(stat))}
        </span>
    `;
}

function renderNatures() {
    const body = document.getElementById("natureTableBody");
    const upFilter = document.getElementById("natureUpFilter");
    const downFilter = document.getElementById("natureDownFilter");
    const count = document.getElementById("natureCount");

    if (!body || !upFilter || !downFilter || !count) {
        return;
    }

    const filtered = NATURES.filter(nature => {
        const up = nature.up || "none";
        const down = nature.down || "none";

        const upMatches =
            upFilter.value === "all" || upFilter.value === up;

        const downMatches =
            downFilter.value === "all" || downFilter.value === down;

        return upMatches && downMatches;
    });

    body.innerHTML = filtered.map(nature => `
        <tr>
            <td>${escapeHTML(nature.name)}</td>
            <td>${createNatureCell(nature.up, "up")}</td>
            <td>${createNatureCell(nature.down, "down")}</td>
        </tr>
    `).join("");

    count.textContent = `${filtered.length}件表示（全25種類）`;
}

/* =========================
   ポケモンのタイプ情報
========================= */

function normalizeType(type) {
    if (type && typeof type === "object") {
        type = type.name || type.type || type.type_name || "";
    }

    const raw = String(type || "").trim().toLowerCase();

    if (TYPE_STYLES[raw]) {
        return raw;
    }

    return TYPE_ALIASES[String(type || "").trim()] || "";
}

function getPokemonTypes(pokemon) {
    let rawTypes = pokemon.types ?? pokemon.type ?? [];

    if (!Array.isArray(rawTypes)) {
        rawTypes = [rawTypes];
    }

    const types = rawTypes
        .map(normalizeType)
        .filter(type => Boolean(TYPE_STYLES[type]));

    return [...new Set(types)].slice(0, 2);
}

function renderPokemonTypeTags(pokemon) {
    const types = getPokemonTypes(pokemon);

    if (types.length === 0) {
        return '<div class="pokemon-types"><span class="type-tag" style="background:#8993a3">タイプ不明</span></div>';
    }

    return `
        <div class="pokemon-types">
            ${types.map(type => `
                <span
                    class="type-tag"
                    style="background:${TYPE_STYLES[type].color}"
                >${TYPE_STYLES[type].label}</span>
            `).join("")}
        </div>
    `;
}

function getPokemonTypeStyle(pokemon) {
    const types = getPokemonTypes(pokemon);
    const firstType = types[0];

    if (!firstType) {
        return {
            color: "#8993a3",
            soft: "#f0f2f5"
        };
    }

    return {
        color: TYPE_STYLES[firstType].color,
        soft: TYPE_STYLES[firstType].soft
    };
}

/* =========================
   出現データの取得
========================= */

function getEncounterList(pokemon, version) {
    const encounters = pokemon.encounters || {};

    if (version === "both") {
        return [
            ...(encounters.heartgold || []).map(encounter => ({
                ...encounter,
                version: "HG"
            })),
            ...(encounters.soulsilver || []).map(encounter => ({
                ...encounter,
                version: "SS"
            }))
        ];
    }

    const list = encounters[version] || [];

    return list.map(encounter => ({
        ...encounter,
        version: version === "heartgold" ? "HG" : "SS"
    }));
}

function getAreaInfo(encounter, stage) {
    const area = String(encounter.area || "").toLowerCase();
    const areaId = String(encounter.area_id || "").toLowerCase();
    const combined = `${area} ${areaId}`;

    const patterns = stage === "postgame"
        ? POSTGAME_AREA_PATTERNS
        : EARLY_AREA_PATTERNS;

    for (const item of patterns) {
        const match = combined.match(item.pattern);

        if (!match) {
            continue;
        }

        let label = item.label;

        if (!label) {
            const routeMatch = match[0].match(/route-(\d+)/);

            if (routeMatch) {
                label = `${routeMatch[1]}ばんどうろ`;
            } else {
                label = area || areaId || "出現場所不明";
            }
        }

        return {
            label,
            rank: item.rank
        };
    }

    return null;
}

function getConditionsText(encounter) {
    if (Array.isArray(encounter.conditions)) {
        return encounter.conditions.join(" ").toLowerCase();
    }

    return String(encounter.conditions || "").toLowerCase();
}

function isWildEncounter(encounter) {
    const method = String(encounter.method || "").toLowerCase();

    const excludedMethods = [
        "もらう",
        "進化",
        "タマゴ",
        "通信交換",
        "gift",
        "evolution",
        "egg",
        "trade"
    ];

    return !excludedMethods.some(methodName =>
        method.includes(methodName.toLowerCase())
    );
}

function isEarlyEncounter(encounter) {
    if (!isWildEncounter(encounter)) {
        return false;
    }

    const conditions = getConditionsText(encounter);

    if (/beat-red|after-hall-of-fame|post.?game|after-national-dex/.test(conditions)) {
        return false;
    }

    return getAreaInfo(encounter, "early") !== null;
}

function isPostgameEncounter(encounter) {
    if (!isWildEncounter(encounter)) {
        return false;
    }

    const conditions = getConditionsText(encounter);

    /*
     * 全国図鑑入手前など、明確にクリア後ではないと
     * 判定できる条件は候補から外す。
     */
    if (/before-national-dex|before-hall-of-fame/.test(conditions)) {
        return false;
    }

    return getAreaInfo(encounter, "postgame") !== null;
}


/* =========================
   努力値おすすめポケモン
========================= */

function getRecommendations(stat, version, stage) {
    const candidates = [];

    for (const pokemon of pokemonList) {
        // 努力値が入る能力を確認する
        const positiveStats = Object.keys(STAT_LABELS).filter(
            statKey => Number(pokemon.effort?.[statKey] || 0) > 0
        );

        // 努力値が入る能力が1種類だけのポケモンに限定する
        if (positiveStats.length !== 1) continue;

        // 選択した能力の努力値を取得する
        const baseEffort = Number(pokemon.effort?.[stat] || 0);
        if (baseEffort <= 0) continue;

        // HG・SSそれぞれの出現データを取得する
        const heartgoldEncounters = getEncounterList(pokemon, "heartgold");
        const soulsilverEncounters = getEncounterList(pokemon, "soulsilver");

        // 指定された時期に出現する場所だけに絞り込む
        const filterByStage = encounters =>
            encounters.filter(encounter =>
                stage === "postgame"
                    ? isPostgameEncounter(encounter)
                    : isEarlyEncounter(encounter)
            );

        const heartgoldAvailable =
            filterByStage(heartgoldEncounters).length > 0;
        const soulsilverAvailable =
            filterByStage(soulsilverEncounters).length > 0;

        // 両バージョンに出現するかどうかを判定
        let versionLabel;

        if (heartgoldAvailable && soulsilverAvailable) {
            versionLabel = "HG・SS";
        } else if (heartgoldAvailable) {
            versionLabel = "HG";
        } else if (soulsilverAvailable) {
            versionLabel = "SS";
        } else {
            continue;
        }

        // 出現場所は、選択中のバージョンのデータを使用する
        const encounters = getEncounterList(pokemon, version)
            .filter(encounter =>
                stage === "postgame"
                    ? isPostgameEncounter(encounter)
                    : isEarlyEncounter(encounter)
            )
            .map(encounter => ({
                encounter,
                area: getAreaInfo(encounter, stage)
            }))
            .filter(item => item.area !== null);

        if (encounters.length === 0) {
            continue;
        }

        encounters.sort((a, b) => {
            if (a.area.rank !== b.area.rank) {
                return a.area.rank - b.area.rank;
            }

            return Number(a.encounter.min_level || 1) -
                Number(b.encounter.min_level || 1);
        });

        const selected = encounters[0];

        candidates.push({
            pokemon,
            baseEffort,
            areaLabel: selected.area.label,
            encounter: selected.encounter,
            rank: selected.area.rank,
            minLevel: Number(selected.encounter.min_level || 1),
            versionLabel
        });
    }

    candidates.sort((a, b) => {
        if (b.baseEffort !== a.baseEffort) {
            return b.baseEffort - a.baseEffort;
        }

        if (a.rank !== b.rank) {
            return a.rank - b.rank;
        }

        return a.minLevel - b.minLevel;
    });

    return candidates.slice(0, 30);
}


function renderRecommendations() {
    const stat = document.getElementById("effortStat").value;
    const version = document.getElementById("effortVersion").value;
    const selectedStage = document.querySelector(
        'input[name="effortStage"]:checked'
    );

    const stage = selectedStage ? selectedStage.value : "early";
    const status = document.getElementById("effortStatus");
    const results = document.getElementById("effortResults");
    const stageDescription = document.getElementById("effortStageDescription");

    if (stageDescription) {
        stageDescription.textContent = stage === "postgame"
            ? "カントー地方やシロガネやまなど、クリア後向けのエリアに出現する候補を表示します。"
            : "ジョウト地方の序盤に訪れやすい道路や施設を中心に候補を表示します。";
    }

    const candidates = getRecommendations(stat, version, stage);

    if (candidates.length === 0) {
        status.textContent = stage === "postgame"
            ? "クリア後向けの候補が見つかりませんでした。出現エリアIDと条件を確認してください。"
            : "序盤向けの候補が見つかりませんでした。出現エリアIDと条件を確認してください。";

        results.innerHTML = "";
        return;
    }

    const stageLabel = stage === "postgame"
        ? "殿堂入り後向け"
        : "ジョウト序盤向け";

    status.textContent =
        `${stageLabel}：${getStatLabel(stat)}の努力値を得られる候補を` +
        `${candidates.length}匹表示しています。`;

    results.innerHTML = candidates.map(item => {
        const pokemon = item.pokemon;
        const encounter = item.encounter;
        const typeStyle = getPokemonTypeStyle(pokemon);

        const levelText = encounter.min_level
            ? `Lv.${encounter.min_level}` +
            (
                encounter.max_level &&
                    encounter.max_level !== encounter.min_level
                    ? `～${encounter.max_level}`
                    : ""
            )
            : "レベル不明";

        const chanceText = encounter.chance
            ? `出現率データ：${encounter.chance}%`
            : "";

        const methodText = encounter.method
            ? `出現方法：${encounter.method}`
            : "";

        const sprite = pokemon.sprite
            ? `<img src="${escapeHTML(pokemon.sprite)}"
                    alt="${escapeHTML(pokemon.name)}"
                    loading="lazy">`
            : "";

        const pokemonNumber = String(pokemon.id ?? "").padStart(3, "0");

        // HG・SS両方に出現する場合は「HG・SS」と表示
        const versionLabel = item.versionLabel || encounter.version || version;

        return `
            <article
                class="pokemon-card"
                style="--type-color:${typeStyle.color};--type-soft:${typeStyle.soft}"
            >
                ${sprite}

                <div class="pokemon-number">
                    全国図鑑 No.${escapeHTML(pokemonNumber)}
                </div>

                <h3>${escapeHTML(pokemon.name)}</h3>

                ${renderPokemonTypeTags(pokemon)}

                <p class="effort-value">
                    ${escapeHTML(getStatLabel(stat))} +${item.baseEffort}
                </p>

                <p>
                    <strong>出現場所：</strong>
                    ${escapeHTML(item.areaLabel)}
                </p>

                <p>
                    <strong>レベル：</strong>
                    ${escapeHTML(levelText)}
                </p>

                <p>
                    <strong>バージョン：</strong>
                    ${escapeHTML(versionLabel)}
                </p>

                ${methodText
                ? `<p>${escapeHTML(methodText)}</p>`
                : ""}

                ${chanceText
                ? `<p>${escapeHTML(chanceText)}</p>`
                : ""}

                <span class="tag">${escapeHTML(stageLabel)}</span>
            </article>
        `;
    }).join("");
}

/* =========================
   努力値計算
========================= */

function fillPokemonSelect() {
    const select = document.getElementById("calculatorPokemon");

    const sorted = [...pokemonList].sort((a, b) => a.id - b.id);

    select.innerHTML = `
        <option value="">ポケモンを選択</option>
        ${sorted.map(pokemon => `
            <option value="${pokemon.id}">
                No.${String(pokemon.id).padStart(3, "0")}
                ${escapeHTML(pokemon.name)}
            </option>
        `).join("")}
    `;
}

function getTargetEffort() {
    const targetSelect = document.getElementById("targetEffort");
    const customWrap = document.getElementById("customTargetWrap");

    customWrap.classList.toggle(
        "hidden",
        targetSelect.value !== "custom"
    );

    if (targetSelect.value !== "custom") {
        return Number(targetSelect.value);
    }

    const custom = Number(
        document.getElementById("customTarget").value
    );

    if (!Number.isFinite(custom)) {
        return 252;
    }

    return Math.max(0, Math.min(252, Math.floor(custom)));
}

function calculateEffort() {
    const pokemonId = Number(
        document.getElementById("calculatorPokemon").value
    );

    const stat = document.getElementById("calculatorStat").value;
    const powerItemKey = document.getElementById("powerItem").value;
    const hasPokerus = document.getElementById("pokerus").checked;
    const target = getTargetEffort();

    const result = document.getElementById("calculatorResult");

    const pokemon = pokemonList.find(item => item.id === pokemonId);

    if (!pokemon) {
        result.textContent = "対象ポケモンを選択してください。";
        return;
    }

    const baseEffort = Number(pokemon.effort?.[stat] || 0);
    const powerItem = POWER_ITEMS[powerItemKey] || POWER_ITEMS.none;

    const itemBonus = powerItem.stat === stat
        ? powerItem.bonus
        : 0;

    const beforePokerus = baseEffort + itemBonus;
    const gained = beforePokerus * (hasPokerus ? 2 : 1);

    const needed = target === 0
        ? 0
        : Math.ceil(target / Math.max(gained, 1));

    const itemText = powerItem.stat === stat
        ? `${powerItem.name}（+${powerItem.bonus}）`
        : powerItem.stat
            ? `${powerItem.name}（選択能力への追加なし）`
            : "なし";

    result.innerHTML = `
        <p><strong>${escapeHTML(pokemon.name)}</strong>を倒した場合</p>
        <p>基礎努力値：${baseEffort}</p>
        <p>パワー系アイテム：${escapeHTML(itemText)}</p>
        <p>ポケルス：${hasPokerus ? "あり（2倍）" : "なし"}</p>

        <hr>

        <p>
            1匹あたりの${escapeHTML(getStatLabel(stat))}努力値：
            <strong>${gained}</strong>
        </p>

        <p>目標努力値：${target}</p>

        <p>
            必要な撃破数の目安：
            <strong>${needed}匹</strong>
        </p>

        <p class="small-note">
            ${target === 0
            ? "目標が0のため、撃破する必要はありません。"
            : `目標値に達するには、獲得量を合計${needed * gained}にする計算です。`
        }
        </p>

        <p class="small-note">
            ※ 現在の努力値は考慮していません。
            実際の獲得量は、努力値の上限に達している場合などに変わります。
        </p>
    `;
}

/* =========================
   初期化
========================= */

async function initializeTrainingPage() {
    document.getElementById("natureUpFilter")
        .addEventListener("change", renderNatures);

    document.getElementById("natureDownFilter")
        .addEventListener("change", renderNatures);

    document.getElementById("effortStat")
        .addEventListener("change", renderRecommendations);

    document.getElementById("effortVersion")
        .addEventListener("change", renderRecommendations);

    document.querySelectorAll('input[name="effortStage"]')
        .forEach(input => {
            input.addEventListener("change", renderRecommendations);
        });

    document.getElementById("targetEffort")
        .addEventListener("change", getTargetEffort);

    document.getElementById("calculateButton")
        .addEventListener("click", calculateEffort);

    renderNatures();
    getTargetEffort();

    try {
        const response = await fetch("data/pokemon.json");

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.pokemon)) {
            throw new Error("pokemon.json に pokemon 配列がありません。");
        }

        pokemonList = data.pokemon;

        fillPokemonSelect();
        renderRecommendations();

    } catch (error) {
        console.error(
            "ポケモンデータの読み込みに失敗しました:",
            error
        );

        document.getElementById("effortStatus").textContent =
            "ポケモンデータの読み込みに失敗しました。" +
            " data/pokemon.json のパスとJSON形式を確認してください。";
    }
}

document.addEventListener(
    "DOMContentLoaded",
    initializeTrainingPage
);