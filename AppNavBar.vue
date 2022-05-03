<template>
    <nav class="navbar has-shadow is-fixed-top is-hoverable is-spaced" role="navigation" aria-label="main navigation">
        <div class="container is-fullhd">
            <div class="navbar-brand">
                <router-link to="/dashboard" exact class="navbar-item" title="OctoCBOS"><img :src="logo" alt="OctoCBOS"></router-link>
                <span class="navbar-burger burger"
                    :class="{ 'is-active': isMenuActive }"
                    @click="isMenuActive = !isMenuActive"
                    aria-label="menu" aria-expanded="false" role="button">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </span>
            </div>
            <div class="navbar-menu" :class="{ 'is-active': isMenuActive }">
                <router-link to="/dashboard" exact class="navbar-item"><b-icon icon="view-dashboard"></b-icon>&nbsp;&nbsp;{{$t('dropdown.Home')}}</router-link>
                <!-- <router-link to="/dashboard" exact class="navbar-item"><b-icon icon="view-dashboard"></b-icon>&nbsp;&nbsp;{{ $t("Dashboard")}}</router-link> -->
                <div v-if="stocksRights.list == 'Y' || stockCardsRights.list == 'Y' || stockGroupsRights.list == 'Y'" class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link is-hoverable"><b-icon icon="home-map-marker"></b-icon>&nbsp;&nbsp;{{$t('dropdown.Stock')}}</div>
                    <div class="navbar-dropdown is-left is-boxed">
                        <router-link v-if="stocksRights.list == 'Y'" to="/stocks" exact class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("Stocks")}}</router-link>
                        <router-link v-if="stockCardsRights.list == 'Y'" to="/stockcards" exact class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("StockCards")}}</router-link>
                        <router-link v-if="stockGroupsRights.list == 'Y'" to="/stockgroups" class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("StockGroups")}}</router-link>
                    </div>
                </div>
                <div v-if="partnersRights.list == 'Y' || localCardsRights.list == 'Y' || priceCategoriesRights.list == 'Y'" class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link is-hoverable"><b-icon icon="cash-multiple"></b-icon>&nbsp;&nbsp;{{$t('dropdown.Store')}}</div>
                    <div class="navbar-dropdown is-left is-boxed">
                        <router-link v-if="partnersRights.list == 'Y'" to="/partners" exact class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("Partners")}}</router-link>
                        <router-link v-if="localCardsRights.list == 'Y'" to="/localcards" exact class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("LocalCards")}}</router-link>
                        <router-link v-if="priceCategoriesRights.list == 'Y'" to="/pricecategories" class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("PriceCategories")}}</router-link>
                    </div>
                </div>
                <div v-if="salesOverviewRights.list == 'Y' || wetDeliveriesOverviewRights.list == 'Y' || wetSalesOverviewRights.list == 'Y' || wareHouseOverviewRights.list == 'Y' || lpgReportOverviewRights.list == 'Y' || discountCardsOverviewRights.list == 'Y' || purchaseOverviewRights.list == 'Y'" class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link is-hoverable"><b-icon icon="trending-up"></b-icon>&nbsp;&nbsp;{{$t('dropdown.Reports')}}</div>
                    <div class="navbar-dropdown is-left is-boxed">
                        <router-link v-if="purchaseOverviewRights.list == 'Y'" to="/overviews/purchase" class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("PurchaseOverview")}}</router-link>
                        <router-link v-if="salesOverviewRights.list == 'Y'" to="/overviews/sales" class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("SalesOverview")}}</router-link>
                        <router-link v-if="wetDeliveriesOverviewRights.list == 'Y'" to="/overviews/wetdeliveries" class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("overviews.WetDeliveries.label")}}</router-link>
                        <router-link v-if="wetSalesOverviewRights.list == 'Y'" to="/overviews/wetsales" class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("overviews.WetSales.label")}}</router-link>
                        <router-link v-if="discountCardsOverviewRights.list == 'Y'" to="/overviews/discountcards" class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("overviews.DiscountCards.label")}}</router-link>
                        <router-link v-if="wareHouseOverviewRights.list == 'Y'" to="/overviews/warehouse" class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("overviews.WareHouse.label")}}</router-link>
                        <hr class="navbar-divider">
                        <a v-if="lpgReportOverviewRights.list == 'Y'" @click="LpgReport()" class="navbar-item">{{ $t("overviews.LpgReport.label")}}</a>
                        <a v-if="exportTransactionOverviewRights.list == 'Y'" @click="ExportTransactionDetails()" class="navbar-item">{{ $t("overviews.ExportSalesDetail.label")}}</a>
                    </div>
                </div>
                <div v-if="goodsDeliveryNotesRights.list == 'Y' || goodsReceiptNotesRights.list == 'Y' || receiptsRights.list == 'Y' || wetDeliveryNotesRights.list == 'Y'" class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link is-hoverable"><b-icon icon="file-document-outline"></b-icon>&nbsp;&nbsp;{{$t('dropdown.Documents')}}</div>
                    <div class="navbar-dropdown is-left is-boxed">
                        <router-link v-if="receiptsRights.list == 'Y'" to="/documents/receipts" class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("documents.Receipts.label")}}</router-link>
                        <router-link v-if="goodsDeliveryNotesRights.list == 'Y'" to="/documents/goodsdeliverynotes" class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("documents.GoodsDeliveryNotes.label")}}</router-link>
                        <router-link v-if="goodsReceiptNotesRights.list == 'Y'" to="/documents/goodsreceiptnotes" class="navbar-item"  @click.native="moveFocus('fakeFocus')">{{ $t("documents.GoodsReceiptNotes.label")}}</router-link>
                        <router-link v-if="wetDeliveryNotesRights.list == 'Y'" to="/documents/wetdeliverynotes" class="navbar-item"  @click.native="moveFocus('fakeFocus')">{{ $t("documents.WetDeliveryNotes.label")}}</router-link>
                    </div>
                </div>
                <div v-if="usersRights.list == 'Y' || vatClassesRights.list == 'Y'  || ctClassesRights.list == 'Y'" class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link is-hoverable"><b-icon icon="settings"></b-icon>&nbsp;&nbsp;{{$t('dropdown.Settings')}}</div>
                    <div class="navbar-dropdown is-left is-boxed">
                        <router-link v-if="usersRights.list == 'Y'" to="/users" class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("Users")}}</router-link>
                        <router-link v-if="vatClassesRights.list == 'Y'" to="/vatclasses" class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("VatClass")}}</router-link>                        
                        <router-link v-if="ctClassesRights.list == 'Y'" to="/ctclasses" class="navbar-item" @click.native="moveFocus('fakeFocus')">{{ $t("CtClass")}}</router-link>                        
                        <!-- <router-link v-if="usersRights.list == 'Y'" to="/users" class="navbar-item">Uživatelské role</router-link> -->
                    </div>
                </div>
                <div class="navbar-item  navbar-end">
                    <b-select v-if="!onlyOneSite" icon="account-multiple-outline"  v-model="selectedAccOwner" @input="changeAccount">
                        <option
                            v-for="option in availableAccOwners"
                            :value="option.ico"
                            :key="option.ico">
                                {{ option.company }}
                        </option>
                    </b-select>
                </div>
                <button class="invisible" ref="fakeFocus"></button>
                <div class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link has-dropdown is-hoverable"><b-icon icon="account-outline"></b-icon>&nbsp;{{userName}}</div>
                    <div class="navbar-dropdown has-dropdown is-hoverable is-right is-boxed">
                        <!-- <a class="navbar-item" @click="userDetail()"><b-icon icon="account-settings"></b-icon>&nbsp;&nbsp;{{ $t("UserEdit")}}</a> -->
                        <a v-if="userEmail !== 'octopos@ys.cz'" class="navbar-item" @click="userChangePassword()"><b-icon icon="lock-reset"></b-icon>&nbsp;&nbsp;{{ $t("ChangePassword")}}</a>
                        <a class="navbar-item" @click="logout()"><b-icon pack="mdi" icon="logout"></b-icon>&nbsp;&nbsp;{{ $t("Logout")}}</a>
                    </div>
                </div>
            </div>
            <b-modal :active.sync="showModal" :width="350">
                <change-password-modal v-bind="formData"></change-password-modal>
            </b-modal>
            <b-modal :active.sync="showModalLpgReport" :canCancel="false">
                <lpg-report-modal v-bind="formData"></lpg-report-modal>
            </b-modal>
            <b-modal :active.sync="showModalExportTransactionDetails" :canCancel="false">
                <export-transaction-details-modal v-bind="formData"></export-transaction-details-modal>
            </b-modal>
        </div>
    </nav>
