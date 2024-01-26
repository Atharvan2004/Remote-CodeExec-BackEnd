const express=require('express');
const router=express.Router();

const {calculateCode}=require('../controllers/calculateCode');

router.post("/execute",calculateCode);

module.exports=router;