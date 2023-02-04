const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class AuthController {

    static login(req, res){
        res.render('auth/login')
    }

    static register(req, res){
        res.render('auth/register')
    }

    static async registerPost(req, res){

        const {name, email, password, confirmpassword} = req.body

        //password match validation
        if(password != confirmpassword){
            req.flash('messageError', 'The confirmation password is diferent than password, try again!')
            res.render('auth/register')

            return
        }

        //check if user exists
        const checkIfUserExists = await User.findOne({where: {email: email}})

        if(checkIfUserExists) {
            req.flash('messageError', 'This E-mail address already exists!')
            res.render('auth/register')
        }

        //create a password
        const salt = bcrypt.genSaltSync(10)

        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }
        
        try{

            const createdUser = await User.create(user)
        
            //initialize session
            req.session.userid = createdUser.id

            req.flash('messageSuccess', 'account created successfully!')
            
            req.session.save(()=> {
                res.redirect('/')
            })
        } catch(err){
            console.log(err)
        }
    }

    static logout(req, res){
        req.session.destroy()
        res.redirect('/login')
    }

    static async loginPost(req, res){

        const{ email, password} = req.body
        
        //empty
        if(!email || !password){
            req.flash('messageError', 'empty is not allowed!')
            res.render('auth/login')
            return
        }

        //find user
        const user =await User.findOne({where: {email: email}})
        //check id password exists
        const passwordMatch = bcrypt.compareSync(password, user.password)

        //message
        if(!user || !passwordMatch){
            req.flash('messageError', 'The  email address not exists or password is wrong!')
            res.render('login')

            return
        }

        //success login
        req.session.userid = user.id

        req.flash('messageSuccess', 'Seja muito bem vindo a jallesland!')

        req.session.save(() => {
            res.redirect('/')
        })
    }
}