(() => {
'use strict';
const M = window.CruiseModel;
let state = M.initial();
const sessionKey = 'find-a-cruise-v4';
try {
  const saved = JSON.parse(sessionStorage.getItem(sessionKey));
  if (saved && saved.version === '4') {
    for (const [type,value] of [['destination',saved.destination],['port',saved.port],['region',saved.region]]) state=M.reduce(state,{type,value});
    if (M.available(saved.start)) state=M.reduce(state,{type:'month',value:saved.start});
    if (M.available(saved.start) && M.available(saved.end) && saved.end>=saved.start) state=M.reduce(state,{type:'month',value:saved.end});
    state.panel=null;
  }
} catch {}
const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const actionButton = (action, value, text, className, extra = '') => `<button class="${className}" data-action="${action}" data-value="${escape(value)}" ${extra}>${escape(text)}</button>`;
const top = (clear, hasSelection) => hasSelection ? '<div class="panel-top">' + actionButton(clear, '', 'Clear selection', 'clear') + '</div>' : '';
const assumptions = [
  'At least one applicable search criterion is required.',
  'Only one filter panel can be open at a time.',
  'A partial date range is not applied as a search criterion.',
  'Month availability is global and independent of the other filters.',
  'All destination, port and availability data is illustrative.',
  'The existing Cruises page is assumed to receive, display and apply the selected criteria.'
];
$('assumptions').innerHTML = assumptions.map(text => '<li>' + escape(text) + '</li>').join('');
function fitPanels() {
  const row = document.querySelector('.filter-row').getBoundingClientRect();
  document.querySelectorAll('.panel').forEach(panel => {
    panel.style.maxHeight = `${Math.max(80, window.innerHeight - row.bottom - 20 - (document.querySelector('.presentation-footer')?.getBoundingClientRect().height || 0))}px`;
  });
}
window.addEventListener('resize', fitPanels);
window.addEventListener('scroll', fitPanels, { passive: true, capture: true });
function render() {
  try { sessionStorage.setItem(sessionKey,JSON.stringify({version:'4',destination:state.destination,port:state.port,region:state.region,start:state.start,end:state.end})); } catch {}
  const focused = document.activeElement;
  const focusAction = focused?.dataset.action;
  const focusValue = focused?.dataset.value;
  $('destination-value').textContent = state.destination || 'Any Destination';
  $('port-value').textContent = state.port || 'Any Departure Port';
  $('date-value').textContent = M.range(state);
  for (const key of ['destination', 'port', 'date']) {
    $(`trigger-${key}`).setAttribute('aria-expanded', String(state.panel === key));
    $(`panel-${key}`).hidden = state.panel !== key;
  }
  $('panel-destination').innerHTML = top('clear-destination', state.destination) + `<div class="options">${M.destinations.map(value => actionButton('destination', value, value, 'option', `aria-pressed="${state.destination === value}"`)).join('')}</div>`;
  $('panel-port').innerHTML = top('clear-port', state.port) + `<nav class="regions" aria-label="Browse ports by region">${Object.keys(M.ports).map(value => actionButton('region', value, value, 'region', `aria-pressed="${state.region === value}"`)).join('')}</nav><div class="options" aria-label="${escape(state.region)} ports">${M.ports[state.region].map(value => actionButton('port', value, value, 'option', `aria-pressed="${state.port === value}"`)).join('')}</div>`;
  $('panel-date').innerHTML = top('clear-date', state.start !== null) + `<div class="years">${Array.from({ length: 4 }, (_, offset) => {
    const year = M.demonstrationYear + offset;
    return `<section class="year" aria-label="${year}"><h3>${year}</h3><div class="months">${M.months.map((name, index) => {
      const value = M.month(year, index), selected = value === state.start || value === state.end;
      const inRange = M.complete(state) && value > state.start && value < state.end;
      const status = M.past(value) ? ', past month, unavailable' : !M.available(value) ? ', unavailable' : value === state.start && value === state.end ? ', start and end month' : value === state.start ? ', start month' : value === state.end ? ', end month' : inRange ? ', in selected range' : ', available';
      return actionButton('month', value, name.slice(0, 3), `month${inRange ? ' in-range' : ''}`, `aria-label="${name} ${year}${status}" aria-pressed="${selected}" ${!M.available(value) ? 'disabled' : ''}`);
    }).join('')}</div></section>`;
  }).join('')}</div>`;
  fitPanels();
  $('validation').hidden = !state.validation;
  $('submission').hidden = !state.submitted;
  if (state.submitted) {
    const labels = { destination: 'Destination', port: 'Departure Port', date: 'Departure Date' };
    $('submission').innerHTML = `<p class="eyebrow">Outside the Find a Cruise component scope</p><h2 id="submission-title">Simulated search outcome</h2><dl>${Object.entries(state.submitted).map(([key, value]) => `<div><dt>${labels[key]}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>`;
  }
  if (focusAction && focused && !focused.isConnected) {
    const replacement = [...document.querySelectorAll('[data-action]')].find(el => el.dataset.action === focusAction && el.dataset.value === focusValue && !el.closest('[hidden]'));
    replacement?.focus({ preventScroll: true });
  }
}
document.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (button) {
    const { action, value } = button.dataset;
    const oldPanel = state.panel;
    if (action === 'panel' && state.panel !== value) {
      const row = document.querySelector('.filter-row').getBoundingClientRect();
      if (row.bottom > window.innerHeight - 200 - (document.querySelector('.presentation-footer')?.getBoundingClientRect().height || 0) || row.top < 75) {
        const modal = document.querySelector('#prototype-fullscreen[open]');
        const offset = modal ? modal.querySelector('.fullscreen-toolbar').getBoundingClientRect().height + 12 : (window.innerWidth > 760 ? 80 : 12);
        const top = row.top + (modal ? modal.scrollTop : window.scrollY) - offset;
        (modal || window).scrollTo({ top, behavior: 'instant' });
      }
    }
    state = M.reduce(state, { type: action === 'clear-destination' ? 'destination' : action === 'clear-port' ? 'port' : action, value: action.startsWith('clear-') ? null : action === 'month' ? Number(value) : value });
    render();
    if (action === 'search' && state.submitted) $('submission').focus({ preventScroll: true });
    else if (oldPanel && !state.panel && ['destination', 'port', 'month', 'clear-destination', 'clear-port', 'clear-date'].includes(action)) $(`trigger-${oldPanel}`).focus({ preventScroll: true });
    $('announcement').textContent = action === 'month' ? M.complete(state) ? `Selected ${M.range(state)}.` : `Provisional start: ${M.label(state.start)}. Select an end month.` : action === 'region' ? `Showing ${state.region} ports.` : action === 'destination' || action === 'port' ? `Selected ${value}.` : action.startsWith('clear-') ? 'Selection cleared.' : '';
  } else if (state.panel && !event.target.closest('#consumer')) {
    state = M.reduce(state, { type: 'dismiss' }); render();
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && state.panel) {
    const previous = state.panel;
    state = M.reduce(state, { type: 'dismiss' }); render();
    $(`trigger-${previous}`).focus({ preventScroll: true });
  }
});
render();
document.getElementById('reset-prototype').addEventListener('click',()=>{state=M.initial();render();$('trigger-destination').focus();$('announcement').textContent='Prototype selections reset.';});
})();


