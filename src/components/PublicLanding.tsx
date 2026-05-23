'use client';

import { FormEvent, useState } from 'react';
import styles from './SalesLanding.module.css';

const checklist = [
  ['EU/UK責任者情報', '責任主体を示せず、販売ページやラベル確認で止まる可能性', '最優先'],
  ['現地向けラベル表示', '審査落ち、返品、販売停止につながる可能性', '高'],
  ['安全性資料・技術文書', '問い合わせ時に根拠資料を出せない可能性', '高'],
  ['IOSS / VAT運用番号', '通関・税務・配送遅延のリスクが残る可能性', '中'],
  ['SKU / ロット / 原産国管理', '監査・問い合わせ対応ができない可能性', '中'],
  ['証跡ファイル保管', '担当者変更で提出物が失われる可能性', '中'],
];

const plans = [
  ['Starter', '¥29,800', '少量SKUの越境テスト'],
  ['Growth', '¥79,800', 'D2C・中小メーカー向け'],
  ['Scale', '¥198,000', '支援会社・複数ブランド向け'],
];

export function PublicLanding() {
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice('送信中です...');
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json() as { ok: boolean; error?: string; lead?: { score?: number; priority?: string } };
      if (!response.ok || !result.ok) {
        setNotice(result.error ?? '送信できませんでした。');
        return;
      }
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
            <p className={styles.subLead}>海外販売前に必要な準備を、商品ごとに一画面で。責任者情報、VAT/IOSS、提出証跡、更新期限をSKU単位で見える化します。</p>
            <div className={styles.heroActions}><a className={styles.primary} href="#check">5分で無料診断を始める</a><a className={styles.secondary} href="#checklist">保存用チェック表を見る</a></div>
            <div className={styles.proof}><span>SKU単位</span><span>EU/UK対応</span><span>証跡管理</span><span>期限管理</span></div>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.screenTop}><strong>SKU Readiness Check</strong><div className={styles.score}><strong>73%</strong><small>準備率</small></div></div>
            <div className={styles.statusGrid}><div className={styles.status}><small>販売停止リスク</small><b className={styles.danger}>2件</b></div><div className={styles.status}><small>14日以内期限</small><b className={styles.warn}>4件</b></div><div className={styles.status}><small>証跡あり</small><b className={styles.ok}>8件</b></div><div className={styles.status}><small>次の行動</small><b>責任者情報</b></div></div>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt} id="checklist"><div className={styles.container}><div className={styles.sectionHead}><span className={styles.lightBadge}>Checklist</span><h2>EU/UK販売前チェックリスト</h2><p>保存して見返せるよう、最初に確認すべき項目を優先度つきで整理しました。</p></div><div className={styles.compare}><table><thead><tr><th>チェック項目</th><th>未対応だと起きること</th><th>優先度</th></tr></thead><tbody>{checklist.map(([item, risk, priority]) => <tr key={item}><td className={styles.win}>{item}</td><td>{risk}</td><td>{priority}</td></tr>)}</tbody></table></div></div></section>

      <section className={styles.section} id="check"><div className={`${styles.container} ${styles.leadGrid}`}><div><span className={styles.lightBadge}>Free check</span><h2>まずは1商品だけ、販売準備の抜け漏れを無料で確認。</h2><p>送信内容はAPIへ送られ、環境変数を設定するとGitHub Issue保存とメール通知に対応します。</p></div><form className={`${styles.card} ${styles.form}`} onSubmit={submitLead}><div className={styles.form2}><label className={styles.field}>お名前<input name="name" required /></label><label className={styles.field}>メールアドレス<input name="email" type="email" required /></label></div><div className={styles.form2}><label className={styles.field}>会社名・屋号<input name="company" /></label><label className={styles.field}>SKU数<select name="skuCount" defaultValue="1-50"><option>1-50</option><option>51-250</option><option>251-1000</option><option>1000+</option></select></label></div><label className={styles.field}>Webサイト・販売ページ<input name="website" placeholder="https://" /></label><label className={styles.field}>対象市場・チャネル<input name="markets" placeholder="例：EU, UK, Amazon, Shopify" /></label><label className={styles.field}>相談内容<textarea name="message" /></label>{notice && <div className={styles.notice}>{notice}</div>}<button className={styles.submit} disabled={submitting}>{submitting ? '送信中...' : '5分で無料診断を送信'}</button></form></div></section>

      <section className={styles.sectionAlt} id="compare"><div className={styles.container}><div className={styles.sectionHead}><span className={styles.lightBadge}>Comparison</span><h2>Excelでも、単発コンサルでも足りない運用を一画面に。</h2><p>証跡・期限・変更履歴が残る継続オペレーションとして設計しています。</p></div></div></section>

      <section className={styles.section} id="pricing"><div className={styles.container}><div className={styles.sectionHead}><span className={styles.lightBadge}>Pricing</span><h2>SKU数と市場数に応じた料金設計。</h2></div><div className={styles.pricing}>{plans.map(([name, price, desc]) => <article className={styles.price} key={name}><h3>{name}</h3><strong>{price}<small>/月</small></strong><p>{desc}</p><a className={styles.primary} href="#check">このプランで相談</a></article>)}</div></div></section>

      <footer className={styles.footer}><div className={styles.container}><a href="/about">About</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></footer>
      <div className={styles.sticky}><a href="#check">5分で無料診断</a></div>
    </main>
  );
}
