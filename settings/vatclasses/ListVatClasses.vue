<template>
    <section class='box'>
        <nav class="level">
            <div class="level-left">
                <div class="level-item"> 
                    <p class="title">{{ $t('settings.vatClasses.label') }}</p>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item" v-if="this.rights.create === 'Y'">
                    <button class="button is-medium is-info" @click="openModalAddVat">
                        {{ $t('buttons.AddVatClass') }}
                    </button>
                </div>
            </div>
        </nav>
        <nav class="columns is-multiline is-desktop filter-box">
            <div class="column is-left"></div>
            <div class="column is-2 is-right">
                <div class="column is-narrow">
                    <nav-reload @refreshData="loadAsyncData"></nav-reload>
                </div>
                <div class="column is-narrow">
                    <nav-per-page :perPage="perPage" :loading="loading" :isPaginated="isPaginated" @perPageChanged="changeRowPerPage"></nav-per-page>
                </div>
             </div>
        </nav>
        <loading-custom :fullPage="fullPage" :sync="loading" message="" :text="true"></loading-custom>
        <b-table
            :data="isEmpty ? [] : data"
            :loading="false"
            :paginated="true"
            :per-page="perPage"
            :total="total"
            :striped="true"
            :hoverable="true"
            :narrowed="false"
            :current-page="page"
            :default-sort-direction="defaultSortDirection"
            :default-sort="sortColumn"
            @sort="sortChanged"
            @page-change="pageChanged($event)"
            @click="openModalDetailVatClass($event._key)">
            >
            <!-- ref="table"> -->
            <template slot-scope="props">
                <b-table-column field="specification" :label="$i18n.t('settings.vatClasses.specification')" sortable>
                    {{ props.row.specification }}
                </b-table-column>
                <b-table-column field="value" :label="$i18n.t('settings.vatClasses.vatValue')" sortable numeric>
                    {{ (+props.row.value) + " %" }} 
                </b-table-column>
                <b-table-column field="valid" :label="$i18n.t('settings.valid')" centered>
                    <b-tag v-if="props.row.valid === 'Y'" type="is-success">{{$i18n.t('Active')}}</b-tag>
                    <b-tag v-if="props.row.valid === 'N'" type="is-danger" >{{$i18n.t('Inactive')}}</b-tag>
                </b-table-column>
                <b-table-column  field="startValid" :label="$i18n.t('startValid')" sortable>
                    {{ new Date(props.row.startValid).toLocaleDateString() }}
                </b-table-column>                                
            </template>
            <template slot="empty">
                <no-data/>
            </template>
            <template slot="bottom-left">
                <b-tag size="is-medium" type="is-primary"><p>{{$i18n.t('TotalRecords')}}: {{total}}</p></b-tag>
            </template>
        </b-table>
        <b-modal :active.sync="showModalAddVat" has-modal-card>
            <modal-add-vat v-bind="data" @saved="refreshData"></modal-add-vat>
        </b-modal>
        <b-modal :active.sync="showModalDetailVatClass" has-modal-card>
            <modal-detail-vat-class :keyOfVatClass="keyOfVatClass" @saved="refreshData"  @close="refreshData" ></modal-detail-vat-class>
        </b-modal>
    </section>
</template>

<script>

import auth from '@/auth'
import ModalAddVat from '@/components/settings/vatclasses/ModalAddVat.vue'
import ModalDetailVatClass from '@/components/settings/vatclasses/ModalDetailVatClass'
import NavActive from '@/components/components/NavActive'
import NavPerPage from '@/components/components/NavPerPage'
import NavReload from '@/components/components/NavReload'
import LoadingCustom from '@/components/components/LoadingCustom'
import NoData from '@/components/components/NoData'

export default {
    components: {
        ModalAddVat,
        ModalDetailVatClass,
        NavActive,
        NavReload,
        NavPerPage,
        NoData,
        LoadingCustom
    },
    data() {
        const data = {
            module: 'VatClasses',
            data: [],
            keyOfVatClass: '',
            showModalAddVat: false,
            showModalDetailVatClass: false,
            loading: false,
            isEmpty: true,
            total: 0,
            fullPage: true,
            isPaginated: true,
            sortColumn: auth.getLocalStorage('settings.vatClasses.sortColumn') || 'specification',
            page: parseInt(auth.getLocalStorage('settings.vatClasses.page')) || 1,
            defaultSortDirection: auth.getLocalStorage('settings.vatClasses.sortDirection') || 'desc',
            perPage: auth.getLocalStorage('settings.vatClasses.perPage') || auth.getLocalStorage('perPage') || '10',
            rights: ''
        }
        return data
    },
    methods: {
        openModalAddVat() {
            this.showModalAddVat = true
        },
        openModalDetailVatClass(key) {
            this.keyOfVatClass = key
            this.showModalDetailVatClass = true
        },

        loadAsyncData: async function () {
            this.rights = await auth.getRights(this.module)
            if (this.rights.list === 'N' || this.rights === 'X') {
                if (this.rights === 'X') {
                    this.$buefy.toast.open({ message: this.$i18n.t('messages.ValidityErrorMessage'), type: 'is-danger', duration: 3000 })
                }
                this.$router.replace('/')
                auth.logout()
            }
            this.loading = true
            this.isEmpty = true

            // nacteni trid DPH
            this.$http.get(`/ui-api/vatClasses`).then(response => {
                this.data = []
                response.data.forEach(
                    (vatClass) => {
                        var isFinded = false
                        for (var i = vatClass.details.length - 1; i >= 0; i--) {
                            var item = vatClass.details[i]
                            if ((new Date(item.startValid) < new Date()) && (item.endValid ? (new Date() < (new Date(item.endValid))) : true)) {
                                isFinded = true
                                this.data.push({
                                    _key: vatClass._key,
                                    specification: vatClass.specification,
                                    value: item.value,
                                    startValid: item.startValid,
                                    valid: vatClass.valid
                                })
                            }// if
                        }  // for
                        // pokud nebyl najden zadny zaznam, znamena ze zacatek bude v budoucnu,
                        // proto pouziji prvni zaznam ze seznamu
                        if (!isFinded) {
                            this.data.push({
                                _key: vatClass._key,
                                specification: vatClass.specification,
                                value: vatClass.details[0].value,
                                startValid: vatClass.details[0].startValid,
                                valid: vatClass.valid
                            })
                        }
                    }
                 )
                this.total = this.data.length
                this.isEmpty = false
                this.loading = false
            }, response => {
                this.isEmpty = true
                this.loading = false
            })
        },
        sortChanged: function (field, order) {
            auth.setLocalStorage('settings.vatClasses.sortColumn', field)
            auth.setLocalStorage('settings.vatClasses.sortDirection', order)
        },
        pageChanged: function (value) {
            this.page = parseInt(value)
            auth.setLocalStorage('settings.vatClasses.page', value)
        },
        changeRowPerPage: function (value) {
            this.perPage = value
            auth.setLocalStorage('settings.vatClasses.perPage', value)
            this.refreshData()
        },
        refreshData: async function () {
            await this.loadAsyncData()
        }
    },
    mounted: async function () {
        auth.setLocalStorage('myModul', this.module)
        await this.loadAsyncData()
    }
}
</script>

<style scoped>
    .b-table td {
        cursor: pointer
    }
</style>
