
export function predictETA(order = {}) {
  const base = 30; // base minutes
  const distance = order.distanceKm || 5; // km
  const traffic = order.routeTraffic || 0.2; // 0..1
  const weatherFactor = order.weatherSeverity || 0; // 0..1
  const vendorSpeedFactor = order.vendorSpeedFactor || 1; // 0.7..1.3

  const time = Math.round((base + distance * 6) * vendorSpeedFactor + traffic * 20 + weatherFactor * 15);
  return Math.max(5, time);
}
