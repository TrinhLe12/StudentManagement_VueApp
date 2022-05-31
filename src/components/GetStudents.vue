<template>
  <div v-if="isGetStudentsShowed">
    <b-table label-sort-asc="" label-sort-desc="" label-sort-clear="" sticky-header="500px" striped hover v-bind:fields="this.currentUser.userRole.includes(roles.Admin)? adminFields : studentFields" v-bind:items="studentList">

      <template #cell(birthdate)="data">
        {{new Date(data.item.birthdate).getFullYear()}} -
        {{new Date(data.item.birthdate).getMonth() + 1}} -
        {{new Date(data.item.birthdate).getDate()}} 
      </template>

      <template #cell(edit)="data">
        <b-button v-on:click="$emit('updatestudent', data.item.userId)" variant="outline-success">Edit</b-button>
      </template>

      <template #cell(remove)="data">
        <b-button v-on:click="$emit('deletestudent', data.item.userId)" variant="outline-danger">Remove</b-button>
      </template>

    </b-table>
  </div>
</template>

<script>

import { Role } from "@/utility/role"

export default {
  name: 'GetStudents',
  
  data() {
    return {
      adminFields: [

        {label: 'User Id', key: 'userId', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'User Name', key: 'userName', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Class Id', key: 'classId', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Email', key: 'email', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Phone', key: 'phone', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Address', key: 'address', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Birthdate', key: 'birthdate', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        'edit',
        'remove'

      ],

      studentFields: [

        {label: 'User Id', key: 'userId', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'User Name', key: 'userName', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Class Id', key: 'classId', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Email', key: 'email', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Phone', key: 'phone', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Address', key: 'address', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Birthdate', key: 'birthdate', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        'edit'

      ],

      roles: Role,
      currentUser: {
        userRole: []
      }
    }
  },
  
  props: {
    isGetStudentsShowed: Boolean,
    studentList: Array
  },

  mounted () {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    this.currentUser.userRole = user.userRole
  }

}
</script>