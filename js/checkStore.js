(function($) {
    let PRODUCT_STORE = {
        init() {
            this.checkStore();
        },
        store: {
            'H32104381': 1,
            'H51241100': 1,
            'H51439505': 1,
            'H51442258': 1,
            'H51943088': 1,
            'H51539507': 1,
            'H51539508': 1,
            'H51441225': 1,
            'H51442256': 1,
        },
        checkStore() {
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
    PRODUCT_STORE.init();
})(jQuery)
