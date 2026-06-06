'use client';

import { FormEvent, useState } from 'react';
import styles from './VisualLanding.module.css';

const worries = [
  ['？', '海外販売したいけど、\n何から始めればいいか\n分からない'],
  ['□', 'EU/UK向けの\nルールが難しい'],
  ['▣', '必要書類や証跡が\nバラバラになっている'],
  ['盾', '出品停止や\n審査落ちが不安'],
];

const features = [
  ['⌕', '商品ごとに必要な\n準備を見える化', 'SKUごとに不足項目・\n優先度・期限を確認'],
  ['書', '証跡や書類を\nまとめて管理', 'ラベル、技術文書、\n提出物を一元化'],
  ['日', '期限切れや更新漏れ\nを防止', '重要な期限を\n一覧で把握'],
  ['✓', '初心者でも\n次の行動が分かる', 'やるべきことを\n順番に表示'],
];

const steps = [
  ['1', '箱', '商品を登録'],
  ['2', '地', '販売先の国・\nチャネルを選択'],
  ['3', '表', '不足項目を\nチェック'],
  ['4', '盾', '証跡と期限を\n管理'],
];

const checklist = [
  ['EU/UK責任者情報', '責任主体を明確にする', '最優先'],
  ['現地向けラベル表示', '表示内容の確認', '高'],
  ['安全性資料', '証跡として保存', '高'],
  ['IOSS / VAT', '税務・通関情報', '中'],
];

const pricing = [
  ['Starter', '¥29,800', 'まずは少量SKUで始めたい方向け', ['50 SKU', '2市場', '基本チェック', '期限管理'], false],
  ['Growth', '¥79,800', 'D2C・中小メーカー向け', ['250 SKU', '5市場', '提出物管理', 'チーム共有'], true],
  ['Scale', '¥198,000', '複数ブランド・支援会社向け', ['1,000 SKU', '10市場', '監査証跡', '承認フロー'], false],
] as const;

export function VisualLanding() {
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice('送信中です...');
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { ok: boolean; error?: string; lead?: { priority?: string; score?: number } };
      if (!response.ok || !result.ok) {
        setNotice(result.error ?? '送信できませんでした。入力内容をご確認ください。');
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
      <header className={styles.header}>
        <a className={styles.logo} href="#top"><span className={styles.logoMark} />PassportOS</a>
        <nav className={styles.nav} aria-label="主要ナビゲーション">
          <a href="#features">機能</a>
          <a href="#pricing">料金</a>
          <a href="#flow">導入の流れ</a>
          <a href="#diagnosis">無料診断</a>
        </nav>
        <a className={styles.headerCta} href="#diagnosis">無料診断を始める</a>
      </header>

      <section className={styles.hero} id="top">
        <div className={styles.bgCity} aria-hidden="true" />
        <div className={styles.euFlag} aria-hidden="true">✦ ✦ ✦</div>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.pill}>EU/UK向け越境販売サポート</span>
              <h1>海外販売の準備を、<br />商品ごとに一画面で。</h1>
              <p className={styles.heroLead}>EU/UK販売に必要な準備・証跡・期限管理を、初心者でも分かりやすく整理。</p>
              <p className={styles.heroText}>PassportOSは、商品ごとに「何が足りないか」「何を先にやるべきか」を見える化する越境EC向けSaaSです。出品停止や準備漏れを防ぎ、安心して海外販売を進められます。</p>
              <div className={styles.heroActions}>
                <a className={styles.primary} href="#diagnosis">○ 5分で無料診断</a>
                <a className={styles.secondary} href="#pricing">料金を見る</a>
              </div>
            </div>
            <DashboardMockup />
          </div>
        </div>
      </section>

      <section className={styles.worriesSection}>
        <div className={styles.container}>
          <h2 className={styles.centerTitle}>こんなお悩みはありませんか？</h2>
          <div className={styles.worryGrid}>{worries.map(([icon, text]) => <div className={styles.worryCard} key={text}><span>{icon}</span><p>{text}</p></div>)}</div>
        </div>
      </section>

      <section className={styles.featuresSection} id="features">
        <div className={styles.container}>
          <h2 className={styles.centerTitle}>PassportOSでできること</h2>
          <div className={styles.featureGrid}>{features.map(([icon, title, body]) => <article className={styles.featureCard} key={title}><span>{icon}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
        </div>
      </section>

      <section className={styles.flowChecklist}>
        <div className={styles.containerTwo}>
          <div id="flow">
            <h2 className={styles.leftTitle}>導入の流れ</h2>
            <div className={styles.stepRow}>{steps.map(([num, icon, text]) => <div className={styles.stepCard} key={num}><b>{num}</b><span>{icon}</span><p>{text}</p></div>)}</div>
          </div>
          <div id="checklist">
            <h2 className={styles.leftTitle}>EU/UK販売前チェックリスト</h2>
            <div className={styles.tableWrap}><table><thead><tr><th>チェック項目</th><th>内容</th><th>優先度</th></tr></thead><tbody>{checklist.map(([item, body, level]) => <tr key={item}><td>{item}</td><td>{body}</td><td className={level === '最優先' ? styles.hot : level === '中' ? styles.mid : styles.high}>{level}</td></tr>)}</tbody></table></div>
          </div>
        </div>
      </section>

      <section className={styles.pricingSection} id="pricing">
        <div className={styles.container}>
          <h2 className={styles.centerTitle}>料金プラン</h2>
          <p className={styles.priceSub}>SKU数と市場数に応じて選べる、分かりやすい料金設定</p>
          <div className={styles.priceGrid}>{pricing.map(([name, price, desc, items, recommended]) => <article className={`${styles.priceCard} ${recommended ? styles.recommended : ''}`} key={name}>{recommended && <span className={styles.recommendBadge}>おすすめ</span>}<h3>{name}</h3><strong>{price}<small> / 月</small></strong><p>{desc}</p><ul>{items.map(item => <li key={item}>✓ {item}</li>)}</ul></article>)}</div>
        </div>
      </section>

      <section className={styles.diagnosisBand} id="diagnosis">
        <div className={styles.container}>
          <div className={styles.diagnosisGrid}>
            <div className={styles.illustrationCard}><div className={styles.miniLaptop}><span /><span /><span /></div><div className={styles.plant} /></div>
            <div>
              <h2>まずは無料診断で、<br />今の準備状況を確認しませんか？</h2>
              <p>最初の一歩は、現状把握から。商品ごとの抜け漏れをシンプルに整理します。</p>
            </div>
            <form className={styles.quickForm} onSubmit={submitLead}>
              <input name="name" placeholder="お名前" required />
              <input name="email" type="email" placeholder="メールアドレス" required />
              <input name="company" placeholder="会社名・屋号" />
              <input name="markets" placeholder="例：EU / Shopify" />
              <select name="skuCount" defaultValue="1-50"><option>1-50</option><option>51-250</option><option>251-1000</option><option>1000+</option></select>
              <textarea name="message" placeholder="相談内容" />
              {notice && <div className={styles.notice}>{notice}</div>}
              <button type="submit" disabled={submitting}>{submitting ? '送信中...' : '無料診断を始める 〉'}</button>
            </form>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}><div><a href="/about">About</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div><span>© PassportOS</span></div>
      </footer>
    </main>
  );
}

