(function($) {
    let PRODUCT_STORE = {
        init() {
            this.checkStore();
        },
        store: {
            'H32104381': 1,
            'H51241100': 2,
            'H51439505': 1,
            'H51442258': 1,
            'H51943088': 1,
            'H51539507': 1,
            'H51539508': 2,
            'H51441225': 1,
            'H51442256': 0,
            'H51443248': 1,
            'H31103196': 2,
            'H41502814': 2,
            'H51239509': 1,
            'H51239510': 2,
            'H51241102': 1,
            'H51439506': 0,
            'H51441227': 1,
            'H51441228': 3,
            'H51442257': 1,
            'H51442259': 1,
            'H51442309': 1,
            'H51443247': 1,
            'H51443252': 1,
            'H51443353': 1,
            'P41503622': 1
        },
        checkStore() {
            if (location.href.indexOf('item.taobao.com/item.htm')!==-1) {
                $(window).load(() => {
                    console.log('check product is start')
                    let title = $('.tb-main-title').html();
                    for (var item in this.store) {
                        title = title.replace(item.substr(1), item + '(现货：' + this.store[item] + ')')
                    }
                    $('.tb-main-title').html(title)
                })

            }

        }
    }
    PRODUCT_STORE.init();
})(jQuery)
