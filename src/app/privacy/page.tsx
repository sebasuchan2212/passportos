import styles from '../(legal)/legal.module.css';

export const metadata = {
  title: 'Privacy Policy | PassportOS',
  description: 'PassportOSのプライバシーポリシー。',
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <a className={styles.back} href="/">← PassportOS</a>
          <h1>Privacy Policy</h1>
          <p>PassportOSにおける個人情報および送信データの取り扱い方針です。</p>
        </div>
      </section>
      <section className={styles.content}>
        <div className={styles.container}>
          <article className={styles.card}>
            <h2>取得する情報</h2>
            <p>無料診断フォームでは、お名前、メールアドレス、会社名・屋号、Webサイト、対象市場、SKU数、相談内容を取得する場合があります。</p>
            <h3>利用目的</h3>
            <ul>
              <li>無料診断への返信</li>
              <li>PassportOSの改善</li>
              <li>問い合わせ対応</li>
              <li>サービス案内および商談対応</li>
            </ul>
            <h3>第三者提供</h3>
            <p>法令に基づく場合を除き、本人の同意なく第三者へ個人情報を提供しません。専門家レビューが必要な場合は、事前確認のうえで共有します。</p>
            <h3>保存期間</h3>
            <p>取得した情報は、問い合わせ対応およびサービス改善に必要な範囲で保存し、不要となった場合は適切に削除します。</p>
            <h3>お問い合わせ</h3>
            <p>個人情報の開示、訂正、削除等のご希望がある場合は、サイト運営者までお問い合わせください。</p>
          </article>
          <div className={styles.note}>本ページはMVP段階の方針です。本格運用時には、利用実態に合わせて内容を更新します。</div>
          <div className={styles.links}><a href="/about">About</a><a href="/terms">Terms</a><a href="/">Home</a></div>
        </div>
      </section>
    </main>
  );
}
