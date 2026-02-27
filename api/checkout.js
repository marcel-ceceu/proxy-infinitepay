export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET' && !req.query.data) {
    return res.status(200).json({ ok: true, msg: 'Proxy InfinitePay APESP v1' });
  }
  try {
    let dados = req.method === 'POST' ? req.body : JSON.parse(req.query.data);
    const payload = { handle: 'saopaulo-pecas', items: [{ description: dados.descricao, quantity: 1, price: dados.valor_centavos }] };
    if (dados.cliente) payload.customer = { name: dados.cliente };
    const r = await fetch('https://api.infinitepay.io/invoices/public/checkout/links', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const txt = await r.text();
    if (!r.ok) return res.status(r.status).json({ error: r.status, body: txt, payload });
    return res.status(200).json(JSON.parse(txt));
  } catch (e) { return res.status(500).json({ error: e.message }); }
}
