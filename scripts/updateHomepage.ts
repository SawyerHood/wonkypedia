async function updateHomepage() {
  const res = await fetch("http://localhost:3000/api/genHomePage", {
    method: "GET",
    headers: {
      authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  });
  console.log(await res.json());
  process.exit(0);
}

updateHomepage();
