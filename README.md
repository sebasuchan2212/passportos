# PassportOS MVP

日本発の越境EC向け「SKUパスポートOS」MVPです。GitHub + Vercel にそのまま載せやすい Next.js / TypeScript 構成で、外部DBなしでもブラウザ上で動作します。

## 実装済み

- 大手SaaS風ランディング + ダッシュボードUI
- SKU登録フォーム
- EU/UK・Amazon/Shopify/eBay/自社ECの市場選択
- OOPベースのルールエンジン
- GPSR責任者、ラベル、証跡、IOSS/VAT、トレーサビリティ、カテゴリ固有レビューの自動要件生成
- SKU別 readiness score
- 不足・レビュー・重大リスクの可視化
- デモ証跡追加
- Evidence Timeline
- Launch Pack JSONエクスポート
- localStorage 永続化

## 起動方法

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

## Vercel公開

1. このフォルダをGitHubリポジトリにpush
2. VercelでNew Projectから対象リポジトリを選択
3. Framework PresetはNext.js
4. Build Commandは `npm run build`
5. Deploy

## 注意

このMVPは業務管理・プロダクト検証用です。法的助言を自動で確定するものではありません。本番化する場合は、専門家レビュー、正式な規制DB、監査ログ、認証、DB、ファイルストレージ、決済を追加してください。
