import requests

# API Endpoint
url = "http://localhost:4000/api/v1/product/category/add"

# List of subcategories
categories = [
    "AXLE PEGS", "BASKETS", "BAT HOLDER", "BATTERIES", "BEARINGS", "BELLS & HORNS",
    "BICYCLES", "BOTTOM BRACKETS", "BRAKES", "BUMPERS", "CASSETTE & COOS",
    "CHAIN GUARDS", "CHAINRINGS", "IAINS", "CONTINENTAL KITS", "CONVERSION KITS",
    "CRANK ARMS & SETS", "DERAILLEURS", "FENDERS", "FORKS", "FRAMES", "FREEWHEELS",
    "CRIPS & TAPE", "HANDLEBARS", "HEADSETS", "HUBS", "HYDRATION", "KICKSTANDS",
    "KNOCK OFFS", "ITS", "LOCKS", "MIRRORS", "MUFFLERS", "NAME PLATES", "PATCH KITS",
    "PEDALS", "PUMPS", "REAR RACKS", "REFLECTORS", "ROTORS", "SADDLES", "SEATPOSTS",
    "SHIFTERS", "SISSY BAR CUSI IONS", "SISSY BARS", "SPOKES", "STEERING WHEEL COVERS",
    "STEERING WHEELS", "STEMS", "TIRES", "TOOLS", "TRAINING WHEELS", "TUBE PROTECTORS",
    "TUBES", "VALVE PARTS", "WHEEL COVERS", "WHEEL TRIMS", "WHEELS"
]

# Function to add subcategories
def add_categories():
    for category in categories:
        payload = {
            "name": category  # Send one category at a time
        }
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                print(f"Successfully added: {category}")
            else:
                print(f"Failed to add {category}: {response.text}")
        except Exception as e:
            print(f"Error adding {category}: {e}")

# Run the function
if __name__ == "__main__":
    add_categories()
