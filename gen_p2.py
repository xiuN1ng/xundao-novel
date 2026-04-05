#!/usr/bin/env python3
"""Generate P2 atmosphere illustrations for XunDao novel."""

import json
import urllib.request
import urllib.error
import os
import time

API_KEY = "sk-cp-WRWn6NeqOIIq-I3ijVwNxLdyyIoVW1pFscK00I2LIlf_3k4Rx8EtxCTBNTJ5h3wGUaKcoPSGF_pGl13QsxuAl7idKE2zhRWQDirvOrcwA8bT3-xcXriJmTo"
API_URL = "https://api.minimax.chat/v1/image_generation"

IMAGES = [
    {
        "name": "ch1_cloudy_village.png",
        "prompt": "仙侠古风，水墨丹青风格，竖版9:16全屏背景，青云镇清晨，薄雾笼罩村屋，远处青山若隐若现，中国水墨画风格，宁静祥和"
    },
    {
        "name": "ch1_snow_night.png",
        "prompt": "仙侠古风，水墨丹青风格，竖版9:16全屏背景，风雪交加的深夜，老槐树下有弃婴，中国水墨画风格，悲凉孤独氛围"
    },
    {
        "name": "ch2_forest_night.png",
        "prompt": "仙侠古风，水墨丹青风格，竖版9:16全屏背景，青云镇外深夜山林，巨野猪妖潜伏，树影婆娑，中国水墨画风格，暗黑神秘"
    },
    {
        "name": "ch5_tianxuan_secret.png",
        "prompt": "仙侠古风，水墨丹青风格，竖版9:16全屏背景，天璇真人密室，紫色法阵符文，凶光闪烁，中国水墨画风格，神秘压抑"
    },
    {
        "name": "ch8_breakthrough.png",
        "prompt": "仙侠古风，水墨丹青风格，竖版9:16全屏背景，道君传承仪式，金色光芒从天空倾泻，少年的身影在光芒中升华，中国水墨画风格，庄严肃穆"
    },
    {
        "name": "ch_end_dao_self.png",
        "prompt": "仙侠古风，水墨丹青风格，竖版9:16全屏背景，天空中的巨大天道之眼，金色瞳孔俯瞰人间，中国水墨画风格，宇宙感压迫感"
    },
]

OUTPUT_DIR = "/root/.openclaw/workspace/xundao-novel/src/assets/scenes"

def generate_image(prompt: str, output_path: str) -> bool:
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    data = json.dumps({
        "model": "image-01",
        "prompt": prompt,
        "aspect_ratios": ["9:16"],
        "response_format": "url"
    }).encode()

    req = urllib.request.Request(API_URL, data=data, headers=headers, method="POST")
    try:
        resp = urllib.request.urlopen(req, timeout=180)
        result = json.loads(resp.read().decode())
        
        if result.get("base_resp", {}).get("status_code") != 0:
            print(f"  API error: {result.get('base_resp', {}).get('status_msg')}")
            return False
        
        image_urls = result.get("data", {}).get("image_urls", [])
        if not image_urls:
            print(f"  No image URL in response")
            return False
        
        # Download the image
        img_url = image_urls[0]
        img_req = urllib.request.Request(img_url)
        with urllib.request.urlopen(img_req, timeout=60) as img_resp:
            img_data = img_resp.read()
            with open(output_path, "wb") as f:
                f.write(img_data)
        
        size_kb = len(img_data) / 1024
        print(f"  Downloaded: {output_path} ({size_kb:.1f} KB)")
        return True
        
    except Exception as e:
        print(f"  Error: {e}")
        return False

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    results = []
    for img in IMAGES:
        output_path = os.path.join(OUTPUT_DIR, img["name"])
        print(f"\nGenerating {img['name']}...")
        success = generate_image(img["prompt"], output_path)
        results.append((img["name"], success))
        if success:
            size = os.path.getsize(output_path)
            print(f"  OK - {size/1024:.1f} KB")
        # Rate limit: wait between requests
        if img != IMAGES[-1]:
            time.sleep(3)
    
    print("\n\n=== Summary ===")
    for name, success in results:
        print(f"  {'✓' if success else '✗'} {name}")
    
    # Check total size
    total = sum(os.path.getsize(os.path.join(OUTPUT_DIR, n)) for n, s in results if s)
    print(f"\nP2 Total: {total/1024/1024:.2f} MB ({sum(1 for _, s in results if s)}/6 images)")

if __name__ == "__main__":
    main()
