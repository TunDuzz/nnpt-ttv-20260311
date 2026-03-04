var express = require('express');
var router = express.Router();
let { dataUser, dataRole } = require('../utils/data');

router.get('/', function (req, res, next) {
  let result = dataUser.filter(e => !e.isDeleted);
  res.send(result);
});

router.get('/:username', function (req, res, next) {
  let username = req.params.username;
  let result = dataUser.filter(e => e.username == username && !e.isDeleted);
  if (result.length) {
    res.send(result[0]);
  } else {
    res.status(404).send({ message: "User NOT FOUND" });
  }
});

router.post('/', function (req, res, next) {
  let roleObj = null;
  if (req.body.roleId) {
    let r = dataRole.filter(ro => ro.id == req.body.roleId && !ro.isDeleted);
    if (r.length) {
      roleObj = r[0];
    }
  } else if (req.body.role) {
    roleObj = req.body.role;
  }

  let newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl || "https://i.sstatic.net/l60Hf.png",
    status: req.body.status !== undefined ? req.body.status : true,
    loginCount: 0,
    role: roleObj,
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  };
  dataUser.push(newUser);
  res.send(newUser);
});

router.put('/:username', function (req, res, next) {
  let username = req.params.username;
  let result = dataUser.filter(e => e.username == username && !e.isDeleted);
  if (result.length) {
    let user = result[0];
    let keys = Object.keys(req.body);
    for (const key of keys) {
      if (key !== 'username' && key !== 'creationAt' && key !== 'roleId' && key !== 'role') {
        user[key] = req.body[key];
      }
    }
    if (req.body.roleId) {
      let r = dataRole.filter(ro => ro.id == req.body.roleId && !ro.isDeleted);
      if (r.length) {
        user.role = r[0];
      }
    } else if (req.body.role) {
      user.role = req.body.role;
    }
    user.updatedAt = new Date(Date.now());
    res.send(user);
  } else {
    res.status(404).send({ message: "User NOT FOUND" });
  }
});

router.delete('/:username', function (req, res, next) {
  let username = req.params.username;
  let result = dataUser.filter(e => e.username == username && !e.isDeleted);
  if (result.length) {
    let user = result[0];
    user.isDeleted = true;
    user.updatedAt = new Date(Date.now());
    res.send(user);
  } else {
    res.status(404).send({ message: "User NOT FOUND" });
  }
});

module.exports = router;
