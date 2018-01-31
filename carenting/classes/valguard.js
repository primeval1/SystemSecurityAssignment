        (function (global) {
            let valguard = function (object) {
            };

            let regexEscape = (s) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

            valguard.make = {};
            valguard.has = {};
            valguard.is = {};
            //simple checks
            /**
             * @param string
             * @return {boolean}
             */
            valguard.has.uppercase = function (string) {
                return /(?=.*[A-Z])/.test(string);
            };
            /**
             * @param string
             * @return {boolean}
             */
            valguard.has.lowercase = function (string) {
                return /(?=.*[a-z])/.test(string);
            };
            /**
             * @param string
             * @return {boolean}
             */
            valguard.has.specialSymbols = function (string) {
                return /(?=.*[@#$!&*()+=?<>.;:~`|/{},])/.test(string);
            };
            valguard.has.numbers = function (string) {
                return /(?=.*[0-9])/.test(string);
            };
            /**
             * @param string
             * @return {boolean}
             */
            valguard.has.email = function (string) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(string);
            };

            /**
             * @param value
             * @param min
             * @return {boolean}
             */
            valguard.is['>='] = function (value, min) {
                if (typeof value === 'string') {
                    return value.length >= min;
                } else {
                    return value >= min;
                }

            };
            /**
             * @param value
             * @param max
             * @return {boolean}
             */
            valguard.is['<='] = function (value, max) {
                if (typeof value === 'string') {
                    return value.length <= max;
                } else {
                    return value <= max;
                }
            };
            /**
             * @param value
             * @param num
             * @return {boolean}
             */
            valguard.is['>'] = function (value, num) {
                if (typeof value === 'string') {
                    return value.length > num;
                } else {
                    return value > min;
                }

            };
            /**
             * @param value
             * @param num
             * @return {boolean}
             */
            valguard.is['<'] = function (value, num) {
                if (typeof value === 'string') {
                    return value.length < num;
                } else {
                    return value < num;
                }
            };
            /**
             * @param value
             * @param num
             * @return {boolean}
             */
            valguard.is['='] = function (value, num) {
                if (typeof value === 'string') {
                    return value.length < num;
                } else {
                    return value < num;
                }
            };
            valguard.is.chars = function (s,chars) {
                let rgx = new RegExp('(?=.*['+regexEscape(chars)+'])');
                return rgx.test(s)
            };
            /**
             *
             * @param string
             * @param domains
             * @return {boolean}
             */
            valguard.is.emailDomain = function (string, domains) {
                return domains.includes(string.split('@').pop())
            };
            /**
             * @desc options.banned contains the not allowed domains. Details: isEmail, isNotBanned
             * @param options
             * @return {Function}
             */
            valguard.make.email = function (options) {
                return function (email) {
                    let banned = options.banned || null;
                    let isEmail = valguard.has.email(email);
                    let isNotBanned = banned ? !valguard.is.emailDomain(email, banned) : true;
                    return {result: isEmail && isNotBanned, details: {email: isEmail, NotBanned: isNotBanned}}
                };
            };
            /**
             * @param options
             * @return {Function}
             */
            valguard.make.validation = function (options) {
                return function (string) {
                    let obj = {};
                    let res = [];
                    if (options.have) {
                        options.have.forEach(check => {
                            let temp;
                            if (check.startsWith('!')) {
                                let tempcheck = check.substring(1);
                                temp = !valguard.has[tempcheck](string);
                            } else {
                                temp = valguard.has[check](string);
                            }
                            obj[check] = temp;
                            res.push(temp)

                        });
                    }
                    if (options.is) {
                        for (is in options.is) {
                            if (options.is.hasOwnProperty(is)) {
                                let temp ;
                                if (is.startsWith('!')) {
                                    let tempis = is.substring(1);
                                    temp = !valguard.is[tempis](string, options.is[is]);
                                } else {
                                    temp = valguard.is[is](string, options.is[is]);
                                }
                                res.push(temp);
                                obj[is] = temp;
                            }
                        }
                    }
                    if (options.custom) {
                        for (key in options.custom) {
                            if (options.custom.hasOwnProperty(key)) {
                                let temp = options.custom[key](string);
                                res.push(temp);
                                obj[key] = temp;
                            }
                        }
                    }
                    console.log(res);
                    return {result: !res.includes(false), details: obj}
                }
            };

            global.Valguard = valguard;
        })(typeof window === 'undefined' ? global : window);


