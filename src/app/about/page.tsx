import styles from '../(legal)/legal.module.css';

export const metadata = {
  title: 'About | PassportOS',
  description: 'PassportOSが目指す、越境ECの販売準備を商品ごとに見える化する理由。',
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <a className={styles.back} href="/">← PassportOS</a>
          <h1>日本の商品を、海外で止めずに売るために。</h1>
          <p>PassportOSは、越境ECで発生する規制確認・証跡保管・期限管理を、商品単位で整理する業務OSです。</p>
        </div>
      </section>
      <section className={styles.content}>
        <div className={styles.container}>
          <article className={styles.card}>
            <h2>なぜ作るのか</h2>
            <p>日本企業が海外販売でつまずく理由は、商品力だけではありません。販売先の国、モール、商品カテゴリごとに必要な表示・証跡・税務・期限が異なり、それらがメール、Excel、Drive、専門家資料に分散してしまうことが大きな課題です。</p>
            <p>PassportOSは、この分散した作業を「この商品は何が足りないか」という形に変換し、担当者が次の一手を判断しやすくすることを目的としています。</p>
          </article>
          <article className={styles.card}>
            <h2>提供価値</h2>
            <ul>
              <li>SKUごとの販売準備状況を一画面で把握</li>
              <li>EU/UK責任者情報、ラベル、証跡、IOSS/VAT、期限を整理</li>
              <li>社内・専門家・支援会社に渡せるLaunch Pack化</li>
              <li>出品停止や提出漏れにつながるリスクを早期に発見</li>
            </ul>
          </article>
          <div className={styles.note}>PassportOSは法的助言の最終判断を自動化するものではありません。必要な作業・証跡・期限・根拠を整理する業務管理SaaSとして設計しています。</div>
          <div className={styles.links}><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/admin">Admin</a></div>
        </div>
      </section>
    </main>
  );
}
