<template>
  <div>
    <b-form>

      <div class="d-flex justify-content-end">
          
        <div>
          <b-form-select class="form__select form-control" id="searchBy" v-model.trim="$v.formSearch.searchBy.$model" :options="Options"></b-form-select>
        </div>

        <div>
          <b-form-input id="keyword" class="form-control" v-model.trim="$v.formSearch.keyword.$model" placeholder="keyword"/>
        </div>

        <div>
          <b-button variant="outline-primary" v-on:click="handleSearch">Search</b-button>
        </div>

      </div>

      <div class="d-flex justify-content-end">
        <div class="error-mess-area">
          <div v-if="$v.formSearch.searchBy.$dirty || $v.formSearch.keyword.$dirty">
            <div class="error text-danger" 
              v-if="!$v.formSearch.searchBy.required || !$v.formSearch.keyword.required">
                Search By and Keyword are required
            </div>
          </div>
        </div>
      </div>
      
    </b-form>
  </div>
</template>

<script>

import { required } from 'vuelidate/lib/validators'

export default {
  name: 'GetSubjectRegisters',
  
  data() {
    return {
      formSearch: {
        keyword: '',
        searchBy:''
      },
      Options: [
        {value: '', text: 'Search By'},
        {value: 'Subject', text: 'Subject'},
        {value: 'Semester', text: 'Semester'},
        {value: 'Year', text: 'Year'}
      ]
    }
  },

  validations: {
    formSearch: {
      searchBy: {
        required
      },
      keyword: {
        required
      }
    }     
  },

  methods: {
    handleSearch () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.$emit('searchsubjectregister', this.formSearch)              
      }  
    }
  },
  
  props: {
  }

}
</script>