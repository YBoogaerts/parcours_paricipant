radio.onReceivedNumber(function (n) {
    courseParticipant.inscription_au_parcours(n,"test","dédé")

})

radio.onReceivedString((s)=>console.log(s))

input.onButtonPressed(Button.A, function () {
   tests[numTest++]()
})
let numTest = 0
radio.setTransmitSerialNumber(true)
type test=()=>void
let tests:test[]=[]

let test1:test = ()=>{
    radio.sendNumber(control.deviceSerialNumber())
}
tests.push(test1)
