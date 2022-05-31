<template>
  <div class="container">

    <div class="d-flex flex-column mb-3">
      <div class="d-flex justify-content-start align-items-center">
        <h1>{{ title }}</h1>
      </div>
    </div>

    <RegisterUser msg="Register New Account" v-bind="register" v-on:registerstudent="registerStudent" v-on:registeradmin="registerAdmin" />
    <AddStudent msg="Add New Student" v-bind="addStudentInfo" v-on:canceladdstudent="cancelAddStudent"/>
  </div>
</template>

<script>
import RegisterUser from "@/components/RegisterUser.vue"
import AddStudent from "@/components/AddStudent.vue"

import { Title } from "@/utility/title"
import { ApiUrl } from "@/utility/api_url"
import { CommonService } from "@/services/common_service"

import apiCall from "@/services/api_service"

export default {
  name: 'UserRegisterView',

  data () {
    return {

      register: {
        isRegisterUserShowed: true,
        userRole: ''
      },

      addStudentInfo: {
        isAddStudentShowed: false,
        classOptions: [],
        identityId: ''
      },

      classes: [],
      title: ''
      
    }
  }, 

  components: {
      RegisterUser,
      AddStudent
  },

  methods: {

    registerStudent: async function ({newStudent, password}) {

        const login = {email: newStudent.email, password: password, rememberMe: false, returnUrl: ""}

        await apiCall
            .post(ApiUrl.Account_Login, login)
                .then(response => {
                    localStorage.setItem("currentUser", JSON.stringify(response.data))
                })

        this.addStudentInfo.isAddStudentShowed = true
        this.register.isRegisterUserShowed = false

        await this.getClasses()

        this.addStudentInfo.classOptions = CommonService.ConvertToClassOptions(this.classes)
        this.addStudentInfo.identityId = newStudent.identityId
        console.log(this.addStudentInfo.identityId)

        this.title = Title.Student_AS
    },

    cancelAddStudent: function () {
      this.$router.push(this.$route.query.returnUrl || '/')
    },
    
    registerAdmin: async function ({email, password}) {

      const login = {email: email, password: password, rememberMe: false, returnUrl: ""}

      await apiCall
          .post(ApiUrl.Account_Login, login)
              .then(response => {
                  localStorage.setItem("currentUser", JSON.stringify(response.data))
              })
              .then(() => this.$router.push(this.$route.query.returnUrl || '/'))
        
    },

    getClasses: async function () {
      await apiCall
        .get(ApiUrl.Class_Get)
        .then(response => (this.classes = JSON.parse(JSON.stringify(response.data))))
    }

  },

  mounted () {
    this.title = Title.Register_NU
  }
}
</script>