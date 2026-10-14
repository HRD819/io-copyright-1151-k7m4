import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(path.join(root, 'content/gallery.json'), 'utf8'));
const html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
assert.equal((html.match(/<h1>/g) ?? []).length, 1);
assert.equal((html.match(/<img /g) ?? []).length, 10);
assert.equal((html.match(/<p\b/g) ?? []).length, 1, '僅有一段作業說明');
assert.ok(html.includes('<strong>請依您座號的個位數字選擇對應號碼的圖片</strong>'));
assert.ok(html.includes('content="noindex, nofollow"'));
assert.ok(html.includes('content="no-referrer"'));
assert.doesNotMatch(html, /<script|<iframe|target="_blank"/i);
const links = [...html.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
const driveLinks = links.filter(link => link.startsWith('https:'));
assert.deepEqual(driveLinks, data.items.map(item => `https://drive.google.com/file/d/${item.drive_id}/view`));
assert.equal(new Set(driveLinks).size, 10);
assert.deepEqual(links.filter(link => !link.startsWith('https:')), ['assets/styles.css', '#images']);
let total = 0;
for (const item of data.items) {
  const size = (await stat(path.join(root, 'dist/assets', `${item.number}.jpg`))).size;
  assert.ok(size > 0 && size < 250000, `縮圖 ${item.number} 檔案大小異常`);
  total += size;
}
assert.ok(total < 1500000);
console.log(`檢查通過：10 張縮圖、10 個獨立 Drive 連結、單一指定說明、無其他網站導覽。縮圖總量 ${(total / 1024).toFixed(0)} KiB。`);
