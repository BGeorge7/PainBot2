#This does not contain error checking
from PIL import Image
import sys
import os

print ("Arg 1: ", str(sys.argv[1]))

pfpName = str(sys.argv[2])
pfpLocation = str(sys.argv[1])
#pfpLocation = "142756402912428032.png"
bridgeName = os.path.dirname(os.path.realpath(__file__)) + "\\Bridged_Images\\Bridge.png"
saveLocation = os.path.dirname(os.path.realpath(__file__)) + "\\Bridged_Images\\"

pfpIM = Image.open(pfpLocation)
bridgeIM = Image.open(bridgeName)

bridgePfpIM = bridgeIM.copy()

(width, height) = (225,225)
pfpIM_resized = pfpIM.resize((width, height))
#print("Bridge: " + bridgeIM.format, bridgeIM.size, bridgeIM.mode)

bridgePfpIM.paste(pfpIM_resized, (1055, 128))

bridgePfpIM.save(saveLocation + "Bridged" + pfpName) #Image Save

print(saveLocation + "Bridged" + pfpLocation)
sys.stdout.flush()
