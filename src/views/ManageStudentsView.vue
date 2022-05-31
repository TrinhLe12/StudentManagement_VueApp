<template>
  <div class="container">
    
    <div class="d-flex flex-column mb-3">
      <div class="d-flex justify-content-start align-items-center">
        <h1>{{ title }}</h1>
      </div>
      <div class="d-flex justify-content-end align-items-center">
        <b-button v-on:click="addStudent" v-if="this.students.isGetStudentsShowed && this.currentUser.userRole.includes(this.roles.Admin)">Add Student</b-button>
      </div>
    </div>

    <GetStudents v-bind="students" v-on:deletestudent="deleteStudent" v-on:updatestudent="updateStudent"/>
    <RegisterUser v-bind="register" v-on:registerstudent="registerStudent" v-on:cancelregisteruser="cancelRegisterUser"/>
    <AddStudent v-bind="addStudentInfo" v-on:canceladdstudent="cancelAddStudent"/>
    <UpdateStudent v-bind="updateInfo" v-on:cancelupdatestudent="cancelUpdateStudent"/>
  </div>
</template>

<script>
  import GetStudents from "@/components/GetStudents.vue"
  import RegisterUser from "@/components/RegisterUser.vue"
  import AddStudent from "@/components/AddStudent.vue"
  import UpdateStudent from "@/components/UpdateStudent.vue"
  
  import { Role } from "@/utility/role"
  import { Title } from "@/utility/title"
  import { ApiUrl } from "@/utility/api_url"
  import { CommonService } from "@/services/common_service"

  import apiCall from "@/services/api_service"

  export default {
    name: 'ManageStudentView',

    data () {
      return {

        students: {
          isGetStudentsShowed: true,
          studentList: []
        },

        register: {
          isRegisterUserShowed: false,
          userRole: Role.Student
        },

        addStudentInfo: {
          isAddStudentShowed: false,
          classOptions: [],
          identityId: ''
        },

        updateInfo: {
          isUpdateStudentShowed: false,
          updatedStudent: {},
          classOptions: []
        },

        classes: [],
        title: '',
        currentUser: {
          userRole: [],
          identityId: ''
        },
        roles: Role
        
      }
    }, 

    components: {
        GetStudents,
        RegisterUser,
        AddStudent,
        UpdateStudent
    },

    methods: {

      getStudents: function () {
        apiCall
          .get(ApiUrl.Student_Get)
          .then(response => (this.students.studentList = JSON.parse(JSON.stringify(response.data))))
      },

      getStudentById: async function (userId) {
        
        let student = null
        
        await apiCall
          .get(ApiUrl.Student_GetById + userId)
          .then(response => (student = JSON.parse(JSON.stringify(response.data))))

        return student
      },

      getStudentByIdentity: async function (identityId) {
        
        let student = {}
        
        await apiCall
          .get(ApiUrl.Student_GetByIdentity + identityId)
          .then(response => (student = JSON.parse(JSON.stringify(response.data))))

        return student
      },

      addStudent: async function () {
        this.register.isRegisterUserShowed = true
        this.students.isGetStudentsShowed = false

        this.title = Title.Student_AS
      },

      registerStudent: async function (newStudent) {
        this.addStudentInfo.isAddStudentShowed = true
        this.register.isRegisterUserShowed = false

        await this.getClasses()

        this.addStudentInfo.classOptions = CommonService.ConvertToClassOptions(this.classes)
        this.addStudentInfo.identityId = newStudent.identityId

        this.title = Title.Student_AS
      },

      cancelRegisterUser: function () {
        this.register.isRegisterUserShowed = false
        this.students.isGetStudentsShowed = true
        this.getStudents()
        this.title = Title.Student_MS
      },

      cancelAddStudent: function () {
        this.addStudentInfo.isAddStudentShowed = false
        this.students.isGetStudentsShowed = true
        this.getStudents()
        this.title = Title.Student_MS
      },

      deleteStudent: async function (userId) {
        await apiCall
          .delete (ApiUrl.Student_Delete + userId)
        
        alert("Student " + userId + " was deleted!")

        location.reload()
      },

      updateStudent: async function (userId) {
        this.updateInfo.updatedStudent = await this.getStudentById(userId)

        await this.getClasses()

        this.updateInfo.classOptions = CommonService.ConvertToClassOptions(this.classes)
        
        this.students.isGetStudentsShowed = false
        this.updateInfo.isUpdateStudentShowed = true

        if (this.currentUser.userRole.includes(Role.Admin)) {
          this.title = Title.Student_US
        } else if (this.currentUser.userRole.includes(Role.Student)) {
          this.title = Title.Student_UI
        }
    
      },

      cancelUpdateStudent: function () {
        this.updateInfo.isUpdateStudentShowed = false
        this.students.isGetStudentsShowed = true
        
        this.handleLoadPage(this.currentUser)
      },

      getClasses: async function () {
        await apiCall
          .get(ApiUrl.Class_Get)
          .then(response => (this.classes = JSON.parse(JSON.stringify(response.data))))
      },

      handleLoadPage: async function (currentUser) {

        if (currentUser.userRole.includes(Role.Admin)) {
          this.getStudents()
          this.title = Title.Student_MS
        } else if (currentUser.userRole.includes(Role.Student)) {
          let student = await this.getStudentByIdentity(currentUser.identityId)
          this.students.studentList = []
          this.students.studentList.push(student)
          this.title = Title.Student_PI
        }
        
      }

    },

    mounted () {
      CommonService.GetCurrentUserInfo(this.currentUser)
      this.handleLoadPage(this.currentUser)
    }
  }
</script>