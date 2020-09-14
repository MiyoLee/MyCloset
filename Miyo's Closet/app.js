const express = require('express');
const app = express();
var port = 8000;
var compression = require('compression');
var bodyParser = require('body-parser');
var db = require('./lib/db');
var indexRouter = require('./routes/index');
var productRouter = require('./routes/productRouter');
var memoRouter = require('./routes/memoRouter');
var authRouter = require('./routes/auth');
var helmet = require('helmet');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options ={                                           
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'sayonara97',
  database: 'mycloset'
};
var sessionStore = new MySQLStore(options);                 
app.use(session({                                            
secret:"asdfasffdas",
resave:false,
saveUninitialized:true,
store: sessionStore                                          
}));

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false })); //미들웨어사용
app.use(express.static('public'));
app.use(compression()); //압축

app.get('*',function(request, response, next){  //미들웨어 만듬.
  db.query('select * from category',function(error,catelist){
    if (error) throw error; 
    var list=``;
    var i;
    for (i=0; i<catelist.length; i++){
      list+=`<li class="category"><a class="category_font" href="/product/${catelist[i].cid}?season=">
      ${catelist[i].cname}</a></li>`;
    }
    request.list = list;
    next();
  })
})

app.use('/',indexRouter);
app.use('/auth',authRouter);
app.use('/product',productRouter);
app.use('/community',memoRouter);


//error 처리
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
 
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(port, () => console.log(`mycloset listening on port ${port}!`))
