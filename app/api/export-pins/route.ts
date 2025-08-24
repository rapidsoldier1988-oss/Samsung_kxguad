import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real application, you'd fetch from a database
    const pins: any[] = []; // This would be fetched from your data source
    
    const header = ['pin', 'timestamp', 'user_agent', 'ip', 'created_at'];
    const rows = pins.map(p => [
      `"${String(p.pin || '').replace(/"/g, '""')}"`,
      p.ts || '',
      `"${String(p.ua || '').replace(/"/g, '""')}"`,
      p.ip || '',
      p.createdAt || ''
    ]);
    
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="kxguard_pins_export.csv"',
      },
    });
    
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
