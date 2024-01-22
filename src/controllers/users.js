const UserModel = require('../models/users')

const profile = async(req,res) => {
    try {
        const id = req.user.id
        const userProfile = await UserModel.findById(id).populate('rooms')
        return res.status(200).json({message: "profile:", userProfile})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const userData = async(req,res) => {
    try {
        const id = req.params.id
        const user = await UserModel.findById(id)
        return res.status(200).json({message: "user:", user})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = { profile, userData }