import json
import re

with open("pdf_items.json") as f:
    items = json.load(f)

# Sort items by Y, then X
items.sort(key=lambda it: (it["y"], it["x"]))

# Group items into visual rows by Y within threshold
row_groups = []
curr_y = None
curr_items = []
for it in items:
    if it["y"] < 90:
        continue # skip page title and column headers
    if curr_y is None or abs(it["y"] - curr_y) > 2.0:
        if curr_items:
            row_groups.append((curr_y, curr_items))
        curr_y = it["y"]
        curr_items = [it]
    else:
        curr_items.append(it)
if curr_items:
    row_groups.append((curr_y, curr_items))

print(f"Total row groups: {len(row_groups)}")

def parse_time_list(text):
    # Match times like 6:25 AM, 12:30 PM, etc.
    # Also handle possible space issues e.g. 9 :46 AM
    cleaned = re.sub(r'(\d+)\s*:\s*(\d+)\s*([AP]M)', r'\1:\2 \3', text)
    return re.findall(r'\b\d{1,2}:\d{2}\s+[AP]M\b', cleaned)

# Let's inspect each row group
parsed_rows = []
for y, r_items in row_groups:
    is_weekend = y >= 505
    # Separate items into left side (x < 450) and right side (x >= 450)
    left_items = [it for it in r_items if it["x"] < 450]
    right_items = [it for it in r_items if it["x"] >= 450]
    
    print(f"\n--- Y={y:.1f} ({'Weekend' if is_weekend else 'Weekday'}) ---")
    if left_items:
        left_text = " ".join(it["text"] for it in left_items)
        left_times = parse_time_list(left_text)
        # find route number in left
        routes = re.findall(r'\b(10[1-9])\b', left_text)
        print(f"  LEFT: route={routes} times({len(left_times)}) => {left_times[:2]} ... {left_times[-2:] if len(left_times)>2 else []}")
    if right_items:
        right_text = " ".join(it["text"] for it in right_items)
        right_times = parse_time_list(right_text)
        routes = re.findall(r'\b(20[1-9])\b', right_text)
        print(f"  RIGHT: route={routes} times({len(right_times)}) => {right_times[:2]} ... {right_times[-2:] if len(right_times)>2 else []}")
