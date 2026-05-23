# PassportOS Production DB Plan

PassportOSの本番化で追加するDB設計メモです。

## 推奨スタック

- Auth: Auth.js
- Database: Neon Postgres
- File Storage: Vercel Blob
- Billing: Stripe Billing
- Email: Resend

## Core Tables

### workspaces
- id
- name
- plan
- created_at

### users
- id
- email
- name
- created_at

### workspace_members
- workspace_id
- user_id
- role

### sku_passports
- id
- workspace_id
- name
- sku_code
- category
- origin_country
- target_market
- sales_channel
- readiness_score
- created_at
- updated_at

### requirements
- id
- passport_id
- title
- description
- status
- risk
- due_date
- source_name
- source_url
- action_label

### evidence_files
- id
- requirement_id
- file_name
- file_url
- evidence_type
- version
- note
- uploaded_by
- uploaded_at

### leads
- id
- company
- name
- email
- website
- monthly_sku
- target_market
- message
- purpose
- created_at

### billing_customers
- id
- workspace_id
- stripe_customer_id
- stripe_subscription_id
- plan
- status
- current_period_end

## Migration Policy

MVPはlocalStorageで動作します。本番化では、現在のPassportDTOをsku_passports、requirements、evidence_filesへ分解して保存します。

## Safety Policy

PassportOSは法的助言の最終判断を自動化しません。根拠、証跡、期限、担当者、専門家レビュー履歴を保存する業務OSとして運用します。
