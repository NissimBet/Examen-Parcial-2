function init() {
  watchForm();
}

function watchForm() {
  const form = document.getElementsByClassName("js-search-form")[0];

  form.addEventListener("submit", event => {
    event.preventDefault();

    const inputData = document.getElementById("query").value;
    getData(inputData);
  });
}

/*
  name: string,
  capital: string,
  flag: string,
  pop: number,
  region: string,
  timezones: [string],
  borders: [string]
*/
const Country = ({
  name,
  capital,
  flag,
  population,
  region,
  timezones,
  borders
}) => `
  <div class="country">
  <h2>${name}</h2>
    <div class="country-header">
      <img src="${flag}" />
      <div>
        <h4>${capital}</h4>
        <p>${region}</p>
      </div>
    </div>
    <p>Poblacion: ${population}</p>
    <ul>${timezones.map(name => "<li>" + name + "</li>").join(" ")}</ul>
    <ul>${borders.map(name => "<li>" + name + "</li>").join(" ")}</ul>
  </div>
`;

const ErrorMessage = () => `
  <p>Pais no encontrado</p>
`;

async function getData(name) {
  const data = await fetch(`https://restcountries.eu/rest/v2/name/${name}`);
  const JSONdata = await data.json();

  const container = document.getElementsByClassName("js-search-results")[0];
  container.innerHTML = "";

  if (JSONdata.length > 0) {
    for (let country of JSONdata) {
      container.innerHTML += Country({ ...country });
    }
  } else {
    container.innerHTML = ErrorMessage();
  }
}

init();
