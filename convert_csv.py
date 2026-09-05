"""
One-off script that converts src/data/Sample_-_Superstore.csv into src/data/salesData.js.
Not used at runtime -- kept for reference / re-running if you swap in a different CSV.
Run with: python3 convert_csv.py
"""
import csv, json
from datetime import datetime

with open("src/data/Sample_-_Superstore.csv", encoding="latin-1") as f:
    reader = csv.DictReader(f)
    rows = list(reader)

out = []
for r in rows:
    d = datetime.strptime(r["Order Date"], "%m/%d/%Y")
    out.append({
        "orderId": r["Order ID"],
        "orderDate": d.strftime("%Y-%m-%d"),
        "category": r["Category"],
        "subCategory": r["Sub-Category"],
        "productName": r["Product Name"],
        "quantityOrdered": int(r["Quantity"]),
        "discount": float(r["Discount"]),
        "sales": round(float(r["Sales"]), 2),
        "profit": round(float(r["Profit"]), 2),
        "shipMode": r["Ship Mode"],
        "region": r["Region"],
        "state": r["State"],
        "city": r["City"],
        "segment": r["Segment"],
        "customerName": r["Customer Name"],
    })

out.sort(key=lambda x: (x["orderDate"], x["orderId"]))

header = '''// Real dataset: "Sample - Superstore" — a well-known retail sales dataset
// (Furniture / Office Supplies / Technology), 9,994 real order line items, 2014-2017.
// Uploaded directly by the user. Fields: orderId, orderDate, category, subCategory,
// productName, quantityOrdered, discount, sales, profit, shipMode, region, state,
// city, segment, customerName

'''
with open("src/data/salesData.js", "w") as f:
    f.write(header + "export const salesData = " + json.dumps(out, indent=2) + ";\n")

print(f"Wrote {len(out)} records to src/data/salesData.js")
