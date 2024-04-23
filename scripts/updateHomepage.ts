async function updateHomepage() {
  const res = await fetch("http://localhost:3000/api/genHomePage", {
    method: "POST",
  });
  console.log(await res.json());
  process.exit(0);
}

updateHomepage();
