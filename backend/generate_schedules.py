import json
import re
from datetime import datetime, timedelta

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
        continue
    if curr_y is None or abs(it["y"] - curr_y) > 2.0:
        if curr_items:
            row_groups.append((curr_y, curr_items))
        curr_y = it["y"]
        curr_items = [it]
    else:
        curr_items.append(it)
if curr_items:
    row_groups.append((curr_y, curr_items))

def get_times(text):
    cleaned = re.sub(r'(\d+)\s*:\s*(\d+)\s*([AP]M)', r'\1:\2 \3', text)
    cleaned = re.sub(r'\s+', ' ', cleaned)
    matches = re.findall(r'\b\d{1,2}:\d{2}\s+[AP]M\b', cleaned)
    std = []
    for m in matches:
        parts = m.strip().split()
        time_part = parts[0]
        ampm = parts[1]
        h, mn = time_part.split(':')
        std.append(f"{int(h):02d}:{mn} {ampm}")
    return std

def calc_duration(t1, t2):
    try:
        dt1 = datetime.strptime(t1, "%I:%M %p")
        dt2 = datetime.strptime(t2, "%I:%M %p")
        mins = int((dt2 - dt1).total_seconds() / 60)
        if mins < 0:
            mins += 24 * 60
        return mins
    except Exception:
        return 0

# Stop definitions
WEEKDAY_HNLU_TO_RS_101 = [
    'HNLU', 'Balco Medical Centre', 'Sector 30', 'Sector 29', 'Sector 27', 
    'South Block', 'Indravati Bhawan', 'Mahanadi Bhawan', 'North Block', 
    'Ekatm Path', 'CBD', 'Sector 15', 'Telibandha', 'DKS Bhawan', 'Railway Station'
]

WEEKDAY_HNLU_TO_RS_105 = [
    'Balco Medical Centre', 'Sector 30', 'Sector 29', 'Sector 27', 
    'South Block', 'Indravati Bhawan', 'Mahanadi Bhawan', 'North Block', 
    'Ekatm Path', 'CBD', 'Sector 15', 'Telibandha', 'DKS Bhawan', 'Railway Station'
]

WEEKEND_HNLU_TO_RS_101 = [
    'HNLU', 'Balco Medical Centre', 'Sector 30', 'Sector 29', 'Sector 27', 
    'South Block', 'Indravati Bhawan', 'Mahanadi Bhawan', 'North Block', 
    'Ekatm Path', 'CBD', 'Sector 15', 'Telibandha', 'DKS Bhawan', 'Railway Station'
]

WEEKEND_HNLU_TO_RS_102 = [
    'HNLU', 'Balco Medical Centre', 'Sector 30', 'Sector 29', 'Sector 27', 
    'South Block', 'North Block', 
    'Ekatm Path', 'CBD', 'Sector 15', 'Telibandha', 'DKS Bhawan', 'Railway Station'
]

RS_TO_HNLU_FULL_WEEKDAY = [
    'Railway Station', 'DKS Bhawan', 'Telibandha', 'Sector 15', 'CBD', 
    'Ekatm Path', 'North Block', 'Mahanadi Bhawan', 'Indravati Bhawan', 
    'South Block', 'Sector 27', 'Sector 29', 'Sector 30', 'IIM', 
    'Balco Medical Centre', 'HNLU', 'HNLU Gate', 'Jungle Safari', 'IIIT', 'Muktangan', 'HNLU'
]

RS_TO_HNLU_NO_IIM_WEEKEND = [
    'Railway Station', 'DKS Bhawan', 'Telibandha', 'Sector 15', 'CBD', 
    'Ekatm Path', 'North Block', 'Mahanadi Bhawan', 'Indravati Bhawan', 
    'South Block', 'Sector 27', 'Sector 29', 'Sector 30', 
    'Balco Medical Centre', 'HNLU', 'HNLU Gate', 'Jungle Safari', 'IIIT', 'Muktangan', 'HNLU'
]

schedules = []
trip_counter = 1

