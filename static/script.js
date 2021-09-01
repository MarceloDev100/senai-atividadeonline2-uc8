
let today = moment().format("YYYY-MM-DD")

//Variables
let eventDate, eventName, timeDiff, 
selectedEventDate,  selectedEventSpeaker, 
selectedBirth, age,
name, birth,
selectedEvent, myEvent


//Buttons
let buttonSpeaker              = document.getElementById('button-speaker')
let buttonReturn               = document.getElementById('button-return')
let buttonForward              = document.getElementById('button-forward')
let buttonFinalizeEvent        = document.getElementById('button-finalize-event')
let buttonSubmitParticipant    = document.getElementById('button-submit-participant')
let buttonGoAhead              = document.getElementById('button-go-ahead')

//NavButtonsEvent
let speakerNav         = document.getElementById('speaker-nav')
let eventNav           = document.getElementById('event-nav')
let participantNav     = document.getElementById('participant-nav')
let listNav            = document.getElementById('list-nav')
let clearAllNav        = document.getElementById('clearAll-nav')

//Elements
let speakerInput           = document.getElementById('speaker')
let eventSpeakerSelect     = document.getElementById('event-speaker')
let eventNameInput         = document.getElementById('event')
let eventNameSelect        = document.getElementById('event-name-select')
let participantNameInput   = document.getElementById('name-participant')
let totalEl                = document.querySelector(".badge")
let birthDatepicker        = document.getElementById('birth')
let eventDatepicker        = document.getElementById('event-date')
let contentTable           = document.getElementById('content-table')
let toastLive              = document.getElementById("liveToast")


//Blocks
let speakersBlock        = document.getElementById('speakersBlock')
let eventsBlock          = document.getElementById('eventsBlock')
let participantsBlock    = document.getElementById('participantsBlock')
let listBlock            = document.getElementById('listBlock')

//Alerts
let eventNameAlert           = document.getElementById('event-name-alert')
let eventDateAlert           = document.getElementById('event-date-alert')
let eventFinalizeAlert       = document.getElementById('event-finalize-alert')
let birthAlert               = document.getElementById('birth-alert')
let ageAlert                 = document.getElementById('age-alert')
let nameAlert                = document.getElementById('name-alert')
let speakersAlert            = document.getElementById('speakers-alert')
let totalParticipantsAlert   = document.getElementById("message-alert")

//Speakers List
let speakers = [] 

//Events List
let events = []

//Participants List 
let participants = []

 
//Defines maximum participants limit - Not includes maximum
const MAXPARTICIPANTSLIMIT = 13

//Defines total participants
let total =  participants.length || 0


 //Loads data from localStorage
 if(localStorage.hasOwnProperty("speakers")){
   speakers = JSON.parse(localStorage.getItem("speakers"))
   speakers.sort()
   loadSpeakersAtCombo()
 }


 if(localStorage.hasOwnProperty("events")){
    events   = JSON.parse(localStorage.getItem("events"))
    loadEventsAtCombo()
 }


 if(localStorage.hasOwnProperty("participants")){
     participants = JSON.parse(localStorage.getItem("participants"))
 }


//Updates total participants
updateTotalParticipants()


//Components events 
buttonSpeaker.addEventListener('click', saveSpeaker)
buttonReturn.addEventListener('click', returnToSpeakers)
buttonForward.addEventListener('click', forwardToEvents)
buttonFinalizeEvent.addEventListener('click', finalizeEvent)
eventNameInput.addEventListener('keyup', checkEventName)
participantNameInput.addEventListener('keyup', checkParticipantName)
speakerInput.addEventListener('keyup', checkSpeakerName)
buttonSubmitParticipant.addEventListener('click', submitParticipant)
buttonGoAhead.addEventListener('click', goAhead )

eventDatepicker.addEventListener("keydown", function(e){
    e.preventDefault()
    return false
})

birthDatepicker.addEventListener("keydown", function(e){
    e.preventDefault()
    return false
})


