export const validatePost = (post) =>{
    if(post.title=='' || post.title.length<10){
        return false
    }
    else if(post.author==undefined || post.author.length<3){
        return false
    }
    else if (post.description.length > 1000){
        return false
    }
    return true
}