<script>
// import { getEmployees } from '@/api/employee';
import { getEmployees } from '@/api/employee';
import {getProducts} from '@/api/product';
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2';
export default {
    data: () => ({
        alert:false,
        selectedEmployee: null,
        requestDate: null,
        employess: [],
        selectedEmpployeeName: "",
        selectedEmployeeDepartement: "",
        requestDate:null,
        products: [],
        valid:false,
        carts: [{
            product: null,
            unit: null,
            location: null,
            stock: null,
            quantity: 1,
            description: "",
        }],
        rules:{
            required: value => !!value || 'Required.',
        },errors:null
    }),
    props: {
        dialog: {
        type: Boolean,
        required: true,
        default: false
        }
    },
    methods: {
        async postRequestItem() {   
          try {
            const response = await axios.post('http://inventory.test/api/requestitem', {
              "nik":this.selectedEmployee.nik,
              "request_date":this.requestDate,
              "carts":this.carts
            })
            if (response.status === 200) {
                this.$emit('close',false)
                Swal.fire({
                    title: "Saved",
                    text: "Data Berahsil di Simpan",
                    icon: "success"
                });
            }
          } catch (error) {
            this.errors = error.response.data.data
          } 
        },
        async getEmployees() {
            const response = await getEmployees()
            this.employess = response.data.data
        },
        async getProducts() {
            const response = await getProducts()
            this.products = response.data.data
        },
        async addToCart() {
            this.carts.push({
                product: null,
                unit: null,
                location: null,
                stock: null,
                quantity: 1,
                description: "",
            })
        }, async removeCart(index) {
            this.carts.splice(index, 1)
        },
        checkStock(index) {
            if (this.carts[index]?.quantity <= this.carts[index]?.product?.stock) {
                return 'tersedia'
            }
            return 'tidak tersedia'
        },
        isProductInCart(value,index) {
            if(index === undefined){
                return
            }
            const product_id = this.carts[index]?.product?.id

            const exist = this.carts?.some(item => item.product?.id === value.id)
            if (exist) {
                alert("barang sudah ada")
                this.$nextTick(() => {
                    this.carts.splice(index, 1)
                });
            }
        }
    },
    mounted() {
        this.getEmployees()
        this.getProducts()
    },
    watch: {
        selectedEmployee(newValue) {
            this.selectedEmpployeeName = newValue?.name ?? ''
            this.selectedEmployeeDepartement = newValue?.departement?.name ?? ''
        },
        carts(newValue, oldValue) {
            console.log(newValue, oldValue)
        },
        deep: true
    },
    computed: {
        isValid() {
                return this.carts.every(item => item?.product?.stock > item?.quantity);// return false;
        },
            isDialogOpen: {
            get() {
                return this.dialog;
            },
            set (value) {
                this.$emit('close',value)
            }
         },
    },
    emitClose(val = false) {
      this.$emit('input', val);
    }
}
</script>

<template>
    <div class="pa-4 text-center">
        <v-dialog v-model="isDialogOpen" max-width="900">
            <v-card prepend-icon="mdi-account" title="Create Penerimaan Barang">
                <v-form ref="form" v-model="valid" @submit.prevent="postRequestItem" lazy-validation>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="4">
                            <v-autocomplete :items="employess" item-title="nik" label="NIK" v-model="selectedEmployee"
                            :rules="[rules.required]"
                            :error-messages="errors?.nik"
                                return-object auto-select-first></v-autocomplete>
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field label="Nama" type="text" v-model="selectedEmpployeeName" required
                                readonly></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field label="Departement" type="text" v-model="selectedEmployeeDepartement" readonly
                                required></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-date-input label="Date input" v-model="requestDate" :error-messages="errors?.request_date" required></v-date-input>
                        </v-col>
                    </v-row>

                </v-card-text>

                <v-divider></v-divider>

                <v-col cols="12" sm="12">

                    <h5>Data Barang</h5>
                    <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" @click="addToCart"
                        text="Tambah Barang" variant="tonal"></v-btn>
                    <v-table theme="light">
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Nama Barang
                                </th>
                                <th class="text-left">
                                    Lokasi
                                </th>
                                <th class="text-left">
                                    Tersedia
                                </th>
                                <th class="text-left">
                                    Kuantiti
                                </th>
                                <th class="text-left">
                                    Satuan
                                </th>
                                <th class="text-left">
                                    Keterangan
                                </th>
                                <th class="text-left">
                                    Status
                                </th>
                                <th class="text-left">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in carts" :key="item.name">
                                <td> <v-autocomplete @update:model-value="isProductInCart($event,index)" :items="products" item-title="name" label="Barang"
                                        v-model="carts[index].product" return-object auto-select-first
                                        ></v-autocomplete></td>
                                <td>{{ carts[index]?.product?.location }}</td>
                                <td>{{ carts[index]?.product?.stock }}</td>
                                <td><v-text-field v-model="carts[index].quantity"
                                    :error-messages="errors?.[`carts.${index}.quantity`]"
                                        ></v-text-field></td>
                                <td>{{ carts[index]?.product?.unit }}</td>
                                <td><v-text-field></v-text-field></td>
                                <td>
                                    <v-chip v-if="checkStock(index) === 'tersedia'" color="green">Tersedia</v-chip>
                                    <v-chip v-else color="red">Tidak Tersedia</v-chip></td>
                                <td><a @click="removeCart(index)">Hapus</a></td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-col>


                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close" variant="plain" @click="isDialogOpen = false"></v-btn>

                    <v-btn color="primary" text="Save" variant="tonal" type="submit" :disabled="!isValid"></v-btn>
                </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<style>
.swal2-container {
  z-index: 10000;
}
</style>