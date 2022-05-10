const socket = io.connect();

/* CARGA DE LISTADO DE PRODUCTOS */

const chatForm = document.getElementById('form');

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;
  const foto = document.getElementById('foto').value;
  
  socket.emit('new-product', {nombre, precio, foto});
});

socket.on('productos', (productos) => {
    
  console.log(productos);
    
  const productList = productos.map((product) => `
  <tr>
    <td>
      ${product.nombre}
    </td>
    <td>
      ${product.precio}
    </td>
    <td>
      <img src="${product.foto}" alt="" width="50" height="50">
    </td>
  </tr>
  `).join(' ');
  console.log(productList)
  const list = document.getElementById('real-time-products');

  list.innerHTML = productList;
})

/* CARGA CHAT */

const form = document.getElementById('chat_form');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('username').value;
  const texto = document.getElementById('texto').value;
  
  socket.emit('new-message', {email, texto});
});

socket.on('messages', (messages) => {
  const mensajeList = messages.map((message) =>`
        <div>
            <strong style="color:blue">${message.email}</strong> <em style="color:brown">[${message.fechaHora}]</em>:
            <em style="color:green">${message.texto}</em> 
        </div>
        `).join(' ');
  const renderMensajes = document.getElementById('lista_mensaje_final');

  renderMensajes.innerHTML = mensajeList;
})