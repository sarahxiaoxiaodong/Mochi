import board
import digitalio
import usb_cdc
import json

def open_packet(packet_str):
    parts = packet_str.split('|')
    
    if len(parts) != 5 or parts[0] != 'START' or parts[4] != 'END':
        raise ValueError("Invalid packet framing")
    
    expected_length = int(parts[1])
    json_str = parts[2]
    received_checksum = int(parts[3])
    
    if len(json_str) != expected_length:
        raise ValueError("Packet data length mismatch")
    
    calculated_checksum = sum(json_str.encode('utf-8')) % 256
    if calculated_checksum != received_checksum:
        raise ValueError("Checksum failed! Data is corrupted.")
    
    return json.loads(json_str)

print("Running Program")

led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT
led.value = True

while True:
    if usb_cdc.data is not None and usb_cdc.data.in_waiting > 0:
        command = usb_cdc.data.readline().decode("utf-8").strip()

        if not command:
            continue

        print("Received:", command)

        try:
            data = open_packet(command)
            
            if data.get("action") == "LED":
                state = data.get("state")
                
                if state == "ON":
                    led.value = False
                    usb_cdc.data.write(b"LED IS ON\n")
                    
                elif state == "OFF":
                    led.value = True
                    usb_cdc.data.write(b"LED IS OFF\n")
            else:
                usb_cdc.data.write(b"Unknown action\n")
        except (ValueError, TypeError, IndexError) as error:
            print("Packet error: ", error)
            usb_cdc.data.write(b"Invalid packet\n")
                    

