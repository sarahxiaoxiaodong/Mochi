import board
import digitalio
import usb_cdc

print("Running Program")

led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT
led.value = True

while True:
    if usb_cdc.data is not None and usb_cdc.data.in_waiting > 0:
        command = usb_cdc.data.readline().decode("utf-8").strip()

        print("Received:", command)

        if command == "ON":
            led.value = False
            usb_cdc.data.write(b"LED IS ON\n")

        elif command == "OFF":
            led.value = True
            usb_cdc.data.write(b"LED IS OFF\n")

        else:
            usb_cdc.data.write(b"Unknown command\n")
