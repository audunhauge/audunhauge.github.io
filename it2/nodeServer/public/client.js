// @ts-check

async function setup() {
    const konto = await lesData("/konto/1",{});
    console.log(konto);
}


async function lesData(endpoint, data) {
  return new Promise(resolve => {
    let init = {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ data }),
      headers: {
        "Content-Type": "application/json"
      }
    };
    fetch(endpoint, init)
      .then(r => r.json())
      .then(resultat => resolve(resultat))
      .catch(err => console.log(err.message));
  });
}
