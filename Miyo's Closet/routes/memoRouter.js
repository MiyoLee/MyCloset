var express=require('express');
var router=express.Router();
var memo=require('../lib/memo')
router.get('/', function (request, response) {
    memo.list(request, response);
})
router.get('/create', function (request, response) {
    memo.create(request, response);
})
router.post('/create_process', function (request, response) {
    memo.create_process(request, response);
})
router.get('/update/:mid', function (request, response) {
    memo.update(request.params.mid, request, response);
})
router.post('/update_process', function (request, response) {
    memo.update_process(request, response);
})
router.post('/delete_process', function (request, response) {
    memo.delete_process(request, response);
})
router.get('/:mid', function (request, response) {
    memo.content(request.params.mid, request, response);
})
module.exports = router;