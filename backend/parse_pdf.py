import pypdf
import json

reader = pypdf.PdfReader("BRT bus shedual New raipur -1.pdf")
print("Total pages:", len(reader.pages))
text = reader.pages[0].extract_text()
print("Length of text:", len(text))
with open("extracted_text.txt", "w") as f:
    f.write(text)
print("Saved extracted_text.txt. Preview:")
print(text[:1500])
