var Body={
  setColor : function(color){
    // document.querySelector('body').style.color=color;
    $('body').css('color',color);
  },
  setBackgroundColor : function(color){
    // document.querySelector('body').style.backgroundColor=color;
    $('body').css('backgroundColor',color);
  }
}

function nightDayHandler(self){
  if(self.value==='night'){
  Body.setColor('white');
  Body.setBackgroundColor('#1B0A2A');
  self.value='day';
  self.style.backgroundColor='white';
  self.style.color='#F79F81';
  }
  else{
    Body.setColor('black');
    Body.setBackgroundColor('white');
    self.value='night';
    self.style.backgroundColor='#F79F81';
    self.style.color='white';
  }
}
