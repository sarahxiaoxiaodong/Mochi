const body = document.getElementsByTagName("body")[0];

function setColor(name) {
    body.style.backgroundColor = name
}

function randomColor() {
    const red3 = Math.round(Math.random() * 255);
    const green3 = Math.round(Math.random() * 255);
    const blue = Math.round(Math.random() * 255);

    const color = `rgb(${red3}, ${green3}, ${blue})`;
    body.style.backgroundColor = color
}

