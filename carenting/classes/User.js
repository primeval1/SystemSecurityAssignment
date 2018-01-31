/**
 *  @class System
 *  @desc Γενική κλάσση για τις βασικές λειτουργίες του site.
 */
class System{
    constructor(){
        this.user_logged_in = false;
        this.user = null ;
        this.msg = new Messages();
    }

    /**
     *
     * @param password
     * @param username
     * @desc επιχηρεί login αν δεν γίνει login κάνει push ενα error message μέσω της κλάσης για τα messages
     */
    login(password, username){
        let formdata = new FormData();
        formdata.append('password',password);
        formdata.append('username',username);
        let params = getParams({ type:'login'});
        fetch(url+params ,{
            method:'post',
            body: formdata,
            credentials: 'omit'
        })
            .then(data=>data.json())
            .then(data=>{
                if(data.success){
                    this.msg.removeError('notloggedin');
                    this.msg.addSuccess('loggedin','You have successfully logged in');
                    this.user_logged_in  = true;
                    this.user = data.type ==='owner'? new Owner(data.id): new Renter(data.id);
                    url = url+'?';
                    router.push({
                        name:data.type ==='owner'? 'owner':'renter',
                        params:{id:data.id}
                    });

                }else{
                    this.user_logged_in  = false;
                    this.user= null;
                    this.msg.addError('notloggedin','Authentication did not succeed');
                }
            })
    }
    logout(){
        this.user_logged_in = false;
        this.user_id = null ;

    }

    /**
     * ελέγχει άν είναι logged in ο χρήστης
     * @return {boolean}
     */
    isLoggedIn(){
        if (!this.user_logged_in){
            this.redirect();
        }else{
            return true;
        }
    }

    /**
     * @desc ανακατευθύνει στο login page
     */
    redirect(){
        router.push({name:'login'});
    }

}

/**
 * @class Messages
 * @desc δημιουργεί μυνήματα για documentation, errors κλπ.
 */
class Messages{
    constructor(){
        this.error=[];
        this.success=[];
        this.info =[];
        this.showHideInfo = true
    }

    /**
     * @desc επιστρέφει κάποιο συγκεκριμένο info
     * @param type
     * @return {T}
     */
    getinfo(type){
        return this.info.find(info=>info.type==type);
    }

    /**
     * @desc Γεμισει τα info με κάποιο array που του δίνουμε.
     * @param infos
     */
    setInfo(infos){
        this.info = infos
    }
    /**
     * Αλλάζει την ορατότητα των info (χρισημοποιείτε απο τα templates).
     * @param infos
     */
    toogleInfo(){
        this.showHideInfo = !this.showHideInfo;
    }

    /**
     * @desc προσθέτει ένα error
     * @param type
     * @param message
     */
    addError(type,message){
        this.error.push({type:type,msg:message});
    }

    /**
     * @desc αφαιρεί ένα error
     * @param type
     */
    removeError(type){
        const index = this.error.findIndex(error=>error.type==type);
        this.error.splice(index,1);
    }

    /**
     * @desc προσθέτει ένα μύνημα τύπου success
     * @param type
     * @param message
     */
    addSuccess(type,message){
        this.success.push({type:type,msg:message});
    }

    /**
     * @desc  Αφαιρέι ένα μύνμηα success
     * @param type
     */
    removeSuccess(type){
        const index = this.success.findIndex(success=>success.type==type);
        this.success.splice(index,1);
    }

    /**
     * αφαιρεί ένα μύνημα success μετά από κάποιο χρόνο.
     * @param type
     * @param milliseconds
     */
    autoRemoveSuccess(type,milliseconds){
        setTimeout(this.removeSuccess(type),milliseconds)
    }
}
/**
 * @class Registration
 * @desc χρισημοποείτε για το registration
 */
class Registration{
    constructor(){
            this.firstname=null;
            this.gender = null;
            this.address = null;
            this.lastname=null;
            this.username='';
            this.email=null;
            this.password='';
            this.age = null;
            this.experience= null;
            this.phone = null;
            this.type = null;
            this.msg = new Messages();
            this.registered = false;
    }

