import { NextRequest, NextResponse } from 'next/server';
import { GitHubLeadStorageService, LeadFactory, LeadNotificationService, LeadValidator } from '@/lib/leads';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = LeadValidator.validate(body);
    if (!validated.ok) {
      return NextResponse.json({ ok: false, error: validated.error }, { status: 400 });
    }

    const lead = LeadFactory.create(validated.value);
    const [storage, notification] = await Promise.allSettled([
      GitHubLeadStorageService.createIssue(lead),
      LeadNotificationService.notify(lead),
    ]);

    return NextResponse.json({
      ok: true,
      lead,
      storage: storage.status === 'fulfilled' ? storage.value : { stored: false, reason: 'Storage failed.' },
      notification: notification.status === 'fulfilled' ? notification.value : { sent: false, reason: 'Notification failed.' },
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: '送信処理に失敗しました。時間をおいて再度お試しください。' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const adminKey = process.env.ADMIN_KEY;
  const token = request.nextUrl.searchParams.get('key') || request.headers.get('x-admin-key');
  if (adminKey && token !== adminKey) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const leads = await GitHubLeadStorageService.listIssues();
  return NextResponse.json({ ok: true, leads });
}
