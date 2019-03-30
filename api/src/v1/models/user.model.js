export default class User {
    constructor(id, email, firstName, lastName, password, type, isAdmin) {
        this.id = id;
        this.email = email;
        this.firstName = firstName; 
        this.lastName = lastName;
        this.password = password;
        this.type = type;
        this.isAdmin = isAdmin;
    }
}
