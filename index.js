// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-bef62-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")


const inputEl = document.getElementById("input-el")
const fromInputEl = document.getElementById("from-input")
const toInputEl = document.getElementById("to-input")
const endorsementsUlEl = document.getElementById("endorsments-ul")
const publishBtnEl = document.getElementById("publish-btn")

onValue(endorsementsInDB, function(snapshot) {
    
    if (snapshot.exists()) {
        const endorsementsArray = Object.entries(snapshot.val())
            
        endorsementsUlEl.innerHTML = ""
        
        for (let i = 0; i < endorsementsArray.length; i++){
            addEndorsementToUlEl(endorsementsArray[i])
        }
    } else {
        endorsementsUlEl.innerHTML = "No endorsements here...yet"
    }
    
})

publishBtnEl.addEventListener("click", function(){
    let inputValue = inputEl.value
    let inputFrom = fromInputEl.value
    let inputTo = toInputEl.value
    
    let endorsementObject = {
        message: inputValue,
        sender: inputFrom,
        receiver: inputTo
    }
  
    clearInput()
    push(endorsementsInDB, endorsementObject)
    
})

function addEndorsementToUlEl(endorsement){
    
    const endorsementID = endorsement[0]
    const endorsementObject = endorsement[1]
    const endorsementMessage = endorsementObject.message
    const endorsementReceiver = endorsementObject.receiver
    const endorsementSender = endorsementObject.sender
    
    let li = document.createElement("li")
  
    li.innerHTML = `
        <p class="endorsement-text bold">To ${endorsementReceiver}</p>
        <p class="endorsement-text endorsement-message">${endorsementMessage}</p>
        <p class="endorsement-text bold">From ${endorsementSender}</p>
    `
    li.addEventListener("dblclick", function(){
        const exactLocationEndorsementInDB = ref(database, `endorsements/${endorsementID}`) 
        remove(exactLocationEndorsementInDB)
    })
    endorsementsUlEl.append(li)
}

function clearInput(){
    inputEl.value = ""
    fromInputEl.value = ""
    toInputEl.value = ""
}