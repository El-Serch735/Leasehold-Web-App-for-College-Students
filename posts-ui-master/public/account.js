// Ejemplo de datos
const publications = [
  {
    user: "Fernando Avila Saldaña",
    rating: 5.0,
    address: "Eje 2 Sur la Viga 248, Artes Gráficas, Cuauhtémoc, 15830 Ciudad de México, CDMX",
    description: "Hermoso loft amueblado nuevo ideal para una persona...",
    image: "https://via.placeholder.com/200",
  },
  {
    user: "Juan Pérez",
    rating: 4.5,
    address: "Avenida Reforma 100, Ciudad de México",
    description: "Amplio departamento en el corazón de la ciudad...",
    image: "https://via.placeholder.com/200",
  },
];

const favorites = [
  {
    user: "Carlos Medina",
    rating: 4.9,
    address: "Polanco, Ciudad de México",
    description: "Hermoso departamento en una de las zonas más exclusivas...",
    image: "https://via.placeholder.com/200",
  },
];

// Referencias a elementos
const contentContainer = document.getElementById("contentContainer");
const publicacionesTab = document.getElementById("publicacionesTab");
const favoritosTab = document.getElementById("favoritosTab");

// Función para renderizar tarjetas
function renderCards(data) {
  contentContainer.innerHTML = ""; // Limpia el contenedor
  if (data.length === 0) {
    contentContainer.innerHTML = `<div class="card"><h3>No hay elementos aún.</h3></div>`;
    return;
  }

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.image}" alt="Inmueble" class="cardImage">
      <div class="cardContent">
        <h3 class="cardTitle">${item.user} ⭐ ${item.rating}</h3>
        <p class="cardAddress">${item.address}</p>
        <p class="cardDescription">${item.description}</p>
      </div>
    `;
    contentContainer.appendChild(card);
  });
}

// Eventos para cambiar de pestaña
publicacionesTab.addEventListener("click", () => {
  publicacionesTab.classList.add("activeTabButton");
  favoritosTab.classList.remove("activeTabButton");
  renderCards(publications);
});

favoritosTab.addEventListener("click", () => {
  favoritosTab.classList.add("activeTabButton");
  publicacionesTab.classList.remove("activeTabButton");
  renderCards(favorites);
});
  
  // Selecciona el botón de la casa
  document.getElementById("homeButton").addEventListener("click", function() {
    // Redirige a la página principal (en este caso, / o /posts)
      window.location.href = "/"; // O usa "/posts" si esa es la URL de publicaciones
    });

  document.getElementById("logoutBtn").addEventListener("click", function() {
    // Asumiendo que la URL de la cuenta del usuario es algo como /account
    window.localStorage.removeItem('user')
    window.location.href = '/'
  });
  
  const userData = JSON.parse(window.localStorage.getItem('user'))
  document.getElementById('userName').innerText = userData.firstname
  document.getElementById('userEmail').innerText = userData.email
  
// Renderizar publicaciones por defecto
renderCards(publications);