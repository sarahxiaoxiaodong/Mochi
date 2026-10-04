const body = document.getElementsByTagName("body")[0];

function setColor(name) {
    body.style.backgroundColor = name
}

function randomColor() {
    const red2 = Math.round(Math.random() * 255);
    const green2 = Math.round(Math.random() * 255);
    const blue = Math.round(Math.random() * 255);

    const color = `rgb(${red2}, ${green2}, ${blue})`;
    body.style.backgroundColor = color
}

