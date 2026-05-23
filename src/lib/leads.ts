export type LeadStatus = 'new' | 'replied' | 'qualified' | 'lost' | 'paid';

export type LeadInput = {
  name: string;
  email: string;
  company?: string;
  markets?: string;
  skuCount?: string;
  website?: string;
  message?: string;
};

export type LeadRecord = LeadInput & {
  id: string;
  status: LeadStatus;
  score: number;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  source: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class LeadValidator {
  static validate(input: Partial<LeadInput>): { ok: true; value: LeadInput } | { ok: false; error: string } {
    const name = String(input.name ?? '').trim();
    const email = String(input.email ?? '').trim().toLowerCase();
    if (name.length < 2) return { ok: false, error: 'お名前を2文字以上で入力してください。' };
    if (!EMAIL_PATTERN.test(email)) return { ok: false, error: '有効なメールアドレスを入力してください。' };
    return {
      ok: true,
      value: {
        name,
        email,
        company: String(input.company ?? '').trim(),
        markets: String(input.markets ?? '').trim(),
        skuCount: String(input.skuCount ?? '').trim(),
        website: String(input.website ?? '').trim(),
        message: String(input.message ?? '').trim(),
      },
    };
  }
}

export class LeadScoringService {
  static score(input: LeadInput): Pick<LeadRecord, 'score' | 'priority'> {
    let score = 30;
    const sku = input.skuCount ?? '';
    if (sku.includes('51')) score += 15;
    if (sku.includes('251') || sku.includes('1000')) score += 30;
    if ((input.markets ?? '').toLowerCase().includes('eu')) score += 15;
    if ((input.markets ?? '').toLowerCase().includes('uk')) score += 10;
    if (input.company) score += 10;
    if (input.website) score += 10;
    if ((input.message ?? '').length > 30) score += 10;
    const normalized = Math.min(score, 100);
    return { score: normalized, priority: normalized >= 75 ? 'high' : normalized >= 50 ? 'medium' : 'low' };
  }
}

export class LeadFactory {
  static create(input: LeadInput): LeadRecord {
    const scored = LeadScoringService.score(input);
    return {
      ...input,
      id: crypto.randomUUID(),
      status: 'new',
      createdAt: new Date().toISOString(),
      source: 'passportos-free-check',
      ...scored,
    };
  }
}

export class LeadNotificationService {
  static async notify(lead: LeadRecord): Promise<{ sent: boolean; reason?: string }> {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_NOTIFY_TO || 'sebasuchan0402@gmail.com';
    const from = process.env.LEAD_NOTIFY_FROM || 'PassportOS <onboarding@resend.dev>';
    if (!apiKey) return { sent: false, reason: 'RESEND_API_KEY is not configured.' };

    const body = [
      `新しい無料診断リードが届きました。`,
      ``,
      `会社名: ${lead.company || '-'}`,
      `名前: ${lead.name}`,
      `メール: ${lead.email}`,
      `Webサイト: ${lead.website || '-'}`,
      `SKU数: ${lead.skuCount || '-'}`,
      `対象市場: ${lead.markets || '-'}`,
      `優先度: ${lead.priority}`,
      `スコア: ${lead.score}`,
      `相談内容: ${lead.message || '-'}`,
      ``,
      `管理画面: https://passportos-jet.vercel.app/admin`,
    ].join('\n');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: `【PassportOS】無料診断リード: ${lead.company || lead.name}`,
        text: body,
      }),
    });

    if (!response.ok) {
      return { sent: false, reason: `Resend API error: ${response.status}` };
    }
    return { sent: true };
  }
}

export class GitHubLeadStorageService {
  static async createIssue(lead: LeadRecord): Promise<{ stored: boolean; url?: string; reason?: string }> {
    const token = process.env.GITHUB_LEADS_TOKEN;
    const repo = process.env.GITHUB_LEADS_REPO || 'sebasuchan2212/passportos';
    if (!token) return { stored: false, reason: 'GITHUB_LEADS_TOKEN is not configured.' };

    const body = [
      `## Lead`,
      `- ID: ${lead.id}`,
      `- Status: ${lead.status}`,
      `- Priority: ${lead.priority}`,
      `- Score: ${lead.score}`,
      `- Company: ${lead.company || '-'}`,
      `- Name: ${lead.name}`,
      `- Email: ${lead.email}`,
      `- Website: ${lead.website || '-'}`,
      `- SKU Count: ${lead.skuCount || '-'}`,
      `- Markets: ${lead.markets || '-'}`,
      `- Created At: ${lead.createdAt}`,
      ``,
      `## Message`,
      lead.message || '-',
    ].join('\n');

    const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `[Lead] ${lead.company || lead.name} - ${lead.markets || 'market unknown'}`,
        body,
        labels: ['passportos-lead', `priority:${lead.priority}`, `status:${lead.status}`],
      }),
    });

    if (!response.ok) return { stored: false, reason: `GitHub API error: ${response.status}` };
    const data = await response.json() as { html_url?: string };
    return { stored: true, url: data.html_url };
  }

  static async listIssues(): Promise<LeadRecord[]> {
    const token = process.env.GITHUB_LEADS_TOKEN;
    const repo = process.env.GITHUB_LEADS_REPO || 'sebasuchan2212/passportos';
    if (!token) return [];
    const response = await fetch(`https://api.github.com/repos/${repo}/issues?labels=passportos-lead&state=open&per_page=50`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const issues = await response.json() as Array<{ number: number; title: string; body?: string; created_at: string; html_url: string; labels?: Array<{ name: string }> }>;
    return issues.map((issue) => {
      const body = issue.body ?? '';
      const pick = (label: string) => body.match(new RegExp(`${label}: (.*)`))?.[1]?.trim() ?? '';
      const priority = (issue.labels?.find((label) => label.name.startsWith('priority:'))?.name.split(':')[1] ?? 'medium') as LeadRecord['priority'];
      const status = (issue.labels?.find((label) => label.name.startsWith('status:'))?.name.split(':')[1] ?? 'new') as LeadStatus;
      return {
        id: `issue-${issue.number}`,
        name: pick('Name') || issue.title,
        email: pick('Email'),
        company: pick('Company'),
        markets: pick('Markets'),
        skuCount: pick('SKU Count'),
        website: pick('Website'),
        message: body.split('## Message')[1]?.trim() ?? '',
        createdAt: issue.created_at,
        source: issue.html_url,
        score: Number(pick('Score')) || 0,
        priority,
        status,
      };
    });
  }
}
