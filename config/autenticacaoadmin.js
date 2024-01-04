module.exports = function(req,res,next){
  
  if(req.isAuthenticated()&&req.user.admin==true){
    return next();
  }
  else if(req.isAuthenticated()&&req.user.admin==false){
  res.redirect('/principal');
  }
  else {
  res.redirect('/login');
  }
}



