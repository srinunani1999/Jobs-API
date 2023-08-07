const { StatusCodes } = require('http-status-codes');
const Job=require('../models/Job');
const { NotFoundError, BadRequestError } = require('../errors');


const getAllJobs=async (req,res)=>{
    const jobs= await  Job.find({createdBy:req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count:jobs.length});
}

const getJob=async (req,res)=>{
    const {user:{userId},params:{id:jobid}}=req;
    const job= await Job.findOne({_id:jobid,createdBy:userId});
    if (!job) {
        throw new NotFoundError(`Job Found with id ${userId}`);
    }
    res.status(StatusCodes.OK).json({job});
}

const createJob=async (req,res)=>{
    req.body.createdBy=req.user.userId;
    const job=await Job.create(req.body)
    res.status(StatusCodes.OK).json(job);
}
const updateJob=async (req,res)=>{
    const {user:{userId},params:{id:jobid}, body:{company,position}}=req;

    if (company === '' || position === '') {
        throw new BadRequestError('Provide comapny and position');
    }

    const job=await Job.findByIdAndUpdate({_id:jobid,createdBy:userId},req.body,{
        new:true,runValidators:true
    });

    if (!job) {
        throw new NotFoundError('Job Not found');
    }

    res.status(StatusCodes.OK).json({job});
}
const deleteJob=async (req,res)=>{
    const {user:{userId},params:{id}}=req
    const job= await Job.findByIdAndDelete({_id:id,createdBy:userId});
    res.status(StatusCodes.OK).json({job});
}

module.exports={
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}
