const ip = document.querySelector('#ip');
const locationSpan = document.querySelector('#location');
const timezone = document.querySelector('#timezone');
const isp = document.querySelector('#isp');
const inputText = document.querySelector('input');
const form = document.querySelector('form');
const reIP = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
const reDomain = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
let map = L.map('map', { 'zoomControl': false });

async function makeRequest(input, type) {
    let url = "https://geo.ipify.org/api/v2/country,city?apiKey=at_yw8vc1Visp2JNdk6dj5QZMicQiqXM&";

    if (input) {
        if (type === 1) {
            url += `ipAddress=${input}`;
        } else if (type === 2) {
            url += `domain=${input}`;
        }
    }
    let res = await fetch(url);
    return await res.json();
}

function printResults(data) {
    ip.innerText = data.ip;
    locationSpan.innerText = `${data["location"].city}, ${data["location"].region} ${data["location"].postalCode}`;
    timezone.innerText = `UTC ${data["location"].timezone}`;
    isp.innerText = data.isp;
}

function validateInput(input) {
    let ret = 0;
    if (reIP.test(input) || input === "") {
        ret = 1;
    }
    else if (reDomain.test(input)) {
        ret = 2;
    }
    console.log("type is: ", ret);
    // ret = 3;
    return ret;
}

function showPosition(data) {
    map.setView([data.location.lat, data.location.lng], 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    let marker = L.marker([data.location.lat, data.location.lng]).addTo(map);
}
function search() {
    let type = validateInput(inputText.value);

    if (type) {
        makeRequest(inputText.value, type)
            .then((data) => {
                printResults(data);
                showPosition(data);
            })
            .catch((e) => {
                console.log(e)
            });
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    search();
});
search();
