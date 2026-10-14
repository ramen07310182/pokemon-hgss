
import json
import re
import sys
import time
from pathlib import Path

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
CACHE_DIR = DATA_DIR / "cache"
OUTPUT = DATA_DIR / "pokemon.json"

API = "https://pokeapi.co/api/v2"
MAX_POKEMON = 493
VERSION_GROUP = "heartgold-soulsilver"
VERSIONS = ("heartgold", "soulsilver")
DATA_VERSION = 4

LIMIT = min(
    MAX_POKEMON,
    int(sys.argv[1]) if len(sys.argv) > 1 else MAX_POKEMON
)

DATA_DIR.mkdir(parents=True, exist_ok=True)
CACHE_DIR.mkdir(parents=True, exist_ok=True)

session = requests.Session()
retry = Retry(
    total=5,
    backoff_factor=2,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET"]
)
session.mount(
    "https://",
    HTTPAdapter(max_retries=retry)
)
session.headers.update({
    "User-Agent": "HGSS-Pokedex/2.0"
})

METHOD_NAMES = {
    "walk": "草むら・洞窟",
    "surf": "なみのり",
    "old-rod": "ボロのつりざお",
    "good-rod": "いいつりざお",
    "super-rod": "すごいつりざお",
    "rock-smash": "いわくだき",
    "headbutt-low": "ずつき",
    "headbutt-normal": "ずつき",
    "headbutt-high": "ずつき",
    "gift": "もらう",
    "gift-egg": "タマゴをもらう",
    "only-one": "固定シンボル",
    "squirt-bottle": "ゼニガメじょうろ",
    "pokeflute": "ポケモンのふえ",
    "wailmer-pail": "ホエルコじょうろ",
    "devon-scope": "デボンスコープ"
}

CONDITION_NAMES = {
    "time-morning": "朝",
    "time-day": "昼",
    "time-night": "夜",
    "swarm-yes": "大量発生時",
    "swarm-no": "大量発生なし",
    "radar-on": "ポケトレ使用",
    "radar-off": "ポケトレ未使用",
    "slot2-ruby": "ルビーをDSスロットに挿入",
    "slot2-sapphire": "サファイアをDSスロットに挿入",
    "slot2-emerald": "エメラルドをDSスロットに挿入",
    "slot2-firered": "ファイアレッドをDSスロットに挿入",
    "slot2-leafgreen": "リーフグリーンをDSスロットに挿入"
}

AREA_NAMES = {
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
    "north": "北側",
    "south": "南側",
    "east": "東側",
    "west": "西側",
    "grass": "草むら",
    "cave": "洞窟",
    "water": "水上",
    "basement": "地下",
    "roof": "屋上",
    "entrance": "入口"
}


def get_json(path):
    if path.startswith(API):
        path = path[len(API):]

    key = re.sub(r"[^a-zA-Z0-9_-]", "_", path)
    cache_file = CACHE_DIR / f"{key}.json"

    if cache_file.exists():
        try:
            return json.loads(
                cache_file.read_text(encoding="utf-8")
            )
        except (OSError, json.JSONDecodeError):
            cache_file.unlink(missing_ok=True)

    response = session.get(API + path, timeout=45)
    response.raise_for_status()
    result = response.json()

    cache_file.write_text(
        json.dumps(result, ensure_ascii=False),
        encoding="utf-8"
    )

    time.sleep(0.15)
    return result


def localized_name(data, fallback=""):
    for language in ("ja-Hrkt", "ja"):
        for entry in data.get("names", []):
            if entry["language"]["name"] == language:
                return entry["name"]

    return fallback or data.get("name", "")


def resource_name(resource, category, memo):
    if not resource:
        return ""

    key = resource["name"]
    cache_key = f"{category}:{key}"

    if cache_key not in memo:
        info = get_json(f"/{category}/{key}/")
        memo[cache_key] = localized_name(info, key)

    return memo[cache_key]


