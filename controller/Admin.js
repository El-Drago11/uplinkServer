const User = require("../models/User")

exports.getAdminDetails = async (req,res)=>{
	try {
		const adminDetail = await User.findOne({
			accountType:'Admin'
		})
		if(!adminDetail){
			return res.status(400).json({
				success:false,
				message:`Unable to get Admin details check if admin exist in User schema`,
			})
		}else{
			return res.status(200).json({
				success:true,
				data:adminDetail,
			})
		}
	} catch (error) {
		return res.status(500).json({
			success:false,
			message:error.message,
		})
	}
}

exports.getAllRegisterUserDetail = async(req,res)=>{
	try {
		const pageNo = parseInt(req?.query?.pageNo) || 1;
		let pageSize = parseInt(req?.query?.pageSize) || 10;

		pageSize = pageSize>25 ? 25 : pageSize

		// Count the total number of users
		const totalLength = await User.countDocuments({ accountType: 'Player' });
		const totalPages = Math.ceil(totalLength/10)
		
		const registerUsers = await User.find({accountType:'Player'})
		.populate('additionalDetails').populate('gameDetails')
		.skip((pageNo-1)*pageSize).limit(pageSize)
		.exec();

		const sortedUsers = registerUsers.sort((a, b) => {
            const countA = a.gameDetails?.clickCount || 0;
            const countB = b.gameDetails?.clickCount || 0;
            return countB - countA;
        });

		res.status(200).json({
			success:true,
			message:'All student fetched',
			data: sortedUsers,
			totalPages
		})
	} catch (error) {
		return res.status(500).json({
			success:false,
			message:error.message
		})
	}
}

exports.updateUserStatus = async(req,res)=>{
	try {
		const {playerId} = req.query;
		const userStatus = await User.findOneAndUpdate(
			{_id:playerId},
			[{ $set: { approved: { $not: "$approved" } } }],
			{ new: true } 
		)
		if(userStatus){
			return res.status(200).json({
				success:true,
				message:"User status updated sucessfully"
			})
		}else{
			return res.status(500).json({
				success:false,
				message:"Unable to update user"
			})
		}
	} catch (error) {
		return  res.status(500).json({
			success:false,
			message:"Inernal server error while updating user status"
		})
	}
}
