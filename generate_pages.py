import json, re, os

with open('/tmp/site_data.json') as f:
    data = json.load(f)

CHARACTERS = data['CHARACTERS'] 
RELATIONSHIPS = data['RELATIONSHIPS']
CHARACTER_DETAILS = data['CHARACTER_DETAILS']
WEAPONS = data['WEAPONS']
VEHICLES = data['VEHICLES']

def slugify(name):
    s = name.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

BASE = '/home/claude/heistfile-v2'

# A few item names are long enough that "{name} in GTA 6 - ... | HeistFile"
# would exceed ~60 chars and get truncated in Google's search results.
# The full name still appears as the H1 and everywhere else — this only
# shortens the <title> tag itself.
TITLE_NAME_OVERRIDES = {
    "Bravado Police Buffalo STX Pursuit": "Police Buffalo STX",
    "Declasse Tulip / Tulip M-100": "Declasse Tulip M-100",
}

def title_name(name):
    return TITLE_NAME_OVERRIDES.get(name, name)

def compose_description(parts, limit=160):
    """Join parts with spaces, filling as close to `limit` chars as possible.
    Whole parts are added while they fit; if the next part doesn't fully
    fit but there's meaningful room left, it's trimmed at a word boundary
    instead of being dropped entirely (so we don't waste SEO real estate)."""
    text = ""
    for part in parts:
        candidate = (text + " " + part).strip() if text else part
        if len(candidate) <= limit:
            text = candidate
            continue
        remaining = limit - len(text) - 1
        if remaining > 20:
            words = part[:remaining].rsplit(" ", 1)[0]
            text = (text + " " + words).strip() + "…"
        break
    return text

HEAD_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="https://olaisong-hub.github.io/HeistFile/{folder}/{slug}.html">
<meta property="og:type" content="article">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="https://olaisong-hub.github.io/HeistFile/{folder}/{slug}.html">
<meta property="og:site_name" content="HeistFile">
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles.css">
<script type="application/ld+json">
{jsonld}
</script>
</head>
<body>

<div class="blueprint-bg" aria-hidden="true"></div>

<header class="topbar">
  <div class="wrap topbar__inner">
    <a href="../index.html" class="wordmark">HEISTFILE<span class="wordmark__dot">.</span></a>
    <nav class="tabs" aria-label="Page navigation">
      <a class="tab" href="../index.html#view-home">Home</a>
      <a class="tab" href="../index.html#view-launch">Launch Guide</a>
      <a class="tab{characters_active}" href="../index.html#view-characters">Characters</a>
      <a class="tab" href="../index.html#view-map">Map</a>
      <a class="tab{arsenal_active}" href="../index.html#view-arsenal">Arsenal</a>
    </nav>
  </div>
</header>

<main>
  <div class="wrap" style="padding-top:40px;">
    <nav aria-label="Breadcrumb" class="section-sub" style="font-family:'IBM Plex Mono',monospace; font-size:12px; margin-bottom:24px;">
      <a href="../index.html" style="color:var(--cyan); text-decoration:none;">Home</a>
      <span aria-hidden="true"> / </span>
      <a href="{crumb_href}" style="color:var(--cyan); text-decoration:none;">{crumb_label}</a>
      <span aria-hidden="true"> / </span>
      <span>{name}</span>
    </nav>
'''

FOOTER_TEMPLATE = '''  </div>
</main>

<footer class="footer">
  <div class="wrap footer__inner">
    <p><strong>HeistFile</strong> is an unofficial fan site and is not affiliated with, endorsed by, or sponsored by Rockstar Games or Take-Two Interactive. Confirmed facts are sourced from Rockstar's official announcements and Take-Two's financial filings; everything marked as a leak or rumor is unverified community/press speculation, not confirmed information. Subject to change — always double-check against Rockstar's Newswire.</p>
  </div>
</footer>