def old_types(pokemon):
    types = pokemon["types"]

    for record in pokemon.get("past_types", []):
        if record["generation"]["name"] == "generation-v":
            types = record["types"]
            break

    return [
        item["type"]["name"]
        for item in sorted(types, key=lambda x: x["slot"])
    ]


def old_stats(pokemon):
    """HGSS（第4世代）の種族値を取得する。"""
    stats = {
        item["stat"]["name"]: item["base_stat"]
        for item in pokemon.get("stats", [])
    }

    generations = [
        "generation-i",
        "generation-ii",
        "generation-iii",
        "generation-iv",
        "generation-v",
        "generation-vi",
        "generation-vii",
        "generation-viii",
        "generation-ix"
    ]

    records = sorted(
        pokemon.get("past_stats", []),
        key=lambda x: generations.index(
            x["generation"]["name"]
        ) if x["generation"]["name"] in generations else 999
    )

    for record in records:
        gen = record["generation"]["name"]

        if (
            gen in generations
            and generations.index(gen) >= 3
        ):
            for item in record.get("stats", []):
                stat_name = item["stat"]["name"]
                stats[stat_name] = item["base_stat"]

            break

    required_stats = [
        "hp",
        "attack",
        "defense",
        "special-attack",
        "special-defense",
        "speed"
    ]

    missing = [
        name for name in required_stats
        if name not in stats
    ]

    if missing:
        raise ValueError(
            f"{pokemon.get('name', '不明')} の種族値が不足しています: "
            f"{', '.join(missing)}"
        )

    return {
        name: stats[name]
        for name in required_stats
    }


def collect_effort(pokemon):
    """PokeAPIから各能力値の努力値を取得する。"""
    required_stats = [
        "hp",
        "attack",
        "defense",
        "special-attack",
        "special-defense",
        "speed"
    ]

    effort = {
        item["stat"]["name"]: item["effort"]
        for item in pokemon.get("stats", [])
    }

    missing = [
        name for name in required_stats
        if name not in effort
    ]

    if missing:
        raise ValueError(
            f"{pokemon.get('name', '不明')} の努力値が不足しています: "
            f"{', '.join(missing)}"
        )

    return {
        name: effort[name]
        for name in required_stats
    }


def get_machine_numbers(move_data):
    """HGSSに対応したわざマシン・ひでんマシン番号。"""
    numbers = []

    for entry in move_data.get("machines", []):
        if entry["version_group"]["name"] != VERSION_GROUP:
            continue

        machine = get_json(entry["machine"]["url"])
        item_name = machine["item"]["name"]

        match = re.fullmatch(r"(tm|hm)(\d+)", item_name)

        if not match:
            continue

        kind, number = match.groups()

        if kind == "tm":
            label = f"わざマシン{int(number):02d}"
        else:
            label = f"ひでんマシン{int(number):02d}"

        if label not in numbers:
            numbers.append(label)

    return sorted(numbers)


def collect_moves(pokemon, memo):
    result = []

    for entry in pokemon["moves"]:
        details = [
            d for d in entry["version_group_details"]
            if d["version_group"]["name"] == VERSION_GROUP
        ]

        if not details:
            continue

        move_ref = entry["move"]
        move_data = get_json(move_ref["url"])
        move_name = localized_name(
            move_data, move_ref["name"]
        )

        machine_numbers = []

        if any(
            d["move_learn_method"]["name"] == "machine"
            for d in details
        ):
            machine_numbers = get_machine_numbers(move_data)

        for detail in details:
            method = detail["move_learn_method"]["name"]

            result.append({
                "name": move_name,
                "english": move_ref["name"],
                "method": method,
                "level": detail["level_learned_at"],
                "machines": (
                    machine_numbers if method == "machine" else []
                )
            })

    result.sort(
        key=lambda x: (
            0 if x["method"] == "level-up" else 1,
            x["level"],
            x["name"]
        )
    )

    return result


