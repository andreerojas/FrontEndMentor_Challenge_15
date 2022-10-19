const ip = document.querySelector('#ip');
const locationSpan = document.querySelector('#location');
const timezone = document.querySelector('#timezone');
const isp = document.querySelector('#isp');
const inputText = document.querySelector('input');
const form = document.querySelector('form');
const auxData = JSON.parse('{"ip":"81.56.83.126","location":{"country":"IT","region":"Lombardia","city":"Milan","lat":45.46427,"lng":9.18951,"postalCode":"","timezone":"+02:00","geonameId":3173435},"as":{"asn":29447,"name":"TIF-AS","route":"81.56.0.0\/15","domain":"http:\/\/www.iliad.it","type":"Cable\/DSL\/ISP"},"isp":"Broadband Pool Iliad Italia"}');


async function makeRequest(input, type) {
    let url = "https://geo.ipify.org/api/v2/country,city?apiKey=at_yw8vc1Visp2JNdk6dj5QZMicQiqXM";

    if (input) {
        if (type === 1) {
            url += `ipAddress=${input}`;
        } else if (type === 2) {
            url += `domain=${input}`;
        }
    }
    if(type!==3){
        let res = await fetch(url);
        return await res.json();
    }
    return auxData;
    
}

function printResults(data) {
    ip.innerText = data.ip;
    locationSpan.innerText = `${data["location"].city}, ${data["location"].region} ${data["location"].postalCode}`;
    timezone.innerText = `UTC ${data["location"].timezone}`;
    isp.innerText = data.isp;
}

function validateInput(input) {
    return 3;
}
function search() {
    let type = validateInput(inputText.value);
    console.log("type is: ", type);
    if (type) {
        makeRequest(inputText.value, type)
            .then((data) => {
                printResults(data);
            })
            .catch((e) => {
                console.log(e)
            });
    }
}

let map = L.map('map',{'zoomControl':false}).setView([auxData.location.lat,auxData.location.lng],15);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
let marker = L.marker([auxData.location.lat,auxData.location.lng]).addTo(map);

form.addEventListener('submit', search);
search();
