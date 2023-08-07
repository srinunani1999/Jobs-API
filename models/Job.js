const mongoose=require('mongoose');

const jobSchema=new mongoose.Schema({
    company:{
        type:String,
        required:[true,'Please provide company'],
        maxLength:50
    },
    position:{
        type:String,
        required:[true,'Please provide position'],
        maxLength:100,
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending',
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        required:[true,'please provide User'],
        ref:'User'
    }

},{timestamps:true});

module.exports=mongoose.model('Job',jobSchema);