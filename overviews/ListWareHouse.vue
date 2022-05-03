<!-- 

Pozastaveno do vytvoreni metody pro stazeni dat z BE
    
-->
<template>
    <section class='box'>
        <nav class="level">
            <div class="level-left">
                <div class="level-item">
                    <p class="title">{{ $t('overviews.WareHouse.label')}} 
                        <!-- <span v-if="onlyOneStock && this.stockName"> - {{ this.stockName }}</span> -->
                    </p>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                    <!-- <a class="button is-medium has-background-light has-text-success" @click="console.log('getXlsx')" :disabled="!dataTable.length || loading || $v.isFromAfterEnd " v-bind:title="$i18n.t('messages.downloadWareHouseOverviewXlsx')"> -->
                    <a class="button is-medium has-background-light has-text-success" @click="console.log('getXlsx')" :disabled="false" v-bind:title="$i18n.t('messages.downloadWareHouseOverviewXlsx')">
                        <b-icon icon="file-excel" size="is-medium" />
                    </a>
                </div>
            </div>
        </nav>

        <nav class="columns is-multiline is-desktop filter-box">
            <div class="column is-left">
                <div class="column is-narrow">
                    <b-field v-bind:type="$v.isFromAfterEnd ? '': 'is-danger'" :message="!$v.isFromAfterEnd ? $t('overviews.WareHouse.fromAfterEnd') : ''"> 
                        <div>
                            <label class="help">{{this.$i18n.t('StartDate')}}</label>
                             <b-datepicker   v-model="dateFrom" :min-date="minDateFrom" :max-date="maxDateFrom" @input="setDateFrom"></b-datepicker >
                        </div>
                    </b-field>
                </div>
                <div class="column is-narrow">
                    <b-field >
                        <div>
                            <label class="help">{{this.$i18n.t('EndDate')}}</label>
                            <b-datepicker   v-model="dateTo" :min-date="minDateTo" @input="setDateTo">
                                <button class="button is-danger"
                                    @click="setDateTo(null)">
                                    <b-icon icon="close"></b-icon>
                                    <span>Clear</span>
                                </button>
                            </b-datepicker >
                        </div>
                    </b-field>
                </div>
                <div class="column is-narrow">
                    <b-field > 
                        <my-select  :label="this.$i18n.t('StkitmType')"  :model="stkitmType" :list="stkitmTypeForSelect" itemLabel="label" itemKey="value" :loading="loading" @changeSelect="changeStkitmType" expanded  ></my-select>
                    </b-field>
                </div>
                <div v-if="stocksForSelect.length && !onlyOneStock" class="column is-narrow">
                    <my-select retObject="true" :label="this.$i18n.t('Stock')" :model="stock" :list="stocksForSelect" itemLabel="text" itemKey="_key" :loading="loading" @changeSelect="changeStock"></my-select>
                </div>
            </div>
            <div class="column is-2 is-right">
                <div class="column is-narrow">
                    <nav-reload @refreshData="refreshData"></nav-reload>
               </div>
                <div class="column is-narrow">
                    <nav-per-page :perPage="perPage" :loading="loading" :isPaginated="isPaginated" @perPageChanged="changeRowPerPage"></nav-per-page>
                </div>
            </div>
        </nav>

        <loading-custom :fullPage="fullPage" :sync="loading" message="" :text="true"></loading-custom>        

       <!-- B - Table -->
        <!-- <b-table :data="isEmpty ? [] : dataTable"
                :loading="false"
                :paginated="isPaginated"
                :per-page="perPage"
                :total="total"
                :striped="true"
                :hoverable="isHoverable"
                :narrowed="isNarrowed"
                :current-page="page"
                v-on:sort="sortChanged"
                v-on:page-change="pageChanged($event)">
            <template slot-scope="props">
                <b-table-column field="" v-bind:label="$i18n.t('overviews.WareHouse.')" >
                    {{ props.row. }}
                </b-table-column>
            </template>
            <template slot="empty"> 
                <no-data/>
            </template>
            <template slot="bottom-left">
                <b-tag size="is-medium" type="is-primary"><p>{{$i18n.t('TotalRecords')}}: {{total}}</p></b-tag>
            </template>
        </b-table> -->

    </section>
</template>

<script>
import auth from '@/auth'
// import FileSaver from 'file-saver'
import { queries } from '@/constants'
import MySelect from '@/components/components/MySelect'
import NavReload from '@/components/components/NavReload'
import NavPerPage from '@/components/components/NavPerPage'
import LoadingCustom from '@/components/components/LoadingCustom'
import NoData from '@/components/components/NoData'
import moment from 'moment'