def translate_area_slug(slug):
    """日本語がない細分エリア名を補助的に変換。"""
    if not slug or slug == "area":
        return ""

    if slug in AREA_NAMES:
        return AREA_NAMES[slug]

    floor = re.fullmatch(r"b?(\d+)f", slug)
    if floor:
        number = floor.group(1)
        return (
            f"地下{number}階"
            if slug.startswith("b")
            else f"{number}階"
        )

    parts = slug.split("-")
    translated = [AREA_NAMES.get(p, p) for p in parts]
    return "・".join(p for p in translated if p)


def get_area_name(area_ref, memo):
    """エリアの日本語名を親ロケーションから取得。"""
    key = area_ref["name"]

    if key in memo:
        return memo[key]

    area = get_json(area_ref["url"])
    area_ja = localized_name(area)

    if area_ja and area_ja != area.get("name"):
        memo[key] = area_ja
        return area_ja

    location_ref = area.get("location")

    if not location_ref:
        memo[key] = key
        return key

    location = get_json(location_ref["url"])
    location_name = localized_name(
        location, location_ref["name"]
    )

    area_slug = area["name"]
    prefix = location_ref["name"]

    if area_slug.startswith(prefix + "-"):
        suffix = area_slug[len(prefix) + 1:]
    elif area_slug == prefix:
        suffix = ""
    else:
        suffix = area_slug

    suffix = re.sub(r"-area$", "", suffix)
    if suffix == "area":
        suffix = ""

    detail = translate_area_slug(suffix)

    if detail:
        result = f"{location_name}（{detail}）"
    else:
        result = location_name

    memo[key] = result
    return result


def translate_method(method_ref, memo):
    key = method_ref["name"]

    if key in METHOD_NAMES:
        return METHOD_NAMES[key]

    return resource_name(
        method_ref, "encounter-method", memo
    )


def translate_condition(condition_ref, memo):
    key = condition_ref["name"]

    if key in CONDITION_NAMES:
        return CONDITION_NAMES[key]

    return resource_name(
        condition_ref,
        "encounter-condition-value",
        memo
    )


def collect_encounters(pokemon_id, memo, area_memo):
    records = get_json(
        f"/pokemon/{pokemon_id}/encounters"
    )

    result = {version: [] for version in VERSIONS}

    for area in records:
        relevant = [
            v for v in area["version_details"]
            if v["version"]["name"] in VERSIONS
        ]

        if not relevant:
            continue

        area_name = get_area_name(
            area["location_area"], area_memo
        )

        for version_data in relevant:
            version = version_data["version"]["name"]

            for detail in version_data["encounter_details"]:
                result[version].append({
                    "area": area_name,
                    "area_id": area["location_area"]["name"],
                    "method": translate_method(
                        detail["method"], memo
                    ),
                    "min_level": detail["min_level"],
                    "max_level": detail["max_level"],
                    "chance": detail["chance"],
                    "conditions": [
                        translate_condition(c, memo)
                        for c in detail["condition_values"]
                    ]
                })

    for version in VERSIONS:
        result[version].sort(
            key=lambda x: (
                x["area"],
                x["method"],
                x["min_level"]
            )
        )

    return result


def evolution_details(details, memo):
    if not details:
        return []

    result = []

    fields = [
        ("item", "item"),
        ("held_item", "item"),
        ("known_move", "move"),
        ("known_move_type", "type"),
        ("location", "location"),
        ("party_species", "pokemon-species"),
        ("party_type", "type"),
        ("trade_species", "pokemon-species")
    ]

    for detail in details:
        row = {
            "trigger": detail["trigger"]["name"],
            "min_level": detail.get("min_level"),
            "min_happiness": detail.get("min_happiness"),
            "min_beauty": detail.get("min_beauty"),
            "min_affection": detail.get("min_affection"),
            "time_of_day": detail.get("time_of_day"),
            "gender": detail.get("gender"),
            "relative_physical_stats": detail.get(
                "relative_physical_stats"
            ),
            "needs_overworld_rain": detail.get(
                "needs_overworld_rain"
            ),
            "turn_upside_down": detail.get(
                "turn_upside_down"
            )
        }

        for field, category in fields:
            row[field] = (
                resource_name(detail[field], category, memo)
                if detail.get(field)
                else None
            )

        result.append(row)

    return result


