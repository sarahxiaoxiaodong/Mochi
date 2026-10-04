const body = document.getElementsByTagName("body")[0];

function setColor(name) {
    body.style.backgroundColor = name
}

function randomColor() {
    const red1 = Math.round(Math.random() * 255);
    const green1 = Math.round(Math.random() * 255);
    const blue = Math.round(Math.random() * 255);

    const color = `rgb(${red1}, ${green1}, ${blue})`;
    body.style.backgroundColor = color
}