</template>

<script>
import auth from '@/auth'
import logo from '@/assets/MyOctoLogo.png'
import ChangePasswordModal from '@/components/users/modalsDefinitions/ChangePassword'
import LpgReportModal from '@/components/overviews/lpgreport/ModalLpgReport'
import ExportTransactionDetailsModal from '@/components/overviews/exporttransactiondetails/ModalExportTransactionDetails'       /* My */
import MySelect from '@/components/components/MySelect'
import { queries } from '@/constants'

export default {
    name: 'appnavbar',
    components: {
        ChangePasswordModal,
        LpgReportModal,
        ExportTransactionDetailsModal,
        MySelect
    },
    data() {
        return {
            isMenuActive: false,
            userName: auth.getLocalStorage('name'),
            userEmail: auth.getLocalStorage('email'),
            stocksRights: '',
            partnersRights: '',
            localCardsRights: '',
            stockCardsRights: '',
            priceCategoriesRights: '',
            usersRights: '',
            vatClassesRights: '',
            ctClassesRights: '',
            stockGroupsRights: '',
            salesOverviewRights: '',
            purchaseOverviewRights: '',
            wetDeliveriesOverviewRights: '',
            wetSalesOverviewRights: '',
            wareHouseOverviewRights: '',
            lpgReportOverviewRights: '',
            exportTransactionOverviewRights: '',
            discountCardsOverviewRights: '',
            goodsDeliveryNotesRights: '',
            goodsReceiptNotesRights: '',
            receiptsRights: '',
            wetDeliveryNotesRights: '',
            logo: logo,
            formData: '',
            showModal: false,
            showModalLpgReport: false,
            showModalExportTransactionDetails: false,
            loading: false,
            selectedAccOwner: auth.getLocalStorage('mySelectedAccount') || null,
            availableAccOwners: [],
            onlyOneSite: false
        }
    },
    methods: {
        getRights: async function () {
            this.stocksRights = await auth.getRights('Stocks')
            if (this.stocksRights === 'X') {
                this.$buefy.toast.open({ message: this.$i18n.t('messages.ValidityErrorMessage'), type: 'is-danger', duration: 3000 })
                auth.logout()
            }
            this.partnersRights = await auth.getRights('Partners')
            this.localCardsRights = await auth.getRights('LocalCards')
            this.stockCardsRights = await auth.getRights('StockCards')
            this.usersRights = await auth.getRights('Users')
            this.vatClassesRights = await auth.getRights('VatClasses')
            this.ctClassesRights = await auth.getRights('CtClasses')
            this.stockGroupsRights = await auth.getRights('StockGroups')
            this.priceCategoriesRights = await auth.getRights('PriceCategories')
            this.salesOverviewRights = await auth.getRights('SalesOverview')
            this.purchaseOverviewRights = await auth.getRights('PurchaseOverview')
            this.wetDeliveriesOverviewRights = await auth.getRights('WetDeliveriesOverview')
            this.wetSalesOverviewRights = await auth.getRights('WetSalesOverview')
            this.wareHouseOverviewRights = await auth.getRights('WetSalesOverview')
            this.lpgReportOverviewRights = await auth.getRights('LpgReportOverview')
            this.exportTransactionOverviewRights = await auth.getRights('ExportTransactionDetailsOverview')
            this.discountCardsOverviewRights = await auth.getRights('DiscountCardsOverview')
            this.goodsDeliveryNotesRights = await auth.getRights('GoodsDeliveryNotes')
            this.goodsReceiptNotesRights = await auth.getRights('GoodsReceiptNotes')
            this.receiptsRights = await auth.getRights('Receipts')
            this.wetDeliveryNotesRights = await auth.getRights('WetDeliveryNotes')
        },
        logout() {
            this.$router.replace('/')
            auth.logout()
        },
        userDetail() {
            // this.$router.push({
            //     name: 'detailUser',
            //     params: {
            //         id: auth.getLocalStorage('email')
            //     }
            // })
        },
        userChangePassword: function () {
            this.showModal = true
        },
        LpgReport() {
            this.showModalLpgReport = true
        },
        ExportTransactionDetails() {
            this.showModalExportTransactionDetails = true
        },
        changeAccount: function (value) {
            var myModul = auth.getLocalStorage('myModul')
            // console.log('myModul: ' + myModul)
            auth.setLocalStorage('mySelectedAccount', value)
            // console.log('mySelectedAccount: ' + auth.getLocalStorage('mySelectedAccount'))
            this.selectedAccOwner = value
            this.$root.$emit(myModul)
        },
        loadAccounts: async function () {
            this.loading = true
            // nacteni seznamu vlastniku CS
            const ownerFsQueryConfig = {
                columns: 'ico,company',
                search: [
                    `ownerFs~eq~Y`,
                    queries.accOwner()
                ],
                sort: `+company`
            }
            await this.$http.get(`/ui-api/partners?` + this.createPathQueryText(ownerFsQueryConfig))
            .then(response => {
                this.availableAccOwners = []
                response.data.forEach(item => {
                    this.availableAccOwners.push({ ico: item.ico, company: item.company })
                })
                if (this.availableAccOwners.length > 1) {
                    this.onlyOneSite = false
                } else {
                    this.onlyOneSite = true
                }
                if (!this.selectedAccOwner || auth.getLocalStorage('mySelectedAccount') === '0' || !auth.getLocalStorage('mySelectedAccount') || this.onlyOneSite === true) {
                    this.selectedAccOwner = this.availableAccOwners[0].ico
                    auth.setLocalStorage('mySelectedAccount', this.selectedAccOwner)
                    // console.log('INIT mySelectedAccount: ' + auth.getLocalStorage('mySelectedAccount'))
                }
                this.loading = false
            }, response => {
                this.selectedAccOwner = ''
                this.onlyOneSite = true
                this.loading = false
            })
        },
        moveFocus(value) {
            this.$refs[value].focus()
        }

    },
    mounted: async function () {
        await this.loadAccounts()
        await this.getRights()
    }
}
</script>
