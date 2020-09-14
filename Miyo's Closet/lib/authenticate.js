module.exports={
    authenticated:function(request,response){
        var auth=`<a href="/auth/login" style="color:white;"><div id=login><strong>로그인</strong></div></a>
    <div style="text-align:center; font-size:9pt;"><a href="/auth/join" style="color:gray;">회원가입</a></div>`;
    if (request.session.displayName){
      auth=`<div style="text-align:center;background-color:#EFF8FB; padding:0; margin:10px;">
      <div style="color:#04B4AE; padding:20px;"><p>${request.session.displayName}님,<br>환영합니다!</p></div>
      <div style="font-size:9pt;"><a href="/auth/logout_process" style="color:gray;"></div>
      로그아웃</a>
      </div>`;
    }
    return auth;
    }
}