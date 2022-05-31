<template>
  <div class="container">
    <div class="d-flex flex-column mb-3">
      <div class="d-flex justify-content-start align-items-center">
        <h1>{{ title }}</h1>
      </div>
      <div class="d-flex justify-content-end align-items-center">
        <b-button v-on:click="addClass" v-if="this.classes.isGetClassesShowed">Add Class</b-button>
      </div>
    </div>
    <GetClasses v-bind="classes" v-on:getdetails="getDetails" v-on:deleteclass="deleteClass" v-on:updateclass="updateClass"/>
    <GetClassDetails v-bind="details" v-on:closedetails="closeDetails"/>
    <AddClass v-bind="addClassInfo" v-on:canceladdclass="cancelAddClass"/>
    <UpdateClass v-bind="updateInfo" v-on:cancelupdateclass="cancelUpdateClass"/>
  </div>
</template>

<script>
import GetClasses from "@/components/GetClasses.vue"
import GetClassDetails from "@/components/GetClassDetails.vue"
import AddClass from "@/components/AddClass.vue"
import UpdateClass from "@/components/UpdateClass.vue"

import { Title } from"@/utility/title"
import { ApiUrl } from "@/utility/api_url"
import { CommonService } from "@/services/common_service"

import apiCall from "@/services/api_service"

export default {
  name: 'ManageClassView',

  data () {
    return {

      classes: {
        isGetClassesShowed: true,
        classList: []
      },

      addClassInfo: {
        isAddClassShowed: false,
        departmentOptions: []
      },
      
      details: {
        isDetailsShowed: false,
        students: []
      },

      updateInfo: {
        isUpdateClassShowed: false,
        updatedClass: {},
        departmentOptions: []
      },

      departments: [],
      title: ''
      
    }
  }, 

  components: {
      GetClasses,
      GetClassDetails,
      AddClass,
      UpdateClass
  },

  methods: {

    getClasses: function () {
      apiCall
        .get(ApiUrl.Class_Get)
        .then(response => (this.classes.classList = JSON.parse(JSON.stringify(response.data))))
      
    },

    getDetails: function (classId) {

      apiCall
        .get(ApiUrl.Student_GetByClass + classId)
        .then(response => (this.details.students = JSON.parse(JSON.stringify(response.data))))

      this.details.isDetailsShowed = true
      this.classes.isGetClassesShowed = false
      this.title = Title.Class_DC
    },

    closeDetails: function () {
      this.details.isDetailsShowed = false
      this.classes.isGetClassesShowed = true
      this.title = Title.Class_MC
    },

    addClass: async function () {
      this.addClassInfo.isAddClassShowed = true
      this.classes.isGetClassesShowed = false
      this.title = Title.Class_AC

      await this.getDepartments()

      this.addClassInfo.departmentOptions = CommonService.ConvertToDeptOptions(this.departments)
    },

    cancelAddClass: function () {
      this.addClassInfo.isAddClassShowed = false
      this.classes.isGetClassesShowed = true
      this.getClasses()
      this.title = Title.Class_MC
    },

    deleteClass: function (classId) {
      apiCall
        .delete (ApiUrl.Class_Delete + classId)
      
      alert("Class " + classId + " was deleted!")

      location.reload()
    },

    updateClass: async function (classId) {
      apiCall
        .get(ApiUrl.Class_GetById + classId)
        .then(response => (this.updateInfo.updatedClass = JSON.parse(JSON.stringify(response.data))))

      await this.getDepartments()

      this.updateInfo.departmentOptions = CommonService.ConvertToDeptOptions(this.departments)
      
      this.classes.isGetClassesShowed = false
      this.updateInfo.isUpdateClassShowed = true
      this.title = Title.Class_UC
    },

    cancelUpdateClass: function () {
      this.updateInfo.isUpdateClassShowed = false
      this.classes.isGetClassesShowed = true
      this.getClasses()
      this.title = Title.Class_MC
    },

    getDepartments: async function () {
      await apiCall
        .get(ApiUrl.Department_Get)
        .then(response => (this.departments = JSON.parse(JSON.stringify(response.data))))
    }

  },

  mounted () {
    this.getClasses(),
    this.title = Title.Class_MC
  }
}
</script>