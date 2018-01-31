/**
 * Created by Dimitris on 4/30/2017.
 */
// v-if="system.isLoggedIn && system.user.type === 'owner'"
newCar = `
    <div class="container">
         <template v-if="!system.user_logged_in">
            <div class="alert alert-warning"> 
                <h2> you are not logged in</h2>
            </div>
        </template>
        <form-group v-if="system.user_logged_in"> 
            <label class="form-control-label" for="#brand"> Βrand: </label>
            <input  @keyup="checkIfComplete" v-model="car.brand" class ="form-control"id = "brand" type="text">
            <label  class="form-control-label" for="#model"> Model </label>
            <input @keyup="checkIfComplete"  v-model="car.model" class ="form-control"id = "model" type="text"> 
            <label class="form-control-label" for="#year"> Year </label>
            <input  @keyup="checkIfComplete"  v-model="car.year" class ="form-control"id = "year" type="date"> 
            <label class="form-control-label" for="#price"> Price </label>
            <input @keyup="checkIfComplete"  v-model="car.price"  class ="form-control" id = "price" type="number"> 
            <label class="form-control-label" for="#cubemtr"> Cubic Meters </label>
            <input  @keyup="checkIfComplete" v-model="car.cubemtr"  class ="form-control"id = "cubemtr" type="number">
            <label class="form-control-label" for="#location"> Location </label>
            <gmap-autocomplete @keyup="checkIfComplete" id="location" :value="description" class="form-control"
                 @place_changed="setPlace">
            </gmap-autocomplete>
            <label class="form-control-label" for="#description"> Description</label>
            <input @keyup="checkIfComplete"  v-model="car.description" id="#description" class="form-control" type="textarea">         
         </form-group> 
         <button class="btn btn-lg btn-success" @click="addCar" :disabled="disableSubmit"> Add Car </button>
    </div>
`;
const NewCar = {
    template: newCar,
    data: () => {
        return {
            system : system,
            car: {
                brand:null,
                model:null,
                year:null,
                price:null,
                location:null,
                description:null,
                cubemtr:null,
            },
            disableSubmit:true,
        }
    },
    beforeCreate: function () {

    },
    methods: {
        checkIfComplete(){
            let condition = (
                this.car.brand && this.car.model && this.car.price
                && this.car.location && this.car.cubemtr
            );
            if(condition){
                this.disableSubmit = false;
            }else if(!condition){
                this.disableSubmit = true;
            }
        },
        addCar(){
            this.system.user.addCar(this.car);
        },
        setPlace(place){
            this.car.location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            }
        }
    }
};
