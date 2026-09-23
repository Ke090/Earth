# Earth Sunlight Simulator

日時から天文学的に太陽方向を計算し、地球の昼と夜を3Dで表示する静的Webアプリです。ブラウザ内だけで動作し、現在時刻・任意日時・UTC/ローカル入力、URL共有、表示オーバーレイに対応します。

## 開発

```bash
npm install
npm run dev
```

本番ビルドは `npm run build`、テストは `npm test` で実行します。GitHub Pagesではリポジトリの **Settings → Pages → Source** を GitHub Actions に設定してください。

## ライセンスとクレジット

- Rendering: [Three.js](https://threejs.org/), MIT License
- Astronomy: [Astronomy Engine](https://github.com/cosinekitty/astronomy), MIT License, Copyright © Don Cross
- Production earth imagery: NASA / NASA Goddard Space Flight Center. NASAによる推薦を示すものではありません。

同梱の `earth-day.svg` はオフライン開発用のスタイライズされた代替画像です。公開時には `public/textures/README.md` の案内に従い、利用するNASA Blue Marble素材と個別クレジットを確認してください。
