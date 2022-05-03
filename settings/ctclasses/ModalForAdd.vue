<template>
        <div class="modal-card">
            <loading-custom :fullPage="fullPage" :sync="loading" message="" :text="true"></loading-custom>
            <header class="modal-card-head">
                <p class="modal-card-title">{{ $t('settings.ctClasses.HeaderAddCt' + (isNewCtClass ? 'Class' : 'Value'))}}  </p>
            </header>
            <section class="modal-card-body">
                    <div class="columns">
                        <div class="column" >
                            <b-field :label="this.$i18n.t('settings.nameOfClass')"  v-bind:type="$v.formData.specification.required ? '': 'is-danger'">
                                <div>
                                    <b-input type="text" :disabled="!isNewCtClass"  v-bind:placeholder="$t('settings.InputNameOfClass')" v-model="formData.specification"></b-input>
                                    <p v-if="isNewCtClass ? !$v.formData.specification.required : false"  class="help is-danger" >{{$t('error.Required')}}</p>
                                    <p v-if="isNewCtClass ? false : !$v.formData.startValid.required"     class="help is-danger small" > &nbsp; </p>
                                </div>
                            </b-field>
                            <b-field :label="this.$i18n.t('settings.ctClasses.ctValue')" v-bind:type="$v.formData.value.required && $v.formData.value.maxValue && $v.formData.value.minValue ? '': 'is-danger'">
                                <div>
                                    <b-input v-model="formData.value"  v-bind:placeholder="$t('settings.ctClasses.InputCtValue')" type="number" step="0.1" min="0" max="100"> </b-input>
                                    <p class="help is-danger small" v-if="!$v.formData.value.required">{{$t('error.Required')}}</p>
                                </div>
                            </b-field>
                        </div>
                        <div class="column" >   
                            <b-field :label="this.$i18n.t('startValid')"  v-bind:type="$v.formData.startValid.required ? '': 'is-danger'">
                                 <div>
                                    <b-datepicker v-model="formData.startValid" :min-date="minDate" v-bind:placeholder="$t('settings.ClickToSelect')" icon="calendar-today" ></b-datepicker>
                                    <p class="help is-danger small" v-if="!$v.formData.startValid.required">{{$t('error.Required')}}</p>
                                 </div>
                            </b-field>
                            <!-- 
                                DOLADIT po upresneni detailu ohledne Nomenklatury  
                                <b-field :label="this.$i18n.t('settings.ctClasses.ckncs')"  v-bind:type="$v.formData.ckncs.required ? '' : 'is-danger'">
                             -->
                            <b-field :label="this.$i18n.t('settings.ctClasses.ckncs')" >
                                <div>
                                    <b-input v-model="formData.ckncs"  v-bind:placeholder="$t('settings.ctClasses.InputCtCkncs')" type="number" min="0"> </b-input>
                                    <!-- <p class="help is-danger small" v-if="!$v.formData.ckncs.required">{{$t('error.Required')}}</p> -->
                                </div>
                            </b-field>
                        </div>
                    </div>
            </section>
            <footer class="modal-card-foot">
                <div class="control is-pulled-right move-right">
                    <!-- <button  type="button" class="button is-success" @click="saveData"  :disabled="(isNewCtClass? !$v.formData.specification.required : false ) || !$v.formData.ckncs.required || !$v.formData.ckncs.minValue  || !$v.formData.value.required  || !$v.formData.value.minValue || !$v.formData.value.maxValue  || !$v.formData.startValid.required">{{ $t('buttons.Add')  }}</button> -->
                    <button  type="button" class="button is-success" @click="saveData"  :disabled="(isNewCtClass? !$v.formData.specification.required : false ) || !$v.formData.value.required  || !$v.formData.value.minValue || !$v.formData.value.maxValue  || !$v.formData.startValid.required">{{ $t('buttons.Add')  }}</button>
                    <button  type="button" class="button is-dark"    @click="$parent.close()"> {{ $i18n.t('buttons.Close') }} </button>
                </div>
            </footer>
        </div>
</template>




<script>

import auth from '@/auth'
import LoadingCustom from '@/components/components/LoadingCustom'
import { required, minValue, maxValue } from 'vuelidate/lib/validators'

export default {
    components: { LoadingCustom },
    props: ['listTax'],
    data() {
        return {
            formData: {
                specification: this.listTax ? this.listTax.specification : '',
                startValid: null,
                ckncs: '',
                value: ''
            },
            details: this.listTax ? this.listTax.details : [],
            isNewCtClass: !this.listTax,
            minDate: null,
            fullPage: false,
            loading: false
        }
    },
    methods: {
        setMinDate() {
            var lastStartValid = new Date(this.listTax ? this.listTax.details[this.listTax.details.length - 1].startValid : '')
            this.minDate = lastStartValid > new Date()
                ? new Date(lastStartValid - (-86400000))  // 1den === 86400000
                : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)
        },
        saveData() {
            this.loading = true
            // nastavim konec platnosti posl.zaznamu jako zacatek nove - 1 sek
            if (!this.isNewCtClass) this.details[this.details.length - 1].endValid = this.getUTCDate(new Date(this.formData.startValid - 1))

            this.details.push({
                startValid: this.getUTCDate(this.formData.startValid),
                value: (+this.formData.value).toFixed(1),
                ckncs: this.formData.ckncs + '',
                endValid: ''
            })

            if (this.isNewCtClass) {
                const formData = {
                    specification: this.formData.specification.trim(),
                    details: this.details,
                    valid: 'N'
                }
                this.$http.post(`/ui-api/ctClasses?user=` + auth.getLocalStorage('email'), formData, { emulateJSON: true, emulateHTTP: true })
                    .then(response => {
                        serverResponse(true)
                    }, response => {
                        serverResponse(false)
                    })
            } else {
                this.$http.put(`/ui-api/ctClasses/` + this.listTax._key + `?user=` + auth.getLocalStorage('email'), this.listTax)
                    .then(response => {
                        serverResponse(true)
                    }, response => {
                        serverResponse(false)
                    })
            }
            var serverResponse = (isSuccess) => {
                this.loading = false
                this.$buefy.toast.open({ message: this.$i18n.t('messages.' + (isSuccess ? 'AlreadySaved' : 'IssueOnSave')), type: isSuccess ? 'is-success' : 'is-danger', duration: 2000 })
                if (!isSuccess) return
                this.$parent.close()
                this.$emit('saved')
            }
        }
    },
    validations: {
        formData: {
            specification: { required },
            startValid: { required },
/*            // po upresneni detailu ohledne "ckncs" (Nomenklatura) doladit (je ne/povinny, validace atd)
            ckncs: {
                minValue: minValue(0),
                required
            },*/
            value: {
                required,
                minValue: minValue(0),
                maxValue: maxValue(100)
            }
        }
    },
    mounted() {
        this.setMinDate()
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
.modal .animation-content .modal-card {
  overflow: visible !important;
}
.modal-card-body {
  overflow: visible !important;
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