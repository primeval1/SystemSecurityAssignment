/**
 * Created by Dimitris on 4/30/2017.
 */
const profile = `
<row v-if="owner">
    <div class="col-lg-12" v-if="system.user.id === owner.id"> 
    <nav class="navbar navbar-light bg-faded mb-3" >
          <form class="form-inline">
              <button @click="showAddCar" class="btn btn-success mr-3"> <i class="fa fa-plus"></i> Car</button>
               <button class="btn btn-primary mr-3"> <i class=" fa fa-edit"> </i> Edit Details </button>
          </form>
    </nav>
    </div>
    <div class="col-lg-4" v-if="owner">
        <card>  
            <card-head>  
                {{owner.fullname}} @{{owner.username}}
            </card-head>
            <card-block> 
                <list-group> 
                    <list-item> age:{{owner.age}} </list-item>
                    <list-item> phone:{{owner.phone}}</list-item>
                    <list-item> address:{{owner.address}}</list-item>
                </list-group>
            <h4> Notes:</h4>
            {{owner.description}}
            </card-block>
        </card>       
        <card-block> 
                 <h4> Ratings </h4>   
                 <list-group> 
                 <list-item v-for=" rating in owner.ratings">
                    <h5 class="list-group-item-heading"> <i v-for="star in stars(rating.Rating1)" class="fa fa-star"></i></h5>
                    <hr>
                    <p class="list-group-item-text"> 
                      {{rating.Comment}}
                    </p>
                 </list-item>
                 </list-group>
        </card-block>
        
   
    </div>  
    <div class="col-lg-8"> 
     <h2>Available Cars: </h2>
        <list-group> 
            <list-item  v-for="(car,i) in cars" class="row list-group-item-action ">
                <div class="col-lg-10 col-md-9"  @click="show('car',car.id)"> 
                    <span class="mr-2">{{i+1}}</span>
                    <span class="text-primary mr-3">{{car.brand}} {{car.model}}</span>
                    <span>  year: {{car.year}}</span>
                </div>
                <div class="col-lg-2 col-md-3" > 
                    <strong> {{car.price}} </strong>  <i class="fa fa-euro"> per hour</i>
                </div>
            </list-item>
        </list-group>
    </div>
</row>
`;

const Profile = {
    template:profile,
    data: () => {
        return {
            system : system,
            owner:  new Owner(app.$route.params.id),
            cars: [],
        }
    },
    created: function () {
       this.owner.getCars().then(cars =>{
               cars.map((item)=>{
               let car = new Car(item.ID);
                   this.cars.push(car);
               });
           });
       this.owner.getRatings();
    },

    methods: {
        stars(i){
            let stars = [];
            for(j=0;j<i;j++){
                stars.push("fa-star")
            }
            return stars
        },
        show:showPage,
        showAddCar:()=>{
           router.push({ name: 'addcar'});
        }
    }

};

const profile2 = `
<div> 

<row v-if="renter">
    <div class="col-lg-12 mb-3" v-if="system.user.id === renter.id"> 
      <nav class="navbar navbar-light bg-faded">
          <form class="form-inline">
              <button class="btn btn-success mr-3" @click="goToSearch()"> <i class="fa fa-search"></i> Search Cars </button>
          </form>
     </nav>
    </div>
    <div class="col-lg-3" v-if="renter">
        <card>  
            <card-head>  
                {{renter.fullname}} @{{renter.username}}
            </card-head>
            <card-block> 
                <list-group> 
                    <list-item> age:{{renter.age}} </list-item>
                    <list-item> phone:{{renter.phone}}</list-item>
                    <list-item> address:{{renter.address}}</list-item>
                    <list-item> Driver since :{{renter.experience}}</list-item>
                </list-group>
            </card-block>
        </card>
       
        <card-block> 
            <h4> Notes:</h4>
            {{renter.description}}
        </card-block>
    </div>  
    <div class="col-lg-9"> 
           <card-block> 
                 <h3> Ratings </h3>   
                 <list-group> 
                 <list-item v-for=" rating in renter.ratings">
                    <h5 class="list-group-item-heading"> <i v-for="star in stars(rating.Rating1)" class="fa fa-star"></i></h5>
                    <hr>
                    <p class="list-group-item-text"> 
                      {{rating.Comment}}
                    </p>
                 </list-item>
                 </list-group>
        </card-block>
</row>
`;

const Profile2 = {
    template:profile2,
    data: () => {
        return {
            system : system,
            renter:  new Renter(app.$route.params.id),
        }
    },
    created: function () {
        this.renter.getRatings();

    },

    methods: {
        stars(i){
            let stars = [];
            for(j=0;j<i;j++){
                stars.push("fa-star")
            }
            return stars
        },
        show:showPage,
        goToSearch:function () {
            router.push({name:'home'});
        }
    }
};