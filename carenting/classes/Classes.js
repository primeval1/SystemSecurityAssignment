/**
 *  @class System
 *  @desc Γενική κλάσση για τις βασικές λειτουργίες του site.
 */


class System {
    constructor() {
        this.user_logged_in = false;
        this.user = null;
        this.msg = new Messages();
        this.authenticateCookie();
    }

    /**
     *
     * @param password
     * @param username
     * @desc επιχηρεί login αν δεν γίνει login κάνει push ενα error message μέσω της κλάσης για τα messages
     */
    login(password, username) {
        let formdata = new FormData();
        formdata.append('password', password);
        formdata.append('username', username);
        let params = getParams({type: 'login'});
        fetch(publicUrl + params, {
            method: 'post',
            body: formdata,
            credentials: 'omit'
        })
            .then(data => data.json())
            .then(data => {
                if (data.success) {
                    this.msg.removeError('notloggedin');
                    this.msg.addSuccess('loggedin', 'You have successfully logged in');
                    this.user_logged_in = true;
                    this.setUser(data);
                    this.setTokenToUrl(data.token);
                    Cookies.set('auth',data.token);
                } else {
                    this.user_logged_in = false;
                    this.user = null;
                    this.msg.addError('notloggedin', 'Authentication did not succeed');
                }
            })
    }

    logout() {
        this.user_logged_in = false;
        this.user = null;
        Cookies.remove('auth');
        this.redirect();
    }
    setTokenToUrl(token){
     url = url+'token='+token+'&';
    }
    setUser(data){
        this.user_logged_in = true;
        this.user = data.type === 'owner' ? new Owner(data.id) : new Renter(data.id);
        this.user.getNotifications();
        setInterval(() => {
            this.user.checkForNotifications()
        }, 5000); //checks for notifications every 5 secs
        router.push({
            name: data.type === 'owner' ? 'owner' : 'renter',
            params: {id: data.id}
        });
    }

    /**
     * ελέγχει άν είναι logged in ο χρήστης
     * @return {boolean}
     */
    isLoggedIn() {
        if (!this.user_logged_in) {
            this.redirect();
        } else {
            return true;
        }
    }
    authenticateCookie(){
        let data = new FormData();
        let token = Cookies.get('auth');
        let params = getParams({type: 'validate-user',token:token});
        fetch(publicUrl + params).then(data=>data.json()).then((data=>{
            if(data.id){
                this.setTokenToUrl(token);
                this.setUser(data);
                console.log(url);
                console.log(data);
            }else{
                this.redirect();
            }
        }))
    }

    /**
     * @desc ανακατευθύνει στο login page
     */
    redirect() {
        router.push({name: 'login'});
    }


}

/**
 * @class Messages
 * @desc δημιουργεί μυνήματα για documentation, errors κλπ.
 */
class Messages {
    constructor() {
        this.error = [];
        this.success = [];
        this.info = [];
        this.showHideInfo = true
    }

    /**
     * @desc επιστρέφει κάποιο συγκεκριμένο info
     * @param type
     * @return {T}
     */
    getinfo(type) {
        return this.info.find(info => info.type == type);
    }

    /**
     * @desc Γεμισει τα info με κάποιο array που του δίνουμε.
     * @param infos
     */
    setInfo(infos) {
        this.info = infos
    }

    /**
     * Αλλάζει την ορατότητα των info (χρισημοποιείτε απο τα templates).
     * @param infos
     */
    toogleInfo() {
        this.showHideInfo = !this.showHideInfo;
    }

    /**
     * @desc προσθέτει ένα error
     * @param type
     * @param message
     */
    addError(type, message) {
        this.error.push({type: type, msg: message});
    }

    /**
     * @desc αφαιρεί ένα error
     * @param type
     */
    removeError(type) {
        const index = this.error.findIndex(error => error.type == type);
        this.error.splice(index, 1);
    }

    /**
     * @desc προσθέτει ένα μύνημα τύπου success
     * @param type
     * @param message
     */
    addSuccess(type, message) {
        this.success.push({type: type, msg: message});
    }

