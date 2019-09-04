const db = require("../models");
const Task = db.Task;

module.exports = {
  findAll: function (req, res) {
    Task
      .find(req.query)
      .sort({ date: -1 })
      // populate all users, clients and notes associated with tasks
      .populate({
        path: 'user client note',
        populate: {
          path: 'user'
        },
        populate: {
          path: 'client'
        },
        populate: {
          path: 'note'
        }
      })
      .then(dbModel => {
        res.status(200).json({
          tasks: dbModel.map(model => {
            return {
              _id: model._id,
              user: model.user,
              client: model.client,
              assignDate: model.assignDate,
              dueDate: model.dueDate,
              completedDate: model.completedDate,
              assignedStatus: model.assignedStatus,
              completionStatus: model.completionStatus,
              description: model.description,
              note: model.note,
            };
          })
        })
      })
      .catch(err => res.status(422).json(err));
  },
  findById: function (req, res) {
    Task
      .findById(req.params.id)
      .populate({
        path: 'user client note',
        populate: {
          path: 'user'
        },
        populate: {
          path: 'client'
        },
        populate: {
          path: 'note'
        }
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function (req, res) {
    Task
      .create(req.body)
      // associate client ID with task
      .then(function (dbClient) {
        return db.Client.findOneAndUpdate({}, { $push: { client: dbClient._id } }, { new: true });
      })
      // associate user ID with task
      .then(function (dbUser) {
        return db.User.findOneAndUpdate({}, { $push: { user: dbUser._id } }, { new: true });
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function (req, res) {
    Task
      .findOneAndUpdate({ _id: req.params.id }, req.query)
      // associate user ID with task
      .then(function (dbUser) {
        return db.User.findOneAndUpdate({}, { $push: { user: dbUser._id } }, { new: true });
      })
      // associate client ID with task
      .then(function (dbClient) {
        return db.Client.findOneAndUpdate({}, { $push: { client: dbClient._id } }, { new: true });
      })
      // associate note ID with task
      .then(function (dbNote) {
        return db.Note.findOneAndUpdate({}, { $push: { note: dbNote._id } }, { new: true });
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function (req, res) {
    Task
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};