</body>
</html>
'''

def write_page(folder, slug, title, description, og_title, jsonld_obj, crumb_href, crumb_label, name, body_html, characters_active=False, arsenal_active=False):
    path = f"{BASE}/{folder}/{slug}.html"
    head = HEAD_TEMPLATE.format(
        title=title, description=description, folder=folder, slug=slug,
        og_title=og_title, jsonld=json.dumps(jsonld_obj, indent=2),
        characters_active=" is-active" if characters_active else "",
        arsenal_active=" is-active" if arsenal_active else "",
        crumb_href=crumb_href, crumb_label=crumb_label, name=name
    )
    full = head + body_html + FOOTER_TEMPLATE
    with open(path, 'w') as f:
        f.write(full)
    return path

# ---------------- CHARACTERS ----------------
by_id = {c['id']: c for c in CHARACTERS}
rel_map = {}
for r in RELATIONSHIPS:
    rel_map.setdefault(r['from'], []).append((r['to'], r['label']))
    rel_map.setdefault(r['to'], []).append((r['from'], r['label']))

char_files = []
for c in CHARACTERS:
    cid = c['id']
    detail = CHARACTER_DETAILS[cid]
    name = c['name']
    slug = c['slug']
    role = detail['role']
    relationship = detail['relationship']

    confirmed_html = "".join(f"<p>{p}</p>" for p in detail['confirmed'])
    leaked_html = ""
    if detail['leaked']:
        items = "".join(f"<li>{l}</li>" for l in detail['leaked'])
        leaked_html = f'''
      <h2>Leaked details</h2>
      <p>Everything in this section comes from data-mined files and community reconstructions, not from Rockstar. Treat it as speculation, however detailed it sounds.</p>
      <div class="rumor-block">
        <span class="rumor-block__stamp">⚠ Unconfirmed — leak / rumor</span>
        <ul>{items}</ul>
      </div>'''

    related = rel_map.get(cid, [])
    related_html = ""
    if related:
        links = []
        for other_id, label in related:
            other = by_id.get(other_id)
            if other:
                links.append(f'<p><a href="{other["slug"]}.html" style="color:var(--cyan);">{other["name"]} →</a> — {label}.</p>')
        if links:
            related_html = "<h2>Related dossiers</h2>" + "".join(links)

    first_sentence = detail['confirmed'][0].split(". ")[0] + "."
    description = compose_description([f"{name}, {role.lower()} in GTA 6.", first_sentence, "Confirmed facts and every leaked rumor about them, clearly labeled."])

    body = f'''    <div class="detail-header">
      <div>
        <div class="char-photo char-photo--lg">
          <svg viewBox="0 0 64 64" fill="currentColor" role="img" aria-label="{name} case file portrait placeholder — official character art has not been released yet">
            <circle cx="32" cy="22" r="14"/>
            <path d="M8 58c0-14 11-22 24-22s24 8 24 22z"/>
          </svg>
          <span class="char-photo__stamp">ID PENDING</span>
        </div>
      </div>
      <div>
        <span class="stamp stamp--cyan">CONFIRMED CHARACTER</span>
        <h1 class="section-title" style="margin-top:8px;">{name}</h1>
        <p class="detail-meta">{role} · Connected to {relationship}</p>
      </div>
    </div>

    <div class="detail-facts">
      <div class="detail-fact"><span>Role</span>{role}</div>
      <div class="detail-fact"><span>Relationship</span>{relationship}</div>
    </div>

    <div class="detail-body">
      <h2>Confirmed background</h2>
      {confirmed_html}
      {leaked_html}
      {related_html}
    </div>
'''
    jsonld = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": name,
        "description": detail['confirmed'][0],
        "url": f"https://olaisong-hub.github.io/HeistFile/characters/{slug}.html",
        "characterAttribute": "Character in Grand Theft Auto VI (Rockstar Games)"
    }
    path = write_page(
        'characters', slug,
        title=f"{title_name(name)} in GTA 6 - Story, Facts & Rumors | HeistFile",
        description=description,
        og_title=f"{name} in GTA 6 - Story, Facts & Rumors",
        jsonld_obj=jsonld,
        crumb_href="../index.html#view-characters", crumb_label="Characters",
        name=name, body_html=body, characters_active=True
    )
    char_files.append(path)

print(f"Characters written: {len(char_files)}")

# ---------------- WEAPONS ----------------
weapon_files = []
for w in WEAPONS:
    name = w['name']
    slug = slugify(name)
    category = w['category']
    manufacturer = w.get('manufacturer', 'Unknown')
    basis = w.get('basis', '—')
    source = w.get('source', 'Unconfirmed')
    note = w.get('note', '')
    is_leaked = w.get('leaked', False)

    facts = f'''<div class="detail-fact"><span>Category</span>{category}</div>
    <div class="detail-fact"><span>Manufacturer</span>{manufacturer}</div>
    <div class="detail-fact"><span>Real-world basis</span>{basis}</div>
    <div class="detail-fact"><span>Source</span>{source}</div>'''

    rumor_html = ""
    stamp_label = "CONFIRMED WEAPON"
    if is_leaked:
        stamp_label = "LEAKED — UNCONFIRMED"
        rumor_html = '''
      <div class="rumor-block">
        <span class="rumor-block__stamp">⚠ Unconfirmed — leak / rumor</span>
        <ul><li>This weapon comes from data-mined files rather than an official Rockstar confirmation — treat it as speculation.</li></ul>
      </div>'''

    parts = [f"{name} — a {category} weapon in GTA 6, based on the {basis}."]
    if note:
        parts.append(note)
    parts.append("See manufacturer, confirmation source, and full details.")
    description = compose_description(parts)

    body = f'''    <div class="detail-header">
      <div class="item-icon item-icon--weapon" style="width:72px;height:72px;font-size:20px;">{name[:2].upper()}</div>
      <div>
        <span class="stamp stamp--pink">{stamp_label}</span>
        <h1 class="section-title" style="margin-top:8px;">{name}</h1>
        <p class="detail-meta">{category}</p>
      </div>
    </div>

    <div class="detail-facts">
      {facts}
    </div>

    <div class="detail-body">
      <h2>Overview</h2>
      <p>{note if note else basis}</p>
      {rumor_html}
      <h2>Browse more</h2>
      <p><a href="../index.html#view-arsenal" style="color:var(--cyan);">← Back to the full Arsenal</a></p>
    </div>
