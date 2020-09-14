var express = require('express');
var router = express.Router();
var product = require('../lib/product.js')
var multer = require('multer'); // multer모듈 적용 (for 파일업로드)
const upload = multer({
  storage: multer.diskStorage({
    destination: function (request, file, cb) {
      cb(null, 'public/uploads/');
    },
    filename: function (request, file, cb) {
      cb(null, file.originalname);
    }
  }),
});

router.get('/search',function(req,res){
    product.search(req.query.keyword,req,res);
})
router.get('/create',function(request,response){
    product.create(request,response);
})
router.post('/create_process', upload.single('imgFile'), function(request,response){
    product.create_process(request,response);
})
router.get('/update/:pid', function (request, response) {
    product.update(request.params.pid, request, response);
})
router.post('/update_process', upload.single('imgFile'), function(request,response){
    product.update_process(request,response);
})
router.post('/delete_process',function(request,response){
    product.delete_process(request,response);
})
router.get('/:cateId', function (req, res) {
    product.list(req.params.cateId, req.query.season, req, res);
})
router.get('/detail/:pid', function (request, response) {
    product.detail(request.params.pid, request, response);
})



module.exports = router;