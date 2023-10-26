const Thought = require("../models/Thought");
const User = require("../models/User");

const { Op } = require("sequelize");

module.exports = class ThoughtController {
  static async showThoughts(req, res) {
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    let order = "DESC";

    if (req.query.order == "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }
    let thoughts = await Thought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [["createdAt", order]],
    });

    thoughts = thoughts.map((result) => result.get({ plain: true }));
    //junta tudo no mesmo array, tought e user

    let thoughtsQty = thoughts.length;
    if (thoughtsQty === 0) {
      thoughtsQty = false;
    }
    res.render("thoughts/home", { thoughts, search, thoughtsQty });
  }

  static async dashboard(req, res) {
    const userid = req.session.userid;

    const user = await User.findOne({
      where: { id: userid },
      include: Thought,
      plain: true,
    });

    if (!user) {
      res.redirect("/login");
    }

    const toughts = user.Thoughts.map((result) => result.dataValues);

    let emptyThoughts = false;

    if (toughts.length === 0) {
      emptyThoughts = true;
    }
    console.log(emptyThoughts);
    console.log(toughts);
    res.render("thoughts/dashboard", { thoughts, emptyThoughts });
  }

  static async createThought(req, res) {
    res.render("thoughts/create");
  }

  static async deleteThought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;
    try {
      await Thought.destroy({ where: { id: id, UserId: UserId } });
      req.flash("message", "pensamento removido com sucesso!");
      req.session.save(() => {
        res.redirect("/thoughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async createThoughtPost(req, res) {
    const thought = {
      title: req.body.title,
      UserId: req.session.userid,
    };
    try {
      await Thought.create(thought);
      req.flash("message", "pensamento criado com sucesso!");
      req.session.save(() => {
        res.redirect("/thoughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async editThought(req, res) {
    const id = req.params.id;
    try {
      const thought = await Thought.findOne({ where: { id: id }, raw: true });
      res.render("thoughts/editThoughts", { thought });
    } catch (err) {
      console.log(err);
    }
  }

  static async editThoughtPost(req, res) {
    const id = req.body.id;
    const thought = {
      title: req.body.title,
    };
    try {
      await Thought.update(thought, { where: { id: id } });
      req.flash("message", "pensamento atualizado com sucesso!");
      req.session.save(() => {
        res.redirect("/thoughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }
};
