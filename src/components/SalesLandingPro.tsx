'use client';

import { FormEvent, useState } from 'react';
import styles from './SalesLanding.module.css';

const checklistRows = [
  ['EU/UK責任者情報', '販売ページ・ラベル上で責任主体を示せない', '最優先'],
  ['現地向けラベル表示', 'モール審査落ち、返品、販売停止につながる', '高'],
  ['安全性資料・技術文書', '問い合わせ時に根拠資料を出せない', '高'],
  ['IOSS / VAT運用番号', '通関・税務・配送遅延のリスクが残る', '中'],
  ['SKU / ロット / 原産国管理', '後から監査・問い合わせ対応ができない', '中'],
  ['証跡ファイル保管', '担当者変更で提出物が失われる', '中'],
];

const cards = [
  ['EU GPSR', 'EU/UK向け販売で重要になる製品安全・責任者情報の確認軸。', '2024年12月13日適用'],
  ['VAT / IOSS', '小口輸入・税務番号・通関電子データをSKUと紐付けて管理。', 'EU越境ECの実務論点'],
  ['JETRO実務ガイド', '物流・規制・認証・販売準備など、日本企業の越境EC実務を整理。', '日本企業向けの入口'],
];

const plans = [
  ['Starter', '¥29,800', '少量SKUの越境テスト', ['50 SKU', '2市場', '基本チェック', '期限管理'], false],
  ['Growth', '¥79,800', 'D2C・中小メーカー向け', ['250 SKU', '5市場', '提出物生成', 'チーム権限'], true],
  ['Scale', '¥198,000', '支援会社・複数ブランド向け', ['1,000 SKU', '10市場', '監査証跡', '承認フロー'], false],
] as const;

