# 資訊組織｜1-03 版權頁

獨立靜態作業網頁，與既有視障生教材網站分開；沒有共用選單、首頁連結、程式或部署設定。

## 學生頁面

- 標題：資訊組織｜1-03 版權頁。
- 唯一作業說明：**請依您座號的個位數字選擇對應號碼的圖片**。
- 0–9 共十張完整、不裁切的縮圖；桌機五欄、平板三欄、手機兩欄。
- 點選編號或圖片，在同一分頁開啟對應 Google Drive 原圖。
- 不加入額外作業要求、期限、繳交方式或其他網站導覽。
- 使用 noindex, nofollow 與 no-referrer；不含追蹤或外部字型。

## 檔案與維護

- `content/gallery.json`：標題、指定說明、0–9 與 Drive ID 的對應。
- `previews/`：由使用者提供的本機 JPG 產生的小尺寸縮圖，不含原始解析度副本。
- `src/styles.css`：版面。
- `scripts/build.mjs`：將內容與縮圖建置到 `dist/`，勿手改 `dist/`。
- `scripts/make_previews.py`：重新生成縮圖，需 Python + Pillow；原圖不會被修改。

```powershell
npm run ci
npm run serve
```

預覽為 `http://127.0.0.1:4174/`。也可直接以瀏覽器開啟 `dist/index.html`。

更新圖片時，先更新原圖及 `content/gallery.json` 的對應 ID，再執行：

```powershell
python scripts/make_previews.py '..\資訊組織_1-03版權頁'
npm run ci
```

## 發布

上線只需發布 `dist/` 的內容，須使用與視障生教材網站分開的網站／儲存庫，不可加入該網站的選單或部署目錄。原始圖片仍由 Google Drive 提供。

使用者已於 2026-10-14 選擇獨立 GitHub Pages 網站。`.github/workflows/pages.yml` 在 push 時執行檢查，手動 Run workflow 時才部署；每次部署皆先執行 `npm run ci`。上傳到 GitHub 的來源不包含原圖、本機 QA 截圖或部署 ZIP。

## 驗證範圍

`npm run ci` 檢查十張縮圖、編號完整且不重複、十個對應的 Drive 連結、唯一指定說明、noindex，以及不含其他網站導覽。Google Drive 的 0–9 檔案權限已於 2026-10-14 讀取確認為 anyone/reader，未變更分享設定。

縮圖具備可辨識的連結名稱及鍵盤焦點；本次未製作圖片全文逐字稿，不能宣稱版權頁內容已可由螢幕閱讀器完整閱讀。

2026-10-14 本機驗證完成：

- `npm run ci` 通過；十張縮圖合計約 601 KiB。
- Edge 無頭瀏覽器：1440px 五欄、768px 三欄、390px 與 320px 兩欄；所有圖片載入，沒有水平溢出，object-fit: contain。
- 逐張檢視桌機／手機整頁截圖，確認完整顯示 0–9。
- 鍵盤 Tab → 跳至圖片 → Enter → Tab，可依序選取 0–9。
- 從頁面點選編號 0，匿名瀏覽器成功開啟 Drive 原圖（0.jpg）。其餘九張已核對檔名、ID 與分享權限，未逐一進行匿名瀏覽器開啟。
- 原「無障礙課程網頁」專案保持未修改。
- 本機驗收已完成；正式發布結果另記於本機 `交接記錄檔.md`。
