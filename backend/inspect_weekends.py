import json
import re

with open("pdf_items.json") as f:
    items = json.load(f)

# The document has:
# 1. Weekdays (y < 500)
#    - Left side: HNLU -> Railway Station (Route 101, 105)
#    - Right side: Railway Station -> HNLU (Route 201, 202, 203, 204, 205)
# 2. Weekends (y > 500)
#    - Left side: HNLU -> Railway Station (Route 101, 102)
#    - Right side: Railway Station -> HNLU (Route 201, 202, 203)

print("Inspecting weekend items:")
weekend_items = [it for it in items if it["y"] >= 505]
for it in weekend_items[:30]:
    print(it)
