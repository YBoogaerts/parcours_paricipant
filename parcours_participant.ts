
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
            if (microNet.recipientPart(m) == getName() && microNet.senderPart(m) === parcours && microNet.bodyPart(m).substr(0, 3) === "GRP") {
                // reponse inscription
                multiGroup.setGroup(parseInt(microNet.bodyPart(m).substr(3)))
                multiGroup.setGroupReceiver(onGroupReceiveString)
                serial.writeLine(parcours + " => inscription sous le numéro " + multiGroup.getGroup())
            }
        })
        microNet.setName(nom)
        radio.sendString(multiGroup.messageToGroup(microNet.buildMessage("INS", parcours)))
    }

    function onGroupReceiveString(receivedString: string) {
        if (idServer == radio.receivedPacket(RadioPacketProperty.SerialNumber)) {
            if (microNet.senderPart(receivedString) === parcours) {
                serial.writeLine(parcours + " => vous êtes à l'étape " + microNet.bodyPart(receivedString).substr(3))
            } else {
                receiveStringHandler(receivedString)
            }
        }
    }

    //% block="m'envoyer la réponse $receivedString"
    export function onReceiveString(handler: (receivedString: string) => void) {
        receiveStringHandler = handler
    }

    //% block="envoyer du texte $receivedString"
    export function sendString(message: string) {
        let m = multiGroup.messageToGroup(message)
        radio.sendString(m)
    }

    //%block="lorsque je recois la réponse "
    //% handlerStatement=0
    //% draggableParameters="reporter"
    export function setReceiver(handler: (reponse: string) => void) {
        multiGroup.setGroupReceiver(handler)
    }

}