function DashboardMockup() {
  return (
    <div className={styles.dashboard} aria-label="PassportOS dashboard mockup">
      <aside className={styles.sidebar}>
        <div className={styles.sideLogo}><span />PassportOS</div>
        {['ダッシュボード', '商品一覧', 'チェックリスト', '書類・証跡', '期限管理', 'チーム', '設定'].map((item, index) => <div className={`${styles.sideItem} ${index === 0 ? styles.activeSide : ''}`} key={item}>□ {item}</div>)}
        <div className={styles.userMini}>株式会社サンプル<br />山田 太郎</div>
      </aside>
      <section className={styles.dashboardMain}>
        <h3>ダッシュボード</h3>
        <div className={styles.kpiRow}>
          <div className={styles.kpi}><span>SKU Readiness</span><strong>73%</strong><i /></div>
          <div className={styles.kpi}><span>不足項目</span><strong>2件</strong></div>
          <div className={styles.kpi}><span>14日以内の期限</span><strong>4件</strong></div>
        </div>
        <div className={styles.dashBottom}>
          <div className={styles.productStatus}><b>商品別ステータス</b>{[['ハンドクリーム','HC-001','82%','1件','7日後'],['アロマオイル','AO-002','60%','2件','3日後'],['フェイスセラム','FS-003','75%','1件','10日後']].map(row => <div className={styles.productRow} key={row[0]}><span className={styles.bottle} /><p>{row[0]}<small>{row[1]}</small></p><div className={styles.bar}><em style={{width:row[2]}} /></div><strong>{row[3]}</strong><small>{row[4]}</small></div>)}</div>
          <div className={styles.requiredBox}><b>必須チェック項目</b>{['EU責任者情報', 'ラベル表示', 'IOSS/VAT', '証跡ファイル'].map((item, index) => <div className={styles.req} key={item}>{item}<span className={index < 2 ? styles.done : styles.warnIcon}>{index < 2 ? '●' : '▲'}</span></div>)}</div>
        </div>
      </section>
    </div>
  );
}
