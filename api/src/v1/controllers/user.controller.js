import UserData from '../data/user.json';
import UserService from '../services/user.service';

/**
 * @class UserController
 * @description handles the request coming from the user route and interacts with the user service class
 * @exports UserController
 */

 class UserController {
     /**
      * 
      */
     static signUp(req, res) {
        const { user } = req.body;
        const newUser = UserService.signUp(user);
        if(newUser.error) {
            return res.status(201).send({
              status: 401,
              error: newUser.message,  
            });
        }
        return res.status(201).send({
            status: 201,
            data: newUser,  
        });
     }
 }