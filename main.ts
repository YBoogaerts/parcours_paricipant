radio.onReceivedNumber(function (receivedNumber) {
    courseParticipant.inscription_au_parcours(receivedNumber, "loup", "toto")
})
courseParticipant.onReceiveString(function (receivedString) {
    basic.showString(receivedString)
})
input.onButtonPressed(Button.A, function () {
    basic.showString("C")
})
radio.setGroup(1)