def collect_evolution(species, memo):
    chain_url = species.get(
        "evolution_chain", {}
    ).get("url")

    if not chain_url:
        return []

    chain = get_json(chain_url)["chain"]
    result = []

    def visit(node, parent=None):
        species_ref = node["species"]
        species_id = int(
            species_ref["url"].rstrip("/").split("/")[-1]
        )

        name = resource_name(
            species_ref, "pokemon-species", memo
        )

        result.append({
            "id": species_id,
            "name": name,
            "from_id": parent,
            "conditions": evolution_details(
                node.get("evolution_details", []), memo
            )
        })

        for child in node.get("evolves_to", []):
            visit(child, species_id)

    visit(chain)

    return [
        item for item in result
        if item["id"] <= MAX_POKEMON
    ]


def collect_one(pokemon_id, memo, area_memo):
    pokemon = get_json(f"/pokemon/{pokemon_id}/")
    species = get_json(
        f"/pokemon-species/{pokemon_id}/"
    )

    sprite_data = (
        pokemon.get("sprites", {})
        .get("versions", {})
        .get("generation-iv", {})
        .get("heartgold-soulsilver", {})
    )

    sprite = (
        sprite_data.get("front_default")
        or pokemon["sprites"].get("front_default")
    )

    abilities = []

    for ability in pokemon["abilities"]:
        abilities.append({
            "name": resource_name(
                ability["ability"], "ability", memo
            ),
            "hidden": ability["is_hidden"]
        })

    return {
        "id": pokemon_id,
        "name": localized_name(species),
        "english": pokemon["name"],
        "types": old_types(pokemon),
        "abilities": abilities,
        "height": pokemon["height"] / 10,
        "weight": pokemon["weight"] / 10,
        "stats": old_stats(pokemon),
        "effort": collect_effort(pokemon),
        "sprite": sprite,
        "moves": collect_moves(pokemon, memo),
        "encounters": collect_encounters(
            pokemon_id, memo, area_memo
        ),
        "evolution": collect_evolution(species, memo)
    }


def save_data(pokemon_list):
    OUTPUT.write_text(
        json.dumps(
            {
                "version": "HGSS",
                "data_version": DATA_VERSION,
                "count": len(pokemon_list),
                "pokemon": pokemon_list
            },
            ensure_ascii=False,
            separators=(",", ":")
        ),
        encoding="utf-8"
    )


def main():
    memo = {}
    area_memo = {}
    pokemon_list = []

    if OUTPUT.exists():
        existing = json.loads(
            OUTPUT.read_text(encoding="utf-8")
        )

        if existing.get("data_version") == DATA_VERSION:
            pokemon_list = [
                p for p in existing.get("pokemon", [])
                if p["id"] <= LIMIT
            ]
        else:
            print("旧形式のデータを検出。再取得します。")

    completed = {p["id"] for p in pokemon_list}

    for pokemon_id in range(1, LIMIT + 1):
        if pokemon_id in completed:
            print(
                f"[{pokemon_id}/{LIMIT}] 取得済み"
            )
            continue

        print(
            f"[{pokemon_id}/{LIMIT}] 取得中...",
            flush=True
        )

        try:
            item = collect_one(
                pokemon_id, memo, area_memo
            )

            pokemon_list.append(item)
            pokemon_list.sort(key=lambda x: x["id"])

            save_data(pokemon_list)

            print(f"  OK: {item['name']}")

        except (
            requests.RequestException,
            ValueError,
            KeyError
        ) as e:
            print(f"  ERROR: {e}", file=sys.stderr)
            print(
                "再実行すると未取得分から再開できます。"
            )
            raise

    print(f"完了: {len(pokemon_list)}匹")
    print(f"保存先: {OUTPUT}")


if __name__ == "__main__":
    main()
