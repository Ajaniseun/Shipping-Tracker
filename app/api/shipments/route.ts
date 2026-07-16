import { NextRequest, NextResponse } from 'next/server';
import { createShipment, findShipmentByTrackingNumber, getShipments } from '@/app/lib/shipments';

export async function GET(request: NextRequest) {
  const trackingNumber = request.nextUrl.searchParams.get('trackingNumber')?.trim();

  if (trackingNumber) {
    const shipment = findShipmentByTrackingNumber(trackingNumber);
    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    return NextResponse.json(shipment);
  }

  return NextResponse.json(getShipments());
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
