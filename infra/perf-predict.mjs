// Usage: node perf-predict.mjs http://localhost:8080 30
const backend = process.argv[2] || 'http://localhost:8080';
const runs = Number(process.argv[3] || 30);

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function register(base){
  const email = `perf${Date.now()}@example.com`;
  const body = { email, password: 'Secret1!', name: 'Perf' };
  const res = await fetch(`${base}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error('Register failed');
  const json = await res.json();
  return json.token;
}

async function main(){
  const token = await register(backend);
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  const latencies = [];
  for (let i=0;i<runs;i++){
    const payload = { bedrooms: 3, bathrooms: 2, area_sqm: 120.5 + i, age_years: 8, location_index: 4 };
    const start = performance.now();
    const res = await fetch(`${backend}/api/predictions`, { method: 'POST', headers, body: JSON.stringify(payload) });
    const end = performance.now();
    if (!res.ok) {
      const txt = await res.text();
      console.error('Request failed', res.status, txt);
      process.exit(1);
    }
    latencies.push(end - start);
    await sleep(50);
  }
  latencies.sort((a,b)=>a-b);
  const p95 = latencies[Math.floor(0.95 * (latencies.length-1))];
  const avg = latencies.reduce((a,b)=>a+b,0)/latencies.length;
  console.log(JSON.stringify({ runs, avg_ms: avg.toFixed(1), p95_ms: p95.toFixed(1) }, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });


