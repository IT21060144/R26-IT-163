const BASE = 'http://localhost:5002'
export async function api(path, opts = {}) {
  return fetch(`${BASE}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...opts.headers }
  })
}
