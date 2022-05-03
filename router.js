import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/auth'
import Dashboard from '@/components/dashboard/Dashboard.vue'
import Partners from '@/components/partners/ListPartners.vue'
import LocalCards from '@/components/localcards/ListLocalCards.vue'
import Stocks from '@/components/stocks/ListStocks.vue'
import StockGroups from '@/components/stockgroups/ListStockGroups.vue'
import PriceCategories from '@/components/pricecategories/ListPriceCategories.vue'
import StockCards from '@/components/stockcards/ListStockCards.vue'
import DetailPartner from '@/components/partners/DetailPartner.vue'
import DetailStockCard from '@/components/stockcards/DetailStockCard.vue'
import DetailPriceCategory from '@/components/pricecategories/DetailPriceCategory.vue'
import DetailStock from '@/components/stocks/DetailStock.vue'
import DetailLocalCard from '@/components/localcards/DetailLocalCard.vue'
import ListSales from '@/components/overviews/sales/ListSales.vue'
import ListWetDeliveries from '@/components/overviews/wetdeliveries/ListWetDeliveries.vue'
import ListWetSales from '@/components/overviews/wetsales/ListWetSales.vue'
import ListWareHouse from '@/components/overviews/warehouse/ListWareHouse.vue'
import ListDiscountCards from '@/components/overviews/discountCards/ListDiscontCards.vue'
import Users from '@/components/users/ListUsers.vue'
import DetailUser from '@/components/users/DetailUser.vue'
import ListVatClasses from '@/components/settings/vatclasses/ListVatClasses.vue'
import ListCtClasses from '@/components/settings/ctclasses/ListCtClasses.vue'
import i18n from '@/i18n'
import ListGoodsDeliveryNotes from '@/components/documents/goodsNotes/GoodsDeliveryNotes.vue'
import ListGoodsReceiptNotes from '@/components/documents/goodsNotes/GoodsReceiptNotes.vue'
import DetailGoodsDeliveryNotes from '@/components/documents/goodsNotes/DetailDeliveryNotes.vue'
import DetailGoodsReceiptNotes from '@/components/documents/goodsNotes/DetailReceiptNotes.vue'
import Receipts from '@/components/documents/receipts/Receipts.vue'
import ListWetDeliveryNotes from '@/components/documents/wetDeliveryNotes/WetDeliveryNotes.vue'
import DetailWetDeliveryNotes from '@/components/documents/wetDeliveryNotes/DetailWetDeliveryNotes.vue'
import ListPurchase from '@/components/overviews/purchase/ListPurchase.vue'
import Axios from 'axios'
const locales = ['cs-CZ', 'en-US']

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'root',
        component: Dashboard,
        beforeEnter: requireAuth
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        beforeEnter: requireAuth
    },
    {
        path: '/partners',
        name: 'partners',
        component: Partners,
        beforeEnter: requireAuth
    },
    {
        path: '/localcards',
        name: 'localcards',
        component: LocalCards,
        beforeEnter: requireAuth
    },
    {
        path: '/localcard/:_key',
        name: 'detailLocalCard',
        component: DetailLocalCard,
        beforeEnter: requireAuth
    },
    {
        path: '/stocks',
        name: 'stocks',
        component: Stocks,
        beforeEnter: requireAuth
    },
    {
        path: '/stock/:_key/:accOwner',
        name: 'detailStock',
        component: DetailStock,
        beforeEnter: requireAuth
    },
    {
        path: '/stockgroups',
        name: 'stockgroups',
        component: StockGroups,
        beforeEnter: requireAuth
    },
    {
        path: '/pricecategories',
        name: 'priceCategories',
        component: PriceCategories,
        beforeEnter: requireAuth
    },
    {
        path: '/pricecategory/:_key',
        name: 'detailPriceCategory',
        component: DetailPriceCategory,
        beforeEnter: requireAuth
    },
    {
        path: '/stockcards',
        name: 'stockcards',
        component: StockCards,
        beforeEnter: requireAuth
    },
    {
        path: '/stockcard/:_key',
        name: 'detailStockCard',
        component: DetailStockCard,
        beforeEnter: requireAuth
    },
    {
        path: '/partner/:_key/:accOwner',
        name: 'detailPartner',
        component: DetailPartner,
        beforeEnter: requireAuth
    },
    {
        path: '/logout',
        name: 'logout',
        beforeEnter: logout
    },
    {
        path: '/users',
        name: 'users',
        component: Users,
        beforeEnter: requireAuth
    },
    {
        path: '/user/:_key',
        name: 'detailUser',
        component: DetailUser,
        beforeEnter: requireAuth
    },
    {
        path: '/vatclasses',
        name: 'vatclasses',
        component: ListVatClasses,
        beforeEnter: requireAuth
    },
    {
        path: '/ctclasses',
        name: 'ctclasses',
        component: ListCtClasses,
        beforeEnter: requireAuth
    },
    {
        path: '/overviews/sales',
        name: 'salesOverview',
        component: ListSales,
        beforeEnter: requireAuth
    },
    {
        path: '/overviews/purchase',
        name: 'purchaseOverview',
        component: ListPurchase,
        beforeEnter: requireAuth
    },
    {
        path: '/overviews/wetdeliveries',
        name: 'wetDeliveriesOverview',
        component: ListWetDeliveries,
        beforeEnter: requireAuth
    },
    {
        path: '/overviews/wetsales',
        name: 'wetSalesOverview',
        component: ListWetSales,
        beforeEnter: requireAuth
    },
    {
        path: '/overviews/warehouse',
        name: 'wareHouseOverview',
        component: ListWareHouse,
        beforeEnter: requireAuth
    },
    {
        path: '/overviews/discountcards',
        name: 'discountCardsOverview',
        component: ListDiscountCards,
        beforeEnter: requireAuth
    },
    {
        path: '/documents/goodsdeliverynotes',
        name: 'goodsdeliverynotes',
        component: ListGoodsDeliveryNotes,
        beforeEnter: requireAuth
    },
    {
        path: '/documents/goodsreceiptnotes',
        name: 'goodsreceiptnotes',
        component: ListGoodsReceiptNotes,
        beforeEnter: requireAuth
    },
    {
        path: '/documents/goodsdeliverynotes/:_key',
        name: 'detaildeliverynotes',
        component: DetailGoodsDeliveryNotes,
        beforeEnter: requireAuth
    },
    {
        path: '/documents/goodsreceiptnotes/:_key',
        name: 'detailreceiptnotes',
        component: DetailGoodsReceiptNotes,
        beforeEnter: requireAuth
    },
    {
        path: '/documents/receipts',
        name: 'receipts',
        component: Receipts,
        beforeEnter: requireAuth
    },
    {
        path: '/documents/wetdeliverynotes',
        name: 'wetdeliverynotes',
        component: ListWetDeliveryNotes,
        beforeEnter: requireAuth
    },
    {
        path: '/documents/wetdeliverynotes/:_key',
        name: 'detailwetdeliverynotes',
        component: DetailWetDeliveryNotes,
        beforeEnter: requireAuth
    }
    ]
})

async function requireAuth(to, from, next) {
    if (!auth.loggedIn()) {
        auth.logout()
    } else {
        if (auth.getLocalStorage('lang')) {
            i18n.locale = auth.getLocalStorage('lang')
        } else {
            i18n.locale = auth.getLocalStorage('cs-CZ')
        }
        if (i18n.t('dropdown.Home') === 'dropdown.Home') {
            for (var x = 0; x < locales.length; x++) {
                await Axios.get(`/ui-api/i18n/${locales[x]}`)
                    .then(response => {
                        var data = response.data
                        delete data._key
                        delete data._id
                        delete data._rev
                        // messages[v] = data
                        i18n.mergeLocaleMessage(locales[x], data)
                    }, response => {
                        i18n.mergeLocaleMessage(locales[x], {})
                    })
            }
        }
        next()
    }
}

function logout(to, from, next) {
    for (var x = 0; x < locales.length; x++) {
        i18n.mergeLocaleMessage(locales[x], {})
    }
    auth.logout()
    next('/')
}
export default router