export default {
    components: {
        MySelect,
        NavReload,
        NavPerPage,
        NoData,
        LoadingCustom
    },
    data() {
        return {
            module: 'WareHouseOverview',
            dateFrom: auth.getLocalStorage('overviews.warehouse.datefrom') ? new Date(auth.getLocalStorage('overviews.warehouse.datefrom')) : new Date(),
            minDateFrom: auth.getLocalStorage('overviews.wareHouse.minDateFrom') ? new Date(auth.getLocalStorage('overviews.wareHouse.minDateFrom')) : null,
            maxDateFrom: new Date(),
            dateTo: moment(new Date(auth.getLocalStorage('overviews.warehouse.dateto'))).isValid() ? new Date(auth.getLocalStorage('overviews.warehouse.dateto')) : null,
            minDateTo: auth.getLocalStorage('overviews.warehouse.datefrom') ? new Date(auth.getLocalStorage('overviews.warehouse.datefrom')) : new Date(),
            stockCardCounts: [],
            stockCardTypes: [],
            stkitmTypeForSelect: [],
            stocksForSelect: [],
            onlyOneStock: true,
            stock: auth.getLocalStorage('overviews.wareHouse.stock') || '',
            stockName: '',
            onlyOneSite: true,
            stkitmType: auth.getLocalStorage('overviews.wareHouse.stkitmType') || '',
            loading: false,
            //
            //
            // data: [],
            isEmpty: true,
            isHoverable: true,
            isNarrowed: false,
            total: 0,
            fullPage: true,
            showModal: false,
            isPaginated: true,
            sortColumn: auth.getLocalStorage('overviews.wareHouse.sortColumn') || '',
            page: parseInt(auth.getLocalStorage('overviews.wareHouse.page')) || 1,
            defaultSortDirection: auth.getLocalStorage('overviews.wareHouse.sortDirection') || 'asc',
            perPage: auth.getLocalStorage('overviews.wareHouse.perPage') || auth.getLocalStorage('perPage') || '10',
            dataTable: [],
            fileName: ''
        }
    },
    validations: {
        isFromAfterEnd() {
            return !moment(this.dateFrom).isAfter(moment(this.dateTo ? this.dateTo : new Date()))
        }
    },
    methods: {
        setDateFrom: function (value) {
            var date = new Date(value)
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
            this.dateFrom = date
            auth.setLocalStorage('overviews.warehouse.datefrom', date)
            this.minDateTo = date
        },
        setDateTo: function (value) {
            var date = value ? new Date(value) : null
            this.dateTo = date
            auth.setLocalStorage('overviews.warehouse.dateto', value ? date : null)
            this.maxDateFrom = date || new Date()
        },
        changeStkitmType: function (value) {
            auth.setLocalStorage('overviews.wareHouse.stkitmType', value)
        },
        changeStock: async function (value) {
            this.stock = value._key
            this.stockName = value.text
            auth.setLocalStorage('overviews.wareHouse.stock', value._key)
            auth.setLocalStorage('overviews.wareHouse.stockName', value.text)
            await this.setMinDateFrom()
        },
        loadStkitmType: async function () {
            this.loading = true
            // nacteni typu skladovych karet
            this.$http.get(`/ui-api/enums/stockcardtypes`).then(
                response => {
                    this.stkitmTypeForSelect = []
                    this.stkitmTypeForSelect.push({ 'value': '', 'label': 'enums.WithoutFilter' })
                    response.data.items.forEach(item => {
                        if (['W', 'D'].includes(item.value)) this.stkitmTypeForSelect.push({ 'value': item.value, 'label': item.label })
                    })
                    console.warn('\nDRUH ZBOZI\n')
                    console.warn(this.stkitmTypeForSelect)
                    this.loading = false
                }, response => { this.loading = false })
        },
        loadStocks: async function () {
            this.loading = true
            const queryStockConfig = {
                columns: 'text,accOwner,city,street,zip',
                sort: '+text',
                search: [
                    `accOwner~eq~` + this.mySelectedAccount(),
                    queries.stocks()
                ]
            }
            this.$http.get(`/ui-api/stocks?` + this.createPathQueryText(queryStockConfig)).then(
                response => {
                    this.stocksForSelect = []

                    if (response.data.length > 1) {
                        this.stocksForSelect.push({ '_key': '', 'text': 'enums.WithoutFilter1' })
                    }
                    response.data.forEach(item => {
                        this.stocksForSelect.push({ '_key': item._key, 'text': item.text })
                    })
                    this.stocksForSelect.length > 1 ? this.onlyOneStock = false : this.onlyOneStock = true

                    if (this.stocksForSelect.length === 1) {
                        this.stock = this.stocksForSelect[0]._key
                        this.stockName = this.stocksForSelect[0].text
                        auth.setLocalStorage('overviews.wareHouse.stock', this.stock)
                        auth.setLocalStorage('overviews.wareHouse.stockName', this.stockName)
                    } else {
                        if (!this.stock && this.stocksForSelect[0]) {
                            this.stock = this.stocksForSelect[0]._key
                            this.stockName = this.stocksForSelect[0].text
                            auth.setLocalStorage('overviews.wareHouse.stock', this.stock)
                            auth.setLocalStorage('overviews.wareHouse.stockName', this.stockName)
                        }
                    }
                    this.loading = false
                }, response => {
                this.loading = false
            })
        },
        setMinDateFrom: async function () {
            this.loading = true
            var minDate = new Date(await this.getMinYear(this.stock, 'D'), 0, 1)
            this.minDateFrom = minDate
            this.maxDateFrom = this.dateTo ? this.dateTo : new Date()
            auth.setLocalStorage('overviews.wareHouse.minDateFrom', this.minDateFrom)
            this.loading = false
        },
        loadFiltersData: async function () {
            await this.loadStkitmType()
            await this.loadStocks()
            await this.setMinDateFrom()
        },

        // metody pro tabulku
        sortChanged: function (field, order) {
            auth.setLocalStorage('overviews.wareHouse.sortColumn', field)
            auth.setLocalStorage('overviews.wareHouse.sortDirection', order)
        },
        pageChanged: function (value) {
            this.page = parseInt(value)
            auth.setLocalStorage('overviews.wareHouse.page', value)
        },
        changeRowPerPage: function (value) {
            this.perPage = value
            auth.setLocalStorage('overviews.wareHouse.perPage', value)
            this.refreshData()
        },
        refreshData() {}

    },
    mounted: async function () {
        await this.loadFiltersData()
    }
}
</script>
