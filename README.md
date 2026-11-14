# 高級大人養成所

手機優先的視覺小說學習遊戲（繁體中文）。第 1-1 關跟主角小白看房，搞懂「30 坪」到底是什麼。

線上位址（啟用 GitHub Pages 之後）：<https://orangejuicela.github.io/adult-life-game/>

## 這一關在學什麼

- 權狀坪數 = 主建物 + 附屬建物 + 公設，房價通常用權狀坪數乘每坪單價
- 室內大不大要看主建物，公設比 = 公設 ÷ 權狀總坪數
- 雨遮看建照年份；車位要和房屋分開算；買賣前查實價登錄

老師先提問。第一次答對 +20 XP，想過再答對 +10 XP。三張知識卡會收進左下角的收藏。進度存在這個瀏覽器的 localStorage，選單可以重新開始。

## 本地開啟

不需要建置。在 `site/` 開一個靜態伺服器，或直接用瀏覽器打開 `site/index.html`。

```bash
cd site && python3 -m http.server 8080
```

桌面會把畫面收成約 430px 寬的手機框；360–430px 的手機則全螢幕。

## GitHub Pages

推上 `main` 後，`.github/workflows/pages.yml` 會用 GitHub Actions 部署 `site/`：

1. `actions/configure-pages`（`enablement: true`）
2. `actions/upload-pages-artifact`（目錄是 `site`）
3. `actions/deploy-pages`

`enablement: true` 會嘗試在第一次執行時開啟 Pages，但預設的 `GITHUB_TOKEN` 通常沒有倉庫管理權限，這一步可能失敗。若 Actions 出現 “Get Pages site failed” 或 “Resource not accessible by integration”：

1. 打開倉庫 **Settings → Pages**
2. **Build and deployment → Source** 選 **GitHub Actions**
3. 回到 **Actions**，把失敗的 “Deploy GitHub Pages” 重跑一次

之後每次推上 `main` 都會自動更新 <https://orangejuicela.github.io/adult-life-game/>。

<!-- Pages source: GitHub Actions -->
