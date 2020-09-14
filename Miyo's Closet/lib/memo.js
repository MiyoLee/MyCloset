var template = require('./Template.js');
var db = require('./db');
var auth=require('./authenticate');

exports.list = function (request, response) {
    db.query(`select * from memos order by created desc;`, function (err, memos) {
        if (err) throw err;
        console.log(memos);
        var memolist = template.Memolist(memos);
        var html = template.HTML(auth.authenticated(request, response), `<h2 class="title2">community</h2>${memolist}
               <br><br><div style="display:inline-block;padding:3px; margin-right:200px; 
               position:relative; left:890px;background-color:#04B4AE;">
               <a href="/community/create" style="color:white;">글쓰기</a></div>`
            , request.list);
        response.send(html);
    });
}
exports.content = function (mid, request, response) {
    db.query(`select * from memos where mid=?`, [mid], function (error, data) {
        if (error) throw error;
        if (data[0] === undefined) {    //찾는 data가 없으면
            response.send('존재하지 않는 페이지 입니다.');
        }
        db.query(`update memos set views=views+1 where mid=?`,[mid],function(err,result){
            if (err) throw err;
            var html = template.HTML(auth.authenticated(request,response), 
        `<div class="contents">
            <div class="contents_top">
            <p style="color:#8181F7">community</p>
            <h2 class="contents_title">${data[0].title}</h2>
            <p>${data[0].author}</p>
            <span>${data[0].created}</span>&nbsp;&nbsp;&nbsp;<span>조회수 ${data[0].views+1}</span>
            </div>
            <div class="contents_desc">
            <p> ${data[0].bodyText}</p>
            </div>
            <div style="text-align:center;">
            <a href="/community">목록</a> <a href="/community/update/${data[0].mid}">수정</a>
            <form action="/community/delete_process" method="post">
            <input type="hidden" name="id" value="${data[0].mid}">
            <input type="hidden" name="author" value="${data[0].author}">
            <input type="submit" value="삭제">
            </form></div>`
                , request.list
            );
            response.send(html);
        });
    })
}
exports.create = function (request, response) {
    if(request.session.displayName===undefined){
        response.send(`<div style="text-align:center;padding:30px;margin:60px;">
        login required!!<br>go <a href="../auth/login">login</a>
        </div>`)
        return ;
      }
    var html = template.HTML(auth.authenticated(request,response), 
    template.createMemo(request.session.displayName),request.list);
    response.send(html);
}
exports.create_process = function (request, response) {
    var post = request.body;
    db.query(`insert into memos(title,bodyText,created,author) 
        values(?,?,NOW(),?);`, [post.title, post.bodyText, post.author], function (error, result) {
        if (error) throw error;
        response.redirect('/community');
    })
}
exports.update = function (mid, request, response) {
    db.query(`select * from memos where mid=?`, [mid], function (error, data) {
        if (error) throw error;
        if(request.session.displayName!==data[0].author){
            response.send(`<div style="text-align:center;padding:30px;margin:60px;">
            권한이 없습니다.
            </div>`)
            return ;
          }
        var html = template.HTML(auth.authenticated(request,response), template.updateMemo(data), request.list);
        response.send(html);
    })
}
exports.update_process=function(request,response){
    var post = request.body;
    db.query(`update memos set title=?,bodyText=? where mid=?;`,
        [post.title, post.bodyText, post.id], function (error, result) {
            if (error) throw error;
            response.redirect(`/community`);
        })
}
exports.delete_process = function(request,response){
    var post = request.body;
    if(request.session.displayName!==post.author){
        response.send("권한이 없습니다.");
        return;
    }
    db.query(`delete from memos where mid=?`, [post.id], function (error, result) {
        response.redirect(`/community`);
    })
}