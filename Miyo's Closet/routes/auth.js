const express = require('express');
const router = express.Router();
var template = require('../lib/Template');
var db = require('../lib/db');

router.get('/login',function(request,response){
    var html = template.Login('');
    response.send(html);
})
router.post('/login_process',function(request,response){
    var post = request.body;
    db.query(`select * from personal_info where uid=?`,[post.id],function(err,data){
        if (err) throw err;
        console.log(data);
        if (data[0] === undefined) {
            var html = template.Login('존재하지 않는 ID 입니다.')
            response.send(html);
            return;
        }
        else if (post.pwd === data[0].password) {
            request.session.displayName = data[0].name;
            request.session.save(() => {
                response.redirect('/');
            });
        }
        else{
            var html = template.Login('비밀번호가 틀립니다.')
            response.send(html);
        }
    })
})
router.get('/logout_process', function (request, response) {
    delete request.session.displayName;
    request.session.save(() => {
        response.redirect('../');
    })
})
router.get('/join', function (request, response) {
    var html = template.join();
    response.send(html);
})
router.post('/join_process',(req,res)=>{
    var post = req.body;
    if(post.id==='') {res.send('ID를 입력해주세요.');}
    if(post.uname==='') res.send('이름을 입력해주세요.');
    db.query(`select * from personal_info`,function(err,data){
        if (err) throw err;
        for(var i=0; i<data.length; i++){
            if (data[i].uid===post.id) res.send('이미 사용중인 ID 입니다.');
        }
        for(var i=0; i<data.length; i++){
            if (data[i].email===post.email) res.send('이미 사용중인 email 입니다.');
        }
        var birth = `${post.year}-${post.month}-${post.day}`;
        
        if(post.upw1!==post.upw2){
            res.send('비밀번호를 다시 입력해 주세요.');
        }
        db.query(`insert into personal_info values(?,?,?,?,?)`
        ,[post.uid,post.upw1,post.uname,birth,post.email],function(err,result){
            if(err) throw err;
            res.redirect('/auth/join_complete');
        })
    })
    router.get('/join_complete', (req, res) => {
        var html = template.join_complete();
        res.send(html);
    })
   
})
module.exports = router;