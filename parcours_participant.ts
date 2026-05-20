
namespace courseParticipant {
    let idServer: number = 0;
    let parcours: string = "????"
    let receiveStringHandler: (message: string) => void

    //% block="mon nom"
    export function getName(): string {
        return microNet.getName();
    }


    //% block="inscription au parcours $aparcours sous le nom $nom sur le seveur $id"
    export function inscription_au_parcours(id: number, aparcours: string, nom: string) {
        radio.setTransmitSerialNumber(true)
        radio.onReceivedString(multiGroup.receiveMessage)
        idServer = id
        parcours = aparcours
        multiGroup.setGroup(multiGroup.noGroup())
        multiGroup.setGlobalReceiver(function (m) {
            //serial.writeLine(m)
            if (microNet.recipientPart(m) == getName() && microNet.senderPart(m) === parcours && microNet.bodyPart(m).substr(0, 3) === "GRP") {
                // reponse inscription
                multiGroup.setGroup(parseInt(microNet.bodyPart(m).substr(3)))
                multiGroup.setGroupReceiver(onGroupReceiveString)
                serial.writeLine(parcours + " => inscription sous l'id : " + multiGroup.getGroup())
            }
        })
        microNet.setName(nom)
        let mes = multiGroup.messageToGroup(microNet.buildMessage("INS", parcours))
        //serial.writeLine(mes)
        radio.sendString(mes)
    }

    function onGroupReceiveString(receivedString: string) {
        if (idServer == radio.receivedPacket(RadioPacketProperty.SerialNumber)) {
            if (microNet.senderPart(receivedString) === parcours) {
                serial.writeLine(parcours + " => je suis au niveau " + microNet.bodyPart(receivedString).substr(3))
            } else {
                receiveStringHandler(receivedString)
            }
        }
    }

    //% block="lorsque je reçois un message" $receivedString"
    //% draggableParameters="reporter"
    export function onReceiveString(handler: (receivedString: string) => void) {
        receiveStringHandler = handler
    }

    //% block="envoyer du texte $message"
    export function sendString(message: string) {
        let m = multiGroup.messageToGroup(message)
        radio.sendString(m)
    }

 }