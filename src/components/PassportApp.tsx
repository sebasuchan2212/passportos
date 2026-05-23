'use client';

import { useMemo, useState } from 'react';
import { PassportAnalyticsService, PassportService } from '@/services/PassportService';
import { PassportStorage } from '@/utils/storage';
import type { EvidenceType, PassportDTO, ProductCategory, SalesChannel, MarketCode, SkuInput } from '@/types/passport';

const service = new PassportService();
const analytics = new PassportAnalyticsService();

const categoryLabel: Record<ProductCategory, string> = {
  cosmetics: '化粧品', electronics: '電子機器', food: '食品', apparel: 'アパレル', general: '一般雑貨',
};

const statusLabel = { complete: '完了', missing: '不足', review: '要レビュー', blocked: '販売停止リスク' } as const;
const riskLabel = { low: '低', medium: '中', high: '高', critical: '重大' } as const;

const initialForm: SkuInput = {
  name: '', skuCode: '', category: 'general', originCountry: 'Japan', targetMarket: 'EU', channel: 'Shopify',
  hasResponsiblePerson: false, hasSafetyDocumentation: false, hasLocalizedLabel: false, hasIossOrVat: false, hasTraceabilityInfo: false,
};

type LeadForm = {
  company: string;
  name: string;
  email: string;
  website: string;
  monthlySku: string;
  targetMarket: string;
  message: string;
};

const initialLeadForm: LeadForm = {
  company: '',
  name: '',
  email: '',
  website: '',
  monthlySku: '1-50',
  targetMarket: 'EU/UK',
  message: '',
};