export function SalesLandingPro() {
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice('送信中です...');
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { ok: boolean; error?: string; lead?: { score?: number; priority?: string } };
      if (!response.ok || !result.ok) {
        setNotice(result.error ?? '送信できませんでした。入力内容をご確認ください。');
        return;
      }
      const current = JSON.parse(window.localStorage.getItem('passportos-sales-leads') || '[]') as unknown[];
      window.localStorage.setItem('passportos-sales-leads', JSON.stringify([{ ...payload, ...result.lead, createdAt: new Date().toISOString() }, ...current].slice(0, 50)));
      setNotice(`無料診断リクエストを受け付けました。優先度: ${result.lead?.priority ?? 'medium'} / スコア: ${result.lead?.score ?? '-'}`);
      event.currentTarget.reset();
    } catch {
      setNotice('通信に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.brand} href="#top"><span>Passport</span>OS</a>
        <nav className={styles.navLinks} aria-label="主要ナビゲーション">
          <a href="#checklist">チェック表</a><a href="#check">無料診断</a><a href="#compare">比較</a><a href="#pricing">料金</a><a href="/about">About</a>
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
            <div className={styles.heroActions}><a className={styles.primary} href="#check">5分で無料診断を始める</a><a className={styles.secondary} href="#checklist">保存用チェック表を見る</a></div>
            <div className={styles.proof}><span>SKU単位</span><span>EU/UK対応</span><span>出品停止リスク対策</span><span>証跡管理</span><span>期限管理</span></div>
          </div>
          <div className={styles.heroCard} aria-label="PassportOSの実画面イメージ">
            <div className={styles.screenTop}><strong>SKU Readiness Check</strong><div className={styles.score}><strong>73%</strong><small>準備率</small></div></div>
            <div className={styles.statusGrid}><div className={styles.status}><small>販売停止リスク</small><b className={styles.danger}>2件</b></div><div className={styles.status}><small>14日以内期限</small><b className={styles.warn}>4件</b></div><div className={styles.status}><small>証跡あり</small><b className={styles.ok}>8件</b></div><div className={styles.status}><small>次のアクション</small><b>責任者情報</b></div></div>
            <div className={styles.miniTable}><div className={`${styles.miniRow} ${styles.miniHead}`}><span>必要な準備</span><span>状態</span><span>期限</span></div><div className={styles.miniRow}><span>EU/UK責任者情報</span><span className={styles.danger}>不足</span><span>6月6日</span></div><div className={styles.miniRow}><span>現地向けラベル表示</span><span className={styles.warn}>要確認</span><span>6月10日</span></div><div className={styles.miniRow}><span>IOSS / VAT運用番号</span><span className={styles.ok}>完了</span><span>6月22日</span></div></div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}><span className={styles.lightBadge}>Why now</span><h2>売れ始めてから止まる前に、販売準備を商品別に整える。</h2><p>越境ECの実務は、物流・規制・表示・税務・証跡・期限が絡む作業束です。専門用語を知らない担当者にも「次に何をすべきか」が分かる状態へ変換します。</p></div>
          <div className={styles.cards3}>{cards.map(([title, body, tag]) => <article className={styles.card} key={title}><span className={styles.sourceTag}>{tag}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
        </div>
      </section>

      <section className={styles.sectionAlt} id="checklist">
        <div className={styles.container}>
          <div className={styles.sectionHead}><span className={styles.lightBadge}>Save-worthy checklist</span><h2>EU/UK販売前チェックリスト</h2><p>保存して見返せるよう、最初に確認すべき項目を優先度つきで整理しました。</p></div>
          <div className={styles.compare}><table><thead><tr><th>チェック項目</th><th>未対応だと起きること</th><th>優先度</th></tr></thead><tbody>{checklistRows.map(([item, risk, priority]) => <tr key={item}><td className={styles.win}>{item}</td><td>{risk}</td><td>{priority}</td></tr>)}</tbody></table></div>
        </div>
      </section>

      <section className={styles.section} id="check">
        <div className={`${styles.container} ${styles.leadGrid}`}>
          <div><span className={styles.lightBadge}>Free check</span><h2>まずは1商品だけ、販売準備の抜け漏れを無料で確認。</h2><p>送信内容はAPIへ送られ、環境変数を設定するとGitHub Issue保存とメール通知に対応します。管理画面は <a href="/admin">/admin</a> から確認できます。</p></div>
          <form className={`${styles.card} ${styles.form}`} onSubmit={submitLead}>
            <div className={styles.form2}><label className={styles.field}>お名前<input name="name" required /></label><label className={styles.field}>メールアドレス<input name="email" type="email" required /></label></div>
            <div className={styles.form2}><label className={styles.field}>会社名・屋号<input name="company" /></label><label className={styles.field}>SKU数<select name="skuCount" defaultValue="1-50"><option>1-50</option><option>51-250</option><option>251-1000</option><option>1000+</option></select></label></div>
            <label className={styles.field}>Webサイト・販売ページ<input name="website" placeholder="https://" /></label>
            <label className={styles.field}>対象市場・チャネル<input name="markets" placeholder="例：EU, UK, Amazon, Shopify" /></label>
            <label className={styles.field}>相談内容<textarea name="message" placeholder="例：ShopifyでEU向けに販売予定。ラベルと責任者情報が不安。" /></label>
            {notice && <div className={styles.notice} role="status">{notice}</div>}
            <button className={styles.submit} type="submit" disabled={submitting}>{submitting ? '送信中...' : '5分で無料診断を送信'}</button>
          </form>
        </div>
      </section>

      <section className={styles.sectionAlt} id="compare">
        <div className={styles.container}><div className={styles.sectionHead}><span className={styles.lightBadge}>Comparison</span><h2>Excelでも、単発コンサルでも足りない運用を一画面に。</h2><p>PassportOSは「初回の調査」ではなく、証跡・期限・変更履歴が残る継続オペレーションとして設計しています。</p></div><div className={styles.compare}><table><thead><tr><th>方法</th><th>強み</th><th>弱点</th><th>向いている場面</th></tr></thead><tbody><tr><td>Excel管理</td><td>安く始められる</td><td>期限・証跡・根拠が散らばる</td><td>小規模な初回整理</td></tr><tr><td>単発コンサル</td><td>専門判断に強い</td><td>更新・再利用・複数SKU管理に弱い</td><td>専門判断が必要な局面</td></tr><tr><td className={styles.win}>PassportOS</td><td className={styles.win}>不足要件・期限・証跡を商品ごとに一画面化</td><td>外部キー未設定時はMVP保存</td><td>継続的な越境販売準備</td></tr></tbody></table></div></div>
      </section>

      <section className={styles.section} id="pricing"><div className={styles.container}><div className={styles.sectionHead}><span className={styles.lightBadge}>Pricing</span><h2>SKU数と市場数に応じて、自然に拡張できる料金設計。</h2><p>初期は相談導線で運用し、本番化時はStripe Billingへ接続する前提です。</p></div><div className={styles.pricing}>{plans.map(([name, price, desc, items, recommended]) => <article className={`${styles.price} ${recommended ? styles.recommended : ''}`} key={name}>{recommended && <span className={styles.recBadge}>おすすめ</span>}<h3>{name}</h3><strong>{price}<small>/月</small></strong><p>{desc}</p><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul><a className={styles.primary} href="#check">このプランで相談</a></article>)}</div></div></section>

      <footer className={styles.footer}><div className={styles.container}><a href="/about">About</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/admin">Admin</a></div></footer>
      <div className={styles.sticky}><a href="#check">5分で無料診断</a></div>
    </main>
  );
}
