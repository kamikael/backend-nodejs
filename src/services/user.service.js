import {hashPassword, verification} from '#lib/password'
import {ConflictException, UnzuthorizedException, NotFoundException } from '#lib/exceptions'
import prisma from '#lib/prisma'


export class UserService {
    static async register(data){
        const {email, password, name} = data

        const existinguser = await prisma.user.findUnique({ where: {email}});
        if (existinguser){
            throw new ConflictException("Email deja utilisé");
        }  
        const hashedpassword = await hashPassword(password)
        return prisma.user.create({
            data: {email, password: hashedpassword, name}
        })
    }

static async login(email, password){
        const user = await prisma.user.findUnique({where: {email}})

        if(!user || !(await verifyPasswword(user.password, password))){
            throw new UnzuthorizedException("Identifiants invalides")
        }

        return user;
    }

static async findAll(){
    return prisma.user.findMany()
}
static async findById(id){
    const user = await prisma.user.findUnique({where : {id}})
    if(!user){
        throw new NotFoundException("utilisateur non trouvé")
    }
    return user;
}
}


