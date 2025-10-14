import express from 'express';
import { mongoose } from 'mongoose';
import { User } from './models/User.model.js';
import { Post } from './models/Post.model.js';
import { validatePost } from './validators/validatePost.js';
import cors from 'cors';

const app = express()
const port = 3000

//url para la base de datos
const connectionURL = "DatabaseConnection"; // Change this based on your database connection

mongoose.connect(connectionURL)
.then(() => {
  console.info("connected to MongoDB");
})
.catch((error) => {
  console.log(error)
  console.error("error connecting to MongoDB:", error.message);
});

// rutas para el api
const loginPath = '/login'
const registerPath = '/register'
const PostPath = '/post'
const PostPathWithID = '/post/:postId'
const washost = '/post/:postId/wasHost'

// Middleware para analizar JSON
app.use(express.json())
app.use(cors())

//para los usuarios en la base de datos
app.get('/', (req, res) => {

  const user = {
    name : 'User',
    email: 'user@gmail.com',
  }
  res.send(user)
})

//para el login
app.post(loginPath, async(request, response)=>{

  const {email,password} = request.body 
  const user = await User.findOne({email})

  const exists = user!=null
  if(!exists){
    return response.status(401).json({
      error:'User does not exist'
    })
  }

  const passwordIsCorrect = password === user.password

  if(!passwordIsCorrect){
    return response.status(401).json({
      error:'Invalid email or password'
    })
  }

  const userData = {
    id:user.id,
    email:user.email,
    firstname:user.firstname,
  }

  response
  .status(200)
  .send(userData)
})

//para el registro
app.post(registerPath, async(request, response)=>{
    const email = request.body.email
    const password = request.body.password
    const firstname = request.body.firstname
    const lastname = request.body.lastname
    const phone = request.body.phone

    try {
      // Verifica si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return response.status(400).json({ message: 'El correo ya está registrado' });
      }
    
    const newUser = new User({
      firstname,
      lastname,
      phone,
      email,
      password
    });

    await newUser.save();
    response.status(201).send({ message: 'Usuario registrado exitosamente' });
    
    } 
    catch (error) {
      console.error("Error al registrar usuario:", error);
      response.status(500).send({ message: 'Error en el servidor' });
    }
})

//para la funcion de publicar, hacer una publicacion
app.post(PostPath, async(request, response)=>{
  const title = request.body.title
  const address = request.body.address
  const author = request.body.author
  const likes = request.body.likes
  const description = request.body.description
  const numberOfRooms = request.body.numberOfRooms
  const isHouse = request.body.isHouse
  const isDepartment = request.body.isDepartment
  const hasWaterService = request.body.hasWaterService
  const hasGasService = request.body.hasGasService
  const hasInternetService = request.body.hasInternetService
  const hasElectricService = request.body.hasElectricService
  const hasPhone = request.body.hasPhone
  const hasParking = request.body.hasParking
  const photos = request.body.photos

  const post = {
    title,
    address,
    author,
    likes,
    description,
    numberOfRooms,
    isHouse,
    isDepartment,
    hasWaterService,
    hasGasService,
    hasInternetService,
    hasElectricService,
    hasPhone,
    hasParking,
    photos,
  }

  const isValid = validatePost(post)
  console.log(isValid)
  
  const newPost = new Post({
    title,
    address,
    author,
    likes,
    description,
    numberOfRooms,
    isHouse,
    isDepartment,
    hasWaterService,
    hasGasService,
    hasInternetService,
    hasElectricService,
    hasPhone,
    hasParking
  });

const created = await newPost.save();
response.status(201).json(created);
});

app.get(PostPath, async(req, res) => {
  const posts = await Post.find({});

  res.send(posts);
});

//para los comentarios
app.put(PostPathWithID, async(request, response)=>{
  const { postId } = request.params;
  const comment = request.body.comment
  const author = request.body.author

  try {
    const post = await Post.findById(postId); // Find the document
    if (!post) {
      response.status(401).send({message:'Post not found'})
    }

    post.comments.push({comment,author})
    
    const updatedPost = await post.save(); // Save changes
    response.status(200).send(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error);
    response.status(400).send({message:'Unable to update post comment'})
  }
})

