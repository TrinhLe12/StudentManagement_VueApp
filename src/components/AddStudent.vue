<template>
    <div v-if="isAddStudentShowed">

        <div class="error-mess-area d-flex justify-content-start">
            <p class="typo__p text-success" v-if="submitStatus === 'OK'">Thanks for your submission!</p>
            <p class="typo__p text-danger" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>
            <p class="typo__p text-primary" v-if="submitStatus === 'PENDING'">Sending...</p>
        </div>
        
        <b-form @submit.prevent="submit">

            <div class="row">

                <div class="col-4">
                    <b-form-group label="User Id:" label-for="userId" :class="{ 'form-group--error': $v.form.userId.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__input" id="userId" v-model.trim="$v.form.userId.$model" placeholder="Enter User Id"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.userId.$dirty">
                            <div class="error text-danger" v-if="!$v.form.userId.required">User Id is required</div>
                            <div class="error text-danger" v-if="!$v.form.userId.userIdRegex">User Id must match Uxxxx pattern</div>
                            <div class="error text-danger" v-if="!$v.form.userId.uniqueUserId">User Id already existed</div>
                        </div>
                    </div>
                </div>

                <div class="col-4">
                    <b-form-group label="User Name:" label-for="userName" :class="{ 'form-group--error': $v.form.userName.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__input" id="userName" v-model.trim="$v.form.userName.$model" placeholder="Enter User Name"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.userName.$dirty">
                            <div class="error text-danger" v-if="!$v.form.userName.required">User Name is required</div>
                        </div>
                    </div>
                </div>

                <div class="col-4">
                    <b-form-group label="Email:" label-for="email" :class="{ 'form-group--error': $v.form.email.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__input" type="email" id="email" v-model.trim="$v.form.email.$model" placeholder="Enter Email"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.email.$dirty">
                            <div class="error text-danger" v-if="!$v.form.email.required">Email is required</div>
                        </div>
                    </div>
                </div>
                
                <div class="col-4">
                    <b-form-group label="Phone:" label-for="phone" :class="{ 'form-group--error': $v.form.phone.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__input" id="phone" v-model.trim="$v.form.phone.$model" placeholder="Enter Phone"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.phone.$dirty">
                            <div class="error text-danger" v-if="!$v.form.phone.required">Phone is required</div>
                            <div class="error text-danger" v-if="!$v.form.phone.phoneRegex">Phone must consist of 10-11 digits</div>
                        </div>
                    </div>
                </div>

                <div class="col-4">
                    <b-form-group label="Birthdate:" label-for="birthdate" :class="{ 'form-group--error': $v.form.birthdate.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-datepicker class="form__input"  id="birthdate" v-model.trim="$v.form.birthdate.$model" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.birthdate.$dirty">
                            <div class="error text-danger" v-if="!$v.form.birthdate.required">Birthdate is required</div>
                            <div class="error text-danger" v-if="!$v.form.birthdate.pastDate">Birthdate must before today</div>
                        </div>
                    </div>
                </div>
                
                <div class="col-4">
                    <b-form-group label="Class:" label-for="classId" :class="{ 'form-group--error': $v.form.classId.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-select class="form__select form-control" id="classId" v-model.trim="$v.form.classId.$model" :options="options"></b-form-select>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.classId.$dirty">
                            <div class="error text-danger" v-if="!$v.form.classId.required">Class is required</div>
                        </div>
                    </div>
                </div>
                
                <div class="col">
                    <b-form-group label="Address:" label-for="address" :class="{ 'form-group--error': $v.form.address.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__input" id="address" v-model.trim="$v.form.address.$model" placeholder="Enter Address"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.address.$dirty">
                            <div class="error text-danger" v-if="!$v.form.address.required">Address is required</div>
                        </div>
                    </div>
                </div>
            
            </div>

            <div class="d-flex justify-content-end">
                <b-button class="button" type="submit" :disabled="submitStatus === 'PENDING'">Submit!</b-button>
            </div>
            
        </b-form>
        
    </div>
</template>

<script>

    import apiCall from "@/services/api_service"
    import { ApiUrl } from "@/utility/api_url"
    import { CommonService } from "@/services/common_service"

    import { required, helpers } from 'vuelidate/lib/validators'

    const userIdRegex = helpers.regex('userIdRegex', /^U[0-9]{4}$/)

    const phoneRegex = helpers.regex('phoneRegex', /^([0-9]{10}|[0-9]{11})$/)

    const pastDate = (value) => { 
        const validatedDate = new Date(value)
        const currentDate = new Date()
        
        return value === null || value === undefined || value === '' || validatedDate.setHours(0,0,0,0) < currentDate.setHours(0,0,0,0)
    }
  
    export default {
        data() {
            return {
                form: {
                    userId: '',
                    userName: '',
                    roleId: 'R01',
                    email: '',
                    phone: '',
                    address: '',
                    birthdate:'',
                    classId: '',
                    identityId: '',
                    returnUrl:'' 
                },
                submitStatus: null
            }
        },
        computed: {
            options: function () {
                return this.classOptions
            }
        },
        validations () {
            return {
                form: {
                    userId: {
                        required,
                        userIdRegex,
                        uniqueUserId: (value) => this.checkUniqueUserId(value)
                    },
                    userName: {
                        required
                    },
                    email: {
                        required
                    },
                    phone: {
                        required,
                        phoneRegex
                    },
                    address: {
                        required
                    },
                    birthdate: {
                        required,
                        pastDate
                    },
                    classId: {
                        required
                    }
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

                    this.form.identityId = this.identityId

                    setTimeout(() => {
                    
                        apiCall
                            .post(ApiUrl.Student_Save, this.form)
                            .then(() => {
                                this.submitStatus = 'OK'
                                CommonService.ClearForm(this.form, this.$v)
                                this.submitStatus = null
                                this.$emit('canceladdstudent')
                            })
                    }, 500)
                }
            },

            async checkUniqueUserId (userId) {
                if (userId == null || userId == undefined || userId == "") {
                    return true
                }

                let response = await apiCall.get(ApiUrl.Student_GetById + userId)

                let result = JSON.parse(JSON.stringify(response.data))

                let id = result.userId

                console.log(id)

                if (id == null || id == undefined || id == "") {
                    return true
                }

                return false
            }

        },

        props: {
            isAddStudentShowed: Boolean,
            classOptions: Array,
            identityId: String
        }
    }

</script>