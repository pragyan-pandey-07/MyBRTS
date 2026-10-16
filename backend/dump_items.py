import pypdf
import json

reader = pypdf.PdfReader("BRT bus shedual New raipur -1.pdf")
page = reader.pages[0]

items = []
def visitor_body(text, cm, tm, font_dict, font_size):
    if text.strip():
        items.append({
            "y": round(tm[4], 2), # Note: in this PDF's coordinate transform, tm[4] is row y
            "x": round(tm[5], 2), # tm[5] is column x
            "text": text.strip()
        })

page.extract_text(visitor_text=visitor_body)
items.sort(key=lambda it: (it["y"], it["x"]))

with open("pdf_items.json", "w") as f:
    json.dump(items, f, indent=2)

print(f"Dumped {len(items)} items to pdf_items.json")
