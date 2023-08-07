const express=require('express');
const { login } = require('../controllers/auth');
const { getAllJobs, createJob, deleteJob, updateJob, getJob } = require('../controllers/jobs');
const router=express.Router();

router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob);

module.exports=router;