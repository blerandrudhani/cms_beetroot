const jwt = require("jsonwebtoken");
const isAuthenticated=require('./auth');


module.exports = (req,res,next) => {
	try {

      
       if(req.user.role==='admin'){
        next();
       }
       return res.json({
        msg:"Unauthorized to perform this action!"
       })
       
    }
    
    catch(error){
        return res.status(401).json({
			status: false,
			data : {
				msg  : "An error occured"
			}
		})
    }
    
    }