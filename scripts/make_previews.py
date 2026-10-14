"""Create local previews without modifying the supplied originals. Requires Pillow."""
import argparse
import json
from pathlib import Path
from PIL import Image, ImageOps

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path, help='Folder containing 0.jpg through 9.jpg')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
output = root / 'previews'
output.mkdir(exist_ok=True)
data_file = root / 'content' / 'gallery.json'
data = json.loads(data_file.read_text(encoding='utf-8'))
for item in data['items']:
    with Image.open(args.source / f"{item['number']}.jpg") as original:
        preview = ImageOps.exif_transpose(original).convert('RGB')
        preview.thumbnail((600, 800), Image.Resampling.LANCZOS)
        preview.save(output / f"{item['number']}.jpg", quality=85, optimize=True)
        item['width'], item['height'] = preview.size
data_file.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Created 10 previews; originals unchanged.')
