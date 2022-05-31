<template>
    <div v-if="isAddSubjectRegisterShowed">

        <div class="error-mess-area d-flex justify-content-start">
            <p class="typo__p text-success" v-if="submitStatus === 'OK'">Thanks for your submission!</p>
            <p class="typo__p text-danger" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>
            <p class="typo__p text-primary" v-if="submitStatus === 'PENDING'">Sending...</p>
            <p class="text-danger" v-if="!this.uniqueSubjectRegister">Subject Register already existed</p>
        </div>
        
        <b-form @submit.prevent="submit">

            <div class="row">

                <div class="col-6">
                    <b-form-group label="Student:" label-for="studentId" :class="{ 'form-group--error': $v.form.studentId.$error }" v-if="this.currentUser.userRole.includes(this.roles.Admin)" label-align="start">
                        <hr class="label-line">
                        <b-form-select class="form__select form-control" id="studentId" v-model.trim="$v.form.studentId.$model" :options="studentOptions"></b-form-select>
                    </b-form-group>
                    <b-form-group label="Student:" label-for="studentId" :class="{ 'form-group--error': $v.form.studentId.$error }" v-if="this.currentUser.userRole.includes(this.roles.Student)" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__input form-control" id="studentId" v-model.trim="$v.form.studentId.$model" readonly />
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.studentId.$dirty">
                            <div class="error text-danger" v-if="!$v.form.studentId.required">Student is required</div>
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <b-form-group label="Subject:" label-for="subjectId" :class="{ 'form-group--error': $v.form.subjectId.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-select class="form__select form-control" id="subjectId" v-model.trim="$v.form.subjectId.$model" :options="subjectOptions"></b-form-select>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.subjectId.$dirty">
                            <div class="error text-danger" v-if="!$v.form.subjectId.required">Subject is required</div>
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <b-form-group label="Semester:" label-for="semesterId" :class="{ 'form-group--error': $v.form.semesterId.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-select class="form__select form-control" id="semesterId" v-model.trim="$v.form.semesterId.$model" :options="semesterOptions"></b-form-select>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.semesterId.$dirty">
                            <div class="error text-danger" v-if="!$v.form.semesterId.required">Semester is required</div>
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <b-form-group label="Year:" label-for="year" :class="{ 'form-group--error': $v.form.year.$error }" label-align="start">
                        <hr class="label-line">
                        <b-form-select class="form__select form-control" id="year" v-model.trim="$v.form.year.$model" :options="yearOptions"></b-form-select>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.year.$dirty">
                            <div class="error text-danger" v-if="!$v.form.year.required">Year is required</div>
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <b-form-group label="Score 1:" label-for="score1" :class="{ 'form-group--error': $v.form.score1.$error }" v-if="this.currentUser.userRole.includes(this.roles.Admin)" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__input" id="score1" v-model.trim="$v.form.score1.$model" placeholder="Enter 1st Score"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.score1.$dirty && this.currentUser.userRole.includes(this.roles.Admin)" >
                            <div class="error text-danger" v-if="!$v.form.score1.decimalScore">1st Score must be decimal between 0-10</div>
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <b-form-group label="Score 2:" label-for="score2" :class="{ 'form-group--error': $v.form.score2.$error }" v-if="this.currentUser.userRole.includes(this.roles.Admin)" label-align="start">
                        <hr class="label-line">
                        <b-form-input class="form__input" id="score2" v-model.trim="$v.form.score2.$model" placeholder="Enter 2nd Score"/>
                    </b-form-group>
                    <div class="error-mess-area">
                        <div v-if="$v.form.score2.$dirty && this.currentUser.userRole.includes(this.roles.Admin)">
                            <div class="error text-danger" v-if="!$v.form.score2.decimalScore">2nd Score must be decimal between 0-10</div>
                        </div>
                    </div>
                </div>

            </div>
                
            <div class="d-flex justify-content-end">
                <b-button class="button" type="submit" :disabled="submitStatus === 'PENDING'">Save</b-button>
                &nbsp;
                <b-button type="button" @click="cancelAddSubjectRegister">Cancel</b-button>
            </div> 
            
        </b-form>

    </div>
</template>

