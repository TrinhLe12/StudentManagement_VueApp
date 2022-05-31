<template>
  <div class="container">

    <SearchSubjectRegister 
      v-on:searchsubjectregister="searchSubjectRegister" 
      v-if="this.subjectRegisters.isGetSubjectRegistersShowed"/>

    <div class="d-flex flex-column mb-3">
      <div class="d-flex justify-content-start align-items-center">
        <h1>{{ title }}</h1>
      </div>
      <div class="d-flex justify-content-end align-items-center">
        <b-button 
          v-on:click="addSubjectRegister" 
          v-if="this.subjectRegisters.isGetSubjectRegistersShowed">
            Add Subject Register
        </b-button>    
      </div>
    </div>
    
    <GetSubjectRegisters 
      v-bind="subjectRegisters" 
      v-on:deletesubjectregister="deleteSubjectRegister" 
      v-on:updatesubjectregister="updateSubjectRegister"/>
    
    <AddSubjectRegister 
      v-bind="addSubjectRegisterInfo" 
      v-on:canceladdsubjectregister="cancelAddSubjectRegister"/>
    
    <UpdateSubjectRegister  
      v-bind="updateInfo" 
      v-on:cancelupdatesubjectregister="cancelUpdateSubjectRegister"/>
  </div>
</template>

<script>
import GetSubjectRegisters from "@/components/GetSubjectRegisters.vue"
import AddSubjectRegister from "@/components/AddSubjectRegister.vue"
import UpdateSubjectRegister from "@/components/UpdateSubjectRegister.vue"
import SearchSubjectRegister from "@/components/SearchSubjectRegisters.vue"

import { Role } from "@/utility/role"
import { Title } from "@/utility/title"
import { ApiUrl } from "@/utility/api_url"
import { CommonService } from "@/services/common_service"

import apiCall from "@/services/api_service"

export default {
  name: 'ManageSubjectRegisterView',

  data () {
    return {

      subjectRegisters: {
        isGetSubjectRegistersShowed: true,
        subjectRegisterList: []
      },

      addSubjectRegisterInfo: {
        isAddSubjectRegisterShowed: false,
        studentOptions: [],
        subjectOptions: [],
        semesterOptions: [],
        yearOptions: []
      },

      updateInfo: {
        isUpdateSubjectRegisterShowed: false,
        updatedSubjectRegister: {}
      },

      students: [],
      subjects: [],
      semesters: [],

      currentUser: {
        identityId: "",
        userRole: []
      },

      title: ''
      
      
    }
  }, 

  components: {
      GetSubjectRegisters,
      AddSubjectRegister,
      UpdateSubjectRegister,
      SearchSubjectRegister
  },

  methods: {

    getSubjectRegisters: function () {
      if (this.currentUser.userRole.includes(Role.Admin)) {
        apiCall
          .get(ApiUrl.SubRegis_Get)
          .then(response => (this.subjectRegisters.subjectRegisterList = JSON.parse(JSON.stringify(response.data))))
      } else if (this.currentUser.userRole.includes(Role.Student)) {
        apiCall
          .get(ApiUrl.SubRegis_GetByStudent + this.currentUser.identityId)
          .then(response => (this.subjectRegisters.subjectRegisterList = JSON.parse(JSON.stringify(response.data))))
      }
      
    },

    addSubjectRegister: async function () {
      this.addSubjectRegisterInfo.isAddSubjectRegisterShowed = true
      this.subjectRegisters.isGetSubjectRegistersShowed = false

      await this.getStudents()
      this.addSubjectRegisterInfo.studentOptions = CommonService.ConvertToStudentOptions(this.students)

      await this.getSubjects()
      this.addSubjectRegisterInfo.subjectOptions = CommonService.ConvertToSubjectOptions(this.subjects)

      await this.getSemesters()
      this.addSubjectRegisterInfo.semesterOptions = CommonService.ConvertToSemesterOptions(this.semesters)

      this.addSubjectRegisterInfo.yearOptions = CommonService.GetYearOptions()
      this.title = Title.SubRegis_ASR
    },

    cancelAddSubjectRegister: function () {
      this.addSubjectRegisterInfo.isAddSubjectRegisterShowed = false
      this.subjectRegisters.isGetSubjectRegistersShowed = true
      this.getSubjectRegisters()
      this.title = Title.SubRegis_MSR
    },

    deleteSubjectRegister: function ({studentId, subjectId, semesterId, year}) {
      apiCall
        .delete (ApiUrl.SubRegis_Delete + studentId + "&&" + subjectId + "&&" + semesterId + "&&" + year)
      
      alert("Subject Register was deleted!")

      location.reload()
    },

    updateSubjectRegister: async function ({studentId, subjectId, semesterId, year}) {
      apiCall
        .get(ApiUrl.SubRegis_GetById + studentId + "&&" + subjectId + "&&" + semesterId + "&&" + year)
        .then(response => (this.updateInfo.updatedSubjectRegister = JSON.parse(JSON.stringify(response.data))))
      
      this.subjectRegisters.isGetSubjectRegistersShowed = false
      this.updateInfo.isUpdateSubjectRegisterShowed = true
      this.title = Title.SubRegis_USR
    },

    cancelUpdateSubjectRegister: function () {
      this.updateInfo.isUpdateSubjectRegisterShowed = false
      this.subjectRegisters.isGetSubjectRegistersShowed = true
      this.getSubjectRegisters()
      this.title = Title.SubRegis_MSR
    },

    getStudents: async function () {
      await apiCall
        .get(ApiUrl.Student_Get)
        .then(response => (this.students = JSON.parse(JSON.stringify(response.data))))
    },

    getSubjects: async function () {
      await apiCall
        .get(ApiUrl.Subject_Get)
        .then(response => (this.subjects = JSON.parse(JSON.stringify(response.data))))
    },

    getSemesters: async function () {
      await apiCall
        .get(ApiUrl.Semester_Get)
        .then(response => (this.semesters = JSON.parse(JSON.stringify(response.data))))
    },

    searchSubjectRegister: async function (formSearch) {
      if (this.currentUser.userRole.includes(Role.Admin)) {
        await apiCall
          .get(ApiUrl.SubRegis_Search + formSearch.searchBy + "&&" + formSearch.keyword)
          .then(response => (this.subjectRegisters.subjectRegisterList = JSON.parse(JSON.stringify(response.data))))
      } else if (this.currentUser.userRole.includes(Role.Student)) {
        await apiCall
          .get(ApiUrl.SubRegis_SearchByStudent + formSearch.searchBy + "&&" + formSearch.keyword + "&&" + this.currentUser.identityId)
          .then(response => (this.subjectRegisters.subjectRegisterList = JSON.parse(JSON.stringify(response.data))))
      }
      
    },

  },

  mounted () {
    CommonService.GetCurrentUserInfo(this.currentUser)
    this.getSubjectRegisters()
    this.title = Title.SubRegis_MSR
  }
}
</script>