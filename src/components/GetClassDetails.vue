<template>
  <div v-if="isDetailsShowed">
    <b-table striped hover v-bind:fields="fields" v-bind:items="students">
      <template #cell(birthdate)="data">
        {{new Date(data.item.birthdate).getFullYear()}} -
        {{new Date(data.item.birthdate).getMonth() + 1}} -
        {{new Date(data.item.birthdate).getDate()}} 
      </template>
    </b-table>

    <div class="d-flex justify-content-end">
      <b-button v-on:click="$emit('closedetails')">Close</b-button>
    </div>
    
  </div>
</template>

<script>

  export default {
    name: "GetClassDetails",

    data() {
    return {
      fields: [

        'userId',
        'userName',
        'classId',
        'email',
        'phone',
        'address',
        'birthdate'

      ]
    }
  },

    props: {
      msg: String,
      isDetailsShowed: Boolean,
      students: Array
    }
  }
</script>