<script>
    import { Role } from "@/utility/role"

    import apiCall from "@/services/api_service"
    import { ApiUrl } from "@/utility/api_url"
    import { CommonService } from "@/services/common_service"

    import { required, helpers } from 'vuelidate/lib/validators'

    const decimalScore = (value) => !helpers.req(value) || ( helpers.regex('scoreRegex', /^([0-9]{1}|[0-9]{2})\.[0-9]{2}$/) && value <= 10 && value >= 0)
  
    export default {
        data() {
            return {
                form: {
                    studentId: '',
                    subjectId: '',
                    semesterId: '',
                    year: '',
                    score1: '',
                    score2: '' 
                },
                uniqueSubjectRegister: true,
                submitStatus: null,

                currentUser: null,
                roles: Role

            }
        },

        validations: {
            form: {
                studentId: {
                    required
                },
                subjectId: {
                    required
                },
                semesterId: {
                    required
                },
                year: {
                    required
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
            async submit() {
                console.log('submit!')
                this.$v.$touch()

                this.uniqueSubjectRegister = 
                    await this.checkUniqueSubjectRegister(
                        this.form.studentId, 
                        this.form.subjectId, 
                        this.form.semesterId, 
                        this.form.year
                    )

                if (this.$v.$invalid || !this.uniqueSubjectRegister) {
                    this.submitStatus = 'ERROR'
                    
                } else {
                    this.submitStatus = 'PENDING'

                    this.form.score1 = CommonService.ConvertToDecimal(this.form.score1)
                    this.form.score2 = CommonService.ConvertToDecimal(this.form.score2)
                    
                    setTimeout(() => {
                        apiCall
                            .post(ApiUrl.SubRegis_Save, this.form)
                            .then(() => {
                                this.submitStatus = 'OK'
                                CommonService.ClearForm(this.form, this.$v)
                                if (this.currentUser.userRole.includes(Role.Student)) {
                                    apiCall
                                        .get(ApiUrl.Student_GetByIdentity + this.currentUser.identityId)
                                        .then(response => {
                                            const student = JSON.parse(JSON.stringify(response.data))
                                            this.form.studentId = student.userId
                                        })
                                }
                                this.submitStatus = null
                                this.$emit('canceladdsubjectregister')
                            })
                    
                    }, 500)
                }
            },

            async checkUniqueSubjectRegister (studentId, subjectId, semesterId, year) {
                
                var studentIdOk = (studentId != null && studentId != undefined && studentId != "")
                var subjectIdOk = (subjectId != null && subjectId != undefined && subjectId != "")
                var semesterIdOk = (semesterId != null && semesterId != undefined && semesterId != "")
                var yearOk = (year != null && year != undefined && year != "")
                
                if (studentIdOk && subjectIdOk && semesterIdOk && yearOk) {
                    
                    var response = await apiCall.get(ApiUrl.SubRegis_GetById + studentId + "&&" + subjectId + "&&" + semesterId + "&&" + year)
                    
                    var result = JSON.parse(JSON.stringify(response.data)).studentId
                    
                    return result === null || result === undefined || result === "" 
                } else {
                    return true
                }
                
                
            },

            cancelAddSubjectRegister () {
                CommonService.ClearForm(this.form, this.$v)
                if (this.currentUser.userRole.includes(Role.Student)) {
                apiCall
                    .get(ApiUrl.Student_GetByIdentity + this.currentUser.identityId)
                    .then(response => {
                        const student = JSON.parse(JSON.stringify(response.data))
                        this.form.studentId = student.userId
                    })
                }
                this.submitStatus = null
                this.$emit('canceladdsubjectregister')
            }
            
        },

        props: {
            isAddSubjectRegisterShowed: Boolean,
            studentOptions: Array,
            subjectOptions: Array,
            semesterOptions: Array,
            yearOptions: Array
        },

        mounted () {
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'))

            if (this.currentUser.userRole.includes(Role.Student)) {
                apiCall
                    .get(ApiUrl.Student_GetByIdentity + this.currentUser.identityId)
                    .then(response => {
                        const student = JSON.parse(JSON.stringify(response.data))
                        this.form.studentId = student.userId
                    })
            } 
        }
    }

</script>