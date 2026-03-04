var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../utils/data');

router.get('/', function (req, res, next) {
    let result = dataRole.filter(e => !e.isDeleted);
    res.send(result);
});

router.get('/:id', function (req, res, next) {
    let id = req.params.id;
    let result = dataRole.filter(e => e.id == id && !e.isDeleted);
    if (result.length) {
        res.send(result[0]);
    } else {
        res.status(404).send({ message: "Role NOT FOUND" });
    }
});

router.get('/:id/users', function (req, res, next) {
    let id = req.params.id;
    let role = dataRole.filter(e => e.id == id && !e.isDeleted);
    if (role.length) {
        let result = dataUser.filter(e => e.role && e.role.id == id && !e.isDeleted);
        res.send(result);
    } else {
        res.status(404).send({ message: "Role NOT FOUND" });
    }
});

router.post('/', function (req, res, next) {
    // Auto generate ID like r1, r2, r3...
    let maxId = dataRole.reduce((max, role) => {
        let num = parseInt(role.id.replace('r', '')) || 0;
        return num > max ? num : max;
    }, 0);
    let newId = "r" + (maxId + 1);

    let newRole = {
        id: newId,
        name: req.body.name,
        description: req.body.description,
        creationAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
    };
    dataRole.push(newRole);
    res.send(newRole);
});

router.put('/:id', function (req, res, next) {
    let id = req.params.id;
    let result = dataRole.filter(e => e.id == id && !e.isDeleted);
    if (result.length) {
        let role = result[0];
        let keys = Object.keys(req.body);
        for (const key of keys) {
            if (role[key] !== undefined && key !== 'id' && key !== 'creationAt') {
                role[key] = req.body[key];
            } else if (role[key] === undefined && key !== 'id' && key !== 'creationAt') {
                role[key] = req.body[key];
            }
        }
        role.updatedAt = new Date(Date.now());
        res.send(role);
    } else {
        res.status(404).send({ message: "Role NOT FOUND" });
    }
});

router.delete('/:id', function (req, res, next) {
    let id = req.params.id;
    let result = dataRole.filter(e => e.id == id && !e.isDeleted);
    if (result.length) {
        let role = result[0];
        role.isDeleted = true;
        role.updatedAt = new Date(Date.now());
        res.send(role);
    } else {
        res.status(404).send({ message: "Role NOT FOUND" });
    }
});

module.exports = router;