    /**
     * @desc πραγματοποιεί το register
     * @borrows Message
     */
    register(){
        let params = new FormData();
        params.append('FirstName',this.firstname);
        params.append('LastName',this.lastname);
        params.append('Username',this.username);
        params.append('Email',this.email);
        params.append('Age',this.age);
        params.append('Phonenumber',this.phone);
        params.append('Address',this.address);
        params.append('Gender',this.gender);
        params.append('Password',this.password);
        params.append('Type',this.type);

        params.append('Experience',this.type =="renter"? this.experience:'');
        fetch(url+getParams({type:'register-user'}), {
                method: 'post',
                credentials: 'omit',
                body: params
            }
            )
            .then(resp=>resp.json())
            .then(resp=>{
                if(resp.success ){
                    this.msg.addSuccess('registration','You were successfully registered!. You can now login.');
                    this.registered = true;

                }else{
                    this.msg.addError('There was an error during your registration');
                }
            })
            .catch(err=>{this.msg.addError('not-registered',`there was an error during your registration: ${err}`)});
    }

    applyUsername(username){
        if(username.length > 5){
            fetch(url+getParams({type:'check-username',Username:username}),{
                credentials: 'include'
            })
                .then(data=>data.json())
                .then(data=>{
                    if(data.success){
                        this.username = username;
                        this.msg.removeError('username');
                    }else{
                        this.username = null;
                        this.msg.addError('username','Username already exists. Please pick another username')
                    }
                })
        }

    }

    /**
     * @desc ελέγχει άν μπορεί να γίνει register (αν έχουν συμπληρωθεί τα πεδία )
     */
    procceed(){
        let flag = false;
        if(this.type =='owner'){
            if( this.firstname
                && this.lastname
                && this.gender
                && this.address
                && this.type
                && this.email
                && this.phone
                && this.age
                && this.username && this.username.length > 4
                && this.password && this.password.length > 5){
                flag =  true;
            }
        }else if(this.type =='renter'){
            if( this.firstname
                && this.lastname
                && this.gender
                && this.address
                && this.type
                && this.email
                && this.phone
                && this.age
                && this.username && this.username.length > 4
                && this.password && this.password.length > 5
                && this.experience
            ){
                flag = true;
            }
        }
        this.completed = flag;
    }
}
/**
 * @class User
 * @desc γενική κλάσση για τους user
 */
class User{
    constructor(id) {
        this.id = id;
        this.description = null;
        this.type = null;
        this.username = null;
        this.fullname = null;
        this.age = null;
        this.phone = null;
        this.location = null;
        this.experience = null;
        this.email = null;

        fetch(url + getParams({type: "user", id: id}))
            .then(data => data.json())
            .then(data => {
                this.description = data.Other;
                this.type = data.Type;
                this.username = data.Username;
                this.fullname = data.FirstName+' '+data.Lastname;
                this.age = data.Age;
                this.phone = data.Phonenumber;
                this.location = data.Address;
                this.experience = data.Experience;
                this.email = data.Email;

            });
    }

    /**
     * @desc θα κάνει update τα στοιχεια του χρίστη
     */
    updateDetails(){
        let details = new FormData();
        details.append('description',this.description);
        details.append('phone',this.phone);
        details.append('location',this.location);
    }
}


class Owner extends User{

    /**
     * @desc method που επιστρέφει τα ratings ενός χρήστη
     *
     * @returns {Promise}
     */
    getRatings(){}
    /**
     * @desc method που επιστρέφει τα αυτοκίνητα ενός χρήστη
     * @borrows User.id, Car
     * @returns {Promise}
     */
    getCars(){
       return fetch(url+getParams({type:"cars", UserID :this.id})).then(data=>data.json())
    }

    /**
     * @borrows User.id
     * @desc μεθοδος που επιστρέφει τις ενοικιασεις, χρισημοποιώντας ως φίλτρο το status, και την ημρομηνία
     * @param status
     * @param minDate
     * @return {Promise}
     */