    /**
     * @desc  Αφαιρέι ένα μύνμηα success
     * @param type
     */
    removeSuccess(type) {
        const index = this.success.findIndex(success => success.type == type);
        this.success.splice(index, 1);
    }

    /**
     * αφαιρεί ένα μύνημα success μετά από κάποιο χρόνο.
     * @param type
     * @param milliseconds
     */
    autoRemoveSuccess(type, milliseconds) {
        setTimeout(this.removeSuccess(type), milliseconds)
    }
}

/**
 * @class Registration
 * @desc χρισημοποείτε για το registration
 */
class Registration {
    constructor() {
        this.firstname = null;
        this.gender = null;
        this.address = null;
        this.lastname = null;
        this.username = '';
        this.email = null;
        this.password = '';
        this.age = null;
        this.experience = null;
        this.phone = null;
        this.type = null;
        this.msg = new Messages();
        this.registered = false;
    }

    /**
     * @desc πραγματοποιεί το register
     * @borrows Message
     */
    register() {
        let params = new FormData();
        params.append('FirstName', this.firstname);
        params.append('LastName', this.lastname);
        params.append('Username', this.username);
        params.append('Email', this.email);
        params.append('Age', this.age);
        params.append('Phonenumber', this.phone);
        params.append('Address', this.address);
        params.append('Gender', this.gender);
        params.append('Password', this.password);
        params.append('Type', this.type);

        params.append('Experience', this.type == "renter" ? this.experience : '');
        fetch(publicUrl + getParams({type: 'register-user'}), {
                method: 'post',
                credentials: 'omit',
                body: params
            }
        )
            .then(resp => resp.json())
            .then(resp => {
                if (resp.success) {
                    this.msg.addSuccess('registration', 'You were successfully registered!. You can now login.');
                    this.registered = true;
                } else {
                    this.msg.addError('There was an error during your registration');
                }
            })
            .catch(err => {
                this.msg.addError('not-registered', `there was an error during your registration: ${err}`)
            });
    }

    applyUsername(username) {
            return fetch(publicUrl + getParams({type: 'check-username', Username: username}), {
                credentials: 'include'
            })
                .then(data => data.json())
                .then(data => {
                    if (data.success) {
                        this.username = username;
                        this.msg.removeError('username');
                    } else {
                        this.username = "";
                        this.msg.addError('username', 'Username already exists. Please pick another username')
                    }
                    return  Promise.resolve(true);
                })

    }

