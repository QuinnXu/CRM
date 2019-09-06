const db = require("../models");
const Order = db.Order;

module.exports = {
  findAll: function (req, res) {
    Order
      .find(req.query)
      .sort({ created_at: -1 })
      // populate all users, clients and notes associated with order
      .populate({
        path: 'user client note product',
        populate: {
          path: 'user'
        },
        populate: {
          path: 'client'
        },
        populate: {
          path: 'note'
        },
        populate: {
          path: 'product'
        }
      })
      .then(dbModel => {
        res.status(200).json({
          orders: dbModel.map(model => {
            return {
              _id: model._id,
              product: model.product,
              user: model.user,
              lineItems: model.lineItems,
              created_at: model.created_at,
              checked_out: model.checked_out,
              completedDate: model.completedDate,
              client: model.client,
              note: model.note
            };
          })
        })
      })
      .catch(err => res.status(422).json(err));
  },
  findById: function (req, res) {
    Order
      .findById(req.params.id)
      .populate({
        path: 'user clients notes product',
        populate: {
          path: 'user'
        },
        populate: {
          path: 'client'
        },
        populate: {
          path: 'note'
        },
        populate: {
          path: 'product'
        }
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function (req, res) {
    Order
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  // if order needs to be updated after client completes order
  update: function (req, res) {
    Order
      // update product quantity
      .findOneAndUpdate({ _id: req.params.id }, req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function (req, res) {
    Order
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  getOrderTotal: function (req, res) {
    const userID = req.params.userid;
    const firstDate = req.params.firstdate;
    const secondDate = req.params.seconddate;
    console.log(userID);
    console.log(firstDate);
    console.log(secondDate);
    Order
      .find({ "created_at": { "$gte": firstDate, "$lt": secondDate } })
      .populate({
        path: 'user clients product',
        populate: {
          path: 'user'
        },
        populate: {
          path: 'client'
        },
        populate: {
          path: 'product'
        }
      })
      .sort({ 'lineItems.quantity': -1 })
      // .aggregate([{ $match: { 'user': userID } }])
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};