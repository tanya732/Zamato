class User {
    constructor(id, email, password, name, created_at) {
      this.id = id;
      this.email = email;
      this.password = password;
      this.name = name;
      this.created_at = created_at;
    }
  }
  
module.exports = User;
  