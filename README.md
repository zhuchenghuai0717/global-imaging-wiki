# 影像参数速查（Global Imaging Wiki · 公开版）

跨品牌 CT 扫描协议参数速查工具（GE / 西门子 / 飞利浦 / 联影 / 佳能）。

## 内容
- `index.html` — 单页应用（协议浏览器 + 参数对照表 + 科研服务引导）
- `assets/style.css`、`assets/app.js`
- `data/scan_protocols_complete.json` — 41 个协议 × 5 品牌参数
- `data/brands_extended.json` — 品牌信息

## 本地预览
```bash
cd global-imaging-wiki-public
python3 -m http.server 8000
# 打开 http://127.0.0.1:8000
```

## 部署（GitHub Pages）
```bash
git init && git add -A && git commit -m "init"
gh repo create global-imaging-wiki --public --source=. --push
gh api -X POST repos/zhuchenghuai0717/global-imaging-wiki/pages -f "source[branch]=main" -f "source[path]=/"
```

## 待办（上线后）
- [ ] 把 `index.html` 里的 `微信 XXX` / `XXX@example.com` 换成真实联系方式
- [ ] 绑定自定义域名（可选）
- [ ] 提交搜索引擎（Google Search Console / Bing）

## 免责
参数为参考值，实际以设备厂商官方手册与本单位协议为准。本页不构成医疗建议。
