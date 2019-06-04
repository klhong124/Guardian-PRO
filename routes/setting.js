var express = require('express');
var router = express.Router();
var { graphql } = require('graphql');
const schema = require('../graphql/schema');
const root = require('../graphql/resolver');

router.get('/', function(req, res, next) {
	var query =  `
    query{
    user (
        _id:"${req.cookies.userID}"
    ){
        _id
        name
        username
        password
        gender
        email
        phone
    }
    }
    `;
	graphql(schema, query, root).then((response) => {
        res.render('setting', { user: response.data.user });
    });
});

router.post('/', function(req, res, next) {
    var mutation = `
    mutation{
        updateUser(
            _id:"${req.cookies.userID}",
            name:"${req.body.name}",
            password:"${req.body.password}",
            gender:"${req.body.gender}",
            email:"${req.body.email}",
            phone:${req.body.phone}
        ){
            _id
            name
            username
            password
            gender
            email
            phone
        }
    }
    `;
    graphql(schema, mutation, root).then((response) => {
        console.log(response);
        
        res.render('setting', { user: response.data.updateUser });
    });
});

module.exports = router;
