import { NextRequest, NextResponse } from 'next/server';
import { findShipmentByTrackingNumber, updateShipment } from '@/app/lib/shipments';

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingNumber: string } },
) {
  const shipment = findShipmentByTrackingNumber(params.trackingNumber);
  if (!shipment) {
    return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
  }

  return NextResponse.json(shipment);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { trackingNumber: string } },
) {
  const body = await request.json();
  const status = String(body.status ?? '').trim();
  const location = String(body.location ?? '').trim();

  if (!status || !location) {
    return NextResponse.json(
      { error: 'Status and location are required for updates' },
      { status: 400 },
    );
  }

  const shipment = updateShipment(params.trackingNumber, status, location);
  if (!shipment) {
    return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
  }

  return NextResponse.json(shipment);
}
