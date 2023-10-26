const { where } = require("sequelize");
const User = require("../models/User");

const bcrypt = require("bcryptjs");

module.exports = class Authenticate {
  static login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash("message", "o e-mail não está cadastrado");
      res.render("auth/login");
      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.senha);

    if (!passwordMatch) {
      req.flash("message", "a senha está incorreta! tente novamente!");
      res.render("auth/login");
      return;
    }

    req.session.userid = user.id;
    req.flash("message", "sessão iniciada com seucesso");
    req.session.save(() => {
      console.log("sessão criada");
      res.redirect("/");
    });
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerCreate(req, res) {
    const { name, email, password, confirmaPassword } = req.body;

    if (password != confirmaPassword) {
      req.flash("message", "as senhas não são iguais, tentem novamente!");
      res.render("auth/register");
      return;
    }

    const checkUser = await User.findOne({ where: { email: email } });

    if (checkUser) {
      req.flash("message", "o e-mail já está cadastrasdo");
      res.render("auth/register");
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = { name, email, senha: hashedPassword };

    try {
      const createUser = await User.create(user);
      //iniciando ja sessão
      req.session.userid = createUser.id;
      req.flash("message", "registrado com sucesso!");
      req.session.save(() => {
        console.log("sessão criada");
        res.redirect("/");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
