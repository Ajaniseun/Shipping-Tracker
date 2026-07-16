export type ShipmentHistory = {
  status: string;
  location: string;
  timestamp: string;
};

export type Shipment = {
  id: number;
  trackingNumber: string;
  customer: string;
  origin: string;
  destination: string;
  status: string;
  location: string;
  history: ShipmentHistory[];
  createdAt: string;
  updatedAt: string;
};

const shipments: Shipment[] = [
  {
    id: 1,
    trackingNumber: 'COL-1001',
    customer: 'Maria Gomez',
    origin: 'Bogotá, Colombia',
    destination: 'Toronto, Canada',
    status: 'In Transit',
    location: 'Medellín, Colombia',
    createdAt: '2026-07-10',
    updatedAt: '2026-07-14',
    history: [
      { status: 'Picked Up', location: 'Bogotá, Colombia', timestamp: '2026-07-10' },
      { status: 'In Transit', location: 'Medellín, Colombia', timestamp: '2026-07-14' },
    ],
  },
  {
    id: 2,
    trackingNumber: 'COL-1002',
    customer: 'Ahmed Rahman',
    origin: 'Bogotá, Colombia',
    destination: 'Montreal, Canada',
    status: 'Customs Review',
    location: 'Medellín, Colombia',
    createdAt: '2026-07-11',
    updatedAt: '2026-07-15',
    history: [
      { status: 'Picked Up', location: 'Bogotá, Colombia', timestamp: '2026-07-11' },
      { status: 'In Transit', location: 'Medellín, Colombia', timestamp: '2026-07-13' },
      { status: 'Customs Review', location: 'Medellín, Colombia', timestamp: '2026-07-15' },
    ],
  },
];

const statusOptions = ['Picked Up', 'In Transit', 'Customs Review', 'Out for Delivery', 'Delivered'];

function createTrackingNumber(id: number) {
  const trackingNumber = `COL-${1000 + id}`;
  if (shipments.some((shipment) => shipment.trackingNumber === trackingNumber)) {
    return createTrackingNumber(id + 1);
  }
  return trackingNumber;
}

function getTimestamp() {
  return new Date().toISOString().slice(0, 10);
}

export function getShipments() {
  return shipments;
}

export function findShipmentByTrackingNumber(trackingNumber: string) {
  return shipments.find(
    (shipment) => shipment.trackingNumber.toUpperCase() === trackingNumber.toUpperCase(),
  ) ?? null;
}

export function createShipment(customer: string, destination: string) {
  const id = shipments.length > 0 ? shipments[shipments.length - 1].id + 1 : 1;
  const trackingNumber = createTrackingNumber(id);
  const now = getTimestamp();
  const origin = 'Bogotá, Colombia';

  const shipment: Shipment = {
    id,
    trackingNumber,
    customer,
    origin,
    destination: destination || 'Toronto, Canada',
    status: 'Picked Up',
    location: origin,
    createdAt: now,
    updatedAt: now,
    history: [{ status: 'Picked Up', location: origin, timestamp: now }],
  };

  shipments.push(shipment);
  return shipment;
}

export function updateShipment(trackingNumber: string, status: string, location: string) {
  const shipment = findShipmentByTrackingNumber(trackingNumber);
  if (!shipment) {
    return null;
  }

  const now = getTimestamp();
  shipment.status = status;
  shipment.location = location;
  shipment.updatedAt = now;
  shipment.history.push({ status, location, timestamp: now });

  return shipment;
}

export function getStatusOptions() {
  return statusOptions;
}
