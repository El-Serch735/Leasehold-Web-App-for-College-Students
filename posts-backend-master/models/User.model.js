import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
  email: {
    type:String,
    required:true,
    unique:true
  },
  password: {
    type:String,
    required:true,
    minLength: 8,
  },
  firstname: {
    type:String,
    required:true,
    minLength: 3,
  },
  lastname: {
    type:String,
    required:true,
    minLength: 3,
  },
  phone: {
    type:String,
    required:false,
    minLength: 3,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post' // Reference to the Post model
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

export {User}