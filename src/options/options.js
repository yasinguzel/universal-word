async function fetchISO6393() {
    const response = await fetch(
        "https://gist.githubusercontent.com/yasinguzel/4f62dccc3b4760f4b0b1c830d9c99fb1/raw/cbecc380bea16621a12b7fbc03ebcdbc44516f50/ISO6393.json"
    );

    const data = await response.json();

    return data;
}

function addedISO3933Optionss(select, name, value) {
    let option = document.createElement("option");
    let text = document.createTextNode(name);

    option.appendChild(text);
    option.value = value;

    select.appendChild(option);
}

function saveOptions() {
    let from = document.getElementById("from").value;
    let dest = document.getElementById("dest").value;

    chrome.storage.sync.set({
        from: from,
        dest: dest
    }, () => {
        let status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    })
}

function restoreOptions() {
    chrome.storage.sync.get({
        from: "eng",
        dest: "tur"
    }, (items) => {
        document.getElementById("from").value = items.from;
        document.getElementById("dest").value = items.dest;
    })
}

let fromSelect = document.getElementById("from");
let destSelect = document.getElementById("dest");

fetchISO6393().then((iso6393Codes) => {
    Object.values(iso6393Codes).map((iso6393Code) => {
        addedISO3933Optionss(fromSelect, iso6393Code.name, iso6393Code.iso6393);
        addedISO3933Optionss(destSelect, iso6393Code.name, iso6393Code.iso6393);
    })
}).then(() => {
    restoreOptions();
})

document.getElementById("save").addEventListener("click", saveOptions);