const Koa = require('koa');
const router = require('koa-router')();
const c = require('./nodecreateExcel');
let app = new Koa();
router.get('/createExcel', c);
app.use(router.routes());
app.listen(4242, () => {
    console.log('create excel  server started on port', 4242);
});