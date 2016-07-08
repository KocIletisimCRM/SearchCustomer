/// <reference path="crmApi.js" />
/// <reference path="knockout-3.4.0.js" />

$(document).ready(function () {
    crmAPI.userInfo(function (a, b, c) {
        if (a != null && a.userId != 0 && dataModel && dataModel.renderBindings) {
            ko.cleanNode("ModalContainer");
            dataModel.renderBindings();
        }
    }, null, null);
});

var dataModel = {
    user: ko.observable(),
    getUser: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
        }, null, null);
    },
    renderBindings: function () {
        var self = this;
        self.getUser();
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
};

$("#exit").click(function () {
    document.cookie = "token=;";
    crmAPI.setCookie("tqlFilter", "");
    window.location.href = "index.html";

});