<template>
    <div v-if="isUpdateSubjectRegisterShowed">

        <div class="error-mess-area d-flex justify-content-start">
            <p class="typo__p text-success" v-if="submitStatus === 'OK'">Thanks for your submission!</p>
            <p class="typo__p text-danger" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>
            <p class="typo__p text-primary" v-if="submitStatus === 'PENDING'">Sending...</p>
        </div>
        
        <b-form @submit.prevent="submit">

            <div class="row">

                <div class="col-6">
                    <b-form-group label="Student:" label-for="studentId" :class="{ 'form-group--error': $v.form.studentId.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__select form-control" id="studentId" v-model.trim="$v.form.studentId.$model" readonly></b-form-input>
                    </b-form-group>
                    <div class="error-mess-area"></div>
                </div>

                <div class="col-6">
                    <b-form-group label="Subject:" label-for="subjectId" :class="{ 'form-group--error': $v.form.subjectId.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__select form-control" id="subjectId" v-model.trim="$v.form.subjectId.$model" readonly></b-form-input>
                    </b-form-group>
                    <div class="error-mess-area"></div>
                </div>

                <div class="col-6">
                    <b-form-group label="Semester:" label-for="semesterId" :class="{ 'form-group--error': $v.form.semesterId.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__select form-control" id="semesterId" v-model.trim="$v.form.semesterId.$model" readonly></b-form-input>
                    </b-form-group>
                    <div class="error-mess-area"></div>
                </div>

                <div class="col-6">
                    <b-form-group label="Year:" label-for="year" :class="{ 'form-group--error': $v.form.year.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__select form-control" id="year" v-model.trim="$v.form.year.$model" readonly></b-form-input>
                    </b-form-group>
                    <div class="error-mess-area"></div>
                </div>

                <div class="col-6">
                    <b-form-group label="Score 1:" label-for="score1" :class="{ 'form-group--error': $v.form.score1.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__input" id="score1" v-model.trim="$v.form.score1.$model" placeholder="Enter 1st Score"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.score1.$dirty">
                            <div class="error text-danger" v-if="!$v.form.score1.decimalScore">1st Score must be decimal between 0-10</div>
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <b-form-group label="Score 2:" label-for="score2" :class="{ 'form-group--error': $v.form.score2.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__input" id="score2" v-model.trim="$v.form.score2.$model" placeholder="Enter 2nd Score"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.score2.$dirty">
                            <div class="error text-danger" v-if="!$v.form.score2.decimalScore">2nd Score must be decimal between 0-10</div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="d-flex justify-content-end">
                <b-button class="button" type="submit" :disabled="submitStatus === 'PENDING'">Save</b-button>
                &nbsp;
                <b-button type="button" @click="$emit('cancelupdatesubjectregister')">Cancel</b-button>
            </div>

        </b-form>
        
    </div>
</template>

<script>

    import apiCall from "@/services/api_service"
    import { ApiUrl } from "@/utility/api_url"

    import { helpers } from 'vuelidate/lib/validators'
    import { CommonService } from '@/services/common_service'

    const decimalScore = (value) => !helpers.req(value) || ( helpers.regex('scoreRegex', /^([0-9]{1}|[0-9]{2})\.[0-9]{2}$/) && value <= 10 && value >= 0 )
  
    export default {
        data() {
            return {
                submitStatus: null
            }
        },

        computed: {
            form: function () {
                return this.updatedSubjectRegister
            } 
        },
   
        validations: {
            form: {
                studentId: {
                },
                subjectId: {
                },
                semesterId: {
                },
                year: {
                },
                score1: {
                    decimalScore
                },
                score2: {
                    decimalScore
                }
            }
        },
        methods: {
            submit() {
                console.log('submit!')
                this.$v.$touch()

                if (this.$v.$invalid) {
                    this.submitStatus = 'ERROR'

                } else {

                    this.submitStatus = 'PENDING'
                    
                    this.form.score1 = CommonService.ConvertToDecimal(this.form.score1)
                    this.form.score2 = CommonService.ConvertToDecimal(this.form.score2)
                    
                    setTimeout(() => {
                    
                        apiCall
                            .put(ApiUrl.SubRegis_Update, this.form)
                            .then(() => {
                                this.submitStatus = 'OK'
                                this.$emit('cancelupdatesubjectregister')
                            })

                    }, 500)
                }
            },

        },

        props: {
            msg: String,
            isUpdateSubjectRegisterShowed: Boolean,
            updatedSubjectRegister: Object
        }
    }

</script>