for y, r_items in row_groups:
    is_weekend = y >= 505
    day_type = "weekend" if is_weekend else "weekday"
    
    r_items.sort(key=lambda it: it["x"])
    full_text = " ".join(it["text"] for it in r_items)
    
    if "Estimated" in full_text or "Departure" in full_text or "Centre" in full_text:
        continue
    
    all_times = get_times(full_text)
    if not all_times:
        continue
    
    routes_found = re.findall(r'\b([12]0[1-5])\b', full_text)
    left_times = []
    right_times = []
    
    if len(all_times) <= 16:
        if all(it["x"] >= 450 for it in r_items):
            right_times = all_times
        elif all(it["x"] < 450 for it in r_items):
            left_times = all_times
        else:
            if any(r.startswith('2') for r in routes_found):
                right_times = all_times
            else:
                left_times = all_times
    else:
        if is_weekend:
            if '102' in routes_found:
                left_times = all_times[:13]
                right_times = all_times[13:]
            elif '101' in routes_found:
                left_times = all_times[:15]
                right_times = all_times[15:]
            else:
                left_times = all_times[:13]
                right_times = all_times[13:]
        else:
            if '105' in routes_found:
                left_times = all_times[:14]
                right_times = all_times[14:]
            else:
                left_times = all_times[:15]
                right_times = all_times[15:]
    
    # Process Left trip (HNLU to Railway Station)
    if left_times:
        r_num = "101"
        for r in routes_found:
            if r.startswith("1"):
                r_num = r
                break
        
        if is_weekend:
            if r_num == "102" or len(left_times) == 13:
                stops_list = WEEKEND_HNLU_TO_RS_102
                r_num = "102"
            else:
                stops_list = WEEKEND_HNLU_TO_RS_101
                r_num = "101"
        else:
            if r_num == "105" or len(left_times) == 14:
                stops_list = WEEKDAY_HNLU_TO_RS_105
                r_num = "105"
            else:
                stops_list = WEEKDAY_HNLU_TO_RS_101
                r_num = "101"
        
        stop_entries = []
        for s_name, t_val in zip(stops_list, left_times):
            stop_entries.append({"stop_name": s_name, "time": t_val})
        
        if stop_entries:
            schedules.append({
                "id": f"{day_type[:2]}-dn-{trip_counter:03d}",
                "service_type": day_type,
                "route_number": r_num,
                "direction": "HNLU to Railway Station",
                "origin": stop_entries[0]["stop_name"],
                "destination": stop_entries[-1]["stop_name"],
                "departure_time": stop_entries[0]["time"],
                "arrival_time": stop_entries[-1]["time"],
                "duration_mins": calc_duration(stop_entries[0]["time"], stop_entries[-1]["time"]),
                "stops": stop_entries
            })
            trip_counter += 1

    # Process Right trip (Railway Station to HNLU)
    if right_times:
        r_num = "201"
        for r in routes_found:
            if r.startswith("2"):
                r_num = r
                break
        
        ref_stops = RS_TO_HNLU_NO_IIM_WEEKEND if is_weekend else RS_TO_HNLU_FULL_WEEKDAY
        n_times = len(right_times)
        
        if n_times == len(ref_stops):
            stops_list = ref_stops
        elif n_times < len(ref_stops):
            stops_list = ref_stops[:n_times]
        else:
            stops_list = ref_stops + [f"Stop {i}" for i in range(len(ref_stops), n_times)]
            
        stop_entries = []
        for s_name, t_val in zip(stops_list, right_times):
            stop_entries.append({"stop_name": s_name, "time": t_val})
            
        if stop_entries:
            schedules.append({
                "id": f"{day_type[:2]}-up-{trip_counter:03d}",
                "service_type": day_type,
                "route_number": r_num,
                "direction": "Railway Station to HNLU",
                "origin": stop_entries[0]["stop_name"],
                "destination": stop_entries[-1]["stop_name"],
                "departure_time": stop_entries[0]["time"],
                "arrival_time": stop_entries[-1]["time"],
                "duration_mins": calc_duration(stop_entries[0]["time"], stop_entries[-1]["time"]),
                "stops": stop_entries
            })
            trip_counter += 1

# Add Feeder Routes from Annexure-I (Nawagaon <-> North Block)
def add_feeder_trips(day_type, start_time_str, end_time_str, interval_mins, orig, dest, stops_template):
    global trip_counter
    cur_dt = datetime.strptime(start_time_str, "%I:%M %p")
    end_dt = datetime.strptime(end_time_str, "%I:%M %p")
    
    while cur_dt <= end_dt:
        t_str = cur_dt.strftime("%I:%M %p")
        # Build stops with 4-5 min intervals
        trip_stops = []
        for i, s_name in enumerate(stops_template):
            s_time = (cur_dt + timedelta(minutes=i * 5)).strftime("%I:%M %p")
            trip_stops.append({"stop_name": s_name, "time": s_time})
            
        schedules.append({
            "id": f"fd-{day_type[:2]}-{trip_counter:03d}",
            "service_type": day_type,
            "route_number": "F-01",
            "direction": f"{orig} to {dest}",
            "origin": orig,
            "destination": dest,
            "departure_time": trip_stops[0]["time"],
            "arrival_time": trip_stops[-1]["time"],
            "duration_mins": len(stops_template) * 5 - 5,
            "stops": trip_stops
        })
        trip_counter += 1
        cur_dt += timedelta(minutes=interval_mins)

# 1. Weekday Feeder: Nawagaon to North Block (9:40 AM to 8:09 PM, 40 min freq)
add_feeder_trips(
    "weekday", "09:40 AM", "08:09 PM", 40,
    "Nawagaon", "North Block",
    ["Nawagaon", "Indravati Bhawan", "Mahanadi Bhawan", "North Block"]
)
# Weekday Feeder: North Block to Nawagaon (9:20 AM to 7:49 PM, 40 min freq)
add_feeder_trips(
    "weekday", "09:20 AM", "07:49 PM", 40,
    "North Block", "Nawagaon",
    ["North Block", "Mahanadi Bhawan", "Indravati Bhawan", "Nawagaon"]
)

# 2. Weekend Feeder: Nawagaon to North Block (9:00 AM to 8:00 PM, 30 min freq)
add_feeder_trips(
    "weekend", "09:00 AM", "08:00 PM", 30,
    "Nawagaon", "North Block",
    ["Nawagaon", "Indravati Bhawan", "Mahanadi Bhawan", "North Block"]
)
# Weekend Feeder: North Block to Nawagaon (9:00 AM to 8:10 PM, 30 min freq)
add_feeder_trips(
    "weekend", "09:00 AM", "08:10 PM", 30,
    "North Block", "Nawagaon",
    ["North Block", "Mahanadi Bhawan", "Indravati Bhawan", "Nawagaon"]
)

print(f"Total schedules generated: {len(schedules)}")
with open("backend/schedules.json", "w") as f:
    json.dump(schedules, f, indent=2)

with open("frontend/src/data/schedules.json", "w") as f:
    json.dump(schedules, f, indent=2)

print("Updated backend/schedules.json and frontend/src/data/schedules.json successfully!")