//Nav events
speakerNav.addEventListener('click', goToSpeaker)
eventNav.addEventListener('click', goToEvent)
participantNav.addEventListener('click', goToParticipant)
listNav.addEventListener('click', goToList)
clearAllNav.addEventListener('click', clearAll)


$(function(){

    //Datepickers configuration
    $("#event-date").datepicker({
        dateFormat: 'dd/mm/yy',
        changeYear: true,
        changeMonth: true,
        dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
        dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
        dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
        monthNames: [  'Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set', 'Out','Nov','Dez'],
        nextText: 'Próximo',
        prevText: 'Anterior',
        yearRange: '1950:2050',
        onSelect: function(){
            selectedEventDate = $(this).datepicker("getDate")
            checkEventDate()
        }
       
    })

     $("#birth").datepicker({
            dateFormat: 'dd/mm/yy',
            changeYear: true,
            changeMonth: true,
            dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
            dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
            dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
            monthNames: [  'Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
            monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set', 'Out','Nov','Dez'],
            nextText: 'Próximo',
            prevText: 'Anterior',
            yearRange: '1920:2021',
            onSelect: function(){
                selectedBirth = $(this).datepicker("getDate")
                checkBirthDate()
            }
           
        })
})



function updateTotalParticipants(){
    total =  participants.length || 0
    totalEl.innerHTML = total
}

//Nav Methods
function goToSpeaker(){
   showSpeakersBlock()
   hideEventsBlock()
   hideParticipantsBlock()
   hideListBlock()
   clearSpeakerField()
   
}

function goToEvent(){  
    showEventsBlock()
    hideSpeakersBlock()
    hideParticipantsBlock()
    hideListBlock()
    clearEventFields()
}

function goToParticipant(){
   showParticipantsBlock()
   hideEventsBlock()
   hideSpeakersBlock()
   hideListBlock()
   clearParticipantsFields()
   hideElement(totalParticipantsAlert)
}

function goToList(){
    showListBlock()
    hideSpeakersBlock()
    hideEventsBlock()
    hideParticipantsBlock()
    loadTable()
    
}

function clearAll(){
    localStorage.clear()
    location.reload()
}


//General Funtionalities
function saveSpeaker(){

    removeAlert(speakersAlert)

    if(checkSpeakerName()){
        speakers.push(speakerInput.value)
        localStorage.setItem("speakers", JSON.stringify(speakers))
        showAlert("Palestrante cadastrado", "success", speakersAlert)

        setTimeout(() => {         
            removeAlert(speakersAlert)  
        }, 3000);

        loadSpeakersAtCombo()
        clearSpeakerField()
    }
    else{
        alert("Rever o campo nome do palestrante")
    }

}

function returnToSpeakers(){
    hideEventsBlock()
    showSpeakersBlock()
    removeAlert(speakersAlert)
    clearSpeakerField()
}

function forwardToEvents(){
    showEventsBlock()
    hideSpeakersBlock()
    clearEventFields()
    removeAlert(eventNameAlert)
    removeAlert(eventDateAlert)
}

function forwardToParticipants(){
    showParticipantsBlock()
    hideEventsBlock()
    clearParticipantsFields()
    hideElement(totalParticipantsAlert)
}

function goAhead(){
    forwardToParticipants()
}

//Saves an event
function finalizeEvent(){
   
    if(!checkEventName() || !checkEventDate() || !isSelectedElement(eventSpeakerSelect)){
        alert("Um ou mais campos precisam ser revistos!")
    }
    else{
     
           if(!hasCommonValue(eventNameInput.value)){

            eventName =  eventNameInput.value.trim()
            selectedEventDate =  showFormattedDate(selectedEventDate)
            selectedEventSpeaker = getSelectedEventSpeaker()

               if(localStorage.hasOwnProperty("events"))
                  events = JSON.parse(localStorage.getItem("events"))

               events.push({
                event: eventName, eventDate: selectedEventDate, speakerName: selectedEventSpeaker
              })

              localStorage.setItem("events", JSON.stringify(events))
              loadEventsAtCombo()
              clearEventFields()
              removeAlert(nameAlert)
              removeAlert(eventDateAlert)
              forwardToParticipants()
             

        }else{
              showAlert("Evento já existe cadastrado! Insira outro", "danger", eventNameAlert)

              setTimeout(() => {
                  removeAlert(eventNameAlert)
              }, 3000);

              removeAlert(eventDateAlert)

        }
    }   
}

//Saves a participant
function submitParticipant(){

    if((total + 1) >= MAXPARTICIPANTSLIMIT){
        showElement(totalParticipantsAlert)
        playErrorSound()
    }
    else if(!checkParticipantName() || !checkBirthDate() || !isSelectedElement(eventNameSelect)){
        alert("Um ou mais campos precisam ser revistos!")
    }
    else{
       name = participantNameInput.value.trim()
       birth = showFormattedDate(selectedBirth)
       myEvent = getSelectedEvent()

       if(localStorage.hasOwnProperty("participants"))
         participants = JSON.parse(localStorage.getItem("participants"))

       participants.push({
           nameParticipant: name, birthParticipant: birth, eventParticipant: myEvent
       })

       localStorage.setItem("participants", JSON.stringify(participants))
       loadToast()
       playSuccessSound()
       showListBlock()
       hideParticipantsBlock()
       loadTable()
       updateTotalParticipants()
     
    }
}

function playSuccessSound(){
    let audio = new Audio("sound/som.mp3")
    audio.play()
}

function playErrorSound(){
    let audio = new Audio("sound/error.mp3")
    audio.play()
}

function loadToast(){
    var toast = new bootstrap.Toast(toastLive)
    localStorage.setItem("events", JSON.stringify(events))
    totalEl.innerHTML = ++total
    toast.show()
   
    setTimeout(() => {
          goToList()
    }, 3000);
}


function checkSpeakerName(){
    removeAlert(speakersAlert)

    if(speakerInput.value.trim().length < 3){
        showAlert("O nome do palestrante deve possuir no mínimo 3 caracteres", "danger", speakersAlert) 
        return false      
    }
    return true
}

function checkEventName(){
    removeAlert(eventNameAlert)

    if(eventNameInput.value.trim().length < 3){
        showAlert("O nome do evento deve possuir no mínimo 3 caracteres", "danger", eventNameAlert) 
        return false      
    }
    return true
}

function checkParticipantName(){
    removeAlert(nameAlert)

    if(participantNameInput.value.trim().length < 3){
        showAlert("O nome do participante deve possuir no mínimo 3 caracteres", "danger", nameAlert) 
        return false      
    }
    return true
}

function checkEventDate(){

    removeAlert(eventDateAlert)
    
    if(selectedEventDate == undefined || selectedEventDate == null || eventDatepicker.value == ''){
        showAlert("A data deve ser selecionada", "danger", eventDateAlert)
        return false
    }
       
    eventDate = moment(selectedEventDate).format("YYYY-MM-DD")

    timeDiff = moment(eventDate, "YYYY-MM-DD").diff(moment(today, "YYYY-MM-DD"))
       
    if(timeDiff > 0){
       return true
    }
    else{
        showAlert("Data de evento inválida!", "danger", eventDateAlert) 
        return false
    }

}

function isSelectedElement(element){
   if(element.options[element.selectedIndex] != undefined){
      return true
   }

   return false
}

function checkBirthDate(){

    removeAlert(birthAlert)
    removeAlert(ageAlert)
 
    if(selectedBirth == undefined || selectedBirth == null || birthDatepicker.value == ''){
        showAlert("A data deve ser selecionada", "danger", birthAlert)
        return false
    }

    let birthday = moment(selectedBirth).format("YYYY-MM-DD")

    timeDiff = moment(today, "YYYY-MM-DD").diff(moment(birthday, "YYYY-MM-DD"))

    age  = Number.parseInt(moment.duration(timeDiff).asYears()).toFixed(0)
    
    if(timeDiff <= 0){
       showAlert("Data de nascimento inválida!", "danger", birthAlert)
       return false

    }else{
        if(age >= 18){
           return true        
        }
        else{
            showAlert("Cadastro não é permitido pela idade!", "danger", ageAlert)
            return false  
        }
    }
}


function getSelectedEventSpeaker(){

    selectedEventSpeaker = eventSpeakerSelect.options[eventSpeakerSelect.selectedIndex].value
    return selectedEventSpeaker
}

function getSelectedEvent(){

    selectedEvent = eventNameSelect.options[eventNameSelect.selectedIndex].value
    return selectedEvent
}

function showAlert(message, type, destinationElement){
    let divContainer = document.createElement("div")
    divContainer.classList.add("alert")
    divContainer.classList.add("alert-" + type)
    divContainer.style.marginTop = "10px"

    let content = document.createTextNode(message)
    divContainer.appendChild(content)
    destinationElement.appendChild(divContainer)
}

function removeAlert(destinationElement){
    if(destinationElement.hasChildNodes())
       destinationElement.firstChild.remove()
}

function showElement(element){
   
    if(element.style.display == "none")
      element.style.display =  "block"
    
}

function hideElement(element){
    if(element.style.display == "block")
       element.style.display = "none"
}


function loadSpeakersAtCombo(){
    clearSelect("event-speaker")
    speakers.sort()
    speakers.forEach((speaker) => {
        const optionEl = document.createElement('option')
        optionEl.setAttribute("value", speaker)
        
        const textNode = document.createTextNode(speaker)
        optionEl.appendChild(textNode)

        eventSpeakerSelect.appendChild(optionEl)
    })
}

function loadEventsAtCombo(){
    clearSelect("event-name-select")
    events.forEach((ev) => {
        const optionEl = document.createElement('option')
        optionEl.setAttribute("value", ev.event)
        
        const textNode = document.createTextNode(ev.event)
        optionEl.appendChild(textNode)

        eventNameSelect.appendChild(optionEl)
    })
}

function hasCommonValue(userValue){
    let result = events.some(item => item.event == userValue)
    return result
}


//Clear elements
function clearSpeakerField(){
    speakerInput.value = ''
    speakerInput.focus()
}

function clearEventFields(){
      eventNameInput.value = ''
      eventNameInput.focus()
      $('#event-date').datepicker('setDate', null)
}

function clearParticipantsFields(){
      participantNameInput.value = ''
      participantNameInput.focus()
      $('#birth').datepicker('setDate', null)
}


function clearSelect(id){
    $("#" + id).empty();
}

function clearTable(id){
    $("#" + id).empty()
}

function clearTableList(){
    $("table").detach()
}

function showFormattedDate(selectedDate){

    let formattedDate = moment(selectedDate).format("DD/MM/YYYY")
    return formattedDate   
}


//Showing/Hiding blocks
function showEventsBlock(){
   eventsBlock.style.display = "block"
}

function hideEventsBlock(){
   eventsBlock.style.display = "none" 
}

function showSpeakersBlock(){
    speakersBlock.style.display = "block"
}

function hideSpeakersBlock(){
    speakersBlock.style.display = "none"
}


function showParticipantsBlock(){
    participantsBlock.style.display = "block"
}

function hideParticipantsBlock(){
    participantsBlock.style.display = "none"
}

function showListBlock(){
    listBlock.style.display = "block"
}

function hideListBlock(){
    listBlock.style.display = "none"
}


function getEventParticipants(){


    let eventParticipants = []

   //Create an object with event name and empty name participants  array
    events.forEach((ev) => {
        let name = ev.event
        eventParticipants.push({eventName: name, participants: []})

    })

    //Fill participants name in the array eventParticipants
    participants.forEach((p) => {
        events.forEach((ev) => {
            if(p.eventParticipant == ev.event){
               eventParticipants.forEach((item) => {
                   if(item.eventName == ev.event){
                       item.participants.push(p.nameParticipant)
                   }
               })
            }
        })
   })

   //Join objects with equals properties names
   let joined = eventParticipants.map(function(e) {
    return Object.assign({}, e, events.reduce(function(acc, val) {
        if (val.event == e.eventName) {
            return val
        } else {
            return acc
        }
    }, {}))
});

   return joined
}



function createTableTitle(){

 
    let containerFluid = document.getElementById('list')
    

    let table = document.createElement('table')
    table.classList.add('table')
    table.classList.add('table-striped')
    table.style.padding = '8px'
   
    let rowTitle = document.createElement('tr')


    //Create columns titles
    let titleEvent = document.createElement('th')
    let titleDate = document.createElement('th')
    let titleSpeaker = document.createElement('th')


     //Create textNodes titles
    let textNodeEventTitle = document.createTextNode('Evento')
    let textNodeDateTitle = document.createTextNode('Data')
    let textNodeSpeakerTitle = document.createTextNode('Palestrante')

    //Join text to column title
    titleEvent.appendChild(textNodeEventTitle)
    titleDate.appendChild(textNodeDateTitle)
    titleSpeaker.appendChild(textNodeSpeakerTitle)

    //Join titles columns to row
    rowTitle.appendChild(titleEvent)
    rowTitle.appendChild(titleDate)
    rowTitle.appendChild(titleSpeaker)

    table.appendChild(rowTitle)

    //Join table to container
    containerFluid.appendChild(table)

    return table

}

function createTable(event, date, speaker, participantsList = []){

   
    let containerFluid = document.getElementById('list')
    let columnThree


    let table = document.createElement('table')

    table = createTableTitle()

     //Create rows  content
     let rowOne = document.createElement('tr')
     let rowTwo = document.createElement('tr')
     let rowThree = document.createElement('tr')
     rowThree.classList.add('p')
    
     
     //Create columns content
     let columnEvent = document.createElement('td')
     columnEvent.style.wordWrap = "break-word"
     columnEvent.style.minWidth = "160px"
     columnEvent.style.maxWidth = "160px"

     let columnDate = document.createElement('td')
     columnDate.style.wordWrap = "break-word"
     columnDate.style.minWidth = "160px"
     columnDate.style.maxWidth = "160px"

     let columnSpeaker = document.createElement('td')
     columnSpeaker.style.wordWrap = "break-word"
     columnSpeaker.style.minWidth = "160px"
     columnSpeaker.style.maxWidth = "160px"

     
     let columnPeople = document.createElement('td')
     columnPeople.innerHTML = '<h6> Participantes: </h6>'

     //Create TextNodes
     let columnTextNodeEvent = document.createTextNode(event)
     let columnTextNodeDate = document.createTextNode(date)
     let columnTextNodeSpeaker = document.createTextNode(speaker) 
 
 
     participantsList.forEach((item) => {
        
        columnThree = document.createElement('td') 
        columnThree.style.wordWrap = "break-word"
        columnThree.style.minWidth = "160px"
        columnThree.style.maxWidth = "160px"

        textNodeColumnThree = document.createTextNode(item)
        columnThree.appendChild(textNodeColumnThree)
        rowThree.appendChild(columnThree)
        columnPeople.appendChild(rowThree)
        columnPeople.setAttribute('colspan', 3)
         
     })
 
     
     //Join text to column
     columnEvent.appendChild(columnTextNodeEvent)
     columnDate.appendChild(columnTextNodeDate)
     columnSpeaker.appendChild(columnTextNodeSpeaker)
    
 
     //Join column to row
     rowOne.appendChild(columnEvent)
     rowOne.appendChild(columnDate)
     rowOne.appendChild(columnSpeaker)
     rowTwo.appendChild(columnPeople)

     //Join row to table
     table.appendChild(rowOne)
     table.appendChild(rowTwo)
 

     //Join table to container
     containerFluid.appendChild(table)
 
}


function loadTable(){
    
    clearTableList()
    let content = getEventParticipants()
    
    content.forEach((item) => {
        createTable(item.event, item.eventDate, item.speakerName, item.participants)
    })
}


