var template = require('./Template');
var db = require('./db');
var fs = require('fs');
var auth = require('./authenticate');

exports.list = function (cateId, season, request, response) {
  db.query(`select * from category C where C.cid=?`, [cateId], function (error, data) {
    if (error) throw error;
    if (season != '') { //season 별로 분리한 경우
      db.query(`select * from products P where P.cid=? and (P.season1=? or P.season2=?);`
        , [cateId, season, season], function (error, data1) {
          if (error) throw error;
          if (data1[0] == undefined) { //해당 계절에 해당하는 product가 없을 경우
            var category = data[0].cname;
            var prdList = `<div class="message">해당 상품이 없습니다.</div>`;
            var html = template.HTML(auth.authenticated(request, response),
              `<a href="/product/${data[0].cid}"><h2 class="title2">${category}</h2></a>
              <div style="text-align:center;">
              <a class="season" href="/product/${cateId}?season=1">봄</a><a class="season" href="/product/${cateId}?season=2">여름</a>
              <a class="season" href="/product/${cateId}?season=3">가을</a><a class="season" href="/product/${cateId}?season=4">겨울</a>
              </div>
              ${prdList}`
              , request.list);
            response.send(html);
          }
          else { //해당 계절에 해당하는 product가 존재할 경우
            var category = data[0].cname;
            var prdList = template.prdList(data1);
            var html = template.HTML(auth.authenticated(request, response),
              `<a href="/product/${cateId}"><h2 class="title2">${category}</h2></a>
            <div style="text-align:center;">
            <a class="season" href="/product/${cateId}?season=1">봄</a><a class="season" href="/product/${cateId}?season=2">여름</a>
            <a class="season" href="/product/${cateId}?season=3">가을</a><a class="season" href="/product/${cateId}?season=4">겨울</a>
            </div>
            ${prdList}`
              , request.list);
            response.send(html);
          }
        })
    }
    else {  //season별 분류 안한 경우
      db.query(`select * from products P where P.cid=?`, [cateId], function (error, data2) {
        if (error) throw error;
        var category = data[0].cname;
        var prdList = template.prdList(data2);
        var html = template.HTML(auth.authenticated(request, response),
          `<a href="/product/${cateId}"><h2 class="title2">${category}</h2></a>
            <div style="text-align:center;">
            <a class="season" href="/product/${cateId}?season=1">봄</a><a class="season" href="/product/${cateId}?season=2">여름</a>
            <a class="season" href="/product/${cateId}?season=3">가을</a><a class="season" href="/product/${cateId}?season=4">겨울</a>
            </div>
            ${prdList}`
          , request.list);
        response.send(html);
      })
    }
  })
}
exports.search = function (keyword, request, response) {
  console.log(keyword);
  db.query(`select * from products where pname like '%${keyword}%'`, function (err, data) {
    if (err) throw err;
    if (data[0] === undefined) {
      var prdList = `<div class="message">해당 상품이 없습니다.</div>`;
      var html = template.HTML(auth.authenticated(request, response), `${prdList}`, request.list);
      response.send(html);
    }
    else {
      var prdList = template.prdList(data);
      var html = template.HTML(auth.authenticated(request, response), `${prdList}`, request.list);
      response.send(html);
    }
  })
}
exports.create = function (request, response) {
  if (request.session.displayName === undefined) {
    response.send(`<div style="text-align:center;padding:30px;margin:60px;">
    login required!!<br>go <a href="../auth/login">login</a>
    </div>`)
    return;
  }
  db.query(`select * from category`, function (error, data1) {
    if (error) throw error;
    db.query(`select * from season`, function (error, data2) {
      if (error) throw error;
      var cate = `<select name="category"><option value="">카테고리</option>`;
      var i;
      for (i = 0; i < data1.length; i++) {
        cate += `<option value=${data1[i].cid}>${data1[i].cname}</option>`
      }
      cate += `</select>`;

      var seasonlist = ``;
      for (i = 0; i < data2.length; i++) {
        seasonlist += `<label>
        <input type="checkbox" name="season" value=${data2[i].seasonid}>${data2[i].seasonname}
        </label>`;
      }

      var html = template.HTML(auth.authenticated(request, response), template.createPrd(cate, seasonlist), request.list);
      response.send(html);
    })
  })
}
exports.create_process = function (request, response) {
  console.log(request.file);
  var post = request.body;

  db.query(`insert into products(cid,season1,season2,pname,description,po,image_name) values(?,?,?,?,?,?,?);`
    , [post.category, post.season[0], post.season[1], post.pname, post.description, post.po, request.file.originalname],
    function (error, result) {
      if (error) throw error;
      response.redirect(`/product/${post.category}?season=`);
    });

}
exports.update = function (pid, request, response) {
  if (request.session.displayName === undefined) {
    response.send(`<div style="text-align:center;padding:30px;margin:60px;">
    login required!!<br>go <a href="../auth/login">login</a>
    </div>`)
    return;
  }
  db.query(`select * from category`, function (error, data1) {
    if (error) throw error;
    db.query(`select * from season`, function (error, data2) {
      if (error) throw error;
      db.query(`select * from products where pid=?`, [pid], function (error, data3) {
        if (error) throw error;
        var cate = `<select name="category"><option value="">카테고리</option>`;
        var i;
        for (i = 0; i < data1.length; i++) {
          if (data1[i].cid === data3[0].cid) {
            cate += `<option value=${data1[i].cid} selected="selected">${data1[i].cname}</option>`
          }
          else { cate += `<option value=${data1[i].cid}>${data1[i].cname}</option>` }
        }
        cate += `</select>`;

        var seasonlist = ``;
        for (i = 0; i < data2.length; i++) {
          if (data2[i].seasonid === data3[0].season1 || data2[i].seasonid === data3[0].season2) {
            seasonlist += `<label>
          <input type="checkbox" name="season" value=${data2[i].seasonid} checked="checked">${data2[i].seasonname}
          </label>`;
          }
          else {
            seasonlist += `<label>
          <input type="checkbox" name="season" value=${data2[i].seasonid}>${data2[i].seasonname}
          </label>`;
          }
        }

        var html = template.HTML(auth.authenticated(request, response), template.updatePrd(cate, seasonlist, data3), request.list);
        response.send(html);
      })
    })
  })
}
exports.update_process = function (request, response) {
  var post = request.body;
  var image_name;

  db.query(`select * from products where pid=?`, [post.pid], function (err, data) {
    if (err) throw err;
    image_name = data[0].image_name;    //변수에 기존 이미지 이름 저장
    if (request.file == undefined) {     //새파일 안올렸을 경우
      db.query(`update products set cid=?, season1=?, season2=?, pname=? ,description=?, po=? where pid=?`
        , [post.category, post.season[0], post.season[1], post.pname, post.description, post.po, post.pid],
        function (err, result) {
          if (err) throw err;
          response.redirect(`/product/${post.category}?season=`);
        })
    }
    else {   //새파일 올렸을 경우
      fs.unlink(`public/uploads/${image_name}`, (err) => { //기존 file 삭제
        if (err) throw err;
        db.query(`update products set cid=?, season1=?, season2=?, pname=? ,description=?, po=?, image_name=? where pid=?`
          , [post.category, post.season[0], post.season[1], post.pname, post.description, request.file.originalname, post.pid],
          function (err, result) {
            if (err) throw err;
            response.redirect(`/product/${post.category}?season=`);
          })
      });

    }
  })
}

