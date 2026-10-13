
import json
import re
import time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "pokemon.json"
API = "https://pokeapi.co/api/v2"

METHODS = {
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
    "only-one": "固定シンボル",
    "squirt-bottle": "ゼニガメじょうろ",
    "pokeflute": "ポケモンのふえ"
}

CONDITIONS = {
    "time-morning": "朝",
    "time-day": "昼",
    "time-night": "夜",
    "swarm-yes": "大量発生",
    "swarm-no": "通常",
    "slot2-ruby": "ルビーを挿入",
    "slot2-sapphire": "サファイアを挿入",
    "slot2-emerald": "エメラルドを挿入",
    "slot2-firered": "ファイアレッドを挿入",
    "slot2-leafgreen": "リーフグリーンを挿入"
}

SUFFIXES = {
    "area": "",
    "1f": "1階",
    "2f": "2階",
    "3f": "3階",
    "4f": "4階",
    "5f": "5階",
    "b1f": "地下1階",
    "b2f": "地下2階",
    "b3f": "地下3階",
    "b4f": "地下4階",
    "inside": "内部",
    "outside": "屋外",
    "interior": "内部",
    "exterior": "屋外",
    "north": "北",
    "south": "南",
    "east": "東",
    "west": "西",
    "entrance": "入口",
    "grass": "草むら",
    "water": "水上",
    "cave": "洞窟",
    "basement": "地下",
    "roof": "屋上",
    "main": "メインエリア",
    "back": "奥",
    "front": "手前"
}

LOCATIONS = {
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
    "route-47": "47ばんどうろ",
    "route-48": "48ばんどうろ"
}

session = requests.Session()
session.headers["User-Agent"] = "HGSS-Pokedex/2.1"
cache = {}


def fetch(url):
    if url in cache:
        return cache[url]

    for attempt in range(5):
        try:
            response = session.get(url, timeout=30)

            if response.status_code in (429, 500, 502, 503, 504):
                time.sleep(2 ** attempt)
                continue

            response.raise_for_status()
            result = response.json()
            cache[url] = result
            time.sleep(0.1)
            return result

        except requests.RequestException:
            if attempt == 4:
                raise
            time.sleep(2 ** attempt)

    raise RuntimeError(f"取得失敗: {url}")


def japanese_name(data):
    for language in ("ja-Hrkt", "ja"):
        for entry in data.get("names", []):
            if entry["language"]["name"] == language:
                return entry["name"]
    return None


def location_name(slug, data):
    if slug in LOCATIONS:
        return LOCATIONS[slug]

    name = japanese_name(data)
    if name:
        return name

    match = re.fullmatch(r"(?:johto-|kanto-)?route-(\d+)", slug)
    if match:
        return f"{int(match.group(1))}ばんどうろ"

    return None


def area_suffix(slug):
    if not slug or slug == "area":
        return ""

    if slug in SUFFIXES:
        return SUFFIXES[slug]

    match = re.fullmatch(r"b(\d+)f", slug)
    if match:
        return f"地下{match.group(1)}階"

    match = re.fullmatch(r"(\d+)f", slug)
    if match:
        return f"{match.group(1)}階"

    return None


def translate_area(area_id):
    url = f"{API}/location-area/{area_id}/"
    area = fetch(url)

    # エリアそのものに日本語名がある場合
    name = japanese_name(area)
    if name:
        return name

    location_ref = area["location"]
    location = fetch(location_ref["url"])

    parent_slug = location_ref["name"]
    parent_name = location_name(parent_slug, location)

    if not parent_name:
        return f"未翻訳の場所（{area_id}）"

    suffix = area_id

    if suffix.startswith(parent_slug + "-"):
        suffix = suffix[len(parent_slug) + 1:]

    suffix = re.sub(r"-area$", "", suffix)
    detail = area_suffix(suffix)

    if detail == "":
        return parent_name

    if detail is not None:
        return f"{parent_name}（{detail}）"

    return f"{parent_name}（未翻訳エリア: {suffix}）"


def main():
    if not DATA_FILE.exists():
        print("pokemon.json がありません。")
        return

    data = json.loads(DATA_FILE.read_text(encoding="utf-8"))

    # 既存データを保護
    backup = DATA_FILE.with_name("pokemon_backup.json")

    if not backup.exists():
        backup.write_text(
            json.dumps(data, ensure_ascii=False, indent=2),
            encoding="utf-8"
        )

    area_cache = {}
    unresolved = set()

    for pokemon in data["pokemon"]:
        print(f"処理中: {pokemon['name']}")

        for version in ("heartgold", "soulsilver"):
            encounters = pokemon.get("encounters", {}).get(version, [])

            for encounter in encounters:
                area_id = encounter.get("area_id")

                if area_id:
                    if area_id not in area_cache:
                        area_cache[area_id] = translate_area(area_id)

                    encounter["area"] = area_cache[area_id]

                    if "未翻訳" in encounter["area"]:
                        unresolved.add(area_id)

                method = encounter.get("method", "")
                encounter["method"] = METHODS.get(method, method)

                encounter["conditions"] = [
                    CONDITIONS.get(c, c)
                    for c in encounter.get("conditions", [])
                ]

    DATA_FILE.write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8"
    )

    print("日本語変換完了")

    if unresolved:
        print("未翻訳エリア:")
        for area in sorted(unresolved):
            print(" -", area)

    print("保存先:", DATA_FILE)
    print("バックアップ:", backup)


if __name__ == "__main__":
    main()
