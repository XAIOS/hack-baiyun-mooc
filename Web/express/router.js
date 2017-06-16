var express = require('express');
var router = express();
var query = require('body-parser');

router.use(query.urlencoded({extended:true}));

// require hack 's router file
require('/var/aios/hack/router/router')(router);

// other system 's router
router.use(express.static('/var/aios'));

router.use(function(req,res,next){
	res.status(404).send('Sorry , this page can\'t be found');
})

router.listen(80);
