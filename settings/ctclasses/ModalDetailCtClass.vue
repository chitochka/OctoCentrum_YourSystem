
<template>
    <section>
        <div class="modal-card">
            <loading-custom :fullPage="fullPage" :sync="loading" message="" :text="true"></loading-custom>
            <header class="modal-card-head">
                <p class="modal-card-title">{{ $t('settings.HeaderDetail')}} - {{ctSpecification}} </p>
            </header>
            <section class="modal-card-body">
                <br>
                <b-table
                    :data="tableData"
                    :striped="true"
                    hoverable
                    narrowed>
                    <template slot-scope="props">
                        <b-table-column field="value" :label="$i18n.t('settings.ctClasses.ctValue')" numeric>
                            {{ (+props.row.value) + ' %' }}
                        </b-table-column>
                        <b-table-column field="ckncs" :label="$i18n.t('settings.ctClasses.ckncs')" numeric>
                            {{ (props.row.ckncs) }}
                        </b-table-column>

                        <b-table-column field="startValid" :label="$i18n.t('startValid')" numeric>
                            {{ new Date(props.row.startValid).toLocaleDateString() }}
                        </b-table-column>
                        <b-table-column field="endValid" :label="$i18n.t('endValid')" numeric>
                            {{  props.row.endValid ? new Date(props.row.endValid).toLocaleDateString() : '' }}
                        </b-table-column>
                        <b-table-column>
                            <span class="remove" v-if="canRemove(props.index)" @click="deleteLastCtValue(props.index)">
                                <b-icon icon="close-box-outline" type="is-danger"/>
                            </span>
                        </b-table-column>
                    </template>
                </b-table>
            </section>
            <footer class="modal-card-foot">
                <div class="control is-pulled-right move-right">
                    <button  type="button" @click="addVatValue"     class="button is-success">{{ $t('buttons.AddVat') }}</button>
                    <button  type="button" @click="$parent.close()" class="button is-dark" >  {{ $t('buttons.Close')  }}</button>
                </div>
            </footer>
        </div>
        <b-modal :active.sync="showModalForAdd" has-modal-card >
            <modal-for-add :listTax="data" @saved="loadData" @close="afterModalClosed"></modal-for-add>
        </b-modal>
    </section>
</template>

<script>
import LoadingCustom from '@/components/components/LoadingCustom'
import auth from '@/auth'
import ModalForAdd from '@/components/settings/ctclasses/ModalForAdd.vue'

export default {
    components: {
        LoadingCustom,
        ModalForAdd
    },
    props: ['keyCtClass'],
    data() {
        return {
            tableData: [],
            data: [],
            ctSpecification: '',
            fullPage: false,
            loading: false,
            showModalForAdd: false
        }
    },
    methods: {
        afterModalClosed() {
            // musi mit is-clipped aby nebyl zobrazen scrollBar
            document.body.parentElement.classList.add('is-clipped')
        },
        loadData: async function () {
            this.loading = true
            const queryConfig = {
                columns: 'specification,_key,details,valid',
                search: [`_key~eq~` + this.keyCtClass]
            }

            // nacteni trid DPH
            this.$http.get(`/ui-api/ctClasses?` + this.createPathQueryText(queryConfig))
                .then(response => {
                    this.data = response.data[0]
                    this.tableData = this.data.details
                    this.ctSpecification = this.data.specification
                    this.isEmpty = false
                    this.loading = false
                }, response => {
                    this.loading = false
                })
        },
        addVatValue() {
            this.showModalForAdd = true
        },
        canRemove(index) {
            if (index !== this.tableData.length - 1 || !index) return false
            if (new Date(this.tableData[index].startValid) > new Date()) return true
            else return false
        },
        deleteLastCtValue: async function (index) {
            this.$buefy.dialog.confirm({
                title: this.$i18n.t('dialogs.DeleteCtValue'),
                message: this.$i18n.t('dialogs.MessageDeleteCtValue').replace('%tax', +this.data.details[index].value).replace('%date', this.formatDate(new Date(this.data.details[index].startValid))),
                confirmText: this.$i18n.t('buttons.Delete'),
                cancelText: this.$i18n.t('buttons.Close'),
                type: 'is-danger',
                hasIcon: true,
                onConfirm: async () => {
                    this.data.details.pop()
                    this.data.details[this.data.details.length - 1].endValid = ''
                    this.loading = true
                    this.$http.put(`/ui-api/ctClasses/` + this.data._key + `?user=` + auth.getLocalStorage('email'), this.data)
                    .then(response => {
                        this.loading = false
                        this.$buefy.toast.open({ message: this.$i18n.t('messages.AlreadySaved'), type: 'is-success', duration: 2000 })
                        this.loadData()
                    }, response => {
                        this.loading = false
                        this.$buefy.toast.open({ message: this.$i18n.t('messages.IssueOnSave'), type: 'is-danger', duration: 2500 })
                        this.loadData()
                    })
                }
            })
        }
    },
    mounted() {
        this.loadData()
    },
    destroyed() {
        this.$emit('close')
    }
}

</script>



<style scoped>
.modal-card {
    width: auto;
    min-height: 460px;
    min-width: 600px;
}
.modal-card-head, .modal-card-title {
    display: block;
}
.modal-card-body {
    width: auto;
}
.modal-card-body .remove{
    cursor:pointer;
}

.move-right {
    margin-left: auto;
}
.modal-card-head {
    border-bottom: 1px solid grey;
}
.modal-card-foot {
    padding: 14px 14px;
    border-top: 1px solid grey;
}

</style>

