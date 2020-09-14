const db = require("./db");

module.exports = {
  Memolist: function (memos) {
    var i;
    var memolist = `<table class="memo_table">
    <caption>memolist</caption>
    <tr><th>제목</th><th>작성자</th><th>작성일</th><th>조회수</th></tr>`;
    for (i = 0; i < memos.length; i++) {
      memolist += `
      <tr font-size:10pt; font-weight:lighter;">
      <td><a href="/community/${memos[i].mid}" style="color:black;">${memos[i].title}</a></td>
      <td>${memos[i].author}</td><td>${memos[i].created}</td><td>${memos[i].views}</td></tr>`
    }
    memolist += `<table>`;
    return memolist;
  },

  createMemo: function (author) {
    return `
    <div class="contents">
    <form action="/community/create_process" autocomplete="on" method="post">
      <p><input type="hidden" name="author" value="${author}"></p>
      <p><label>  제목 : <input type="text" name="title" style="width:684px"
           placeholder="제목을 입력해주세요" autofocus></label></p>
      <p><label>
      내용 : <textarea name="bodyText" rows="20" cols="100" style="width:682px" placeholder="내용을 입력해주세요"></textarea></label>
      </p><br><br>
      <input type="submit" value="등록" style="position:relative; left:375px">
    </form>
    </div>
    `;
  },
  updateMemo: function (data) {
    return `
    <html>
    <head><meta charset="utf-8"></head>
    <body>
    <form action="/community/update_process" autocomplete="on" method="post">
      <input type="hidden" name="id" value="${data[0].mid}">
      <p><label>  제목 : <input type="text" name="title" style="width:684px"
           placeholder="제목을 입력해주세요" autofocus value="${data[0].title}"></label></p>
      <p><label>
      내용 : <textarea name="bodyText" rows="20" cols="100" style="width:682px"
      placeholder="내용을 입력해주세요">${data[0].bodyText}</textarea></label>
      </p><br><br>
      <input type="submit" value="등록" style="position:relative; left:375px">
    </form>
    </body>
    </html>
    `;
  },
  prdList: function (data) {
    var i;
    var prdList = `<div class="contents"><ul>`;
    for (i = 0; i < data.length; i++) {
      prdList += `<li class="prdList"><div class="box">
            <a style="color:black;" href="/product/detail/${data[i].pid}">
            <img src="/uploads/${data[i].image_name}" width="250" height="300" alt="image"/>
            <div class="description" style="padding:10px;margin:10px;">
            <div style="margin:5px;">${data[i].pname}</div></a>
            
            <span style="font-size:9pt;">-${data[i].po}</span>
            </div></div></li>`;
    }
    prdList += `</ul></div>`;
    return prdList;
  },
  createPrd: function (cate, seasonlist) {
    return `<div class="contents">
    <form action="/product/create_process" autocomplete="on" method="post" enctype="multipart/form-data">
    <p>
    ${cate}
    ${seasonlist}
    </p>
    <p>
    product name : <input type="text" name="pname">
    </p>
    <p>
    purchase office : <input type="text" name="po">
    </p>
    <p>
    detail : <textarea name="description" rows="20" cols="100" style="width:682px" placeholder="내용을 입력해주세요">
    </textarea>
    </p>
    <p>
    <input type="file" name="imgFile">
    </p>
    <br><br>
    <input type="submit" value="등록" style="position:relative; left:375px">
  </form>
  </div>`;
  },
  updatePrd(cate, seasonlist, data) {
    return `<div class="contents">
    <form action="/product/update_process" autocomplete="on" method="post" enctype="multipart/form-data">
    <input type="hidden" name="pid" value="${data[0].pid}">
    <p>
    ${cate}
    ${seasonlist}
    </p>
    <p>
    product name : <input type="text" name="pname" value="${data[0].pname}">
    </p>
    <p>
    purchase office : <input type="text" name="po" value="${data[0].po}">
    </p>
    <p>
    detail : <textarea name="description" rows="20" cols="100" style="width:682px" placeholder="내용을 입력해주세요">
    ${data[0].description}</textarea></label>
    </p>
    <p>
    <input type="file" name="imgFile" accept="image/*"><span>${data[0].image_name}</span>
    </p>
    <br><br>
    <input type="submit" value="등록" style="position:relative; left:375px">
    </form>
    </div>`;
  },
  detailPrd(pname, season, po, description, data) {
    return `<h2 class="title2">${pname}</h2>
    <div class="contents">
    <div style="text-align:center; margin:60px;">
    <img src="/uploads/${data[0].image_name}" width="350" height="450" alt="image"/><br>
    <div style="padding:7px; margin:10px; margin-top:30px; color:#81BEF7;display:inline-block;border:solid #81BEF7 0.3px;">
    ${season}</div>
    <div style="padding:7px; margin:10px; margin-top:30px; color:#81BEF7;display:inline-block;border:solid #81BEF7 0.3px;">
    ${po}</div>
    </div>
    <div style="padding:7px; width:50%">${description}</div>
    <div style="text-align:right; padding:10px; margin:60px;">
    <a style="color:gray;"href="/product/${data[0].cid}">목록</a>
    <a style="color:gray;"href="/product/update/${data[0].pid}">수정</a>
    <br><br>
    <form action="/product/delete_process" method="post">
    <input type="hidden" name="pid" value="${data[0].pid}">
    <input type="hidden" name="cid" value="${data[0].cid}">
    <input type="submit" value="삭제" >
    </form>
    </div>
    </div>`;
  },
  HTML: function (auth, body, catelist) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>miyos_closet</title>
      <meta charset="utf-8">

      <style>
      body{
        margin:0;
        font-family: arial,고딕체,'Times New Roman',Sans-Serif;
      }
      h1{
        font-size:35px;
        font-family: Georgia, serif;
        font-weight :80;
        border-bottom:0.05px solid #A4A4A4;
        height:45px;
        padding:70px; margin:0px;
      }
      a{
        text-decoration:none;
      }
      #title{  
        float:right;
        padding:25px;
        color:black;
      }
      #grid{
        padding:0px;
        display:grid;
        grid-template-columns: 225px 1fr;
      }
      .title2{
        display:block;
        text-align:center;
        padding:30px;
        color:black;
        font-weight:100;
      }
      #left_bar{
        border-right:0.05px solid #A4A4A4;
        width:225px; height:1000px;
      }
      #main_menu{
         padding:20px;
         list-style:none;
      }
      .search_box{
        position:relative;
        left:10px;
      }
      .category{
        color:black;
        text-decoration:none;
        padding:10px;
      }
      .category_font{
        color:black;
      }
      .prdList{
        float:left; list-style:none; margin:5px;
        outline: 0.05px solid #E0E0EE;
        width:250px; height: 420px;
        text-align:center;
      }
      .message{
        text-align:center;
        margin-top:120px;
      }
      .contents{
        margin:6%;
      }
      .contents_top{
        color:#BDBDBD;
        font-size:9pt;
        border-bottom:solid #BDBDBD 0.1px;
        padding-bottom:20px;
        width:1000px;
      }
      .contents_title{
        color:black;
        white-space:pre-line;
      }
      .contents_desc{
        padding-top:20px;
        padding-bottom:50px;
        border-bottom:solid #BDBDBD 0.1px;
        margin-bottom:20px;
        width:1000px;
        white-space:pre-line;
      }
      .contents_bottom{
       padding:5px;
       margin:5px;
       border:solid gray 0.1px;
      }
      .season{
       color : gray;
       padding:5px;
       margin:5px;
       background-color:#EFF2FB;
       display:inline-block;
       width:39px;
      }
      .memo{
        text-decoration:none;
        padding:10px;
      }
      
      .memo_table {
        border-collapse: collapse;
        border-top: 1px solid #A4A4A4;
        margin:40px;
        width:900px;
      }  
      .memo_table th {
        color: #BDBDBD;
        text-align: center;
      }
      .memo_table th, .memo_table td {
        padding: 10px;
        border: 1px solid #ddd;
      }
      .memo_table th:first-child, .memo_table td:first-child {
        border-left: 0;
      }
      .memo_table th:last-child, .memo_table td:last-child {
        border-right: 0;
      }
      .memo_table tr{
        color: #BDBDBD;
        font-weight:lighter
      }
      .memo_table tr td:first-child{
        color: black;
        font-weight:bolder;
      }
      .memo_table caption{caption-side: bottom; display: none;}
      #login{
        padding:20px;
        margin:30px;
        background-color:#04B4AE;
        text-align:center;
      }
      #join_form{
        padding:40px;
        border-spacing: 18px;
        border-collapse: separate;
      }
      </style>
    </head>
    <body>
      <h1>
      <a id="title" href="/">MiYo's Closet</a>
      </h1>

    <div id="grid">
      <div id="left_bar">
      ${auth}
        <ul id="main_menu">
          ${catelist}
          <li class="memo"><a style="color:#8181F7" href="/community">community</a></li>
          <li class="memo"><a style="color:#8181F7" href="/codi">codi</a></li>
        </ul>
        <div class="search_box">
        <form action="/product/search" method="get">
        <input type="text" name="keyword" placeholder="상품명 검색">
        <input type="submit" value="검색">
        </form>
        </div>
      </div>
      <div style="font-size:11pt; font-weight:lighter">
        ${body}
      </div>
      </div>
    </div>
    </body>
    </html>
    `
  },

  Login: function (warning) {
    return ` <html><head><meta charset='utf-8'>
    <style>
        a{
          color:#04B4AE;
          text-decoration:none;
        }
        h1{
        font-size:60px;
        font-family: Georgia,"Malgun Gothic",sans-serif;
        text-align:center;
        padding-top:40px; 
        margin-top:30px;
        }
      </style>
      </head><body>
      <h1><a href="/">MiYo's Closet</a></h1><br><br>
      <div style="text-align:center;">
      <p style="color:red;">${warning}</p>
      <form action="/auth/login_process" method="post">
      <p><input type="text" name="id" style="font-size:30px;" placeholder="아이디"></p>
      <p><input type="password" name="pwd" style="font-size:30px;" placeholder="비밀번호"></p>
      <p><input type="submit" value="로그인" style="font-size:30px;
      background-color:#EFFBFB; width:375.33px;"></p>
      </form>
      <a href="/auth/join">회원가입</a>
      </div></body></html>`;
  },

  join: function () {
    return `
      <h2 class="title2">회원가입</h2>
      <form action="/auth/join_process" method="post">
      <table id="join_form">
            <tr>
                <td>이름</td>
                <td><input type="text" name="uname" /></td>
            </tr>
            <tr>
                <td>아이디</td>
                <td><input type="text" name="uid" /></td>
            </tr>
            <tr>
                <td>비밀번호</td>
                <td><input type="password" name="upw1" /></td>
            </tr>
            <tr>
                <td>비밀번호 확인</td>
                <td><input type="password" name="upw2" /></td>
            </tr>
            <tr>
                <td>생년월일</td>
                <td><select name="year">
                        <option value="1990">1990</option>
                        <option value="1991">1991</option>
                        <option value="1992">1992</option>
                        <option value="1993">1993</option>
                        <option value="1994">1994</option>
                        <option value="1995">1995</option>
                        <option value="1996">1996</option>
                        <option value="1997">1997</option>
                        <option value="1998">1998</option>
                        <option value="1999">1999</option>
                        <option value="2000">2000</option>
                        <option value="2001">2001</option>
                        <option value="2002">2002</option>
                        <option value="2003">2003</option>
                        <option value="2004">2004</option>
                    </select>
                    년
                    <select name="month">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                    월
                    <select name="day">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                        <option value="31">31</option>
                    </select>
                    일
                </td>
            </tr>
            
            <tr>
              <td>이메일</td>
              <td><input type="email" name="email"></td>
            </tr>
            <tr>
                <td></td>
                <td><input type="submit" name="submit" value="가입" />
                <input type="reset" name="reset" value="리셋" /></td>
            </tr>
        </table>
      </form>
      `
  },
  join_complete: function () {
    return `
      <html><head><meta charset="utf-8"></head>
      <body>
      <p>회원가입이 완료되었습니다.</p>
      <p><a href="/auth/login">로그인하기</a></p>
      </body>
      </html>
    `
  }
}