exports.delete_process = function (request, response) {
  if (request.session.displayName === undefined) {
    response.send(`<div style="text-align:center;padding:30px;margin:60px;">
    login required!!<br>go <a href="../auth/login">login</a>
    </div>`)
    return;
  }
  var post = request.body;
  db.query(`delete from products where pid=?`, [post.pid], function (error, result) {
    if (error) throw error;
    response.redirect(`/product/${post.cid}`);
  })
}
exports.detail = function (pid, request, response) {
  db.query(`select * from products where pid=?`, [pid], function (error, data) {
    if (error) throw error;
    db.query(`select * from season where seasonid=?`, [data[0].season1], function (error, data1) {
      if (error) throw error;
      var season = `${data1[0].seasonname}`;
      if (data[0].season2 != null) {
        db.query(`select * from season where seasonid=?`, [data[0].season2], function (error, data2) {
          if (error) throw error;
          season += `,&nbsp;${data2[0].seasonname}`;
          var po = data[0].po;
          var html = template.HTML(auth.authenticated(request, response),
            template.detailPrd(data[0].pname, season, po, data[0].description, data), request.list);
          response.send(html);
        })
      }
      else {
        var html = template.HTML(auth.authenticated(request, response),
          template.detailPrd(data[0].pname, season, data[0].description, data), request.list);
        response.send(html);
      }
    })
  })
}
