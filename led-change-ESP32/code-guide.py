# # Important commands:
# # help("modules") lists bulit-in modules
# # dir(board) lists pins on the board

"""Blinking Module"""

# import time
# import board
# from digitalio import DigitalInOut, Direction

# led = DigitalInOut(board.LED)
# led.direction = Direction.OUTPUT
# led.value = False

# while True:
#     led.value = not led.value
#     time.sleep(1)  

"""Input Module"""

# import board
# import digitalio
# import usb_cdc

# led = digitalio.DigitalInOut(board.LED)
# led.direction = digitalio.Direction.OUTPUT
# led.value = False

# while True:
    # command = input("Type ON or OFF: ").strip().upper()
    
    # if command == "ON":
    #     led.value = False
    #     print("LED IS ON!")

    # elif command == "OFF":
    #     led.value = True
    #     print("LED IS OFF!")

    # else:
    #     print("Unknown command:", command)