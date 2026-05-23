import { GitHubLeadStorageService } from '@/lib/leads';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = searchParams ? await searchParams : {};
  const key = Array.isArray(params.key) ? params.key[0] : params.key;
  const adminKey = process.env.ADMIN_KEY;
  const isConfigured = Boolean(adminKey);
  const isAuthorized = isConfigured && key === adminKey;
  const leads = isAuthorized ? await GitHubLeadStorageService.listIssues() : [];
  const total = leads.length;
  const high = leads.filter((lead) => lead.priority === 'high').length;
  const newCount = leads.filter((lead) => lead.status === 'new').length;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <a href="/" className={styles.back}>← PassportOS</a>
          <h1>無料診断リード管理</h1>
          <p>フォーム送信された無料診断リードを確認する管理画面です。</p>
        </div>
      </header>

      {!isConfigured && (
        <section className={styles.setup}>
          <h2>管理画面はまだ保護設定が未完了です</h2>
          <p>リード情報を安全に扱うため、VercelでADMIN_KEYを設定すると一覧表示を有効化できます。</p>
          <code>ADMIN_KEY=任意の管理用キー</code>
        </section>
      )}

      {isConfigured && !isAuthorized && (
        <section className={styles.setup}>
          <h2>管理キーを入力してください</h2>
          <p>URLの末尾に <code>?key=設定したADMIN_KEY</code> を付けてアクセスしてください。</p>
          <code>https://passportos-jet.vercel.app/admin?key=YOUR_ADMIN_KEY</code>
        </section>
      )}

      {isAuthorized && (
        <>
          <section className={styles.kpis}>
            <div><span>総リード</span><strong>{total}</strong></div>
            <div><span>未対応</span><strong>{newCount}</strong></div>
            <div><span>高優先度</span><strong>{high}</strong></div>
          </section>

          <section className={styles.setup}>
            <h2>本番運用に必要な環境変数</h2>
            <p>VercelのProject Settings → Environment Variables に設定してください。</p>
            <code>GITHUB_LEADS_TOKEN</code>
            <code>GITHUB_LEADS_REPO=sebasuchan2212/passportos</code>
            <code>RESEND_API_KEY</code>
            <code>LEAD_NOTIFY_TO=sebasuchan0402@gmail.com</code>
            <code>LEAD_NOTIFY_FROM=PassportOS &lt;onboarding@resend.dev&gt;</code>
            <code>ADMIN_KEY=任意の管理用キー</code>
          </section>

          <section className={styles.tableCard}>
            <h2>リード一覧</h2>
            {leads.length === 0 ? (
              <div className={styles.empty}>
                <strong>まだGitHub Issue連携リードはありません。</strong>
                <p>フォーム送信自体はAPI化済みです。GITHUB_LEADS_TOKENを設定すると、GitHub Issue保存とメール通知が有効になります。</p>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table>
                  <thead><tr><th>会社/名前</th><th>メール</th><th>市場</th><th>SKU</th><th>優先度</th><th>スコア</th><th>作成日</th></tr></thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td><strong>{lead.company || lead.name}</strong><small>{lead.name}</small></td>
                        <td>{lead.email || '-'}</td>
                        <td>{lead.markets || '-'}</td>
                        <td>{lead.skuCount || '-'}</td>
                        <td><span className={`${styles.badge} ${styles[lead.priority]}`}>{lead.priority}</span></td>
                        <td>{lead.score}</td>
                        <td>{new Date(lead.createdAt).toLocaleString('ja-JP')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
