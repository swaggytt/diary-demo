var express = require('express');
var router = express.Router();
const Blogs=require('../models/blogs')
const {check,validationResult} = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  Blogs.getAllBlogs(function(err,blogs){
    if(err) throw err
    res.render("blogs/index",{data:"ข้อมูลบทความ",blogs:blogs});
  });
});

router.get('/add', function(req, res, next) {
  res.render("blogs/addForm",{data:"เขียนไดอารี่"});
});
router.get('/delete/:id', function(req, res, next) {
  Blogs.deleteBlog([req.params.id],function(err){
      if (err) throw err
      res.redirect("/blogs")
  })
});
router.get('/edit/:id', function(req, res, next) {
  Blogs.getBlogId([req.params.id],function(err,blog){
    if(err) throw err
    res.render("blogs/editForm",{data:"แก้ไขเนื้อหา",blog:blog});
  });
});

router.post('/add',[
  check('title','กรุณาป้อนหัวข้อไดอารี่').not().isEmpty(),
  check('author','กรุณาป้อนเนื้อหา').not().isEmpty()
], function(req, res, next) {
  const result= validationResult(req);
  var errors = result.errors;
  for (var key in errors) {
      console.log(errors[key].value);
  }
  if (!result.isEmpty()) {
      //กรณีที่ป้อนไม่ครบ
      res.render("blogs/addForm",{data:"เพิ่มเนื้อหา",errors:errors});
  }else{
      data=new Blogs({
          title:req.body.title,
          author:req.body.author,
      })
      Blogs.createBlog(data,function(err){
             if(err) console.log(err);
             res.redirect("/blogs")
      });
  }
});

router.post('/update',[
  check('title','กรุณาป้อนหัวข้อไดอารี่').not().isEmpty(),
  check('author','กรุณาป้อนเนื้อหา').not().isEmpty()
], function(req, res, next) {
  const result= validationResult(req);
  var errors = result.errors;
  for (var key in errors) {
      console.log(errors[key].value);
  }
  if (!result.isEmpty()) {
      //กรณีที่ป้อนไม่ครบ
      res.redirect("/blogs");
  }else{
      data=new Blogs({
          id:req.body.id,
          title:req.body.title,
          author:req.body.author,
      })
      Blogs.updateBlog(data,function(err){
             if(err) console.log(err);
             res.redirect("/blogs")
      });
  }
   
});
module.exports = router;