export function PassportApp() {
  const [passports, setPassports] = useState<PassportDTO[]>(() => PassportStorage.load());
  const [selectedId, setSelectedId] = useState(passports[0]?.id ?? '');
  const [form, setForm] = useState<SkuInput>(initialForm);
  const [leadForm, setLeadForm] = useState<LeadForm>(initialLeadForm);
  const [message, setMessage] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const selected = passports.find((item) => item.id === selectedId) ?? passports[0];
  const portfolio = useMemo(() => analytics.calculatePortfolio(passports), [passports]);

  const persist = (next: PassportDTO[]) => {
    setPassports(next);
    PassportStorage.save(next);
  };

  const createSku = () => {
    const result = service.createPassport(form);
    if (!result.ok || !result.value) {
      setMessage(result.error ?? '登録できませんでした。');
      return;
    }
    const next = [result.value, ...passports];
    persist(next);
    setSelectedId(result.value.id);
    setForm(initialForm);
    setMessage('SKUパスポートを作成しました。');
  };

  const addEvidence = (requirementId: string) => {
    if (!selected) return;
    const requirement = selected.requirements.find((item) => item.id === requirementId);
    const type: EvidenceType = requirement?.title.includes('ラベル') ? 'label' : requirement?.title.includes('責任者') ? 'responsiblePerson' : 'document';
    const result = service.addEvidence(selected, requirementId, type, `${selected.sku.skuCode}-${requirement?.title ?? 'evidence'}.pdf`, 'デモ証跡として追加');
    if (!result.ok || !result.value) {
      setMessage(result.error ?? '証跡を追加できませんでした。');
      return;
    }
    const next = passports.map((item) => item.id === selected.id ? result.value! : item);
    persist(next);
    setMessage('証跡を追加し、対象要件をレビュー待ちにしました。');
  };

  const exportPack = () => {
    if (!selected) return;
    const blob = new Blob([service.exportLaunchPack(selected)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selected.sku.skuCode}-launch-pack.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    const seed = PassportStorage.reset();
    setPassports(seed);
    setSelectedId(seed[0]?.id ?? '');
    setMessage('デモデータを初期化しました。');
  };

  const submitLead = (purpose: 'diagnosis' | 'waitlist') => {
    if (!leadForm.name || !leadForm.email) {
      setLeadMessage('お名前とメールアドレスを入力してください。');
      return;
    }
    const saved = JSON.parse(window.localStorage.getItem('passportos-leads') ?? '[]') as Array<LeadForm & { id: string; purpose: string; createdAt: string }>;
    saved.unshift({ ...leadForm, id: crypto.randomUUID(), purpose, createdAt: new Date().toISOString() });
    window.localStorage.setItem('passportos-leads', JSON.stringify(saved.slice(0, 30)));
    setLeadMessage(purpose === 'diagnosis' ? '無料診断リクエストを保存しました。次の本番化でDB・メール通知に接続できます。' : '事前登録を受け付けました。');
    setLeadForm(initialLeadForm);
  };

  return (
    <main>
      <TopNav />
      <Hero />
      <CommercialSections />
      <section className="container appShell" id="demo">
        <aside className="sidebar card" aria-label="SKU一覧">
          <div className="sideHead">
            <span className="badge">Live MVP</span>
            <button className="btn ghost small" onClick={reset}>Reset</button>
          </div>
          <h2>商品別リスク管理</h2>
          <p>EU/UK向けに販売する商品を、必要書類・期限・証跡単位で管理します。</p>
          <div className="skuList">
            {passports.map((passport) => (
              <button key={passport.id} className={`skuItem ${passport.id === selected?.id ? 'active' : ''}`} onClick={() => setSelectedId(passport.id)}>
                <strong>{passport.sku.name}</strong>
                <span>{passport.sku.skuCode} · {passport.sku.targetMarket} · {passport.sku.channel}</span>
                <meter min={0} max={100} value={passport.summary.readinessScore} aria-label="準備率" />
              </button>
            ))}
          </div>
        </aside>

        <section className="workspace">
          <DashboardCards total={portfolio.total} readiness={portfolio.averageReadiness} blocked={portfolio.blocked} dueSoon={portfolio.dueSoon} />
          {message && <div className="notice" role="status">{message}</div>}
          {selected && <PassportDetail passport={selected} onAddEvidence={addEvidence} onExport={exportPack} />}
          <SkuForm form={form} onChange={setForm} onCreate={createSku} />
        </section>
      </section>
      <LeadSection leadForm={leadForm} setLeadForm={setLeadForm} leadMessage={leadMessage} onSubmit={submitLead} />
      <PricingSection />
      <ArchitectureSection />
    </main>
  );
}

function TopNav() {
  return (
    <header className="topNav">
      <a className="brand" href="#top" aria-label="PassportOS home"><span>Passport</span>OS</a>
      <nav>
        <a href="#demo">デモ</a>
        <a href="#diagnosis">無料診断</a>
        <a href="#pricing">料金</a>
        <a href="#architecture">本番化</a>
      </nav>
      <a className="btn small" href="#diagnosis">事前登録</a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container heroGrid">
        <div>
          <span className="badge darkBadge">越境ECの出品停止を防ぐ 商品別チェックSaaS</span>
          <h1>海外販売の準備を、<br />商品ごとに一画面で。</h1>
          <p className="lead">PassportOSは、EU/UKに商品を売る前に必要な「責任者情報・ラベル表示・証跡書類・IOSS/VAT・更新期限」をまとめて管理する、越境EC向けRegOpsプラットフォームです。</p>
          <div className="heroActions">
            <a className="btn" href="#diagnosis">無料で販売準備を診断する</a>
            <a className="btn secondary" href="#demo">デモを操作する</a>
          </div>
          <div className="heroProof">
            <span>SKU単位</span><span>EU/UK対応</span><span>証跡管理</span><span>期限通知</span><span>Stripe課金準備</span>
          </div>
        </div>
        <div className="heroPanel card" aria-label="PassportOS dashboard preview">
          <div className="panelTop"><span>Launch Readiness</span><strong>73%</strong></div>
          <div className="riskOrbit"><span>責任者</span><span>ラベル</span><span>証跡</span><span>期限</span></div>
          <h3>「売れるか」より先に、<br />「止まらず売れるか」を確認。</h3>
          <p>商品・国・販売チャネルごとに、足りない準備を可視化します。</p>
        </div>
      </div>
    </section>
  );
}

function CommercialSections() {
  const problems = [
    ['出品停止リスク', 'モール規約や現地規制の見落としで、突然リスティングが止まる。'],
    ['書類が分散', 'Drive、メール、Excel、税理士資料が散らばり、提出時に探せない。'],
    ['期限管理が属人化', '更新日、ラベル修正、証跡差し替えが担当者の記憶に依存する。'],
  ];
  const benefits = [
    ['一般向けにわかる', '「この商品は何が足りないか」を非専門家でも判断できるUI。'],
    ['専門家にも渡せる', '根拠URL、証跡、期限、変更履歴をLaunch Packとして整理。'],
    ['継続課金に向く', 'SKU・市場・期限が増えるほど価値が上がる業務基盤。'],
  ];
  return (
    <>
      <section className="container splitSection">
        <div>
          <span className="badge">Why now</span>
          <h2>越境ECで本当に怖いのは、売れないことではなく「売れ始めてから止まること」です。</h2>
          <p>PassportOSは、海外販売の面倒な確認作業を「商品別パスポート」に変換します。専門用語に詳しくない担当者でも、次に何をすべきかが分かります。</p>
        </div>
        <div className="cards3">{problems.map(([title, body]) => <div className="miniCard" key={title}><strong>{title}</strong><span>{body}</span></div>)}</div>
      </section>
      <section className="container valueGrid">
        {benefits.map(([title, body]) => <div className="card valueCard" key={title}><span className="badge">Value</span><h3>{title}</h3><p>{body}</p></div>)}
      </section>
    </>
  );
}

function DashboardCards(props: { total: number; readiness: number; blocked: number; dueSoon: number }) {
  const cards = [
    ['登録SKU', props.total.toString(), '管理対象の商品数'],
    ['平均準備率', `${props.readiness}%`, '完了要件ベース'],
    ['重大リスク', props.blocked.toString(), '責任者・安全性など'],
    ['14日以内期限', props.dueSoon.toString(), '未完了タスク'],
  ];
  return <div className="kpiGrid">{cards.map(([label, value, hint]) => <div className="kpi card" key={label}><span>{label}</span><strong>{value}</strong><small>{hint}</small></div>)}</div>;
}

function PassportDetail({ passport, onAddEvidence, onExport }: { passport: PassportDTO; onAddEvidence: (id: string) => void; onExport: () => void }) {
  const latest = analytics.getLatestEvidence(passport);
  return (
    <article className="card detail">
      <div className="detailHead">
        <div>
          <span className="badge">{categoryLabel[passport.sku.category]} · {passport.sku.targetMarket} · {passport.sku.channel}</span>
          <h2>{passport.sku.name}</h2>
          <p>{passport.sku.skuCode} / Origin: {passport.sku.originCountry}</p>
        </div>
        <div className="score"><strong>{passport.summary.readinessScore}%</strong><span>販売準備率</span></div>
      </div>
      <div className="actionBar">
        <button className="btn" onClick={onExport}>Launch Pack JSONを書き出す</button>
        <span className="legalNote">※業務管理用MVPです。最終的な法的判断は専門家レビューを前提にしてください。</span>
      </div>
      <div className="tableWrap">
        <table>
          <thead><tr><th>必要な準備</th><th>状態</th><th>リスク</th><th>期限</th><th>根拠</th><th>次のアクション</th></tr></thead>
          <tbody>
            {passport.requirements.map((req) => (
              <tr key={req.id}>
                <td><strong>{req.title}</strong><span>{req.description}</span></td>
                <td className={`status-${req.status}`}>{statusLabel[req.status]}</td>
                <td>{riskLabel[req.risk]}</td>
                <td>{new Intl.DateTimeFormat('ja-JP', { month: 'short', day: 'numeric' }).format(new Date(req.dueDate))}</td>
                <td><a href={req.sourceUrl} target="_blank" rel="noreferrer">{req.sourceName}</a></td>
                <td><button className="btn secondary small" onClick={() => onAddEvidence(req.id)}>{req.actionLabel}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="timeline">
        <h3>Evidence Timeline</h3>
        {latest.length === 0 ? <p>まだ証跡はありません。上の要件からデモ証跡を追加できます。</p> : latest.map((ev) => <div className="timelineItem" key={ev.id}><strong>v{ev.version} · {ev.fileName}</strong><span>{ev.type} / {new Date(ev.uploadedAt).toLocaleString('ja-JP')} / {ev.note}</span></div>)}
      </section>
    </article>
  );
}

function SkuForm({ form, onChange, onCreate }: { form: SkuInput; onChange: (next: SkuInput) => void; onCreate: () => void }) {
  const set = <K extends keyof SkuInput>(key: K, value: SkuInput[K]) => onChange({ ...form, [key]: value });
  const flags: Array<[keyof SkuInput, string]> = [
    ['hasResponsiblePerson', '責任者情報あり'], ['hasSafetyDocumentation', '安全性資料あり'], ['hasLocalizedLabel', '現地ラベルあり'], ['hasIossOrVat', 'IOSS/VATあり'], ['hasTraceabilityInfo', '追跡情報あり'],
  ];
  return (
    <section className="card formCard">
      <div><span className="badge">Free checker</span><h2>商品パスポートを作成</h2><p>商品名と販売先を入れると、足りない準備を自動で整理します。</p></div>
      <div className="formGrid">
        <label>商品名<input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="例：Smart Kitchen Timer" /></label>
        <label>SKUコード<input value={form.skuCode} onChange={(e) => set('skuCode', e.target.value)} placeholder="例：JP-ELC-001" /></label>
        <label>カテゴリ<select value={form.category} onChange={(e) => set('category', e.target.value as ProductCategory)}><option value="general">一般雑貨</option><option value="electronics">電子機器</option><option value="cosmetics">化粧品</option><option value="food">食品</option><option value="apparel">アパレル</option></select></label>
        <label>市場<select value={form.targetMarket} onChange={(e) => set('targetMarket', e.target.value as MarketCode)}><option value="EU">EU</option><option value="UK">UK</option></select></label>
        <label>チャネル<select value={form.channel} onChange={(e) => set('channel', e.target.value as SalesChannel)}><option value="Shopify">Shopify</option><option value="Amazon">Amazon</option><option value="eBay">eBay</option><option value="OwnStore">自社EC</option></select></label>
        <label>原産国<input value={form.originCountry} onChange={(e) => set('originCountry', e.target.value)} /></label>
      </div>
      <div className="checkGrid">{flags.map(([key, label]) => <label key={key as string} className="check"><input type="checkbox" checked={Boolean(form[key])} onChange={(e) => set(key, e.target.checked as never)} />{label}</label>)}</div>
      <button className="btn" onClick={onCreate}>不足要件を自動生成</button>
    </section>
  );
}

function LeadSection({ leadForm, setLeadForm, leadMessage, onSubmit }: { leadForm: LeadForm; setLeadForm: (next: LeadForm) => void; leadMessage: string; onSubmit: (purpose: 'diagnosis' | 'waitlist') => void }) {
  const set = <K extends keyof LeadForm>(key: K, value: LeadForm[K]) => setLeadForm({ ...leadForm, [key]: value });
  return (
    <section className="leadSection" id="diagnosis">
      <div className="container leadGrid">
        <div>
          <span className="badge darkBadge">無料診断・事前登録</span>
          <h2>まずは1商品だけ、海外販売の準備不足を無料で見える化。</h2>
          <p>本番版では、ここからDB保存、メール通知、専門家レビュー、Stripe課金へ接続します。現在はMVPとしてブラウザ内に安全保存します。</p>
          <ul className="checkList"><li>商品ごとの不足項目を整理</li><li>販売停止につながる重大リスクを確認</li><li>有料プラン導入前の事前相談に対応</li></ul>
        </div>
        <form className="card leadForm" onSubmit={(e) => { e.preventDefault(); onSubmit('diagnosis'); }}>
          <label>会社名・屋号<input value={leadForm.company} onChange={(e) => set('company', e.target.value)} placeholder="例：TOSHIMA Trading" /></label>
          <label>お名前<input value={leadForm.name} onChange={(e) => set('name', e.target.value)} placeholder="例：戸島 龍司" /></label>
          <label>メールアドレス<input type="email" value={leadForm.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" /></label>
          <label>Webサイト・販売ページ<input value={leadForm.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" /></label>
          <div className="formGrid two">
            <label>SKU数<select value={leadForm.monthlySku} onChange={(e) => set('monthlySku', e.target.value)}><option>1-50</option><option>51-250</option><option>251-1000</option><option>1000+</option></select></label>
            <label>販売予定市場<select value={leadForm.targetMarket} onChange={(e) => set('targetMarket', e.target.value)}><option>EU/UK</option><option>EU</option><option>UK</option><option>US</option><option>Global</option></select></label>
          </div>
          <label>相談内容<textarea value={leadForm.message} onChange={(e) => set('message', e.target.value)} placeholder="例：ShopifyでEU向けに販売予定。ラベルと責任者情報が不安。" /></label>
          {leadMessage && <div className="notice">{leadMessage}</div>}
          <div className="leadActions"><button className="btn" type="submit">無料診断を依頼する</button><button className="btn secondary" type="button" onClick={() => onSubmit('waitlist')}>事前登録する</button></div>
        </form>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    ['Starter', '¥29,800', '少量SKUの越境テスト', ['50 SKU', '2市場', '基本チェック', '期限管理']],
    ['Growth', '¥79,800', 'D2C・中小メーカー向け', ['250 SKU', '5市場', '提出物生成', 'チーム権限']],
    ['Scale', '¥198,000', '支援会社・複数ブランド向け', ['1,000 SKU', '10市場', '監査証跡', '承認フロー']],
  ];
  return (
    <section className="container pricing" id="pricing">
      <div className="sectionHead"><span className="badge">Pricing ready</span><h2>Stripe課金を前提にした料金設計</h2><p>本番化時はStripe Billingに接続し、SKU数・市場数に応じた継続課金へ移行できます。</p></div>
      <div className="priceGrid">{plans.map(([name, price, desc, items]) => <div className="card priceCard" key={name as string}><h3>{name}</h3><strong>{price}<small>/月</small></strong><p>{desc as string}</p><ul>{(items as string[]).map((item) => <li key={item}>{item}</li>)}</ul><a className="btn secondary" href="#diagnosis">このプランで相談</a></div>)}</div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section className="architecture" id="architecture">
      <div className="container archGrid">
        <div>
          <span className="badge darkBadge">Production ready path</span>
          <h2>本番用DB化までの土台を用意済み。</h2>
          <p>現在はMVPとしてlocalStorageで動作します。次フェーズでは、認証、Postgres、証跡ファイル、Stripe、メール通知へ段階的に接続できます。</p>
        </div>
        <div className="archSteps">
          <div><strong>01</strong><span>Auth.jsでログイン・組織管理</span></div>
          <div><strong>02</strong><span>Neon PostgresでSKU・証跡・期限を保存</span></div>
          <div><strong>03</strong><span>Vercel Blobで提出書類を保管</span></div>
          <div><strong>04</strong><span>Stripe Billingで月額課金</span></div>
          <div><strong>05</strong><span>Resendで診断依頼・期限通知</span></div>
        </div>
      </div>
    </section>
  );
}