    getLastRentings(status,minDate){
        const id = this.id;
        return  new Promise((resolve, reject) => {

            let status = status?item[status]==status:true;
            let rentings = rentingData.filter(item=> item.owner == id && status );
            rentings =  rentings.map(item => new Renting(item));
            // We call resolve(...) when what we were doing made async successful, and reject(...) when it failed.
            // In this example, we use setTimeout(...) to simulate async code.
            // In reality, you will probably be using something like XHR or an HTML5 API.
            setTimeout(function(){
                resolve(rentings); // Yay! Everything went well!
            }, 250);
        });
    }

    /**
     *
     * @param car {object}
     * @desc δημιουργει ένα αυτοκίνητο στην βάση
     */
    addCar(car){
        let details = new FormData();
        details.append('Brand',car.brand);
        details.append('Model',car.model);
        details.append('Year',car.year);
        details.append('Lat', car.location.lat);
        details.append('Long', car.location.lng);
        details.append('Price',car.price);
        details.append('Cubemtr',car.cubemtr);
        details.append('Other',car.description);
        details.append('UserID',this.id);
        fetch(url+getParams({type:'addCar'}),{
            method: 'post',
            credentials: 'omit',
            body: details
        })
            .then(data=>data.json())
            .then(data=>{
                if(data.success){
                    router.push({
                        name:'owner',
                        params:{
                            id: this.id
                        }
                    });
                }
            })
    }


}


class Renter extends  User{
    getRatings(){

    }
    /**
     * @borrows User.id
     * @desc μεθοδος που επιστρέφει τις ενοικιασεις, χρισημοποιώντας ως φίλτρο το status, και την ημρομηνία, η διαφορά απο
     * αυτήν του Οwner είναι οτι θα πρέπει να φέρνει τις ενοικιάσεις του Renter
     * @param status
     * @param minDate
     * @return {Promise}
     */

    getLastRentings(status,minDate){
        const id = this.id;
        return  new Promise((resolve, reject) => {
            let rentings = [];

            // We call resolve(...) when what we were doing made async successful, and reject(...) when it failed.
            // In this example, we use setTimeout(...) to simulate async code.
            // In reality, you will probably be using something like XHR or an HTML5 API.
            setTimeout(function(){
                resolve(rentings); // Yay! Everything went well!
            }, 250);
        });
    }

    //den kserw an tha mpei
    rateCar(carID){
    }


}



class Renting {
    constructor(data){
        this.id = data.id;
        this.car = data.car;
        this.price = data.price;
        this.extraprice = data.extraprice;
        this.status = data.status;
        this.notes = data.notes;
        this.dateSubmited = data.dateSubmited;
        this.times = data.times;
        this.messages = []
    }

    /**
     * @desc προσπαθεί να αλλάξει το status του Renting, δημιουργεί καταλληλο μυνημα για να εμφανίσει στον χρήστη.
     *
     */
    end(){
        let promise = new  Promise((resolve, reject) => {
            // We call resolve(...) when what we were doing made async successful, and reject(...) when it failed.
            // In this example, we use setTimeout(...) to simulate async code.
            // In reality, you will probably be using something like XHR or an HTML5 API.
            setTimeout(function(){
                resolve(true); // Yay! Everything went well!
            }, 250);
        });
        promise.then(success => {
            if (success) {
                this.status = 'ended';
                this.messages.push({val: 'success', msg: 'Renting was ended successfully.'})

            } else {
                this.messages.push({val: 'danger', msg: 'Renting could not be ended.'})
            }
        });
    }

    /**
     * @desc η ενοικιαση  αυτή θα πρέπει να διαγραφθεί απο την βάση. επιστρέφει promise καθώς θα πρεπει
     * να ξερει το Vue ποτε να διαγράψει το element.
     * @return {Promise}
     */
    cancelAndRemove(){
        success = true;
        return new Promise((resolve, reject) => {
            // We call resolve(...) when what we were doing made async successful, and reject(...) when it failed.
            // In this example, we use setTimeout(...) to simulate async code.
            // In reality, you will probably be using something like XHR or an HTML5 API.
            setTimeout(function(){
                resolve(true); // Yay! Everything went well!
            }, 250);
        });
    }

