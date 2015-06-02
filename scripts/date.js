var date = (function () {
    'use strict';
    var date = new Date();
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'][date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}());