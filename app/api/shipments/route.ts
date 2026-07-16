import { NextRequest, NextResponse } from 'next/server';
import { createShipment, findShipmentByTrackingNumber, getShipments } from '@/app/lib/shipments';

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const trackingNumber = url.searchParams.get('trackingNumber')?.trim();

  if (trackingNumber) {
    const shipment = findShipmentByTrackingNumber(trackingNumber);
    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    return NextResponse.json(shipment);
  }

  // Search / filter / pagination support
  const q = url.searchParams.get('q')?.trim() || '';
  const status = url.searchParams.get('status')?.trim() || '';
  const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
  const pageSize = Math.max(1, Number(url.searchParams.get('pageSize') || '20'));

  let items = getShipments();

  if (q) {
    const qLower = q.toLowerCase();
    items = items.filter(
      (s) =>
        s.trackingNumber.toLowerCase().includes(qLower) || s.customer.toLowerCase().includes(qLower),
    );
  }

  if (status) {
    items = items.filter((s) => s.status === status);
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paged = items.slice(start, end);

  return NextResponse.json({ items: paged, total, page, pageSize });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const customer = String(body.customer ?? '').trim();
  const destination = String(body.destination ?? '').trim();

  if (!customer) {
    return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
  }

  const shipment = createShipment(customer, destination);
  return NextResponse.json(shipment, { status: 201 });
}
