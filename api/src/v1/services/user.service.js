import UserData from '../data/user';
// console.log(Users);
//console.log(Users.users.length);

/**
 * @class UserService
 * @description handles the request coming from the user controller.
 * @exports UserController
 */

class UserService {
    /**
    * @description Create a User
    * @static 
    * @param {Object} req
    * @param {Object} res
    * @returns {Object} API response
    * @memberof UserService
    */
   static signUp(user) {
     const usersLength = UserData.users.length;
     const lastId = UserData.users[usersLength - 1].id;
     const id = lastId + 1;
     const newUser = { id, ...user };
     const Users = [...UserData.users, newUser];
     return Users;  
   }
}

export default UserService;