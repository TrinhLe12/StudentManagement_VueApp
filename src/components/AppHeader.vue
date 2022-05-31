<template>
    <header>
        <div>
            <b-navbar toggleable="lg" type="light" variant="white" class="border">
                
                <b-navbar-brand href="/">
                    <img alt="Vue logo" src="@/assets/images/logo.png" height="50px">
                </b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav> 

                    <b-navbar-nav>
                        <b-nav-item href="/">Student Management</b-nav-item>
                    </b-navbar-nav>
                    
                    <b-navbar-nav class="ms-auto">
                        <div class="d-flex">
                            <b-nav-item href="/" right>Home</b-nav-item>

                            <b-nav-item-dropdown text="Menu" v-on:show="checkLogin" right>
                                <b-dropdown-item router to="/manage_classes" v-if="this.userRole.includes(this.roles.Admin)">Manage Classes</b-dropdown-item>
                                <b-dropdown-item router to="/manage_students" v-if="this.userRole.includes(this.roles.Admin)">Manage Students</b-dropdown-item>
                                <b-dropdown-item router to="/manage_subject_registers" v-if="this.userRole.length > 0">Manage Subject Registers</b-dropdown-item>
                                <b-dropdown-item router to="/update_info" v-if="this.userRole.includes(this.roles.Student)">Update Info</b-dropdown-item>
                            </b-nav-item-dropdown>

                            <b-nav-item-dropdown text="User" right v-on:show="checkLogin">
                                <b-dropdown-item v-on:click="logout" v-if="this.userRole.length > 0">Logout</b-dropdown-item>
                            </b-nav-item-dropdown>
                        </div>
                    </b-navbar-nav>
            
                </b-collapse>

            </b-navbar>
        </div>
    </header>
</template>

<script>

import { Role } from "@/utility/role"

export default {
    name: "AppHeader",

    data () {
        return {
            userRole: [],
            roles: Role
        }
    },

    methods: {
        logout () {
            localStorage.removeItem('currentUser')
            this.$router.push("/login")
        },

        checkLogin () {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'))
            if (currentUser != null && currentUser != undefined) {
                this.userRole = currentUser.userRole
            } else {
                this.userRole = []
            }
            console.log("check")
        }
    }
}
</script>

<style>
    header {
        position: sticky;
        top: 0;
        width: 100%;
    }
</style>