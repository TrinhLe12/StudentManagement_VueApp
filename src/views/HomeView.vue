<template>
  
  <div>

    <div class="container">
      <img alt="Vue logo" src="@/assets/images/logo.png">
      <p id="title">Student Management</p>
      <b-button pill variant="outline-success" v-on:click="expand">About Us</b-button>
    </div>
    
    <div class="container" id="about" v-if="!this.isCollapsed">

      <div class="row justify-content-end h-100">
        <div class="cover col d-flex flex-column justify-content-center" id="aboutText">
          <div class="row justify-content-center">
            <div class="col-4">
              <img alt="Vue logo" src="@/assets/images/logo.png">
            </div>
          </div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus commodo aliquam tristique. 
            Morbi posuere sit amet orci eu sollicitudin. Nullam aliquam felis magna, in pretium turpis gravida sed. 
            Donec dictum neque vel cursus consectetur. Nulla placerat, dui sed tempus aliquam, erat nisl dapibus ante, 
            egestas tincidunt leo erat nec nunc. Suspendisse sed pulvinar quam. Morbi diam purus, mollis vel consequat vehicula, 
            tincidunt ac sem. Morbi est lorem, vulputate in orci et, congue aliquam ligula.
          </div>
          <div class="row justify-content-center">
            <div class="col-2"> 
              <b-button pill variant="outline-success" v-on:click="collapse">X</b-button>
            </div>
          </div>
        </div>
      </div>
      
    </div>

    <div class="container-fluid border d-flex justify-content-center align-items-center pt-3 pb-3">
      <span class="ms-3 me-3 note">Powered by:</span>
      <span class="ms-3 me-3">
        <img alt="Vue logo" src="@/assets/images/logo.png" class="small-logo">
        <span class="note">&nbsp; VueJS 2.6.2</span>
      </span>
      <span class="ms-3 me-3">
        <img alt="AspNet logo" src="@/assets/images/aspnet_logo.png" class="small-logo">
        <span class="note">&nbsp; Asp.Net API</span>
      </span>
      <span class="ms-3 me-3">
        <img alt="Bootstrap logo" src="@/assets/images/bootstrap_logo.png" class="small-logo">
        <span class="note">&nbsp; Bootstrap-Vue</span>
      </span>
    </div>
    
    <div class="container">
      <div class="row">

        <div class="col-12 mb-3">
          <h5 class="text-success">Features</h5>
        </div>

        <div class="col" v-if="this.userRole.includes(this.roles.Admin)">
          <b-card border-variant="success" header="Manage Classes" align="center" class="col sm-card">
            <font-awesome-icon icon="fa-solid fa-users-between-lines" class="icon"/>
            <b-card-text class="pt-3 pb-3">
              <p class="note">Lorem ipsum dolor sit amet, consectetur adipiscing elit, consectetur adipiscing elit.</p>
              <router-link to="/manage_classes" class="text-dark">
                <b-button variant="outline-success">Explore</b-button>
              </router-link>
            </b-card-text>
          </b-card>            
        </div>

        <div class="col" v-if="this.userRole.includes(this.roles.Admin)">
          <b-card border-variant="success" header="Manage Students" align="center" class="col sm-card">
            <font-awesome-icon icon="fa-solid fa-graduation-cap" class="icon"/>
            <b-card-text class="pt-3 pb-3">
              <p class="note">Lorem ipsum dolor sit amet, consectetur adipiscing elit, consectetur adipiscing elit.</p>
              <router-link to="/manage_students" class="text-dark">
                <b-button variant="outline-success">Explore</b-button>
              </router-link>
            </b-card-text>
          </b-card>            
        </div>
        
        <div class="col">
          <b-card border-variant="success" header="Manage Subject Registers" align="center" class="col sm-card">
            <font-awesome-icon icon="fa-solid fa-table-list" class="icon"/>
            <b-card-text class="pt-3 pb-3">
              <p class="note">Lorem ipsum dolor sit amet, consectetur adipiscing elit, consectetur adipiscing elit.</p>
              <router-link to="/manage_subject_registers" class="text-dark">
                <b-button variant="outline-success">Explore</b-button>
              </router-link>
            </b-card-text>
          </b-card>            
        </div>

        <div class="col" v-if="this.userRole.includes(this.roles.Student)">
          <b-card border-variant="success" header="Update Info" align="center" class="col sm-card">
            <font-awesome-icon icon="fa-solid fa-id-card" class="icon"/>
            <b-card-text class="pt-3 pb-3">
              <p class="note">Lorem ipsum dolor sit amet, consectetur adipiscing elit, consectetur adipiscing elit.</p>
              <router-link to="/update_info" class="text-dark">
                <b-button variant="outline-success">Explore</b-button>
              </router-link>
            </b-card-text>
          </b-card>            
        </div>

      </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import { Role } from "@/utility/role"

export default {
  name: 'HomeView',
  
  components: {
  },
  
  data () {
    return {
      userRole: [],
      roles: Role,
      isCollapsed: true
    }
  },

  methods: {
    collapse () {
      this.isCollapsed = true
    },

    expand () {
      this.isCollapsed = false
    }
  },

  mounted () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.userRole = currentUser.userRole
  }
}
</script>

<style>
  #title {
    font-family: 'Arial Black';
    font-weight: bold;
    font-stretch: ultra-condensed;
    font-size: 60px;
  }
  .icon {
    font-size: 100px;
  }

  .sm-card:hover {
    border-style: dashed;
  }

  #about {
    background-image: url("@/assets/images/cover_image.jpg");
    background-size: cover;
    height: 500px;
  }

  #aboutText {
    font-size: 17px;
  }

  .small-logo {
    height: 30px
  }

  .note {
    color: rgb(185, 181, 181)
  }

</style>
