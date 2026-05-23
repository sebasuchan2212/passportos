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

export function PassportApp() {
  const [passports, setPassports] = useState<PassportDTO[]>(() => PassportStorage.load());
  const [selectedId, setSelectedId] = useState(passports[0]?.id ?? '');
  const [form, setForm] = useState<SkuInput>(initialForm);
  const [message, setMessage] = useState('');
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

  return (
    <main>
      <Hero />
      <section className="container appShell" id="demo">
        <aside className="sidebar card" aria-label="SKU一覧">
          <div className="sideHead">
            <span className="badge">Workspace</span>
            <button className="btn ghost small" onClick={reset}>Reset</button>
          </div>
          <h2>Launch Control</h2>
          <p>EU/UK向けに販売するSKUを、必要物・期限・証跡単位で管理します。</p>
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
    </main>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="container heroGrid">
        <div>
          <span className="badge">Japan-first RegOps SaaS MVP</span>
          <h1>SKUごとに、<br />海外販売の「止まるリスク」を見える化する。</h1>
          <p className="lead">PassportOSは、EU/UK向け越境ECの責任者情報、ラベル、IOSS/VAT、証跡、期限を一つのLaunch Packに統合する業務OSです。</p>
          <div className="heroActions">
            <a className="btn" href="#demo">MVPを操作する</a>
            <a className="btn secondary" href="#architecture">設計を見る</a>
          </div>
        </div>
        <div className="heroPanel card" aria-label="リスク概要">
          <div className="riskOrbit"><span>GPSR</span><span>IOSS</span><span>Evidence</span><span>Deadline</span></div>
          <h3>Launch Readiness</h3>
          <p>販売可否・不足項目・提出証跡・期限をSKU単位で追跡。</p>
        </div>
      </div>
    </section>
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
        <div className="score"><strong>{passport.summary.readinessScore}%</strong><span>準備率</span></div>
      </div>
      <div className="actionBar">
        <button className="btn" onClick={onExport}>Launch Pack JSONを書き出す</button>
        <span className="legalNote">※本MVPは業務管理用です。最終的な法的判断は専門家レビュー前提。</span>
      </div>
      <div className="tableWrap">
        <table>
          <thead><tr><th>要件</th><th>状態</th><th>リスク</th><th>期限</th><th>根拠</th><th>操作</th></tr></thead>
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
      <div><span className="badge">New SKU</span><h2>SKUパスポートを作成</h2></div>
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
