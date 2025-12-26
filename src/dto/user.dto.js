export class userDto {
constructor(user){
    this.id = user.id
    this.email = user.email
    this.name = user.name
    this.createdAt = user.createdAt
}

// transformation des données en liste d'utilisateur ou utilisateur
static transformation(data){
    if(Array.isArray(data)){
        return data.map(user=> new userDto(user))
    }
    return new userDto(data);
}
}