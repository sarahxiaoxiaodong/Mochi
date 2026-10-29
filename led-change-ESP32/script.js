// Web Console

const consoleElement = document.getElementById("console");

function log(message, type = "INFO") {
    const line = document.createElement("div");
    const time = new Date().toLocaleTimeString();

    line.textContent = `[${time}] [${type}] ${message}`;
    consoleElement.appendChild(line);

    consoleElement.scrollTop = consoleElement.scrollHeight;
}

// Variables

let port;
let writer;

// Packet


function buildPacket(data) {
    const jsonStr = JSON.stringify(data);
    let sum = 0;

    for (let i = 0; i < jsonStr.length; i++) {
        sum += jsonStr.charCodeAt(i);
    }

    const checksum = sum % 256;
    return `START|${jsonStr.length}|${jsonStr}|${checksum}|END`;
}

function openPacket(packetStr) {
    const parts = packetStr.split("|");

    if (parts[0] !== "START" || parts[4] !== "END") {
        throw new Error("Invalid packet framing");
    }

    const expectedLength = Number(parts[1]);
    const jsonStr = parts[2];

    if (jsonStr.length !== expectedLength) {
        throw new Error("Packet data length mismatch");
    }

    const receivedChecksum = Number(parts[3]);

    let sum = 0;

    for (let i = 0; i < jsonStr.length; i++) {
        sum += jsonStr.charCodeAt(i);
    }

    const calculatedChecksum = sum % 256;

    if (calculatedChecksum !== receivedChecksum) {
        throw new Error("Checksum failed! Data may be corrupted.");
    }

    return JSON.parse(jsonStr);
}

const packet = buildPacket({
    action: "LED",
    state: "ON"
});

const parts = packet.split("|");

console.log(parts);

try {
    const parts = openPacket(packet);
    log("Packet framing and length are valid!", "SUCCESS");
} catch (error) {
    log(error.message, "ERROR");
}

// Buttons

const connectBtn = document.getElementById('connect');
const onBtn = document.getElementById('led-on');
const offBtn = document.getElementById('led-off');

// Connection

connectBtn.addEventListener("click", async () => {
    try {
        const ports = await navigator.serial.getPorts(); // WEB SERIAL API
        if (ports.length > 0) {
            port = ports[0];
            log("Using previously authorized port");
        } else {
            port = await navigator.serial.requestPort();
        }

        await port.open({ baudRate: 115200 });
        log("ESP32 connected!");

        const textEncoder = new TextEncoderStream(); // ENCODING API
        textEncoder.readable.pipeTo(port.writable);
        writer = textEncoder.writable.getWriter();

        connectBtn.textContent = "Connected!";
        connectBtn.style.backgroundColor = "var(--green-color)";

        readFromESP32();

    } catch (err) {
        console.error("Connection error:", err.name, err.message);
    }
});

// Reading from ESP32

async function readFromESP32() {
  const textDecoder = new TextDecoderStream();
  port.readable.pipeTo(textDecoder.writable);

  const reader = textDecoder.readable.getReader();
  let buffer = "";
  
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
            const message = line.trim();
            if (message) {
                log("ESP32 Output: " + message.trim());
            }
        }
        }
      }
    }
  catch (error) {
    console.error("Read error:", error);
  } finally {
    reader.releaseLock();
  }
}

// On and Off buttons

onBtn.addEventListener('click', async () => {
    if (!writer) {
        log("Connect to the ESP32 first!", "ERROR")
        return;
    }
    const packet = buildPacket({
        action: "LED",
        state: "ON"
    });

    await writer.write(packet + "\n");
    log("Sent packet: " + packet, "SUCCESS")
});

offBtn.addEventListener('click', async () => {
    if (!writer) {
        log("Connect to the ESP32 first!", "ERROR");
        return;
    }
    
    const packet = buildPacket({
        action: "LED",
        state: "OFF"
    });

    await writer.write(packet + "\n");
    log("Sent packet: " + packet, "SUCCESS")
});