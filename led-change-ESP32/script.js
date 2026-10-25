let port;
let writer;

const connectBtn = document.getElementById('connect');
const onBtn = document.getElementById('led-on');
const offBtn = document.getElementById('led-off');


connectBtn.addEventListener("click", async () => {
    try {
        const ports = await navigator.serial.getPorts();
        if (ports.length > 0) {
            port = ports[0];
            console.log("Using previously authorized port");
        } else {
            port = await navigator.serial.requestPort();
        }

        await port.open({ baudRate: 115200 });
        console.log("ESP32 connected!");

        const textEncoder = new TextEncoderStream();
        textEncoder.readable.pipeTo(port.writable);
        writer = textEncoder.writable.getWriter();

        connectBtn.textContent = "Connected!";
        connectBtn.style.backgroundColor = "#4CAF50";

        readFromESP32();

    } catch (err) {
        console.error("Connection error:", err.name, err.message);
    }
});

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
                console.log("ESP32 Output:", message.trim());
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

onBtn.addEventListener('click', async () => {
    if (writer) {
        await writer.write("ON\n");
        console.log("Sent command: ON");
    } else {
        console.log("Connect to the ESP32 first!");
    }
});

offBtn.addEventListener('click', async () => {
    if (writer) {
        await writer.write("OFF\n");
        console.log("Sent command: OFF");
    } else {
        console.log("Connect to the ESP32 first!");
    }
});