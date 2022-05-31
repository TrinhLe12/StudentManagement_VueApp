<template>
  <div v-if="isGetSubjectRegistersShowed">

    <b-table label-sort-asc="" label-sort-desc="" label-sort-clear="" sticky-header="500px" striped hover v-bind:fields="(this.currentUser.userRole.includes(this.roles.Admin)) ? AdminFields : StudentFields" v-bind:items="subjectRegisterList">

      <template #cell(edit)="data" v-if="this.currentUser.userRole.includes(this.roles.Admin)">
        <b-button variant="outline-success" v-on:click="$emit('updatesubjectregister', {studentId: data.item.studentId, subjectId: data.item.subjectId, semesterId: data.item.semesterId, year: data.item.year})">Edit</b-button>
      </template>

      <template #cell(remove)="data">
        <b-button variant="outline-danger" v-on:click="$emit('deletesubjectregister', {studentId: data.item.studentId, subjectId: data.item.subjectId, semesterId: data.item.semesterId, year: data.item.year})">Remove</b-button>
      </template>

    </b-table>
  </div>
</template>

<script>

import { Role } from "@/utility/role"
import { CommonService } from "@/services/common_service"

export default {
  name: 'GetSubjectRegisters',
  
  data() {
    return {
      AdminFields: [

        {label: 'Student Id', key: 'studentId', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Student Name', key: 'userName', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Subject Id', key: 'subjectId', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Subject Name', key: 'subjectName', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Semester Id', key: 'semesterId', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Semester Name', key: 'semesterName', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Year', key: 'year', thClass: "align-middle", sortable: true},
        {label: 'Score 1', key: 'score1', thClass: "align-middle", sortable: true},
        {label: 'Score 2', key: 'score2', thClass: "align-middle", sortable: true},
        {label: 'Edit', key: 'edit', thClass: "align-middle"},
        {label: 'Remove', key: 'remove', thClass: "align-middle"}
    
      ],

      StudentFields: [

        {label: 'Student Id', key: 'studentId', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Student Name', key: 'userName', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Subject Id', key: 'subjectId', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Subject Name', key: 'subjectName', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Semester Id', key: 'semesterId', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Semester Name', key: 'semesterName', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Year', key: 'year', thClass: "align-middle", sortable: true},
        {label: 'Score 1', key: 'score1', thClass: "align-middle", sortable: true},
        {label: 'Score 2', key: 'score2', thClass: "align-middle", sortable: true},
        {label: 'Remove', key: 'remove', thClass: "align-middle"}

      ],

      currentUser: {
        identityId: "",
        userRole: []
      },
      
      roles: Role
    }
  },
  
  props: {
    isGetSubjectRegistersShowed: Boolean,
    subjectRegisterList: Array
  },

  mounted () {
    CommonService.GetCurrentUserInfo(this.currentUser)
  }

}
</script>