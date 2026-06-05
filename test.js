const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.trip.findMany().then(t => {
  const tokyo = t.find(trip => trip.destination === 'tokyo');
  const parsed = JSON.parse(tokyo.itinerary);
  console.log('days count:', parsed.days.length);
  console.log('day 1:', JSON.stringify(parsed.days[0]));
  p.$disconnect();
});