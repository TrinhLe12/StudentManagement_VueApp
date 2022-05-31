<template>
    <div v-if="isUpdateClassShowed">

        <div class="d-flex justify-content-start error-mess-area">
            <p class="typo__p text-success" v-if="submitStatus === 'OK'">Thanks for your submission!</p>
            <p class="typo__p text-danger" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>
            <p class="typo__p text-primary" v-if="submitStatus === 'PENDING'">Sending...</p>
        </div>
        
        <b-form @submit.prevent="submit">

            <div class="row">
                <div class="col-3">
                    <b-form-group label="Class Id:" label-for="classId" :class="{ 'form-group--error': $v.form.classId.$error }" label-align="start">
                        <hr>
                        <b-form-input class="form__input" id="classId" v-model.trim="$v.form.classId.$model" readonly/>
                    </b-form-group>
                    <div class="error-mess-area"></div>
                </div>

                <div class="col-3">
                    <b-form-group label="Department:" label-for="deptId" :class="{ 'form-group--error': $v.form.deptId.$error }" label-align="start">
                        <hr>
                        <b-form-select class="form__select form-control" id="deptId" v-model.trim="$v.form.deptId.$model" :options="options"></b-form-select>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.deptId.$dirty">
                            <div class="error text-danger" v-if="!$v.form.deptId.required">Department is required</div>
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <b-form-group label="Class Name:" label-for="className" :class="{ 'form-group--error': $v.form.className.$error }" label-align="start">
                        <hr>
                        <b-form-input class="form__input" id="className" v-model.trim="$v.form.className.$model" placeholder="Enter Class Name"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.className.$dirty">
                            <div class="error text-danger" v-if="!$v.form.className.required">Class Name is required</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="d-flex justify-content-end">
                <b-button class="button" type="submit" :disabled="submitStatus === 'PENDING'">Save</b-button>
                &nbsp;
                <b-button type="button" @click="$emit('cancelupdateclass')">Cancel</b-button>
            </div>
            
        </b-form>

    </div>
</template>

<script>

    import apiCall from "@/services/api_service"
    import { ApiUrl } from "@/utility/api_url"

    import { required } from 'vuelidate/lib/validators'
  
    export default {

        props: {
            isUpdateClassShowed: Boolean,
            updatedClass: Object,
            departmentOptions: Array
        },

        data() {
            return {
                submitStatus: null
            }
        },

        computed: {
            form: function () {
                return this.updatedClass
            },

            options: function () {
                return this.departmentOptions
            } 

        },

        validations: {
            form: {
                classId: {
                },
                className: {
                    required
                },
                deptId: {
                    required
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
                    setTimeout(() => {
                    
                    apiCall
                    .put(ApiUrl.Class_Update, this.form)
                    .then(() => {
                        this.submitStatus = 'OK'
                        this.$emit('cancelupdateclass')
                    })
                    
                    }, 500)
                }
            }

        }
    }

</script>