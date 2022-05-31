<template>
    <div v-if="isRegisterUserShowed">
        
        <div class="error-mess-area d-flex justify-content-start">
            <p class="typo__p text-success" v-if="submitStatus === 'OK'">Thanks for your submission!</p>
            <p class="typo__p text-danger" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>
            <p class="typo__p text-primary" v-if="submitStatus === 'PENDING'">Sending...</p>
        </div>

        <b-form @submit.prevent="submit">
            
            <div class="row">

                <div class="col">
                    <b-form-group label="Email:" label-for="email" :class="{ 'form-group--error': $v.form.email.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__input" type="email" id="email" v-model.trim="$v.form.email.$model" placeholder="Enter Email"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.email.$dirty">
                            <div class="error text-danger" v-if="!$v.form.email.required">Email is required</div>
                            <div class="error text-danger" v-if="!$v.form.email.uniqueEmail">Email already existed</div>
                        </div>
                    </div>
                </div>
                
                <div class="col">
                    <b-form-group label="Password:" label-for="password" :class="{ 'form-group--error': $v.form.password.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__input" id="password" type="password" v-model.trim="$v.form.password.$model" placeholder="Enter Password"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.password.$dirty">
                            <div class="error text-danger" v-if="!$v.form.password.required">Password is required</div>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <b-form-group label="Confirm Password:" label-for="confirmPassword" :class="{ 'form-group--error': $v.form.confirmPassword.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__input" id="confirmPassword" type="password" v-model.trim="$v.form.confirmPassword.$model" placeholder="Confirm Password"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.confirmPassword.$dirty">
                            <div class="error text-danger" v-if="!$v.form.confirmPassword.required">Confirm password is required</div>
                            <div class="error text-danger" v-if="!$v.form.confirmPassword.matchPassword">Confirm password must match password</div>
                        </div>
                    </div>
                </div>

                <div class="col" v-if="!isRoleStudent">
                    <b-form-group label="Role:" label-for="userRole" :class="{ 'form-group--error': $v.form.userRole.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-select class="form__select form-control" id="userRole" v-model.trim="$v.form.userRole.$model" :options="roleOptions"></b-form-select>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.userRole.$dirty">
                            <div class="error text-danger" v-if="!$v.form.userRole.required">Role is required</div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="d-flex justify-content-end">
                <b-button class="button" type="submit" :disabled="submitStatus === 'PENDING'">Register</b-button>
                &nbsp;
                <b-button type="button" @click="cancelRegisterUser">Cancel</b-button>
            </div>
        </b-form>
        
    </div>
</template>

<script>

    import apiCall from "@/services/api_service"
    import { ApiUrl } from "@/utility/api_url"
    import { CommonService } from "@/services/common_service"

    import { required } from 'vuelidate/lib/validators'
    import { Role } from "@/utility/role"

    const matchPassword = (value, vm) => {
        const pass = vm.password
        return value === null || value === undefined || value === '' || value === pass
    }
  
    export default {
        data() {
            return {
                form: {
                    email: '',
                    password: '',
                    confirmPassword: '',
                    userRole: '',
                    returnUrl:'' 
                },
                roleOptions: [],
                submitStatus: null
            }
        },

        computed: {
            isRoleStudent: function () {
                return this.userRole === Role.Student
            }
        },

        validations () {
            return {
                form: {
                    email: {
                        required,
                        uniqueEmail: (value) => this.checkUniqueEmail(value)
                    },
                    password: {
                        required
                    },
                    confirmPassword: {
                        required,
                        matchPassword
                    },
                    userRole: {
                        required
                    }
                }
            }
        },

        methods: {
            submit () {
                console.log('submit!')
                // If component RegisterUser is called by ManageStudentView (called by Admin)
                // Admin is adding new student --> form.userRole must be Student 
                if (this.userRole == Role.Student) {
                    this.form.userRole = this.userRole
                }

                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.submitStatus = 'ERROR'
                } else {
                    this.submitStatus = 'PENDING'
                    setTimeout(() => {

                        this.handleRegister(this.form)

                    }, 500)
                }
            },

            async handleRegister(form) {
                await apiCall
                    .post(ApiUrl.Account_Register, form)
                    .then(response => {
                        this.submitStatus = 'OK'
                        // If the new user is a student --> Must add new student to DB after creating new account
                        if (form.userRole == Role.Student) {
                            const newStudent = JSON.parse(JSON.stringify(response.data))
                            console.log(newStudent)
                            // If prop userRole == "Student" --> Admin is creating new student
                            // --> No need to log the new student in
                            // --> Just pass newStudent to registerStudent() method in ManageStudentView for adding new student to DB
                            if (this.userRole == Role.Student) {
                                CommonService.ClearForm(form, this.$v)
                                this.submitStatus = null
                                this.$emit('registerstudent', newStudent)

                                // Else means prop userRole wasn't preset 
                                // --> A new Student is creating a new account
                                // --> Pass newStudent and password to registerStudent() method in UserRegisterView for logging and adding new student to DB  
                            } else {
                                const pass = form.password
                                CommonService.ClearForm(form, this.$v)
                                this.submitStatus = null
                                this.$emit('registerstudent', {newStudent: newStudent, password: pass})
                            }
                            // If the new user is not a student (aka admin) --> No need to add new student to DB
                            // Just log the new admin in
                        } else {
                            const pass = form.password
                            const mail = form.email
                            CommonService.ClearForm(form, this.$v)
                            this.submitStatus = null
                            this.$emit('registeradmin', {email: mail, password: pass})
                        }
                        
                    })
                    .catch(error => {
                        console.log(error.response.data)
                        this.submitStatus = 'ERROR'
                    })
            },

            async checkUniqueEmail (email) {
                if (email == null || email == undefined || email == "") {
                    return true
                }

                let response = await apiCall.get(ApiUrl.Account_GetByEmail + email)

                let result = JSON.parse(JSON.stringify(response.data))

                let resultEmail = result.email

                console.log(resultEmail)

                if (resultEmail == null || resultEmail == undefined || resultEmail == "") {
                    return true
                }

                return false
            },

            cancelRegisterUser () {
                CommonService.ClearForm(this.form, this.$v)
                this.submitStatus = null
                this.$emit('cancelregisteruser')
            }

        },

        props: {
            isRegisterUserShowed: Boolean,
            userRole: String
        },

        mounted () {
            this.roleOptions.push({value: '', text: "Select Role"})
            for (const r in Role) {
                this.roleOptions.push({value: r, text: r})
            }
        }
    }

</script>