//verificación de usuario si ha rentado
app.put(washost, async(request, response)=>{
  const { postId } = request.params;
  const hostId=request.body.hostId

  try {
    const post = await Post.findById(postId); // Find the document
    if (!post) {
      response.status(401).send({message:'Post not found'})
    }

    post.hosts.push(hostId)
    
    const updatedPost = await post.save(); // Save changes
    response.status(200).send(updatedPost)
  } catch (error) {
    console.error('Error:', error);
    response.status(400).send({message:'Unable to update post host'})
  }
})

// Ruta de búsqueda en Express --------------------------- usa query params-------------------------
app.get('/search', async (req, res) => {
  try {
    // Extracción de parámetros de búsqueda desde la query string
    const { search, address, numberOfRooms, isHouse, isDepartment, hasWaterService, hasGasService, hasInternetService, hasElectricService, hasPhone, hasParking } = req.query;

    // Construcción de un objeto de consulta
    const query = {};

    // Búsqueda por texto en múltiples campos
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },// Busca en title
        { address: { $regex: search, $options: "i" } }, // Busca en address    
        { description: { $regex: search, $options: "i" } } // Busca en description
      ];
    }

    // Filtro por dirección específica (opcional)
    if (address) {
      query.address = { $regex: address, $options: "i" }; // Busca específicamente en el campo address
    }

    // Aplicar filtros condicionalmente
    if (numberOfRooms) {
      query.numberOfRooms = parseInt(numberOfRooms);
    }
    if (isHouse) {
      query.isHouse = isHouse === 'true';
    }
    if (isDepartment) {
      query.isDepartment = isDepartment === 'true';
    }
    if (hasElectricService) {
      query.hasElectricService = hasElectricService === 'true';
    }
    if (hasGasService) {
      query.hasGasService = hasGasService === 'true';
    }
    if (hasInternetService) {
      query.hasInternetService = hasInternetService === 'true';
    }
    if (hasPhone) {
      query.hasPhone = hasPhone === 'true';
    }
    if (hasParking) {
      query.hasParking = hasParking === 'true';
    }
    if (hasWaterService) {
      query.hasWaterService = hasWaterService === 'true';
    }

    // Consultar la base de datos con los filtros aplicados
    const posts = await Post.find(query);
    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({ message: 'Error al buscar inmuebles', error: error.message });
  }
});


//arranca el servidor----------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`
    Server app listening on port ${port}`)
})

//---------------------favoritos  ----------------------------------------------
// Ruta para añadir una publicación a favoritos
app.post('/favorites', async (req, res) => {
  try {
    const { userId, postId } = req.body;

    // Verificar si el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el post existe
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    // Verificar si el post ya está en favoritos
    if (user.favorites.includes(postId)) {
      return res.status(400).json({ message: 'El post ya está en favoritos' });
    }

    // Agregar el post a los favoritos del usuario
    user.favorites.push(postId);
    await user.save();

    res.status(200).json({ message: 'Post añadido a favoritos', favorites: user.favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar a favoritos', error: error.message });
  }
});

app.get('/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar al usuario y popular los favoritos
    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener favoritos', error: error.message });
  }
});

app.delete('/favorites', async (req, res) => {
  try {
    const { userId, postId } = req.body;

    // Verificar si el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Eliminar el post de la lista de favoritos
    user.favorites = user.favorites.filter(fav => fav.toString() !== postId);
    await user.save();

    res.status(200).json({ message: 'Post eliminado de favoritos', favorites: user.favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar de favoritos', error: error.message });
  }
});
//---------------------favoritos----------------------------------------------

//---------------------valoraciones----------------------------------------------
app.post('/rate/:postId', async (req, res) => {
  try {
    const { rating } = req.body; // La puntuación enviada por el usuario (1-5)
    const { postId } = req.params; // ID de la publicación a valorar

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La valoración debe estar entre 1 y 5' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    // Actualizar el promedio de valoraciones
    const newTotalRatings = post.totalRatings + 1;
    const newAverageRating = ((post.averageRating * post.totalRatings) + rating) / newTotalRatings;

    post.averageRating = newAverageRating;
    post.totalRatings = newTotalRatings;
    await post.save();

    res.status(200).json({ message: 'Valoración registrada', averageRating: post.averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar la valoración', error: error.message });
  }
});
//-------ver en front--------------------
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las publicaciones', error: error.message });
  }
});

//---------------------cuenta----------------------------------------------
app.get('/account', (req, res) => {
  
  function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      // Si el usuario está autenticado, pasa al siguiente middleware
      return next();
    }
    // Si no está autenticado, redirige al inicio de sesión
    res.redirect('/login');
  }
});
