'use client';

import { FormEvent, useState } from 'react';
import styles from './SalesLanding.module.css';

const sourceCards = [
  ['EU GPSR', 'EU/UK向け販売で重要になる製品安全・責任者情報の確認軸。', '2024年12月13日適用'],
  ['VAT / IOSS', '小口輸入・税務番号・通関電子データをSKUと紐付けて管理。', 'EU越境ECの実務論点'],
  ['JETRO実務ガイド', '物流・規制・認証・販売準備など、日本企業の越境EC実務を整理。', '日本企業向けの入口'],
];

const steps = [
  ['商品を登録', '商品名、SKU、カテゴリ、原産国を入力。'],
  ['市場を選択', 'EU/UK、Amazon、Shopify、eBayなど販売先を指定。'],
  ['不足を確認', '責任者情報、ラベル、証跡、IOSS/VAT、期限を一覧化。'],
  ['Launch Pack化', '専門家や社内メンバーに渡せる販売準備パケットを作成。'],
];

const plans = [
  ['Starter', '¥29,800', '少量SKUの越境テスト', ['50 SKU', '2市場', '基本チェック', '期限管理'], false],
  ['Growth', '¥79,800', 'D2C・中小メーカー向け', ['250 SKU', '5市場', '提出物生成', 'チーム権限'], true],
  ['Scale', '¥198,000', '支援会社・複数ブランド向け', ['1,000 SKU', '10市場', '監査証跡', '承認フロー'], false],
] as const;

const faqs = [
  ['PassportOSは法律相談サービスですか？', 'いいえ。法的助言の最終判断を自動化するものではなく、必要な作業・証跡・期限・根拠を整理する業務管理SaaSです。専門判断が必要な箇所はレビュー前提で扱います。'],
  ['誰向けのサービスですか？', '日本からEU/UKへ商品を販売したいD2Cブランド、中小メーカー、越境EC支援会社、Shopify・Amazon・eBay運用担当者を想定しています。'],
  ['なぜSKUごとに管理するのですか？', '越境ECの準備は国・チャネル・商品カテゴリごとに必要事項が変わるためです。商品単位で不足項目を見える化することで、出品停止や提出漏れのリスクを下げられます。'],
  ['フォーム送信はどこに保存されますか？', 'このMVPではブラウザ内に保存します。本番化ではNeon Postgres、メール通知、Stripe Billingへ接続する設計です。'],
];

