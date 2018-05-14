(function($) {
    let PRODUCT_STORE = {
        init() {
            this.checkStore();
        },
        store: {
            'H51943088': 1,
            'H51241100': 2,
            'H51241102': 1,
            'H51442310': 1,
            'H51442256': 2,
            'H51442257': 1,
            'H51442258': '暂时无货',
            'H51441225': 1,
            'H51441228': 2,
            'H51239509': 0,
            'H51443247': 0,
            'H51441227': 1,
            'H51539508': 2,
            'H51539507': 1,
            'H51439505': 0,
            'H32104381': 1,
            'P41503622': 0,
            'H51443248': 2,
            'H51439506': 0,
            'H51443252': 2,
            'H51443353': 0,
            'H70400485': 1,
            'H31504097': 0,
            'H51443056': 1,
            'H51442862': 1,
            'H51443352': 2,
            'H51443249': 0,
//4-28
            'H51239510': 1,
            'H10604001': 0,
            'H51241422': 1,
            'H51241424': 1,
            'H51241425': 1,
            'H51943388': 1,
            //5-8
            'H51441226': 1,
            'H51908371': 0,
            'H51442259': 2,
            'H51442309': 2,
            'H51339500': 1,
            'H41502814': 0,
            'H31103196': 0,
            '51943063':'无货',
            '51943064':'无货',
            '51943303':'无货',
            '51943278':'无货',
            '51943277':'无货'

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
                },
                {
                    url: 'trade/itemlist/list_sold_items.htm',
                    el: $('div[class^="ml-mod__container"]').each(function() {
                        return $('div:eq(1) >p:first >a span:eq(1)', this)
                    })
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
