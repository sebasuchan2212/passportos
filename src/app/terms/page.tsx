import styles from '../(legal)/legal.module.css';

export const metadata = {
  title: 'Terms of Use | PassportOS',
  description: 'PassportOSの利用規約。',
};

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <a className={styles.back} href="/">← PassportOS</a>
          <h1>Terms of Use</h1>
          <p>PassportOSの利用条件と免責事項です。</p>
        </div>
      </section>
      <section className={styles.content}>
        <div className={styles.container}>
          <article className={styles.card}>
            <h2>サービスの位置づけ</h2>
            <p>PassportOSは、越境ECにおける販売準備、証跡管理、期限管理、チェックリスト整理を支援する業務管理ツールです。</p>
            <h3>法的助言ではありません</h3>
            <p>PassportOSが表示する内容は、法的助言、税務助言、認証取得の保証、モール審査通過の保証ではありません。最終判断は、利用者自身または専門家の確認に基づいて行ってください。</p>
            <h3>禁止事項</h3>
            <ul>
              <li>虚偽情報の送信</li>
              <li>第三者の権利を侵害する利用</li>
              <li>不正アクセス、過度な負荷、リバースエンジニアリング</li>
              <li>法令または公序良俗に反する利用</li>
            </ul>
            <h3>免責</h3>
            <p>利用者がPassportOSの情報を参考に行った販売、申請、出品、通関、税務、表示等の結果について、運営者は法令上許される範囲で責任を負いません。</p>
            <h3>規約の変更</h3>
            <p>本規約は、サービス改善や法令変更に応じて更新されることがあります。</p>
          </article>
          <div className={styles.note}>本ページはMVP段階の利用規約です。本格運用時には、事業形態・提供範囲・課金方式に合わせて改定します。</div>
          <div className={styles.links}><a href="/about">About</a><a href="/privacy">Privacy</a><a href="/">Home</a></div>
        </div>
      </section>
    </main>
  );
}
