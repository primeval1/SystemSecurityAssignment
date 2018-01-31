/**
 * Created by Dimitris on 4/30/2017.
 */
const rentTmpl = `
    <div class="card" v-if="renting.car"> 
        <card-head> 
            <h4> Renting # {{renting.id}}</h4>
        </card-head>
        <card-block> 
        <row> 
            <div class="col-lg-4"> 
                <card>  
                    <card-head> 
                        Rentee Details
                    </card-head>
                    <list-group>
                        <list-item class="list-group-item-action" @click="renter.goToProfile()" > username: {{renter.username}}</list-item>
                        <list-item> Fullname: {{renter.fullname}}</list-item>
                        <list-item> Phone: {{renter.phone}}</list-item>
                        <list-item> Address: {{renter.address}}</list-item>
                        <list-item> Experience since: {{renter.address}}</list-item>
                    </list-group>
                </card> 
            </div>
             <div class="col-lg-4"> 
                <card>  
                    <card-head> 
                        Car Details
                    </card-head>
                    <list-group> 
                        <list-item class="list-group-item-action"" > {{car.brand}}{{car.model}}</list-item>
                        <list-item> Brand: {{car.cubemtr}}</list-item>
                        <list-item> Experience since: {{car.year}}</list-item>
                    </list-group>
                </card> 
                </div>
                <div class="col-lg-4"> 
                 <card>  
                    <card-head> 
                        Renting Hours
                    </card-head>
                    <list-group> 
                        <list-item v-for="time in renting.times">{{time.Time}}</list-item>
                    </list-group>
                </card>   
                </div>
               </row>
                </card-block>
                <card-footer v-if="system.user.type === 'owner' && system.user.id === renting.owner && renting.status ==='pending' "> 
                    <button class="btn btn-success" @click="renting.accept()"> Accept</button>
                    <button class="btn btn-danger" @click="renting.cancel()"> Cancel</button>
                </card-footer>  
                <card-footer v-if="system.user.type === 'owner' && system.user.id === renting.owner && renting.status ==='accepted' "> 
                    <button class="btn btn-success" @click="renting.close()"> Close</button>
                </card-footer> 
                <card-block v-if="system.user.type === 'owner' && system.user.id === renting.owner && renting.status ==='closed' "> 
                      <select v-model="rating"> 
                           <option value="1"> 1 </option>
                           <option value="2"> 2 </option>
                           <option value="3"> 3 </option>
                           <option value="4"> 4 </option>
                           <option value="5"> 5 </option>
                         </select>
                        <textarea v-model="ratingComment"> </textarea>      
                        <button class="btn-success" @click='rate()'> Submit rating </button>
                </card-block>
               <card-footer v-if="system.user.type === 'renter' && system.user.id === renting.renter && renting.status === 'pending' ">
                    <button class="btn btn-danger" @click="renting.cancel()"> Cancel </button>
              
                </card-footer>
                
                <card-block v-if="system.user.type === 'renter' && system.user.id === renting.renter && renting.status === 'closed' ">
                         <select v-model="rating"> 
                           <option value="1"> 1 </option>
                           <option value="2"> 2 </option>
                           <option value="3"> 3 </option>
                           <option value="4"> 4 </option>
                           <option value="5"> 5 </option>
                         </select>
                        <textarea v-model="ratingComment"> </textarea>      
                        <button class="btn-success" @click='rate()'> Submit rating </button>
                </card-block>
            </div>
`;
const RentingProfile = {
    template: rentTmpl,
    data: () => {
        return {
            system: system,
            renting: new Renting((app.$route.params.id)),
            car:null,
            renter:null,
            ratingComment:'',
            rating:1


        }
    },
    created: function () {
        console.log(this.renting.renter);
       setTimeout(()=>{
            this.renter = new Renter(this.renting.renter);
            this.car = new Car(this.renting.car);
            this.renting.getTimes();
        },2000); //ti kanei kapoios otan einai 4:23 mia mera prin thn eksetash :P omg/*


    },

    methods: {
        rate:function(){
            if(this.system.user.type==='renter'){
                this.system.user.rate(this.renting.owner,this.rating, this.ratingComment,)
            }else{
                this.system.user.rate(this.renting.renter,this.rating, this.ratingComment,)

            }
        }
    }
};
