//Elementos del Html
const $moneda = document.getElementById("moneda");
const $criptomonedas = document.getElementById("criptomonedas");
const $loader = document.querySelector(".overlay");
const $btnCotizar = document.querySelector(".button-primary");
const $errorDiv = document.getElementById("error");
const $resultado = document.getElementById("resultado");
const $loading = document.querySelector(".loader");

document.addEventListener("DOMContentLoaded", iniciarApp);

function iniciarApp(){
    //Llenar el select con las criptomonedas
    llenarCriptoSelect();

    $btnCotizar.addEventListener("click", (e) => {
        e.preventDefault();
        cotizarCripto();
    });
}

async function llenarCriptoSelect(){

    const URL = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";
    
    try {

        const response = await fetch(URL)
        const { Data } = await response.json();

        const fragment = document.createDocumentFragment();

        Data.forEach( cripto => {
            const { Name, FullName } = cripto.CoinInfo;

            const option = document.createElement("OPTION");
            option.value = Name;
            option.textContent = FullName;

            fragment.appendChild(option);
        });

        $criptomonedas.appendChild(fragment);

        $loader.classList.add("hide");

    } catch (error) {
        console.log("Ha ocurrido un error");
    }
}

async function cotizarCripto(){

    const moneda = $moneda.value;
    const cripto = $criptomonedas.value;

    //Validacion
    const $error = document.createElement("P");
    $error.classList.add("error");
    let error = false;

    if(moneda === "" && cripto === ""){
        //Enviar mensaje de que debe seleccionar una moneda y una cripto
        $error.textContent = "Seleccione una moneda y una criptomoneda";
        error = true;
    }else if(moneda === ""){
        $error.textContent = "Seleccione una moneda";
        error = true;
    }else if(cripto === ""){
        $error.textContent = "Seleccione una criptomoneda";
        error = true;
    }

    if(error){
        if($errorDiv.firstChild){
            $errorDiv.removeChild( $errorDiv.firstChild );
        }
        $errorDiv.appendChild($error);

        setTimeout(() => {
            $errorDiv.removeChild( $errorDiv.firstChild);
        }, 2000);
        return;
    }

    const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto}&tsyms=${moneda}`;

    try {

        $loading.classList.remove("hide");

        $resultado.innerHTML = "";

        const response = await fetch(URL)
        const { DISPLAY } = await response.json();

        const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = DISPLAY[cripto][moneda];

        const precio = document.createElement("p");
        precio.classList.add("precio");
        precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

        const precioAlto = document.createElement("p");
        precioAlto.innerHTML = `El precio más alto del día es: <span>${HIGHDAY}</span>`;

        const precioBajo = document.createElement("p");
        precioBajo.innerHTML = `El precio más bajo del día es: <span>${LOWDAY}</span>`;

        const variacion = document.createElement("p");
        variacion.innerHTML = `Variación las ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

        const ultimaAct = document.createElement("p");
        ultimaAct.innerHTML = `Ultima Actualización: <span>${LASTUPDATE}</span>`;  

        $loading.classList.add("hide");

        $resultado.appendChild(precio);
        $resultado.appendChild(precioAlto);
        $resultado.appendChild(precioBajo);
        $resultado.appendChild(variacion);
        $resultado.appendChild(ultimaAct);
    } catch (error) {
        console.log("Ha ocurrido un error");
    }
}