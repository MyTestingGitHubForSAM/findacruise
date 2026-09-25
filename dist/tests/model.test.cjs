const { test } = require('node:test');
const assert = require('node:assert/strict');
const M = require('../model.js');
const act = (s, type, value) => M.reduce(s, { type, value });
test('POC-AC-01: unrestricted initial state', () => {
  const s = M.initial(); assert.equal(s.panel, null); assert.equal(s.validation, false);
  assert.deepEqual(M.summary(s), {}); assert.equal(M.eligible(s), false);
});
test('POC-AC-02: exclusive panels preserve completed and provisional selections', () => {
  let s = act(M.preset(1), 'panel', 'destination'); s = act(s, 'panel', 'port');
  assert.equal(s.panel, 'port'); assert.equal(s.destination, 'Alaska');
  s = act(M.preset(3), 'panel', 'destination'); assert.equal(s.start, M.month(2027, 4)); assert.equal(s.end, null);
  s = act(s, 'dismiss'); assert.equal(s.panel, null); assert.equal(s.start, M.month(2027, 4));
});
test('POC-AC-03: region browsing never becomes a criterion or clears a port', () => {
  let s = act(M.initial(), 'region', 'Europe'); assert.equal(s.port, null); assert.equal(M.eligible(s), false); assert.deepEqual(M.ports[s.region], ['Barcelona, Spain']);
  s = act(M.preset(2), 'region', 'Asia'); assert.equal(s.port, 'Seattle, Washington');
});
test('POC-AC-04: June 2028 is unavailable in every selection state', () => {
  for (const s of [M.initial(), M.preset(3), M.preset(4), M.preset(5)]) assert.deepEqual(act(s, 'month', M.month(2028, 5)), s);
  assert.equal(M.available(M.month(2027, 4)), true); assert.equal(M.available(M.month(2027, 8)), true);
});
test('POC-AC-05: complete May through September 2027 and close panel', () => {
  const s = act(M.preset(3), 'month', M.month(2027, 8)); assert.equal(M.complete(s), true); assert.equal(s.panel, null); assert.equal(M.range(s), "May '27 - Sep '27");
});
test('POC-AC-06: partial dates cannot authorize a search and survive validation', () => {
  const s = act(M.preset(3), 'search'); assert.equal(s.submitted, null); assert.equal(s.validation, true); assert.equal(s.start, M.month(2027, 4)); assert.equal(s.panel, 'date'); assert.equal(M.range(s), 'Any Date');
});
test('POC-AC-07–08: any one criterion submits readable criteria; partial date is excluded', () => {
  for (const index of [1, 2, 4]) { const s = act(M.preset(index), 'search'); assert.ok(s.submitted); assert.equal(s.validation, false); }
  assert.deepEqual(act(M.preset(1), 'search').submitted, { destination: 'Alaska' });
  const s = act(act(M.preset(3), 'destination', 'Alaska'), 'search'); assert.equal(s.submitted.date, undefined);
  assert.deepEqual(Object.keys(s.submitted), ['destination']);
});
test('Internal test fixtures reset state and expose provisional date', () => {
  assert.equal(M.presets.length, 7); const s = M.preset(3); assert.equal(s.panel, 'date'); assert.equal(s.end, null); assert.equal(M.eligible(s), false); assert.equal(s.submitted, null);
});
test('FR-03–05: exact catalogs, single selection replacement, clearing and auto-close', () => {
  assert.equal(M.destinations.length, 16); assert.equal(Object.keys(M.ports).length, 5); assert.equal(M.ports['North America'].length, 13);
  for (const destination of M.destinations) { const s = act(M.preset(5), 'destination', destination); assert.equal(s.destination, destination); assert.equal(s.panel, null); }
  for (const port of Object.values(M.ports).flat()) { const s = act(M.preset(5), 'port', port); assert.equal(s.port, port); assert.equal(s.panel, null); }
  assert.equal(act(M.preset(5), 'destination', null).destination, null); assert.equal(act(M.preset(5), 'port', null).port, null);
});
test('FR-08–11: same-month, earlier-month, replacement, clearing and cross-year ranges', () => {
  let s = act(M.preset(3), 'month', M.month(2027, 4)); assert.equal(s.start, s.end); assert.equal(M.complete(s), true);
  s = act(M.preset(3), 'month', M.month(2027, 2)); assert.equal(s.start, M.month(2027, 2)); assert.equal(s.end, null); assert.equal(s.panel, 'date');
  s = act(act(M.preset(4), 'panel', 'date'), 'month', M.month(2027, 10)); assert.equal(s.start, M.month(2027, 10)); assert.equal(s.end, null); assert.equal(s.panel, 'date');
  s = act(s, 'month', M.month(2028, 1)); assert.equal(M.complete(s), true);
  s = act(s, 'clear-date'); assert.equal(s.start, null); assert.equal(s.end, null); assert.equal(s.panel, null); assert.equal(M.range(s), 'Any Date');
});
test('Dismissal is selection-preserving; submissions clear when criteria change', () => {
  const s = M.preset(5); assert.deepEqual(act(act(s, 'panel', 'date'), 'panel', 'date'), s);
  assert.equal(act(act(s, 'search'), 'destination', 'Europe').submitted, null);
});


test('US4 AC8: past-month boundaries and unchanged selections',()=>{
 for(let i=0;i<8;i++){const value=M.month(2026,i);assert.equal(M.available(value),false);assert.deepEqual(M.reduce(M.preset(3),{type:'month',value}),M.preset(3));assert.deepEqual(M.reduce(M.preset(4),{type:'month',value}),M.preset(4));}
 assert.equal(M.available(M.month(2026,8)),true);assert.equal(M.available(M.month(2028,5)),false);
});