export function SalesLanding() {
  const [message, setMessage] = useState('');

  const submitLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    if (!name || !email) {
      setMessage('お名前とメールアドレスを入力してください。');
      return;
    }
    const payload = {
      id: crypto.randomUUID(),
      name,
      email,
      company: String(form.get('company') || ''),
      markets: String(form.get('markets') || ''),
      skuCount: String(form.get('skuCount') || ''),
      message: String(form.get('message') || ''),
      createdAt: new Date().toISOString(),
    };
    const current = JSON.parse(window.localStorage.getItem('passportos-sales-leads') || '[]') as unknown[];
    window.localStorage.setItem('passportos-sales-leads', JSON.stringify([payload, ...current].slice(0, 50)));
    setMessage('無料診断リクエストを受け付けました。本番化時はDB保存・メール通知へ接続できます。');
    event.currentTarget.reset();
  };

  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.brand} href="#top"><span>Passport</span>OS</a>
        <nav className={styles.navLinks} aria-label="主要ナビゲーション">
          <a href="#why">選ばれる理由</a>
          <a href="#check">診断</a>
          <a href="#compare">比較</a>
          <a href="#pricing">料金</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className={styles.navCta} href="#check">5分で無料診断</a>
      </header>

      <section className={styles.hero} id="top">
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <span className={styles.badge}>越境ECの出品停止を防ぐ 商品別チェックSaaS</span>
            <p className={styles.eyebrow}>SKU Launch Readiness for EU / UK</p>
            <h1>この商品、<br /><span className={styles.highlight}>EU/UKで売れますか？</span></h1>
            <p className={styles.subLead}>海外販売前に必要な準備を、商品ごとに一画面で。GPSR、EU責任者情報、VAT/IOSS、提出証跡、更新期限をSKU単位で見える化します。</p>
            <div className={styles.heroActions}>
              <a className={styles.primary} href="#check">5分で無料診断を始める</a>
              <a className={styles.secondary} href="#demo-screen">実画面イメージを見る</a>
            </div>
            <div className={styles.proof}>
              <span>SKU単位</span><span>EU/UK対応</span><span>出品停止リスク対策</span><span>証跡管理</span><span>期限管理</span>
            </div>
          </div>

          <div className={styles.heroCard} id="demo-screen" aria-label="PassportOSの実画面イメージ">
            <div className={styles.screenTop}>
              <strong>SKU Readiness Check</strong>
              <div className={styles.score}><strong>73%</strong><small>準備率</small></div>
            </div>
            <div className={styles.statusGrid}>
              <div className={styles.status}><small>販売停止リスク</small><b className={styles.danger}>2件</b></div>
              <div className={styles.status}><small>14日以内期限</small><b className={styles.warn}>4件</b></div>
              <div className={styles.status}><small>証跡あり</small><b className={styles.ok}>8件</b></div>
              <div className={styles.status}><small>次のアクション</small><b>責任者情報</b></div>
            </div>
            <div className={styles.miniTable}>
              <div className={`${styles.miniRow} ${styles.miniHead}`}><span>必要な準備</span><span>状態</span><span>期限</span></div>
              <div className={styles.miniRow}><span>EU/UK責任者情報</span><span className={styles.danger}>不足</span><span>6月6日</span></div>
              <div className={styles.miniRow}><span>現地向けラベル表示</span><span className={styles.warn}>要確認</span><span>6月10日</span></div>
              <div className={styles.miniRow}><span>IOSS / VAT運用番号</span><span className={styles.ok}>完了</span><span>6月22日</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="why">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.lightBadge}>Why now</span>
            <h2>売れ始めてから止まる前に、販売準備を商品別に整える。</h2>
            <p>越境ECの実務は、物流・規制・表示・税務・証跡・期限が絡む作業束です。PassportOSは、専門用語を知らない担当者にも「次に何をすべきか」が分かる状態へ変換します。</p>
          </div>
          <div className={styles.cards3}>
            {sourceCards.map(([title, body, tag]) => <article className={styles.card} key={title}><span className={styles.sourceTag}>{tag}</span><h3>{title}</h3><p>{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.lightBadge}>How it works</span>
            <h2>4ステップで、商品別の販売準備パケットを作る。</h2>
            <p>「この商品は何が足りないのか」をSKUごとに整理し、社内・専門家・支援会社へ渡せる形にします。</p>
          </div>
          <div className={styles.checklist}>{steps.map(([title, body], index) => <article className={styles.step} key={title}><div className={styles.stepNum}>{String(index + 1).padStart(2, '0')}</div><h3>{title}</h3><p>{body}</p></article>)}</div>
        </div>
      </section>

      <section className={styles.section} id="compare">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.lightBadge}>Comparison</span>
            <h2>Excelでも、単発コンサルでも足りない運用を一画面に。</h2>
            <p>PassportOSは「初回の調査」ではなく、証跡・期限・変更履歴が残る継続オペレーションとして設計しています。</p>
          </div>
          <div className={styles.compare}>
            <table>
              <thead><tr><th>方法</th><th>強み</th><th>弱点</th><th>向いている場面</th></tr></thead>
              <tbody>
                <tr><td>Excel管理</td><td>安く始められる</td><td>期限・証跡・根拠が散らばる</td><td>小規模な初回整理</td></tr>
                <tr><td>単発コンサル</td><td>専門判断に強い</td><td>更新・再利用・複数SKU管理に弱い</td><td>専門判断が必要な局面</td></tr>
                <tr><td className={styles.win}>PassportOS</td><td className={styles.win}>不足要件・期限・証跡を商品ごとに一画面化</td><td>本番DB接続前はMVP運用</td><td>継続的な越境販売準備</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt} id="check">
        <div className={`${styles.container} ${styles.leadGrid}`}>
          <div>
            <span className={styles.lightBadge}>Free check</span>
            <h2>まずは1商品だけ、販売準備の抜け漏れを無料で確認。</h2>
            <p>商品、販売先、SKU数を送るだけで、どこから整理すべきかを確認できます。現MVPではブラウザ保存、本番版ではDB・メール通知・Stripe課金へ接続予定です。</p>
          </div>
          <form className={`${styles.card} ${styles.form}`} onSubmit={submitLead}>
            <div className={styles.form2}><label className={styles.field}>お名前<input name="name" required /></label><label className={styles.field}>メールアドレス<input name="email" type="email" required /></label></div>
            <div className={styles.form2}><label className={styles.field}>会社名・屋号<input name="company" /></label><label className={styles.field}>SKU数<select name="skuCount" defaultValue="1-50"><option>1-50</option><option>51-250</option><option>251-1000</option><option>1000+</option></select></label></div>
            <label className={styles.field}>対象市場・チャネル<input name="markets" placeholder="例：EU, UK, Amazon, Shopify" /></label>
            <label className={styles.field}>相談内容<textarea name="message" placeholder="例：ShopifyでEU向けに販売予定。ラベルと責任者情報が不安。" /></label>
            {message && <div className={styles.notice} role="status">{message}</div>}
            <button className={styles.submit} type="submit">5分で無料診断を送信</button>
          </form>
        </div>
      </section>

      <section className={styles.section} id="pricing">
        <div className={styles.container}>
          <div className={styles.sectionHead}><span className={styles.lightBadge}>Pricing</span><h2>SKU数と市場数に応じて、自然に拡張できる料金設計。</h2><p>初期は相談導線で運用し、本番化時はStripe Billingへ接続する前提です。</p></div>
          <div className={styles.pricing}>{plans.map(([name, price, desc, items, recommended]) => <article className={`${styles.price} ${recommended ? styles.recommended : ''}`} key={name}>{recommended && <span className={styles.recBadge}>おすすめ</span>}<h3>{name}</h3><strong>{price}<small>/月</small></strong><p>{desc}</p><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul><a className={styles.primary} href="#check">このプランで相談</a></article>)}</div>
        </div>
      </section>

      <section className={styles.sectionAlt} id="faq">
        <div className={styles.container}>
          <div className={styles.sectionHead}><span className={styles.lightBadge}>FAQ</span><h2>導入前に不安になりやすい点を先回りして整理。</h2></div>
          <div className={styles.faq}>{faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
        </div>
      </section>

      <div className={styles.sticky}><a href="#check">5分で無料診断</a></div>
    </main>
  );
}