    /**
     * @desc αποδοχή του renting
     */
    accept(){
        success = true;
        if(success){
            this.status = 'accepted';
            this.messages.push({val:'success',msg:'Renting was accepted successfully.'})

        }else{
            this.messages.push({val:'danger',msg:'Renting could not be accepted.'})
        }
    }

}

/**
 * @class Car
 * @desc κλάση με λειτουργείες πάνω στα αυτοκίνητα
 */
class  Car {
    constructor(id) {
        this.id = null;
        this.user = null;
        this.brand = null;
        this.year = null;
        this.model = null;
        this.price = null;
        this.location = {
            lat: null,
            lng:null,
        };
        this.description = null;
        this.username = null;
        fetch(url+getParams({type:'car',id:id}))
            .then(data=>data.json())
            .then(data=>{
                this.id = id;
                this.user = data.UserID;
                this.brand = data.Brand;
                this.year = data.Year;
                this.model = data.Model;
                this.price = data.Price;
                this.location = {
                    lat: data.Lat,
                    lng: data.Long,
                };
                this.description = data.Other;
                this.getOwnerDetails();
            });
    }


    getRatings() {
    }


    /**
     * @desc επισττέφει το username
     *
     */
    getOwnerDetails(){
         fetch(url+getParams({type:'getUsername',id:this.user}))
             .then(data => data.json())
             .then(data => {
                 this.username = data.username
             })
    }
    /**
     * @desc to αυτοκίνητο αυτο θα πρέπει να διαγραφθεί απο την βάση. επιστρέφει promise καθώς θα πρεπει
     * να ξερει το Vue ποτε να διαγράψει το element.
     * @return {Promise}
     */
    remove() {
        id = this.id;
        return new Promise((resolve, reject) => {
            // We call resolve(...) when what we were doing made async successful, and reject(...) when it failed.
            // In this example, we use setTimeout(...) to simulate async code.
            // In reality, you will probably be using something like XHR or an HTML5 API.
            setTimeout(function () {
                resolve(true); // Yay! Everything went well!
            }, 250);
        });
    }

    /**
     * @param photo
     * @desc θα χρισημοποιήσω το component που έχω φτιάξει.
     */
    addPhoto(photo) {
        id = this.id;
        return new Promise((resolve, reject) => {
            // We call resolve(...) when what we were doing made async successful, and reject(...) when it failed.
            // In this example, we use setTimeout(...) to simulate async code.
            // In reality, you will probably be using something like XHR or an HTML5 API.
            setTimeout(function () {
                resolve(true); // Yay! Everything went well!
            }, 250);
        });
    }

    /**
     * @desc επεξεργασία των δεδομένων του αυτοκίνητου
     */
    editDetails() {
        let details = new FormData();
        details.append('bramd', this.description);
        details.append('phone', this.phone);
        details.append('location', this.location);
        let promise = new Promise((resolve, reject) => {

            // We call resolve(...) when what we were doing made async successful, and reject(...) when it failed.
            // In this example, we use setTimeout(...) to simulate async code.
            // In reality, you will probably be using something like XHR or an HTML5 API.
            setTimeout(function () {
                resolve(true); // Yay! Everything went well!
            }, 250);
        });
        promise.then(success => {
            if (success) {
                this.status = 'ended';
                this.messages.push({val: 'success', msg: 'Renting was ended successfully.'})

            } else {
                this.messages.push({val: 'danger', msg: 'Renting could not be ended.'})
            }
        })
    }

    /**
     * @desc δημιουργεί το προγραμμα του αυτοκινήτου το hour θα είναι μορφής 12:00
     * @param hour
     */
    scheduleCar(hour){

    }

    //den kserw na tha mpei edw auto
    rate(userID, ratings, value) {
        return new Promise((resolve, reject) => {

            // We call resolve(...) when what we were doing made async successful, and reject(...) when it failed.
            // In this example, we use setTimeout(...) to simulate async code.
            // In reality, you will probably be using something like XHR or an HTML5 API.
            setTimeout(function () {
                resolve(true); // Yay! Everything went well!
            }, 250);
        });

    }
}