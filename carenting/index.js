/**
 * @file Αρχικοποιήσεις και global σταθέρες που έχουν  εφάρμογη σε όλο το πρόγραμμα
 * @author Δημήτρης Τζιλιβάκης
 * @version 0.0.0
 */

/**
 * @constant
 * @desc Το url του api στο οποίο θα βλέπει η εφαρμογή
 * @type {string}
 */

let url = "https://localhost/SystemSecurityAssignment/api/private/v1.php?";
let publicUrl = "https://localhost/SystemSecurityAssignment/api/public/v1.php?";

let media = "https://localhost/api/public/";

/**
 * @constant {array}
 * @desc Ο πινάκας με τα αντικείμενα τα οποία ορίζουμε τα Paths και συνδέουμε
 * τα components
 */
const routes = [
    {name: 'home', path: '/', component: Home},
    {name: 'owner', path: '/owner/:id', component: Profile},
    {name: 'renter', path: '/renter/:id', component: Profile2},
    {name: 'car', path: '/car/:id', component: CarProfile},
    {name: 'register', path: '/Register', component: Register},
    {name: 'login', path: '/Login', component: Login},
    {name: 'addcar', path: '/AddCar', component: NewCar},
    {name: 'renting', path: '/Renting/:id', component: RentingProfile},
    {name: 'editCar', path: '/EditCar/:id', component: CarEdirProfile},
    /* { path: '/Login', component: Login },
    { path: '/Profile/:id', component: Profile ,name: 'profile' },
    { path: '/Car/:id', component: Car, name: 'car' },
    { path: '/Search', component: Search }*/
];

let system = new System();

/**
 * @constant
 * @type {VueRouter}
 * @desc αντικείμενο τύπου VueRouter το οποίο θα εισαχθεί στο αντικειμενο Vue
 */
const router = new VueRouter({
    routes
});

Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyD5HinDVYMNz_w2MIz_upkf1OpEnwAiaJ0',
        libraries: 'places'
    },
});

const wrapper = `
 <div class="container-fluid">
    <nav class="navbar p-3 navbar-toggleable-md navbar-light " >
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand " href="#"> CARCATCH</a>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <template v-if="!system.user_logged_in"> 
          <ul class="navbar-nav">
                    
                <li class="nav-item">
                    <router-link class="nav-link active" to="/Login "> Σύνδεση |</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link active" to="/Register " > Εγγραφή |</router-link>
                </li>
                <li class="nav-item">
                </li>
            </ul>
        </template>
        <template v-if="system.user_logged_in"> 
                 <ul class="navbar-nav mr-auto">
                      <li class="nav-item active">
                       <button class="btn btn-outline-primary mr-3" @click="system.user.goToProfile()"> Your Profile </button>
                      </li>
                      <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                       <i class="fa fa-envelope"></i>
                                      {{system.user.notifications.length}}
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                              <div class="dropdown-item" @click="renting.goToProfile()" v-for="renting in system.user.notifications"> 
                                 <strong>Renting Application #{{ renting.id }} is {{ renting.status }}</strong>
                              
                              </div>
                             
                            </div>
                     </li>        
                     <li class="nav-item dropdown" v-if="system.user.type==='owner'">
                            <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                       <i class="fa fa-envelope"></i> <i class="fa fa-check-circle"> </i>
                                    
                                     {{acceptedRentings.length}}
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink2">
                              <div class="dropdown-item" @click="renting.goToProfile()" v-for="renting in acceptedRentings"> 
                                 <strong>Renting Application #{{ renting.id }} is {{ renting.status }}</strong>
                              
                              </div>
                             
                            </div>
                     </li>             
                </ul>
               <ul class="navbar-nav">
                  
                <li class="nav-item">
                    <button class="btn btn-outline-danger mr-3" @click="system.logout()"> Logout |</button>
                </li>
            </ul>
        </template>
          
        </div>
    </nav>
        <row >
           <div class="col-lg-12">
              <template v-if="!system.user_logged_in">
            <div class="alert alert-warning"> 
                <h2> you are not logged in</h2>
            </div>
        </template>
                 <router-view></router-view>
           </div>
        </row>
</div>
`;

Vue.component('wrapper', {
    template: wrapper,
    data: () => {
        return {
            system: system,
            acceptedRentings: [],
        }
    },
    created() {
        /*
        if(this.system.user == null){
            this.system.redirect()
        }
            setInterval(()=>{
                this.system.user.getLastRentings('accepted').then(data=>{
                    this.acceptedRentings = data.map(
                        item=> new Renting(item.ID)
                    )
                });
            },5000)
            */
    }


});

/**
 * @constant
 * @type {Vue}
 * @borrows router
 * @desc Αρχικοποιέι την εφαρμογή
 */
const app = new Vue({
    router
}).$mount('#app');
/** Φορτώνει την εφαρμογή στο div με id #app */


