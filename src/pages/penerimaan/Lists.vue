<script>
import axios from 'axios'
import AppBar from '@/components/AppBar.vue'
export default {
    data () {
      return {
        headers: [
          { title: 'Id', align: 'start', key: 'id' },
          { title: 'No Permintaan', align: 'end', key: 'request_no' },
          { title: 'NIK', align: 'end', key: 'nik' },
          { title: 'Name', align: 'end', key: 'employee.name' },
        ],
        items:[],
        search:"",
      } 
    },
    methods: {
      async getRequestItems() {
        const response = await axios.get('http://inventory.test/api/requestitems')
        this.items = response.data.data
      }
    },  
    mounted() {
      this.getRequestItems()
    },  
  }
</script>

<template>
  <app-bar></app-bar>
  <div class="pa-4 text-center">
  <v-card>
  <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      height="400"
      item-value="name"
    ></v-data-table>
    </v-card>
  </div>
  </template>