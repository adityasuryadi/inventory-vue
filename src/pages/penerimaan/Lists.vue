<script>
import {getRequestItems} from '@/api/requestItem.js'
import AppBar from '@/components/AppBar.vue'
import Create from '@/pages/penerimaan/Create.vue'
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
        isDialogOpen:false
      } 
    },
    methods: {
      async getRequestItems() {
        const response = await getRequestItems()
        this.items = response.data.data
      },
      closeDialog(){
        this.getRequestItems()
        this.isDialogOpen = false
      }
    },  
    mounted() {
      this.getRequestItems()
    },
    components: {
      FormCreate:Create
    }  
  }
</script>

<template>
  <app-bar></app-bar>
  <div class="pa-4">
    <form-create :dialog="isDialogOpen" @close="closeDialog"></form-create>
    <v-btn class="text-none font-weight-regular" prepend-icon="mdi-plus" text="Tambah Barang"
  variant="tonal" @click="isDialogOpen = true"></v-btn>
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