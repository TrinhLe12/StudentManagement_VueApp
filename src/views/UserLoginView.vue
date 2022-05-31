<template>
    <div class="row justify-content-center">
        <div class="col-4 container">
            <h1>Login</h1>
            <hr>
            <router-link to="/register">Register new account</router-link>

            <div class="error-mess-area d-flex justify-content-start">
                <p class="typo__p text-success" v-if="submitStatus === stats.Ok">Login Successfully!</p>
                <p class="typo__p text-danger" v-if="submitStatus === stats.Error">{{errorType}}</p>
                <p class="typo__p text-primary" v-if="submitStatus === stats.Pending">Sending...</p>
            </div>
                
            <b-form @submit.prevent="submit">

                <b-form-group label="Email:" label-for="email" label-align="start">
                    <b-form-input class="form__input" id="email" v-model.trim="login.email" placeholder="Enter Email"/>
                </b-form-group>
                <div class="error-mess-area">
                    <div v-if="$v.login.email.$dirty">
                        <div class="error text-danger" v-if="!$v.login.email.required">Email is required</div>
                    </div>
                </div>

                <b-form-group label="Password:" label-for="password" label-align="start">
                    <b-form-input class="form__input" type="password" id="password" v-model.trim="login.password" placeholder="Enter Password"/>
                </b-form-group>
                <div class="error-mess-area">
                    <div v-if="$v.login.password.$dirty">
                        <div class="error text-danger" v-if="!$v.login.password.required">Password is required</div>
                    </div>
                </div>
        
                <div class="d-flex justify-content-end">
                    <b-button class="button" type="submit" :disabled="submitStatus === stats.Pending">Login</b-button>
                </div>
            </b-form>
        </div>
    </div>
</template>

<script>

    import { required } from 'vuelidate/lib/validators'

    import { SubmitStatus } from "@/utility/submit_status"
    import { ApiUrl } from "@/utility/api_url"

    import apiCall from "@/services/api_service"
  
    export default {

        data() {
            return {
                login: {
                    email: '',
                    password: '',
                    rememberMe: false,
                    returnUrl: ''
                },
                submitStatus: '',
                stats: SubmitStatus,
                errorType: ''
            }
        },

        validations: {
            login: {
                email: {
                    required
                },
                password: {
                    required
                }
            }
        },
        
        methods: {
            submit () {
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.submitStatus = SubmitStatus.Invalid
                } else {
                    this.submitStatus = SubmitStatus.Pending
                    setTimeout(() => {

                        this.handleLogin(this.login)

                    }, 500)
                }
            },

            async handleLogin(login) {
                await apiCall
                    .post(ApiUrl.Account_Login, login)
                    .then(response => {
                        localStorage.setItem("currentUser", JSON.stringify(response.data))
                        this.submitStatus = SubmitStatus.Ok
                    })
                    .then(() => this.$router.push(this.$route.query.returnUrl || '/'))
                    .catch(error => {
                        this.errorType = error.response.data
                        this.submitStatus = SubmitStatus.Error
                    })
            }
        }
    }

</script>