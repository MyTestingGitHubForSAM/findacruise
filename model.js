(function (root) {
  'use strict';
  const destinations = ['Alaska', 'Asia', 'Australia/New Zealand', 'Bahamas', 'Bermuda', 'Canada/New England', 'Caribbean', 'Europe', 'Hawaii', 'Mexico', 'Pacific Coastal', 'Panama Canal', 'Repositioning', 'South Pacific', 'Transatlantic', 'Transpacific'];
  const ports = {
    'North America': ['Baltimore, Maryland', 'Boston, Massachusetts', 'Cape Liberty, New Jersey', 'Fort Lauderdale, Florida', 'Galveston, Texas', 'Honolulu (Oahu), Hawaii', 'Los Angeles, California', 'Miami, Florida', 'Orlando (Port Canaveral), Florida', 'Seattle, Washington', 'Seward, Alaska', 'Tampa, Florida', 'Vancouver, British Columbia'],
    Caribbean: ['San Juan, Puerto Rico'], Europe: ['Barcelona, Spain'], Australia: ['Sydney, Australia'], Asia: ['Singapore']
  };
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = (year, index) => year * 12 + index;
  const label = value => `${months[value % 12]} ${Math.floor(value / 12)}`;
  // Freeze the review clock so the spec's approved acceptance examples remain reproducible.
  const demonstrationYear = 2026;
  const demonstrationMonth = 8;
  const past = value => Number.isInteger(value) && value < month(demonstrationYear, demonstrationMonth);
  const available = value => Number.isInteger(value) && value >= month(demonstrationYear, demonstrationMonth) && value < month(demonstrationYear + 4, 0) && value !== month(2028, 5);
  const initial = () => ({ panel: null, destination: null, port: null, region: 'North America', start: null, end: null, validation: false, submitted: null });
  const complete = s => s.start !== null && s.end !== null;
  const eligible = s => Boolean(s.destination || s.port || complete(s));
  const shortLabel = value => `${months[value % 12].slice(0, 3)} '${String(Math.floor(value / 12)).slice(-2)}`;
  const range = s => complete(s) ? `${shortLabel(s.start)} - ${shortLabel(s.end)}` : 'Any Date';
  const summary = s => ({ ...(s.destination ? { destination: s.destination } : {}), ...(s.port ? { port: s.port } : {}), ...(complete(s) ? { date: range(s) } : {}) });
  function reduce(state, action) {
    const s = { ...state };
    switch (action.type) {
      case 'panel': s.panel = s.panel === action.value ? null : action.value; break;
      case 'dismiss': s.panel = null; break;
      case 'destination':
        if (action.value !== null && !destinations.includes(action.value)) return state;
        s.destination = action.value; s.panel = null; s.validation = false; s.submitted = null; break;
      case 'port':
        if (action.value !== null && !Object.values(ports).flat().includes(action.value)) return state;
        s.port = action.value; s.panel = null; s.validation = false; s.submitted = null; break;
      case 'region': if (ports[action.value]) s.region = action.value; break;
      case 'month':
        if (!available(action.value)) return state;
        if (s.start === null || complete(s) || action.value < s.start) { s.start = action.value; s.end = null; }
        else { s.end = action.value; s.panel = null; }
        s.validation = false; s.submitted = null; break;
      case 'clear-date': s.start = null; s.end = null; s.panel = null; s.validation = false; s.submitted = null; break;
      case 'search':
        s.validation = !eligible(s); s.submitted = eligible(s) ? summary(s) : null;
        if (s.submitted) s.panel = null;
        break;
      default: return state;
    }
    return s;
  }
  const presets = ['Initial state', 'Destination selected', 'Departure port selected', 'Partial date range', 'Completed date range', 'All filters selected', 'Minimum-selection validation'];
  function preset(index) {
    const s = initial();
    if (index === 1 || index === 5) s.destination = 'Alaska';
    if (index === 2 || index === 5) s.port = 'Seattle, Washington';
    if ([3, 4, 5].includes(index)) s.start = month(2027, 4);
    if ([4, 5].includes(index)) s.end = month(2027, 8);
    if (index === 3) s.panel = 'date';
    if (index === 6) s.validation = true;
    return s;
  }
  const api = { destinations, ports, months, month, label, demonstrationYear, demonstrationMonth, past, available, initial, complete, eligible, range, summary, reduce, presets, preset };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CruiseModel = api;
})(globalThis);
