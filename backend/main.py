import json
import os
from typing import Optional, List
from datetime import datetime
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="BRTS Raipur Bus Schedule API", version="1.0.0")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load schedules dataset
SCHEDULES_FILE = os.path.join(os.path.dirname(__file__), "schedules.json")
with open(SCHEDULES_FILE, "r") as f:
    SCHEDULES_DATA = json.load(f)

def parse_time_mins(t_str: str) -> int:
    try:
        dt = datetime.strptime(t_str.strip(), "%I:%M %p")
        return dt.hour * 60 + dt.minute
    except Exception:
        return 0

@app.get("/")
def read_root():
    return {
        "status": "ok",
        "message": "BRTS Raipur API is active",
        "total_trips": len(SCHEDULES_DATA)
    }

@app.get("/api/schedules")
def get_schedules(
    day: Optional[str] = Query(None, description="weekday or weekend"),
    route: Optional[str] = Query(None, description="e.g. 101, 201, 202"),
    direction: Optional[str] = Query(None, description="e.g. 'HNLU to Railway Station'")
):
    results = SCHEDULES_DATA
    if day:
        results = [s for s in results if s["service_type"].lower() == day.lower()]
    if route:
        results = [s for s in results if s["route_number"] == route]
    if direction:
        results = [s for s in results if direction.lower() in s["direction"].lower()]
    return {"count": len(results), "trips": results}

@app.get("/api/stops")
def get_stops():
    stops_set = set()
    for trip in SCHEDULES_DATA:
        for stop in trip.get("stops", []):
            stops_set.add(stop["stop_name"])
    return sorted(list(stops_set))

@app.get("/api/routes")
def get_routes():
    routes_dict = {}
    for trip in SCHEDULES_DATA:
        r_num = trip["route_number"]
        if r_num not in routes_dict:
            routes_dict[r_num] = {
                "route_number": r_num,
                "directions": set(),
                "service_types": set(),
                "trip_count": 0
            }
        routes_dict[r_num]["directions"].add(trip["direction"])
        routes_dict[r_num]["service_types"].add(trip["service_type"])
        routes_dict[r_num]["trip_count"] += 1
    
    result = []
    for r_num, val in sorted(routes_dict.items()):
        result.append({
            "route_number": r_num,
            "directions": list(val["directions"]),
            "service_types": list(val["service_types"]),
            "trip_count": val["trip_count"]
        })
    return result

@app.get("/api/search")
def search_trips(
    origin: str = Query(..., description="Origin stop name"),
    destination: str = Query(..., description="Destination stop name"),
    day: Optional[str] = Query("weekday", description="weekday or weekend")
):
    origin_clean = origin.strip().lower()
    dest_clean = destination.strip().lower()
    
    matches = []
    for trip in SCHEDULES_DATA:
        if day and trip["service_type"].lower() != day.lower():
            continue
        
        stops = trip.get("stops", [])
        orig_idx = None
        dest_idx = None
        
        for idx, s in enumerate(stops):
            s_name = s["stop_name"].lower()
            if orig_idx is None and origin_clean in s_name:
                orig_idx = idx
            elif orig_idx is not None and dest_clean in s_name:
                dest_idx = idx
                break
                
        if orig_idx is not None and dest_idx is not None and orig_idx < dest_idx:
            dep_time = stops[orig_idx]["time"]
            arr_time = stops[dest_idx]["time"]
            dur = parse_time_mins(arr_time) - parse_time_mins(dep_time)
            if dur < 0:
                dur += 24 * 60
                
            matches.append({
                "trip_id": trip["id"],
                "route_number": trip["route_number"],
                "direction": trip["direction"],
                "service_type": trip["service_type"],
                "origin": stops[orig_idx]["stop_name"],
                "departure_time": dep_time,
                "destination": stops[dest_idx]["stop_name"],
                "arrival_time": arr_time,
                "duration_mins": dur,
                "intermediate_stops_count": dest_idx - orig_idx - 1,
                "all_trip_stops": stops[orig_idx:dest_idx + 1]
            })
            
    # Sort by departure time
    matches.sort(key=lambda x: parse_time_mins(x["departure_time"]))
    return {
        "origin": origin,
        "destination": destination,
        "day": day,
        "count": len(matches),
        "trips": matches
    }
