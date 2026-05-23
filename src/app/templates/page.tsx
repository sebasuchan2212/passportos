import styles from '../(legal)/legal.module.css';

export const metadata = {
  title: '無料診断 返信テンプレート | PassportOS',
  description: 'PassportOSの無料診断フォームに届いた問い合わせへ返信するための営業・診断テンプレート集。',
};

const templates = [
  {
    title: '1. 初回受付返信テンプレート',
    use: 'フォーム送信直後、まず安心感を出すための返信',
    body: `件名：【PassportOS】無料診断のご依頼ありがとうございます

〇〇様

この度はPassportOSの「EU/UK販売準備 無料診断」にお申し込みいただきありがとうございます。

ご入力いただいた内容を確認し、まずは以下の観点で販売準備の抜け漏れを確認いたします。

・対象商品/SKUの概要
・販売予定市場（EU/UKなど）
・販売チャネル（Shopify / Amazon / eBay / 自社ECなど）
・EU/UK責任者情報の有無
・現地向けラベル表示の有無
・安全性資料・証跡書類の有無
・IOSS / VATまわりの確認状況

確認後、優先度の高い項目から簡潔にご返信いたします。

なお、PassportOSは法的助言そのものではなく、販売準備・証跡・期限管理を整理する業務支援サービスです。最終判断が必要な項目については、専門家確認を前提としてご案内いたします。

よろしくお願いいたします。
PassportOS 運営`
  },
  {
    title: '2. 診断結果返信テンプレート',
    use: '無料診断の結果を返す基本形',
    body: `件名：【診断結果】EU/UK販売準備チェックの結果について

〇〇様

無料診断の内容を確認しました。
現時点での販売準備状況は、以下の通りです。

■ 販売準備スコア
〇〇点 / 100点

■ 重大リスク
・〇〇
・〇〇

■ 優先して確認すべき項目
1. EU/UK責任者情報
2. 現地向けラベル表示
3. 安全性資料・技術文書
4. IOSS / VAT運用番号
5. SKU / ロット / 原産国管理

■ コメント
現時点では、〇〇の項目が未整理のため、EU/UK向け販売時に出品停止・審査差し戻し・問い合わせ対応遅延につながる可能性があります。

まずは、対象SKUごとに「必要な準備」「証跡ファイル」「更新期限」を一覧化することをおすすめします。

必要であれば、PassportOSのStarterプランで初期SKUの整理から進められます。

よろしくお願いいたします。
PassportOS 運営`
  },
  {
    title: '3. 追加情報依頼テンプレート',
    use: '入力情報が少なく、診断精度を上げたいとき',
    body: `件名：【PassportOS】無料診断に必要な追加情報のお願い

〇〇様

無料診断のご依頼ありがとうございます。
より正確に確認するため、可能な範囲で以下を教えていただけますでしょうか。

1. 対象商品のカテゴリ
2. 販売予定の国・地域
3. 販売予定チャネル（Shopify / Amazon / eBay / 自社ECなど）
4. 現在のSKU数
5. すでに準備済みの資料
6. 不安な点、止まっている作業

特にEU/UK向けの場合、商品カテゴリや販売チャネルによって確認すべき項目が変わります。

ご返信いただければ、優先度の高い順に整理してお返しします。

よろしくお願いいたします。
PassportOS 運営`
  },
  {
    title: '4. 有料相談・プラン提案テンプレート',
    use: '無料診断後にStarter / Growthへつなぐとき',
    body: `件名：【ご提案】SKU別の販売準備管理について

〇〇様

無料診断の内容から判断すると、現在の課題は単発の調査よりも、SKUごとの継続管理に近い状態です。

特に以下の項目は、今後も更新・追加・確認が発生しやすいです。

・EU/UK責任者情報
・現地向けラベル表示
・証跡ファイル管理
・IOSS / VAT関連情報
・販売チャネルごとの提出物
・更新期限と担当者管理

そのため、まずは以下の進め方をおすすめします。

■ 推奨プラン
〇〇プラン

■ 初回対応範囲
・対象SKUの整理
・不足項目の洗い出し
・優先度づけ
・Launch Pack化
・次に確認すべき専門項目の整理

ご希望であれば、対象SKUを絞って初回整理から進められます。

よろしくお願いいたします。
PassportOS 運営`
  },
  {
    title: '5. 現時点では対象外の場合の丁寧な返信',
    use: 'PassportOSの対象から外れる問い合わせに返信するとき',
    body: `件名：【PassportOS】無料診断の確認結果について

〇〇様

無料診断へのお申し込みありがとうございます。
内容を確認したところ、現時点ではPassportOSが最も得意とする「EU/UK向け物販SKUの販売準備管理」とは少し対象が異なる可能性があります。

PassportOSは主に、以下のようなケースを想定しています。

・日本からEU/UKへ物販商品を販売する
・Shopify / Amazon / eBay / 自社ECで販売する
・SKUごとに証跡・期限・提出物を管理したい
・出品停止や審査差し戻しを避けたい

今回の内容については、〇〇の専門家または別サービスの方が適している可能性があります。

今後、EU/UK向け商品販売を進める際には、ぜひ改めてご相談ください。

よろしくお願いいたします。
PassportOS 運営`
  },
  {
    title: '6. 3日後フォローアップテンプレート',
    use: '診断結果を送った後、返信がない場合',
    body: `件名：【再送】EU/UK販売準備チェックの件

〇〇様

先日お送りしたEU/UK販売準備チェックの件で、念のため再度ご連絡いたします。

今回の診断では、特に以下の項目が優先度高めでした。

・〇〇
・〇〇
・〇〇

越境ECでは、販売開始後に準備不足が見つかると、出品停止・審査差し戻し・配送遅延につながる場合があります。

まずは対象SKUを少数に絞って整理するだけでも、リスクをかなり見える化できます。

必要であれば、初回整理の進め方をご提案します。

よろしくお願いいたします。
PassportOS 運営`
  }
];

export default function TemplatesPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <a className={styles.back} href="/">← PassportOS</a>
          <h1>無料診断の返信テンプレート</h1>
          <p>フォームから届いたリードに対して、初回受付・診断結果・追加情報依頼・有料提案・フォローアップまで即返信できるテンプレート集です。</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.note}>使い方：〇〇の部分を相手の会社名・商品名・不足項目に差し替えて、メールまたはDMに貼り付けてください。</div>
          {templates.map((template) => (
            <article className={styles.card} key={template.title}>
              <h2>{template.title}</h2>
              <p>{template.use}</p>
              <pre style={{ whiteSpace: 'pre-wrap', background: '#0f172a', color: '#e0f2fe', padding: '18px', borderRadius: '18px', overflowX: 'auto', lineHeight: 1.75 }}>{template.body}</pre>
            </article>
          ))}
          <div className={styles.links}>
            <a href="/admin">Admin</a>
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </section>
    </main>
  );
}
