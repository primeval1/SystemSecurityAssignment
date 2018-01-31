/**
 * @file Το component για το /Home
 */

/**
 * @desc δυναμικό html template
 * @type {string}
 */
const tmpl = `
    <div v-if="system.user_logged_in">
    <jumbotron-full>
        <label for="location"> Εnter Desired Location </label>
       <gmap-autocomplete  id="location"  class="form-control"
                 @place_changed="setPlace">
       </gmap-autocomplete>
       <label for="hours"> Check Hours </label>
        <card-block id="hours"> 
          <div v-for="time in times" class="p-1 m-1 bg-faded d-inline-block"> 
        <label :for="'check'+time"> 
         <h5>  {{ formatTime(time,false) }} - {{formatTime(time, true) }}</h5>
        </label>
          <input type="checkbox" :value="time" :id="'check'+time" class="custom-checkbox" v-model="search.times"> 
        </div>
        </hr>
        </card-block>
        <button class="btn btn-success" @click="doSearch"> Search</button>
       
    </jumbotron-full> 
    <div class="container-fluid"> 
    <row> 
        <div class="col-lg-8"> 
            <gmap-map :center="location(search.lat,search.lng)" :zoom="7" ref="mmm" style="width: 100%; height: 400px">
                  <gmap-marker :key="index" v-for="(item, index) in search.results" :position="location(item.car.lat,item.car.lng)" :clickable="true" :draggable="false" ></gmap-marker>
             </gmap-map>
        </div>
        <div class="col-lg-4"> 
        <h3> Results </h3>
      <list-group> 
        <list-item  class="list-group-item-action" v-for="item in search.results "> 
           <div class="col-lg-4" @click="item.car.goToProfile()"> {{item.car.model}} {{item.car.brand}}</div>
           <div class="col-lg-8"> {{item.dist}} km </div>
        </list-item>
      </list-group>
        </div>
    </row>
        
    </div>
    </div>
</card-block>

`;
const Home = {
    template: tmpl,
    data: () => {
        return {
            system:system,
            search:new Search(),
            times:[]
        }
    },
    created: function () {
        let params = getParams(
            {
                type:'users',
                userType : 'owner',
                limit:10
            });

        for(let i = 0; i<=23;i++){
            let time = pad(i)+':00:00';
            this.times.push(time);
        }

        fetch(url+params )
            .then(data=>data.json())
            .then(data=>{
                data.map(item=>{
                    this.users.push(new Owner(item.ID));
                });
            });
    },

    methods: {

        setPlace(place){
            this.search.lat= place.geometry.location.lat();
            this.search.lng=place.geometry.location.lng();
        },
        doSearch:function(){
            this.search.perform()
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
        location:function (lat,lng) {
            return  new google.maps.LatLng( lat , lng)
        }
    }
};
