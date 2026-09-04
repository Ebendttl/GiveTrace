import { NextResponse } from 'next/server';
import { isSnowflakeConfigured, fetchSnowflakeImpactReport } from '@/lib/snowflake';

export async function GET() {
  try {
    if (!isSnowflakeConfigured()) {
      return NextResponse.json(
        {
          error: 'Snowflake transparency backend is not configured.',
          configured: false,
          summary: 'Snowflake Cortex analytics is currently unconfigured. Showing live mock transparency metrics below.',
          categoryTotals: {
            education: 9.4,
            health: 21.5,
            climate: 18.2,
            poverty: 23.0,
            'disability-support': 6.8,
          },
        },
        { status: 503 }
      );
    }

    const report = await fetchSnowflakeImpactReport();
    return NextResponse.json({ configured: true, ...report });
  } catch (error: any) {
    console.error('Error in /api/impact-report:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch Snowflake impact report', configured: false },
      { status: 500 }
    );
  }
}
