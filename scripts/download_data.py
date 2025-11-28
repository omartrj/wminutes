import csv
import json
import requests
import io
import sys
import os

# Configuration
CSV_URL = "https://data.wien.gv.at/csv/wienerlinien-ogd-haltestellen.csv"
OUTPUT_FILE = "./public/data/stations.json"

def generate_ts():
    print(f"--- Wiener Linien Station Generator ---")
    print(f"[*] Downloading data from: {CSV_URL}")
    
    try:
        response = requests.get(CSV_URL)
        response.raise_for_status() # Raise error if download fails
        response.encoding = 'utf-8'
        
        csv_file = io.StringIO(response.text)
        # Vienna CSV uses semicolon as delimiter
        reader = csv.DictReader(csv_file, delimiter=';')
        
        stations = []
        seen_divas = set()
        count = 0
        
        print("[*] Processing and cleaning data...")
        
        for row in reader:
            name = row.get('NAME', '').strip()
            
            # Name cleaning logic:
            # Some names start with a number and a dot, e.g.: 
            # - "1. Haidequerstraße Süd"
            # - "11. Haidequerstraße"
            # We remove this prefix for consistency.
            if '.' in name:
                parts = name.split('.')
                # Safety check: We only cut if the part before the dot is a number.
                # This prevents breaking names like "St. Marx".
                if parts[0].strip().isdigit():
                    name = ' '.join(parts[1:]).strip()
            
            diva = row.get('DIVA', '').strip()

            # Skip if name or diva is missing
            if not name or not diva:
                continue

            # Parse DIVA as an integer; skip rows where it's not numeric
            try:
                diva = int(diva)
            except ValueError:
                # If DIVA contains non-digits, skip this row
                continue

            # Composite key to avoid exact duplicates (use numeric diva)
            unique_key = f"{name}_{diva}"

            if unique_key not in seen_divas:
                # Appending the station object with diva as a number
                stations.append({
                    "name": name,
                    "diva": diva
                })
                seen_divas.add(unique_key)
                count += 1
        
        # Create the data directory if it doesn't exist
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

        print(f"[*] Writing to {OUTPUT_FILE}...")
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            # Write each station as a single-line JSON object
            f.write("[\n")
            for i, station in enumerate(stations):
                # Dump without spaces to keep each station on one line
                obj_str = json.dumps(station, ensure_ascii=False)
                # Add comma except for last element
                if i < len(stations) - 1:
                    f.write(f"  {obj_str},\n")
                else:
                    f.write(f"  {obj_str}\n")
            f.write("]\n")
        
        print(f"[SUCCESS] Generated {OUTPUT_FILE} with {count} unique stations.")
        
    except Exception as e:
        print(f"[ERROR] Something went wrong: {e}")
        sys.exit(1)

if __name__ == "__main__":
    generate_ts()