
// const io = require('socket.io')

const socket = io('http://localhost:8000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const imageInput = document.getElementById('image-Input')

var msg ={};

const name = prompt('What is your name?')
appendMessage('You joined', null)
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`, data.image)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`, null)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`, null)
})

document.getElementById('image-Input').addEventListener('change', function(e){
  var data = e.target.files[0];
  readThenSendFile(data);      
});

function readThenSendFile(data){

  var reader = new FileReader();
  reader.onload = function(evt){
    msg.file = evt.target.result;
    msg.fileName = data.name;
  };
  reader.readAsDataURL(data);
}


messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  const image = msg
  appendMessage(`You: ${message}`, image)
  const data = {'text':message, 'image':image}
  socket.emit('send-chat-message', data)
  messageInput.value = ''
  imageInput.value = ''
  msg = {}
})

function appendMessage(message, image) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  if(image && Object.keys(image).length !== 0 && image.constructor === Object) {
    const imageElement = document.createElement('img')
    const imageInfo = image.file.split(',')[1];
    imageElement.setAttribute('src', 'data:image/jpeg;base64,' + imageInfo);
    messageElement.append(imageElement)
  }
  
  messageContainer.append(messageElement)
}

