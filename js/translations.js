
"use strict";

// ========================================
// HGSS 出現情報 日本語変換
// ========================================

const HGSS_TRANSLATIONS = {

    // 出現場所
    locations: {
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

        // 特殊エリア
        "unknown-all-bugs-area":
            "虫取り大会の出現エリア（詳細地点不明）"
    },

    // 地名に付く詳細エリア
    areaDetails: {
        "north-towards-pewter-city":
            "ニビシティ方面・北側",
        "south": "南側",
        "north": "北側",
        "east": "東側",
        "west": "西側",
        "inside": "内部",
        "outside": "屋外",
        "interior": "内部",
        "exterior": "屋外",
        "entrance": "入口",
        "grass": "草むら",
        "water": "水上",
        "cave": "洞窟",
        "basement": "地下",
        "roof": "屋上",
        "1f": "1階",
        "2f": "2階",
        "3f": "3階",
        "4f": "4階",
        "5f": "5階",
        "b1f": "地下1階",
        "b2f": "地下2階",
        "b3f": "地下3階",
        "b4f": "地下4階"
    },

    // 出現方法
    methods: {
        "walk": "草むら・洞窟",
        "surf": "なみのり",
        "old-rod": "ボロのつりざお",
        "good-rod": "いいつりざお",
        "super-rod": "すごいつりざお",
        "rock-smash": "いわくだき",
        "headbutt-low": "ずつき",
        "headbutt-normal": "ずつき",
        "headbutt-high": "ずつき",
        "gift": "人からもらう",
        "gift-egg": "タマゴをもらう",
        "only-one": "固定シンボル"
    },

    // 出現条件
    conditions: {
        "time-morning": "朝",
        "time-day": "昼",
        "time-night": "夜",

        "swarm-yes": "大量発生時",
        "swarm-no": "通常時",

        "radio-on": "ラジオ使用中",
        "radio-off": "ラジオ未使用",

        "headbutt-tree-common":
            "ずつきで出現する通常の木",
        "headbutt-tree-rare":
            "ずつきで出現する珍しい木",

        "bug-catching-contest-yes":
            "虫取り大会開催中",
        "bug-catching-contest-no":
            "虫取り大会開催外",

        "story-progress-before-national-dex":
            "全国図鑑入手前",
        "story-progress-after-national-dex":
            "全国図鑑入手後",

        "radar-on": "ポケトレ使用",
        "radar-off": "ポケトレ未使用",

        "slot2-ruby": "ルビーを挿入",
        "slot2-sapphire": "サファイアを挿入",
        "slot2-emerald": "エメラルドを挿入",
        "slot2-firered": "ファイアレッドを挿入",
        "slot2-leafgreen": "リーフグリーンを挿入"
    }
};

// ========================================
// 共通変換関数
// ========================================

function hgssTranslateValue(value, dictionary) {
    const text = String(value ?? "");

    if (!text) return "";

    return dictionary[text] || text;
}

// ========================================
// 出現場所
// ========================================

function hgssTranslateAreaId(areaId) {
    const id = String(areaId ?? "").trim();

    if (!id) return "場所不明";

    const locations = HGSS_TRANSLATIONS.locations;
    const details = HGSS_TRANSLATIONS.areaDetails;

    // 特殊エリア・完全一致
    if (locations[id]) {
        return locations[id];
    }

    // ジョウト・カントーの道路番号
    const route = id.match(
        /^(?:(?:johto|kanto)-)?route-(\d+)(?:-(.*))?$/
    );

    if (route) {
        const name = `${Number(route[1])}ばんどうろ`;
        const suffix = (route[2] || "")
            .replace(/-area$/, "");

        if (!suffix) return name;

        const detail = details[suffix];

        return detail
            ? `${name}（${detail}）`
            : `${name}（未翻訳エリア: ${suffix}）`;
    }

    // 地名の先頭一致
    const keys = Object.keys(locations)
        .sort((a, b) => b.length - a.length);

    for (const key of keys) {
        if (id === key || id === `${key}-area`) {
            return locations[key];
        }

        if (id.startsWith(`${key}-`)) {
            const suffix = id
                .slice(key.length + 1)
                .replace(/-area$/, "");

            if (!suffix) return locations[key];

            const detail = details[suffix];

            return detail
                ? `${locations[key]}（${detail}）`
                : `${locations[key]}（未翻訳エリア: ${suffix}）`;
        }
    }

    return `未翻訳の場所（${id}）`;
}

function hgssTranslateArea(record) {
    const area = String(record?.area ?? "");
    const areaId = String(record?.area_id ?? "");

    // 以前確認した特殊エリア名
    const specialAreas = {
        "unknown-all-bugs-area":
            "虫取り大会の出現エリア（詳細地点不明）"
    };

    // area_id と area の両方を確認
    for (const id of [areaId, area]) {
        if (specialAreas[id]) {
            return specialAreas[id];
        }
    }

    // 日本語の地名に英語の詳細名が残っている場合
    if (area.includes("2ばんどうろ")) {
        if (area.includes("north-towards-pewter-city")) {
            return "2ばんどうろ（ニビシティ方面・北側）";
        }
    }

    // 既存の翻訳関数で処理
    const translated = hgssTranslateAreaId(areaId || area);

    if (!translated.includes("未翻訳")) {
        return translated;
    }

    // 既に日本語になっている地名を優先して利用
    if (/[ぁ-んァ-ヶ一-龠]/.test(area)) {
        return area
            .replace(
                "未翻訳エリア: north-towards-pewter-city",
                "ニビシティ方面・北側"
            )
            .replace(
                "unknown-all-bugs-area",
                "虫取り大会の出現エリア（詳細地点不明）"
            );
    }

    return translated;
}

function hgssTranslateCondition(condition) {
    const translations = {
        "headbutt-tree-common":
            "ずつきで出現する通常の木",

        "radio-off":
            "ラジオ未使用",

        "bug-catching-contest-yes":
            "虫取り大会開催中",

        "story-progress-before-national-dex":
            "全国図鑑入手前"
    };

    const text = String(condition ?? "");

    return translations[text]
        || HGSS_TRANSLATIONS.conditions[text]
        || text;
}
