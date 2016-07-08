/// <reference path="knockout-3.4.0.js" />

var convertToObservable = function (object) {
    var t = {}, i;
    if (typeof object.valueOf() === "object") {
        for (i in object) {
            object.hasOwnProperty(i) && object[i] && (t[i] = object[i].toObservable());
        }
        return t;
    }
    return typeof object.valueOf() === "array" ? ko.observable([object.valueOf()]) : ko.observable(object.valueOf());
}

var crmAPI = (function () {
    var getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) {
                try {
                    return JSON.parse(c.substring(name.length, c.length));
                }
                catch (e) {
                    return c.substring(name.length, c.length);
                }
            }
        }
        return {};
    };

    var setCookie = function (key, keyvalue, value) {
        var cookieObj;
        try {
            cookieObj = JSON.parse(getCookie(key));
        } catch (e) {
            cookieObj = getCookie(key) || {}
        }
        if (value) cookieObj[keyvalue] = value;
        else cookieObj = keyvalue;
        document.cookie = key + "=" + JSON.stringify(cookieObj);
    };

    var getData = function (callType, path, sendData, onsuccess, onerror, before) {
        var baseURL = "http://crmapitest.kociletisim.com.tr/api/Adsl/";
        //var baseURL = "http://localhost:50752/api/Adsl/";
        $.ajax({
            method: callType,
            url: baseURL + path,
            data: JSON.stringify(sendData),
            contentType: "application/json",
            async: true,
            beforeSend: function (xhr) {
                if (sendData && sendData.username) {
                    xhr.setRequestHeader("X-KOC-UserName", sendData.username);
                    xhr.setRequestHeader("X-KOC-Pass", sendData.password);
                    xhr.setRequestHeader("X-KOC-UserType", sendData.userType);
                } else {
                    var x = document.cookie;

                    var token = getCookie("token");
                    xhr.setRequestHeader("X-KOC-Token", token);
                }

                if (before) before();
            }
        }).success(function (data, status, xhr) {
            if (sendData && sendData.username) {
                var token = xhr.getResponseHeader("X-KOC-Token"); // Cooki'ye yaz
                document.cookie = "token=" + token;
                if (!token)
                    alert("Kullanıcı Bilgileri Hatalı");
            } else {
                if (data.loginError)
                    window.location.href = "index.html"; // hata var token geçersiz ,login sayfasına yönlendir. Ama önce süreli bir ekranda hata görünsün.
            }
            if (onsuccess) onsuccess(data);
        }).fail(function (xhr, status, error) {
            if (onerror)
                onerror(error);
        });
    }
    return {
        getCookie: function (key) { return getCookie(key); },
        setCookie: function (key, keyvalue, value) { setCookie(key, keyvalue, value); },
        login: function (data, onsuccess, onerror, before) {
            getData("POST", "Authorize/getToken", data, onsuccess, onerror, before);
        },
        userInfo: function (onsuccess, onerror, before) {
            getData("POST", "Authorize/getUserInfo", {}, onsuccess, onerror, before);
        },
        getTaskqueuesForBayi: function (data, onsuccess, onerror, before) {
            getData("POST", "TaskQueues/getTaskqueuesForBayi", data, onsuccess, onerror, before);
        },
    }
})();