    /**
     * @desc ελέγχει άν μπορεί να γίνει register (αν έχουν συμπληρωθεί τα πεδία )
     */
    procceed() {
        let flag = false;
        if (this.type == 'owner') {
            if (this.firstname
                && this.lastname
                && this.gender
                && this.address
                && this.type
                && this.email
                && this.phone
                && this.age
                && this.username && this.username.length > 4
                && this.password && this.password.length > 5) {
                flag = true;
            }
        } else if (this.type == 'renter') {
            if (this.firstname
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
            ) {
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
class User {
    constructor(id) {
        this.id = id;
        this.description = null;
        this.type = null;
        this.username = null;
        this.fullname = null;
        this.ratings = [];
        this.age = null;
        this.phone = null;
        this.location = null;
        this.experience = null;
        this.email = null;
        this.notifications = [];
        fetch(url + getParams({type: "user", id: id}))
            .then(data => data.json())
            .then(data => {
                this.description = data.Other;
                this.type = data.Type;
                this.username = data.Username;
                this.fullname = data.FirstName + ' ' + data.Lastname;
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
    updateDetails() {
        let details = new FormData();
        details.append('description', this.description);
        details.append('phone', this.phone);
        details.append('location', this.location);
    }

    getRatings() {
        fetch(url + getParams({type: 'ratings', id: this.id}))
            .then(data => data.json())
            .then(data => {
                this.ratings = data
            })
    }
}

class Owner extends User {

    /**
     * @desc method που επιστρέφει τα αυτοκίνητα ενός χρήστη
     * @borrows User.id, Car
     * @returns {Promise}
     */
    getCars() {
        return fetch(url + getParams({type: "cars", UserID: this.id})).then(data => data.json())
    }

    checkForNotifications() {
        this.getLastRentings('pending').then(data => {
            if (data.length !== this.notifications.length) {
                this.getNotifications();
            }
        })
    }

    getNotifications() {
        this.getLastRentings('pending').then(data => {
            this.notifications = data.map(item => new Renting(item.ID));
        })
    }

    goToProfile() {
        router.push({
            name: 'owner',
            params: {
                id: this.id
            }
        });
    }

    /**
     * @borrows User.id
     * @desc μεθοδος που επιστρέφει τις ενοικιασεις, χρισημοποιώντας ως φίλτρο το status, και την ημρομηνία
     * @param status
     * @param minDate
     * @return {Promise}
     */

    getLastRentings(status) {
        const id = this.id;
        const parameters = getParams({type: 'ownerRentings', ownerID: this.id, status: status});
        return fetch(url + parameters).then(data => data.json())
    }

    /**
     *
     * @param car {object}
     * @desc δημιουργει ένα αυτοκίνητο στην βάση
     */
    addCar(car) {
        let details = new FormData();
        details.append('Brand', car.brand);
        details.append('Model', car.model);
        details.append('Year', car.year);
        details.append('Lat', car.location.lat);
        details.append('Long', car.location.lng);
        details.append('Price', car.price);
        details.append('Cubemtr', car.cubemtr);
        details.append('Other', car.description);
        details.append('UserID', this.id);
        fetch(url + getParams({type: 'addCar'}), {
            method: 'post',
            credentials: 'omit',
            body: details
        })
            .then(data => data.json())
            .then(data => {
                if (data.success) {
                    router.push({
                        name: 'owner',
                        params: {
                            id: this.id
                        }
                    });
                }
            })
    }

    rate(target, rating, comment) {
        let details = new FormData();
        details.append('target', target);
        details.append('rating', rating);
        details.append('comment', comment);
        details.append('user', this.id);

        fetch(url + getParams({type: 'rating'}), {
            method: 'post',
            credentials: 'omit',
            body: details
        })
            .then(data => data.text())
            .then(data => {
                console.log(data);
                if (data.success) {
                    showPage('renter', target);
                }
            });
    }
}

class Renter extends User {
    /**
     * @borrows User.id
     * @desc μεθοδος που επιστρέφει τις ενοικιασεις, χρισημοποιώντας ως φίλτρο το status, και την ημρομηνία, η διαφορά απο
     * αυτήν του Οwner είναι οτι θα πρέπει να φέρνει τις ενοικιάσεις του Renter
     * @param status
     * @return {Promise}
     */
    getLastRentings(status) {
        const id = this.id;
        const parameters = getParams({type: 'renterRentings', ownerID: id, status: status});
        return fetch(url + parameters).then(data => data.json())
    }

    getNotifications() {
        this.getNotInformed().then(data => {
            this.notifications = data.map(item => new Renting(item.ID));
        })
    }

    checkForNotifications() {
        this.getNotInformed().then(data => {
            let notSameLength = data.length !== this.notifications.length;
            if (notSameLength) {
                this.getNotifications();
            }
            if (!notSameLength) {
                for (let i = 0; i <= data.length; i++) {
                    let differentStatus = this.notifications[i].status !== data[i].status;

                }
                if (differentStatus) {
                    this.getNotifications();
                }

            }

        })
    }

    getNotInformed() {
        const parameters = getParams({type: 'notInformed', userID: this.id,});
        return fetch(url + parameters).then(data => data.json())
    }

    goToProfile() {
        router.push({
            name: 'renter',
            params: {
                id: this.id
            }
        });
    }

    //den kserw an tha mpei
    rate(target, rating, comment) {
        let details = new FormData();
        details.append('target', target);
        details.append('rating', rating);
        details.append('comment', comment);
        details.append('user', this.id);

        fetch(url + getParams({type: 'rating'}), {
            method: 'post',
            credentials: 'omit',
            body: details
        })
            .then(data => data.text())
            .then(data => {
                console.log(data);

                if (data.success) {
                    showPage('owner', target);
                }
            });
    }
}

class Renting {
    constructor(id) {
        this.id = id;
        this.renter = null;
        this.owner = null;
        this.car = null;
        this.totalprice = null;
        this.status = null;
        this.other = null;
        this.times = [];
        this.msg = new Messages();
        this.informed = null;
        const params = getParams({type: 'getRenting', ID: this.id});
        fetch(url + params)
            .then(data => data.json())
            .then(data => {
                this.renter = data.UserID;
                this.owner = data.OwnerID;
                this.informed = data.informed;
                this.other = data.Other;
                this.status = data.Status;
                this.totalprice = data.TotalPrice;
                this.car = data.CarsID;
            })
    }

    /**
     * @desc προσπαθεί να αλλάξει το status του Renting, δημιουργεί καταλληλο μυνημα για να εμφανίσει στον χρήστη.
     *
     */
    changeStatus(status) {
        let data = new FormData();
        const parameters = getParams({type: 'changeRentingStatus'});
        data.append('status', status);
        data.append('ID', this.id);
        return fetch(url + parameters, {
            method: 'post',
            credentials: 'omit',
            body: data
        }).then(data => data.json());
    }

    close() {
        this.changeStatus('closed').then(data => {
            if (data.success) {
                this.msg.removeError('error');
                this.msg.addSuccess('success', 'Renting was closed successfully.');
                this.status = "closed";

            } else {
                this.msg.removeSuccess('success');
                this.msg.addError('error', 'Renting was not closed .');
            }
        });
    }

    /**
     * @desc η ενοικιαση  αυτή θα πρέπει να διαγραφθεί απο την βάση. επιστρέφει promise καθώς θα πρεπει
     * να ξερει το Vue ποτε να διαγράψει το element.
     */
    cancel() {
        this.changeStatus('canceled').then(data => {
            if (data.success) {
                this.msg.removeError('error');
                this.msg.addSuccess('success', 'Renting was canceled successfully.');
                this.status = 'canceled';

            } else {
                this.msg.removeSuccess('success');
                this.msg.addError('error', 'Renting was not canceled .');
            }
        });
    }

    /**
     * @desc αποδοχή του renting
     */
    accept() {
        this.changeStatus('accepted').then(data => {
            if (data.success) {
                this.msg.removeError('error');
                this.msg.addSuccess('success', 'Renting was accepted successfully.');
                this.status = "accepted";
            } else {
                this.msg.removeSuccess('success');
                this.msg.addError('error', 'Renting was not accepted.')
            }
        });
    }

    read() {
        let data = new FormData();
        const parameters = getParams({type: 'changeInformed'});
        data.append('ID', this.id);
        fetch(url + parameters, {
            method: 'post',
            credentials: 'omit',
            body: data
        })
            .then(data => data.json())
            .then(data => {
                this.informed = data.success
            });
    }

    getTimes() {
        const params = getParams({type: 'rentingTimes', id: this.id});
        fetch(url + params)
            .then(data => data.json())
            .then(data => {
                this.times = data;
            })
    }

    goToProfile() {
        router.push({name: 'renting', params: {id: this.id}});
    }

}

/**
 * @class Car
 * @desc κλάση με λειτουργείες πάνω στα αυτοκίνητα
 */
class Car {
    constructor(id) {
        this.id = id;
        this.user = null;
        this.brand = null;
        this.year = null;
        this.model = null;
        this.price = null;
        this.lat = null;
        this.lng = null;
        this.msg = new Messages();
        this.description = null;
        this.username = null;
        this.schedule = null;
        this.rentings = null;
        this.cubemtr = null;
        this.photos = [];
        this.notOnSchedule = [];

        fetch(url + getParams({type: 'car', id: id}))
            .then(data => data.json())
            .then(data => {
                this.user = data.UserID;
                this.brand = data.Brand;
                this.year = data.Year;
                this.model = data.Model;
                this.price = data.Price;
                this.cubemtr = data.Cubemtr;
                this.lat = data.Lat;
                this.lng = data.Long;
                this.description = data.Other;
                this.getOwnerDetails();
            });
    }


    /**
     * @desc επισττέφει το username
     *
     */
    getOwnerDetails() {
        fetch(url + getParams({type: 'getUsername', id: this.user}))
            .then(data => data.json())
            .then(data => {
                this.username = data.username
            })
    }

    getPhotos() {
        const params = getParams({type: 'carPhotos', id: this.id})
        fetch(url + params)
            .then(photos => photos.json())
            .then(photos => {
                this.photos = photos.map(photo => {
                    return media + photo.Photo;
                });
            })
    }

    /**
     * @desc δημιουργεί το προγραμμα του αυτοκινήτου το hour θα είναι μορφής 12:00
     * @param hour
     */
    scheduleCar(hour) {

    }

    getTotalPrice(total) {
        return this.price * total;

    }

    rent(arrOfTimes, userid, other, ownerid) {
        const times = JSON.stringify(arrOfTimes);
        const totalPrice = this.getTotalPrice(arrOfTimes.length);
        const params = getParams({
            type: 'renting',
            totalPrice: totalPrice,
            userID: userid,
            carID: this.id,
            times: times,
            other: other,
            ownerID: ownerid
        });
        fetch(url + params, {
            method: 'post',
            credentials: 'omit',
            body: params
        })
            .then(data => data.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    this.msg.removeError('rentingNotSent');
                    this.msg.addSuccess('rentingSent', ' renting application was successfully send for evaluation to the owner');
                } else {
                    this.msg.removeSuccess('rentingSent');
                    this.msg.addError('rentingNotSent', ' There was a problem with your renting');
                }
            })
    }

    addScedule(arrOfTimes) {
        let form = new FormData();
        form.append('times', JSON.stringify(arrOfTimes));
        form.append('id', this.id);
        fetch(url + getParams({type: 'addSchedule'}), {
            method: 'post',
            credentials: 'omit',
            body: form
        })
            .then(data => data.json())
            .then(data => {
                if (data.success) {
                    this.msg.addSuccess('success', 'Schedule were updated');
                }
            })
    }

    getSchedule() {
        const param = getParams({type: 'carSchedule', id: this.id});
        fetch(url + param)
            .then(schedule => schedule.json())
            .then(schedule => {
                this.schedule = schedule;
                let timesOnSchedule = schedule.map(item => item.Time);
                console.log(timesOnSchedule);
                this.notOnSchedule = [];
                let times = [];
                for (let i = 0; i <= 23; i++) {
                    let time = pad(i) + ':00:00';
                    times.push(time);
                }
                console.log(times);
                let mergedTimes = timesOnSchedule.concat(times);
                console.log(mergedTimes);
                this.notOnSchedule = mergedTimes.filter((value, index, self) => {
                        return self.indexOf(value) === index;
                    }
                );


            });

    }


    getRentings(status) {
        const param = getParams({type: 'carRentings', id: this.id, status: status});
        fetch(url + param)
            .then(rentings => rentings.json())
            .then(rentings => {
                this.rentings = rentings;
            });
    }


    //den kserw na tha mpei edw auto

    goToProfile() {
        showPage('car', this.id)

    }
}

class Search {
    constructor() {
        this.times = [];
        this.results = [];
        this.lat = null;
        this.lng = null;

    }

    perform() {
        const parameters = getParams({type: "search", times: JSON.stringify(this.times)});
        fetch(url + parameters)
            .then(data => data.json())
            .then(data => {
                let results = data.map(data => {
                    let car = new Car(data.CarsID);
                    //car.lng = data.Long;
                    //car.lat = data.Lat;
                    return car;
                });
                setTimeout(() => {
                    console.log(results);
                    results.sort((a, b) => this.getDistanceFromLatLonInKm(this.lat, this.long, b.lat, b.long) - this.getDistanceFromLatLonInKm(this.lat, this.lng, a.lat, a.lng))
                    console.log(results);
                    this.results = results.map(car => {
                        const distance = this.getDistanceFromLatLonInKm(this.lat, this.lng, car.lat, car.lng);
                        return {car: car, dist: distance};
                    })
                }, 2000);

            });
    }

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
}