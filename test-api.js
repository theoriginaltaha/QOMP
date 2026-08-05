async function test() {
  const res = await fetch('https://qomp-nine.vercel.app/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@qomp.com', password: 'admin' })
  });
  console.log(res.status);
  const text = await res.text();
  console.log(text);
}
test();
