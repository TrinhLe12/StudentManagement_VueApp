<template>
    <div v-if="isAddClassShowed">
        
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
                        <b-form-input class="form__input" id="classId" v-model.trim="$v.form.classId.$model" placeholder="Enter Class Id"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.classId.$dirty">
                            <div class="error text-danger" v-if="!$v.form.classId.required">Class Id is required</div>
                            <div class="error text-danger" v-if="!$v.form.classId.classIdRegex">Class Id must match Cxxx pattern</div>
                            <div class="error text-danger" v-if="!$v.form.classId.uniqueClassId">Class Id already existed</div>
                        </div>
                    </div>
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
                <b-button type="button" @click="cancelAddClass">Cancel</b-button>
            </div>
            
        </b-form>
        
    </div>
</template>

<script>

    import apiCall from "@/services/api_service"
    import { ApiUrl } from "@/utility/api_url"
    import { CommonService } from "@/services/common_service"

    import { required, helpers } from 'vuelidate/lib/validators'

    const classIdRegex = helpers.regex('classIdRegex', /^C[0-9]{3}$/)
  
    export default {

        data() {
            return {
                form: {
                    classId: '',
                    className: '',
                    deptId: '' 
                },
                submitStatus: null
            }
        },
        computed: {
            options: function () {
                return this.departmentOptions
            }
        },
        validations () {
            return {
                form: {
                    classId: {
                        required,
                        classIdRegex,
                        uniqueClassId: (value) => this.checkUniqueClassId(value)
                    },
                    className: {
                        required
                    },
                    deptId: {
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
                    setTimeout(() => {
                    
                    apiCall
                        .post(ApiUrl.Class_Save, this.form)
                        .then(() => {
                            this.submitStatus = 'OK'
                            CommonService.ClearForm(this.form, this.$v)
                            this.submitStatus = null
                            this.$emit('canceladdclass')
                        })

                    }, 500)
                }
            },

            async checkUniqueClassId (classId) {
                if (classId == null || classId == undefined || classId == "") {
                    return true
                }

                let response = await apiCall.get(ApiUrl.Class_GetById + classId)

                let result = JSON.parse(JSON.stringify(response.data))

                let id = result.classId

                console.log(id)

                if (id == null || id == undefined || id == "") {
                    return true
                }

                return false
            },

            cancelAddClass () {
                CommonService.ClearForm(this.form, this.$v)
                this.submitStatus = null
                this.$emit('canceladdclass')
            },

        },

        props: {
            isAddClassShowed: Boolean,
            departmentOptions: Array
        }
    }

</script>