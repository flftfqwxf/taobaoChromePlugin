(function($) {
    let PRODUCT_STORE = {
        init() {
            this.checkStore();
        },
        store: {
            'H51943088': 1,
            'H51241100': 2,
            'H51241102': 1,
            'H51442309': 0,
            'H51442310': 1,
            'H51442257': 1,
            'H51442258': 2,
            'H51442259': 1,
            'H51441225': 1,
            'H51441228': 3,
            'H51239509': 1,
            'H51443247': 0,
            'H51441227': 1,
            'H51539508': 2,
            'H51539507': 1,
            'H51439505': 1,
            'H31103196': 0,
            'H41502814': 3,
            'H32104381': 1,
            'P41503622': 0,
            'H51443248': 2,
            'H51442256': 2,
            'H51439506': 0,
            'H51443252': 0,
            'H51443353': 1,
            'H70400485': 1,
            'H31504097': 1,
            'H51443056': 1,
            'H51442862': 1,
            'H51443352': 2,
            'H51443249': 1,
//4-28
            'H51239510': 1,
            'H10604001': 1,
            'H51241422': 1,
            'H51241424': 1,
            'H51241425': 1
        },
        checkStore() {
            const locObj = [
                {
                    url: 'item.taobao.com/item.htm',
                    el: '.tb-main-title'
                },
                {
                    url: 'auction/merchandise/auction_list.htm',
                    el: '.item-title-area >a'
                }
            ]
            let _this = this;
            locObj.map((item) => {
                if (location.href.indexOf(item.url) !== -1) {
                    $(window).load(() => {
                        console.log('check product is start')
                        let $el = $(item.el);
                        $el.each(function() {
                            let title = $(this).html();
                            for (var item in _this.store) {
                                title = title.replace(item.substr(1), item + (_this.store[item] ? '(现货：' + _this.store[item] + ')' : ''))
                            }
                            $(this).html(title);
                        })
                    })
                }
            })
        }
    }
    PRODUCT_STORE.init();
})(jQuery)
