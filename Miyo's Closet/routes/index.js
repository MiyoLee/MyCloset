const express = require('express');
const router = express.Router();
var template = require('../lib/Template');
var auth = require('../lib/authenticate');

router.get('/',function(request,response){  //홈
    var title = 'Welcome!';
    var html = template.HTML(auth.authenticated(request,response),
      `<h2 class="title2">${title}</h2>
      <div style="text-align:center;">
      <img src="/images/closet.png" width=350px>
      <div style="margin:50px;">
      <a href="/product/create" 
      style="display:inline-block; font-size:20pt; font-weight:bold; padding:17px; 
      color:#04B4AE; border:solid #04B4AE 0.2px;">
      Add my clothes</a>
      </div>
      </div>`
      ,request.list);
    response.send(html);
  });
module.exports = router;