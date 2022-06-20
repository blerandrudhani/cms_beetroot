const { checkPassword } = require('../helpers/encrypting');

const userService = require('./../services/userService');
const validateLoginInput = require('./../validation/login');
const {
	validateRegisterInput,
	validateProfileInput,
	validateChangePasswordInput,
} = require('../validation/user');

const isadmin=require("./../middlewares/isAdmin");

// const {getUser}=require('./../services/userService');
// console.log( getUser("62ae5fff7dea405cfaf8d0a0"));

const login = async (req, res) => {
	const {errors, isValid}  = validateLoginInput(req.body);
	// console.log(isadmin);
	if(!isValid){
		return res.status(422).json({
			success: false,
			errors
		})
	}

	const user = await userService.checkUsername(req.body.username);
	
	if (!user || !await checkPassword(req.body.password, user.password)) {
		return res.status(400).json({
			success: false,
			errors: {
				username: 'Invalid credentinals!',
			},
		});
	}

	try{
		const { token } = await userService.login(user);
		return res.json({
			success: true,
			data : {
				user,
				token
			}
		})
	}catch(e){
		return res.status(500).json({
			success:false,
			errors: {
				msg: "Something went wrong!"
			}
		});
	}
} 

const register = async (req, res) => {
	const {errors, isValid}  = validateRegisterInput(req.body);
	// console.log(getname.getUser("62ae5fff7dea405cfaf8d0a0").toString());
	// const tokrole=await userService.getUser("62ae5fff7dea405cfaf8d0a0")
	// console.log(tokrole.user.role);
	if(!isValid){
		return res.status(422).json({
			success: false,
			errors
		})
	}

	if(!!await userService.checkUsername(req.body.username)){
		return res.status(400).json({
			success: false,
			errors : {
				username: "Username already exists!"
			}
		});
	}

	try{
		const {user,token} = await userService.register(req.body);
		// console.log(getname.getUser("62ae5fff7dea405cfaf8d0a0"));
		return res.json({
			success: true,
			data : {
				user,
				token
			}
		})
	}catch(e){
		return res.status(500).json({
			success:false,
			errors: {
				msg: "Something went wrong!"
			}
		});
	}
} 

const profile = async (req, res) => {
	const { errors, isValid } = validateProfileInput(req.body);

	if (!isValid) {
		return res.status(422).json({
			success: false,
			errors,
		});
	}	

	const user = await userService.checkUsername(req.body.username);

	if (user && user.id !== req.user.id) {
		return res.status(400).json({
			success: false,
			errors: {
				username: 'Username already exists!',
			},
		});
	}

	try {
		const { user } = await userService.profile(req.user.id, req.body);

		return res.json({
			success: true,
			data: {
				user,
			},
		});
	} catch (e) {
		return res.status(500).json({
			success: false,
			errors: {
				msg: 'Something went wrong!',
			},
		});
	}
}; 

const changePassword = async (req, res) => {
	const { errors, isValid } = validateChangePasswordInput(req.body);

	if (!isValid) {
		return res.status(422).json({
			success: false,
			errors,
		});
	}

	const { user } = await userService.getUser(req.user.id, true);

	if (!user || !(await checkPassword(req.body.oldPassword, user.password))) {
		return res.status(400).json({
			success: false,
			errors: {
				username: 'Incorrect old password!',
			},
		});
	}

	try {
		const { user } = await userService.changePassword(req.user.id, req.body);

		return res.json({
			success: true,
			data: {
				user,
			},
		});
	} catch (e) {
		return res.status(500).json({
			success: false,
			errors: {
				msg: 'Something went wrong!',
			},
		});
	}
}; 

const me = async (req,res) => {
	try {
		const { user } = await userService.getUser(req.user.id);
	
		res.json({
			success:true,
			data : {
				user
			}
		})
	} catch (error) {
		return res.status(404).json({
			success: false,
			errors: {
				msg: 'User not found!',
			},
		});
	}
}

module.exports = {
	login,
	register,
	me,
	profile,
	changePassword,
};