'''
    jsonld = {
        "@context": "https://schema.org",
        "@type": "Thing",
        "name": name,
        "description": note if note else basis,
        "url": f"https://olaisong-hub.github.io/HeistFile/weapons/{slug}.html"
    }
    path = write_page(
        'weapons', slug,
        title=f"{title_name(name)} in GTA 6 - Stats, Facts & Rumors | HeistFile",
        description=description,
        og_title=f"{name} in GTA 6 - Stats, Facts & Rumors",
        jsonld_obj=jsonld,
        crumb_href="../index.html#view-arsenal", crumb_label="Arsenal",
        name=name, body_html=body, arsenal_active=True
    )
    weapon_files.append(path)

print(f"Weapons written: {len(weapon_files)}")

# ---------------- VEHICLES (only ones with a source = \"important\") ----------------
vehicle_files = []
for v in VEHICLES:
    if not v.get('source'):
        continue
    name = v['name']
    slug = slugify(name)
    category = v['category']
    manufacturer = v.get('manufacturer', 'Unknown')
    basis = v.get('basis', '—')
    source = v.get('source', 'Unconfirmed')
    note = v.get('note', '')
    exclusive = v.get('exclusive', '')

    facts = f'''<div class="detail-fact"><span>Category</span>{category}</div>
    <div class="detail-fact"><span>Manufacturer</span>{manufacturer}</div>
    <div class="detail-fact"><span>Real-world basis</span>{basis}</div>
    <div class="detail-fact"><span>Source</span>{source}</div>'''
    if exclusive:
        facts += f'<div class="detail-fact"><span>Availability</span>{exclusive}</div>'

    parts = [f"{name} — a {category} vehicle in GTA 6, based on the {basis}."]
    if note:
        parts.append(note)
    parts.append("See manufacturer, confirmation source, and full details.")
    description = compose_description(parts)

    body = f'''    <div class="detail-header">
      <div class="item-icon item-icon--vehicle" style="width:72px;height:72px;font-size:20px;">{name[:2].upper()}</div>
      <div>
        <span class="stamp stamp--cyan">{"EXCLUSIVE" if exclusive else "CONFIRMED VEHICLE"}</span>
        <h1 class="section-title" style="margin-top:8px;">{name}</h1>
        <p class="detail-meta">{category}</p>
      </div>
    </div>

    <div class="detail-facts">
      {facts}
    </div>

    <div class="detail-body">
      <h2>Overview</h2>
      <p>{note if note else basis}</p>
      <h2>Browse more</h2>
      <p><a href="../index.html#view-arsenal" style="color:var(--cyan);">← Back to the full Arsenal</a></p>
    </div>
'''
    jsonld = {
        "@context": "https://schema.org",
        "@type": "Thing",
        "name": name,
        "description": note if note else basis,
        "url": f"https://olaisong-hub.github.io/HeistFile/vehicles/{slug}.html"
    }
    path = write_page(
        'vehicles', slug,
        title=f"{title_name(name)} in GTA 6 - Stats, Facts & Rumors | HeistFile",
        description=description,
        og_title=f"{name} in GTA 6 - Stats, Facts & Rumors",
        jsonld_obj=jsonld,
        crumb_href="../index.html#view-arsenal", crumb_label="Arsenal",
        name=name, body_html=body, arsenal_active=True
    )
    vehicle_files.append(path)

print(f"Vehicles written: {len(vehicle_files)}")
print(f"TOTAL new files: {len(char_files) + len(weapon_files) + len(vehicle_files)}")
