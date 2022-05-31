<template>
  <div v-if="isGetClassesShowed">
    
    <b-table label-sort-asc="" label-sort-desc="" label-sort-clear="" sticky-header="500px" striped hover v-bind:fields="fields" v-bind:items="classList">

      <template #cell(edit)="data">
        <b-button v-on:click="$emit('updateclass', data.item.classId)" variant="outline-success">Edit</b-button>
      </template>

      <template #cell(details) = "data">
        <b-button v-on:click="$emit('getdetails', data.item.classId)" variant="outline-primary">Details</b-button>
      </template>

      <template #cell(remove)="data">
        <b-button v-on:click="$emit('deleteclass', data.item.classId)" variant="outline-danger">Remove</b-button>
      </template>

    </b-table>
  </div>
</template>

<script>

export default {
  name: 'GetClasses',
  
  data() {
    return {
      fields: [

        {label: 'Class Id', key: 'classId', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Class Name', key: 'className', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        {label: 'Dept Id', key: 'deptId', tdClass: 'text-start', thClass: "align-middle", sortable: true},
        'edit',
        'details',
        'remove'

      ]
    }
  },
  
  props: {
    isGetClassesShowed: Boolean,
    classList: Array
  }

}
</script>