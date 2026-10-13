
/* ========================================
   HGSS 旅パおすすめ
   js/party.js
======================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const versionSelect = document.getElementById("versionSelect");
    const starterSelect = document.getElementById("starterSelect");
    const starterResult = document.getElementById("starterResult");
    const candidateStatus = document.getElementById("candidateStatus");
    const candidateList = document.getElementById("candidateList");

    if (
        !versionSelect ||
        !starterSelect ||
        !starterResult ||
        !candidateStatus ||
        !candidateList
    ) {
        console.error("party.htmlに必要な要素が見つかりません。");
        return;
    }

    /* ----------------------------------------
       御三家
    ---------------------------------------- */

    const starters = {
        "152": {
            id: 154,
            name: "メガニウム",
            english: "Meganium",
            originalName: "チコリータ",
            types: ["くさ"],
            role: "耐久・サポート型",
            description:
                "耐久力と補助技を活かす御三家。ほのお・みず・でんきタイプなどの仲間を加えて、苦手な相手に対応しましょう。",
            moves: ["はっぱカッター", "こうごうせい", "ひかりのかべ", "のしかかり"]
        },
        "155": {
            id: 157,
            name: "バクフーン",
            english: "Typhlosion",
            originalName: "ヒノアラシ",
            types: ["ほのお"],
            role: "特殊攻撃型",
            description:
                "すばやさと特殊攻撃を活かすアタッカー。ほのお技を中心に、弱点を補う技を組み合わせます。",
            moves: ["かえんほうしゃ", "きあいだま", "スピードスター", "あなをほる"]
        },
        "158": {
            id: 160,
            name: "オーダイル",
            english: "Feraligatr",
            originalName: "ワニノコ",
            types: ["みず"],
            role: "物理攻撃型",
            description:
                "こうげきの高さを活かせる御三家。みず技を軸に、こおり技やあく技などを組み合わせます。",
            moves: ["たきのぼり", "こおりのキバ", "かみくだく", "なみのり"]
        }
    };

    /* ----------------------------------------
       旅パ候補
       御三家による候補の絞り込みは行いません。
       versions:
       both       = 両バージョン
       heartgold  = ハートゴールド限定
       soulsilver = ソウルシルバー限定

       movesは技構成例です。
       習得レベル・技マシン・入手時期は
       ゲーム内で個別に確認してください。
    ---------------------------------------- */

    const candidates = [
        {
            id: 181,
            name: "デンリュウ",
            english: "Ampharos",
            types: ["でんき"],
            versions: ["both"],
            role: "でんきタイプの特殊アタッカー",
            reason: "みず・ひこうタイプ対策におすすめ。メリープから育てられ、ストーリー攻略でも使いやすいポケモンです。",
            location: "32ばんどうろなど",
            timing: "序盤",
            moves: ["10まんボルト", "ほうでん", "でんじは", "ひかりのかべ"],
            notes: ["メリープから育成可能"]
        },
        {
            id: 169,
            name: "クロバット",
            english: "Crobat",
            types: ["どく", "ひこう"],
            versions: ["both"],
            role: "すばやい物理アタッカー",
            reason: "高いすばやさが魅力。そらをとぶを覚えさせれば移動にも役立ちます。",
            location: "洞くつなどでズバットを捕獲",
            timing: "序盤から",
            moves: ["そらをとぶ", "つばさでうつ", "かみつく", "あやしいひかり"],
            notes: ["ゴルバットからなつき進化"]
        },
        {
            id: 214,
            name: "ヘラクロス",
            english: "Heracross",
            types: ["むし", "かくとう"],
            versions: ["both"],
            role: "物理アタッカー",
            reason: "こうげきが高く、ノーマル・あく・いわタイプなどへの対策になります。",
            location: "ずつきができる木",
            timing: "ずつきが使えるようになってから",
            moves: ["インファイト", "メガホーン", "つばめがえし", "いわくだき"],
            notes: ["木によって出現しない場合があります"]
        },
        {
            id: 131,
            name: "ラプラス",
            english: "Lapras",
            types: ["みず", "こおり"],
            versions: ["both"],
            role: "耐久型の特殊アタッカー",
            reason: "みず・こおりの攻撃範囲が優秀。ドラゴンタイプ対策にも活躍できます。",
            location: "つながりのどうくつの水上エリア",
            timing: "なみのり入手後。出現曜日に注意",
            moves: ["なみのり", "れいとうビーム", "サイコキネシス", "のしかかり"],
            notes: ["出現条件を確認してから探しましょう"]
        },
        {
            id: 195,
            name: "ヌオー",
            english: "Quagsire",
            types: ["みず", "じめん"],
            versions: ["both"],
            role: "みず・じめんの補完役",
            reason: "でんき技を無効化できるのが強み。みず技とじめん技を使い分けられます。",
            location: "水辺などでウパーを捕獲",
            timing: "序盤から",
            moves: ["じしん", "なみのり", "れいとうビーム", "いわくだき"],
            notes: ["くさ技は4倍弱点"]
        },
        {
            id: 130,
            name: "ギャラドス",
            english: "Gyarados",
            types: ["みず", "ひこう"],
            versions: ["both"],
            role: "物理アタッカー・ひでん補助",
            reason: "こうげきが高く、戦闘とひでん技の両方で活躍できます。いかりのみずうみの赤いギャラドスも候補です。",
            location: "コイキングを釣る。いかりのみずうみでもイベント入手",
            timing: "序盤から育成可能",
            moves: ["たきのぼり", "こおりのキバ", "かみくだく", "じしん"],
            notes: ["でんき技は4倍弱点"]
        },
        {
            id: 75,
            name: "ゴローン",
            english: "Graveler",
            types: ["いわ", "じめん"],
            versions: ["both"],
            role: "いわ・じめんの物理アタッカー",
            reason: "ノーマル・ひこう・ほのおなどの相手に強い候補です。",
            location: "洞くつや山道など",
            timing: "序盤から中盤",
            moves: ["いわなだれ", "じしん", "かいりき", "いわくだき"],
            notes: ["ゴローニャへの進化には通信交換が必要"]
        },
        {
            id: 94,
            name: "ゲンガー",
            english: "Gengar",
            types: ["ゴースト", "どく"],
            versions: ["both"],
            role: "特殊アタッカー",
            reason: "とくこうとすばやさが高く、ゴースト技や補助技で戦えます。",
            location: "洞くつなどでゴースを捕獲",
            timing: "序盤から育成可能",
            moves: ["シャドーボール", "あくのはどう", "さいみんじゅつ", "10まんボルト"],
            notes: ["ゴーストからゴーストへの進化後、通信交換でゲンガーに進化"]
        },
        {
            id: 65,
            name: "フーディン",
            english: "Alakazam",
            types: ["エスパー"],
            versions: ["both"],
            role: "高速特殊アタッカー",
            reason: "とくこうとすばやさが高く、かくとう・どくタイプなどへの対策になります。",
            location: "ケーシィを捕獲",
            timing: "序盤から育成可能",
            moves: ["サイコキネシス", "シャドーボール", "エナジーボール", "でんじは"],
            notes: ["ケーシィからユンゲラーへ進化後、通信交換が必要"]
        },
        {
            id: 22,
            name: "オニドリル",
            english: "Fearow",
            types: ["ノーマル", "ひこう"],
            versions: ["both"],
            role: "物理ひこうアタッカー",
            reason: "進化が比較的早く、ひこう技を使うアタッカーとして活躍します。",
            location: "序盤の道路などでオニスズメを捕獲",
            timing: "序盤",
            moves: ["ドリルくちばし", "そらをとぶ", "おんがえし", "はねやすめ"],
            notes: ["オニスズメからレベルアップで進化"]
        },
        {
            id: 123,
            name: "ストライク",
            english: "Scyther",
            types: ["むし", "ひこう"],
            versions: ["both"],
            role: "物理アタッカー",
            reason: "こうげきとすばやさが高め。むし・ひこう技を使い分けられます。",
            location: "しぜんこうえんの虫取り大会",
            timing: "虫取り大会の開催時",
            moves: ["シザークロス", "つばめがえし", "つるぎのまい", "おんがえし"],
            notes: ["ハッサムへの進化にはメタルコートを持たせて通信交換が必要"]
        },
        {
            id: 82,
            name: "レアコイル",
            english: "Magneton",
            types: ["でんき", "はがね"],
            versions: ["both"],
            role: "でんき・はがねの特殊アタッカー",
            reason: "耐性が多く、みず・ひこうタイプへの対策にもなります。",
            location: "コイルを捕獲して育成",
            timing: "出現場所・進化条件を確認",
            moves: ["10まんボルト", "でんじは", "ラスターカノン", "トライアタック"],
            notes: ["レアコイルからジバコイルへの進化はHGSS内ではできません"]
        },
        {
            id: 171,
            name: "ランターン",
            english: "Lanturn",
            types: ["みず", "でんき"],
            versions: ["both"],
            role: "みず・でんきの特殊アタッカー",
            reason: "みずとでんきの技を両方使えるため、対応できる相手が広いポケモンです。",
            location: "チョンチーを釣りなどで捕獲",
            timing: "水辺に行けるようになってから",
            moves: ["なみのり", "10まんボルト", "れいとうビーム", "でんじは"],
            notes: ["チョンチーからレベルアップで進化"]
        },
        {
            id: 59,
            name: "ウインディ",
            english: "Arcanine",
            types: ["ほのお"],
            versions: ["heartgold"],
            role: "ほのおタイプの攻撃役",
            reason: "ハートゴールド限定のガーディ系統。こうげきが高く、ほのおタイプの候補になります。",
            location: "ガーディを捕獲",
            timing: "出現する道路を確認",
            moves: ["かえんほうしゃ", "かみくだく", "しんそく", "あなをほる"],
            notes: ["進化にはほのおのいしが必要"]
        },
        {
            id: 38,
            name: "キュウコン",
            english: "Ninetales",
            types: ["ほのお"],
            versions: ["soulsilver"],
            role: "ほのおタイプの特殊アタッカー",
            reason: "ソウルシルバー限定のロコン系統。ほのおタイプを補いたいときにおすすめです。",
            location: "ロコンを捕獲",
            timing: "出現する道路を確認",
            moves: ["かえんほうしゃ", "あやしいひかり", "おにび", "かげぶんしん"],
            notes: ["進化にはほのおのいしが必要"]
        },
        {
            id: 164,
            name: "ヨルノズク",
            english: "Noctowl",
            types: ["ノーマル", "ひこう"],
            versions: ["both"],
            role: "ひこう・特殊攻撃役",
            reason: "序盤から仲間にでき、補助技も使えます。そらをとぶ要員にもなります。",
            location: "夜の道路などでホーホーを捕獲",
            timing: "序盤",
            moves: ["そらをとぶ", "エアスラッシュ", "さいみんじゅつ", "じんつうりき"],
            notes: ["ホーホーからレベルアップで進化"]
        },
        {
            id: 12,
            name: "バタフリー",
            english: "Butterfree",
            types: ["むし", "ひこう"],
            versions: ["both"],
            role: "状態異常・特殊攻撃役",
            reason: "ねむりごななどの状態異常技が便利。捕獲の補助にも使えます。",
            location: "序盤の道路でキャタピーを捕獲",
            timing: "序盤。出現条件は確認してください",
            moves: ["むしのさざめき", "エアスラッシュ", "ねむりごな", "サイコキネシス"],
            notes: ["バタフリーは特殊攻撃・補助技を活かす構成がおすすめ"]
        },
        {
            id: 73,
            name: "ドククラゲ",
            english: "Tentacruel",
            types: ["みず", "どく"],
            versions: ["both"],
            role: "みずタイプの特殊アタッカー",
            reason: "水上で出会いやすく、みず技を軸に戦えます。",
            location: "なみのりで行ける水辺",
            timing: "なみのり入手後",
            moves: ["なみのり", "どくづき", "れいとうビーム", "たきのぼり"],
            notes: ["ひでん技を覚えさせる場合は技枠を調整"]
        },
        {
            id: 62,
            name: "ニョロボン",
            english: "Poliwrath",
            types: ["みず", "かくとう"],
            versions: ["both"],
            role: "みず・かくとうの物理アタッカー",
            reason: "みず技に加え、かくとう技でいわ・ノーマル・あくタイプなどに対応できます。",
            location: "水辺などでニョロモを捕獲",
            timing: "水辺に行けるようになってから",
            moves: ["なみのり", "かわらわり", "れいとうパンチ", "さいみんじゅつ"],
            notes: ["ニョロゾにみずのいしを使って進化"]
        },
        {
            id: 196,
            name: "エーフィ",
            english: "Espeon",
            types: ["エスパー"],
            versions: ["both"],
            role: "高速特殊アタッカー",
            reason: "とくこうとすばやさを活かして、どく・かくとうタイプなどに対応します。",
            location: "コガネシティで入手するイーブイ",
            timing: "なつき度を上げて昼にレベルアップ",
            moves: ["サイコキネシス", "シャドーボール", "でんじは", "あさのひざし"],
            notes: ["イーブイの進化条件に注意"]
        },
        {
            id: 55,
            name: "ゴルダック",
            english: "Golduck",
            types: ["みず"],
            versions: ["both"],
            role: "みずタイプ・ひでん補助",
            reason: "複数のひでん技を覚えられる候補。通常の戦闘用にも育成できます。",
            location: "水辺などでコダックを捕獲",
            timing: "出現場所を確認",
            moves: ["なみのり", "れいとうビーム", "サイコキネシス", "かいりき"],
            notes: ["ひでん要員としては殿堂入り後の候補"]
        },
        {
            id: 181,
            name: "デンリュウ",
            english: "Ampharos",
            types: ["でんき"],
            versions: ["both"],
            role: "でんきタイプの攻撃役",
            reason: "序盤から育成できる、旅パ向けのでんきタイプです。",
            location: "32ばんどうろなど",
            timing: "序盤",
            moves: ["ほうでん", "10まんボルト", "でんじは", "ひかりのかべ"],
            notes: ["この候補は上部のデンリュウと同一のため、重複登録を避けています"]
        },
        {
            id: 195,
            name: "ヌオー",
            english: "Quagsire",
            types: ["みず", "じめん"],
            versions: ["both"],
            role: "でんき技を無効化する補完役",
            reason: "みず・じめんの複合タイプで、でんき技を無効化できます。",
            location: "ウパーを捕獲",
            timing: "序盤から",
            moves: ["じしん", "なみのり", "れいとうビーム", "いわくだき"],
            notes: ["この候補は上部のヌオーと同一のため、重複登録を避けています"]
        },
        {
            id: 15,
            name: "スピアー",
            english: "Beedrill",
            types: ["むし", "どく"],
            versions: ["both"],
            role: "むしタイプの物理アタッカー",
            reason: "序盤に育成しやすいむしタイプ。序盤の攻略候補として使えます。",
            location: "序盤の道路でビードルを捕獲",
            timing: "序盤。出現条件は確認してください",
            moves: ["シザークロス", "どくづき", "とんぼがえり", "つばめがえし"],
            notes: ["出現バージョンや場所を確認してください"]
        },
        {
            id: 130,
            name: "ギャラドス",
            english: "Gyarados",
            types: ["みず", "ひこう"],
            versions: ["both"],
            role: "高火力・ひでん補助",
            reason: "高いこうげきと多彩な技が魅力。ひでん技要員としても便利です。",
            location: "コイキングを釣る",
            timing: "序盤から育成可能",
            moves: ["たきのぼり", "こおりのキバ", "かみくだく", "じしん"],
            notes: ["この候補は上部のギャラドスと同一のため、重複登録を避けています"]
        },
        {
            id: 241,
            name: "ミルタンク",
            english: "Miltank",
            types: ["ノーマル"],
            versions: ["both"],
            role: "耐久・物理アタッカー",
            reason: "耐久力と回復技が魅力。ノーマルタイプの候補を増やしたい場合におすすめです。",
            location: "38ばんどうろなど",
            timing: "中盤",
            moves: ["のしかかり", "ミルクのみ", "ふみつけ", "かわらわり"],
            notes: ["入手場所や出現条件を確認してください"]
        },
        {
            id: 59,
            name: "ウインディ",
            english: "Arcanine",
            types: ["ほのお"],
            versions: ["heartgold"],
            role: "ほのおタイプの物理アタッカー",
            reason: "高いこうげきを活かせるハートゴールド限定の候補です。",
            location: "ガーディを捕獲",
            timing: "出現する道路を確認",
            moves: ["かえんほうしゃ", "かみくだく", "しんそく", "あなをほる"],
            notes: ["進化にはほのおのいしが必要"]
        },
        {
            id: 38,
            name: "キュウコン",
            english: "Ninetales",
            types: ["ほのお"],
            versions: ["soulsilver"],
            role: "ほのおタイプの攻撃役",
            reason: "ソウルシルバー限定のロコン系統。ほのおタイプの候補になります。",
            location: "ロコンを捕獲",
            timing: "出現する道路を確認",
            moves: ["かえんほうしゃ", "あやしいひかり", "おにび", "かげぶんしん"],
            notes: ["進化にはほのおのいしが必要"]
        }
    ];

    /* ----------------------------------------
       参考サイト
    ---------------------------------------- */

    const referenceSites = [
        {
            name: "HGSS攻略Wiki：お勧めポケモン1",
            description: "序盤・中盤の旅パ候補、タイプ、出現場所、特徴を確認できます。",
            url: "https://w.atwiki.jp/hgss/pages/23.html",
            category: "旅パ候補"
        },
        {
            name: "HGSS攻略Wiki：お勧めポケモン2",
            description: "終盤・殿堂入り後の候補を確認できます。",
            url: "https://w.atwiki.jp/hgss/pages/126.html",
            category: "終盤・クリア後"
        },
        {
            name: "HGSS攻略Wiki：出現情報メモ",
            description: "バージョン限定や出現場所の違いを確認できます。",
            url: "https://w.atwiki.jp/hgss/pages/31.html",
            category: "出現・入手"
        },
        {
            name: "HGSS攻略Wiki：秘伝・捕獲要員",
            description: "ひでん技や捕獲を担当するポケモンを考える際の参考です。",
            url: "https://w.atwiki.jp/hgss/pages/127.html",
            category: "ひでん・捕獲"
        },
        {
            name: "HGSSの旅パおすすめポケモン15選",
            description: "ストーリー攻略向けの候補や技構成例を比較できます。",
            url: "https://rabbitlife1989.com/hgss-tabipa",
            category: "旅パ候補"
        },
        {
            name: "ポケモン徹底攻略：HGSSわざマシン一覧",
            description: "わざマシンの入手場所・入手条件を確認できます。",
            url: "https://yakkun.com/hs/machine.htm",
            category: "技・入手方法"
        },
        {
            name: "HGSS攻略館：わざマシン一覧",
            description: "技マシンの入手条件を照合するための資料です。",
            url: "https://kingin.koro-pokemon.com/p_waza-mashin.shtml",
            category: "技・入手方法"
        },
        {
            name: "HGSS攻略館：ひでんマシン一覧",
            description: "ひでんマシンの入手条件を確認できます。",
            url: "https://kingin.koro-pokemon.com/p_hiden-mashin.shtml",
            category: "ひでん技"
        }
    ];

    /* ----------------------------------------
       共通処理
    ---------------------------------------- */

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (character) => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };
            return entities[character];
        });
    }

    function imageUrl(id) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    }

    function imageHtml(pokemon, small = false) {
        return `
            <img
                class="party-pokemon-image${small ? " party-pokemon-image-small" : ""}"
                src="${imageUrl(pokemon.id)}"
                alt="${escapeHtml(pokemon.name)}"
                loading="lazy"
                onerror="this.style.display='none'"
            >
        `;
    }

    function renderTags(types) {
        return types.map((type) =>
            `<span class="party-tag">${escapeHtml(type)}</span>`
        ).join("");
    }

    function renderMoves(moves, heading = "おすすめ技構成") {
        return `
            <div class="party-moves">
                <h4>${escapeHtml(heading)}</h4>
                <ul>
                    ${moves.map((move) =>
            `<li>${escapeHtml(move)}</li>`
        ).join("")}
                </ul>
                <p class="party-card-subtitle">
                    ※技構成例です。習得レベル・技マシンの入手時期・秘伝技との両立は個別に確認してください。
                </p>
            </div>
        `;
    }

    function renderNotes(notes) {
        if (!notes || notes.length === 0) {
            return "";
        }

        return `
            <ul class="party-detail-list">
                ${notes.map((note) =>
            `<li>${escapeHtml(note)}</li>`
        ).join("")}
            </ul>
        `;
    }

    /* ----------------------------------------
       御三家表示
    ---------------------------------------- */

    function renderStarter() {
        const pokemon = starters[starterSelect.value];

        if (!pokemon) {
            starterResult.innerHTML =
                '<p class="party-empty">御三家を選択してください。</p>';
            return;
        }

        starterResult.innerHTML = `
            <article class="party-card party-starter-card">
                <div class="party-card-top">
                    ${imageHtml(pokemon)}
                    <div>
                        <div class="party-card-subtitle">
                            全国図鑑 No.${pokemon.id}
                        </div>
                        <h3>${escapeHtml(pokemon.name)}</h3>
                        <div class="party-card-subtitle">
                            ${escapeHtml(pokemon.english)}
                        </div>
                        <div class="party-card-subtitle">
                            進化前：${escapeHtml(pokemon.originalName)}
                        </div>
                    </div>
                </div>

                <div class="party-tag-list">
                    ${renderTags(pokemon.types)}
                </div>

                <p><strong>役割：</strong>${escapeHtml(pokemon.role)}</p>
                <p>${escapeHtml(pokemon.description)}</p>

                ${renderMoves(pokemon.moves)}

                <a class="party-card-link" href="pokedex.html">
                    図鑑を見る →
                </a>
            </article>
        `;
    }

    /* ----------------------------------------
       旅パ候補表示
       御三家による絞り込みは行わない。
       バージョン限定だけ切り替える。
    ---------------------------------------- */

    function renderCandidates() {
        const version = versionSelect.value;

        const versionName = version === "heartgold"
            ? "ハートゴールド"
            : "ソウルシルバー";

        const filtered = candidates.filter((pokemon) => {
            return (
                pokemon.versions.includes("both") ||
                pokemon.versions.includes(version)
            );
        });

        const uniqueCandidates = [];
        const seenIds = new Set();

        filtered.forEach((pokemon) => {
            if (seenIds.has(pokemon.id)) {
                return;
            }

            seenIds.add(pokemon.id);
            uniqueCandidates.push(pokemon);
        });

        candidateStatus.textContent =
            `${versionName}の旅パ候補：${uniqueCandidates.length}匹。御三家に関係なく表示しています。`;

        candidateList.innerHTML = uniqueCandidates.map((pokemon) => {
            const versionLabel = pokemon.versions.includes("both")
                ? "両バージョン"
                : versionName;

            const versionNotice = pokemon.versions.includes("both")
                ? ""
                : `<p class="party-version-notice"><strong>バージョン限定：</strong>${escapeHtml(versionName)}で入手可能</p>`;

            return `
                <article class="party-card party-candidate-card">
                    <div class="party-card-top">
                        ${imageHtml(pokemon, true)}
                        <div>
                            <div class="party-card-subtitle">
                                全国図鑑 No.${pokemon.id}
                            </div>
                            <h3>${escapeHtml(pokemon.name)}</h3>
                            <div class="party-card-subtitle">
                                ${escapeHtml(pokemon.english)}
                            </div>
                        </div>
                    </div>

                    <div class="party-tag-list">
                        ${renderTags(pokemon.types)}
                        <span class="party-tag">${escapeHtml(versionLabel)}</span>
                    </div>

                    <p><strong>役割：</strong>${escapeHtml(pokemon.role)}</p>
                    <p>${escapeHtml(pokemon.reason)}</p>

                    ${versionNotice}

                    <ul class="party-detail-list">
                        <li><strong>入手場所：</strong>${escapeHtml(pokemon.location)}</li>
                        <li><strong>入手時期：</strong>${escapeHtml(pokemon.timing)}</li>
                    </ul>

                    ${renderNotes(pokemon.notes)}
                    ${renderMoves(pokemon.moves)}

                    <a class="party-card-link" href="pokedex.html">
                        図鑑を見る →
                    </a>
                </article>
            `;
        }).join("");
    }

    /* ----------------------------------------
       ひでん要員
    ---------------------------------------- */

    function renderHmCards() {
        const hmPokemon = [
            {
                id: 83,
                name: "カモネギ",
                moves: ["そらをとぶ", "いあいぎり"]
            },
            {
                id: 130,
                name: "ギャラドス",
                moves: ["かいりき", "なみのり", "たきのぼり", "うずしお", "いわくだき"]
            },
            {
                id: 55,
                name: "ゴルダック",
                moves: ["なみのり", "かいりき", "うずしお", "いわくだき", "たきのぼり", "ロッククライム", "フラッシュ"]
            }
        ];

        document.querySelectorAll(".party-hm-card").forEach((card) => {
            const title = card.querySelector("h3");
            const imageContainer = card.querySelector(".party-hm-image");

            if (!title || !imageContainer) {
                return;
            }

            const pokemon = hmPokemon.find((entry) =>
                title.textContent.includes(entry.name)
            );

            if (!pokemon) {
                return;
            }

            imageContainer.innerHTML = imageHtml(pokemon);

            const oldMoves = card.querySelector(".party-hm-moves");
            if (oldMoves) {
                oldMoves.remove();
            }

            const movesElement = document.createElement("div");
            movesElement.className = "party-moves party-hm-moves";
            movesElement.innerHTML = `
                <h4>対応するひでん技</h4>
                <ul>
                    ${pokemon.moves.map((move) =>
                `<li>${escapeHtml(move)}</li>`
            ).join("")}
                </ul>
            `;
            card.appendChild(movesElement);

            const oldNotice = card.querySelector(".party-hm-postgame-notice");
            if (oldNotice) {
                oldNotice.remove();
            }

            if (pokemon.id === 55) {
                const notice = document.createElement("p");
                notice.className = "party-hm-postgame-notice";
                notice.textContent =
                    "殿堂入り後のひでん要員候補として表示しています。";
                card.appendChild(notice);
            }
        });
    }

    /* ----------------------------------------
       参考サイト
    ---------------------------------------- */

    function renderReferenceSites() {
        if (document.getElementById("partyReferenceSection")) {
            return;
        }

        const section = document.createElement("section");
        section.id = "partyReferenceSection";
        section.className = "party-reference-section";

        section.style.cssText = [
            "max-width:1100px",
            "margin:32px auto",
            "padding:24px",
            "background:#fff",
            "border:3px solid #f4b5ce",
            "border-radius:22px",
            "box-shadow:0 6px 0 #f6d9e5"
        ].join(";");

        section.innerHTML = `
            <h2 style="margin-top:0;color:#a83f72;">
                📚 参考サイト・情報源
            </h2>

            <p>
                旅パ候補、出現場所、バージョン差、技マシンなどを調べるための参考サイトです。
                技構成はおすすめ例であり、すべての技の習得時期・入手条件を検証済みという意味ではありません。
            </p>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;">
                ${referenceSites.map((site) => `
                    <article style="border:2px solid #f3d5e2;border-radius:15px;padding:15px;background:#fff9fc;">
                        <span style="display:inline-block;background:#ffe5ef;color:#93365f;padding:4px 9px;border-radius:999px;font-size:.8rem;font-weight:bold;">
                            ${escapeHtml(site.category)}
                        </span>

                        <h3 style="font-size:1rem;line-height:1.5;">
                            ${escapeHtml(site.name)}
                        </h3>

                        <p style="font-size:.92rem;line-height:1.7;">
                            ${escapeHtml(site.description)}
                        </p>

                        <a
                            href="${escapeHtml(site.url)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="color:#9b3567;font-weight:bold;text-decoration:underline;"
                        >
                            参考ページを開く ↗
                        </a>
                    </article>
                `).join("")}
            </div>
        `;

        const footer = document.querySelector("footer");

        if (footer && footer.parentNode) {
            footer.parentNode.insertBefore(section, footer);
        } else {
            document.body.appendChild(section);
        }
    }

    /* ----------------------------------------
       初期化
    ---------------------------------------- */

    function updatePage() {
        renderStarter();
        renderCandidates();
    }

    versionSelect.addEventListener("change", updatePage);
    starterSelect.addEventListener("change", updatePage);

    renderHmCards();
    updatePage();
    renderReferenceSites();
});
