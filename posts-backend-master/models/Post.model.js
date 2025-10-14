import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    author: {
      type: String,
      required: true, // Ensure that each comment has an author
    },
    comment: {
      type: String,
      required: true, // Ensure each comment has content
    },
  });

const postSchema = new mongoose.Schema({
    title:{
        type:String, 
        required:true
    },
    author:{
        type:String, 
        required:true
    },
    //---------------------valoracion---------------------------------------------
    averageRating: { type: Number, default: 0 }, // Promedio de estrellas
    totalRatings: { type: Number, default: 0 },  // Número de valoraciones realizadas
    //----------------------------------------------------------------------------
    /*likes:{
        type:Number,
        default:0
    },*/
    description:{
        type:String
    },
    photos: {
        type: [String],
        default:["https://i.pinimg.com/236x/f1/bd/5b/f1bd5b2c6fb44fbee3d820fd1abd6ba0.jpg"]
    },
    address: {
        type: String,
        default: ''
    },
    isHouse: {
        type: Boolean,
        default: false
    },
    numberOfRooms: {
        type: Number,
        default: 0
      },
    isDepartment: {
        type: Boolean,
        default: false
    },
    hasWaterService: {
        type: Boolean,
        default: false
    },
    hasGasService: {
        type: Boolean,
        default: false
    },
    hasInternetService: {
        type: Boolean,
        default: false
    },
    hasElectricService: {
        type: Boolean,
        default: false
    },
    hasPhone: {
        type: Boolean,
        default: false
    },
    hasParking: {
        type: Boolean,
        default: false
    },
    hosts:{
        type:[String],
        default:[]
    },
    comments:[CommentSchema]
})

const Post = mongoose.model('Post', postSchema)

export {Post}