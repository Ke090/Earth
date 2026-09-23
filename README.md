# Earth Sunlight Simulator

日時から天文学的に太陽方向を計算し、地球の昼と夜を3Dで表示する静的Webアプリです。ブラウザ内だけで動作し、現在時刻・任意日時・UTC/ローカル入力、URL共有、表示オーバーレイに対応します。

## 開発

```bash
npm install
npm run dev
```

本番ビルドは `npm run build`、テストは `npm test` で実行します。

## GitHub Pages への公開

このリポジトリには、Viteでアプリをビルドして `dist` を公開するワークフロー
（`.github/workflows/deploy.yml`）が含まれています。

1. リポジトリの **Settings → Pages** を開く
2. **Build and deployment → Source** で **GitHub Actions** を選ぶ
3. `main` ブランチへpushするか、**Actions → Deploy to GitHub Pages → Run workflow** を実行する

公開対象にリポジトリのソース一式（`.`）を直接指定すると、Viteによる依存関係の
バンドルが行われず、3D表示が起動しません。Pagesには必ずビルド後の `dist` を
デプロイしてください。

## ライセンスとクレジット

- Rendering: [Three.js](https://threejs.org/), MIT License
- Astronomy: [Astronomy Engine](https://github.com/cosinekitty/astronomy), MIT License, Copyright © Don Cross
- Earth imagery: [NASA Earth Observatory, Blue Marble](https://earthobservatory.nasa.gov/features/BlueMarble). NASAによる推薦を示すものではありません。

同梱の `earth-topography.svg` は、NASAの画像ホストへ接続できない場合だけ使用する
オフライン用の代替画像です。素材とクレジットの詳細は `public/textures/README.md` を
参照してください。
