import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(path.join(root, 'content/gallery.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
if (data.items.length !== 10 || data.items.some((item, i) => item.number !== i)) throw new Error('圖片編號必須完整且依序為 0–9。');
await mkdir(path.join(root, 'dist/assets'), {recursive: true});
for (const item of data.items) {
  if (!/^[A-Za-z0-9_-]+$/.test(item.drive_id)) throw new Error('Drive ID 格式錯誤。');
  if (!Number.isInteger(item.width) || !Number.isInteger(item.height) || item.width < 1 || item.height < 1) throw new Error('圖片尺寸錯誤。');
  await copyFile(path.join(root, 'previews', `${item.number}.jpg`), path.join(root, 'dist/assets', `${item.number}.jpg`));
}
const cards = data.items.map(item => `      <li>
        <a class="image-card" href="https://drive.google.com/file/d/${item.drive_id}/view" aria-label="編號 ${item.number}：在 Google Drive 開啟版權頁原圖">
          <span class="number">編號 <b>${item.number}</b></span>
          <span class="preview"><img src="assets/${item.number}.jpg" width="${item.width}" height="${item.height}" alt="編號 ${item.number} 版權頁縮圖" decoding="async"></span>
        </a>
      </li>`).join('\n');
const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="referrer" content="no-referrer">
  <title>${escape(data.title)}</title>
  <link rel="stylesheet" href="assets/styles.css">
</head>
<body>
  <a class="skip-link" href="#images">跳至圖片</a>
  <main>
    <header>
      <h1>${escape(data.title)}</h1>
      <p class="instruction"><strong>${escape(data.instruction)}</strong></p>
    </header>
    <ul id="images" class="gallery" aria-label="編號 0 至 9 的版權頁圖片" tabindex="-1">
${cards}
    </ul>
  </main>
</body>
</html>
`;
await writeFile(path.join(root, 'dist/index.html'), html);
await copyFile(path.join(root, 'src/styles.css'), path.join(root, 'dist/assets/styles.css'));
await writeFile(path.join(root, 'dist/.nojekyll'), '');
console.log('已建置獨立版權頁網站：dist/index.html（10 張縮圖）');
