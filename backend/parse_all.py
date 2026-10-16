import json
import re

with open("pdf_items.json") as f:
    items = json.load(f)

items.sort(key=lambda it: (it["y"], it["x"]))

# Separate Weekdays and Weekends
weekday_items = [it for it in items if 85 <= it["y"] < 505]
weekend_items = [it for it in items if it["y"] >= 540]

def clean_time(t):
    t = re.sub(r'\s+', ' ', t).strip()
    m = re.match(r'^(\d+)\s*:\s*(\d+)\s*([AP]M)$', t)
    if m:
        return f"{m.group(1)}:{m.group(2)} {m.group(3)}"
    return t

def extract_times(text):
    cleaned = re.sub(r'(\d+)\s*:\s*(\d+)\s*([AP]M)', r'\1:\2 \3', text)
    matches = re.findall(r'\b\d{1,2}:\d{2}\s+[AP]M\b', cleaned)
    return [clean_time(x) for x in matches]

print(f"Weekday items: {len(weekday_items)}, Weekend items: {len(weekend_items)}")
