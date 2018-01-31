/**
 * Created by Dimitris on 4/30/2017.
 */
let cartmplt = `
<row >
     <div class="col-lg-12" v-if="system.user.id === car.user"> 
    <nav class="navbar navbar-light bg-faded mb-3" >
          <form class="form-inline">
               <button class="btn btn-primary mr-3" @click="editCar()"> <i class=" fa fa-edit"> </i> Edit Car </button>
          </form>
    </nav>  
    </div>
    <div class="col-lg-4">
        <div id="details">
        <card>
        <card-head>{{car.brand}}, {{car.model}} | {{car.username}}
        </card-head>
      
        <list-group>    
            <list-item> Price: {{car.price}} <i class="fa fa-euro"></i> </list-item>       
            <list-item> Cubic Meters: {{car.cubemtr}}</list-item>
            <list-item> Year purchased: {{car.year}}</list-item>
        </list-group>
        <card-block> 
            <h4> Notes:</h4>
            {{car.description}}
        </card-block>
        <card-block> 
            <h4> Latest Completed Rentings </h4>
        </card-block>
        </card>
        </div>
       
        <div id="ratings"> 
        </div>
     </div>
    <div class="col-lg-8">
        <div id="gallery"> 
        <h4> Car Photos </h4>
        <hr>
         <card class="d-inline-block  m-1"
                  v-model="car.photos"
                  v-for="img in car.photos"
                  style=" background:#1d1e1f; height: 200px; overflow: hidden; position: relative;"> 
                <img class="card-img-top" style="background:#1d1e1f; width:320px;" :src="img">  
                <div class="card-group">
               </div>
        
             </card>
        </div>
        <div id="availability"> 
        <h4> Availability for this day</h4>
         <hr>
        <list-group> 
          <list-item v-for="time in car.schedule" class="list-group-item-action " :class="{'list-group-item-success':time.isRented != 1,'list-group-item-danger':time.isRented ==1}"> 
        <label :for="'check'+time.ID"> 
         <h5>  {{ formatTime(time.Time,false) }} - {{formatTime(time.Time, true) }}</h5>
        </label>
        <template v-if="time.isRented != 1 && system.user.type !== 'owner'"> 
          <input type="checkbox" :value="time.Time" :id="'check'+time.ID" class="custom-checkbox" v-model="timesChecked"> 
        </template>
        </list-item>
        </list-group>
        </div>
        <br>
        <template v-if="system.user.type !== 'owner'"> 
           <form-group> 
              <h4> Add renting notes: </h4>
              <hr>
             <textarea class="form-control" v-model="other" placeholder="add some note to your order"> </textarea>
             <br>
             <template v-if="timesChecked.length !== 0"> 
                <button @click="rentCar" class="btn btn-success"> Send renting application </button>
             </template>
             <list-group> 
                <list-item class="label label-danger" v-for="error in car.msg.error"> <i class="fa fa-warning">{{error.msg}}</i> </list-item>
             </list-group>
               <list-group> 
                <list-item class="label label-success" v-for="success in car.msg.success"> <i class="fa fa-check-circle">{{success.msg}}</i> </list-item>
             </list-group>
           </form-group>
        </template>
    </div>
</row>`;

const CarProfile = {
    template: cartmplt,
    data: () => {
        return {
            system:system,
            other:'',
            timesChecked:[],
            shouldProcceed:false,
            car :  new Car(app.$route.params.id),
        }
    },
    computed:{

    },
    created: function () {
        this.car.getSchedule();
        this.car.getPhotos();
    },

    methods: {
        editCar:function () {
          showPage('editCar',this.car.id);
        },
        formatTime:function(time,add){
            let value = null;
            if(add){
                value = moment( moment(time,'HH:mm:ss').add(1,'hours'),'HH:mm:ss').format('HH:mm');

            }else{
                value = moment(time,'HH:mm:ss').format('HH:mm');
            }
            return value;
        },
        rentCar(){
            this.car.rent(this.timesChecked,this.system.user.id,this.other,this.car.user)
        },

        checkIfProcceed(){
            this.shouldProcceed= !this.timesChecked.length === 0
        }
    }
};




caredittmpl=`
<row>
    <div class="col-lg-12"> 
        <h2> Edit {{car.brand}} {{car.model}} </h2>
    </div> 
    <div class="col-lg-12">
    <hr>
    <row>
     <div class="col-lg-3"> 
        <h4> Add Car Photos</h4>
        <form-upload :initialID="car.id"> </form-upload>
     </div>
     <div class="col-lg-9"> 
       <h4> Add More Times</h4>
        <card-block> 
      
          <div v-for="time in car.notOnSchedule" class="p-1 m-1 bg-faded d-inline-block"> 
        <label :for="'check'+time"> 
         <h5>  {{ formatTime(time,false) }} - {{formatTime(time, true) }}</h5>
        </label>
          <input type="checkbox" :value="time" :id="'check'+time" class="custom-checkbox" v-model="timesChecked"> 
        </div>
        </hr>
           <button class="btn btn-success" @click="addSchedule()"> Submit </button>
           
        </card-block>
     </div>
    
    </row>
    </div>
    
</row>

`;
const CarEdirProfile = {
    template: caredittmpl,
    data: () => {
        return {
            system:system,
            car :  new Car(app.$route.params.id),
            timesChecked:[]
        }
    },
    computed:{

    },
    created: function () {
        this.car.getSchedule();
    },

    methods: {
        addSchedule:function(){
          this.car.addScedule(this.timesChecked);
        },
        formatTime:function(time,add){
            let value = null;
            if(add){
                value = moment( moment(time,'HH:mm:ss').add(1,'hours'),'HH:mm:ss').format('HH:mm');

            }else{
                value = moment(time,'HH:mm:ss').format('HH:mm');
            }
            return value;
        },
    }
};
